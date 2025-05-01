// Color Tools Section
export function initToolsSection() {
    const toolsSection = document.querySelector('.tools-section');
    
    toolsSection.innerHTML = `
        <h2>Color Tools</h2>
        <p>Interactive tools for working with colors in your designs.</p>
        
        <div class="tools-grid">
            <div class="tool-card">
                <h3><i class="fas fa-eye-dropper"></i> Color Picker</h3>
                <div class="color-picker-container">
                    <input type="color" id="color-picker" value="#4361ee">
                    <div class="color-preview" id="color-preview" style="background: #4361ee; color: white;">#4361ee</div>
                    <div class="color-values">
                        <div class="color-value" id="hex-value">HEX: #4361ee</div>
                        <div class="color-value" id="rgb-value">RGB: 67, 97, 238</div>
                        <div class="color-value" id="hsl-value">HSL: 231°, 83%, 60%</div>
                    </div>
                </div>
            </div>
            
            <div class="tool-card">
                <h3><i class="fas fa-contrast"></i> Contrast Checker</h3>
                <div class="contrast-checker">
                    <div class="contrast-controls">
                        <div>
                            <label for="foreground-color">Text:</label>
                            <input type="color" id="foreground-color" value="#000000">
                        </div>
                        <div>
                            <label for="background-color">Background:</label>
                            <input type="color" id="background-color" value="#ffffff">
                        </div>
                    </div>
                    <div class="contrast-result" id="contrast-ratio">Contrast Ratio: 21.00 (AAA)</div>
                    <div class="contrast-sample" id="contrast-sample" style="background: #ffffff; color: #000000;">
                        Sample Text
                    </div>
                    <div class="contrast-rating" id="contrast-rating">
                        Passes all accessibility standards for normal and large text.
                    </div>
                </div>
            </div>
            
            <div class="tool-card">
                <h3><i class="fas fa-eye"></i> Color Blindness Simulator</h3>
                <div class="blindness-simulator">
                    <input type="color" id="blindness-color" value="#ff0000">
                    <div class="blindness-preview" id="blindness-preview" style="background: #ff0000;">
                        Normal Vision
                    </div>
                    <div class="blindness-types">
                        <div class="blindness-type" data-type="protanopia">Protanopia</div>
                        <div class="blindness-type" data-type="deuteranopia">Deuteranopia</div>
                        <div class="blindness-type" data-type="tritanopia">Tritanopia</div>
                        <div class="blindness-type" data-type="achromatopsia">Achromatopsia</div>
                    </div>
                </div>
            </div>
            
            <div class="tool-card">
                <h3><i class="fas fa-gradient"></i> Gradient Generator</h3>
                <div class="gradient-generator">
                    <div class="gradient-controls">
                        <div>
                            <label for="gradient-color-1">Color 1:</label>
                            <input type="color" id="gradient-color-1" value="#ff0000">
                        </div>
                        <div>
                            <label for="gradient-color-2">Color 2:</label>
                            <input type="color" id="gradient-color-2" value="#0000ff">
                        </div>
                    </div>
                    <div class="gradient-preview" id="gradient-preview" style="background: linear-gradient(90deg, #ff0000, #0000ff);"></div>
                    <div class="gradient-angles">
                        <button data-angle="0">→</button>
                        <button data-angle="45">↗</button>
                        <button data-angle="90">↑</button>
                        <button data-angle="135">↖</button>
                        <button data-angle="180">←</button>
                        <button data-angle="225">↙</button>
                        <button data-angle="270">↓</button>
                        <button data-angle="315">↘</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Color Picker Tool
    const colorPicker = document.getElementById('color-picker');
    const colorPreview = document.getElementById('color-preview');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    
    colorPicker.addEventListener('input', updateColorPicker);
    
    function updateColorPicker() {
        const color = colorPicker.value;
        colorPreview.style.background = color;
        colorPreview.textContent = color;
        
        // Update text color for contrast
        const rgb = hexToRgb(color);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        colorPreview.style.color = brightness > 128 ? 'black' : 'white';
        
        // Update values
        hexValue.textContent = `HEX: ${color}`;
        rgbValue.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
        
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hslValue.textContent = `HSL: ${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;
        
        // Make values copyable
        [hexValue, rgbValue, hslValue].forEach(el => {
            el.addEventListener('click', () => {
                navigator.clipboard.writeText(el.textContent.split(': ')[1]);
                
                // Show feedback
                const originalText = el.textContent;
                el.textContent = 'Copied!';
                setTimeout(() => {
                    el.textContent = originalText;
                }, 1000);
            });
        });
    }
    
    // Initial update
    updateColorPicker();
    
    // Contrast Checker Tool
    const fgColor = document.getElementById('foreground-color');
    const bgColor = document.getElementById('background-color');
    const contrastRatio = document.getElementById('contrast-ratio');
    const contrastSample = document.getElementById('contrast-sample');
    const contrastRating = document.getElementById('contrast-rating');
    
    fgColor.addEventListener('input', updateContrast);
    bgColor.addEventListener('input', updateContrast);
    
    function updateContrast() {
        const fg = fgColor.value;
        const bg = bgColor.value;
        
        contrastSample.style.color = fg;
        contrastSample.style.background = bg;
        
        const fgRgb = hexToRgb(fg);
        const bgRgb = hexToRgb(bg);
        
        const ratio = calculateContrastRatio(fgRgb, bgRgb);
        contrastRatio.textContent = `Contrast Ratio: ${ratio.toFixed(2)}`;
        
        // Determine rating
        let rating = '';
        if (ratio >= 7) {
            contrastRatio.textContent += ' (AAA)';
            rating = 'Passes all accessibility standards for normal and large text.';
        } else if (ratio >= 4.5) {
            contrastRatio.textContent += ' (AA)';
            rating = 'Passes accessibility standards for normal text (AA), but not large text (AAA).';
        } else if (ratio >= 3) {
            contrastRatio.textContent += ' (Low)';
            rating = 'Does not meet accessibility standards. Use only for decorative elements.';
        } else {
            contrastRatio.textContent += ' (Fail)';
            rating = 'Very low contrast. Not recommended for any text.';
        }
        
        contrastRating.textContent = rating;
        
        // Update contrast ratio color
        if (ratio >= 7) {
            contrastRatio.style.background = '#4CAF50';
        } else if (ratio >= 4.5) {
            contrastRatio.style.background = '#8BC34A';
        } else if (ratio >= 3) {
            contrastRatio.style.background = '#FFC107';
        } else {
            contrastRatio.style.background = '#F44336';
        }
    }
    
    // Initial update
    updateContrast();
    
    // Color Blindness Simulator
    const blindnessColor = document.getElementById('blindness-color');
    const blindnessPreview = document.getElementById('blindness-preview');
    const blindnessTypes = document.querySelectorAll('.blindness-type');
    
    blindnessColor.addEventListener('input', updateBlindnessPreview);
    
    function updateBlindnessPreview() {
        const color = blindnessColor.value;
        blindnessPreview.style.background = color;
        
        // Update text color for contrast
        const rgb = hexToRgb(color);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        blindnessPreview.style.color = brightness > 128 ? 'black' : 'white';
        
        // Reset to normal vision
        blindnessPreview.textContent = 'Normal Vision';
    }
    
    blindnessTypes.forEach(type => {
        type.addEventListener('click', () => {
            const color = blindnessColor.value;
            const rgb = hexToRgb(color);
            let simulatedRgb;
            
            switch(type.dataset.type) {
                case 'protanopia':
                    simulatedRgb = simulateProtanopia(rgb.r, rgb.g, rgb.b);
                    blindnessPreview.textContent = 'Protanopia (Red-blind)';
                    break;
                case 'deuteranopia':
                    simulatedRgb = simulateDeuteranopia(rgb.r, rgb.g, rgb.b);
                    blindnessPreview.textContent = 'Deuteranopia (Green-blind)';
                    break;
                case 'tritanopia':
                    simulatedRgb = simulateTritanopia(rgb.r, rgb.g, rgb.b);
                    blindnessPreview.textContent = 'Tritanopia (Blue-blind)';
                    break;
                case 'achromatopsia':
                    simulatedRgb = simulateAchromatopsia(rgb.r, rgb.g, rgb.b);
                    blindnessPreview.textContent = 'Achromatopsia (Monochromacy)';
                    break;
                default:
                    simulatedRgb = rgb;
            }
            
            const simulatedHex = rgbToHex(simulatedRgb.r, simulatedRgb.g, simulatedRgb.b);
            blindnessPreview.style.background = simulatedHex;
            
            // Update text color for contrast
            const brightness = (simulatedRgb.r * 299 + simulatedRgb.g * 587 + simulatedRgb.b * 114) / 1000;
            blindnessPreview.style.color = brightness > 128 ? 'black' : 'white';
        });
    });
    
    // Initial update
    updateBlindnessPreview();
    
    // Gradient Generator Tool
    const gradientColor1 = document.getElementById('gradient-color-1');
    const gradientColor2 = document.getElementById('gradient-color-2');
    const gradientPreview = document.getElementById('gradient-preview');
    const gradientAngles = document.querySelectorAll('.gradient-angles button');
    
    let currentAngle = 90;
    
    gradientColor1.addEventListener('input', updateGradient);
    gradientColor2.addEventListener('input', updateGradient);
    
    gradientAngles.forEach(button => {
        button.addEventListener('click', () => {
            currentAngle = parseInt(button.dataset.angle);
            updateGradient();
            
            // Update active button
            gradientAngles.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    function updateGradient() {
        const color1 = gradientColor1.value;
        const color2 = gradientColor2.value;
        
        gradientPreview.style.background = `linear-gradient(${currentAngle}deg, ${color1}, ${color2})`;
    }
    
    // Initial update
    gradientAngles[2].classList.add('active'); // Select 90° by default
    updateGradient();
    
    // Helper functions
    function hexToRgb(hex) {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return { r, g, b };
    }
    
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
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
    
    function calculateContrastRatio(fg, bg) {
        const fgLuminance = calculateLuminance(fg.r, fg.g, fg.b);
        const bgLuminance = calculateLuminance(bg.r, bg.g, bg.b);
        
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    function calculateLuminance(r, g, b) {
        const [R, G, B] = [r, g, b].map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    
    function simulateProtanopia(r, g, b) {
        // Simulate red-blindness (protanopia)
        return {
            r: Math.round(0.567 * r + 0.433 * g + 0.000 * b),
            g: Math.round(0.558 * r + 0.442 * g + 0.000 * b),
            b: Math.round(0.000 * r + 0.242 * g + 0.758 * b)
        };
    }
    
    function simulateDeuteranopia(r, g, b) {
        // Simulate green-blindness (deuteranopia)
        return {
            r: Math.round(0.625 * r + 0.375 * g + 0.000 * b),
            g: Math.round(0.700 * r + 0.300 * g + 0.000 * b),
            b: Math.round(0.000 * r + 0.300 * g + 0.700 * b)
        };
    }
    
    function simulateTritanopia(r, g, b) {
        // Simulate blue-blindness (tritanopia)
        return {
            r: Math.round(0.950 * r + 0.050 * g + 0.000 * b),
            g: Math.round(0.000 * r + 0.433 * g + 0.567 * b),
            b: Math.round(0.000 * r + 0.475 * g + 0.525 * b)
        };
    }
    
    function simulateAchromatopsia(r, g, b) {
        // Simulate monochromacy (achromatopsia)
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        return { r: gray, g: gray, b: gray };
    }
}