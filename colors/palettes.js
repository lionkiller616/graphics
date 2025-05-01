// Color Palettes Section
export function initPalettesSection() {
    const palettesSection = document.querySelector('.palettes-section');
    
    palettesSection.innerHTML = `
        <h2>Color Palette Generator</h2>
        <p>Create beautiful color schemes and save your favorite palettes.</p>
        
        <div class="palette-generator">
            <div class="palette-controls">
                <div class="color-input-container">
                    <label for="base-color">Base Color:</label>
                    <input type="color" id="base-color" value="#4361ee">
                </div>
                
                <div>
                    <label for="scheme-type">Scheme Type:</label>
                    <select id="scheme-type">
                        <option value="monochromatic">Monochromatic</option>
                        <option value="analogous">Analogous</option>
                        <option value="complementary">Complementary</option>
                        <option value="split-complementary">Split-Complementary</option>
                        <option value="triadic">Triadic</option>
                        <option value="tetradic">Tetradic</option>
                        <option value="square">Square</option>
                    </select>
                </div>
                
                <button id="generate-palette">Generate Palette</button>
            </div>
            
            <div class="palette-result" id="palette-result"></div>
            
            <div class="palette-actions">
                <button id="save-palette">Save Palette</button>
                <button id="random-palette">Random Palette</button>
                <button id="clear-palettes">Clear All</button>
            </div>
        </div>
        
        <div class="saved-palettes">
            <h3><i class="fas fa-bookmark"></i> Saved Palettes</h3>
            <div class="saved-palettes-container" id="saved-palettes"></div>
        </div>
    `;
    
    // Generate palette based on base color and scheme type
    const baseColorInput = document.getElementById('base-color');
    const schemeTypeSelect = document.getElementById('scheme-type');
    const generateBtn = document.getElementById('generate-palette');
    const paletteResult = document.getElementById('palette-result');
    const saveBtn = document.getElementById('save-palette');
    const randomBtn = document.getElementById('random-palette');
    const clearBtn = document.getElementById('clear-palettes');
    const savedPalettesContainer = document.getElementById('saved-palettes');
    
    // Load saved palettes from localStorage
    let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes')) || [];
    renderSavedPalettes();
    
    generateBtn.addEventListener('click', generatePalette);
    saveBtn.addEventListener('click', savePalette);
    randomBtn.addEventListener('click', generateRandomPalette);
    clearBtn.addEventListener('click', clearPalettes);
    
    // Generate initial palette
    generatePalette();
    
    function generatePalette() {
        const baseColor = baseColorInput.value;
        const schemeType = schemeTypeSelect.value;
        
        // Convert hex to RGB
        const r = parseInt(baseColor.substr(1, 2), 16);
        const g = parseInt(baseColor.substr(3, 2), 16);
        const b = parseInt(baseColor.substr(5, 2), 16);
        
        // Generate palette based on scheme type
        let palette = [];
        
        switch(schemeType) {
            case 'monochromatic':
                palette = generateMonochromatic(r, g, b);
                break;
            case 'analogous':
                palette = generateAnalogous(r, g, b);
                break;
            case 'complementary':
                palette = generateComplementary(r, g, b);
                break;
            case 'split-complementary':
                palette = generateSplitComplementary(r, g, b);
                break;
            case 'triadic':
                palette = generateTriadic(r, g, b);
                break;
            case 'tetradic':
                palette = generateTetradic(r, g, b);
                break;
            case 'square':
                palette = generateSquare(r, g, b);
                break;
            default:
                palette = [baseColor];
        }
        
        renderPalette(palette);
    }
    
    function generateRandomPalette() {
        // Generate random hex color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        baseColorInput.value = randomColor;
        
        // Select random scheme type
        const schemes = ['monochromatic', 'analogous', 'complementary', 'split-complementary', 'triadic', 'tetradic', 'square'];
        const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
        schemeTypeSelect.value = randomScheme;
        
        generatePalette();
    }
    
    function renderPalette(colors) {
        paletteResult.innerHTML = '';
        
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.background = color;
            swatch.textContent = color;
            
            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color);
                
                // Show copied feedback
                const originalText = swatch.textContent;
                swatch.textContent = 'Copied!';
                setTimeout(() => {
                    swatch.textContent = originalText;
                }, 1000);
            });
            
            paletteResult.appendChild(swatch);
        });
    }
    
    function savePalette() {
        const colors = Array.from(document.querySelectorAll('.color-swatch')).map(
            swatch => swatch.style.backgroundColor
        );
        
        if (colors.length === 0) return;
        
        const paletteName = prompt('Name your palette:', 'My Color Palette');
        if (!paletteName) return;
        
        const newPalette = {
            name: paletteName,
            colors: colors,
            date: new Date().toLocaleDateString()
        };
        
        savedPalettes.unshift(newPalette);
        localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
        renderSavedPalettes();
        
        // Show success feedback
        alert('Palette saved successfully!');
    }
    
    function renderSavedPalettes() {
        savedPalettesContainer.innerHTML = '';
        
        if (savedPalettes.length === 0) {
            savedPalettesContainer.innerHTML = '<p>No saved palettes yet.</p>';
            return;
        }
        
        savedPalettes.forEach((palette, index) => {
            const paletteEl = document.createElement('div');
            paletteEl.className = 'saved-palette';
            
            const colorsHtml = palette.colors.map(color => 
                `<span style="background: ${color};"></span>`
            ).join('');
            
            paletteEl.innerHTML = `
                <div class="saved-palette-colors">${colorsHtml}</div>
                <div class="saved-palette-info">
                    <p>${palette.name}</p>
                    <div class="saved-palette-actions">
                        <button class="copy-palette" title="Copy palette">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="delete-palette" title="Delete palette">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const copyBtn = paletteEl.querySelector('.copy-palette');
            const deleteBtn = paletteEl.querySelector('.delete-palette');
            
            copyBtn.addEventListener('click', () => {
                const colorText = palette.colors.join(', ');
                navigator.clipboard.writeText(colorText);
                
                // Show feedback
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                }, 1000);
            });
            
            deleteBtn.addEventListener('click', () => {
                if (confirm('Delete this palette?')) {
                    savedPalettes.splice(index, 1);
                    localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
                    renderSavedPalettes();
                }
            });
            
            savedPalettesContainer.appendChild(paletteEl);
        });
    }
    
    function clearPalettes() {
        if (confirm('Delete all saved palettes?')) {
            savedPalettes = [];
            localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
            renderSavedPalettes();
        }
    }
    
    // Color scheme generation functions
    function RGBToHSL(r, g, b) {
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
        
        return [h * 360, s * 100, l * 100];
    }
    
    function HSLToRGB(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
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
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    function RGBToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    function generateMonochromatic(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const colors = [];
        
        // Generate 5 shades
        for (let i = 0; i < 5; i++) {
            const newL = Math.max(0, Math.min(100, l + (i - 2) * 15));
            const [nr, ng, nb] = HSLToRGB(h, s, newL);
            colors.push(RGBToHex(nr, ng, nb));
        }
        
        return colors;
    }
    
    function generateAnalogous(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const colors = [];
        
        // Base color
        colors.push(RGBToHex(r, g, b));
        
        // Two analogous colors (30° apart)
        for (let i = 1; i <= 2; i++) {
            const newH = (h + i * 30) % 360;
            const [nr, ng, nb] = HSLToRGB(newH, s, l);
            colors.push(RGBToHex(nr, ng, nb));
            
            const newH2 = (h - i * 30 + 360) % 360;
            const [nr2, ng2, nb2] = HSLToRGB(newH2, s, l);
            colors.unshift(RGBToHex(nr2, ng2, nb2));
        }
        
        return colors;
    }
    
    function generateComplementary(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const compH = (h + 180) % 360;
        const [cr, cg, cb] = HSLToRGB(compH, s, l);
        
        return [RGBToHex(r, g, b), RGBToHex(cr, cg, cb)];
    }
    
    function generateSplitComplementary(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const colors = [RGBToHex(r, g, b)];
        
        // Two colors adjacent to complement
        const compH1 = (h + 150) % 360;
        const [cr1, cg1, cb1] = HSLToRGB(compH1, s, l);
        colors.push(RGBToHex(cr1, cg1, cb1));
        
        const compH2 = (h + 210) % 360;
        const [cr2, cg2, cb2] = HSLToRGB(compH2, s, l);
        colors.push(RGBToHex(cr2, cg2, cb2));
        
        return colors;
    }
    
    function generateTriadic(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const colors = [RGBToHex(r, g, b)];
        
        // Two triadic colors (120° apart)
        const triH1 = (h + 120) % 360;
        const [tr1, tg1, tb1] = HSLToRGB(triH1, s, l);
        colors.push(RGBToHex(tr1, tg1, tb1));
        
        const triH2 = (h + 240) % 360;
        const [tr2, tg2, tb2] = HSLToRGB(triH2, s, l);
        colors.push(RGBToHex(tr2, tg2, tb2));
        
        return colors;
    }
    
    function generateTetradic(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const colors = [RGBToHex(r, g, b)];
        
        // Three tetradic colors (90° apart)
        for (let i = 1; i <= 3; i++) {
            const newH = (h + i * 90) % 360;
            const [nr, ng, nb] = HSLToRGB(newH, s, l);
            colors.push(RGBToHex(nr, ng, nb));
        }
        
        return colors;
    }
    
    function generateSquare(r, g, b) {
        const [h, s, l] = RGBToHSL(r, g, b);
        const colors = [RGBToHex(r, g, b)];
        
        // Three square colors (90° apart, same as tetradic but different arrangement)
        for (let i = 1; i <= 3; i++) {
            const newH = (h + i * 90) % 360;
            const [nr, ng, nb] = HSLToRGB(newH, s, l);
            colors.push(RGBToHex(nr, ng, nb));
        }
        
        return colors;
    }
}