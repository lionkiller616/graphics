document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Smooth Scrolling for Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.element-section').forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Line Canvas Drawing
    const lineCanvas = document.getElementById('line-canvas');
    const lineCtx = lineCanvas.getContext('2d');
    const lineTypeSelect = document.getElementById('line-type');
    const lineWidthSlider = document.getElementById('line-width');
    
    function drawLines() {
        lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        lineCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        
        const lineWidth = parseInt(lineWidthSlider.value);
        lineCtx.lineWidth = lineWidth;
        
        switch(lineTypeSelect.value) {
            case 'dashed':
                lineCtx.setLineDash([5, 3]);
                break;
            case 'dotted':
                lineCtx.setLineDash([2, 2]);
                break;
            default:
                lineCtx.setLineDash([]);
        }
        
        // Horizontal line
        lineCtx.beginPath();
        lineCtx.moveTo(50, 50);
        lineCtx.lineTo(250, 50);
        lineCtx.stroke();
        
        // Vertical line
        lineCtx.beginPath();
        lineCtx.moveTo(150, 20);
        lineCtx.lineTo(150, 80);
        lineCtx.stroke();
        
        // Diagonal line
        lineCtx.beginPath();
        lineCtx.moveTo(50, 80);
        lineCtx.lineTo(100, 20);
        lineCtx.stroke();
        
        // Curved line
        lineCtx.beginPath();
        lineCtx.moveTo(120, 80);
        lineCtx.quadraticCurveTo(150, 20, 180, 80);
        lineCtx.stroke();
        
        // Zigzag line
        lineCtx.beginPath();
        lineCtx.moveTo(200, 20);
        lineCtx.lineTo(220, 80);
        lineCtx.lineTo(240, 40);
        lineCtx.lineTo(260, 60);
        lineCtx.stroke();
    }
    
    lineTypeSelect.addEventListener('change', drawLines);
    lineWidthSlider.addEventListener('input', drawLines);
    drawLines();
    
    // Shape Canvas Drawing
    const shapeCanvas = document.getElementById('shape-canvas');
    const shapeCtx = shapeCanvas.getContext('2d');
    let isDrawing = false;
    let currentShape = 'circle';
    let startX, startY;
    
    document.querySelectorAll('.shape-options button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.dataset.shape === 'clear') {
                shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            } else {
                currentShape = this.dataset.shape;
            }
        });
    });
    
    shapeCanvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });
    
    shapeCanvas.addEventListener('mousemove', function(e) {
        if (!isDrawing) return;
        
        shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
        shapeCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        
        switch(currentShape) {
            case 'circle':
                const radius = Math.sqrt(width * width + height * height);
                shapeCtx.beginPath();
                shapeCtx.arc(startX, startY, radius, 0, Math.PI * 2);
                shapeCtx.fill();
                break;
                
            case 'square':
                const size = Math.max(Math.abs(width), Math.abs(height));
                const squareX = width < 0 ? startX - size : startX;
                const squareY = height < 0 ? startY - size : startY;
                shapeCtx.fillRect(squareX, squareY, size, size);
                break;
                
            case 'triangle':
                shapeCtx.beginPath();
                shapeCtx.moveTo(startX, startY);
                shapeCtx.lineTo(e.offsetX, e.offsetY);
                shapeCtx.lineTo(startX * 2 - e.offsetX, e.offsetY);
                shapeCtx.closePath();
                shapeCtx.fill();
                break;
                
            case 'polygon':
                const sides = 6;
                const angle = (Math.PI * 2) / sides;
                const radiusPoly = Math.sqrt(width * width + height * height);
                
                shapeCtx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const x = startX + radiusPoly * Math.cos(angle * i);
                    const y = startY + radiusPoly * Math.sin(angle * i);
                    if (i === 0) {
                        shapeCtx.moveTo(x, y);
                    } else {
                        shapeCtx.lineTo(x, y);
                    }
                }
                shapeCtx.closePath();
                shapeCtx.fill();
                break;
        }
    });
    
    shapeCanvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });
    
    shapeCanvas.addEventListener('mouseout', function() {
        isDrawing = false;
    });
    
    // 3D Form Drawing
    const formCanvas = document.getElementById('form-canvas');
    const formCtx = formCanvas.getContext('2d');
    let currentForm = 'cube';
    const lightX = document.getElementById('light-x');
    const lightY = document.getElementById('light-y');
    
    document.querySelectorAll('.form-options button').forEach(button => {
        button.addEventListener('click', function() {
            currentForm = this.dataset.form;
            drawForm();
        });
    });
    
    lightX.addEventListener('input', drawForm);
    lightY.addEventListener('input', drawForm);
    
    function drawForm() {
        formCtx.clearRect(0, 0, formCanvas.width, formCanvas.height);
        
        const light = {
            x: parseInt(lightX.value),
            y: parseInt(lightY.value),
            z: -100
        };
        
        const centerX = formCanvas.width / 2;
        const centerY = formCanvas.height / 2;
        const size = 80;
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary');
        
        if (currentForm === 'cube') {
            // Cube vertices
            const vertices = [
                { x: -1, y: -1, z: -1 },
                { x: 1, y: -1, z: -1 },
                { x: 1, y: 1, z: -1 },
                { x: -1, y: 1, z: -1 },
                { x: -1, y: -1, z: 1 },
                { x: 1, y: -1, z: 1 },
                { x: 1, y: 1, z: 1 },
                { x: -1, y: 1, z: 1 }
            ];
            
            // Project 3D to 2D
            const projected = vertices.map(v => {
                // Simple perspective projection
                const distance = 5;
                const factor = distance / (distance + v.z);
                return {
                    x: v.x * factor * size + centerX,
                    y: v.y * factor * size + centerY
                };
            });
            
            // Cube faces
            const faces = [
                { points: [0, 1, 2, 3], color: primaryColor }, // front
                { points: [4, 5, 6, 7], color: secondaryColor }, // back
                { points: [0, 1, 5, 4], color: secondaryColor }, // bottom
                { points: [2, 3, 7, 6], color: primaryColor }, // top
                { points: [0, 3, 7, 4], color: secondaryColor }, // left
                { points: [1, 2, 6, 5], color: primaryColor }  // right
            ];
            
            // Draw faces
            faces.forEach(face => {
                formCtx.beginPath();
                formCtx.moveTo(projected[face.points[0]].x, projected[face.points[0]].y);
                
                for (let i = 1; i < face.points.length; i++) {
                    formCtx.lineTo(projected[face.points[i]].x, projected[face.points[i]].y);
                }
                
                formCtx.closePath();
                formCtx.fillStyle = face.color;
                formCtx.fill();
                formCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                formCtx.stroke();
            });
            
        } else if (currentForm === 'sphere') {
            // Draw sphere
            const radius = size / 2;
            const slices = 20;
            const stacks = 20;
            
            for (let i = 0; i < slices; i++) {
                const theta1 = (i / slices) * Math.PI * 2;
                const theta2 = ((i + 1) / slices) * Math.PI * 2;
                
                for (let j = 0; j < stacks; j++) {
                    const phi1 = (j / stacks) * Math.PI;
                    const phi2 = ((j + 1) / stacks) * Math.PI;
                    
                    // Calculate vertices
                    const x1 = radius * Math.sin(phi1) * Math.cos(theta1);
                    const y1 = radius * Math.sin(phi1) * Math.sin(theta1);
                    const z1 = radius * Math.cos(phi1);
                    
                    const x2 = radius * Math.sin(phi1) * Math.cos(theta2);
                    const y2 = radius * Math.sin(phi1) * Math.sin(theta2);
                    const z2 = radius * Math.cos(phi1);
                    
                    const x3 = radius * Math.sin(phi2) * Math.cos(theta2);
                    const y3 = radius * Math.sin(phi2) * Math.sin(theta2);
                    const z3 = radius * Math.cos(phi2);
                    
                    const x4 = radius * Math.sin(phi2) * Math.cos(theta1);
                    const y4 = radius * Math.sin(phi2) * Math.sin(theta1);
                    const z4 = radius * Math.cos(phi2);
                    
                    // Calculate normal for lighting
                    const nx = (x1 + x2 + x3 + x4) / 4;
                    const ny = (y1 + y2 + y3 + y4) / 4;
                    const nz = (z1 + z2 + z3 + z4) / 4;
                    
                    const lightDot = (nx * light.x + ny * light.y + nz * light.z) / 
                                   (Math.sqrt(nx*nx + ny*ny + nz*nz) * Math.sqrt(light.x*light.x + light.y*light.y + light.z*light.z));
                    
                    const intensity = Math.max(0.2, lightDot);
                    
                    // Project to 2D
                    const distance = 5;
                    const p1 = {
                        x: x1 * distance / (distance + z1) + centerX,
                        y: y1 * distance / (distance + z1) + centerY
                    };
                    
                    const p2 = {
                        x: x2 * distance / (distance + z2) + centerX,
                        y: y2 * distance / (distance + z2) + centerY
                    };
                    
                    const p3 = {
                        x: x3 * distance / (distance + z3) + centerX,
                        y: y3 * distance / (distance + z3) + centerY
                    };
                    
                    const p4 = {
                        x: x4 * distance / (distance + z4) + centerX,
                        y: y4 * distance / (distance + z4) + centerY
                    };
                    
                    // Draw polygon
                    formCtx.beginPath();
                    formCtx.moveTo(p1.x, p1.y);
                    formCtx.lineTo(p2.x, p2.y);
                    formCtx.lineTo(p3.x, p3.y);
                    formCtx.lineTo(p4.x, p4.y);
                    formCtx.closePath();
                    
                    // Apply lighting
                    const color = hexToRgb(primaryColor);
                    formCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity})`;
                    formCtx.fill();
                }
            }
            
        } else if (currentForm === 'pyramid') {
            // Pyramid vertices
            const vertices = [
                { x: 0, y: -1, z: 0 },   // apex
                { x: -1, y: 1, z: -1 },  // base corner 1
                { x: 1, y: 1, z: -1 },   // base corner 2
                { x: 1, y: 1, z: 1 },    // base corner 3
                { x: -1, y: 1, z: 1 }    // base corner 4
            ];
            
            // Project 3D to 2D
            const projected = vertices.map(v => {
                // Simple perspective projection
                const distance = 5;
                const factor = distance / (distance + v.z);
                return {
                    x: v.x * factor * size + centerX,
                    y: v.y * factor * size + centerY
                };
            });
            
            // Pyramid faces
            const faces = [
                { points: [0, 1, 2], color: primaryColor }, // front
                { points: [0, 2, 3], color: secondaryColor }, // right
                { points: [0, 3, 4], color: primaryColor }, // back
                { points: [0, 4, 1], color: secondaryColor }, // left
                { points: [1, 2, 3, 4], color: primaryColor }  // base
            ];
            
            // Draw faces
            faces.forEach(face => {
                formCtx.beginPath();
                formCtx.moveTo(projected[face.points[0]].x, projected[face.points[0]].y);
                
                for (let i = 1; i < face.points.length; i++) {
                    formCtx.lineTo(projected[face.points[i]].x, projected[face.points[i]].y);
                }
                
                formCtx.closePath();
                formCtx.fillStyle = face.color;
                formCtx.fill();
                formCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                formCtx.stroke();
            });
            
        } else if (currentForm === 'cylinder') {
            // Draw cylinder
            const radius = size / 3;
            const height = size;
            const segments = 20;
            
            // Top circle
            formCtx.beginPath();
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const x = centerX + radius * Math.cos(theta);
                const y = centerY - height/2 + radius * Math.sin(theta);
                
                if (i === 0) {
                    formCtx.moveTo(x, y);
                } else {
                    formCtx.lineTo(x, y);
                }
            }
            formCtx.fillStyle = primaryColor;
            formCtx.fill();
            
            // Bottom circle
            formCtx.beginPath();
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const x = centerX + radius * Math.cos(theta);
                const y = centerY + height/2 + radius * Math.sin(theta);
                
                if (i === 0) {
                    formCtx.moveTo(x, y);
                } else {
                    formCtx.lineTo(x, y);
                }
            }
            formCtx.fillStyle = secondaryColor;
            formCtx.fill();
            
            // Side
            for (let i = 0; i < segments; i++) {
                const theta1 = (i / segments) * Math.PI * 2;
                const theta2 = ((i + 1) / segments) * Math.PI * 2;
                
                const x1 = centerX + radius * Math.cos(theta1);
                const y1 = centerY - height/2 + radius * Math.sin(theta1);
                
                const x2 = centerX + radius * Math.cos(theta2);
                const y2 = centerY - height/2 + radius * Math.sin(theta2);
                
                const x3 = centerX + radius * Math.cos(theta2);
                const y3 = centerY + height/2 + radius * Math.sin(theta2);
                
                const x4 = centerX + radius * Math.cos(theta1);
                const y4 = centerY + height/2 + radius * Math.sin(theta1);
                
                formCtx.beginPath();
                formCtx.moveTo(x1, y1);
                formCtx.lineTo(x2, y2);
                formCtx.lineTo(x3, y3);
                formCtx.lineTo(x4, y4);
                formCtx.closePath();
                
                // Simple shading based on angle
                const angle = theta1 + Math.PI/4;
                const intensity = 0.5 + 0.5 * Math.cos(angle);
                
                const color = hexToRgb(primaryColor);
                formCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity})`;
                formCtx.fill();
            }
        }
    }
    
    drawForm();
    
    // Texture Generator
    const texturePreview = document.querySelector('.texture-preview');
    const textureIntensity = document.getElementById('texture-intensity');
    let currentTexture = 'wood';
    
    document.querySelectorAll('.texture-options button').forEach(button => {
        button.addEventListener('click', function() {
            currentTexture = this.dataset.texture;
            updateTexture();
        });
    });
    
    textureIntensity.addEventListener('input', updateTexture);
    
    function updateTexture() {
        const intensity = textureIntensity.value;
        let textureStyle = '';
        
        switch(currentTexture) {
            case 'wood':
                textureStyle = `
                    background: 
                        linear-gradient(
                            90deg,
                            rgba(101, 67, 33, ${intensity/10}) 0%,
                            rgba(160, 116, 66, ${intensity/10}) 50%,
                            rgba(101, 67, 33, ${intensity/10}) 100%
                        ),
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0 50 Q25 30 50 50 T100 50" fill="none" stroke="black" stroke-width="1" opacity="0.2" /></svg>');
                    background-size: auto, 100px 100px;
                `;
                break;
                
            case 'metal':
                textureStyle = `
                    background: 
                        linear-gradient(
                            135deg,
                            rgba(192, 192, 192, ${intensity/10}) 0%,
                            rgba(224, 224, 224, ${intensity/10}) 50%,
                            rgba(192, 192, 192, ${intensity/10}) 100%
                        ),
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="10" height="10" fill="rgba(0,0,0,0.1)" /></svg>');
                    background-size: auto, 20px 20px;
                `;
                break;
                
            case 'fabric':
                textureStyle = `
                    background: 
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M0 0 L10 10 M10 0 L0 10" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" /></svg>'),
                        linear-gradient(
                            rgba(200, 150, 150, ${intensity/10}),
                            rgba(180, 130, 130, ${intensity/10})
                        );
                    background-size: 10px 10px, auto;
                `;
                break;
                
            case 'stone':
                textureStyle = `
                    background: 
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><path d="M10 10 Q15 5 20 10 T30 10 T40 10 T50 10 T40 20 T30 30 T20 40 T10 50 Z" fill="rgba(0,0,0,0.1)" /></svg>'),
                        linear-gradient(
                            rgba(150, 150, 150, ${intensity/10}),
                            rgba(120, 120, 120, ${intensity/10})
                        );
                    background-size: 50px 50px, auto;
                `;
                break;
                
            case 'paper':
                textureStyle = `
                    background: 
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><line x1="0" y1="0" x2="100" y2="100" stroke="rgba(0,0,0,0.05)" stroke-width="1" /><line x1="100" y1="0" x2="0" y2="100" stroke="rgba(0,0,0,0.05)" stroke-width="1" /></svg>'),
                        linear-gradient(
                            rgba(250, 250, 250, ${intensity/10}),
                            rgba(240, 240, 240, ${intensity/10})
                        );
                    background-size: 100px 100px, auto;
                `;
                break;
        }
        
        texturePreview.style.cssText = textureStyle;
    }
    
    updateTexture();
    
    // Space Composition
    const positiveSpace = document.getElementById('positive-space');
    const spaceMargins = document.getElementById('space-margins');
    const compositionPositive = document.querySelector('.composition-positive');
    
    positiveSpace.addEventListener('input', function() {
        const value = this.value;
        compositionPositive.style.width = `${value}%`;
        compositionPositive.style.height = `${value}%`;
        compositionPositive.style.left = `${(100 - value) / 2}%`;
        compositionPositive.style.top = `${(100 - value) / 2}%`;
    });
    
    spaceMargins.addEventListener('input', function() {
        const value = this.value;
        compositionPositive.style.margin = `${value}px`;
    });
    
    // Image Generator
    const imageCanvas = document.getElementById('image-canvas');
    const imageCtx = imageCanvas.getContext('2d');
    let currentImage = 'face';
    let currentStyle = 'line-art';
    
    document.querySelectorAll('.image-options button').forEach(button => {
        button.addEventListener('click', function() {
            currentImage = this.dataset.image;
            drawImage();
        });
    });
    
    document.getElementById('image-style').addEventListener('change', function() {
        currentStyle = this.value;
        drawImage();
    });
    
    function drawImage() {
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        
        if (currentImage === 'face') {
            if (currentStyle === 'line-art') {
                // Face outline
                imageCtx.beginPath();
                imageCtx.ellipse(150, 150, 100, 120, 0, 0, Math.PI * 2);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                // Eyes
                imageCtx.beginPath();
                imageCtx.ellipse(110, 120, 20, 15, 0, 0, Math.PI * 2);
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.ellipse(190, 120, 20, 15, 0, 0, Math.PI * 2);
                imageCtx.stroke();
                
                // Pupils
                imageCtx.beginPath();
                imageCtx.arc(110, 120, 8, 0, Math.PI * 2);
                imageCtx.fillStyle = primaryColor;
                imageCtx.fill();
                
                imageCtx.beginPath();
                imageCtx.arc(190, 120, 8, 0, Math.PI * 2);
                imageCtx.fill();
                
                // Nose
                imageCtx.beginPath();
                imageCtx.moveTo(150, 140);
                imageCtx.lineTo(140, 170);
                imageCtx.lineTo(160, 170);
                imageCtx.closePath();
                imageCtx.stroke();
                
                // Mouth
                imageCtx.beginPath();
                imageCtx.arc(150, 180, 40, 0.1 * Math.PI, 0.9 * Math.PI);
                imageCtx.stroke();
                
            } else if (currentStyle === 'geometric') {
                // Head
                imageCtx.beginPath();
                imageCtx.moveTo(150, 30);
                imageCtx.lineTo(230, 100);
                imageCtx.lineTo(230, 200);
                imageCtx.lineTo(150, 270);
                imageCtx.lineTo(70, 200);
                imageCtx.lineTo(70, 100);
                imageCtx.closePath();
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                // Eyes
                imageCtx.beginPath();
                imageCtx.rect(100, 100, 30, 30);
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.rect(170, 100, 30, 30);
                imageCtx.stroke();
                
                // Nose
                imageCtx.beginPath();
                imageCtx.moveTo(150, 140);
                imageCtx.lineTo(130, 170);
                imageCtx.lineTo(150, 170);
                imageCtx.closePath();
                imageCtx.stroke();
                
                // Mouth
                imageCtx.beginPath();
                imageCtx.rect(120, 200, 60, 10);
                imageCtx.stroke();
                
            } else if (currentStyle === 'organic') {
                // Face
                imageCtx.beginPath();
                imageCtx.ellipse(150, 150, 100, 120, 0, 0, Math.PI * 2);
                imageCtx.fillStyle = `${primaryColor}33`;
                imageCtx.fill();
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 2;
                imageCtx.stroke();
                
                // Eyes
                imageCtx.beginPath();
                imageCtx.ellipse(110, 120, 25, 20, 0, 0, Math.PI * 2);
                imageCtx.fillStyle = `${primaryColor}66`;
                imageCtx.fill();
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.ellipse(190, 120, 25, 20, 0, 0, Math.PI * 2);
                imageCtx.fill();
                imageCtx.stroke();
                
                // Pupils
                imageCtx.beginPath();
                imageCtx.arc(110, 120, 10, 0, Math.PI * 2);
                imageCtx.fillStyle = primaryColor;
                imageCtx.fill();
                
                imageCtx.beginPath();
                imageCtx.arc(190, 120, 10, 0, Math.PI * 2);
                imageCtx.fill();
                
                // Nose
                imageCtx.beginPath();
                imageCtx.ellipse(150, 160, 15, 10, 0, 0, Math.PI * 2);
                imageCtx.fillStyle = `${primaryColor}66`;
                imageCtx.fill();
                imageCtx.stroke();
                
                // Mouth
                imageCtx.beginPath();
                imageCtx.ellipse(150, 200, 40, 20, 0, 0, Math.PI);
                imageCtx.fillStyle = `${primaryColor}66`;
                imageCtx.fill();
                imageCtx.stroke();
                
            } else if (currentStyle === 'pixel') {
                // Head
                imageCtx.fillStyle = primaryColor;
                
                // Top of head
                for (let x = 100; x <= 200; x += 10) {
                    imageCtx.fillRect(x, 50, 10, 10);
                }
                
                // Sides of head
                for (let y = 60; y <= 240; y += 10) {
                    imageCtx.fillRect(100, y, 10, 10);
                    imageCtx.fillRect(200, y, 10, 10);
                }
                
                // Bottom of head
                for (let x = 100; x <= 200; x += 10) {
                    imageCtx.fillRect(x, 250, 10, 10);
                }
                
                // Eyes
                imageCtx.fillRect(120, 100, 20, 20);
                imageCtx.fillRect(160, 100, 20, 20);
                
                // Mouth
                for (let x = 130; x <= 170; x += 10) {
                    imageCtx.fillRect(x, 200, 10, 10);
                }
                
                // Nose
                imageCtx.fillRect(140, 150, 20, 10);
            }
            
        } else if (currentImage === 'landscape') {
            if (currentStyle === 'line-art') {
                // Sun
                imageCtx.beginPath();
                imageCtx.arc(250, 50, 30, 0, Math.PI * 2);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                // Sun rays
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    imageCtx.beginPath();
                    imageCtx.moveTo(250 + Math.cos(angle) * 30, 50 + Math.sin(angle) * 30);
                    imageCtx.lineTo(250 + Math.cos(angle) * 50, 50 + Math.sin(angle) * 50);
                    imageCtx.stroke();
                }
                
                // Mountains
                imageCtx.beginPath();
                imageCtx.moveTo(0, 300);
                imageCtx.lineTo(50, 150);
                imageCtx.lineTo(100, 250);
                imageCtx.lineTo(150, 100);
                imageCtx.lineTo(200, 200);
                imageCtx.lineTo(250, 50);
                imageCtx.lineTo(300, 300);
                imageCtx.stroke();
                
                // Ground
                imageCtx.beginPath();
                imageCtx.moveTo(0, 300);
                imageCtx.lineTo(300, 300);
                imageCtx.stroke();
                
            } else if (currentStyle === 'geometric') {
                // Sun
                imageCtx.beginPath();
                imageCtx.rect(220, 20, 60, 60);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                // Sun rays
                for (let i = 0; i < 4; i++) {
                    imageCtx.beginPath();
                    imageCtx.moveTo(250, 80);
                    imageCtx.lineTo(250 + Math.cos(i * Math.PI/2) * 40, 50 + Math.sin(i * Math.PI/2) * 40);
                    imageCtx.stroke();
                }
                
                // Mountains
                imageCtx.beginPath();
                imageCtx.moveTo(0, 300);
                imageCtx.lineTo(75, 150);
                imageCtx.lineTo(150, 300);
                imageCtx.lineTo(225, 100);
                imageCtx.lineTo(300, 300);
                imageCtx.stroke();
                
            } else if (currentStyle === 'organic') {
                // Sun
                imageCtx.beginPath();
                imageCtx.arc(250, 50, 30, 0, Math.PI * 2);
                imageCtx.fillStyle = `${primaryColor}33`;
                imageCtx.fill();
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 2;
                imageCtx.stroke();
                
                // Sun rays
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const length = 30 + Math.random() * 10;
                    imageCtx.beginPath();
                    imageCtx.moveTo(250 + Math.cos(angle) * 30, 50 + Math.sin(angle) * 30);
                    imageCtx.lineTo(250 + Math.cos(angle) * length, 50 + Math.sin(angle) * length);
                    imageCtx.stroke();
                }
                
                // Mountains
                imageCtx.beginPath();
                imageCtx.moveTo(0, 300);
                
                for (let x = 0; x <= 300; x += 10) {
                    const y = 150 + Math.sin(x / 50) * 100 - x / 6;
                    imageCtx.lineTo(x, y);
                }
                
                imageCtx.lineTo(300, 300);
                imageCtx.closePath();
                imageCtx.fillStyle = `${primaryColor}33`;
                imageCtx.fill();
                imageCtx.stroke();
                
            } else if (currentStyle === 'pixel') {
                // Sun
                imageCtx.fillStyle = primaryColor;
                for (let x = 220; x <= 280; x += 10) {
                    for (let y = 20; y <= 80; y += 10) {
                        if ((x === 220 || x === 280) && (y === 20 || y === 80)) continue;
                        imageCtx.fillRect(x, y, 10, 10);
                    }
                }
                
                // Mountains
                for (let x = 0; x <= 300; x += 10) {
                    const height = Math.max(0, 150 - Math.abs(x - 150) / 2);
                    for (let y = 300 - height; y <= 300; y += 10) {
                        imageCtx.fillRect(x, y, 10, 10);
                    }
                }
            }
            
        } else if (currentImage === 'object') {
            if (currentStyle === 'line-art') {
                // Cup
                imageCtx.beginPath();
                imageCtx.ellipse(150, 100, 50, 20, 0, 0, Math.PI * 2);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.moveTo(100, 100);
                imageCtx.lineTo(90, 200);
                imageCtx.lineTo(210, 200);
                imageCtx.lineTo(200, 100);
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.ellipse(150, 200, 60, 20, 0, 0, Math.PI);
                imageCtx.stroke();
                
                // Handle
                imageCtx.beginPath();
                imageCtx.ellipse(220, 150, 20, 30, Math.PI/2, 0, Math.PI * 2);
                imageCtx.stroke();
                
            } else if (currentStyle === 'geometric') {
                // Cup
                imageCtx.beginPath();
                imageCtx.rect(100, 80, 100, 120);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                // Top
                imageCtx.beginPath();
                imageCtx.moveTo(100, 80);
                imageCtx.lineTo(80, 80);
                imageCtx.lineTo(80, 100);
                imageCtx.lineTo(100, 100);
                imageCtx.stroke();
                
                // Bottom
                imageCtx.beginPath();
                imageCtx.moveTo(100, 200);
                imageCtx.lineTo(80, 200);
                imageCtx.lineTo(80, 220);
                imageCtx.lineTo(100, 220);
                imageCtx.stroke();
                
                // Handle
                imageCtx.beginPath();
                imageCtx.rect(200, 120, 30, 60);
                imageCtx.stroke();
                
            } else if (currentStyle === 'organic') {
                // Cup
                imageCtx.beginPath();
                imageCtx.ellipse(150, 100, 50, 20, 0, 0, Math.PI * 2);
                imageCtx.fillStyle = `${primaryColor}33`;
                imageCtx.fill();
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 2;
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.moveTo(100, 100);
                imageCtx.bezierCurveTo(90, 120, 90, 180, 100, 200);
                imageCtx.lineTo(200, 200);
                imageCtx.bezierCurveTo(210, 180, 210, 120, 200, 100);
                imageCtx.closePath();
                imageCtx.fill();
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.ellipse(150, 200, 60, 20, 0, 0, Math.PI);
                imageCtx.stroke();
                
                // Handle
                imageCtx.beginPath();
                imageCtx.ellipse(220, 150, 20, 30, Math.PI/2, 0, Math.PI * 2);
                imageCtx.fill();
                imageCtx.stroke();
                
            } else if (currentStyle === 'pixel') {
                // Cup
                imageCtx.fillStyle = primaryColor;
                
                // Top
                for (let x = 100; x <= 200; x += 10) {
                    imageCtx.fillRect(x, 100, 10, 10);
                }
                
                // Sides
                for (let y = 110; y <= 190; y += 10) {
                    imageCtx.fillRect(100, y, 10, 10);
                    imageCtx.fillRect(200, y, 10, 10);
                }
                
                // Bottom
                for (let x = 90; x <= 210; x += 10) {
                    imageCtx.fillRect(x, 200, 10, 10);
                }
                
                // Handle
                for (let y = 120; y <= 180; y += 10) {
                    imageCtx.fillRect(210, y, 10, 10);
                }
            }
            
        } else if (currentImage === 'abstract') {
            if (currentStyle === 'line-art') {
                // Abstract lines
                imageCtx.beginPath();
                imageCtx.moveTo(50, 50);
                imageCtx.bezierCurveTo(100, 200, 200, 100, 250, 250);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.arc(150, 150, 50, 0, Math.PI * 2);
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.moveTo(100, 250);
                imageCtx.lineTo(200, 50);
                imageCtx.stroke();
                
            } else if (currentStyle === 'geometric') {
                // Abstract shapes
                imageCtx.beginPath();
                imageCtx.rect(50, 50, 100, 100);
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 3;
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.moveTo(150, 50);
                imageCtx.lineTo(250, 150);
                imageCtx.lineTo(150, 250);
                imageCtx.lineTo(50, 150);
                imageCtx.closePath();
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.rect(200, 200, 50, 50);
                imageCtx.stroke();
                
            } else if (currentStyle === 'organic') {
                // Abstract blobs
                imageCtx.beginPath();
                imageCtx.ellipse(100, 100, 50, 30, Math.PI/4, 0, Math.PI * 2);
                imageCtx.fillStyle = `${primaryColor}33`;
                imageCtx.fill();
                imageCtx.strokeStyle = primaryColor;
                imageCtx.lineWidth = 2;
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.ellipse(200, 150, 60, 40, -Math.PI/4, 0, Math.PI * 2);
                imageCtx.fill();
                imageCtx.stroke();
                
                imageCtx.beginPath();
                imageCtx.ellipse(150, 200, 40, 60, Math.PI/2, 0, Math.PI * 2);
                imageCtx.fill();
                imageCtx.stroke();
                
            } else if (currentStyle === 'pixel') {
                // Abstract pixels
                imageCtx.fillStyle = primaryColor;
                
                for (let i = 0; i < 50; i++) {
                    const x = Math.random() * 300;
                    const y = Math.random() * 300;
                    const size = 5 + Math.random() * 15;
                    imageCtx.fillRect(x, y, size, size);
                }
            }
        }
    }
    
    drawImage();
    
    // Typography Tester
    const typeTest = document.getElementById('type-test');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const fontWeight = document.getElementById('font-weight');
    
    function updateTypography() {
        typeTest.style.fontFamily = fontFamily.value;
        typeTest.style.fontSize = `${fontSize.value}px`;
        typeTest.style.fontWeight = fontWeight.value;
    }
    
    fontFamily.addEventListener('change', updateTypography);
    fontSize.addEventListener('input', updateTypography);
    fontWeight.addEventListener('change', updateTypography);
    
    updateTypography();
    
    // Color Wheel
    const colorWheelCanvas = document.getElementById('color-wheel');
    const colorWheelCtx = colorWheelCanvas.getContext('2d');
    const selectedColor = document.querySelector('.selected-color');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const schemePreview = document.querySelectorAll('.scheme-preview .scheme-color');
    let currentHue = 0;
    let currentSaturation = 100;
    let currentLightness = 50;
    
    // Draw color wheel
    function drawColorWheel() {
        const radius = colorWheelCanvas.width / 2;
        const center = radius;
        
        for (let angle = 0; angle < 360; angle += 1) {
            const startAngle = (angle - 2) * Math.PI / 180;
            const endAngle = angle * Math.PI / 180;
            
            for (let r = 0; r < radius; r += 1) {
                const saturation = r / radius * 100;
                const hue = angle;
                const lightness = 50;
                
                colorWheelCtx.beginPath();
                colorWheelCtx.moveTo(center, center);
                colorWheelCtx.arc(center, center, r, startAngle, endAngle);
                colorWheelCtx.closePath();
                
                colorWheelCtx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                colorWheelCtx.fill();
            }
        }
        
        // Add lightness gradient in the center
        const gradient = colorWheelCtx.createRadialGradient(
            center, center, 0,
            center, center, radius
        );
        
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'transparent');
        
        colorWheelCtx.globalCompositeOperation = 'multiply';
        colorWheelCtx.fillStyle = gradient;
        colorWheelCtx.fillRect(0, 0, colorWheelCanvas.width, colorWheelCanvas.height);
        colorWheelCtx.globalCompositeOperation = 'source-over';
    }
    
    // Handle color selection
    colorWheelCanvas.addEventListener('click', function(e) {
        const rect = colorWheelCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const center = colorWheelCanvas.width / 2;
        
        // Calculate hue and saturation
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = center;
        
        if (distance > radius) return;
        
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        
        currentHue = Math.round(angle);
        currentSaturation = Math.round(distance / radius * 100);
        
        // Calculate lightness from pixel data
        const pixel = colorWheelCtx.getImageData(x, y, 1, 1).data;
        const r = pixel[0] / 255;
        const g = pixel[1] / 255;
        const b = pixel[2] / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        currentLightness = Math.round((max + min) / 2 * 100);
        
        updateColorSelection();
    });
    
    function updateColorSelection() {
        const color = hslToHex(currentHue, currentSaturation, currentLightness);
        const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
        
        selectedColor.style.backgroundColor = color;
        hexValue.textContent = color;
        rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.textContent = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
        
        // Update scheme preview if a scheme is selected
        const activeScheme = document.querySelector('.scheme-options button.active');
        if (activeScheme) {
            updateColorScheme(activeScheme.dataset.scheme);
        }
    }
    
    // Color Schemes
    document.querySelectorAll('.scheme-options button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.scheme-options button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            updateColorScheme(this.dataset.scheme);
        });
    });
    
    function updateColorScheme(scheme) {
        let colors = [];
        
        switch(scheme) {
            case 'monochromatic':
                colors = [
                    { h: currentHue, s: currentSaturation, l: Math.max(0, currentLightness - 20) },
                    { h: currentHue, s: currentSaturation, l: Math.max(0, currentLightness - 10) },
                    { h: currentHue, s: currentSaturation, l: currentLightness },
                    { h: currentHue, s: currentSaturation, l: Math.min(100, currentLightness + 10) },
                    { h: currentHue, s: currentSaturation, l: Math.min(100, currentLightness + 20) }
                ];
                break;
                
            case 'analogous':
                colors = [
                    { h: (currentHue - 30 + 360) % 360, s: currentSaturation, l: currentLightness },
                    { h: (currentHue - 15 + 360) % 360, s: currentSaturation, l: currentLightness },
                    { h: currentHue, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 15) % 360, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 30) % 360, s: currentSaturation, l: currentLightness }
                ];
                break;
                
            case 'complementary':
                colors = [
                    { h: currentHue, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 180) % 360, s: currentSaturation, l: currentLightness }
                ];
                break;
                
            case 'triadic':
                colors = [
                    { h: currentHue, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 120) % 360, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 240) % 360, s: currentSaturation, l: currentLightness }
                ];
                break;
                
            case 'tetradic':
                colors = [
                    { h: currentHue, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 90) % 360, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 180) % 360, s: currentSaturation, l: currentLightness },
                    { h: (currentHue + 270) % 360, s: currentSaturation, l: currentLightness }
                ];
                break;
        }
        
        // Apply colors to preview
        schemePreview.forEach((preview, i) => {
            if (i < colors.length) {
                const color = hslToHex(colors[i].h, colors[i].s, colors[i].l);
                preview.style.backgroundColor = color;
                preview.style.display = 'block';
            } else {
                preview.style.display = 'none';
            }
        });
    }
    
    // Contrast Checker
    const textColor = document.getElementById('text-color');
    const bgColor = document.getElementById('bg-color');
    const contrastRatio = document.getElementById('contrast-ratio');
    const contrastRating = document.querySelector('.contrast-rating');
    const textSample = document.querySelector('.text-sample');
    
    function updateContrast() {
        const textHex = textColor.value;
        const bgHex = bgColor.value;
        
        // Update sample
        textSample.style.color = textHex;
        textSample.style.backgroundColor = bgHex;
        
        // Calculate contrast ratio
        const textRgb = hexToRgb(textHex);
        const bgRgb = hexToRgb(bgHex);
        
        const textLuminance = calculateLuminance(textRgb.r, textRgb.g, textRgb.b);
        const bgLuminance = calculateLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        
        const lighter = Math.max(textLuminance, bgLuminance);
        const darker = Math.min(textLuminance, bgLuminance);
        const ratio = (lighter + 0.05) / (darker + 0.05);
        
        contrastRatio.textContent = ratio.toFixed(2) + ':1';
        
        // Determine rating
        if (ratio >= 7) {
            contrastRating.textContent = 'AAA';
            contrastRating.style.backgroundColor = '#06d6a0';
        } else if (ratio >= 4.5) {
            contrastRating.textContent = 'AA';
            contrastRating.style.backgroundColor = '#4a6fa5';
        } else if (ratio >= 3) {
            contrastRating.textContent = 'A';
            contrastRating.style.backgroundColor = '#ffd166';
            contrastRating.style.color = '#333';
        } else {
            contrastRating.textContent = 'Fail';
            contrastRating.style.backgroundColor = '#ff6b6b';
        }
    }
    
    textColor.addEventListener('input', updateContrast);
    bgColor.addEventListener('input', updateContrast);
    
    // Helper functions
    function hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
    }
    
    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    
    function hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    function hslToHex(h, s, l) {
        const rgb = hslToRgb(h, s, l);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    
    function calculateLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    
    // Initialize
    drawColorWheel();
    updateColorSelection();
    updateContrast();
    
    // Set initial active nav link
    document.querySelector('.nav-link').click();
});