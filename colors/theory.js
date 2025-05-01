// Color Theory Section
export function initTheorySection() {
    const theorySection = document.querySelector('.theory-section');
    
    // Create color wheel and theory content
    theorySection.innerHTML = `
        <h2>Color Theory Fundamentals</h2>
        <p>Explore the basic principles of color theory and how colors interact with each other.</p>
        
        <div class="color-wheel-container">
            <div class="color-wheel" id="interactive-wheel"></div>
        </div>
        
        <div class="color-theory-grid">
            <div class="theory-card">
                <h3><i class="fas fa-palette"></i> Primary Colors</h3>
                <p>The three primary colors are red, blue, and yellow. These colors cannot be created by mixing other colors.</p>
                <div class="color-example">
                    <span style="background: #ff0000;" data-color="#ff0000"></span>
                    <span style="background: #0000ff;" data-color="#0000ff"></span>
                    <span style="background: #ffff00;" data-color="#ffff00"></span>
                </div>
            </div>
            
            <div class="theory-card">
                <h3><i class="fas fa-blender"></i> Secondary Colors</h3>
                <p>Created by mixing two primary colors: green (blue + yellow), orange (red + yellow), and purple (red + blue).</p>
                <div class="color-example">
                    <span style="background: #00ff00;" data-color="#00ff00"></span>
                    <span style="background: #ffa500;" data-color="#ffa500"></span>
                    <span style="background: #800080;" data-color="#800080"></span>
                </div>
            </div>
            
            <div class="theory-card">
                <h3><i class="fas fa-tint"></i> Tertiary Colors</h3>
                <p>Created by mixing a primary and a secondary color, resulting in hues like red-orange and blue-green.</p>
                <div class="color-example">
                    <span style="background: #ff4500;" data-color="#ff4500"></span>
                    <span style="background: #ff8c00;" data-color="#ff8c00"></span>
                    <span style="background: #40e0d0;" data-color="#40e0d0"></span>
                </div>
            </div>
        </div>
        
        <div class="color-schemes">
            <h3><i class="fas fa-chess-board"></i> Color Schemes</h3>
            <p>Different methods for combining colors effectively in design.</p>
            
            <div class="scheme-container">
                <div class="scheme">
                    <h4>Monochromatic</h4>
                    <p>Variations in lightness and saturation of a single color.</p>
                    <div class="scheme-colors">
                        <span style="background: #3a0ca3;"></span>
                        <span style="background: #4361ee;"></span>
                        <span style="background: #4895ef;"></span>
                        <span style="background: #4cc9f0;"></span>
                    </div>
                </div>
                
                <div class="scheme">
                    <h4>Analogous</h4>
                    <p>Colors that are next to each other on the color wheel.</p>
                    <div class="scheme-colors">
                        <span style="background: #f72585;"></span>
                        <span style="background: #b5179e;"></span>
                        <span style="background: #7209b7;"></span>
                        <span style="background: #560bad;"></span>
                    </div>
                </div>
                
                <div class="scheme">
                    <h4>Complementary</h4>
                    <p>Colors opposite each other on the color wheel.</p>
                    <div class="scheme-colors">
                        <span style="background: #4361ee;"></span>
                        <span style="background: #ee9643;"></span>
                    </div>
                </div>
                
                <div class="scheme">
                    <h4>Triadic</h4>
                    <p>Three colors evenly spaced on the color wheel.</p>
                    <div class="scheme-colors">
                        <span style="background: #f72585;"></span>
                        <span style="background: #4cc9f0;"></span>
                        <span style="background: #f5f749;"></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Interactive color wheel
    const colorWheel = document.getElementById('interactive-wheel');
    let isDragging = false;
    let startAngle = 0;
    let rotation = 0;
    
    colorWheel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngle(e, colorWheel);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentAngle = getAngle(e, colorWheel);
        rotation = currentAngle - startAngle;
        colorWheel.style.transform = `rotate(${rotation}deg) scale(1.05)`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        colorWheel.style.transform = `rotate(${rotation}deg) scale(1)`;
    });
    
    // Touch events for mobile
    colorWheel.addEventListener('touchstart', (e) => {
        isDragging = true;
        startAngle = getAngle(e.touches[0], colorWheel);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentAngle = getAngle(e.touches[0], colorWheel);
        rotation = currentAngle - startAngle;
        colorWheel.style.transform = `rotate(${rotation}deg) scale(1.05)`;
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
        colorWheel.style.transform = `rotate(${rotation}deg) scale(1)`;
    });
    
    function getAngle(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;
        return Math.atan2(mouseY, mouseX) * 180 / Math.PI;
    }
    
    // Tooltips for color examples
    document.querySelectorAll('.color-example span').forEach(span => {
        span.addEventListener('mouseenter', () => {
            const color = span.getAttribute('data-color');
            span.setAttribute('data-tooltip', color);
        });
    });
}