function initMotionGraphics() {
    // Loading animations are CSS-based and don't need JS
    
    // Path animation controls
    const pathPlayBtn = document.querySelector('.path-play');
    const pathPauseBtn = document.querySelector('.path-pause');
    const pathReverseBtn = document.querySelector('.path-reverse');
    const pathDurationSpan = document.querySelector('.path-duration');
    const motionObject = document.getElementById('motion-object');
    
    let pathAnimation;
    let currentDuration = 2;
    let isReversed = false;
    
    function createPathAnimation() {
        // Use Web Animations API for better control
        const keyframes = [
            { transform: 'translateX(0) translateY(0)', offset: 0 },
            { transform: 'translateX(200px) translateY(0)', offset: 1 }
        ];
        
        const options = {
            duration: currentDuration * 1000,
            iterations: Infinity,
            direction: isReversed ? 'reverse' : 'normal',
            easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
        };
        
        if (pathAnimation) {
            pathAnimation.cancel();
        }
        
        pathAnimation = motionObject.animate(keyframes, options);
        pathAnimation.pause();
    }
    
    pathPlayBtn.addEventListener('click', function() {
        if (!pathAnimation) {
            createPathAnimation();
        }
        pathAnimation.play();
    });
    
    pathPauseBtn.addEventListener('click', function() {
        if (pathAnimation) {
            pathAnimation.pause();
        }
    });
    
    pathReverseBtn.addEventListener('click', function() {
        isReversed = !isReversed;
        createPathAnimation();
        pathAnimation.play();
    });
    
    // Duration controls
    const durationControls = document.createElement('div');
    durationControls.className = 'flex items-center mt-2';
    durationControls.innerHTML = `
        <label class="text-xs text-gray-600 mr-2">Speed:</label>
        <input type="range" min="0.5" max="5" step="0.5" value="${currentDuration}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
    `;
    pathDurationSpan.parentNode.insertBefore(durationControls, pathDurationSpan.nextSibling);
    
    const durationInput = durationControls.querySelector('input');
    durationInput.addEventListener('input', function() {
        currentDuration = parseFloat(this.value);
        pathDurationSpan.textContent = `${currentDuration}s`;
        createPathAnimation();
        pathAnimation.play();
    });
    
    // Notification sequence
    const sequenceTrigger = document.querySelector('.sequence-trigger');
    const notification = document.querySelector('.notification-sequence');
    
    if (sequenceTrigger && notification) {
        sequenceTrigger.addEventListener('click', function() {
            // Reset
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px) scale(0.95)';
            
            // Force reflow
            void notification.offsetWidth;
            
            // Enter animation
            notification.style.transition = 'all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)';
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0) scale(1)';
            
            // Exit after delay
            setTimeout(() => {
                notification.style.transition = 'all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6)';
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px) scale(0.95)';
            }, 2000);
        });
    }
    
    // Initialize path animation
    createPathAnimation();
}