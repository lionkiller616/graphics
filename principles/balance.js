document.addEventListener('DOMContentLoaded', function() {
    const balanceCard = document.getElementById('balance-card');
    const balanceDetails = document.getElementById('balance-details');
    
    // Load balance details content
    balanceDetails.innerHTML = `
        <h2>Balance in Design</h2>
        <p>Balance is the distribution of the visual weight of objects, colors, texture, and space. 
        When these elements are balanced, the design feels stable and aesthetically pleasing.</p>
        
        <h3>Types of Balance</h3>
        <div class="balance-examples">
            <div class="balance-example symmetrical" data-type="Symmetrical Balance">
                <div class="symmetrical-items"></div>
            </div>
            <div class="balance-example asymmetrical" data-type="Asymmetrical Balance">
                <div class="asymmetrical-items"></div>
            </div>
            <div class="balance-example radial" data-type="Radial Balance">
                <div class="radial-items"></div>
            </div>
        </div>
        
        <h3>Interactive Balance Scale</h3>
        <p>Drag the colored balls to see how balance works in real-time:</p>
        <div class="balance-scale">
            <div class="scale-base"></div>
            <div class="scale-beam"></div>
            <div class="scale-pan left"></div>
            <div class="scale-pan right"></div>
            <div class="scale-item red" draggable="true"></div>
            <div class="scale-item blue" draggable="true"></div>
        </div>
        <div class="scale-controls">
            <button id="reset-balance">Reset Scale</button>
            <button id="random-balance">Randomize</button>
        </div>
    `;
    
    // Generate items for balance examples
    generateBalanceExamples();
    
    // Initialize interactive balance scale
    initBalanceScale();
    
    // Click event for balance card
    balanceCard.addEventListener('click', function() {
        toggleDetails(balanceDetails);
    });
    
    // Keyboard navigation
    balanceCard.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDetails(balanceDetails);
        }
    });
});

function generateBalanceExamples() {
    // Symmetrical balance
    const symmetricalContainer = document.querySelector('.symmetrical-items');
    for (let i = 0; i < 6; i++) {
        const item = document.createElement('div');
        item.className = 'sym-item';
        item.style.left = `${i % 2 === 0 ? 30 : 70}%`;
        item.style.top = `${20 + Math.floor(i / 2) * 30}%`;
        item.style.backgroundColor = i % 2 === 0 ? '#6a11cb' : '#fc4a1a';
        symmetricalContainer.appendChild(item);
    }
    
    // Asymmetrical balance
    const asymmetricalContainer = document.querySelector('.asymmetrical-items');
    for (let i = 0; i < 4; i++) {
        const item = document.createElement('div');
        item.className = 'asym-item';
        if (i < 2) {
            item.style.left = `${20 + i * 10}%`;
            item.style.top = `${40}%`;
            item.style.width = `${40 - i * 10}px`;
            item.style.height = `${40 - i * 10}px`;
            item.style.backgroundColor = '#6a11cb';
        } else {
            item.style.left = `${60 + (i-2) * 15}%`;
            item.style.top = `${30 + (i-2) * 20}%`;
            item.style.width = `${20 + (i-2) * 5}px`;
            item.style.height = `${20 + (i-2) * 5}px`;
            item.style.backgroundColor = '#fc4a1a';
        }
        asymmetricalContainer.appendChild(item);
    }
    
    // Radial balance
    const radialContainer = document.querySelector('.radial-items');
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 60;
        const item = document.createElement('div');
        item.className = 'radial-item';
        item.style.left = `${50 + Math.cos(angle) * radius}%`;
        item.style.top = `${50 + Math.sin(angle) * radius}%`;
        item.style.backgroundColor = i % 2 === 0 ? '#6a11cb' : '#fc4a1a';
        radialContainer.appendChild(item);
    }
}

function initBalanceScale() {
    const beam = document.querySelector('.scale-beam');
    const leftPan = document.querySelector('.scale-pan.left');
    const rightPan = document.querySelector('.scale-pan.right');
    const redItem = document.querySelector('.scale-item.red');
    const blueItem = document.querySelector('.scale-item.blue');
    const resetBtn = document.getElementById('reset-balance');
    const randomBtn = document.getElementById('random-balance');
    
    let leftWeight = 1;
    let rightWeight = 1;
    let isDragging = false;
    let currentItem = null;
    
    // Set initial positions
    redItem.style.left = `${leftPan.offsetLeft + leftPan.offsetWidth / 2 - redItem.offsetWidth / 2}px`;
    redItem.style.top = `${leftPan.offsetTop - redItem.offsetHeight}px`;
    
    blueItem.style.left = `${rightPan.offsetLeft + rightPan.offsetWidth / 2 - blueItem.offsetWidth / 2}px`;
    blueItem.style.top = `${rightPan.offsetTop - blueItem.offsetHeight}px`;
    
    // Make items draggable
    [redItem, blueItem].forEach(item => {
        item.addEventListener('mousedown', startDrag);
        item.addEventListener('touchstart', startDrag);
    });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    // Button events
    resetBtn.addEventListener('click', resetScale);
    randomBtn.addEventListener('click', randomizeWeights);
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        currentItem = e.target;
        currentItem.style.cursor = 'grabbing';
        currentItem.style.zIndex = '10';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        currentItem.style.left = `${clientX - currentItem.offsetWidth / 2}px`;
        currentItem.style.top = `${clientY - currentItem.offsetHeight / 2}px`;
        
        // Check if item is over a pan
        const redInLeft = isItemInPan(currentItem, leftPan);
        const blueInRight = isItemInPan(currentItem, rightPan);
        
        if (redInLeft && currentItem.classList.contains('red')) {
            leftWeight = 2;
            rightWeight = 1;
        } else if (blueInRight && currentItem.classList.contains('blue')) {
            leftWeight = 1;
            rightWeight = 2;
        } else {
            leftWeight = 1;
            rightWeight = 1;
        }
        
        updateScale();
    }
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        currentItem.style.cursor = 'grab';
        currentItem.style.zIndex = '3';
        currentItem = null;
    }
    
    function isItemInPan(item, pan) {
        const itemRect = item.getBoundingClientRect();
        const panRect = pan.getBoundingClientRect();
        
        return itemRect.bottom >= panRect.top && 
               itemRect.top <= panRect.bottom && 
               itemRect.right >= panRect.left && 
               itemRect.left <= panRect.right;
    }
    
    function updateScale() {
        const angle = (rightWeight - leftWeight) * 5;
        beam.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
    
    function resetScale() {
        leftWeight = 1;
        rightWeight = 1;
        updateScale();
        
        redItem.style.left = `${leftPan.offsetLeft + leftPan.offsetWidth / 2 - redItem.offsetWidth / 2}px`;
        redItem.style.top = `${leftPan.offsetTop - redItem.offsetHeight}px`;
        
        blueItem.style.left = `${rightPan.offsetLeft + rightPan.offsetWidth / 2 - blueItem.offsetWidth / 2}px`;
        blueItem.style.top = `${rightPan.offsetTop - blueItem.offsetHeight}px`;
    }
    
    function randomizeWeights() {
        leftWeight = Math.floor(Math.random() * 3) + 1;
        rightWeight = Math.floor(Math.random() * 3) + 1;
        updateScale();
        
        // Randomize positions
        redItem.style.left = `${leftPan.offsetLeft + leftPan.offsetWidth / 2 - redItem.offsetWidth / 2 + (Math.random() * 40 - 20)}px`;
        redItem.style.top = `${leftPan.offsetTop - redItem.offsetHeight + (Math.random() * 20 - 10)}px`;
        
        blueItem.style.left = `${rightPan.offsetLeft + rightPan.offsetWidth / 2 - blueItem.offsetWidth / 2 + (Math.random() * 40 - 20)}px`;
        blueItem.style.top = `${rightPan.offsetTop - blueItem.offsetHeight + (Math.random() * 20 - 10)}px`;
    }
}

function toggleDetails(detailsElement) {
    const isVisible = detailsElement.style.display === 'block';
    
    // Hide all details first
    document.querySelectorAll('.details-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Toggle the clicked one
    detailsElement.style.display = isVisible ? 'none' : 'block';
    
    // Scroll to the details if showing
    if (!isVisible) {
        detailsElement.scrollIntoView({ behavior: 'smooth' });
    }
}