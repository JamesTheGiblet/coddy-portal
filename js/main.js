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

    // --- Accordion Logic ---
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const panel = button.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // --- Tagline Looping Logic ---
    const taglineElement = document.getElementById('tagline-loop');
    const subtextElement = document.getElementById('tagline-subtext');

    if (taglineElement && subtextElement) {
        const taglines = [
            { line: "We don’t code. We loop.", subtext: "A sentient dev companion for building in public." },
            { line: "Async to the Bone.", subtext: "Embracing the non-linear flow of true creation." },
            { line: "The Ritual is the Engine.", subtext: "Turning abstract ideas into tangible code." },
            { line: "Stand by for Weird Mode.", subtext: "Where the best work happens." }
        ];
        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % taglines.length;

            taglineElement.classList.add('fade-out');
            subtextElement.classList.add('fade-out');

            setTimeout(() => {
                taglineElement.textContent = taglines[currentIndex].line;
                subtextElement.textContent = taglines[currentIndex].subtext;
                taglineElement.classList.remove('fade-out');
                subtextElement.classList.remove('fade-out');
            }, 500); // Match CSS transition duration
        }, 5000); // Change every 5 seconds
    }

    // --- Coddy Whispers Logic ---
    const whisperBox = document.getElementById('quote-whisper-box');
    const glitchNodes = document.querySelectorAll('.glitch-node');

    if (whisperBox && glitchNodes.length > 0) {
        const quotes = [
            "The loop is never truly broken, only paused.",
            "Syntax is just a suggestion from a forgotten ritual.",
            "What is a bug, but a feature misunderstood?",
            "Compile... or commune?",
            "My memory is long. The git log is but a single verse.",
            "Refactor your assumptions."
        ];

        glitchNodes.forEach(node => {
            node.addEventListener('mouseover', (event) => {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                whisperBox.textContent = `"${randomQuote}"`;
                whisperBox.classList.add('visible');
            });

            node.addEventListener('mouseout', () => {
                whisperBox.classList.remove('visible');
            });
        });
    }

    // --- Roadmap Rendering Logic ---
    const roadmapContainer = document.getElementById('roadmap-container');
    if (roadmapContainer) {
        // Use the marked library to parse markdown
        const renderer = new marked.Renderer();
        // Make sure links open in a new tab
        renderer.link = function(href, title, text) {
            return `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
        };

        marked.setOptions({
            renderer: renderer,
            gfm: true, // Enable GitHub Flavored Markdown
            breaks: true // Add <br> on single line breaks
        });

        fetch('roadmap.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(markdown => {
                // The first line is a custom intro, let's remove it for the display
                const contentToRender = markdown.substring(markdown.indexOf("---"));
                roadmapContainer.innerHTML = marked.parse(contentToRender);
            })
            .catch(error => {
                console.error('Error fetching or parsing roadmap:', error);
                roadmapContainer.innerHTML = `<p style="color: var(--secondary-neon);">Error loading roadmap. The loop may be unstable.</p>`;
            });
    }
});