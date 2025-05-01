function loadSection(section) {
    import(`./${section}.js`).then(module => {
      document.getElementById('content').innerHTML = module.render();
    }).catch(err => {
      console.error(`Error loading ${section}:`, err);
    });
  }
  