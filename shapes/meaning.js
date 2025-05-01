function initializeMeaningSection() {
    const meaningSection = document.getElementById('meaning');
    
    // Create content for meaning section
    meaningSection.innerHTML = `
        <div class="section-header">
            <div class="header-shape-container">
                <div class="header-shape circle"></div>
            </div>
            <h2>The Meaning Behind Shapes</h2>
            <p>Discover the universal and cultural significance of different geometric forms</p>
        </div>
        
        <div class="shape-meanings-container">
            <div class="shape-category">
                <h3>Basic Geometric Shapes</h3>
                <div class="shapes-grid">
                    <!-- Basic shapes will be added here by JS -->
                </div>
            </div>
            
            <div class="shape-category">
                <h3>Complex Shapes</h3>
                <div class="shapes-grid">
                    <!-- Complex shapes will be added here by JS -->
                </div>
            </div>
            
            <div class="shape-category">
                <h3>Organic Shapes</h3>
                <div class="shapes-grid">
                    <!-- Organic shapes will be added here by JS -->
                </div>
            </div>
        </div>
        
        <div class="cultural-context">
            <h3>Cultural Context of Shapes</h3>
            <div class="culture-grid">
                <!-- Cultural info will be added here by JS -->
            </div>
        </div>
    `;
    
    // Add basic shapes
    const basicShapes = [
        { name: 'Circle', meaning: 'Unity, eternity, completeness', color: '#FF6B6B' },
        { name: 'Square', meaning: 'Stability, balance, reliability', color: '#4ECDC4' },
        { name: 'Triangle', meaning: 'Dynamism, tension, direction', color: '#FFE66D' },
        { name: 'Rectangle', meaning: 'Familiarity, comfort, order', color: '#6B8FF7' }
    ];
    
    const basicGrid = meaningSection.querySelector('.shape-category:first-child .shapes-grid');
    basicShapes.forEach(shape => {
        basicGrid.appendChild(createShapeMeaningCard(shape));
    });
    
    // Add complex shapes
    const complexShapes = [
        { name: 'Pentagon', meaning: 'The human body, life, nature', color: '#A5D8FF' },
        { name: 'Hexagon', meaning: 'Communication, balance, union', color: '#7DEDFF' },
        { name: 'Star', meaning: 'Spirituality, excellence, energy', color: '#FF9E7D' },
        { name: 'Spiral', meaning: 'Growth, evolution, cosmic energy', color: '#C792EA' }
    ];
    
    const complexGrid = meaningSection.querySelectorAll('.shape-category')[1].querySelector('.shapes-grid');
    complexShapes.forEach(shape => {
        complexGrid.appendChild(createShapeMeaningCard(shape));
    });
    
    // Add organic shapes
    const organicShapes = [
        { name: 'Heart', meaning: 'Love, emotion, compassion', color: '#FF6B6B' },
        { name: 'Cloud', meaning: 'Transience, creativity, dreams', color: '#A5D8FF' },
        { name: 'Blob', meaning: 'Approachability, friendliness', color: '#7DEDFF' },
        { name: 'Wave', meaning: 'Fluidity, change, movement', color: '#6B8FF7' }
    ];
    
    const organicGrid = meaningSection.querySelectorAll('.shape-category')[2].querySelector('.shapes-grid');
    organicShapes.forEach(shape => {
        organicGrid.appendChild(createShapeMeaningCard(shape));
    });
    
    // Add cultural context
    const cultures = [
        { 
            name: 'Eastern', 
            description: 'In many Eastern cultures, the circle represents harmony and the cyclical nature of life, while squares symbolize earth and stability.',
            shapes: ['Circle', 'Square', 'Dragon']
        },
        { 
            name: 'Western', 
            description: 'Western cultures often associate triangles with hierarchy and direction, while stars represent achievement and aspiration.',
            shapes: ['Triangle', 'Star', 'Cross']
        },
        { 
            name: 'Indigenous', 
            description: 'Many indigenous cultures use spirals to represent the journey of life and interconnectedness of all things.',
            shapes: ['Spiral', 'Animal shapes', 'Sun symbols']
        }
    ];
    
    const cultureGrid = meaningSection.querySelector('.culture-grid');
    cultures.forEach(culture => {
        const cultureCard = document.createElement('div');
        cultureCard.className = 'culture-card';
        
        cultureCard.innerHTML = `
            <div class="culture-header">
                <h4>${culture.name}</h4>
                <div class="culture-shapes">
                    ${culture.shapes.map(shape => `<span class="culture-shape">${shape}</span>`).join('')}
                </div>
            </div>
            <p>${culture.description}</p>
            <div class="culture-pattern"></div>
        `;
        
        cultureGrid.appendChild(cultureCard);
    });
    
    // Add styles specific to meaning section
    const meaningStyles = document.createElement('style');
    meaningStyles.textContent = `
        .shape-meanings-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 1rem;
        }
        
        .shape-category {
            margin-bottom: 3rem;
        }
        
        .shape-category h3 {
            text-align: center;
            margin-bottom: 1.5rem;
            position: relative;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .shape-category h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .shapes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .shape-meaning-card {
            background-color: var(--card-color);
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px var(--shadow-color);
            transition: all var(--transition-speed);
            position: relative;
            overflow: hidden;
        }
        
        .shape-meaning-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px var(--shadow-color);
        }
        
        .shape-meaning-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .shape-visual {
            width: 100px;
            height: 100px;
            margin: 0 auto 1rem;
            position: relative;
        }
        
        .shape-name {
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        
        .shape-meaning {
            text-align: center;
            color: var(--text-color);
            opacity: 0.8;
        }
        
        .cultural-context {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 2rem;
            background-color: var(--card-color);
            border-radius: 15px;
            box-shadow: 0 5px 15px var(--shadow-color);
        }
        
        .cultural-context h3 {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
        }
        
        .cultural-context h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .culture-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .culture-card {
            background-color: var(--background-color);
            padding: 1.5rem;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            transition: all var(--transition-speed);
        }
        
        .culture-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px var(--shadow-color);
        }
        
        .culture-header {
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .culture-shapes {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        
        .culture-shape {
            background-color: var(--primary-color);
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 15px;
            font-size: 0.8rem;
        }
        
        .culture-pattern {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100px;
            height: 100px;
            opacity: 0.1;
            background-size: 20px 20px;
            background-image: linear-gradient(45deg, var(--primary-color) 25%, transparent 25%, transparent 75%, var(--primary-color) 75%, var(--primary-color)), 
                              linear-gradient(45deg, var(--primary-color) 25%, transparent 25%, transparent 75%, var(--primary-color) 75%, var(--primary-color));
        }
        
        .section-header {
            text-align: center;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header-shape-container {
            width: 120px;
            height: 120px;
            margin: 0 auto 1rem;
            position: relative;
        }
        
        .header-shape {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: var(--primary-color);
            animation: pulse 2s infinite;
        }
        
        .section-header h2 {
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        
        .section-header p {
            font-size: 1.2rem;
            opacity: 0.8;
        }
    `;
    
    document.head.appendChild(meaningStyles);
}

function createShapeMeaningCard(shapeData) {
    const card = document.createElement('div');
    card.className = 'shape-meaning-card';
    
    const visual = document.createElement('div');
    visual.className = 'shape-visual';
    
    // Create the shape based on name
    const shapeElement = document.createElement('div');
    shapeElement.className = 'meaning-shape';
    
    // Set shape properties based on name
    switch(shapeData.name.toLowerCase()) {
        case 'circle':
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.borderRadius = '50%';
            break;
        case 'square':
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            break;
        case 'triangle':
            shapeElement.style.width = '0';
            shapeElement.style.height = '0';
            shapeElement.style.borderLeft = '50px solid transparent';
            shapeElement.style.borderRight = '50px solid transparent';
            shapeElement.style.borderBottom = '90px solid';
            shapeElement.style.margin = '0 auto';
            break;
        case 'rectangle':
            shapeElement.style.width = '70%';
            shapeElement.style.height = '100%';
            shapeElement.style.margin = '0 auto';
            break;
        case 'pentagon':
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
            break;
        case 'hexagon':
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
            break;
        case 'star':
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            break;
        case 'heart':
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.position = 'relative';
            shapeElement.style.transform = 'rotate(45deg)';
            shapeElement.style.margin = '10% auto';
            shapeElement.style.borderRadius = '50% 50% 0 0';
            shapeElement.style.boxShadow = `
                -15px 0 0 0 currentColor,
                0 -15px 0 0 currentColor
            `;
            break;
        case 'spiral':
            // Create SVG spiral
            shapeElement.innerHTML = `
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <path d="M50,50 Q55,20 80,20 Q105,20 105,50 Q105,80 70,80 Q40,80 40,50 Q40,20 10,20" 
                          fill="none" stroke="currentColor" stroke-width="3"/>
                </svg>
            `;
            break;
        case 'cloud':
            // Create SVG cloud
            shapeElement.innerHTML = `
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <path d="M25,60 Q10,60 10,45 Q10,30 25,30 Q30,15 45,15 Q60,15 65,30 Q80,30 80,45 Q80,60 65,60 Z" 
                          fill="currentColor"/>
                </svg>
            `;
            break;
        case 'blob':
            // Create SVG blob
            shapeElement.innerHTML = `
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <path d="M50,15 Q70,10 75,30 Q80,50 65,70 Q50,90 30,70 Q15,50 25,30 Q35,10 50,15 Z" 
                          fill="currentColor"/>
                </svg>
            `;
            break;
        case 'wave':
            // Create SVG wave
            shapeElement.innerHTML = `
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <path d="M0,50 Q25,30 50,50 Q75,70 100,50 L100,100 L0,100 Z" 
                          fill="currentColor"/>
                </svg>
            `;
            break;
        default:
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.backgroundColor = 'currentColor';
    }
    
    shapeElement.style.color = shapeData.color;
    visual.appendChild(shapeElement);
    
    const name = document.createElement('div');
    name.className = 'shape-name';
    name.textContent = shapeData.name;
    
    const meaning = document.createElement('div');
    meaning.className = 'shape-meaning';
    meaning.textContent = shapeData.meaning;
    
    card.appendChild(visual);
    card.appendChild(name);
    card.appendChild(meaning);
    
    return card;
}