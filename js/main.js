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
});