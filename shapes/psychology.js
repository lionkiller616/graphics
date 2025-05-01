function initializePsychologySection() {
    const psychologySection = document.getElementById('psychology');
    
    // Create content for psychology section
    psychologySection.innerHTML = `
        <div class="section-header">
            <div class="header-shape-container">
                <div class="header-shape triangle"></div>
            </div>
            <h2>Shape Psychology</h2>
            <p>How geometric forms influence human emotions and decision-making</p>
        </div>
        
        <div class="psychology-intro">
            <div class="psychology-animation">
                <!-- Animated shapes will be added here -->
            </div>
            <div class="intro-content">
                <p>Shapes have a profound psychological impact on human perception. Our brains are wired to interpret shapes in specific ways, triggering emotional responses and influencing our decisions.</p>
            </div>
        </div>
        
        <div class="shape-emotions">
            <h3>Emotional Responses to Shapes</h3>
            <div class="emotion-grid">
                <!-- Emotion cards will be added here -->
            </div>
        </div>
        
        <div class="shape-applications">
            <h3>Practical Applications</h3>
            <div class="application-tabs">
                <!-- Application tabs will be added here -->
            </div>
        </div>
        
        <div class="shape-combinations">
            <h3>Shape Combinations</h3>
            <div class="combination-gallery">
                <!-- Shape combinations will be added here -->
            </div>
        </div>
    `;
    
    // Create psychology animation
    const psychologyAnimation = psychologySection.querySelector('.psychology-animation');
    psychologyAnimation.innerHTML = `
        <div class="psychology-shapes-container">
            <div class="psychology-shape circle"></div>
            <div class="psychology-shape square"></div>
            <div class="psychology-shape triangle"></div>
            <div class="psychology-shape spiral"></div>
        </div>
    `;
    
    // Add emotion cards
    const emotions = [
        { 
            shape: 'circle', 
            emotion: 'Comfort & Harmony', 
            description: 'Circles create a sense of community, unity, and wholeness. They are often associated with femininity and evoke feelings of comfort and harmony.',
            color: '#FF6B6B'
        },
        { 
            shape: 'square', 
            emotion: 'Stability & Order', 
            description: 'Squares and rectangles suggest stability, reliability, and order. They convey strength and professionalism but can seem rigid if overused.',
            color: '#4ECDC4'
        },
        { 
            shape: 'triangle', 
            emotion: 'Energy & Tension', 
            description: 'Triangles represent energy, power, and direction. Depending on orientation, they can suggest stability (base down) or tension (point down).',
            color: '#FFE66D'
        },
        { 
            shape: 'organic', 
            emotion: 'Natural & Approachable', 
            description: 'Organic, free-form shapes feel natural, comforting, and approachable. They suggest creativity and flexibility.',
            color: '#6B8FF7'
        },
        { 
            shape: 'spiral', 
            emotion: 'Growth & Transformation', 
            description: 'Spirals suggest growth, evolution, and cosmic energy. They can represent journey, transformation, or progression.',
            color: '#A5D8FF'
        },
        { 
            shape: 'abstract', 
            emotion: 'Creativity & Complexity', 
            description: 'Abstract shapes can evoke curiosity and intellectual engagement. They suggest complexity and modern thinking.',
            color: '#7DEDFF'
        }
    ];
    
    const emotionGrid = psychologySection.querySelector('.emotion-grid');
    emotions.forEach(emotion => {
        const card = document.createElement('div');
        card.className = 'emotion-card';
        
        card.innerHTML = `
            <div class="emotion-shape-container">
                <div class="emotion-shape ${emotion.shape}"></div>
            </div>
            <h4>${emotion.emotion}</h4>
            <p>${emotion.description}</p>
            <div class="emotion-color" style="background-color: ${emotion.color}"></div>
        `;
        
        emotionGrid.appendChild(card);
        
        // Create the shape in the card
        const shapeElement = card.querySelector('.emotion-shape');
        createEmotionShape(shapeElement, emotion.shape, emotion.color);
    });
    
    // Add application tabs
    const applications = [
        { 
            title: 'Web Design', 
            description: 'Use circles for call-to-action buttons to make them more inviting. Squares work well for content containers. Triangles can guide attention.',
            icon: 'web'
        },
        { 
            title: 'Product Design', 
            description: 'Organic shapes make products feel more approachable. Geometric shapes convey precision and reliability.',
            icon: 'product'
        },
        { 
            title: 'Architecture', 
            description: 'Curved buildings feel more welcoming, while angular designs convey strength and modernity.',
            icon: 'architecture'
        },
        { 
            title: 'Marketing', 
            description: 'Different shapes attract different demographics. Circles appeal to women, angles to men. Youth prefer dynamic shapes.',
            icon: 'marketing'
        }
    ];
    
    const applicationTabs = psychologySection.querySelector('.application-tabs');
    applications.forEach((app, index) => {
        const tab = document.createElement('div');
        tab.className = `application-tab ${index === 0 ? 'active' : ''}`;
        tab.dataset.tab = app.icon;
        
        tab.innerHTML = `
            <div class="tab-icon ${app.icon}"></div>
            <h4>${app.title}</h4>
            <div class="tab-content">
                <p>${app.description}</p>
            </div>
        `;
        
        applicationTabs.appendChild(tab);
    });
    
    // Add shape combinations
    const combinations = [
        { 
            shapes: ['circle', 'square'], 
            description: 'Balance between friendly and professional',
            effect: 'Approachable yet trustworthy'
        },
        { 
            shapes: ['triangle', 'organic'], 
            description: 'Dynamic energy with natural flow',
            effect: 'Innovative and creative'
        },
        { 
            shapes: ['square', 'triangle'], 
            description: 'Stability with directional energy',
            effect: 'Strong and progressive'
        },
        { 
            shapes: ['circle', 'organic'], 
            description: 'Complete harmony with natural feel',
            effect: 'Comforting and inclusive'
        }
    ];
    
    const combinationGallery = psychologySection.querySelector('.combination-gallery');
    combinations.forEach(combo => {
        const item = document.createElement('div');
        item.className = 'combination-item';
        
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'combination-shapes';
        
        combo.shapes.forEach(shape => {
            const shapeElement = document.createElement('div');
            shapeElement.className = `combination-shape ${shape}`;
            shapesContainer.appendChild(shapeElement);
            
            // Create the actual shape
            createCombinationShape(shapeElement, shape);
        });
        
        item.innerHTML = `
            ${shapesContainer.outerHTML}
            <div class="combination-info">
                <p class="combination-description">${combo.description}</p>
                <p class="combination-effect">Effect: <strong>${combo.effect}</strong></p>
            </div>
        `;
        
        combinationGallery.appendChild(item);
    });
    
    // Add styles specific to psychology section
    const psychologyStyles = document.createElement('style');
    psychologyStyles.textContent = `
        .psychology-intro {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 3rem;
        }
        
        .intro-content {
            flex: 1;
        }
        
        .intro-content p {
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .psychology-animation {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .psychology-shapes-container {
            position: relative;
            width: 300px;
            height: 300px;
        }
        
        .psychology-shape {
            position: absolute;
            transition: all var(--transition-speed);
            animation: float 6s ease-in-out infinite;
        }
        
        .psychology-shape.circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: var(--primary-color);
            top: 50px;
            left: 50px;
            animation-delay: 0s;
        }
        
        .psychology-shape.square {
            width: 100px;
            height: 100px;
            background-color: var(--accent-color);
            top: 50px;
            left: 150px;
            animation-delay: 0.5s;
        }
        
        .psychology-shape.triangle {
            width: 0;
            height: 0;
            border-left: 50px solid transparent;
            border-right: 50px solid transparent;
            border-bottom: 90px solid var(--secondary-color);
            top: 150px;
            left: 100px;
            animation-delay: 1s;
        }
        
        .psychology-shape.spiral {
            width: 100px;
            height: 100px;
            top: 150px;
            left: 200px;
            animation-delay: 1.5s;
        }
        
        .psychology-shape.spiral::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,50 Q55,20 80,20 Q105,20 105,50 Q105,80 70,80 Q40,80 40,50 Q40,20 10,20' fill='none' stroke='%23A5D8FF' stroke-width='3'/%3E%3C/svg%3E") no-repeat center;
        }
        
        .shape-emotions {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 1rem;
        }
        
        .shape-emotions h3 {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
        }
        
        .shape-emotions h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .emotion-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .emotion-card {
            background-color: var(--card-color);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px var(--shadow-color);
            transition: all var(--transition-speed);
            position: relative;
            overflow: hidden;
        }
        
        .emotion-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px var(--shadow-color);
        }
        
        .emotion-shape-container {
            width: 100px;
            height: 100px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .emotion-shape {
            transition: all var(--transition-speed);
        }
        
        .emotion-card:hover .emotion-shape {
            transform: scale(1.1);
            filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
        }
        
        .emotion-card h4 {
            text-align: center;
            margin-bottom: 1rem;
            color: var(--text-color);
        }
        
        .emotion-card p {
            text-align: center;
            color: var(--text-color);
            opacity: 0.8;
            margin-bottom: 1rem;
        }
        
        .emotion-color {
            width: 100%;
            height: 5px;
            border-radius: 5px;
            transition: all var(--transition-speed);
        }
        
        .emotion-card:hover .emotion-color {
            height: 10px;
        }
        
        .shape-applications {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 2rem;
            background-color: var(--card-color);
            border-radius: 15px;
            box-shadow: 0 5px 15px var(--shadow-color);
        }
        
        .shape-applications h3 {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
        }
        
        .shape-applications h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .application-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
        }
        
        .application-tab {
            flex: 1;
            min-width: 250px;
            background-color: var(--background-color);
            padding: 1.5rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all var(--transition-speed);
            text-align: center;
        }
        
        .application-tab.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .application-tab.active .tab-icon {
            filter: brightness(0) invert(1);
        }
        
        .application-tab h4 {
            margin-bottom: 1rem;
        }
        
        .tab-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height var(--transition-speed);
        }
        
        .application-tab.active .tab-content {
            max-height: 200px;
        }
        
        .tab-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            transition: all var(--transition-speed);
        }
        
        .tab-icon.web {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%236B8FF7' d='M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m-1 2v6h5v-2h-3V6h-2z'/%3E%3C/svg%3E");
        }
        
        .tab-icon.product {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234ECDC4' d='M12 2a2 2 0 0 0-2 2c0 .74.4 1.39 1 1.73V7h2V5.73c.6-.34 1-.99 1-1.73a2 2 0 0 0-2-2m7 6v2h-2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10H5V8h14z'/%3E%3C/svg%3E");
        }
        
        .tab-icon.architecture {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFE66D' d='M12 2L2 7v10l10 5l10-5V7L12 2m0 2.8L20 9v6l-8 4l-8-4V9l8-4.2M12 11a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1z'/%3E%3C/svg%3E");
        }
        
        .tab-icon.marketing {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF6B6B' d='M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8m-1 3h2v6h-2V7m0 8h2v2h-2v-2z'/%3E%3C/svg%3E");
        }
        
        .shape-combinations {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 1rem;
        }
        
        .shape-combinations h3 {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
        }
        
        .shape-combinations h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .combination-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .combination-item {
            background-color: var(--card-color);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px var(--shadow-color);
            transition: all var(--transition-speed);
        }
        
        .combination-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px var(--shadow-color);
        }
        
        .combination-shapes {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .combination-shape {
            width: 50px;
            height: 50px;
            transition: all var(--transition-speed);
        }
        
        .combination-item:hover .combination-shape {
            transform: scale(1.2);
        }
        
        .combination-info {
            text-align: center;
        }
        
        .combination-description {
            font-style: italic;
            margin-bottom: 0.5rem;
        }
        
        .combination-effect {
            font-size: 0.9rem;
        }
    `;
    
    document.head.appendChild(psychologyStyles);
    
    // Add tab functionality
    const tabs = psychologySection.querySelectorAll('.application-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function createEmotionShape(element, shapeType, color) {
    element.style.color = color;
    
    switch(shapeType) {
        case 'circle':
            element.style.width = '80px';
            element.style.height = '80px';
            element.style.borderRadius = '50%';
            element.style.backgroundColor = 'currentColor';
            break;
        case 'square':
            element.style.width = '80px';
            element.style.height = '80px';
            element.style.backgroundColor = 'currentColor';
            break;
        case 'triangle':
            element.style.width = '0';
            element.style.height = '0';
            element.style.borderLeft = '40px solid transparent';
            element.style.borderRight = '40px solid transparent';
            element.style.borderBottom = `70px solid ${color}`;
            element.style.backgroundColor = 'transparent';
            break;
        case 'organic':
            element.style.width = '80px';
            element.style.height = '80px';
            element.style.borderRadius = '60% 40% 30% 70% / 60% 30% 70% 40%';
            element.style.backgroundColor = 'currentColor';
            element.style.animation = 'morph 8s ease-in-out infinite';
            break;
        case 'spiral':
            element.innerHTML = `
                <svg viewBox="0 0 100 100" width="80" height="80">
                    <path d="M50,50 Q55,20 80,20 Q105,20 105,50 Q105,80 70,80 Q40,80 40,50 Q40,20 10,20" 
                          fill="none" stroke="currentColor" stroke-width="3"/>
                </svg>
            `;
            break;
        case 'abstract':
            element.innerHTML = `
                <svg viewBox="0 0 100 100" width="80" height="80">
                    <path d="M20,20 L80,20 L100,50 L80,80 L20,80 L0,50 Z" 
                          fill="currentColor"/>
                </svg>
            `;
            break;
    }
}

function createCombinationShape(element, shapeType) {
    switch(shapeType) {
        case 'circle':
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.borderRadius = '50%';
            element.style.backgroundColor = 'var(--primary-color)';
            break;
        case 'square':
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.backgroundColor = 'var(--accent-color)';
            break;
        case 'triangle':
            element.style.width = '0';
            element.style.height = '0';
            element.style.borderLeft = '25px solid transparent';
            element.style.borderRight = '25px solid transparent';
            element.style.borderBottom = '45px solid var(--secondary-color)';
            element.style.backgroundColor = 'transparent';
            break;
        case 'organic':
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.borderRadius = '60% 40% 30% 70% / 60% 30% 70% 40%';
            element.style.backgroundColor = 'var(--primary-color)';
            break;
    }
}