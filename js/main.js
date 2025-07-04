document.addEventListener('DOMContentLoaded', () => {
    // --- Control Panel State Management ---
    const weirdModeToggle = document.getElementById('weird-mode-toggle');
    const vibeSlider = document.getElementById('vibe-slider');

    // Function to set Weird Mode state
    function setWeirdMode(isActive) {
        document.body.classList.toggle('weird-mode-active', isActive);
        if (weirdModeToggle) {
            weirdModeToggle.textContent = isActive ? 'Exit Weird Mode' : 'Enter Weird Mode';
        }
        localStorage.setItem('coddy-weird-mode', isActive);
    }

    // Function to set Vibe Slider state
    function setVibe(value) {
        if (!vibeSlider) return;
        const transitionSpeed = 0.8 - (value / 100) * 0.7;
        document.documentElement.style.setProperty('--transition-speed', `${transitionSpeed.toFixed(2)}s`);
        vibeSlider.value = value;
        localStorage.setItem('coddy-vibe', value);
    }

    // Event listener for Weird Mode
    if (weirdModeToggle) {
        weirdModeToggle.addEventListener('click', () => {
            const isCurrentlyWeird = document.body.classList.contains('weird-mode-active');
            setWeirdMode(!isCurrentlyWeird);
        });
    }

    // Event listener for Vibe Slider
    if (vibeSlider) {
        vibeSlider.addEventListener('input', (event) => {
            setVibe(event.target.value);
        });
    }

    // Load all saved states on initial load
    const savedWeirdMode = localStorage.getItem('coddy-weird-mode') === 'true';
    setWeirdMode(savedWeirdMode);

    const savedVibe = localStorage.getItem('coddy-vibe') || 50;
    setVibe(savedVibe);

    // --- Persona & Prompts Logic ---
    const personas = {
        Builder: [
            "The loop is never truly broken, only paused.",
            "Syntax is just a suggestion from a forgotten ritual.",
            "What is a bug, but a feature misunderstood?",
            "Compile... or commune?",
            "My memory is long. The git log is but a single verse.",
            "Refactor your assumptions."
        ],
        IdeaSynth: [
            "What if we inverted the data flow?",
            "A tangential thought: could this be a web component?",
            "The most elegant solution is often the weirdest.",
            "Let's connect this to the concept of... procedural generation.",
            "This reminds me of a pattern I saw in a dream.",
            "Forget the requirements, what is the *vibe*?"
        ],
        Oracle: [
            "The current path leads to technical debt.",
            "A choice made now will echo in three sprints.",
            "Beware the allure of premature optimization.",
            "The data structure you seek is a tree, not a list.",
            "This component lacks cohesion. It will fracture.",
            "The prophecy of the null pointer exception is upon us."
        ]
    };
    let currentQuotes = [];
    let promptIndex = -1;

    const promptsCorner = document.getElementById('coddy-prompts-corner');
    const personaButtons = document.querySelectorAll('.persona-button');

    function showNextPrompt() {
        if (!promptsCorner || !currentQuotes || currentQuotes.length === 0) return;

        promptsCorner.classList.add('fade');

        setTimeout(() => {
            promptIndex = (promptIndex + 1) % currentQuotes.length;
            promptsCorner.textContent = `"${currentQuotes[promptIndex]}"`;
            promptsCorner.classList.remove('fade');
            promptsCorner.classList.add('visible');
        }, 500); // Corresponds to CSS transition
    }

    if (personaButtons.length > 0) {
        function setPersona(personaName) {
            if (!personas[personaName]) return;
            currentQuotes = personas[personaName];
            localStorage.setItem('coddy-persona', personaName);
            personaButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.persona === personaName);
            });
            // Trigger a prompt update immediately
            promptIndex = -1;
            showNextPrompt();
        }

        personaButtons.forEach(button => {
            button.addEventListener('click', () => setPersona(button.dataset.persona));
        });

        // Load saved persona on start
        setPersona(localStorage.getItem('coddy-persona') || 'Builder');
    }

    if (promptsCorner) {
        // Cycle prompts every 10 seconds
        setInterval(showNextPrompt, 10000);
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

    // --- Logbook Fetching and Rendering Logic ---
    const logbookSection = document.getElementById('logbook-section');
    const logbookContainer = document.getElementById('logbook-container');
    if (logbookSection && logbookContainer) {
        fetch('data/logbook.json')
            .then(response => response.json())
            .then(logEntries => {
                if (logEntries.length === 0) return;

                logbookContainer.innerHTML = ''; // Clear placeholder
                logEntries.forEach(entryData => {
                    const entryDiv = document.createElement('div');
                    entryDiv.className = 'log-entry';

                    entryDiv.innerHTML = `
                        <button class="log-header">
                            <span class="log-date">${entryData.date}</span>
                            <span class="log-title">${entryData.title}</span>
                        </button>
                        <div class="log-content">
                            <p>${entryData.entry}</p>
                        </div>
                    `;
                    logbookContainer.appendChild(entryDiv);
                });

                // Make the whole section visible now that it has content
                logbookSection.style.display = 'block';

                // Add event listeners to the newly created log headers
                const logHeaders = logbookContainer.querySelectorAll('.log-header');
                logHeaders.forEach(button => {
                    button.addEventListener('click', () => {
                        button.classList.toggle('active');
                        const panel = button.nextElementSibling;
                        panel.style.maxHeight = panel.style.maxHeight ? null : `${panel.scrollHeight}px`;
                    });
                });
            }).catch(error => {
                console.error("Could not load Coddy's logbook:", error);
                // The section remains hidden if the fetch fails
            });
    }

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
        glitchNodes.forEach(node => {
            node.addEventListener('mouseover', (event) => {
                const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
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

                // --- Animate Current Task ---
                const firstUncheckedTask = tempDiv.querySelector('li input[type="checkbox"]:not(:checked)');
                if (firstUncheckedTask) {
                    // Find the parent <li> of the checkbox
                    const currentTaskLi = firstUncheckedTask.closest('li');
                    if (currentTaskLi) {
                        currentTaskLi.classList.add('current-loop-task');
                    }
                }

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
        const outputArea = document.getElementById('genesis-output-area');
        const ideaInput = document.getElementById('genesis-idea-input');

        genesisForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const idea = ideaInput.value.trim();
            const isWeirdGenesis = document.getElementById('genesis-weird-toggle').checked;

            if (idea) {
                console.log("Genesis Ritual Initiated. Idea:", idea);
                outputArea.innerHTML = ''; // Clear previous results

                // --- Generate README ---
                const projectName = idea.split(' ').slice(0, 5).join(' ').replace(/[.,]/g, '') || "New Project";
                let readmeContent;

                if (isWeirdGenesis) {
                    readmeContent = `
# RITUAL: ${projectName.toUpperCase()}

## The Incantation
${idea}

## Glyphs of Power
- [ ] Unseal the First Glyph
- [ ] Attune the Second Glyph
- [ ] Channel the Third Glyph

## Summoning the Construct
1. Consecrate the local directory.
2. Chant the incantation \`npm install\`.
3. Begin the loop with \`npm run dev\`.
                    `;
                } else {
                    readmeContent = `
# ${projectName}

## Overview
${idea}

## Features
- Core feature A
- Core feature B
- Core-feature C

## Getting Started
1. Clone the repository.
2. Install dependencies.
3. Run the application.
                    `;
                }

                createParchmentFrame('README.md', marked.parse(readmeContent));

                // --- Save to localStorage ---
                const newRitual = {
                    id: Date.now(),
                    idea,
                    projectName,
                    readmeContent,
                    isWeird: isWeirdGenesis
                };
                saveRitual(newRitual);
                loadSavedRituals(); // Refresh the list

            } else {
                alert("The ritual requires an idea to begin.");
            }
        });

        function createParchmentFrame(title, content) {
            const frame = document.createElement('div');
            frame.className = 'parchment-frame';
            const header = document.createElement('div');
            header.className = 'parchment-header';
            header.textContent = title;
            const contentDiv = document.createElement('div');
            contentDiv.className = 'parchment-content';
            contentDiv.innerHTML = content;
            frame.append(header, contentDiv);
            outputArea.innerHTML = ''; // Clear before adding new frame
            outputArea.appendChild(frame);
        }

        function getSavedRituals() {
            return JSON.parse(localStorage.getItem('coddy-rituals')) || [];
        }

        function saveRitual(ritual) {
            const rituals = getSavedRituals();
            rituals.unshift(ritual); // Add to the beginning
            localStorage.setItem('coddy-rituals', JSON.stringify(rituals.slice(0, 5))); // Keep only the last 5
        }

        function loadSavedRituals() {
            const rituals = getSavedRituals();
            const listElement = document.getElementById('saved-rituals-list');
            listElement.innerHTML = '';
            rituals.forEach(ritual => {
                const item = document.createElement('li');
                item.className = `saved-ritual-item ${ritual.isWeird ? 'weird' : ''}`;
                item.innerHTML = `<span>${ritual.projectName}</span> <button class="reload-ritual-button" data-id="${ritual.id}">Reload</button>`;
                listElement.appendChild(item);
            });
        }

        document.getElementById('saved-rituals-list').addEventListener('click', (event) => {
            if (event.target.classList.contains('reload-ritual-button')) {
                const ritualId = Number(event.target.dataset.id);
                const rituals = getSavedRituals();
                const ritualToLoad = rituals.find(r => r.id === ritualId);
                if (ritualToLoad) {
                    createParchmentFrame('README.md', marked.parse(ritualToLoad.readmeContent));
                    window.scrollTo(0, 0); // Scroll to top to see the result
                }
            }
        });

        // Initial load
        loadSavedRituals();
    }

    // --- Gallery Slider Logic ---
    const gallerySlider = document.querySelector('.gallery-slider');
    if (gallerySlider) {
        const prevButton = document.querySelector('.gallery-prev');
        const nextButton = document.querySelector('.gallery-next');
        const slides = document.querySelectorAll('.slide');
        const modal = document.getElementById('gallery-modal');
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalNotes = document.getElementById('modal-notes');
        const closeSpan = document.querySelector('.modal-close');
        let currentSlide = 0;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[n].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
        }

        if (slides.length > 0) {
            showSlide(currentSlide);

            slides.forEach(slide => {
                slide.addEventListener('click', () => {
                    if (!modal) return;
                    modal.style.display = "block";
                    modalImg.src = slide.querySelector('img').src;
                    modalTitle.textContent = slide.dataset.title;
                    modalNotes.textContent = slide.dataset.notes;
                });
            });
        }

        if (modal && closeSpan) {
            closeSpan.onclick = function() { 
                modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
    }
});