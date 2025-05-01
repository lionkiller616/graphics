/**
 * Advanced Scroll Animations with UI/UX Focus
 * Features: Scroll-triggered animations, parallax effects, progress tracking
 */
class ScrollAnimations {
    constructor() {
      this.animations = [];
      this.parallaxElements = [];
      this.scrollProgressElements = [];
      this.lastScrollPosition = 0;
      this.scrollDirection = 'down';
      this.init();
    }
  
    /**
     * Initialize scroll animations
     */
    init() {
      // Set up event listeners
      this.setupEventListeners();
      
      // Find all elements with data attributes for animations
      this.findAnimationElements();
      this.findParallaxElements();
      this.findScrollProgressElements();
      
      // Initial update
      this.updateAllAnimations();
    }
  
    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Use requestAnimationFrame for smooth scroll handling
      let ticking = false;
      
      window.addEventListener('scroll', () => {
        this.lastScrollPosition = window.scrollY;
        
        // Track scroll direction
        const newDirection = this.lastScrollPosition > (this.lastScrollPosition || 0) ? 'down' : 'up';
        if (newDirection !== this.scrollDirection) {
          this.scrollDirection = newDirection;
          document.documentElement.setAttribute('data-scroll-direction', this.scrollDirection);
        }
        
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.updateAllAnimations();
            ticking = false;
          });
          ticking = true;
        }
      });
      
      // Handle resize
      window.addEventListener('resize', () => {
        this.refresh();
      });
    }
  
    /**
     * Find all elements with animation attributes
     */
    findAnimationElements() {
      document.querySelectorAll('[data-animate]').forEach(el => {
        const options = {
          trigger: el.dataset.animateTrigger ? document.querySelector(el.dataset.animateTrigger) : el,
          start: el.dataset.animateStart || 'top bottom',
          end: el.dataset.animateEnd || 'bottom top',
          toggleClass: el.dataset.animateClass || 'animate-in',
          once: el.dataset.animateOnce !== 'false',
          markers: el.dataset.animateMarkers === 'true',
          onEnter: el.dataset.animateOnEnter ? new Function(el.dataset.animateOnEnter) : null,
          onLeave: el.dataset.animateOnLeave ? new Function(el.dataset.animateOnLeave) : null,
          onEnterBack: el.dataset.animateOnEnterBack ? new Function(el.dataset.animateOnEnterBack) : null,
          onLeaveBack: el.dataset.animateOnLeaveBack ? new Function(el.dataset.animateOnLeaveBack) : null
        };
        
        this.animateOnScroll(el, options);
      });
    }
  
    /**
     * Find all parallax elements
     */
    findParallaxElements() {
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const options = {
          speed: parseFloat(el.dataset.parallaxSpeed) || 0.5,
          direction: el.dataset.parallaxDirection || 'vertical',
          startPosition: el.dataset.parallaxStartPosition || 'center center',
          limit: el.dataset.parallaxLimit ? parseFloat(el.dataset.parallaxLimit) : null
        };
        
        this.addParallaxEffect(el, options);
      });
    }
  
    /**
     * Find all scroll progress elements
     */
    findScrollProgressElements() {
      document.querySelectorAll('[data-scroll-progress]').forEach(el => {
        const options = {
          target: el.dataset.scrollProgressTarget ? document.querySelector(el.dataset.scrollProgressTarget) : null,
          axis: el.dataset.scrollProgressAxis || 'vertical',
          smooth: el.dataset.scrollProgressSmooth !== 'false',
          smoothness: el.dataset.scrollProgressSmoothness ? parseFloat(el.dataset.scrollProgressSmoothness) : 0.1
        };
        
        this.trackScrollProgress(el, options);
      });
    }
  
    /**
     * Animate element when it enters viewport
     */
    animateOnScroll(element, options = {}) {
      const defaults = {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        toggleClass: 'animate-in',
        once: true,
        markers: false,
        onEnter: null,
        onLeave: null,
        onEnterBack: null,
        onLeaveBack: null
      };
      
      const config = { ...defaults, ...options };
      
      // Create animation object
      const animation = {
        element,
        config,
        inView: false,
        triggered: false
      };
      
      this.animations.push(animation);
      
      // Initial check
      this.checkAnimation(animation);
    }
  
    /**
     * Add parallax effect to element
     */
    addParallaxEffect(element, options = {}) {
      const defaults = {
        speed: 0.5,
        direction: 'vertical', // 'vertical' or 'horizontal'
        startPosition: 'center center',
        limit: null
      };
      
      const config = { ...defaults, ...options };
      
      // Calculate start position
      let startY, startX;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const rect = element.getBoundingClientRect();
      
      if (config.startPosition === 'top bottom') {
        startY = viewportHeight;
      } else if (config.startPosition === 'bottom top') {
        startY = -rect.height;
      } else {
        // center center
        startY = (viewportHeight - rect.height) / 2;
      }
      
      if (config.direction === 'horizontal') {
        startX = (viewportWidth - rect.width) / 2;
      }
      
      // Create parallax object
      const parallax = {
        element,
        config,
        startY,
        startX,
        limit: config.limit
      };
      
      this.parallaxElements.push(parallax);
      
      // Initial update
      this.updateParallax(parallax);
    }
  
    /**
     * Track scroll progress for element
     */
    trackScrollProgress(element, options = {}) {
      const defaults = {
        target: null,
        axis: 'vertical', // 'vertical' or 'horizontal'
        smooth: true,
        smoothness: 0.1
      };
      
      const config = { ...defaults, ...options };
      const target = config.target || document.documentElement;
      
      // Create progress object
      const progress = {
        element,
        config,
        target,
        currentProgress: 0,
        displayedProgress: 0
      };
      
      this.scrollProgressElements.push(progress);
      
      // Initial update
      this.updateScrollProgress(progress);
    }
  
    /**
     * Update all animations
     */
    updateAllAnimations() {
      // Update scroll direction attribute
      const newScrollY = window.scrollY;
      if (newScrollY > this.lastScrollPosition) {
        this.scrollDirection = 'down';
      } else if (newScrollY < this.lastScrollPosition) {
        this.scrollDirection = 'up';
      }
      this.lastScrollPosition = newScrollY;
      document.documentElement.setAttribute('data-scroll-direction', this.scrollDirection);
      
      // Update animations
      this.animations.forEach(animation => {
        this.checkAnimation(animation);
      });
      
      // Update parallax effects
      this.parallaxElements.forEach(parallax => {
        this.updateParallax(parallax);
      });
      
      // Update scroll progress
      this.scrollProgressElements.forEach(progress => {
        this.updateScrollProgress(progress);
      });
    }
  
    /**
     * Check if animation should be triggered
     */
    checkAnimation(animation) {
      const { element, config } = animation;
      const trigger = config.trigger || element;
      const rect = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Parse start and end positions
      const start = this.parseScrollPosition(config.start, viewportHeight, viewportWidth);
      const end = this.parseScrollPosition(config.end, viewportHeight, viewportWidth);
      
      // Check if element is in view
      const isInView = rect.top <= viewportHeight - start.top && 
                      rect.bottom >= end.top && 
                      rect.left <= viewportWidth - start.left && 
                      rect.right >= end.left;
      
      // Handle state changes
      if (isInView && !animation.inView) {
        // Entering view
        animation.inView = true;
        element.classList.add(config.toggleClass);
        
        if (config.onEnter) {
          config.onEnter(element);
        }
        
        if (config.once) {
          animation.triggered = true;
        }
      } else if (!isInView && animation.inView) {
        // Leaving view
        animation.inView = false;
        
        if (!config.once || !animation.triggered) {
          element.classList.remove(config.toggleClass);
          
          if (config.onLeave) {
            config.onLeave(element);
          }
        }
      }
      
      // Handle back direction events
      if (this.scrollDirection === 'up') {
        if (isInView && animation.inView && config.onEnterBack) {
          config.onEnterBack(element);
        } else if (!isInView && !animation.inView && config.onLeaveBack) {
          config.onLeaveBack(element);
        }
      }
    }
  
    /**
     * Update parallax effect
     */
    updateParallax(parallax) {
      const { element, config, startY, startX, limit } = parallax;
      const scrollY = window.scrollY;
      const rect = element.getBoundingClientRect();
      
      if (config.direction === 'vertical') {
        const movement = scrollY * config.speed;
        const newY = startY + movement;
        
        // Apply limit if specified
        const finalY = limit !== null ? Math.min(newY, limit) : newY;
        
        element.style.transform = `translateY(${finalY}px)`;
      } else {
        const movement = scrollY * config.speed;
        const newX = startX + movement;
        
        // Apply limit if specified
        const finalX = limit !== null ? Math.min(newX, limit) : newX;
        
        element.style.transform = `translateX(${finalX}px)`;
      }
    }
  
    /**
     * Update scroll progress
     */
    updateScrollProgress(progress) {
      const { element, config, target } = progress;
      const scrollY = window.scrollY;
      const totalHeight = target.scrollHeight - window.innerHeight;
      const totalWidth = target.scrollWidth - window.innerWidth;
      
      // Calculate raw progress
      let rawProgress;
      if (config.axis === 'vertical') {
        rawProgress = totalHeight > 0 ? scrollY / totalHeight : 0;
      } else {
        rawProgress = totalWidth > 0 ? scrollY / totalWidth : 0;
      }
      
      // Clamp between 0 and 1
      rawProgress = Math.max(0, Math.min(1, rawProgress));
      
      // Apply smoothing if enabled
      if (config.smooth) {
        progress.displayedProgress += (rawProgress - progress.displayedProgress) * config.smoothness;
      } else {
        progress.displayedProgress = rawProgress;
      }
      
      // Update element
      if (element.tagName === 'PROGRESS') {
        element.value = progress.displayedProgress * 100;
      } else {
        element.style.setProperty('--scroll-progress', progress.displayedProgress);
        
        // For elements that use the progress as content
        if (element.dataset.scrollProgressFormat) {
          const format = element.dataset.scrollProgressFormat;
          let value;
          
          if (format === 'percentage') {
            value = `${Math.round(progress.displayedProgress * 100)}%`;
          } else if (format === 'decimal') {
            value = progress.displayedProgress.toFixed(2);
          } else {
            value = progress.displayedProgress;
          }
          
          element.textContent = value;
        }
      }
    }
  
    /**
     * Parse scroll position string
     */
    parseScrollPosition(position, viewportHeight, viewportWidth) {
      const parts = position.split(' ');
      const topPart = parts[0];
      const leftPart = parts[1] || topPart;
      
      return {
        top: this.parseScrollPositionPart(topPart, viewportHeight),
        left: this.parseScrollPositionPart(leftPart, viewportWidth)
      };
    }
  
    /**
     * Parse a single scroll position part
     */
    parseScrollPositionPart(part, viewportSize) {
      if (part.includes('%')) {
        return parseFloat(part) / 100 * viewportSize;
      } else if (part.includes('px')) {
        return parseFloat(part);
      } else {
        // Handle keywords
        switch (part) {
          case 'top': return 0;
          case 'center': return viewportSize * 0.5;
          case 'bottom': return viewportSize;
          default: return viewportSize;
        }
      }
    }
  
    /**
     * Refresh all animations (after resize or DOM changes)
     */
    refresh() {
      // Clear existing animations
      this.animations = [];
      this.parallaxElements = [];
      this.scrollProgressElements = [];
      
      // Reinitialize
      this.findAnimationElements();
      this.findParallaxElements();
      this.findScrollProgressElements();
      
      // Update
      this.updateAllAnimations();
    }
  
    /**
     * Create scroll progress indicator
     */
    createProgressIndicator(options = {}) {
      const defaults = {
        position: 'top',
        height: '4px',
        color: '#3a86ff',
        zIndex: 1000
      };
      
      const config = { ...defaults, ...options };
      
      // Create element
      const indicator = document.createElement('div');
      indicator.className = 'scroll-progress-indicator';
      indicator.style.position = 'fixed';
      indicator.style.left = '0';
      indicator.style[config.position] = '0';
      indicator.style.height = config.height;
      indicator.style.backgroundColor = config.color;
      indicator.style.zIndex = config.zIndex;
      indicator.style.width = '0';
      indicator.style.transition = 'width 0.1s linear';
      
      // Add to DOM
      document.body.appendChild(indicator);
      
      // Track scroll progress
      this.trackScrollProgress(indicator, {
        axis: 'vertical',
        smooth: false
      });
      
      return indicator;
    }
  
    /**
     * Create scroll-triggered animation timeline
     */
    createAnimationTimeline(element, animations) {
      const timeline = {
        element,
        animations,
        progress: 0
      };
      
      // Add to animations array
      this.animations.push({
        element,
        config: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => this.updateAnimationTimeline(timeline),
          onLeave: () => this.updateAnimationTimeline(timeline),
          onEnterBack: () => this.updateAnimationTimeline(timeline),
          onLeaveBack: () => this.updateAnimationTimeline(timeline)
        }
      });
      
      return timeline;
    }
  
    /**
     * Update animation timeline based on scroll position
     */
    updateAnimationTimeline(timeline) {
      const { element, animations } = timeline;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = -rect.height;
      const progress = 1 - (rect.top - end) / (start - end);
      
      timeline.progress = Math.max(0, Math.min(1, progress));
      
      // Apply animations
      animations.forEach(anim => {
        const { property, startValue, endValue, unit = '' } = anim;
        const value = startValue + (endValue - startValue) * timeline.progress;
        element.style[property] = `${value}${unit}`;
      });
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimations = new ScrollAnimations();
    
    // Make available globally
    window.scrollAnimations = scrollAnimations;
  });
  
  // Export for module usage
  export const scrollAnimations = new ScrollAnimations();