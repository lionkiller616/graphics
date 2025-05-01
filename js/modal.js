/**
 * Advanced Modal System with UI/UX Focus
 * Features: Stackable modals, animations, focus trapping, accessibility
 */
class ModalSystem {
  constructor() {
    this.modalStack = [];
    this.animationDuration = 300;
    this.init();
  }

  /**
   * Initialize modal system
   */
  init() {
    // Create overlay element
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.overlay);
    
    // Close modal when clicking overlay
    this.overlay.addEventListener('click', () => {
      this.closeCurrentModal();
    });
    
    // Close modal when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalStack.length > 0) {
        this.closeCurrentModal();
      }
    });
    
    // Initialize existing modals
    document.querySelectorAll('[data-modal]').forEach(modal => {
      this.initModal(modal);
    });
  }

  /**
   * Initialize a modal element
   */
  initModal(modal) {
    // Add ARIA attributes
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    
    // Create close button if not exists
    if (!modal.querySelector('.modal-close')) {
      const closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.innerHTML = '&times;';
      closeButton.setAttribute('aria-label', 'Close modal');
      modal.insertBefore(closeButton, modal.firstChild);
    }
    
    // Add event listeners to close buttons
    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal(modal));
    });
    
    // Add event listeners to open buttons
    const modalId = modal.id;
    if (modalId) {
      document.querySelectorAll(`[data-modal-target="${modalId}"]`).forEach(btn => {
        btn.addEventListener('click', () => this.openModal(modal));
      });
    }
  }

  /**
   * Open a modal
   */
  openModal(modal) {
    // If this modal is already open, bring it to front
    if (this.modalStack.includes(modal)) {
      this.bringToFront(modal);
      return;
    }
    
    // Add to stack
    this.modalStack.push(modal);
    
    // Show overlay if first modal
    if (this.modalStack.length === 1) {
      this.showOverlay();
    }
    
    // Prepare modal for display
    modal.style.display = 'block';
    modal.style.zIndex = 1000 + this.modalStack.length;
    
    // Set focus trap
    this.setFocusTrap(modal);
    
    // Animate in
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('modal-visible');
      
      // Focus first focusable element
      this.focusFirstElement(modal);
    }, 10);
    
    // Prevent body scroll
    this.disableBodyScroll();
    
    // Dispatch event
    modal.dispatchEvent(new CustomEvent('modal:open'));
  }

  /**
   * Open modal by ID
   */
  openModalById(id) {
    const modal = document.getElementById(id);
    if (modal) {
      this.openModal(modal);
    }
  }

  /**
   * Open overlay by ID
   */
  openOverlay(id) {
    const overlayContent = document.getElementById(id);
    if (overlayContent) {
      // Create a modal wrapper if needed
      let modal = overlayContent.closest('.modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        overlayContent.parentNode.insertBefore(modal, overlayContent);
        modal.appendChild(overlayContent);
        this.initModal(modal);
      }
      
      this.openModal(modal);
    }
  }

  /**
   * Close a modal
   */
  closeModal(modal) {
    const index = this.modalStack.indexOf(modal);
    if (index === -1) return;
    
    // Animate out
    modal.classList.remove('modal-visible');
    modal.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      modal.style.display = 'none';
      
      // Remove from stack
      this.modalStack.splice(index, 1);
      
      // Hide overlay if no more modals
      if (this.modalStack.length === 0) {
        this.hideOverlay();
      } else {
        // Bring next modal to front
        this.bringToFront(this.modalStack[this.modalStack.length - 1]);
      }
      
      // Re-enable body scroll if no more modals
      if (this.modalStack.length === 0) {
        this.enableBodyScroll();
      }
      
      // Dispatch event
      modal.dispatchEvent(new CustomEvent('modal:close'));
    }, this.animationDuration);
  }

  /**
   * Close current modal
   */
  closeCurrentModal() {
    if (this.modalStack.length > 0) {
      this.closeModal(this.modalStack[this.modalStack.length - 1]);
    }
  }

  /**
   * Close all modals
   */
  closeAllModals() {
    while (this.modalStack.length > 0) {
      this.closeCurrentModal();
    }
  }

  /**
   * Bring modal to front of stack
   */
  bringToFront(modal) {
    const index = this.modalStack.indexOf(modal);
    if (index === -1) return;
    
    // Move to end of array
    this.modalStack.splice(index, 1);
    this.modalStack.push(modal);
    
    // Update z-indexes
    this.modalStack.forEach((m, i) => {
      m.style.zIndex = 1000 + i + 1;
    });
  }

  /**
   * Show overlay
   */
  showOverlay() {
    this.overlay.setAttribute('aria-hidden', 'false');
    this.overlay.classList.add('overlay-visible');
  }

  /**
   * Hide overlay
   */
  hideOverlay() {
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.classList.remove('overlay-visible');
  }

  /**
   * Set focus trap inside modal
   */
  setFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Focus first focusable element in modal
   */
  focusFirstElement(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Disable body scroll when modal is open
   */
  disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${this.getScrollbarWidth()}px`;
    
    // Add class to body
    document.body.classList.add('modal-open');
  }

  /**
   * Enable body scroll when modal is closed
   */
  enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
  }

  /**
   * Calculate scrollbar width
   */
  getScrollbarWidth() {
    // Create temporary elements
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    // Calculate difference
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    
    // Remove elements
    outer.parentNode.removeChild(outer);
    
    return scrollbarWidth;
  }

  /**
   * Create and show a notification modal
   */
  notify(options) {
    const defaults = {
      title: 'Notification',
      message: '',
      type: 'info', // 'info', 'success', 'warning', 'error'
      buttons: [
        { text: 'OK', action: 'close', class: 'primary' }
      ],
      dismissable: true
    };
    
    const config = { ...defaults, ...options };
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = `modal modal-${config.type}`;
    
    // Create content
    let buttonsHTML = '';
    config.buttons.forEach(btn => {
      const action = btn.action === 'close' ? 'data-modal-close' : `onclick="${btn.action}"`;
      buttonsHTML += `
        <button class="btn btn-${btn.class}" ${action}>
          ${btn.text}
        </button>
      `;
    });
    
    modal.innerHTML = `
      <div class="modal-content">
        ${config.dismissable ? '<button class="modal-close" aria-label="Close modal">&times;</button>' : ''}
        <h3 class="modal-title">${config.title}</h3>
        <div class="modal-message">${config.message}</div>
        <div class="modal-buttons">${buttonsHTML}</div>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Initialize
    this.initModal(modal);
    
    // Open
    this.openModal(modal);
    
    // Return modal element for further manipulation
    return modal;
  }

  /**
   * Create and show a confirm dialog
   */
  confirm(options) {
    return new Promise((resolve) => {
      const modal = this.notify({
        title: options.title || 'Confirm',
        message: options.message || 'Are you sure?',
        type: 'warning',
        buttons: [
          { 
            text: options.cancelText || 'Cancel', 
            action: 'this.closest(".modal")._resolve(false)', 
            class: 'secondary' 
          },
          { 
            text: options.confirmText || 'Confirm', 
            action: 'this.closest(".modal")._resolve(true)', 
            class: 'primary' 
          }
        ],
        dismissable: options.dismissable !== false
      });
      
      // Attach resolve function to modal
      modal._resolve = resolve;
      
      // Close modal when resolved
      modal.addEventListener('modal:resolve', () => {
        this.closeModal(modal);
      });
    });
  }
}

// Initialize immediately
(function() {
  const modalSystem = new ModalSystem();
  
  // Make available globally
  window.modal = modalSystem;
})();

// Export for ES modules
export const modalSystem = new ModalSystem();