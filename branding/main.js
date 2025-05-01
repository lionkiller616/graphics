// colors/main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Main script loaded.');

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset for fixed header
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                // Optionally, stop observing once the animation is applied
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove the class if it goes out of view to allow re-triggering
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Basic Header Sticky/Shrink (Optional) ---
    // Add a class to the header on scroll to change its style
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight) {
            header.classList.add('scrolled');
            // Example: header.classList.add('bg-opacity-90', 'shadow-xl'); // Add Tailwind classes
        } else {
            header.classList.remove('scrolled');
            // Example: header.classList.remove('bg-opacity-90', 'shadow-xl'); // Remove Tailwind classes
        }
    });

    // You would add the corresponding CSS for the '.scrolled' class in main.css
    /*
    main.css:
    header.scrolled {
        // Add styles for the scrolled state, e.g.,
        // background-color: rgba(30, 41, 59, 0.9); // Slate-800 with opacity
        // transition: background-color 0.3s ease-in-out;
    }
    */


    // --- Add more general site-wide JavaScript here ---
    // For example, a back-to-top button, modal logic, etc.

});
