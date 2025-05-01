document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlight
    const navLinks = document.querySelectorAll('.nav-link');
    const navHighlight = document.querySelector('.nav-highlight');
    
    function updateNavHighlight(link) {
        const linkRect = link.getBoundingClientRect();
        const navRect = document.querySelector('.sticky-nav').getBoundingClientRect();
        
        navHighlight.style.width = `${linkRect.width}px`;
        navHighlight.style.left = `${linkRect.left - navRect.left}px`;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            updateNavHighlight(link);
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update highlight position after scroll
            setTimeout(() => {
                updateNavHighlight(link);
            }, 500);
        });
    });
    
    // Set initial highlight position
    if (navLinks.length > 0) {
        updateNavHighlight(navLinks[0]);
    }
    
    // Gestalt Principle Demo
    const gestaltBtn = document.getElementById('gestaltBtn');
    const gestaltCircle = document.getElementById('gestaltCircle');
    const gestaltSquare = document.getElementById('gestaltSquare');
    const gestaltTriangle = document.getElementById('gestaltTriangle');
    
    gestaltBtn.addEventListener('click', function() {
        if (gestaltCircle.style.transform === 'scale(0.8)') {
            // Reset to original positions
            gestaltCircle.style.transform = 'scale(1)';
            gestaltSquare.style.transform = 'scale(1)';
            gestaltTriangle.style.transform = 'scale(1)';
            gestaltCircle.style.opacity = '1';
            gestaltSquare.style.opacity = '1';
            gestaltTriangle.style.opacity = '1';
            gestaltBtn.textContent = 'Animate Principle';
        } else {
            // Demonstrate Gestalt principles
            gestaltCircle.style.transform = 'scale(0.8)';
            gestaltSquare.style.transform = 'scale(0.8)';
            gestaltTriangle.style.transform = 'scale(0.8)';
            
            // Create closure effect
            setTimeout(() => {
                gestaltCircle.style.opacity = '0.5';
                gestaltSquare.style.opacity = '0.5';
                gestaltTriangle.style.opacity = '0.5';
                
                // Create similarity effect
                gestaltCircle.style.backgroundColor = 'var(--primary)';
                gestaltSquare.style.backgroundColor = 'var(--primary)';
                gestaltTriangle.style.borderBottomColor = 'var(--primary)';
            }, 500);
            
            gestaltBtn.textContent = 'Reset Demo';
        }
    });
    
    // Contrast Principle Demo
    const contrastBtn = document.getElementById('contrastBtn');
    const contrastDemo = document.getElementById('contrastDemo');
    const contrastElements = document.querySelectorAll('.contrast-element');
    
    contrastBtn.addEventListener('click', function() {
        if (contrastElements[0].style.filter === 'brightness(1.5)') {
            // Reset contrast
            contrastElements.forEach(el => {
                el.style.filter = 'brightness(1)';
                el.style.boxShadow = 'none';
            });
            contrastBtn.textContent = 'Toggle Contrast';
        } else {
            // Increase contrast
            contrastElements.forEach((el, index) => {
                el.style.filter = 'brightness(1.5)';
                el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
                
                // Add different transformations to show contrast
                if (index === 0) el.style.transform = 'translateY(-10px)';
                if (index === 1) el.style.transform = 'scale(1.05)';
                if (index === 2) el.style.transform = 'rotate(5deg)';
            });
            contrastBtn.textContent = 'Reduce Contrast';
        }
    });
    
    // Balance Principle Demo
    const balanceBtn = document.getElementById('balanceBtn');
    const balanceDemo = document.getElementById('balanceDemo');
    const balanceLeft = document.querySelector('.balance-left');
    const balanceRight = document.querySelector('.balance-right');
    
    balanceBtn.addEventListener('click', function() {
        if (balanceDemo.dataset.state === 'asymmetrical') {
            // Reset to symmetrical balance
            balanceLeft.style.flex = '1';
            balanceRight.style.flex = '1';
            balanceLeft.querySelector('::after').style.transform = 'scale(1)';
            balanceRight.querySelector('::after').style.transform = 'scale(1)';
            balanceDemo.dataset.state = 'symmetrical';
            balanceBtn.textContent = 'Adjust Balance';
        } else if (balanceDemo.dataset.state === 'symmetrical') {
            // Show asymmetrical balance
            balanceLeft.style.flex = '0.7';
            balanceRight.style.flex = '1.3';
            balanceLeft.querySelector('::after').style.transform = 'scale(0.8)';
            balanceRight.querySelector('::after').style.transform = 'scale(1.2)';
            balanceDemo.dataset.state = 'asymmetrical';
            balanceBtn.textContent = 'Show Radial Balance';
        } else {
            // Initial state - show symmetrical balance
            balanceDemo.dataset.state = 'symmetrical';
            balanceBtn.textContent = 'Adjust Balance';
        }
    });
    
    // Hierarchy Principle Demo
    const hierarchyBtn = document.getElementById('hierarchyBtn');
    const hierarchyDemo = document.getElementById('hierarchyDemo');
    const hierarchyElements = document.querySelectorAll('.hierarchy-element');
    
    hierarchyBtn.addEventListener('click', function() {
        if (hierarchyDemo.dataset.state === 'active') {
            // Reset hierarchy
            hierarchyElements.forEach(el => {
                el.style.transform = 'scale(1)';
                el.style.boxShadow = 'none';
            });
            hierarchyDemo.dataset.state = '';
            hierarchyBtn.textContent = 'Show Eye Flow';
        } else {
            // Show visual hierarchy
            hierarchyElements[0].style.transform = 'scale(1.1)';
            hierarchyElements[0].style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            
            hierarchyElements[1].style.transform = 'scale(1.05)';
            hierarchyElements[1].style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
            
            hierarchyElements[2].style.transform = 'scale(1)';
            hierarchyElements[2].style.boxShadow = 'none';
            
            // Create eye flow animation
            createEyeFlowAnimation();
            
            hierarchyDemo.dataset.state = 'active';
            hierarchyBtn.textContent = 'Reset Demo';
        }
    });
    
    function createEyeFlowAnimation() {
        const eyeFlow = document.createElement('div');
        eyeFlow.className = 'eye-flow';
        eyeFlow.innerHTML = `
            <svg viewBox="0 0 200 100" width="100%" height="60px">
                <path d="M10,50 Q50,10 90,50 T170,50" stroke="var(--primary)" fill="none" stroke-width="2" stroke-dasharray="5,3"/>
                <circle cx="10" cy="50" r="5" fill="var(--primary)">
                    <animateMotion path="M10,50 Q50,10 90,50 T170,50" dur="3s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        hierarchyDemo.appendChild(eyeFlow);
        
        // Remove previous eye flow if exists
        setTimeout(() => {
            const oldEyeFlow = document.querySelector('.eye-flow:not(:last-child)');
            if (oldEyeFlow) oldEyeFlow.remove();
        }, 10);
    }
    
    // Alignment Principle Demo
    const alignmentBtn = document.getElementById('alignmentBtn');
    const alignmentDemo = document.getElementById('alignmentDemo');
    const alignmentElements = document.querySelectorAll('.alignment-element');
    
    alignmentBtn.addEventListener('click', function() {
        if (alignmentDemo.dataset.state === 'aligned') {
            // Misalign elements
            alignmentElements[0].style.marginLeft = '0';
            alignmentElements[1].style.marginLeft = '20px';
            alignmentElements[2].style.marginLeft = '40px';
            alignmentDemo.dataset.state = 'misaligned';
            alignmentBtn.textContent = 'Align Elements';
        } else {
            // Align elements
            alignmentElements.forEach(el => {
                el.style.marginLeft = '0';
            });
            alignmentDemo.dataset.state = 'aligned';
            alignmentBtn.textContent = 'Misalign Elements';
        }
    });
    
    // Repetition Principle Demo
    const repetitionBtn = document.getElementById('repetitionBtn');
    const repetitionDemo = document.getElementById('repetitionDemo');
    
    repetitionBtn.addEventListener('click', function() {
        if (repetitionDemo.dataset.state === 'pattern') {
            // Clear the pattern
            repetitionDemo.innerHTML = '';
            repetitionDemo.dataset.state = '';
            repetitionBtn.textContent = 'Create Pattern';
        } else {
            // Create a repeating pattern
            repetitionDemo.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const box = document.createElement('div');
                box.style.backgroundColor = `hsl(${i * 30}, 70%, 60%)`;
                box.style.transform = `rotate(${i * 5}deg)`;
                repetitionDemo.appendChild(box);
            }
            repetitionDemo.dataset.state = 'pattern';
            repetitionBtn.textContent = 'Clear Pattern';
        }
    });
    
    // Proximity Principle Demo
    const proximityBtn = document.getElementById('proximityBtn');
    const proximityDemo = document.getElementById('proximityDemo');
    const proximityGroups = document.querySelectorAll('.proximity-group');
    
    proximityBtn.addEventListener('click', function() {
        if (proximityDemo.dataset.state === 'grouped') {
            // Spread out elements
            proximityGroups[0].style.gap = '1rem';
            proximityGroups[1].style.gap = '1rem';
            proximityDemo.dataset.state = 'spread';
            proximityBtn.textContent = 'Group Elements';
        } else {
            // Group elements closely
            proximityGroups[0].style.gap = '0.2rem';
            proximityGroups[1].style.gap = '0.2rem';
            proximityDemo.dataset.state = 'grouped';
            proximityBtn.textContent = 'Spread Elements';
        }
    });
    
    // Color Theory Demo
    const colorBtn = document.getElementById('colorBtn');
    const colorDemo = document.getElementById('colorDemo');
    const paletteColors = document.querySelectorAll('.palette-color');
    const harmonyBtns = document.querySelectorAll('.harmony-btn');
    
    colorBtn.addEventListener('click', generateRandomPalette);
    
    harmonyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const harmonyType = this.dataset.harmony;
            generateHarmonyPalette(harmonyType);
        });
    });
    
    function generateRandomPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        
        // Generate different color harmonies randomly
        const harmonyTypes = ['analogous', 'complementary', 'triadic', 'monochromatic'];
        const randomHarmony = harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];
        
        generateHarmonyPalette(randomHarmony);
    }
    
    function generateHarmonyPalette(harmonyType) {
        const baseHue = Math.floor(Math.random() * 360);
        let colors = [];
        
        switch(harmonyType) {
            case 'analogous':
                colors = [
                    `hsl(${(baseHue - 30) % 360}, 70%, 50%)`,
                    `hsl(${baseHue}, 70%, 50%)`,
                    `hsl(${(baseHue + 30) % 360}, 70%, 50%)`
                ];
                break;
            case 'complementary':
                colors = [
                    `hsl(${baseHue}, 70%, 50%)`,
                    `hsl(${(baseHue + 180) % 360}, 70%, 50%)`,
                    `hsl(${baseHue}, 70%, 70%)`
                ];
                break;
            case 'triadic':
                colors = [
                    `hsl(${baseHue}, 70%, 50%)`,
                    `hsl(${(baseHue + 120) % 360}, 70%, 50%)`,
                    `hsl(${(baseHue + 240) % 360}, 70%, 50%)`
                ];
                break;
            case 'monochromatic':
                colors = [
                    `hsl(${baseHue}, 70%, 30%)`,
                    `hsl(${baseHue}, 70%, 50%)`,
                    `hsl(${baseHue}, 70%, 70%)`
                ];
                break;
        }
        
        // Apply colors to palette
        paletteColors.forEach((colorEl, index) => {
            colorEl.style.backgroundColor = colors[index % colors.length];
            colorEl.style.transition = 'background-color 0.5s ease';
        });
        
        // Update active harmony button
        harmonyBtns.forEach(btn => {
            btn.style.backgroundColor = btn.dataset.harmony === harmonyType ? 
                'rgba(67, 97, 238, 0.3)' : 'rgba(67, 97, 238, 0.1)';
        });
    }
    
    // Generate initial palette
    generateRandomPalette();
    
    // Color Wheel Interaction
    const colorWheel = document.getElementById('colorWheel');
    const colorPsychology = document.getElementById('colorPsychology');
    
    colorWheel.addEventListener('click', function() {
        colorPsychology.style.display = colorPsychology.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close color psychology when clicking outside
    document.addEventListener('click', function(e) {
        if (!colorWheel.contains(e.target) && !colorPsychology.contains(e.target)) {
            colorPsychology.style.display = 'none';
        }
    });
    
    // Generate random color psychology info
    function updateColorPsychology() {
        const colors = [
            { name: 'Red', meaning: 'Energy, passion, danger', effect: 'Increases heart rate and creates a sense of urgency' },
            { name: 'Orange', meaning: 'Creativity, enthusiasm, warmth', effect: 'Stimulates activity and appetite' },
            { name: 'Yellow', meaning: 'Happiness, optimism, caution', effect: 'Grabs attention but can cause eye strain' },
            { name: 'Green', meaning: 'Growth, health, environment', effect: 'Most restful color for the eyes' },
            { name: 'Blue', meaning: 'Trust, calm, professionalism', effect: 'Lowers blood pressure and heart rate' },
            { name: 'Purple', meaning: 'Royalty, luxury, spirituality', effect: 'Often associated with creativity and wisdom' },
            { name: 'Pink', meaning: 'Romance, femininity, calm', effect: 'Has a tranquilizing effect' },
            { name: 'Brown', meaning: 'Earth, stability, reliability', effect: 'Creates a sense of warmth and comfort' },
            { name: 'Black', meaning: 'Power, elegance, mystery', effect: 'Can feel oppressive in large amounts' },
            { name: 'White', meaning: 'Purity, cleanliness, simplicity', effect: 'Creates a sense of space and freshness' }
        ];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        colorPsychology.innerHTML = `
            <h4>${randomColor.name} Color Psychology</h4>
            <p><strong>Meaning:</strong> ${randomColor.meaning}</p>
            <p><strong>Psychological Effect:</strong> ${randomColor.effect}</p>
        `;
    }
    
    // Update color psychology on wheel click
    colorWheel.addEventListener('click', updateColorPsychology);
    
    // Initial update
    updateColorPsychology();
    
    // Scroll animations
    const principleSections = document.querySelectorAll('.principle-section');
    
    function checkScroll() {
        principleSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial states
    principleSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });
    
    // Check on scroll and on load
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    
    // Initial check
    checkScroll();
});