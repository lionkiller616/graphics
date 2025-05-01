/**
 * Advanced Dark Mode Toggle with UI/UX Focus
 * Features: Smooth transitions, system preference detection, persistence
 */
class DarkMode {
  constructor() {
    this.isDarkMode = false;
    this.toggleButton = null;
    this.transitionDuration = 300;
    this.init();
  }

  /**
   * Initialize dark mode functionality
   */
  init() {
    // Create toggle button if it doesn't exist
    if (!document.getElementById('dark-mode-toggle')) {
      this.toggleButton = document.createElement('button');
      this.toggleButton.id = 'dark-mode-toggle';
      this.toggleButton.className = 'dark-mode-toggle';
      this.toggleButton.innerHTML = `
        <span class="sun-icon">☀️</span>
        <span class="moon-icon">🌙</span>
      `;
      
      // Add to DOM (you might want to customize this)
      document.body.insertBefore(this.toggleButton, document.body.firstChild);
    } else {
      this.toggleButton = document.getElementById('dark-mode-toggle');
    }
    
    // Check for saved preference or system preference
    this.checkInitialMode();
    
    // Set up event listeners
    this.toggleButton.addEventListener('click', () => this.toggleMode());
    
    // Watch for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('darkMode')) { // Only if no user preference is set
        this.setMode(e.matches);
      }
    });
    
    // Add transition styles
    this.addTransitionStyles();
  }

  /**
   * Check for initial mode preference
   */
  checkInitialMode() {
    // Check localStorage for user preference
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      this.setMode(savedMode === 'true');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setMode(systemPrefersDark);
    }
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode() {
    this.setMode(!this.isDarkMode);
    
    // Save user preference
    localStorage.setItem('darkMode', this.isDarkMode);
  }

  /**
   * Set dark mode state
   */
  setMode(isDark) {
    this.isDarkMode = isDark;
    
    // Update button state
    this.updateToggleButton();
    
    // Add transition class
    document.documentElement.classList.add('dark-mode-transition');
    
    // Set timeout to remove transition class after duration
    setTimeout(() => {
      document.documentElement.classList.remove('dark-mode-transition');
    }, this.transitionDuration);
    
    // Update data attribute and class
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-mode', isDark);
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('darkmode:change', {
      detail: { isDarkMode: isDark }
    }));
  }

  /**
   * Update toggle button appearance
   */
  updateToggleButton() {
    if (!this.toggleButton) return;
    
    this.toggleButton.setAttribute('aria-label', 
      this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    
    this.toggleButton.classList.toggle('active', this.isDarkMode);
    
    // Animate icons
    const sunIcon = this.toggleButton.querySelector('.sun-icon');
    const moonIcon = this.toggleButton.querySelector('.moon-icon');
    
    if (this.isDarkMode) {
      sunIcon.style.transform = 'rotate(90deg) scale(0)';
      moonIcon.style.transform = 'rotate(0) scale(1)';
    } else {
      sunIcon.style.transform = 'rotate(0) scale(1)';
      moonIcon.style.transform = 'rotate(-90deg) scale(0)';
    }
  }

  /**
   * Add smooth transition styles
   */
  addTransitionStyles() {
    let style = document.getElementById('dark-mode-transition-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dark-mode-transition-styles';
      style.textContent = `
        .dark-mode-transition *,
        .dark-mode-transition *::before,
        .dark-mode-transition *::after {
          transition: background-color ${this.transitionDuration}ms ease,
                      color ${this.transitionDuration}ms ease,
                      border-color ${this.transitionDuration}ms ease,
                      fill ${this.transitionDuration}ms ease,
                      stroke ${this.transitionDuration}ms ease,
                      opacity ${this.transitionDuration}ms ease,
                      box-shadow ${this.transitionDuration}ms ease !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Apply dark mode styles to specific elements
   */
  applyElementStyles() {
    // This would be customized based on your site's elements
    const elementsToStyle = [
      'body',
      'header',
      'footer',
      'nav',
      'article',
      'section',
      'aside',
      'button',
      'a',
      'input',
      'textarea',
      'select'
    ];
    
    elementsToStyle.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.add('dark-mode-element');
      });
    });
  }
}

// Initialize immediately (self-executing)
(function() {
  const darkMode = new DarkMode();
  
  // Export for module usage
  window.darkMode = darkMode;
})();

// Export for ES modules
export const darkMode = new DarkMode();