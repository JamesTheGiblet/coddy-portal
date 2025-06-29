document.addEventListener('DOMContentLoaded', () => {
    // --- Weird Mode Toggle ---
    const weirdModeToggle = document.getElementById('weird-mode-toggle');
    if (weirdModeToggle) {
        weirdModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('weird-mode-active');
            
            // Update button text for better UX
            const isWeird = document.body.classList.contains('weird-mode-active');
            weirdModeToggle.textContent = isWeird ? 'Exit Weird Mode' : 'Enter Weird Mode';
        });
    }
});