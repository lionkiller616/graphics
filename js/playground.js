/**
 * Advanced Playground with UI/UX Focus
 * Features: Interactive design tools, live preview, code export
 */
class Playground {
    constructor() {
      this.currentTool = 'color';
      this.init();
    }
  
    /**
     * Initialize playground
     */
    init() {
      // Set up UI
      this.setupUI();
      
      // Initialize tools
      this.initColorGenerator();
      this.initShapeComposer();
      this.initAnimationLab();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Load saved work if available
      this.loadSavedWork();
    }
  
    /**
     * Set up playground UI
     */
    setupUI() {
      // Create container if it doesn't exist
      if (!document.getElementById('playground-container')) {
        const container = document.createElement('div');
        container.id = 'playground-container';
        container.className = 'playground';
        document.body.appendChild(container);
      }
      
      // Create toolbar
      this.createToolbar();
      
      // Create preview area
      this.createPreviewArea();
      
      // Create code output
      this.createCodeOutput();
    }
  
    /**
     * Create playground toolbar
     */
    createToolbar() {
      const container = document.getElementById('playground-container');
      
      const toolbar = document.createElement('div');
      toolbar.className = 'playground-toolbar';
      toolbar.innerHTML = `
        <div class="tool-switcher">
          <button class="tool-button active" data-tool="color">Color Generator</button>
          <button class="tool-button" data-tool="shape">Shape Composer</button>
          <button class="tool-button" data-tool="animation">Animation Lab</button>
        </div>
        <div class="tool-actions">
          <button class="action-button" id="export-code">Export Code</button>
          <button class="action-button" id="save-work">Save</button>
          <button class="action-button" id="reset-playground">Reset</button>
        </div>
      `;
      
      container.appendChild(toolbar);
    }
  
    /**
     * Create preview area
     */
    createPreviewArea() {
      const container = document.getElementById('playground-container');
      
      const previewArea = document.createElement('div');
      previewArea.className = 'playground-preview';
      previewArea.innerHTML = `
        <div class="tool-area" id="tool-area">
          <!-- Tool content will be loaded here -->
        </div>
        <div class="preview-display" id="preview-display">
          <!-- Live preview will be shown here -->
        </div>
      `;
      
      container.appendChild(previewArea);
    }
  
    /**
     * Create code output area
     */
    createCodeOutput() {
      const container = document.getElementById('playground-container');
      
      const codeOutput = document.createElement('div');
      codeOutput.className = 'playground-code';
      codeOutput.innerHTML = `
        <div class="code-header">
          <h4>Generated Code</h4>
          <button class="copy-button" id="copy-code">Copy</button>
        </div>
        <pre><code id="code-output"></code></pre>
      `;
      
      container.appendChild(codeOutput);
    }
  
    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Tool switcher
      document.querySelectorAll('.tool-button').forEach(button => {
        button.addEventListener('click', () => {
          const tool = button.dataset.tool;
          this.switchTool(tool);
        });
      });
      
      // Action buttons
      document.getElementById('export-code').addEventListener('click', () => this.exportCode());
      document.getElementById('save-work').addEventListener('click', () => this.saveWork());
      document.getElementById('reset-playground').addEventListener('click', () => this.resetPlayground());
      document.getElementById('copy-code').addEventListener('click', () => this.copyCode());
      
      // Listen for color changes
      document.addEventListener('color:changed', (e) => {
        if (this.currentTool === 'color') {
          this.updateColorPreview(e.detail.color);
        }
      });
    }
  
    /**
     * Switch between tools
     */
    switchTool(tool) {
      if (this.currentTool === tool) return;
      
      // Update UI
      document.querySelectorAll('.tool-button').forEach(button => {
        button.classList.toggle('active', button.dataset.tool === tool);
      });
      
      // Clear previous tool
      const toolArea = document.getElementById('tool-area');
      toolArea.innerHTML = '';
      
      // Load new tool
      switch (tool) {
        case 'color':
          this.initColorGenerator();
          break;
        case 'shape':
          this.initShapeComposer();
          break;
        case 'animation':
          this.initAnimationLab();
          break;
      }
      
      this.currentTool = tool;
    }
  
    /**
     * Initialize color generator tool
     */
    initColorGenerator() {
      const toolArea = document.getElementById('tool-area');
      toolArea.innerHTML = `
        <div class="color-tool">
          <h4>Base Color</h4>
          <input type="color" id="playground-color" value="#3a86ff">
          
          <h4>Color Harmony</h4>
          <select id="color-harmony">
            <option value="complementary">Complementary</option>
            <option value="analogous">Analogous</option>
            <option value="triadic">Triadic</option>
            <option value="tetradic">Tetradic</option>
            <option value="square">Square</option>
            <option value="splitComplementary">Split Complementary</option>
            <option value="monochromatic">Monochromatic</option>
          </select>
          
          <h4>Options</h4>
          <label>
            <input type="checkbox" id="include-shades"> Include Shades
          </label>
        </div>
      `;
      
      // Set up event listeners
      document.getElementById('playground-color').addEventListener('input', (e) => {
        this.updateColorPreview(e.target.value);
      });
      
      document.getElementById('color-harmony').addEventListener('change', () => {
        this.updateColorPreview(document.getElementById('playground-color').value);
      });
      
      document.getElementById('include-shades').addEventListener('change', () => {
        this.updateColorPreview(document.getElementById('playground-color').value);
      });
      
      // Initial preview
      this.updateColorPreview('#3a86ff');
    }
  
    /**
     * Update color preview
     */
    updateColorPreview(baseColor) {
      const harmonyType = document.getElementById('color-harmony').value;
      const includeShades = document.getElementById('include-shades').checked;
      
      let colors;
      
      if (harmonyType === 'monochromatic') {
        colors = colorsAPI.generateMonochromatic(baseColor, includeShades ? 9 : 5);
      } else {
        colors = colorsAPI.generateHarmony(baseColor, harmonyType);
        
        if (includeShades) {
          const shades = colors.map(color => colorsAPI.generateMonochromatic(color, 3)).flat();
          colors = [...colors, ...shades];
        }
      }
      
      // Update preview
      const preview = document.getElementById('preview-display');
      preview.innerHTML = '';
      
      colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.textContent = color;
        
        // Set text color for contrast
        const textColor = colorsAPI.getAccessibleTextColor(color);
        colorBox.style.color = textColor;
        
        preview.appendChild(colorBox);
      });
      
      // Update code output
      this.updateCodeOutput({
        type: 'color',
        baseColor,
        harmonyType,
        includeShades,
        colors
      });
    }
  
    /**
     * Initialize shape composer tool
     */
    initShapeComposer() {
      const toolArea = document.getElementById('tool-area');
      toolArea.innerHTML = `
        <div class="shape-tool">
          <h4>Shape Type</h4>
          <select id="shape-type">
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="star">Star</option>
            <option value="polygon">Polygon</option>
            <option value="custom">Custom SVG</option>
          </select>
          
          <div id="shape-options">
            <!-- Dynamic options will be loaded here -->
          </div>
          
          <h4>Appearance</h4>
          <div class="appearance-options">
            <div>
              <label>Fill Color</label>
              <input type="color" id="shape-fill" value="#3a86ff">
            </div>
            <div>
              <label>Stroke Color</label>
              <input type="color" id="shape-stroke" value="#000000">
            </div>
            <div>
              <label>Stroke Width</label>
              <input type="range" id="shape-stroke-width" min="0" max="10" value="2">
            </div>
          </div>
        </div>
      `;
      
      // Set up event listeners
      document.getElementById('shape-type').addEventListener('change', () => {
        this.updateShapeOptions();
        this.updateShapePreview();
      });
      
      // Initial options
      this.updateShapeOptions();
      
      // Appearance listeners
      document.getElementById('shape-fill').addEventListener('input', () => this.updateShapePreview());
      document.getElementById('shape-stroke').addEventListener('input', () => this.updateShapePreview());
      document.getElementById('shape-stroke-width').addEventListener('input', () => this.updateShapePreview());
      
      // Initial preview
      this.updateShapePreview();
    }
  
    /**
     * Update shape options based on selected type
     */
    updateShapeOptions() {
      const shapeType = document.getElementById('shape-type').value;
      const optionsArea = document.getElementById('shape-options');
      
      let optionsHTML = '';
      
      switch (shapeType) {
        case 'polygon':
          optionsHTML = `
            <h4>Polygon Options</h4>
            <div>
              <label>Sides</label>
              <input type="number" id="shape-sides" min="3" max="12" value="6">
            </div>
            <div>
              <label>Radius</label>
              <input type="range" id="shape-radius" min="50" max="200" value="100">
            </div>
          `;
          break;
        case 'star':
          optionsHTML = `
            <h4>Star Options</h4>
            <div>
              <label>Points</label>
              <input type="number" id="shape-points" min="5" max="12" value="5">
            </div>
            <div>
              <label>Inner Radius</label>
              <input type="range" id="shape-inner-radius" min="10" max="90" value="40">
            </div>
            <div>
              <label>Outer Radius</label>
              <input type="range" id="shape-outer-radius" min="50" max="200" value="100">
            </div>
          `;
          break;
        case 'custom':
          optionsHTML = `
            <h4>Custom SVG</h4>
            <textarea id="custom-svg" placeholder="Paste SVG path data here"></textarea>
          `;
          break;
        default:
          optionsHTML = `
            <h4>${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Options</h4>
            <div>
              <label>Size</label>
              <input type="range" id="shape-size" min="50" max="200" value="100">
            </div>
          `;
      }
      
      optionsArea.innerHTML = optionsHTML;
      
      // Add event listeners to new inputs
      if (shapeType === 'polygon') {
        document.getElementById('shape-sides').addEventListener('input', () => this.updateShapePreview());
        document.getElementById('shape-radius').addEventListener('input', () => this.updateShapePreview());
      } else if (shapeType === 'star') {
        document.getElementById('shape-points').addEventListener('input', () => this.updateShapePreview());
        document.getElementById('shape-inner-radius').addEventListener('input', () => this.updateShapePreview());
        document.getElementById('shape-outer-radius').addEventListener('input', () => this.updateShapePreview());
      } else if (shapeType === 'custom') {
        document.getElementById('custom-svg').addEventListener('input', () => this.updateShapePreview());
      } else {
        document.getElementById('shape-size').addEventListener('input', () => this.updateShapePreview());
      }
    }
  
    /**
     * Update shape preview
     */
    updateShapePreview() {
      const shapeType = document.getElementById('shape-type').value;
      const fillColor = document.getElementById('shape-fill').value;
      const strokeColor = document.getElementById('shape-stroke').value;
      const strokeWidth = document.getElementById('shape-stroke-width').value;
      
      let pathData = '';
      let viewBox = '0 0 200 200';
      
      switch (shapeType) {
        case 'polygon':
          const sides = parseInt(document.getElementById('shape-sides').value);
          const radius = parseInt(document.getElementById('shape-radius').value);
          pathData = shapesAPI.generatePolygon(sides, { radius });
          break;
        case 'star':
          const points = parseInt(document.getElementById('shape-points').value);
          const innerRadius = parseInt(document.getElementById('shape-inner-radius').value);
          const outerRadius = parseInt(document.getElementById('shape-outer-radius').value);
          pathData = shapesAPI.generateStar(points, { innerRadius, outerRadius });
          break;
        case 'custom':
          pathData = document.getElementById('custom-svg').value;
          if (!pathData) {
            pathData = shapesAPI.generateShape('circle');
          }
          break;
        default:
          const size = parseInt(document.getElementById('shape-size').value);
          pathData = shapesAPI.generateShape(shapeType, { size });
      }
      
      // Update preview
      const preview = document.getElementById('preview-display');
      preview.innerHTML = `
        <svg viewBox="${viewBox}" width="100%" height="100%">
          <path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        </svg>
      `;
      
      // Update code output
      this.updateCodeOutput({
        type: 'shape',
        shapeType,
        fillColor,
        strokeColor,
        strokeWidth,
        pathData,
        viewBox
      });
    }
  
    /**
     * Initialize animation lab tool
     */
    initAnimationLab() {
      const toolArea = document.getElementById('tool-area');
      toolArea.innerHTML = `
        <div class="animation-tool">
          <h4>Animation Type</h4>
          <select id="animation-type">
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="rotate">Rotate</option>
            <option value="bounce">Bounce</option>
          </select>
          
          <div id="animation-options">
            <!-- Dynamic options will be loaded here -->
          </div>
          
          <h4>Timing</h4>
          <div class="timing-options">
            <div>
              <label>Duration (ms)</label>
              <input type="range" id="animation-duration" min="100" max="2000" value="500">
            </div>
            <div>
              <label>Delay (ms)</label>
              <input type="range" id="animation-delay" min="0" max="1000" value="0">
            </div>
            <div>
              <label>Easing</label>
              <select id="animation-easing">
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
          </div>
          
          <button id="play-animation">Play Animation</button>
        </div>
      `;
      
      // Set up event listeners
      document.getElementById('animation-type').addEventListener('change', () => {
        this.updateAnimationOptions();
      });
      
      document.getElementById('play-animation').addEventListener('click', () => {
        this.playAnimation();
      });
      
      // Initial options
      this.updateAnimationOptions();
      
      // Create preview element
      const preview = document.getElementById('preview-display');
      preview.innerHTML = '<div class="animation-target">Animate Me!</div>';
      
      // Update code output
      this.updateCodeOutput({
        type: 'animation',
        animationType: 'fade',
        duration: 500,
        delay: 0,
        easing: 'ease'
      });
    }
  
    /**
     * Update animation options based on selected type
     */
    updateAnimationOptions() {
      const animationType = document.getElementById('animation-type').value;
      const optionsArea = document.getElementById('animation-options');
      
      let optionsHTML = '';
      
      switch (animationType) {
        case 'slide':
          optionsHTML = `
            <h4>Slide Options</h4>
            <div>
              <label>Direction</label>
              <select id="slide-direction">
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </div>
            <div>
              <label>Distance (px)</label>
              <input type="range" id="slide-distance" min="20" max="200" value="50">
            </div>
          `;
          break;
        case 'scale':
          optionsHTML = `
            <h4>Scale Options</h4>
            <div>
              <label>From Scale</label>
              <input type="range" id="scale-from" min="0" max="100" value="0">
            </div>
            <div>
              <label>To Scale</label>
              <input type="range" id="scale-to" min="50" max="150" value="100">
            </div>
          `;
          break;
        case 'rotate':
          optionsHTML = `
            <h4>Rotate Options</h4>
            <div>
              <label>From Angle</label>
              <input type="range" id="rotate-from" min="0" max="360" value="0">
            </div>
            <div>
              <label>To Angle</label>
              <input type="range" id="rotate-to" min="0" max="360" value="360">
            </div>
          `;
          break;
        case 'bounce':
          optionsHTML = `
            <h4>Bounce Options</h4>
            <div>
              <label>Height (px)</label>
              <input type="range" id="bounce-height" min="10" max="100" value="30">
            </div>
            <div>
              <label>Bounces</label>
              <input type="range" id="bounce-count" min="1" max="5" value="2">
            </div>
          `;
          break;
        default: // fade
          optionsHTML = `
            <h4>Fade Options</h4>
            <div>
              <label>From Opacity</label>
              <input type="range" id="fade-from" min="0" max="100" value="0">
            </div>
            <div>
              <label>To Opacity</label>
              <input type="range" id="fade-to" min="0" max="100" value="100">
            </div>
          `;
      }
      
      optionsArea.innerHTML = optionsHTML;
      
      // Add event listeners to new inputs
      const inputIds = [
        'slide-direction', 'slide-distance',
        'scale-from', 'scale-to',
        'rotate-from', 'rotate-to',
        'bounce-height', 'bounce-count',
        'fade-from', 'fade-to'
      ];
      
      inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            this.updateCodeOutput(this.getAnimationConfig());
          });
        }
      });
      
      // Update code output
      this.updateCodeOutput(this.getAnimationConfig());
    }
  
    /**
     * Play the animation
     */
    playAnimation() {
      const config = this.getAnimationConfig();
      const target = document.querySelector('.animation-target');
      
      // Reset animation
      target.style.animation = 'none';
      target.offsetHeight; // Trigger reflow
      
      // Apply animation
      let animation = '';
      
      switch (config.animationType) {
        case 'fade':
          target.style.opacity = config.fadeFrom / 100;
          animation = `fade ${config.duration}ms ${config.easing} ${config.delay}ms forwards`;
          break;
        case 'slide':
          target.style.transform = `translate${this.getSlideAxis(config.slideDirection)}(${config.slideDistance * (config.slideDirection === 'left' || config.slideDirection === 'up' ? -1 : 1)}px)`;
          animation = `slide ${config.duration}ms ${config.easing} ${config.delay}ms forwards`;
          break;
        case 'scale':
          target.style.transform = `scale(${config.scaleFrom / 100})`;
          animation = `scale ${config.duration}ms ${config.easing} ${config.delay}ms forwards`;
          break;
        case 'rotate':
          target.style.transform = `rotate(${config.rotateFrom}deg)`;
          animation = `rotate ${config.duration}ms ${config.easing} ${config.delay}ms forwards`;
          break;
        case 'bounce':
          animation = `bounce ${config.duration}ms ${config.easing} ${config.delay}ms ${config.bounceCount} times`;
          break;
      }
      
      target.style.animation = animation;
      
      // Define keyframes dynamically
      this.defineKeyframes(config);
    }
  
    /**
     * Get slide axis for transform
     */
    getSlideAxis(direction) {
      return direction === 'left' || direction === 'right' ? 'X' : 'Y';
    }
  
    /**
     * Define CSS keyframes for animation
     */
    defineKeyframes(config) {
      let style = document.getElementById('dynamic-keyframes');
      if (!style) {
        style = document.createElement('style');
        style.id = 'dynamic-keyframes';
        document.head.appendChild(style);
      }
      
      let keyframes = '';
      
      switch (config.animationType) {
        case 'fade':
          keyframes = `
            @keyframes fade {
              to { opacity: ${config.fadeTo / 100}; }
            }
          `;
          break;
        case 'slide':
          const axis = this.getSlideAxis(config.slideDirection);
          keyframes = `
            @keyframes slide {
              to { transform: translate${axis}(0); }
            }
          `;
          break;
        case 'scale':
          keyframes = `
            @keyframes scale {
              to { transform: scale(${config.scaleTo / 100}); }
            }
          `;
          break;
        case 'rotate':
          keyframes = `
            @keyframes rotate {
              to { transform: rotate(${config.rotateTo}deg); }
            }
          `;
          break;
        case 'bounce':
          keyframes = `
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-${config.bounceHeight}px); }
            }
          `;
          break;
      }
      
      style.textContent = keyframes;
    }
  
    /**
     * Get current animation configuration
     */
    getAnimationConfig() {
      const animationType = document.getElementById('animation-type').value;
      const duration = parseInt(document.getElementById('animation-duration').value);
      const delay = parseInt(document.getElementById('animation-delay').value);
      const easing = document.getElementById('animation-easing').value;
      
      const config = {
        type: 'animation',
        animationType,
        duration,
        delay,
        easing
      };
      
      switch (animationType) {
        case 'fade':
          config.fadeFrom = parseInt(document.getElementById('fade-from').value);
          config.fadeTo = parseInt(document.getElementById('fade-to').value);
          break;
        case 'slide':
          config.slideDirection = document.getElementById('slide-direction').value;
          config.slideDistance = parseInt(document.getElementById('slide-distance').value);
          break;
        case 'scale':
          config.scaleFrom = parseInt(document.getElementById('scale-from').value);
          config.scaleTo = parseInt(document.getElementById('scale-to').value);
          break;
        case 'rotate':
          config.rotateFrom = parseInt(document.getElementById('rotate-from').value);
          config.rotateTo = parseInt(document.getElementById('rotate-to').value);
          break;
        case 'bounce':
          config.bounceHeight = parseInt(document.getElementById('bounce-height').value);
          config.bounceCount = parseInt(document.getElementById('bounce-count').value);
          break;
      }
      
      return config;
    }
  
    /**
     * Update code output
     */
    updateCodeOutput(config) {
      const codeOutput = document.getElementById('code-output');
      let code = '';
      
      switch (config.type) {
        case 'color':
          code = `/* CSS Variables */
  :root {
  ${config.colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}
  }
  
  /* Usage example */
  .element {
    background-color: var(--color-1);
    color: var(--color-${config.colors.length > 2 ? 2 : 1});
  }`;
          break;
        case 'shape':
          code = `/* SVG Code */
  <svg viewBox="${config.viewBox}" width="200" height="200">
    <path d="${config.pathData}" 
          fill="${config.fillColor}" 
          stroke="${config.strokeColor}" 
          stroke-width="${config.strokeWidth}"/>
  </svg>
  
  /* CSS Alternative */
  .element {
    width: 200px;
    height: 200px;
    background-color: ${config.fillColor};
    ${config.shapeType === 'circle' ? 'border-radius: 50%;' : ''}
  }`;
          break;
        case 'animation':
          code = `/* CSS Animation */
  @keyframes ${config.animationType} {
    ${this.getKeyframeCss(config)}
  }
  
  .element {
    animation: ${config.animationType} ${config.duration}ms ${config.easing} ${config.delay}ms forwards;
  }`;
          break;
      }
      
      codeOutput.textContent = code;
      
      // Highlight syntax (if Prism.js is available)
      if (window.Prism) {
        Prism.highlightElement(codeOutput);
      }
    }
  
    /**
     * Get keyframe CSS for animation
     */
    getKeyframeCss(config) {
      switch (config.animationType) {
        case 'fade':
          return `from { opacity: ${config.fadeFrom / 100}; }
    to { opacity: ${config.fadeTo / 100}; }`;
        case 'slide':
          const axis = this.getSlideAxis(config.slideDirection);
          return `from { transform: translate${axis}(${config.slideDistance * (config.slideDirection === 'left' || config.slideDirection === 'up' ? -1 : 1)}px); }
    to { transform: translate${axis}(0); }`;
        case 'scale':
          return `from { transform: scale(${config.scaleFrom / 100}); }
    to { transform: scale(${config.scaleTo / 100}); }`;
        case 'rotate':
          return `from { transform: rotate(${config.rotateFrom}deg); }
    to { transform: rotate(${config.rotateTo}deg); }`;
        case 'bounce':
          return `0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-${config.bounceHeight}px); }`;
        default:
          return '';
      }
    }
  
    /**
     * Export generated code
     */
    exportCode() {
      const code = document.getElementById('code-output').textContent;
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'playground-code.css';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    /**
     * Copy code to clipboard
     */
    copyCode() {
      const code = document.getElementById('code-output').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const button = document.getElementById('copy-code');
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
    }
  
    /**
     * Save current work to localStorage
     */
    saveWork() {
      const state = {
        tool: this.currentTool,
        color: this.currentTool === 'color' ? {
          baseColor: document.getElementById('playground-color').value,
          harmonyType: document.getElementById('color-harmony').value,
          includeShades: document.getElementById('include-shades').checked
        } : null,
        shape: this.currentTool === 'shape' ? {
          shapeType: document.getElementById('shape-type').value,
          fillColor: document.getElementById('shape-fill').value,
          strokeColor: document.getElementById('shape-stroke').value,
          strokeWidth: document.getElementById('shape-stroke-width').value,
          customOptions: this.getShapeCustomOptions()
        } : null,
        animation: this.currentTool === 'animation' ? this.getAnimationConfig() : null,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('playgroundState', JSON.stringify(state));
      
      // Show confirmation
      const button = document.getElementById('save-work');
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = 'Save';
      }, 2000);
    }
  
    /**
     * Get shape custom options
     */
    getShapeCustomOptions() {
      const shapeType = document.getElementById('shape-type').value;
      const options = {};
      
      switch (shapeType) {
        case 'polygon':
          options.sides = document.getElementById('shape-sides').value;
          options.radius = document.getElementById('shape-radius').value;
          break;
        case 'star':
          options.points = document.getElementById('shape-points').value;
          options.innerRadius = document.getElementById('shape-inner-radius').value;
          options.outerRadius = document.getElementById('shape-outer-radius').value;
          break;
        case 'custom':
          options.customSvg = document.getElementById('custom-svg').value;
          break;
        default:
          options.size = document.getElementById('shape-size').value;
      }
      
      return options;
    }
  
    /**
     * Load saved work from localStorage
     */
    loadSavedWork() {
      const saved = localStorage.getItem('playgroundState');
      if (!saved) return;
      
      const state = JSON.parse(saved);
      
      // Switch to saved tool
      this.switchTool(state.tool);
      
      // Restore settings after a delay to allow UI to initialize
      setTimeout(() => {
        if (state.tool === 'color' && state.color) {
          document.getElementById('playground-color').value = state.color.baseColor;
          document.getElementById('color-harmony').value = state.color.harmonyType;
          document.getElementById('include-shades').checked = state.color.includeShades;
          this.updateColorPreview(state.color.baseColor);
        } else if (state.tool === 'shape' && state.shape) {
          document.getElementById('shape-type').value = state.shape.shapeType;
          this.updateShapeOptions();
          
          setTimeout(() => {
            document.getElementById('shape-fill').value = state.shape.fillColor;
            document.getElementById('shape-stroke').value = state.shape.strokeColor;
            document.getElementById('shape-stroke-width').value = state.shape.strokeWidth;
            
            const options = state.shape.customOptions;
            switch (state.shape.shapeType) {
              case 'polygon':
                document.getElementById('shape-sides').value = options.sides;
                document.getElementById('shape-radius').value = options.radius;
                break;
              case 'star':
                document.getElementById('shape-points').value = options.points;
                document.getElementById('shape-inner-radius').value = options.innerRadius;
                document.getElementById('shape-outer-radius').value = options.outerRadius;
                break;
              case 'custom':
                document.getElementById('custom-svg').value = options.customSvg;
                break;
              default:
                document.getElementById('shape-size').value = options.size;
            }
            
            this.updateShapePreview();
          }, 50);
        } else if (state.tool === 'animation' && state.animation) {
          document.getElementById('animation-type').value = state.animation.animationType;
          this.updateAnimationOptions();
          
          setTimeout(() => {
            document.getElementById('animation-duration').value = state.animation.duration;
            document.getElementById('animation-delay').value = state.animation.delay;
            document.getElementById('animation-easing').value = state.animation.easing;
            
            switch (state.animation.animationType) {
              case 'fade':
                document.getElementById('fade-from').value = state.animation.fadeFrom;
                document.getElementById('fade-to').value = state.animation.fadeTo;
                break;
              case 'slide':
                document.getElementById('slide-direction').value = state.animation.slideDirection;
                document.getElementById('slide-distance').value = state.animation.slideDistance;
                break;
              case 'scale':
                document.getElementById('scale-from').value = state.animation.scaleFrom;
                document.getElementById('scale-to').value = state.animation.scaleTo;
                break;
              case 'rotate':
                document.getElementById('rotate-from').value = state.animation.rotateFrom;
                document.getElementById('rotate-to').value = state.animation.rotateTo;
                break;
              case 'bounce':
                document.getElementById('bounce-height').value = state.animation.bounceHeight;
                document.getElementById('bounce-count').value = state.animation.bounceCount;
                break;
            }
            
            this.updateCodeOutput(state.animation);
          }, 50);
        }
      }, 100);
    }
  
    /**
     * Reset playground to default state
     */
    resetPlayground() {
      if (confirm('Are you sure you want to reset the playground? All unsaved changes will be lost.')) {
        localStorage.removeItem('playgroundState');
        location.reload();
      }
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const playground = new Playground();
    
    // Make available globally
    window.playground = playground;
  });
  
  // Export for module usage
  export const playground = new Playground();