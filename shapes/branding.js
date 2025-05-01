function initializeBrandingSection() {
    const brandingSection = document.getElementById('branding');
    
    // Create content for branding section
    brandingSection.innerHTML = `
        <div class="section-header">
            <div class="header-shape-container">
                <div class="header-shape square"></div>
            </div>
            <h2>Shapes in Branding</h2>
            <p>How companies use geometric forms to communicate their values and identity</p>
        </div>
        
        <div class="branding-intro">
            <p>Shapes are powerful tools in branding, conveying messages without words. Companies carefully select shapes that align with their brand personality and values.</p>
            <div class="branding-shape-animation">
                <!-- Animated shape will be added here -->
            </div>
        </div>
        
        <div class="shape-categories">
            <div class="shape-category">
                <h3>Circles in Branding</h3>
                <div class="brand-examples" data-shape="circle">
                    <!-- Circle brand examples will be added here -->
                </div>
            </div>
            
            <div class="shape-category">
                <h3>Squares in Branding</h3>
                <div class="brand-examples" data-shape="square">
                    <!-- Square brand examples will be added here -->
                </div>
            </div>
            
            <div class="shape-category">
                <h3>Triangles in Branding</h3>
                <div class="brand-examples" data-shape="triangle">
                    <!-- Triangle brand examples will be added here -->
                </div>
            </div>
            
            <div class="shape-category">
                <h3>Abstract Shapes</h3>
                <div class="brand-examples" data-shape="abstract">
                    <!-- Abstract brand examples will be added here -->
                </div>
            </div>
        </div>
        
        <div class="branding-psychology">
            <h3>The Psychology Behind Brand Shapes</h3>
            <div class="psychology-grid">
                <!-- Psychology info will be added here -->
            </div>
        </div>
    `;
    
    // Create animated branding shape
    const brandingAnimation = brandingSection.querySelector('.branding-shape-animation');
    brandingAnimation.innerHTML = `
        <div class="morphing-shape"></div>
    `;
    
    // Add brand examples for each shape category
    const circleBrands = [
        { name: 'Target', description: 'Circles represent unity and community, perfect for a retail brand.', color: '#FF6B6B' },
        { name: 'BMW', description: 'The circular logo suggests motion and completeness.', color: '#6B8FF7' },
        { name: 'Starbucks', description: 'The circular emblem creates a sense of belonging.', color: '#4ECDC4' }
    ];
    
    const squareBrands = [
        { name: 'Microsoft', description: 'Squares suggest stability and structure.', color: '#7DEDFF' },
        { name: 'National Geographic', description: 'The yellow square frames content authoritatively.', color: '#FFE66D' },
        { name: 'American Express', description: 'Square represents trust and solidity.', color: '#A5D8FF' }
    ];
    
    const triangleBrands = [
        { name: 'Adidas', description: 'Triangles suggest dynamism and direction.', color: '#FF9E7D' },
        { name: 'Google Play', description: 'Triangle points forward, suggesting progress.', color: '#C792EA' },
        { name: 'Puma', description: 'The leaping cat forms a triangle of energy.', color: '#FF6B6B' }
    ];
    
    const abstractBrands = [
        { name: 'Nike', description: 'The swoosh suggests motion and achievement.', color: '#000000' },
        { name: 'McDonald\'s', description: 'The golden arches form an abstract "M".', color: '#FFE66D' },
        { name: 'Twitter', description: 'The bird suggests freedom and communication.', color: '#1DA1F2' }
    ];
    
    addBrandExamples(brandingSection.querySelector('[data-shape="circle"]'), circleBrands, 'circle');
    addBrandExamples(brandingSection.querySelector('[data-shape="square"]'), squareBrands, 'square');
    addBrandExamples(brandingSection.querySelector('[data-shape="triangle"]'), triangleBrands, 'triangle');
    addBrandExamples(brandingSection.querySelector('[data-shape="abstract"]'), abstractBrands, 'abstract');
    
    // Add psychology info
    const psychologyPoints = [
        { 
            title: 'Trust & Security', 
            description: 'Angular shapes with rounded corners are perceived as both strong and approachable, ideal for financial institutions.',
            shape: 'rounded-square'
        },
        { 
            title: 'Innovation & Creativity', 
            description: 'Asymmetrical and organic shapes suggest innovation and forward-thinking, often used by tech companies.',
            shape: 'organic'
        },
        { 
            title: 'Tradition & Reliability', 
            description: 'Classic geometric shapes convey tradition and reliability, favored by established brands.',
            shape: 'classic'
        },
        { 
            title: 'Energy & Movement', 
            description: 'Diagonal lines and dynamic shapes communicate energy and movement, perfect for sports brands.',
            shape: 'dynamic'
        }
    ];
    
    const psychologyGrid = brandingSection.querySelector('.psychology-grid');
    psychologyPoints.forEach(point => {
        const card = document.createElement('div');
        card.className = 'psychology-card';
        
        card.innerHTML = `
            <div class="psychology-shape ${point.shape}"></div>
            <h4>${point.title}</h4>
            <p>${point.description}</p>
        `;
        
        psychologyGrid.appendChild(card);
    });
    
    // Add styles specific to branding section
    const brandingStyles = document.createElement('style');
    brandingStyles.textContent = `
        .branding-intro {
            max-width: 800px;
            margin: 2rem auto;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 2rem;
        }
        
        .branding-intro p {
            flex: 1;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .branding-shape-animation {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .morphing-shape {
            width: 150px;
            height: 150px;
            background-color: var(--primary-color);
            border-radius: 50%;
            animation: morph 8s infinite var(--bounce-effect);
        }
        
        @keyframes morph {
            0% {
                border-radius: 50%;
                background-color: var(--primary-color);
                transform: rotate(0deg);
            }
            25% {
                border-radius: 10%;
                background-color: var(--secondary-color);
                transform: rotate(90deg);
            }
            50% {
                border-radius: 50% 20% 50% 20%;
                background-color: var(--accent-color);
                transform: rotate(180deg);
            }
            75% {
                clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                background-color: var(--secondary-color);
                transform: rotate(270deg);
            }
            100% {
                border-radius: 50%;
                background-color: var(--primary-color);
                transform: rotate(360deg);
            }
        }
        
        .shape-categories {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 1rem;
        }
        
        .shape-category {
            margin-bottom: 3rem;
        }
        
        .shape-category h3 {
            text-align: center;
            margin-bottom: 1.5rem;
            position: relative;
        }
        
        .shape-category h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .brand-examples {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .brand-card {
            background-color: var(--card-color);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px var(--shadow-color);
            transition: all var(--transition-speed);
            position: relative;
            overflow: hidden;
        }
        
        .brand-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px var(--shadow-color);
        }
        
        .brand-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .brand-logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .brand-name {
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        
        .brand-description {
            text-align: center;
            color: var(--text-color);
            opacity: 0.8;
        }
        
        .branding-psychology {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 2rem;
            background-color: var(--card-color);
            border-radius: 15px;
            box-shadow: 0 5px 15px var(--shadow-color);
        }
        
        .branding-psychology h3 {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
        }
        
        .branding-psychology h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        }
        
        .psychology-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .psychology-card {
            background-color: var(--background-color);
            padding: 1.5rem;
            border-radius: 10px;
            transition: all var(--transition-speed);
            text-align: center;
        }
        
        .psychology-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px var(--shadow-color);
        }
        
        .psychology-shape {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            transition: all var(--transition-speed);
        }
        
        .psychology-card:hover .psychology-shape {
            transform: scale(1.1);
        }
        
        .rounded-square {
            background-color: var(--primary-color);
            border-radius: 15px;
        }
        
        .organic {
            background-color: var(--secondary-color);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            animation: morph 8s ease-in-out infinite;
        }
        
        .classic {
            background-color: var(--accent-color);
            clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
        }
        
        .dynamic {
            background-color: var(--primary-color);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            animation: rotate 4s linear infinite;
        }
    `;
    
    document.head.appendChild(brandingStyles);
}

function addBrandExamples(container, brands, shapeType) {
    brands.forEach(brand => {
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card';
        
        const logo = document.createElement('div');
        logo.className = 'brand-logo';
        
        // Create brand logo based on shape type
        const logoElement = document.createElement('div');
        logoElement.className = 'brand-logo-element';
        
        switch(shapeType) {
            case 'circle':
                logoElement.style.width = '80px';
                logoElement.style.height = '80px';
                logoElement.style.borderRadius = '50%';
                break;
            case 'square':
                logoElement.style.width = '80px';
                logoElement.style.height = '80px';
                break;
            case 'triangle':
                logoElement.style.width = '0';
                logoElement.style.height = '0';
                logoElement.style.borderLeft = '40px solid transparent';
                logoElement.style.borderRight = '40px solid transparent';
                logoElement.style.borderBottom = '70px solid';
                break;
            case 'abstract':
                // Create abstract shape based on brand
                if (brand.name === 'Nike') {
                    logoElement.innerHTML = `
                        <svg viewBox="0 0 100 100" width="80" height="80">
                            <path d="M10,50 Q35,10 90,50" stroke="${brand.color}" stroke-width="8" fill="none"/>
                        </svg>
                    `;
                } else if (brand.name === 'McDonald\'s') {
                    logoElement.innerHTML = `
                        <svg viewBox="0 0 100 100" width="80" height="80">
                            <path d="M10,50 Q25,20 50,50 Q75,80 90,50 L50,50 L10,50 Z" fill="${brand.color}"/>
                        </svg>
                    `;
                } else {
                    // Twitter bird
                    logoElement.innerHTML = `
                        <svg viewBox="0 0 100 100" width="80" height="80">
                            <path d="M90,30 C85,35 80,35 75,35 C80,30 82,25 83,20 C78,25 73,27 68,28 C63,23 55,23 50,27 C45,23 37,23 32,28 C27,27 22,25 17,20 C18,25 20,30 25,35 C20,35 15,35 10,30 C10,35 10,40 15,45 C10,45 5,45 0,45 C5,50 10,55 15,55 C10,60 5,65 0,65 C5,65 10,65 15,65 C15,75 25,85 35,85 C25,90 15,95 0,95 C30,100 60,100 90,70 C90,70 95,65 100,60 C95,65 90,65 85,65 Z" fill="${brand.color}"/>
                        </svg>
                    `;
                }
                break;
        }
        
        if (shapeType !== 'abstract') {
            logoElement.style.backgroundColor = brand.color;
            if (shapeType === 'triangle') {
                logoElement.style.borderBottomColor = brand.color;
            }
        }
        
        logo.appendChild(logoElement);
        
        const name = document.createElement('div');
        name.className = 'brand-name';
        name.textContent = brand.name;
        
        const description = document.createElement('div');
        description.className = 'brand-description';
        description.textContent = brand.description;
        
        brandCard.appendChild(logo);
        brandCard.appendChild(name);
        brandCard.appendChild(description);
        
        container.appendChild(brandCard);
    });
}