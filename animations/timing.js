function initTimingAnimations() {
    // Duration examples
    document.querySelectorAll('.duration-example').forEach(example => {
        example.addEventListener('mouseenter', function() {
            const box = this.querySelector('.box');
            box.style.transform = 'translateX(100px)';
        });
        
        example.addEventListener('mouseleave', function() {
            const box = this.querySelector('.box');
            box.style.transform = 'translateX(0)';
        });
    });
    
    // Staggered delay controller
    const delayInput = document.querySelector('.staggered-example + div input[type="range"]');
    if (delayInput) {
        delayInput.addEventListener('input', function() {
            const delay = this.value;
            document.querySelectorAll('.staggered-example .bar').forEach((bar, index) => {
                bar.style.animationDelay = `${index * (delay / 1000)}s`;
            });
        });
    }
    
    // Iteration controls
    const iterationOptions = document.querySelectorAll('.iteration-option');
    const directionOptions = document.querySelectorAll('.direction-option');
    const playIterationBtn = document.getElementById('play-iteration');
    const bounceBall = document.querySelector('.iteration-example');
    
    let currentIterations = 'infinite';
    let currentDirection = 'normal';
    
    iterationOptions.forEach(option => {
        option.addEventListener('click', function() {
            iterationOptions.forEach(opt => opt.classList.remove('bg-blue-500', 'text-white'));
            this.classList.add('bg-blue-500', 'text-white');
            currentIterations = this.dataset.iterations;
        });
    });
    
    directionOptions.forEach(option => {
        option.addEventListener('click', function() {
            directionOptions.forEach(opt => opt.classList.remove('bg-blue-500', 'text-white'));
            this.classList.add('bg-blue-500', 'text-white');
            currentDirection = this.dataset.direction;
        });
    });
    
    playIterationBtn.addEventListener('click', function() {
        // Reset animation
        bounceBall.style.animation = 'none';
        void bounceBall.offsetWidth;
        
        // Apply new animation settings
        bounceBall.style.animation = `bounce 1s ease ${currentIterations} ${currentDirection}`;
    });
}