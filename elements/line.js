export function render() {
    return `
      <div class="element-box">
        <svg width="100%" height="50">
          <line x1="0" y1="25" x2="100%" y2="25" stroke="black" stroke-width="2" />
        </svg>
        <p>Straight Line</p>
      </div>
      <div class="element-box">
        <svg width="100%" height="50">
          <line x1="0" y1="45" x2="100" y2="5" stroke="red" stroke-width="2" stroke-dasharray="5,5" />
        </svg>
        <p>Dashed Line</p>
      </div>
    `;
  }
  