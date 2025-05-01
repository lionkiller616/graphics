// Color Psychology Section
export function initPsychologySection() {
    const psychologySection = document.querySelector('.psychology-section');
    
    psychologySection.innerHTML = `
        <h2>Color Psychology</h2>
        <p>Discover how different colors affect human emotions and behavior.</p>
        
        <div class="psychology-accordion">
            <div class="accordion-item">
                <div class="accordion-header">
                    <h3><i class="fas fa-heart"></i> Red Psychology</h3>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="accordion-content">
                    <p>Red is a powerful color that evokes strong emotions. It's associated with energy, passion, danger, and action. In marketing, red is often used to create urgency (think clearance sales).</p>
                    <ul>
                        <li><strong>Positive associations:</strong> Love, excitement, strength</li>
                        <li><strong>Negative associations:</strong> Aggression, danger, stress</li>
                        <li><strong>Best uses:</strong> Call-to-action buttons, food industry, emergency signals</li>
                    </ul>
                </div>
            </div>
            
            <div class="accordion-item">
                <div class="accordion-header">
                    <h3><i class="fas fa-sun"></i> Yellow Psychology</h3>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="accordion-content">
                    <p>Yellow is the color of sunshine and is associated with joy, happiness, and energy. It's the most visible color to the human eye and grabs attention effectively.</p>
                    <ul>
                        <li><strong>Positive associations:</strong> Optimism, creativity, warmth</li>
                        <li><strong>Negative associations:</strong> Anxiety, caution (when overused)</li>
                        <li><strong>Best uses:</strong> Highlighting important information, children's products, summer themes</li>
                    </ul>
                </div>
            </div>
            
            <div class="accordion-item">
                <div class="accordion-header">
                    <h3><i class="fas fa-leaf"></i> Green Psychology</h3>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="accordion-content">
                    <p>Green represents nature, growth, and harmony. It's the most restful color for the human eye and is often associated with health, freshness, and the environment.</p>
                    <ul>
                        <li><strong>Positive associations:</strong> Peace, renewal, stability</li>
                        <li><strong>Negative associations:</strong> Boredom, stagnation (in dull shades)</li>
                        <li><strong>Best uses:</strong> Environmental brands, healthcare, financial institutions</li>
                    </ul>
                </div>
            </div>
            
            <div class="accordion-item">
                <div class="accordion-header">
                    <h3><i class="fas fa-tint"></i> Blue Psychology</h3>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="accordion-content">
                    <p>Blue is the world's favorite color and is associated with trust, security, and stability. It has a calming effect and is often used in corporate settings.</p>
                    <ul>
                        <li><strong>Positive associations:</strong> Trust, loyalty, wisdom</li>
                        <li><strong>Negative associations:</strong> Coldness, emotionlessness</li>
                        <li><strong>Best uses:</strong> Corporate branding, social media platforms, healthcare</li>
                    </ul>
                </div>
            </div>
            
            <div class="accordion-item">
                <div class="accordion-header">
                    <h3><i class="fas fa-cloud"></i> Purple Psychology</h3>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="accordion-content">
                    <p>Purple combines the stability of blue and the energy of red. Historically associated with royalty, it often represents luxury, wisdom, and creativity.</p>
                    <ul>
                        <li><strong>Positive associations:</strong> Luxury, spirituality, imagination</li>
                        <li><strong>Negative associations:</strong> Arrogance, decadence</li>
                        <li><strong>Best uses:</strong> Beauty products, creative industries, luxury brands</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="color-emotion-grid">
            <div class="emotion-card">
                <div class="color-symbol" style="background: #ff0000;">
                    <i class="fas fa-heart"></i>
                </div>
                <h4>Red</h4>
                <p>Passion, Energy, Danger</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #ffa500;">
                    <i class="fas fa-fire"></i>
                </div>
                <h4>Orange</h4>
                <p>Creativity, Adventure, Enthusiasm</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #ffff00;">
                    <i class="fas fa-sun"></i>
                </div>
                <h4>Yellow</h4>
                <p>Happiness, Optimism, Caution</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #008000;">
                    <i class="fas fa-leaf"></i>
                </div>
                <h4>Green</h4>
                <p>Growth, Harmony, Freshness</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #0000ff;">
                    <i class="fas fa-tint"></i>
                </div>
                <h4>Blue</h4>
                <p>Trust, Peace, Loyalty</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #4b0082;">
                    <i class="fas fa-crown"></i>
                </div>
                <h4>Indigo</h4>
                <p>Intuition, Mystery, Wisdom</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #ee82ee;">
                    <i class="fas fa-cloud"></i>
                </div>
                <h4>Violet</h4>
                <p>Creativity, Luxury, Spirituality</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #000000;">
                    <i class="fas fa-moon"></i>
                </div>
                <h4>Black</h4>
                <p>Power, Elegance, Mystery</p>
            </div>
            
            <div class="emotion-card">
                <div class="color-symbol" style="background: #ffffff; color: #333; border: 1px solid #ddd;">
                    <i class="fas fa-snowflake"></i>
                </div>
                <h4>White</h4>
                <p>Purity, Cleanliness, Simplicity</p>
            </div>
        </div>
    `;
    
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.accordion-item.active');
            
            // If this item is already active, close it
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                return;
            }
            
            // Close any other open items
            if (currentlyActive) {
                currentlyActive.classList.remove('active');
            }
            
            // Open this item
            item.classList.add('active');
        });
    });
    
    // Micro-interactions for emotion cards
    document.querySelectorAll('.emotion-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const symbol = card.querySelector('.color-symbol');
            symbol.style.transform = 'scale(1.1) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            const symbol = card.querySelector('.color-symbol');
            symbol.style.transform = 'scale(1) rotate(0)';
        });
    });
}