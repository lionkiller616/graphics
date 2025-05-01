document.addEventListener('DOMContentLoaded', function() {
    // Theme Switching
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            document.documentElement.setAttribute('data-theme', this.dataset.theme);
            
            // Animate theme change
            document.documentElement.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 500);
        });
    });
    
    // Generate shape grid
    const shapeGrid = document.querySelector('.shape-grid');
    const shapes = ['circle', 'square', 'triangle', 'rectangle', 'pentagon', 'hexagon', 'star', 'heart', 'diamond'];
    
    shapes.forEach((shape, index) => {
        const shapeItem = document.createElement('div');
        shapeItem.className = 'shape-item';
        
        const shapeElement = document.createElement('div');
        shapeElement.className = `grid-shape ${shape}`;
        
        // Add different animations based on index
        shapeElement.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
        
        shapeItem.appendChild(shapeElement);
        shapeGrid.appendChild(shapeItem);
        
        // Create the actual shape with CSS
        createShape(shapeElement, shape);
    });
    
    // Navigation between sections
    const navShapes = document.querySelectorAll('.nav-shape');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('main > section');
    
    function setActiveSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Animate transition
        document.querySelector('.active').style.animation = 'fadeInUp 0.5s ease-out';
    }
    
    navShapes.forEach(shape => {
        shape.addEventListener('click', function() {
            setActiveSection(this.dataset.section);
        });
    });
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            setActiveSection(this.dataset.card);
        });
    });
    
    // CTA Button
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        setActiveSection('meaning');
        
        // Add click animation
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 500);
    });
    
    // Create floating animation for elements
    function addFloatingAnimation(elements) {
        elements.forEach((el, i) => {
            const duration = 3 + Math.random() * 3;
            const delay = Math.random() * 5;
            el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    }
    
    // Apply to all shape elements
    const allShapes = document.querySelectorAll('.logo-shape, .nav-shape, .card-shape, .footer-shape');
    addFloatingAnimation(allShapes);
    
    // Add hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .card, .nav-shape, .shape-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = el.style.transform || 'scale(1.05)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
    
    // Initialize sections
    initializeMeaningSection();
    initializeBrandingSection();
    initializePsychologySection();
});

function createShape(element, shapeType) {
    switch(shapeType) {
        case 'circle':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.borderRadius = '50%';
            element.style.backgroundColor = 'var(--primary-color)';
            break;
        case 'square':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.backgroundColor = 'var(--accent-color)';
            break;
        case 'triangle':
            element.style.width = '0';
            element.style.height = '0';
            element.style.borderLeft = '35px solid transparent';
            element.style.borderRight = '35px solid transparent';
            element.style.borderBottom = '60px solid var(--secondary-color)';
            element.style.backgroundColor = 'transparent';
            break;
        case 'rectangle':
            element.style.width = '70%';
            element.style.height = '40%';
            element.style.backgroundColor = 'var(--primary-color)';
            break;
        case 'pentagon':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
            element.style.backgroundColor = 'var(--accent-color)';
            break;
        case 'hexagon':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
            element.style.backgroundColor = 'var(--secondary-color)';
            break;
        case 'star':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            element.style.backgroundColor = 'var(--primary-color)';
            break;
        case 'heart':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.backgroundColor = 'var(--accent-color)';
            element.style.transform = 'rotate(45deg)';
            element.style.position = 'relative';
            element.style.margin = '10%';
            element.style.borderRadius = '50% 50% 0 0';
            element.style.boxShadow = `
                -15px 0 0 0 var(--accent-color),
                0 -15px 0 0 var(--accent-color)
            `;
            break;
        case 'diamond':
            element.style.width = '70%';
            element.style.height = '70%';
            element.style.transform = 'rotate(45deg)';
            element.style.backgroundColor = 'var(--secondary-color)';
            break;
    }
    
    // Add hover effect
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2) rotate(10deg)';
        this.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
}

// Global float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);