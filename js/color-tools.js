import { colorsAPI } from './api/colors-api.js';

/**
 * Advanced Color Tools with UI/UX Focus
 * Features: Color picker, palette generator, contrast checker
 */
class ColorTools {
  constructor() {
    this.initColorPicker();
    this.initPaletteGenerator();
    this.initContrastChecker();
    this.initColorBlender();
    this.initThemesGenerator();
    
    // Set up event listeners for dark mode changes
    document.addEventListener('darkmode:change', (e) => {
      this.updateColorToolUI(e.detail.isDarkMode);
    });
  }

  /**
   * Initialize color picker component
   */
  initColorPicker() {
    this.colorPicker = document.createElement('div');
    this.colorPicker.className = 'color-tool color-picker';
    this.colorPicker.innerHTML = `
      <h3>Color Picker</h3>
      <div class="color-picker-container">
        <input type="color" id="base-color" value="#3a86ff">
        <div class="color-values">
          <div class="color-value">
            <label>HEX</label>
            <input type="text" id="hex-value" value="#3a86ff">
          </div>
          <div class="color-value">
            <label>RGB</label>
            <input type="text" id="rgb-value" value="rgb(58, 134, 255)">
          </div>
          <div class="color-value">
            <label>HSL</label>
            <input type="text" id="hsl-value" value="hsl(216, 100%, 61%)">
          </div>
        </div>
        <div class="color-preview" id="color-preview" style="background-color: #3a86ff;"></div>
      </div>
    `;
    
    // Add to DOM
    document.getElementById('color-tools-container').appendChild(this.colorPicker);
    
    // Set up event listeners
    document.getElementById('base-color').addEventListener('input', (e) => {
      this.updateColorValues(e.target.value);
    });
    
    // Add input listeners for manual color value entry
    ['hex-value', 'rgb-value', 'hsl-value'].forEach(id => {
      document.getElementById(id).addEventListener('change', (e) => {
        try {
          const color = e.target.value;
          const rgb = colorsAPI.parseColor(color);
          const hex = colorsAPI.rgbToHex(rgb.r, rgb.g, rgb.b);
          this.updateColorValues(hex);
          document.getElementById('base-color').value = hex;
        } catch (error) {
          console.error('Invalid color format');
        }
      });
    });
  }

  /**
   * Update all color values when base color changes
   */
  updateColorValues(hexColor) {
    const rgb = colorsAPI.hexToRgb(hexColor);
    const hsl = colorsAPI.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Update inputs
    document.getElementById('hex-value').value = hexColor;
    document.getElementById('rgb-value').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('hsl-value').value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    
    // Update preview
    document.getElementById('color-preview').style.backgroundColor = hexColor;
    
    // Update text color for contrast
    const textColor = colorsAPI.getAccessibleTextColor(hexColor);
    document.getElementById('color-preview').style.color = textColor;
    document.getElementById('color-preview').textContent = hexColor;
    
    // Dispatch event for other components to react to color change
    document.dispatchEvent(new CustomEvent('color:changed', {
      detail: { color: hexColor }
    }));
  }

  /**
   * Initialize palette generator
   */
  initPaletteGenerator() {
    this.paletteGenerator = document.createElement('div');
    this.paletteGenerator.className = 'color-tool palette-generator';
    this.paletteGenerator.innerHTML = `
      <h3>Palette Generator</h3>
      <div class="palette-options">
        <select id="harmony-type">
          <option value="complementary">Complementary</option>
          <option value="analogous">Analogous</option>
          <option value="triadic">Triadic</option>
          <option value="tetradic">Tetradic</option>
          <option value="square">Square</option>
          <option value="splitComplementary">Split Complementary</option>
          <option value="monochromatic">Monochromatic</option>
          <option value="random">Random</option>
        </select>
        <button id="generate-palette">Generate</button>
      </div>
      <div class="palette-preview" id="palette-preview">
        <div class="palette-color" style="background-color: #3a86ff;"></div>
      </div>
      <div class="palette-actions">
        <button id="export-palette">Export as CSS</button>
        <button id="save-palette">Save Palette</button>
      </div>
    `;
    
    // Add to DOM
    document.getElementById('color-tools-container').appendChild(this.paletteGenerator);
    
    // Event listeners
    document.getElementById('generate-palette').addEventListener('click', () => {
      const baseColor = document.getElementById('base-color').value;
      const harmonyType = document.getElementById('harmony-type').value;
      this.generatePalette(baseColor, harmonyType);
    });
    
    document.getElementById('export-palette').addEventListener('click', this.exportPalette);
    document.getElementById('save-palette').addEventListener('click', this.savePalette);
    
    // Generate initial palette
    this.generatePalette('#3a86ff', 'complementary');
  }

  /**
   * Generate and display a color palette
   */
  generatePalette(baseColor, harmonyType) {
    let palette;
    
    if (harmonyType === 'monochromatic') {
      palette = colorsAPI.generateMonochromatic(baseColor);
    } else if (harmonyType === 'random') {
      palette = colorsAPI.generateRandomPalette();
    } else {
      palette = colorsAPI.generateHarmony(baseColor, harmonyType);
    }
    
    // Update palette preview
    const preview = document.getElementById('palette-preview');
    preview.innerHTML = '';
    
    palette.forEach(color => {
      const colorEl = document.createElement('div');
      colorEl.className = 'palette-color';
      colorEl.style.backgroundColor = color;
      colorEl.textContent = color;
      
      // Set text color for contrast
      const textColor = colorsAPI.getAccessibleTextColor(color);
      colorEl.style.color = textColor;
      
      // Add click to copy functionality
      colorEl.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        colorEl.classList.add('copied');
        setTimeout(() => colorEl.classList.remove('copied'), 1000);
      });
      
      preview.appendChild(colorEl);
    });
    
    // Save current palette
    this.currentPalette = palette;
  }

  /**
   * Export palette as CSS variables
   */
  exportPalette() {
    if (!this.currentPalette || this.currentPalette.length === 0) return;
    
    let css = ':root {\n';
    this.currentPalette.forEach((color, index) => {
      css += `  --color-${index + 1}: ${color};\n`;
    });
    css += '}';
    
    // Create download
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Save palette to localStorage
   */
  savePalette() {
    if (!this.currentPalette || this.currentPalette.length === 0) return;
    
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    savedPalettes.push({
      colors: this.currentPalette,
      date: new Date().toISOString()
    });
    
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    
    // Show confirmation
    const button = document.getElementById('save-palette');
    button.textContent = 'Saved!';
    setTimeout(() => {
      button.textContent = 'Save Palette';
    }, 2000);
  }

  /**
   * Initialize contrast checker
   */
  initContrastChecker() {
    this.contrastChecker = document.createElement('div');
    this.contrastChecker.className = 'color-tool contrast-checker';
    this.contrastChecker.innerHTML = `
      <h3>Contrast Checker</h3>
      <div class="contrast-inputs">
        <div class="contrast-color">
          <label>Foreground</label>
          <input type="color" id="foreground-color" value="#ffffff">
        </div>
        <div class="contrast-color">
          <label>Background</label>
          <input type="color" id="background-color" value="#3a86ff">
        </div>
      </div>
      <div class="contrast-results">
        <div class="contrast-ratio">
          <span>Ratio:</span>
          <strong id="contrast-ratio">4.56:1</strong>
        </div>
        <div class="contrast-rating">
          <span>WCAG:</span>
          <strong id="contrast-rating">AA</strong>
        </div>
      </div>
      <div class="contrast-preview" id="contrast-preview">
        <p style="color: #ffffff; background-color: #3a86ff;">
          Sample text for contrast preview
        </p>
      </div>
    `;
    
    // Add to DOM
    document.getElementById('color-tools-container').appendChild(this.contrastChecker);
    
    // Event listeners
    document.getElementById('foreground-color').addEventListener('input', this.updateContrastCheck);
    document.getElementById('background-color').addEventListener('input', this.updateContrastCheck);
    
    // Initial update
    this.updateContrastCheck();
  }

  /**
   * Update contrast checker results
   */
  updateContrastCheck() {
    const fgColor = document.getElementById('foreground-color').value;
    const bgColor = document.getElementById('background-color').value;
    
    // Update preview
    const preview = document.getElementById('contrast-preview');
    preview.querySelector('p').style.color = fgColor;
    preview.querySelector('p').style.backgroundColor = bgColor;
    
    // Calculate contrast ratio
    const ratio = colorsAPI.getContrastRatio(fgColor, bgColor);
    document.getElementById('contrast-ratio').textContent = ratio.toFixed(2) + ':1';
    
    // Determine WCAG compliance
    let rating = '';
    if (ratio >= 7) {
      rating = 'AAA (Large & Normal)';
    } else if (ratio >= 4.5) {
      rating = 'AA (Normal), AAA (Large)';
    } else if (ratio >= 3) {
      rating = 'AA (Large)';
    } else {
      rating = 'Fail';
    }
    
    document.getElementById('contrast-rating').textContent = rating;
    
    // Update rating color
    const ratingEl = document.getElementById('contrast-rating');
    ratingEl.className = '';
    if (rating.includes('AAA')) {
      ratingEl.classList.add('rating-aaa');
    } else if (rating.includes('AA')) {
      ratingEl.classList.add('rating-aa');
    } else {
      ratingEl.classList.add('rating-fail');
    }
  }

  /**
   * Initialize color blender
   */
  initColorBlender() {
    this.colorBlender = document.createElement('div');
    this.colorBlender.className = 'color-tool color-blender';
    this.colorBlender.innerHTML = `
      <h3>Color Blender</h3>
      <div class="blender-inputs">
        <input type="color" id="blend-color-1" value="#3a86ff">
        <input type="range" id="blend-ratio" min="0" max="100" value="50">
        <input type="color" id="blend-color-2" value="#ff006e">
      </div>
      <div class="blender-result">
        <div class="blended-color" id="blended-color" style="background-color: #9d436b;"></div>
        <div class="blended-value" id="blended-value">#9D436B</div>
      </div>
    `;
    
    // Add to DOM
    document.getElementById('color-tools-container').appendChild(this.colorBlender);
    
    // Event listeners
    document.getElementById('blend-color-1').addEventListener('input', this.updateColorBlend);
    document.getElementById('blend-color-2').addEventListener('input', this.updateColorBlend);
    document.getElementById('blend-ratio').addEventListener('input', this.updateColorBlend);
    
    // Initial update
    this.updateColorBlend();
  }

  /**
   * Update color blender result
   */
  updateColorBlend() {
    const color1 = document.getElementById('blend-color-1').value;
    const color2 = document.getElementById('blend-color-2').value;
    const ratio = document.getElementById('blend-ratio').value / 100;
    
    // Blend colors
    const blended = colorsAPI.blendColors(color1, color2, ratio);
    
    // Update display
    document.getElementById('blended-color').style.backgroundColor = blended;
    document.getElementById('blended-value').textContent = blended.toUpperCase();
    
    // Update text color for contrast
    const textColor = colorsAPI.getAccessibleTextColor(blended);
    document.getElementById('blended-value').style.color = textColor;
  }

  /**
   * Initialize themes generator
   */
  initThemesGenerator() {
    this.themesGenerator = document.createElement('div');
    this.themesGenerator.className = 'color-tool themes-generator';
    this.themesGenerator.innerHTML = `
      <h3>Themes Generator</h3>
      <div class="theme-options">
        <select id="theme-type">
          <option value="default">Default</option>
          <option value="material">Material Design</option>
          <option value="pastel">Pastel</option>
        </select>
        <button id="generate-theme">Generate</button>
      </div>
      <div class="theme-preview" id="theme-preview"></div>
      <div class="theme-actions">
        <button id="export-theme">Export as CSS</button>
        <button id="apply-theme">Apply to Page</button>
      </div>
    `;
    
    // Add to DOM
    document.getElementById('color-tools-container').appendChild(this.themesGenerator);
    
    // Event listeners
    document.getElementById('generate-theme').addEventListener('click', () => {
      const baseColor = document.getElementById('base-color').value;
      const themeType = document.getElementById('theme-type').value;
      this.generateTheme(baseColor, themeType);
    });
    
    document.getElementById('export-theme').addEventListener('click', this.exportTheme);
    document.getElementById('apply-theme').addEventListener('click', this.applyTheme);
    
    // Generate initial theme
    this.generateTheme('#3a86ff', 'default');
  }

  /**
   * Generate and display a color theme
   */
  generateTheme(baseColor, themeType) {
    const theme = colorsAPI.generateColorScheme(baseColor, themeType);
    this.currentTheme = theme;
    
    // Update theme preview
    const preview = document.getElementById('theme-preview');
    preview.innerHTML = '';
    
    Object.entries(theme).forEach(([name, color]) => {
      const colorEl = document.createElement('div');
      colorEl.className = 'theme-color';
      
      const nameEl = document.createElement('span');
      nameEl.className = 'theme-color-name';
      nameEl.textContent = name;
      
      const valueEl = document.createElement('span');
      valueEl.className = 'theme-color-value';
      valueEl.textContent = color;
      
      colorEl.appendChild(nameEl);
      colorEl.appendChild(valueEl);
      colorEl.style.backgroundColor = color;
      
      // Set text color for contrast
      const textColor = colorsAPI.getAccessibleTextColor(color);
      nameEl.style.color = textColor;
      valueEl.style.color = textColor;
      
      preview.appendChild(colorEl);
    });
  }

  /**
   * Export theme as CSS variables
   */
  exportTheme() {
    if (!this.currentTheme) return;
    
    let css = ':root {\n';
    Object.entries(this.currentTheme).forEach(([name, color]) => {
      css += `  --color-${name.toLowerCase()}: ${color};\n`;
    });
    css += '}';
    
    // Create download
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-theme.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Apply theme to current page
   */
  applyTheme() {
    if (!this.currentTheme) return;
    
    let style = document.getElementById('dynamic-theme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dynamic-theme';
      document.head.appendChild(style);
    }
    
    let css = ':root {\n';
    Object.entries(this.currentTheme).forEach(([name, color]) => {
      css += `  --color-${name.toLowerCase()}: ${color};\n`;
    });
    css += '}';
    
    style.textContent = css;
    
    // Show confirmation
    const button = document.getElementById('apply-theme');
    button.textContent = 'Applied!';
    setTimeout(() => {
      button.textContent = 'Apply to Page';
    }, 2000);
  }

  /**
   * Update UI based on dark mode
   */
  updateColorToolUI(isDarkMode) {
    const container = document.getElementById('color-tools-container');
    if (isDarkMode) {
      container.classList.add('dark-mode');
    } else {
      container.classList.remove('dark-mode');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const colorTools = new ColorTools();
});

// Export for module usage
export const colorTools = new ColorTools();