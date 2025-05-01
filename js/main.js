/**
 * Main Application Script with UI/UX Focus
 * Features: Initializes all components, manages page transitions, handles global events
 */
class MainApp {
  constructor() {
    // Initialize components
    this.initComponents();
    
    // Set up global event listeners
    this.setupEventListeners();
    
    // Initialize page transitions
    this.initPageTransitions();
    
    // Initialize scroll animations
    this.initScrollAnimations();
    
    // Initialize service worker if available
    this.initServiceWorker();
    
    // Track page load performance
    this.trackPerformance();
  }

  /**
   * Initialize all UI components
   */
  initComponents() {
    // Initialize dark mode
    this.darkMode = new DarkMode();
    
    // Initialize navigation
    this.navigation = new Navigation();
    
    // Initialize form validation
    this.formValidation = new FormValidation();
    
    // Initialize color tools if on relevant page
    if (document.getElementById('color-tools-container')) {
      this.colorTools = new ColorTools();
    }
    
    // Initialize shape tools if on relevant page
    if (document.getElementById('shape-tools-container')) {
      this.shapeTools = new ShapeTools();
    }
    
    // Initialize modal system
    this.modal = new ModalSystem();
    
    // Initialize search if search container exists
    if (document.getElementById('search-container')) {
      this.search = new Search();
    }
    
    // Initialize treeview if exists
    if (document.getElementById('treeview')) {
      this.treeView = new TreeView();
    }
    
    // Initialize playground if exists
    if (document.getElementById('playground-container')) {
      this.playground = new Playground();
    }
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Listen for dark mode changes
    document.addEventListener('darkmode:change', (e) => {
      this.handleDarkModeChange(e.detail.isDarkMode);
    });
    
    // Listen for color changes
    document.addEventListener('color:changed', (e) => {
      this.handleColorChange(e.detail.color);
    });
    
    // Listen for navigation events
    document.addEventListener('navigation:change', (e) => {
      this.handleNavigationChange(e.detail);
    });
    
    // Listen for search events
    document.addEventListener('search:open', () => {
      this.handleSearchOpen();
    });
    
    // Window resize debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 200);
    });
    
    // Online/offline detection
    window.addEventListener('online', () => this.updateConnectionStatus(true));
    window.addEventListener('offline', () => this.updateConnectionStatus(false));
  }

  /**
   * Initialize smooth page transitions
   */
  initPageTransitions() {
    // Only if this is a multi-page app
    if (document.querySelector('a[href]')) {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (link && this.isSameDomain(link.href)) {
          e.preventDefault();
          this.transitionToPage(link.href);
        }
      });
    }
  }

  /**
   * Initialize scroll animations
   */
  initScrollAnimations() {
    this.scrollAnimations = new ScrollAnimations();
    
    // Animate elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      this.scrollAnimations.animateOnScroll(el, {
        trigger: el,
        start: 'top 80%',
        toggleClass: 'animate-in',
        once: true
      });
    });
  }

  /**
   * Initialize service worker
   */
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful');
        }).catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }

  /**
   * Track page load performance
   */
  trackPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Send to analytics if available
        if (window.ga) {
          ga('send', 'timing', 'Page Load', 'load', loadTime);
        }
      });
    }
  }

  /**
   * Handle dark mode change
   */
  handleDarkModeChange(isDarkMode) {
    // Update theme color meta tag
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = isDarkMode ? '#1a1a1a' : '#ffffff';
    }
    
    // Update any other dark mode specific elements
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Save scroll position before potential layout shifts
    const scrollPosition = window.scrollY;
    
    // Force repaint to prevent flash of unstyled content
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
      window.scrollTo(0, scrollPosition);
    }, 10);
  }

  /**
   * Handle color change events
   */
  handleColorChange(color) {
    // Update CSS variables if on a color-related page
    if (document.getElementById('color-page')) {
      document.documentElement.style.setProperty('--primary-color', color);
      
      // Generate accessible text color
      const textColor = colorsAPI.getAccessibleTextColor(color);
      document.documentElement.style.setProperty('--primary-text', textColor);
    }
  }

  /**
   * Handle navigation changes
   */
  handleNavigationChange(detail) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === detail.url);
    });
    
    // Update document title
    if (detail.title) {
      document.title = detail.title;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track page view
    if (window.ga) {
      ga('send', 'pageview', detail.url);
    }
  }

  /**
   * Handle search open
   */
  handleSearchOpen() {
    // Focus search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
    
    // Add overlay
    this.modal.openOverlay('search-overlay');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update any responsive elements
    this.navigation.handleResize();
    
    // Re-initialize scroll animations
    this.scrollAnimations.refresh();
  }

  /**
   * Update connection status
   */
  updateConnectionStatus(isOnline) {
    const statusEl = document.createElement('div');
    statusEl.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
    statusEl.textContent = isOnline ? 'Back online' : 'No internet connection';
    
    document.body.appendChild(statusEl);
    
    setTimeout(() => {
      statusEl.classList.add('fade-out');
      statusEl.addEventListener('animationend', () => {
        statusEl.remove();
      }, { once: true });
    }, 3000);
  }

  /**
   * Check if link is same domain
   */
  isSameDomain(href) {
    return href.startsWith(window.location.origin) || 
           href.startsWith('/') || 
           href.startsWith('./') || 
           href.startsWith('../');
  }

  /**
   * Transition to another page
   */
  transitionToPage(href) {
    // Add transition class
    document.documentElement.classList.add('page-transition');
    
    // Animate out
    const animationDuration = 300;
    setTimeout(() => {
      window.location.href = href;
    }, animationDuration);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new MainApp();
  
  // Make available globally
  window.app = app;
});

// Export for module usage
export const app = new MainApp();