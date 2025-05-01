/**
 * Advanced Form Validation with UI/UX Focus
 * Features: Real-time validation, animated feedback, accessibility
 */
class FormValidation {
  constructor() {
    this.forms = [];
    this.errorMessages = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters',
      passwordMatch: 'Passwords do not match',
      number: 'Please enter a valid number',
      min: value => `Value must be at least ${value}`,
      max: value => `Value must be at most ${value}`,
      minLength: value => `Must be at least ${value} characters`,
      maxLength: value => `Must be at most ${value} characters`,
      pattern: 'Invalid format',
      custom: 'Invalid value'
    };
    
    // Initialize all forms on page
    this.initAllForms();
  }

  /**
   * Initialize all forms with class 'needs-validation'
   */
  initAllForms() {
    const forms = document.querySelectorAll('form.needs-validation');
    forms.forEach(form => this.addForm(form));
  }

  /**
   * Add a form to be validated
   */
  addForm(form) {
    if (this.forms.includes(form)) return;
    
    this.forms.push(form);
    
    // Add submit event listener
    form.addEventListener('submit', e => this.validateForm(e));
    
    // Add real-time validation for inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', () => this.validateInput(input));
      
      // Clear errors on focus
      input.addEventListener('focus', () => this.clearError(input));
      
      // Real-time validation for some fields
      if (input.type === 'email' || input.hasAttribute('pattern')) {
        input.addEventListener('input', () => {
          if (input.value) this.validateInput(input);
        });
      }
    });
    
    // Special handling for password confirmation
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    if (passwordInputs.length > 1) {
      passwordInputs[1].addEventListener('input', () => {
        if (passwordInputs[1].value) {
          this.validatePasswordMatch(passwordInputs[0], passwordInputs[1]);
        }
      });
    }
  }

  /**
   * Validate entire form on submit
   */
  validateForm(e) {
    const form = e.target;
    let isValid = true;
    
    // Validate all inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });
    
    // Prevent submission if invalid
    if (!isValid) {
      e.preventDefault();
      e.stopPropagation();
      
      // Focus on first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        
        // Smooth scroll to first error
        firstInvalid.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
    
    // Add was-validated class for Bootstrap compatibility
    form.classList.add('was-validated');
    
    return isValid;
  }

  /**
   * Validate a single input
   */
  validateInput(input) {
    let isValid = true;
    let errorMessage = '';
    
    // Check required
    if (input.required && !input.value.trim()) {
      isValid = false;
      errorMessage = this.errorMessages.required;
    }
    
    // Check type-specific validation
    if (isValid && input.value.trim()) {
      switch (input.type) {
        case 'email':
          if (!this.validateEmail(input.value)) {
            isValid = false;
            errorMessage = this.errorMessages.email;
          }
          break;
        case 'password':
          if (input.minLength && input.value.length < input.minLength) {
            isValid = false;
            errorMessage = this.errorMessages.minLength(input.minLength);
          }
          break;
        case 'number':
          case 'range':
          if (isNaN(input.value)) {
            isValid = false;
            errorMessage = this.errorMessages.number;
          } else {
            if (input.min && parseFloat(input.value) < parseFloat(input.min)) {
              isValid = false;
              errorMessage = this.errorMessages.min(input.min);
            }
            if (input.max && parseFloat(input.value) > parseFloat(input.max)) {
              isValid = false;
              errorMessage = this.errorMessages.max(input.max);
            }
          }
          break;
      }
      
      // Check pattern
      if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
        isValid = false;
        errorMessage = this.errorMessages.pattern;
      }
      
      // Check minLength/maxLength
      if (input.minLength && input.value.length < input.minLength) {
        isValid = false;
        errorMessage = this.errorMessages.minLength(input.minLength);
      }
      if (input.maxLength && input.value.length > input.maxLength) {
        isValid = false;
        errorMessage = this.errorMessages.maxLength(input.maxLength);
      }
      
      // Check custom validation
      if (input.dataset.validate) {
        const customValid = this[input.dataset.validate](input);
        if (customValid !== true) {
          isValid = false;
          errorMessage = customValid || this.errorMessages.custom;
        }
      }
    }
    
    // Update UI
    if (isValid) {
      this.markValid(input);
    } else {
      this.markInvalid(input, errorMessage);
    }
    
    return isValid;
  }

  /**
   * Validate password match
   */
  validatePasswordMatch(passwordInput, confirmInput) {
    if (passwordInput.value !== confirmInput.value) {
      this.markInvalid(confirmInput, this.errorMessages.passwordMatch);
      return false;
    } else {
      this.markValid(confirmInput);
      return true;
    }
  }

  /**
   * Mark input as valid
   */
  markValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    // Remove error message
    const errorEl = this.getErrorElement(input);
    if (errorEl) {
      this.animateOut(errorEl, () => errorEl.remove());
    }
    
    // Add success icon/animation
    this.addStatusIndicator(input, 'valid');
  }

  /**
   * Mark input as invalid
   */
  markInvalid(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    
    // Show error message
    const errorEl = this.getErrorElement(input);
    if (errorEl) {
      errorEl.textContent = message;
    } else {
      this.createErrorElement(input, message);
    }
    
    // Add error icon/animation
    this.addStatusIndicator(input, 'invalid');
    
    // Animate shake for attention
    this.animateShake(input);
  }

  /**
   * Clear error state
   */
  clearError(input) {
    input.classList.remove('is-invalid');
    
    const errorEl = this.getErrorElement(input);
    if (errorEl) {
      this.animateOut(errorEl, () => errorEl.remove());
    }
    
    this.removeStatusIndicator(input);
  }

  /**
   * Get existing error element
   */
  getErrorElement(input) {
    const id = input.id;
    if (!id) return null;
    
    return document.querySelector(`#${id}-error`);
  }

  /**
   * Create error element
   */
  createErrorElement(input, message) {
    const id = input.id;
    if (!id) return null;
    
    const errorEl = document.createElement('div');
    errorEl.id = `${id}-error`;
    errorEl.className = 'invalid-feedback animated fadeIn';
    errorEl.textContent = message;
    
    // Insert after input
    input.insertAdjacentElement('afterend', errorEl);
    
    return errorEl;
  }

  /**
   * Add status indicator (icon/animation)
   */
  addStatusIndicator(input, status) {
    let container = input.parentElement;
    if (!container.classList.contains('input-group')) {
      container = input;
    }
    
    // Remove existing indicators
    this.removeStatusIndicator(input);
    
    // Create new indicator
    const indicator = document.createElement('span');
    indicator.className = `input-status input-status-${status} animated bounceIn`;
    
    // Add icon based on status
    const icon = document.createElement('span');
    icon.className = 'status-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = status === 'valid' ? '✓' : '!';
    indicator.appendChild(icon);
    
    // Add to DOM
    container.appendChild(indicator);
  }

  /**
   * Remove status indicator
   */
  removeStatusIndicator(input) {
    let container = input.parentElement;
    if (!container.classList.contains('input-group')) {
      container = input;
    }
    
    const existing = container.querySelector('.input-status');
    if (existing) {
      this.animateOut(existing, () => existing.remove());
    }
  }

  /**
   * Animate element out before removal
   */
  animateOut(element, callback) {
    element.classList.remove('fadeIn');
    element.classList.add('fadeOut');
    
    element.addEventListener('animationend', () => {
      callback();
    }, { once: true });
  }

  /**
   * Shake animation for invalid fields
   */
  animateShake(element) {
    element.classList.add('shake');
    
    element.addEventListener('animationend', () => {
      element.classList.remove('shake');
    }, { once: true });
  }

  /**
   * Email validation
   */
  validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Custom validation methods can be added here
   */
  validateUsername(input) {
    const value = input.value.trim();
    if (value.length < 4) {
      return 'Username must be at least 4 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers and underscores';
    }
    return true;
  }
}

// Initialize all forms on page load
document.addEventListener('DOMContentLoaded', () => {
  const formValidation = new FormValidation();
});

// Export for module usage
export const formValidation = new FormValidation();