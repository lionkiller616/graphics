/**
 * Advanced Shape Tools with UI/UX Focus
 * Features: Shape generation, morphing, SVG manipulation
 */
class ShapeTools {
    constructor() {
      this.currentShape = null;
      this.init();
    }
  
    /**
     * Initialize shape tools
     */
    init() {
      // Set up UI
      this.setupUI();
      
      // Initialize shape generator
      this.initShapeGenerator();
      
      // Initialize shape morphing
      this.initShapeMorphing();
      
      // Initialize SVG editor
      this.initSVGEditor();
      
      // Load saved shapes if available
      this.loadSavedShapes();
    }
  
    /**
     * Set up shape tools UI
     */
    setupUI() {
      // Create container if it doesn't exist
      if (!document.getElementById('shape-tools-container')) {
        const container = document.createElement('div');
        container.id = 'shape-tools-container';
        container.className = 'shape-tools';
        document.body.appendChild(container);
      }
      
      // Create toolbar
      this.createToolbar();
      
      // Create workspace
      this.createWorkspace();
      
      // Create properties panel
      this.createPropertiesPanel();
    }
  
    /**
     * Create toolbar
     */
    createToolbar() {
      const container = document.getElementById('shape-tools-container');
      
      const toolbar = document.createElement('div');
      toolbar.className = 'shape-toolbar';
      toolbar.innerHTML = `
        <div class="tool-switcher">
          <button class="tool-button active" data-tool="generator">Shape Generator</button>
          <button class="tool-button" data-tool="morph">Shape Morphing</button>
          <button class="tool-button" data-tool="editor">SVG Editor</button>
        </div>
        <div class="tool-actions">
          <button class="action-button" id="export-svg">Export SVG</button>
          <button class="action-button" id="save-shape">Save Shape</button>
          <button class="action-button" id="reset-shapes">Reset</button>
        </div>
      `;
      
      container.appendChild(toolbar);
    }
  
    /**
     * Create workspace
     */
    createWorkspace() {
      const container = document.getElementById('shape-tools-container');
      
      const workspace = document.createElement('div');
      workspace.className = 'shape-workspace';
      workspace.innerHTML = `
        <div class="shape-canvas" id="shape-canvas">
          <!-- Shapes will be rendered here -->
        </div>
        <div class="shape-controls" id="shape-controls">
          <!-- Controls will be loaded here -->
        </div>
      `;
      
      container.appendChild(workspace);
    }
  
    /**
     * Create properties panel
     */
    createPropertiesPanel() {
      const container = document.getElementById('shape-tools-container');
      
      const panel = document.createElement('div');
      panel.className = 'shape-properties';
      panel.innerHTML = `
        <div class="properties-header">
          <h4>Shape Properties</h4>
        </div>
        <div class="properties-form" id="properties-form">
          <!-- Properties will be loaded here -->
        </div>
      `;
      
      container.appendChild(panel);
    }
  
    /**
     * Initialize shape generator
     */
    initShapeGenerator() {
      const controls = document.getElementById('shape-controls');
      controls.innerHTML = `
        <div class="shape-generator-controls">
          <h4>Shape Type</h4>
          <select id="shape-type">
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="pentagon">Pentagon</option>
            <option value="hexagon">Hexagon</option>
            <option value="star">Star</option>
            <option value="heart">Heart</option>
            <option value="polygon">Polygon</option>
            <option value="spiral">Spiral</option>
            <option value="wave">Wave</option>
          </select>
          
          <div id="shape-options">
            <!-- Dynamic options will be loaded here -->
          </div>
        </div>
      `;
      
      // Set up event listeners
      document.getElementById('shape-type').addEventListener('change', () => {
        this.updateShapeOptions();
        this.generateShape();
      });
      
      // Initial options
      this.updateShapeOptions();
      
      // Generate initial shape
      this.generateShape();
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
            <div>
              <label>Rotation</label>
              <input type="range" id="shape-rotation" min="0" max="360" value="0">
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
        case 'spiral':
          optionsHTML = `
            <h4>Spiral Options</h4>
            <div>
              <label>Turns</label>
              <input type="range" id="spiral-turns" min="1" max="5" step="0.5" value="3">
            </div>
            <div>
              <label>Inner Radius</label>
              <input type="range" id="spiral-inner-radius" min="10" max="50" value="20">
            </div>
            <div>
              <label>Outer Radius</label>
              <input type="range" id="spiral-outer-radius" min="50" max="200" value="100">
            </div>
          `;
          break;
        case 'wave':
          optionsHTML = `
            <h4>Wave Options</h4>
            <div>
              <label>Amplitude</label>
              <input type="range" id="wave-amplitude" min="10" max="100" value="30">
            </div>
            <div>
              <label>Wavelength</label>
              <input type="range" id="wave-wavelength" min="20" max="200" value="60">
            </div>
            <div>
              <label>Segments</label>
              <input type="range" id="wave-segments" min="5" max="50" value="20">
            </div>
          `;
          break;
        default:
          optionsHTML = `
            <h4>${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Options</h4>
            <div>
              <label>Size</label>
              <input type="range" id="shape-size" min="50" max="200" value="100">
            </div>
            <div>
              <label>Roundness</label>
              <input type="range" id="shape-roundness" min="0" max="50" value="0">
            </div>
          `;
      }
      
      optionsArea.innerHTML = optionsHTML;
      
      // Add event listeners to new inputs
      const inputIds = [
        'shape-sides', 'shape-radius', 'shape-rotation',
        'shape-points', 'shape-inner-radius', 'shape-outer-radius',
        'spiral-turns', 'spiral-inner-radius', 'spiral-outer-radius',
        'wave-amplitude', 'wave-wavelength', 'wave-segments',
        'shape-size', 'shape-roundness'
      ];
      
      inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            this.generateShape();
          });
        }
      });
    }
  
    /**
     * Generate shape based on current options
     */
    generateShape() {
      const shapeType = document.getElementById('shape-type').value;
      let pathData;
      let viewBox = '0 0 200 200';
      
      switch (shapeType) {
        case 'polygon':
          const sides = parseInt(document.getElementById('shape-sides').value);
          const radius = parseInt(document.getElementById('shape-radius').value);
          const rotation = parseInt(document.getElementById('shape-rotation').value);
          pathData = shapesAPI.generatePolygon(sides, { radius, rotation });
          break;
        case 'star':
          const points = parseInt(document.getElementById('shape-points').value);
          const innerRadius = parseInt(document.getElementById('shape-inner-radius').value);
          const outerRadius = parseInt(document.getElementById('shape-outer-radius').value);
          pathData = shapesAPI.generateStar(points, { innerRadius, outerRadius });
          break;
        case 'spiral':
          const turns = parseFloat(document.getElementById('spiral-turns').value);
          const spiralInnerRadius = parseInt(document.getElementById('spiral-inner-radius').value);
          const spiralOuterRadius = parseInt(document.getElementById('spiral-outer-radius').value);
          pathData = shapesAPI.generateSpiral({ 
            turns, 
            innerRadius: spiralInnerRadius, 
            outerRadius: spiralOuterRadius 
          });
          break;
        case 'wave':
          const amplitude = parseInt(document.getElementById('wave-amplitude').value);
          const wavelength = parseInt(document.getElementById('wave-wavelength').value);
          const segments = parseInt(document.getElementById('wave-segments').value);
          pathData = shapesAPI.generateWave({ 
            amplitude, 
            wavelength, 
            segments 
          });
          break;
        default:
          const size = parseInt(document.getElementById('shape-size').value);
          const roundness = parseInt(document.getElementById('shape-roundness').value);
          pathData = shapesAPI.generateShape(shapeType, { 
            size, 
            rounded: roundness > 0, 
            roundness 
          });
      }
      
      // Update canvas
      this.updateCanvas(pathData, viewBox);
      
      // Update current shape
      this.currentShape = {
        type: shapeType,
        pathData,
        viewBox,
        options: this.getShapeOptions()
      };
      
      // Update properties form
      this.updatePropertiesForm();
    }
  
    /**
     * Get current shape options
     */
    getShapeOptions() {
      const shapeType = document.getElementById('shape-type').value;
      const options = {};
      
      switch (shapeType) {
        case 'polygon':
          options.sides = parseInt(document.getElementById('shape-sides').value);
          options.radius = parseInt(document.getElementById('shape-radius').value);
          options.rotation = parseInt(document.getElementById('shape-rotation').value);
          break;
        case 'star':
          options.points = parseInt(document.getElementById('shape-points').value);
          options.innerRadius = parseInt(document.getElementById('shape-inner-radius').value);
          options.outerRadius = parseInt(document.getElementById('shape-outer-radius').value);
          break;
        case 'spiral':
          options.turns = parseFloat(document.getElementById('spiral-turns').value);
          options.innerRadius = parseInt(document.getElementById('spiral-inner-radius').value);
          options.outerRadius = parseInt(document.getElementById('spiral-outer-radius').value);
          break;
        case 'wave':
          options.amplitude = parseInt(document.getElementById('wave-amplitude').value);
          options.wavelength = parseInt(document.getElementById('wave-wavelength').value);
          options.segments = parseInt(document.getElementById('wave-segments').value);
          break;
        default:
          options.size = parseInt(document.getElementById('shape-size').value);
          options.roundness = parseInt(document.getElementById('shape-roundness').value);
      }
      
      return options;
    }
  
    /**
     * Update canvas with shape
     */
    updateCanvas(pathData, viewBox) {
      const canvas = document.getElementById('shape-canvas');
      canvas.innerHTML = `
        <svg viewBox="${viewBox}" width="100%" height="100%">
          <path d="${pathData}" fill="#3a86ff" stroke="#333" stroke-width="2"/>
        </svg>
      `;
    }
  
    /**
     * Update properties form
     */
    updatePropertiesForm() {
      const form = document.getElementById('properties-form');
      form.innerHTML = `
        <div class="form-group">
          <label>Fill Color</label>
          <input type="color" id="shape-fill" value="#3a86ff">
        </div>
        <div class="form-group">
          <label>Stroke Color</label>
          <input type="color" id="shape-stroke" value="#333333">
        </div>
        <div class="form-group">
          <label>Stroke Width</label>
          <input type="range" id="shape-stroke-width" min="0" max="10" value="2">
        </div>
        <div class="form-group">
          <label>Opacity</label>
          <input type="range" id="shape-opacity" min="0" max="100" value="100">
        </div>
      `;
      
      // Add event listeners
      document.getElementById('shape-fill').addEventListener('input', () => this.updateShapeAppearance());
      document.getElementById('shape-stroke').addEventListener('input', () => this.updateShapeAppearance());
      document.getElementById('shape-stroke-width').addEventListener('input', () => this.updateShapeAppearance());
      document.getElementById('shape-opacity').addEventListener('input', () => this.updateShapeAppearance());
      
      // Initial update
      this.updateShapeAppearance();
    }
  
    /**
     * Update shape appearance based on properties
     */
    updateShapeAppearance() {
      const path = document.querySelector('#shape-canvas path');
      if (!path) return;
      
      path.setAttribute('fill', document.getElementById('shape-fill').value);
      path.setAttribute('stroke', document.getElementById('shape-stroke').value);
      path.setAttribute('stroke-width', document.getElementById('shape-stroke-width').value);
      path.setAttribute('opacity', document.getElementById('shape-opacity').value / 100);
      
      // Update current shape
      if (this.currentShape) {
        this.currentShape.fill = document.getElementById('shape-fill').value;
        this.currentShape.stroke = document.getElementById('shape-stroke').value;
        this.currentShape.strokeWidth = document.getElementById('shape-stroke-width').value;
        this.currentShape.opacity = document.getElementById('shape-opacity').value / 100;
      }
    }
  
    /**
     * Initialize shape morphing
     */
    initShapeMorphing() {
      // This would be implemented similarly to the shape generator
      // but with controls for two shapes and morphing between them
    }
  
    /**
     * Initialize SVG editor
     */
    initSVGEditor() {
      // This would provide a more advanced interface for editing SVG paths directly
    }
  
    /**
     * Export current shape as SVG
     */
    exportSVG() {
      if (!this.currentShape) return;
      
      const svg = `
        <svg viewBox="${this.currentShape.viewBox}" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="${this.currentShape.pathData}" 
            fill="${this.currentShape.fill || '#3a86ff'}" 
            stroke="${this.currentShape.stroke || '#333333'}" 
            stroke-width="${this.currentShape.strokeWidth || 2}" 
            opacity="${this.currentShape.opacity || 1}"
          />
        </svg>
      `;
      
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shape.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    /**
     * Save current shape
     */
    saveShape() {
      if (!this.currentShape) return;
      
      const savedShapes = JSON.parse(localStorage.getItem('savedShapes') || '[]');
      savedShapes.push({
        ...this.currentShape,
        name: `Shape ${savedShapes.length + 1}`,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('savedShapes', JSON.stringify(savedShapes));
      
      // Show confirmation
      const button = document.getElementById('save-shape');
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = 'Save Shape';
      }, 2000);
    }
  
    /**
     * Load saved shapes
     */
    loadSavedShapes() {
      const savedShapes = JSON.parse(localStorage.getItem('savedShapes')) || [];
      if (savedShapes.length > 0) {
        // You might want to implement a shape library panel
        console.log('Loaded saved shapes:', savedShapes);
      }
    }
  
    /**
     * Reset shapes
     */
    resetShapes() {
      if (confirm('Are you sure you want to reset all shapes? This cannot be undone.')) {
        localStorage.removeItem('savedShapes');
        location.reload();
      }
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const shapeTools = new ShapeTools();
    
    // Make available globally
    window.shapeTools = shapeTools;
  });
  
  // Export for module usage
  export const shapeTools = new ShapeTools();