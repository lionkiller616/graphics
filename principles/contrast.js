document.addEventListener('DOMContentLoaded', function() {
    const contrastCard = document.getElementById('contrast-card');
    const contrastDetails = document.getElementById('contrast-details');
    
    // Load contrast details content
    contrastDetails.innerHTML = `
        <h2>Contrast in Design</h2>
        <p>Contrast occurs when two elements are different. The greater the difference, the greater the contrast. 
        Contrast creates visual interest and helps organize information.</p>
        
        <h3>Types of Contrast</h3>
        <div class="contrast-grid">
            <div class="contrast-example" style="background: #000; color: #fff;">
                <h3>Color Contrast</h3>
                <p>Black background with white text creates high contrast.</p>
            </div>
            <div class="contrast-example" style="background: #fff; color: #333; border: 3px solid #f00;">
                <h3>Border Contrast</h3>
                <p>Red border creates emphasis against white background.</p>
            </div>
            <div class="contrast-example" style="background: #eee; font-size: 1rem;">
                <h3 style="font-size: 1.8rem;">Size Contrast</h3>
                <p>Large heading contrasts with smaller body text.</p>
            </div>
            <div class="contrast-example" style="background: #fff; font-family: Arial;">
                <h3 style="font-family: 'Times New Roman', serif;">Font Contrast</h3>
                <p>Serif heading contrasts with sans-serif body text.</p>
            </div>
        </div>
        
        <h3>Color Contrast Checker</h3>
        <p>Test different color combinations for accessibility:</p>
        <div class="contrast-checker">
            <div class="contrast-checker-grid">
                <div>
                    <div class="contrast-preview" id="contrast-preview-bg">
                        <div class="contrast-preview-text" id="contrast-preview-text">Sample Text</div>
                    </div>
                    <div class="contrast-result" id="contrast-result">Contrast Ratio: --</div>
                </div>
                <div class="color-picker">
                    <div class="color-input">
                        <label for="bg-color">Background:</label>
                        <input type="color" id="bg-color" value="#ffffff">
                        <input type="text" id="bg-hex" value="#ffffff">
                    </div>
                    <div class="color-input">
                        <label for="text-color">Text:</label>
                        <input type="color" id="text-color" value="#000000">
                        <input type="text" id="text-hex" value="#000000">
                    </div>
                    <div class="contrast-score" id="contrast-score">--</div>
                </div>
            </div>
        </div>
        
        <h3>Type Contrast Examples</h3>
        <div class="type-contrast">
            <div class="type-pair">
                <div class="type-sample" style="font-family: 'Arial Black', sans-serif; font-size: 1.8rem;">Heading</div>
                <div class="type-info">
                    <div>Bold Sans-Serif</div>
                    <small>36px / 1.2</small>
                </div>
            </div>
            <div class="type-pair">
                <div class="type-sample" style="font-family: Georgia, serif; font-size: 1.2rem; font-style: italic;">Subheading</div>
                <div class="type-info">
                    <div>Italic Serif</div>
                    <small>24px / 1.4</small>
                </div>
            </div>
            <div class="type-pair">
                <div class="type-sample" style="font-family: 'Courier New', monospace; font-size: 1rem;">Body Text</div>
                <div class="type-info">
                    <div>Monospace</div>
                    <small>16px / 1.6</small>
                </div>
            </div>
        </div>
    `;
    
    // Initialize contrast checker
    initContrastChecker();
    
    // Click event for contrast card
    contrastCard.addEventListener('click', function() {
        toggleDetails(contrastDetails);
    });
    
    // Keyboard navigation
    contrastCard.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDetails(contrastDetails);
        }
    });
});

function initContrastChecker() {
    const bgColorInput = document.getElementById('bg-color');
    const textColorInput = document.getElementById('text-color');
    const bgHexInput = document.getElementById('bg-hex');
    const textHexInput = document.getElementById('text-hex');
    const contrastPreviewBg = document.getElementById('contrast-preview-bg');
    const contrastPreviewText = document.getElementById('contrast-preview-text');
    const contrastResult = document.getElementById('contrast-result');
    const contrastScore = document.getElementById('contrast-score');
    
    // Update preview when colors change
    function updateContrast() {
        const bgColor = bgColorInput.value;
        const textColor = textColorInput.value;
        
        contrastPreviewBg.style.backgroundColor = bgColor;
        contrastPreviewText.style.color = textColor;
        bgHexInput.value = bgColor;
        textHexInput.value = textColor;
        
        // Calculate contrast ratio
        const ratio = getContrastRatio(bgColor, textColor);
        contrastResult.textContent = `Contrast Ratio: ${ratio.toFixed(2)}:1`;
        
        // Determine accessibility level
        let level = '';
        if (ratio >= 7) {
            level = 'AAA';
        } else if (ratio >= 4.5) {
            level = 'AA';
        } else if (ratio >= 3) {
            level = 'A';
        } else {
            level = 'Fail';
        }
        
        contrastScore.textContent = `WCAG ${level}`;
        contrastScore.className = 'contrast-score ' + level.toLowerCase();
    }
    
    // Hex input sync
    bgHexInput.addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            bgColorInput.value = this.value;
            updateContrast();
        }
    });
    
    textHexInput.addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            textColorInput.value = this.value;
            updateContrast();
        }
    });
    
    // Color input change
    bgColorInput.addEventListener('input', updateContrast);
    textColorInput.addEventListener('input', updateContrast);
    
    // Initial update
    updateContrast();
}

function getContrastRatio(color1, color2) {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    // Calculate relative luminance
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    // Calculate contrast ratio
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 