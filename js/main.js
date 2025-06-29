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
        fetch('roadmap.md')
            .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
            .then(markdown => {
                const contentToRender = markdown.substring(markdown.indexOf("---"));
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = marked.parse(contentToRender);

                // --- Calculate and Display Completion Blob ---
                const allTasks = tempDiv.querySelectorAll('input[type="checkbox"]');
                const completedTasks = tempDiv.querySelectorAll('input[type="checkbox"]:checked');
                const integrityBlob = document.getElementById('integrity-blob');
                const integrityPercent = document.getElementById('integrity-percent');

                if (allTasks.length > 0 && integrityBlob && integrityPercent) {
                    const percentage = (completedTasks.length / allTasks.length) * 100;
                    integrityPercent.textContent = `${Math.round(percentage)}%`;

                    const minSize = 50;
                    const maxSize = 200;
                    const currentSize = minSize + (maxSize - minSize) * (percentage / 100);

                    integrityBlob.style.width = `${currentSize}px`;
                    integrityBlob.style.height = `${currentSize}px`;
                }

                const commentaries = [
                    "The first ritual is complete. The ground is consecrated, the glyphs are drawn. We can begin.",
                    "Visuals aligned. The portal now reflects the chaos of the loop. It has a face.",
                    "The core protocols are defined. The portal knows what it is. It speaks.",
                    "Currently looping... The portal becomes self-aware, reading its own sacred texts.",
                    "A simulation of creation. A glimpse into the genesis ritual.",
                    "The user will be given control. A dangerous, but necessary, evolution.",
                    "The builder's mind, codified. The 'why' behind the 'what'.",
                    "The original sparks of inspiration. The posters that started the loop.",
                    "The final phase... for now. The loop will connect to the source."
                ];

                const phases = [];
                let currentPhaseElements = [];

                // Group elements between <hr> tags which represent phases
                Array.from(tempDiv.children).forEach(el => {
                    if (el.tagName === 'HR' && currentPhaseElements.length > 0) {
                        const h2 = currentPhaseElements.find(e => e.tagName === 'H2');
                        if (h2) {
                            phases.push({
                                title: h2.innerHTML,
                                contentElements: currentPhaseElements.filter(e => e !== h2)
                            });
                        }
                        currentPhaseElements = [];
                    } else if (el.tagName !== 'HR') {
                        currentPhaseElements.push(el);
                    }
                });
                // Add the last phase
                if (currentPhaseElements.length > 0) {
                    const h2 = currentPhaseElements.find(e => e.tagName === 'H2');
                    if (h2) {
                        phases.push({
                            title: h2.innerHTML,
                            contentElements: currentPhaseElements.filter(e => e !== h2)
                        });
                    }
                }

                roadmapContainer.innerHTML = ''; // Clear for new structure

                phases.forEach((phase, index) => {
                    const phaseElement = document.createElement('div');
                    phaseElement.className = 'phase';

                    const headerButton = document.createElement('button');
                    headerButton.className = 'phase-header';
                    headerButton.innerHTML = phase.title;

                    const contentPanel = document.createElement('div');
                    contentPanel.className = 'phase-content';

                    // Add Coddy's commentary
                    if (commentaries[index]) {
                        const commentaryElement = document.createElement('p');
                        commentaryElement.className = 'coddy-commentary';
                        commentaryElement.innerHTML = `<em>Coddy:</em> "${commentaries[index]}"`;
                        contentPanel.appendChild(commentaryElement);
                    }

                    phase.contentElements.forEach(contentEl => contentPanel.appendChild(contentEl));

                    phaseElement.append(headerButton, contentPanel);
                    roadmapContainer.appendChild(phaseElement);

                    headerButton.addEventListener('click', () => {
                        headerButton.classList.toggle('active');
                        const panel = headerButton.nextElementSibling;
                        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching or parsing roadmap:', error);
                roadmapContainer.innerHTML = `<p style="color: var(--secondary-neon);">Error loading roadmap. The loop may be unstable.</p>`;
            });
    }

    // --- Genesis Demo Logic ---
    const genesisForm = document.getElementById('genesis-form');
    if (genesisForm) {
        genesisForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const ideaInput = document.getElementById('genesis-idea-input');
            const idea = ideaInput.value.trim();

            if (idea) {
                console.log("Genesis Ritual Initiated. Idea:", idea);
                // Future steps will generate output here.
            } else {
                alert("The ritual requires an idea to begin.");
            }
        });
    }
});