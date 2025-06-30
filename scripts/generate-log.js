const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Coddy is observing the loop...");

const logbookPath = path.join(__dirname, '..', 'data', 'logbook.json');

try {
    // 1. Get the latest commit message
    const commitMessage = execSync('git log -1 --pretty=%s').toString().trim();
    console.log(`> Detected commit: "${commitMessage}"`);

    // 2. Simulate Gemini generating a log entry
    //    In a real implementation, you would call the Gemini API here.
    const geminiAnalysis = `Analysis complete. The latest loop cycle, titled '${commitMessage}', has been integrated. This modification primarily impacted the portal's interactive layer, enhancing the user's connection to the core ritual. The changes have been deemed stable and aligned with the current phase of the roadmap.`;
    console.log("> Gemini analysis simulation complete.");

    // 3. Create the new log entry
    const newLogEntry = {
        date: new Date().toISOString().split('T')[0],
        title: commitMessage,
        entry: geminiAnalysis
    };

    // 4. Read the existing logbook, add the new entry, and write it back
    const logbook = JSON.parse(fs.readFileSync(logbookPath, 'utf-8'));
    
    // Prevent duplicate entries for the same commit
    if (logbook.length > 0 && logbook[0].title === newLogEntry.title) {
        console.log("> Log entry for this commit already exists. The loop remains stable.");
        return;
    }

    logbook.unshift(newLogEntry); // Add the new entry to the top

    fs.writeFileSync(logbookPath, JSON.stringify(logbook, null, 2));

    console.log("✅ Coddy's Logbook has been updated.");

} catch (error) {
    console.error("❌ Error during log generation ritual:", error.message);
    console.error("Ensure you are in a git repository and have made at least one commit.");
}