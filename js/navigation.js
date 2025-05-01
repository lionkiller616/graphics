/**
 * Advanced Navigation System with UI/UX Focus
 * Features: Responsive menus, smooth scrolling, active link highlighting
 */
class Navigation {
    constructor() {
      this.navElements = [];
      this.currentSection = null;
      this.scrollOffset = 100;
      this.init();
    }
  
    /**
     * Initialize navigation system
     */
    init() {
      // Find all navigation elements
      this.navElements = Array.from(document.querySelectorAll('nav, .navbar, .navigation'));
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize responsive menus
      this.initResponsiveMenus();
      
      // Initialize smooth scrolling
      this.initSmoothScrolling();
      
      // Initialize section observer
      this.initSectionObserver();
      
      // Update active link based on current URL
      this.updateActiveLink();
    }
  
    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Handle window scroll
      window.addEventListener('scroll', () => {
        this.handleScroll();
      });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        this.handleResize();
      });
      
      // Handle clicks on nav toggles
      document.querySelectorAll('.nav-toggle, .navbar-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          this.toggleMobileMenu(toggle);
        });
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('nav, .navbar, .navigation, .nav-toggle, .navbar-toggle')) {
          this.closeMobileMenus();
        }
      });
    }
  
    /**
     * Initialize responsive menus
     */
    initResponsiveMenus() {
      this.navElements.forEach(nav => {
        // Add mobile toggle button if not exists
        if (!nav.querySelector('.nav-toggle')) {
          const toggle = document.createElement('button');
          toggle.className = 'nav-toggle';
          toggle.innerHTML = '<span></span><span></span><span></span>';
          toggle.setAttribute('aria-label', 'Toggle navigation');
          nav.insertBefore(toggle, nav.firstChild);
        }
        
        // Mark menu items with dropdowns
        nav.querySelectorAll('li').forEach(li => {
          if (li.querySelector('ul')) {
            li.classList.add('has-dropdown');
            
            // Add toggle button
            const toggle = document.createElement('button');
            toggle.className = 'dropdown-toggle';
            toggle.innerHTML = '+';
            toggle.setAttribute('aria-label', 'Toggle dropdown');
            li.insertBefore(toggle, li.querySelector('ul'));
            
            // Add event listener
            toggle.addEventListener('click', () => {
              this.toggleDropdown(li);
            });
          }
        });
      });
    }
  
    /**
     * Initialize smooth scrolling
     */
    initSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          
          // Skip if it's a different kind of hash link
          if (href === '#' || href.startsWith('#!')) return;
          
          e.preventDefault();
          
          const target = document.querySelector(href);
          if (target) {
            this.scrollToElement(target);
            
            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, href);
            } else {
              location.hash = href;
            }
            
            // Close mobile menu if open
            this.closeMobileMenus();
          }
        });
      });
    }
  
    /**
     * Initialize Intersection Observer for sections
     */
    initSectionObserver() {
      const sections = document.querySelectorAll('section[id], .section[id]');
      if (sections.length === 0) return;
      
      const options = {
        root: null,
        rootMargin: `-${this.scrollOffset}px 0px -${window.innerHeight - this.scrollOffset - 100}px 0px`,
        threshold: 0
      };
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.currentSection = entry.target.id;
            this.updateActiveLink();
          }
        });
      }, options);
      
      sections.forEach(section => {
        this.observer.observe(section);
      });
    }
  
    /**
     * Update active link based on current section or URL
     */
    updateActiveLink() {
      const id = this.currentSection || window.location.hash.substring(1);
      if (!id) return;
      
      this.navElements.forEach(nav => {
        nav.querySelectorAll('a').forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      });
    }
  
    /**
     * Handle scroll events
     */
    handleScroll() {
      // Add/remove scroll class to nav elements
      const scrollY = window.scrollY;
      const scrollClass = 'scrolled';
      const threshold = 50;
      
      this.navElements.forEach(nav => {
        if (scrollY > threshold) {
          nav.classList.add(scrollClass);
        } else {
          nav.classList.remove(scrollClass);
        }
      });
    }
  
    /**
     * Handle resize events
     */
    handleResize() {
      // Close dropdowns when resizing to larger screens
      if (window.innerWidth >= 768) {
        this.closeDropdowns();
      }
    }
  
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu(toggle) {
      const nav = toggle.closest('nav, .navbar, .navigation');
      nav.classList.toggle('mobile-open');
      
      // Update aria-expanded
      const isExpanded = nav.classList.contains('mobile-open');
      toggle.setAttribute('aria-expanded', isExpanded);
      
      // Toggle body scroll
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    }
  
    /**
     * Close all mobile menus
     */
    closeMobileMenus() {
      this.navElements.forEach(nav => {
        nav.classList.remove('mobile-open');
        nav.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
      });
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
  
    /**
     * Toggle dropdown menu
     */
    toggleDropdown(li) {
      const isOpen = li.classList.contains('dropdown-open');
      
      // Close all other dropdowns at this level
      if (!isOpen) {
        li.parentElement.querySelectorAll('.has-dropdown').forEach(item => {
          if (item !== li) {
            item.classList.remove('dropdown-open');
          }
        });
      }
      
      li.classList.toggle('dropdown-open');
    }
  
    /**
     * Close all dropdown menus
     */
    closeDropdowns() {
      document.querySelectorAll('.has-dropdown').forEach(li => {
        li.classList.remove('dropdown-open');
      });
    }
  
    /**
     * Scroll to element with offset
     */
    scrollToElement(element, offset = null) {
      const actualOffset = offset !== null ? offset : this.scrollOffset;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - actualOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  
    /**
     * Update navigation based on URL change
     */
    updateFromURL() {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          this.scrollToElement(target);
        }
      }
      
      this.updateActiveLink();
    }
  
    /**
     * Highlight navigation item
     */
    highlightItem(url) {
      this.navElements.forEach(nav => {
        nav.querySelectorAll('a').forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === url);
        });
      });
    }
  
    /**
     * Add navigation item
     */
    addItem(item) {
      this.navElements.forEach(nav => {
        const list = nav.querySelector('ul');
        if (list) {
          list.appendChild(item);
        }
      });
    }
  
    /**
     * Create and add a navigation item
     */
    createAndAddItem(text, url, options = {}) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.textContent = text;
      
      if (options.className) {
        a.className = options.className;
      }
      
      if (options.active) {
        a.classList.add('active');
      }
      
      li.appendChild(a);
      this.addItem(li);
      
      // Initialize smooth scrolling if it's a hash link
      if (url.startsWith('#')) {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(url);
          if (target) {
            this.scrollToElement(target);
            history.pushState(null, null, url);
          }
        });
      }
      
      return li;
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
    
    // Make available globally
    window.navigation = navigation;
  });
  
  // Export for module usage
  export const navigation = new Navigation();