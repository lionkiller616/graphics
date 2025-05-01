// Main JavaScript - Core Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg', 'backdrop-blur-sm');
            header.classList.remove('shadow-2xl');
        } else {
            header.classList.remove('shadow-lg', 'backdrop-blur-sm');
            header.classList.add('shadow-2xl');
        }
    });
    
    // Intersection Observer for section animations
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Preloader animation
    const preloader = document.createElement('div');
    preloader.className = 'fixed inset-0 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center z-50';
    preloader.innerHTML = `
        <div class="text-center">
            <div class="loading-spinner mb-4"></div>
            <h3 class="text-white text-xl font-semibold animate-pulse">Loading ColorVerse...</h3>
        </div>
    `;
    document.body.prepend(preloader);
    
    // Simulate loading (remove in production)
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1500);
    
    // Tooltip initialization
    tippy('.nav-link', {
        content: 'Scroll to section',
        placement: 'bottom',
        animation: 'scale',
        theme: 'gradient',
    });
    
    // Initialize all modules
    initColorTheory();
    initColorPsychology();
    initColorPalettes();
    initColorTools();
});