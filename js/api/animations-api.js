/**
 * Advanced Animations API with UI/UX Focus
 * Features: Smooth transitions, physics-based animations, gesture support
 */
class AnimationsAPI {
  constructor() {
    this.easingFunctions = {
      easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
      easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
      easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
      easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
      elastic: t => (.04 - .04 / t) * Math.sin(25 * t) + 1,
      spring: t => 1 - Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 4)
    };
    this.animationQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Animate element with advanced options
   * @param {HTMLElement} element - DOM element to animate
   * @param {Object} properties - CSS properties to animate
   * @param {Object} options - Animation options
   */
  animate(element, properties, options = {}) {
    const defaults = {
      duration: 600,
      easing: 'easeInOutQuad',
      delay: 0,
      onStart: null,
      onComplete: null,
      onProgress: null,
      useGPU: true,
      transformOrigin: 'center center',
      stagger: 0,
      springTension: 0.4,
      springFriction: 10,
      physics: false
    };

    const config = { ...defaults, ...options };
    
    return new Promise((resolve) => {
      const startTime = performance.now() + config.delay;
      const initialValues = {};
      const unitTypes = {};
      
      // Set transform origin
      if (config.transformOrigin) {
        element.style.transformOrigin = config.transformOrigin;
      }

      // Enable GPU acceleration if specified
      if (config.useGPU) {
        element.style.willChange = Object.keys(properties).join(', ');
      }

      // Store initial values and parse units
      Object.keys(properties).forEach(prop => {
        initialValues[prop] = parseFloat(getComputedStyle(element)[prop]);
        const match = String(properties[prop]).match(/[a-z%]+$/);
        unitTypes[prop] = match ? match[0] : '';
      });

      const animationFrame = (currentTime) => {
        const elapsed = currentTime - startTime;
        
        if (elapsed < 0) {
          requestAnimationFrame(animationFrame);
          return;
        }

        // Call onStart callback at first frame
        if (elapsed <= 16.7 && config.onStart) {
          config.onStart(element);
        }

        const progress = Math.min(elapsed / config.duration, 1);
        let easedProgress = progress;
        
        // Apply easing function
        if (typeof config.easing === 'function') {
          easedProgress = config.easing(progress);
        } else if (this.easingFunctions[config.easing]) {
          easedProgress = this.easingFunctions[config.easing](progress);
        }

        // Apply physics-based animation if enabled
        if (config.physics) {
          const tension = config.springTension * 0.0001;
          const friction = config.springFriction * 0.001;
          easedProgress = this.springEasing(progress, tension, friction);
        }

        // Update properties
        Object.keys(properties).forEach(prop => {
          const initial = initialValues[prop];
          const target = parseFloat(properties[prop]);
          const unit = unitTypes[prop];
          const currentValue = initial + (target - initial) * easedProgress;
          
          if (prop === 'opacity' || prop === 'zIndex') {
            element.style[prop] = currentValue;
          } else if (prop.includes('rotate') || prop.includes('skew')) {
            element.style.transform = `${prop}(${currentValue}deg)`;
          } else if (prop.includes('scale')) {
            element.style.transform = `${prop}(${currentValue})`;
          } else if (prop.includes('translate')) {
            element.style.transform = `${prop}(${currentValue}px)`;
          } else {
            element.style[prop] = `${currentValue}${unit}`;
          }
        });

        // Call progress callback
        if (config.onProgress) {
          config.onProgress(element, easedProgress);
        }

        // Continue animation or complete
        if (progress < 1) {
          requestAnimationFrame(animationFrame);
        } else {
          // Clean up will-change
          if (config.useGPU) {
            element.style.willChange = 'auto';
          }
          
          if (config.onComplete) {
            config.onComplete(element);
          }
          resolve(element);
        }
      };

      // Add to queue if stagger is specified
      if (config.stagger > 0) {
        this.addToQueue(() => {
          requestAnimationFrame(animationFrame);
        }, config.stagger);
      } else {
        requestAnimationFrame(animationFrame);
      }
    });
  }

  /**
   * Spring physics easing function
   */
  springEasing(progress, tension, friction) {
    return 1 - Math.exp(-progress / friction) * Math.cos(progress * tension);
  }

  /**
   * Stagger animation queue system
   */
  addToQueue(callback, delay) {
    this.animationQueue.push({ callback, delay });
    
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  processQueue() {
    this.isProcessingQueue = true;
    
    if (this.animationQueue.length > 0) {
      const { callback, delay } = this.animationQueue.shift();
      
      setTimeout(() => {
        callback();
        this.processQueue();
      }, delay);
    } else {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Scroll-based animations
   */
  scrollTrigger(element, options = {}) {
    const defaults = {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleClass: 'is-active',
      once: false,
      onEnter: null,
      onLeave: null,
      onEnterBack: null,
      onLeaveBack: null
    };

    const config = { ...defaults, ...options };
    const trigger = config.trigger || element;
    let triggered = false;

    const scrollHandler = () => {
      const rect = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = this.parseScrollPosition(config.start, viewportHeight);
      const end = this.parseScrollPosition(config.end, viewportHeight);

      const isInView = rect.top <= viewportHeight - start && rect.bottom >= end;
      
      if (isInView && !triggered) {
        element.classList.add(config.toggleClass);
        if (config.onEnter) config.onEnter(element);
        triggered = true;
        
        if (config.once) {
          window.removeEventListener('scroll', scrollHandler);
        }
      } else if (!isInView && triggered) {
        element.classList.remove(config.toggleClass);
        if (config.onLeave) config.onLeave(element);
        triggered = false;
      }
    };

    window.addEventListener('scroll', scrollHandler);
    scrollHandler(); // Initial check

    return {
      destroy: () => window.removeEventListener('scroll', scrollHandler)
    };
  }

  parseScrollPosition(position, viewportHeight) {
    const parts = position.split(' ');
    const value = parseFloat(parts[0]);
    const unit = parts[1];
    
    if (unit === '%') {
      return (value / 100) * viewportHeight;
    } else if (unit === 'px') {
      return value;
    } else {
      // Handle keywords like 'top', 'center', 'bottom'
      switch (parts[1]) {
        case 'top': return 0;
        case 'center': return viewportHeight * 0.5;
        case 'bottom': return viewportHeight;
        default: return viewportHeight * 0.8;
      }
    }
  }

  /**
   * Advanced stagger animations for groups of elements
   */
  stagger(elements, options = {}) {
    const defaults = {
      delay: 100,
      from: 'start',
      easing: 'easeInOutQuad',
      duration: 500,
      animate: {}
    };

    const config = { ...defaults, ...options };
    const elementArray = Array.from(elements);
    
    if (config.from === 'end') {
      elementArray.reverse();
    } else if (config.from === 'center') {
      // Reorder elements from center outwards
      const center = Math.floor(elementArray.length / 2);
      const reordered = [];
      
      for (let i = 0; i <= center; i++) {
        if (center + i < elementArray.length) reordered.push(elementArray[center + i]);
        if (i !== 0 && center - i >= 0) reordered.push(elementArray[center - i]);
      }
      
      elementArray.splice(0, elementArray.length, ...reordered);
    } else if (config.from === 'random') {
      // Shuffle array randomly
      for (let i = elementArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elementArray[i], elementArray[j]] = [elementArray[j], elementArray[i]];
      }
    }

    elementArray.forEach((el, index) => {
      setTimeout(() => {
        this.animate(el, config.animate, {
          duration: config.duration,
          easing: config.easing
        });
      }, index * config.delay);
    });
  }

  /**
   * Morphing animation between two elements
   */
  morph(sourceElement, targetElement, options = {}) {
    const defaults = {
      duration: 800,
      easing: 'easeInOutQuad',
      preserveAspect: true,
      fade: true
    };

    const config = { ...defaults, ...options };
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    // Create a clone for morphing
    const morphElement = sourceElement.cloneNode(true);
    morphElement.style.position = 'fixed';
    morphElement.style.left = `${sourceRect.left}px`;
    morphElement.style.top = `${sourceRect.top}px`;
    morphElement.style.width = `${sourceRect.width}px`;
    morphElement.style.height = `${sourceRect.height}px`;
    morphElement.style.margin = '0';
    morphElement.style.pointerEvents = 'none';
    document.body.appendChild(morphElement);
    
    // Hide original elements during animation
    sourceElement.style.visibility = 'hidden';
    targetElement.style.visibility = 'hidden';
    
    // Animate the clone
    return this.animate(morphElement, {
      left: targetRect.left,
      top: targetRect.top,
      width: targetRect.width,
      height: targetRect.height,
      opacity: config.fade ? 1 : 0.8
    }, {
      duration: config.duration,
      easing: config.easing,
      onComplete: () => {
        // Show target element and clean up
        targetElement.style.visibility = 'visible';
        morphElement.remove();
        
        if (options.onComplete) {
          options.onComplete();
        }
      }
    });
  }

  /**
   * Particle explosion effect
   */
  particleExplosion(element, options = {}) {
    const defaults = {
      count: 30,
      duration: 1000,
      spread: 200,
      size: 5,
      color: getComputedStyle(element).backgroundColor,
      gravity: 0.2
    };

    const config = { ...defaults, ...options };
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Hide original element
    element.style.visibility = 'hidden';
    
    // Create particles
    for (let i = 0; i < config.count; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = `${config.size}px`;
      particle.style.height = `${config.size}px`;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = config.color;
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.pointerEvents = 'none';
      document.body.appendChild(particle);
      
      // Random velocity
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let time = 0;
      const animateParticle = () => {
        time += 16;
        const progress = time / config.duration;
        
        if (progress >= 1) {
          particle.remove();
          return;
        }
        
        const x = centerX + vx * time * 0.2;
        const y = centerY + vy * time * 0.2 + config.gravity * time * time * 0.001;
        const opacity = 1 - progress;
        const scale = 1 - progress * 0.5;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = opacity;
        particle.style.transform = `scale(${scale})`;
        
        requestAnimationFrame(animateParticle);
      };
      
      requestAnimationFrame(animateParticle);
    }
    
    // Return promise that resolves when animation completes
    return new Promise(resolve => {
      setTimeout(() => {
        if (options.onComplete) options.onComplete();
        resolve();
      }, config.duration);
    });
  }
}

// Export as singleton
export const animationsAPI = new AnimationsAPI();