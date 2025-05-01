function initMicrointeractions() {
    // Like button animation
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const svg = this.querySelector('svg');
            if (this.classList.contains('active')) {
                svg.classList.remove('text-gray-400');
                svg.classList.add('text-red-500');
            } else {
                svg.classList.add('text-gray-400');
                svg.classList.remove('text-red-500');
            }
        });
    }
    
    // Card hover effects are CSS-based
    
    // Drag and drop functionality
    const dragItems = document.querySelectorAll('.drag-item');
    const dragContainer = document.querySelector('.drag-drop-container');
    
    let draggedItem = null;
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    dragContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(this, e.clientY);
        
        if (afterElement == null) {
            this.appendChild(draggedItem);
        } else {
            this.insertBefore(draggedItem, afterElement);
        }
    });
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Toggle switch interaction
    const toggleSwitch = document.querySelector('.toggle-switch input');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function() {
            // Play a subtle animation
            const switchHandle = this.nextElementSibling;
            switchHandle.style.transform = this.checked ? 'translateX(1.75rem)' : 'translateX(0)';
        });
    }
    
    // Input focus effect
    const inputFocus = document.querySelector('.input-focus');
    if (inputFocus) {
        inputFocus.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        inputFocus.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    }
}