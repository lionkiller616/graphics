function initEasingAnimations() {
    // Play button functionality for all easing examples
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.easing-card');
            const demo = card.querySelector('.easing-demo');
            const line = card.querySelector('.easing-line');
            
            // Reset animations
            demo.style.transform = 'translateX(0)';
            line.style.transform = 'scaleX(0)';
            
            // Force reflow
            void demo.offsetWidth;
            void line.offsetWidth;
            
            // Add playing class
            card.classList.add('playing');
            
            // Get timing function from code element
            const code = card.querySelector('code');
            const timingFunction = code.textContent.trim();
            
            // Apply the animation
            demo.style.transition = `transform 1.5s ${timingFunction}`;
            line.style.transition = `transform 1.5s ${timingFunction}`;
            
            demo.style.transform = 'translateX(calc(100% - 40px))';
            line.style.transform = 'scaleX(1)';
            
            // Reset after animation completes
            setTimeout(() => {
                card.classList.remove('playing');
            }, 1500);
        });
    });
    
    // Custom bezier curve editor
    const bezierInputs = document.querySelectorAll('.bezier-x1, .bezier-y1, .bezier-x2, .bezier-y2');
    const bezierCode = document.getElementById('bezier-code');
    const customPlayBtn = document.querySelector('.bezier-card .play-btn');
    
    function updateBezierCurve() {
        const x1 = document.querySelector('.bezier-x1').value;
        const y1 = document.querySelector('.bezier-y1').value;
        const x2 = document.querySelector('.bezier-x2').value;
        const y2 = document.querySelector('.bezier-y2').value;
        
        const bezierValue = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
        bezierCode.textContent = bezierValue;
        
        return bezierValue;
    }
    
    bezierInputs.forEach(input => {
        input.addEventListener('input', updateBezierCurve);
    });
    
    customPlayBtn.addEventListener('click', function() {
        const card = this.closest('.easing-card');
        const demo = card.querySelector('.easing-demo');
        const line = card.querySelector('.easing-line');
        const bezierValue = updateBezierCurve();
        
        // Reset animations
        demo.style.transform = 'translateX(0)';
        line.style.transform = 'scaleX(0)';
        
        // Force reflow
        void demo.offsetWidth;
        void line.offsetWidth;
        
        // Add playing class
        card.classList.add('playing');
        
        // Apply the custom animation
        demo.style.transition = `transform 1.5s ${bezierValue}`;
        line.style.transition = `transform 1.5s ${bezierValue}`;
        
        demo.style.transform = 'translateX(calc(100% - 40px))';
        line.style.transform = 'scaleX(1)';
        
        // Reset after animation completes
        setTimeout(() => {
            card.classList.remove('playing');
        }, 1500);
    });
    
    // Initialize with default bezier curve
    updateBezierCurve();
}