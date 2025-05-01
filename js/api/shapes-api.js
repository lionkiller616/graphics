/**
 * Advanced Shapes API with UI/UX Focus
 * Features: Shape generation, morphing, path manipulation
 */
class ShapesAPI {
  constructor() {
    this.shapeTemplates = {
      circle: 'M50,0a50,50 0 1,1 0,100a50,50 0 1,1 0,-100z',
      square: 'M0,0h100v100h-100z',
      triangle: 'M50,0 L100,100 L0,100 Z',
      pentagon: 'M50,0 L100,38 L82,100 L18,100 L0,38 Z',
      hexagon: 'M50,0 L93,25 L93,75 L50,100 L7,75 L7,25 Z',
      star: 'M50,0 L61,35 L98,35 L68,57 L79,92 L50,72 L21,92 L32,57 L2,35 L39,35 Z',
      heart: 'M50,30 Q50,0 30,0 Q0,0 0,30 Q0,60 50,90 Q100,60 100,30 Q100,0 70,0 Q50,0 50,30 Z'
    };
  }

  /**
   * Generate SVG path for a shape
   */
  generateShape(type, options = {}) {
    const defaults = {
      size: 100,
      rounded: false,
      roundness: 10,
      rotation: 0,
      center: { x: 50, y: 50 }
    };
    
    const config = { ...defaults, ...options };
    let path = this.shapeTemplates[type] || this.shapeTemplates.circle;
    
    // Scale the shape
    if (config.size !== 100) {
      const scale = config.size / 100;
      path = path.replace(/([0-9.]+)(?=[, ]|$)/g, match => parseFloat(match) * scale);
    }
    
    // Apply rounding to corners
    if (config.rounded && type !== 'circle') {
      path = this.roundCorners(path, config.roundness);
    }
    
    // Apply rotation
    if (config.rotation !== 0) {
      path = this.rotatePath(path, config.rotation, config.center);
    }
    
    return path;
  }

  /**
   * Round corners of a path
   */
  roundCorners(path, radius) {
    const commands = this.parsePathCommands(path);
    const roundedCommands = [];
    
    for (let i = 0; i < commands.length; i++) {
      const current = commands[i];
      const next = commands[(i + 1) % commands.length];
      
      if (current.type === 'L' && next.type === 'L') {
        // Get the corner point
        const corner = { x: current.x, y: current.y };
        
        // Calculate vectors from corner to adjacent points
        const prevPoint = commands[(i - 1 + commands.length) % commands.length];
        const nextPoint = next;
        
        const v1 = {
          x: prevPoint.x - corner.x,
          y: prevPoint.y - corner.y
        };
        
        const v2 = {
          x: nextPoint.x - corner.x,
          y: nextPoint.y - corner.y
        };
        
        // Normalize vectors
        const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        const n1 = { x: v1.x / len1, y: v1.y / len1 };
        const n2 = { x: v2.x / len2, y: v2.y / len2 };
        
        // Calculate tangent points
        const t1 = {
          x: corner.x + n1.x * radius,
          y: corner.y + n1.y * radius
        };
        
        const t2 = {
          x: corner.x + n2.x * radius,
          y: corner.y + n2.y * radius
        };
        
        // Calculate control points for the arc
        const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x) * 180 / Math.PI;
        const largeArc = angle > 180 ? 1 : 0;
        
        // Add line to first tangent point
        roundedCommands.push({ type: 'L', x: t1.x, y: t1.y });
        
        // Add arc
        roundedCommands.push({ 
          type: 'A', 
          rx: radius, 
          ry: radius, 
          x: t2.x, 
          y: t2.y,
          largeArc: largeArc,
          sweep: 1,
          rotation: 0
        });
      } else {
        roundedCommands.push(current);
      }
    }
    
    return this.buildPath(roundedCommands);
  }

  /**
   * Rotate a path around a center point
   */
  rotatePath(path, angle, center = { x: 50, y: 50 }) {
    const commands = this.parsePathCommands(path);
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    const rotatedCommands = commands.map(cmd => {
      if ('x' in cmd && 'y' in cmd) {
        // Translate to origin
        const x = cmd.x - center.x;
        const y = cmd.y - center.y;
        
        // Rotate
        const rotatedX = x * cos - y * sin;
        const rotatedY = x * sin + y * cos;
        
        // Translate back
        return { 
          ...cmd, 
          x: rotatedX + center.x,
          y: rotatedY + center.y
        };
      }
      return cmd;
    });
    
    return this.buildPath(rotatedCommands);
  }

  /**
   * Parse SVG path into command objects
   */
  parsePathCommands(path) {
    const commands = [];
    const parts = path.split(/(?=[A-Za-z])/);
    
    for (const part of parts) {
      const type = part[0];
      const nums = part.slice(1).trim().split(/[ ,]+/).filter(x => x).map(Number);
      
      switch (type) {
        case 'M': // Move to
        case 'L': // Line to
          commands.push({ type, x: nums[0], y: nums[1] });
          break;
        case 'A': // Arc
          commands.push({
            type,
            rx: nums[0],
            ry: nums[1],
            rotation: nums[2],
            largeArc: nums[3],
            sweep: nums[4],
            x: nums[5],
            y: nums[6]
          });
          break;
        case 'Z': // Close path
          commands.push({ type });
          break;
        // Add more command types as needed
      }
    }
    
    return commands;
  }

  /**
   * Build SVG path from command objects
   */
  buildPath(commands) {
    return commands.map(cmd => {
      switch (cmd.type) {
        case 'M':
        case 'L':
          return `${cmd.type}${cmd.x},${cmd.y}`;
        case 'A':
          return `${cmd.type}${cmd.rx},${cmd.ry} ${cmd.rotation} ${cmd.largeArc} ${cmd.sweep} ${cmd.x},${cmd.y}`;
        case 'Z':
          return 'Z';
        default:
          return '';
      }
    }).join(' ');
  }

  /**
   * Morph between two shapes
   */
  morphShapes(path1, path2, steps = 10) {
    const commands1 = this.parsePathCommands(path1);
    const commands2 = this.parsePathCommands(path2);
    
    // For simplicity, assume both paths have same number and type of commands
    if (commands1.length !== commands2.length) {
      throw new Error('Paths must have same number of commands for morphing');
    }
    
    const intermediatePaths = [];
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const intermediateCommands = [];
      
      for (let j = 0; j < commands1.length; j++) {
        const cmd1 = commands1[j];
        const cmd2 = commands2[j];
        
        if (cmd1.type !== cmd2.type) {
          throw new Error('Command types must match for morphing');
        }
        
        const intermediateCmd = { type: cmd1.type };
        
        // Interpolate numeric properties
        for (const key in cmd1) {
          if (typeof cmd1[key] === 'number') {
            intermediateCmd[key] = cmd1[key] + (cmd2[key] - cmd1[key]) * ratio;
          }
        }
        
        intermediateCommands.push(intermediateCmd);
      }
      
      intermediatePaths.push(this.buildPath(intermediateCommands));
    }
    
    return intermediatePaths;
  }

  /**
   * Generate a star shape with customizable points
   */
  generateStar(points = 5, options = {}) {
    const defaults = {
      innerRadius: 40,
      outerRadius: 100,
      rotation: 0,
      center: { x: 50, y: 50 }
    };
    
    const config = { ...defaults, ...options };
    const angleStep = (Math.PI * 2) / points;
    let path = '';
    
    for (let i = 0; i <= points; i++) {
      const outerAngle = i * angleStep + config.rotation * Math.PI / 180;
      const innerAngle = outerAngle + angleStep / 2;
      
      const outerX = config.center.x + Math.cos(outerAngle) * config.outerRadius;
      const outerY = config.center.y + Math.sin(outerAngle) * config.outerRadius;
      
      const innerX = config.center.x + Math.cos(innerAngle) * config.innerRadius;
      const innerY = config.center.y + Math.sin(innerAngle) * config.innerRadius;
      
      if (i === 0) {
        path += `M${outerX},${outerY} `;
      } else {
        path += `L${innerX},${innerY} L${outerX},${outerY} `;
      }
    }
    
    path += 'Z';
    return path;
  }

  /**
   * Generate a polygon with customizable sides
   */
  generatePolygon(sides = 6, options = {}) {
    const defaults = {
      radius: 50,
      rotation: 0,
      center: { x: 50, y: 50 }
    };
    
    const config = { ...defaults, ...options };
    const angleStep = (Math.PI * 2) / sides;
    let path = '';
    
    for (let i = 0; i <= sides; i++) {
      const angle = i * angleStep + config.rotation * Math.PI / 180;
      const x = config.center.x + Math.cos(angle) * config.radius;
      const y = config.center.y + Math.sin(angle) * config.radius;
      
      if (i === 0) {
        path += `M${x},${y} `;
      } else {
        path += `L${x},${y} `;
      }
    }
    
    path += 'Z';
    return path;
  }

  /**
   * Generate a spiral shape
   */
  generateSpiral(options = {}) {
    const defaults = {
      turns: 3,
      innerRadius: 10,
      outerRadius: 50,
      center: { x: 50, y: 50 },
      segmentsPerTurn: 36
    };
    
    const config = { ...defaults, ...options };
    const totalSegments = config.turns * config.segmentsPerTurn;
    const radiusStep = (config.outerRadius - config.innerRadius) / totalSegments;
    const angleStep = (Math.PI * 2) / config.segmentsPerTurn;
    let path = '';
    
    for (let i = 0; i <= totalSegments; i++) {
      const angle = i * angleStep;
      const radius = config.innerRadius + i * radiusStep;
      const x = config.center.x + Math.cos(angle) * radius;
      const y = config.center.y + Math.sin(angle) * radius;
      
      if (i === 0) {
        path += `M${x},${y} `;
      } else {
        path += `L${x},${y} `;
      }
    }
    
    return path;
  }

  /**
   * Generate a wave shape
   */
  generateWave(options = {}) {
    const defaults = {
      width: 100,
      height: 50,
      amplitude: 20,
      wavelength: 40,
      phase: 0,
      segments: 36
    };
    
    const config = { ...defaults, ...options };
    const segmentWidth = config.width / config.segments;
    let path = `M0,${config.height / 2} `;
    
    for (let i = 0; i <= config.segments; i++) {
      const x = i * segmentWidth;
      const angle = (x / config.wavelength) * Math.PI * 2 + config.phase;
      const y = config.height / 2 + Math.sin(angle) * config.amplitude;
      path += `L${x},${y} `;
    }
    
    path += `L${config.width},${config.height} L0,${config.height} Z`;
    return path;
  }

  /**
   * Generate a rounded rectangle
   */
  generateRoundedRect(options = {}) {
    const defaults = {
      width: 100,
      height: 60,
      topLeft: 10,
      topRight: 10,
      bottomRight: 10,
      bottomLeft: 10,
      center: { x: 0, y: 0 }
    };
    
    const config = { ...defaults, ...options };
    const { width, height } = config;
    const cx = config.center.x;
    const cy = config.center.y;
    
    const path = `
      M${cx},${cy + config.topLeft}
      Q${cx},${cy} ${cx + config.topLeft},${cy}
      L${cx + width - config.topRight},${cy}
      Q${cx + width},${cy} ${cx + width},${cy + config.topRight}
      L${cx + width},${cy + height - config.bottomRight}
      Q${cx + width},${cy + height} ${cx + width - config.bottomRight},${cy + height}
      L${cx + config.bottomLeft},${cy + height}
      Q${cx},${cy + height} ${cx},${cy + height - config.bottomLeft}
      Z
    `.replace(/\s+/g, ' ').trim();
    
    return path;
  }

  /**
   * Generate a superellipse (squircle)
   */
  generateSuperellipse(options = {}) {
    const defaults = {
      width: 100,
      height: 100,
      power: 4, // Higher values make corners sharper
      segments: 24,
      center: { x: 50, y: 50 }
    };
    
    const config = { ...defaults, ...options };
    const halfWidth = config.width / 2;
    const halfHeight = config.height / 2;
    const angleStep = (Math.PI * 2) / config.segments;
    let path = '';
    
    for (let i = 0; i <= config.segments; i++) {
      const angle = i * angleStep;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Superellipse parametric equations
      const x = Math.pow(Math.abs(cos), 2 / config.power) * Math.sign(cos) * halfWidth + config.center.x;
      const y = Math.pow(Math.abs(sin), 2 / config.power) * Math.sign(sin) * halfHeight + config.center.y;
      
      if (i === 0) {
        path += `M${x},${y} `;
      } else {
        path += `L${x},${y} `;
      }
    }
    
    path += 'Z';
    return path;
  }

  /**
   * Generate a path for a speech bubble
   */
  generateSpeechBubble(options = {}) {
    const defaults = {
      width: 120,
      height: 80,
      borderRadius: 15,
      tailWidth: 20,
      tailHeight: 15,
      tailPosition: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
      tailOffset: 0
    };
    
    const config = { ...defaults, ...options };
    const { width, height, borderRadius, tailWidth, tailHeight, tailPosition } = config;
    
    // Calculate tail position
    let tailX, tailY, tailDirection;
    
    switch (tailPosition) {
      case 'top-left':
        tailX = borderRadius + tailWidth / 2 + config.tailOffset;
        tailY = 0;
        tailDirection = 'up';
        break;
      case 'top-right':
        tailX = width - borderRadius - tailWidth / 2 + config.tailOffset;
        tailY = 0;
        tailDirection = 'up';
        break;
      case 'bottom-left':
        tailX = borderRadius + tailWidth / 2 + config.tailOffset;
        tailY = height;
        tailDirection = 'down';
        break;
      case 'bottom-right':
      default:
        tailX = width - borderRadius - tailWidth / 2 + config.tailOffset;
        tailY = height;
        tailDirection = 'down';
    }
    
    // Build path
    let path = '';
    
    // Top-left corner
    path += `M${borderRadius},0 `;
    path += `Q0,0 0,${borderRadius} `;
    
    // Left side
    path += `L0,${height - borderRadius} `;
    
    // Bottom-left corner
    path += `Q0,${height} ${borderRadius},${height} `;
    
    // Add tail if on bottom-left
    if (tailPosition === 'bottom-left') {
      path += `L${tailX - tailWidth / 2},${height} `;
      path += `L${tailX},${height + tailHeight} `;
      path += `L${tailX + tailWidth / 2},${height} `;
    }
    
    // Bottom side
    path += `L${width - borderRadius},${height} `;
    
    // Bottom-right corner
    path += `Q${width},${height} ${width},${height - borderRadius} `;
    
    // Add tail if on bottom-right
    if (tailPosition === 'bottom-right') {
      path += `L${width},${tailY - borderRadius} `;
      path += `L${width + tailWidth / 2},${tailY} `;
      path += `L${width},${tailY + tailHeight} `;
      path += `L${width - tailWidth / 2},${tailY} `;
      path += `L${width},${tailY - borderRadius} `;
    }
    
    // Right side
    path += `L${width},${borderRadius} `;
    
    // Top-right corner
    path += `Q${width},0 ${width - borderRadius},0 `;
    
    // Add tail if on top-right
    if (tailPosition === 'top-right') {
      path += `L${tailX + tailWidth / 2},0 `;
      path += `L${tailX},${-tailHeight} `;
      path += `L${tailX - tailWidth / 2},0 `;
    }
    
    // Top side
    path += `L${borderRadius},0 `;
    
    // Add tail if on top-left
    if (tailPosition === 'top-left') {
      path += `L${borderRadius},0 `;
    }
    
    path += 'Z';
    return path;
  }

  /**
   * Calculate the bounding box of a path
   */
  getPathBoundingBox(path) {
    const commands = this.parsePathCommands(path);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    for (const cmd of commands) {
      if ('x' in cmd && 'y' in cmd) {
        minX = Math.min(minX, cmd.x);
        minY = Math.min(minY, cmd.y);
        maxX = Math.max(maxX, cmd.x);
        maxY = Math.max(maxY, cmd.y);
      }
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Center a path within a given viewBox
   */
  centerPath(path, viewBox = { width: 100, height: 100 }) {
    const bbox = this.getPathBoundingBox(path);
    const offsetX = (viewBox.width - bbox.width) / 2 - bbox.x;
    const offsetY = (viewBox.height - bbox.height) / 2 - bbox.y;
    
    const commands = this.parsePathCommands(path);
    const centeredCommands = commands.map(cmd => {
      if ('x' in cmd && 'y' in cmd) {
        return { ...cmd, x: cmd.x + offsetX, y: cmd.y + offsetY };
      }
      return cmd;
    });
    
    return this.buildPath(centeredCommands);
  }
}

// Export as singleton
export const shapesAPI = new ShapesAPI();