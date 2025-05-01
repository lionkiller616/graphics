/**
 * Advanced Colors API with UI/UX Focus
 * Features: Color manipulation, contrast checking, palette generation
 */
class ColorsAPI {
  constructor() {
    this.namedColors = {
      aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff',
      // ... (full list of named colors)
    };
    this.colorHarmonies = {
      complementary: 180,
      analogous: 30,
      triadic: 120,
      tetradic: 90,
      square: 90,
      splitComplementary: 150
    };
  }

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  /**
   * Convert RGB to hex
   */
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Convert RGB to HSL
   */
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Convert HSL to RGB
   */
  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Calculate color brightness (0-255)
   */
  getBrightness(r, g, b) {
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  /**
   * Calculate luminance (perceived brightness 0-1)
   */
  getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1, color2) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  }

  /**
   * Check if color pair meets WCAG contrast requirements
   */
  meetsContrast(color1, color2, level = 'AA', size = 'normal') {
    const ratio = this.getContrastRatio(color1, color2);
    const requirements = {
      'A': { 'normal': 4.5, 'large': 3.0 },
      'AA': { 'normal': 4.5, 'large': 3.0 },
      'AAA': { 'normal': 7.0, 'large': 4.5 }
    };
    return ratio >= requirements[level][size];
  }

  /**
   * Parse any color format to RGB
   */
  parseColor(color) {
    // Handle named colors
    if (this.namedColors[color.toLowerCase()]) {
      return this.hexToRgb(this.namedColors[color.toLowerCase()]);
    }
    
    // Handle hex
    if (color.startsWith('#')) {
      return this.hexToRgb(color);
    }
    
    // Handle rgb/rgba
    if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (match) {
        return { r: +match[1], g: +match[2], b: +match[3] };
      }
    }
    
    // Handle hsl/hsla
    if (color.startsWith('hsl')) {
      const match = color.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*[\d.]+)?\)/);
      if (match) {
        const { r, g, b } = this.hslToRgb(+match[1], +match[2], +match[3]);
        return { r, g, b };
      }
    }
    
    throw new Error(`Invalid color format: ${color}`);
  }

  /**
   * Generate color harmony palette
   */
  generateHarmony(baseColor, type = 'complementary') {
    const baseHsl = this.rgbToHsl(...Object.values(this.parseColor(baseColor)));
    const angle = this.colorHarmonies[type] || 180;
    const colors = [baseHsl];
    
    if (type === 'complementary' || type === 'splitComplementary') {
      colors.push({ 
        h: (baseHsl.h + angle) % 360, 
        s: baseHsl.s, 
        l: baseHsl.l 
      });
      
      if (type === 'splitComplementary') {
        colors.push({ 
          h: (baseHsl.h - angle + 360) % 360, 
          s: baseHsl.s, 
          l: baseHsl.l 
        });
      }
    } else if (type === 'triadic') {
      colors.push(
        { h: (baseHsl.h + angle) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + angle * 2) % 360, s: baseHsl.s, l: baseHsl.l }
      );
    } else if (type === 'tetradic' || type === 'square') {
      for (let i = 1; i <= 3; i++) {
        colors.push({ 
          h: (baseHsl.h + angle * i) % 360, 
          s: baseHsl.s, 
          l: baseHsl.l 
        });
      }
    } else if (type === 'analogous') {
      colors.push(
        { h: (baseHsl.h + angle) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h - angle + 360) % 360, s: baseHsl.s, l: baseHsl.l }
      );
    }
    
    return colors.map(hsl => {
      const { r, g, b } = this.hslToRgb(hsl.h, hsl.s, hsl.l);
      return this.rgbToHex(r, g, b);
    });
  }

  /**
   * Generate gradient between two colors
   */
  generateGradient(color1, color2, steps = 10) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    const gradient = [];
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
      gradient.push(this.rgbToHex(r, g, b));
    }
    
    return gradient;
  }

  /**
   * Generate accessible text color for a background
   */
  getAccessibleTextColor(bgColor, lightColor = '#ffffff', darkColor = '#333333', threshold = 0.5) {
    const rgb = this.parseColor(bgColor);
    const luminance = this.getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > threshold ? darkColor : lightColor;
  }

  /**
   * Generate random color palette
   */
  generateRandomPalette(options = {}) {
    const defaults = {
      count: 5,
      hue: null, // Optional fixed hue
      saturationRange: [50, 80],
      lightnessRange: [30, 70],
      avoidSimilar: true
    };
    
    const config = { ...defaults, ...options };
    const palette = [];
    
    for (let i = 0; i < config.count; i++) {
      let h, s, l;
      
      if (config.hue !== null) {
        h = config.hue;
      } else {
        h = Math.floor(Math.random() * 360);
        
        // Avoid colors too similar to existing ones
        if (config.avoidSimilar && palette.length > 0) {
          let attempts = 0;
          while (attempts < 10 && palette.some(color => {
            const existingHsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
            return Math.abs(existingHsl.h - h) < 30;
          })) {
            h = Math.floor(Math.random() * 360);
            attempts++;
          }
        }
      }
      
      s = config.saturationRange[0] + 
          Math.random() * (config.saturationRange[1] - config.saturationRange[0]);
      l = config.lightnessRange[0] + 
          Math.random() * (config.lightnessRange[1] - config.lightnessRange[0]);
      
      const { r, g, b } = this.hslToRgb(h, s, l);
      palette.push(this.rgbToHex(r, g, b));
    }
    
    return palette;
  }

  /**
   * Generate monochromatic palette
   */
  generateMonochromatic(baseColor, steps = 5) {
    const baseHsl = this.rgbToHsl(...Object.values(this.parseColor(baseColor)));
    const palette = [];
    const lightnessStep = (70 - 30) / (steps - 1);
    
    for (let i = 0; i < steps; i++) {
      const l = 30 + i * lightnessStep;
      const { r, g, b } = this.hslToRgb(baseHsl.h, baseHsl.s, l);
      palette.push(this.rgbToHex(r, g, b));
    }
    
    return palette;
  }

  /**
   * Generate color scale (light to dark)
   */
  generateColorScale(baseColor, steps = 9) {
    const baseHsl = this.rgbToHsl(...Object.values(this.parseColor(baseColor)));
    const palette = [];
    const lightnessStep = (95 - 5) / (steps - 1);
    
    for (let i = 0; i < steps; i++) {
      const l = 5 + i * lightnessStep;
      const { r, g, b } = this.hslToRgb(baseHsl.h, baseHsl.s, l);
      palette.push(this.rgbToHex(r, g, b));
    }
    
    return palette;
  }

  /**
   * Blend two colors
   */
  blendColors(color1, color2, ratio = 0.5) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
    
    return this.rgbToHex(r, g, b);
  }

  /**
   * Darken a color
   */
  darken(color, amount = 10) {
    const hsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
    const l = Math.max(0, hsl.l - amount);
    const { r, g, b } = this.hslToRgb(hsl.h, hsl.s, l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Lighten a color
   */
  lighten(color, amount = 10) {
    const hsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
    const l = Math.min(100, hsl.l + amount);
    const { r, g, b } = this.hslToRgb(hsl.h, hsl.s, l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Saturate a color
   */
  saturate(color, amount = 10) {
    const hsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
    const s = Math.min(100, hsl.s + amount);
    const { r, g, b } = this.hslToRgb(hsl.h, s, hsl.l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Desaturate a color
   */
  desaturate(color, amount = 10) {
    const hsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
    const s = Math.max(0, hsl.s - amount);
    const { r, g, b } = this.hslToRgb(hsl.h, s, hsl.l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Adjust color hue
   */
  adjustHue(color, degrees = 10) {
    const hsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
    const h = (hsl.h + degrees) % 360;
    const { r, g, b } = this.hslToRgb(h, hsl.s, hsl.l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Get color temperature (warm/cool)
   */
  getColorTemperature(color) {
    const hsl = this.rgbToHsl(...Object.values(this.parseColor(color)));
    return hsl.h < 60 || hsl.h > 240 ? 'warm' : 'cool';
  }

  /**
   * Generate UI color scheme (primary, secondary, accent, etc.)
   */
  generateColorScheme(baseColor, type = 'default') {
    const schemes = {
      default: {
        primary: baseColor,
        secondary: this.generateHarmony(baseColor, 'complementary')[1],
        accent: this.adjustHue(baseColor, 30),
        neutral: this.desaturate(baseColor, 80),
        success: '#4CAF50',
        warning: '#FFC107',
        danger: '#F44336',
        info: '#2196F3'
      },
      material: {
        primary: baseColor,
        primaryLight: this.lighten(baseColor, 20),
        primaryDark: this.darken(baseColor, 20),
        secondary: this.generateHarmony(baseColor, 'analogous')[1],
        secondaryLight: this.lighten(this.generateHarmony(baseColor, 'analogous')[1], 20),
        secondaryDark: this.darken(this.generateHarmony(baseColor, 'analogous')[1], 20),
        accent: this.generateHarmony(baseColor, 'triadic')[2],
        background: '#f5f5f5',
        surface: '#ffffff',
        error: '#B00020'
      },
      pastel: {
        primary: this.lighten(this.desaturate(baseColor, 30), 30),
        secondary: this.lighten(this.desaturate(this.generateHarmony(baseColor, 'analogous')[1], 30), 30),
        accent: this.lighten(this.desaturate(this.generateHarmony(baseColor, 'complementary')[1], 30), 30),
        light: '#f8f9fa',
        dark: '#343a40'
      }
    };
    
    return schemes[type] || schemes.default;
  }
}

// Export as singleton
export const colorsAPI = new ColorsAPI();