export function render() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#DAF7A6'];
    return colors.map(color => `
      <div class="element-box" style="background:${color}; color:#000;">
        <p>${color}</p>
      </div>
    `).join('');
  }
  