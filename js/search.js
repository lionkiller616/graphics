/**
 * Advanced Search System with UI/UX Focus
 * Features: Instant results, fuzzy search, keyboard navigation
 */
class Search {
    constructor() {
      this.searchIndex = [];
      this.searchResults = [];
      this.selectedIndex = -1;
      this.init();
    }
  
    /**
     * Initialize search system
     */
    init() {
      // Create search container if it doesn't exist
      if (!document.getElementById('search-container')) {
        this.createSearchContainer();
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Build search index
      this.buildSearchIndex();
    }
  
    /**
     * Create search container
     */
    createSearchContainer() {
      const container = document.createElement('div');
      container.id = 'search-container';
      container.className = 'search-container';
      container.innerHTML = `
        <div class="search-box">
          <input type="text" id="search-input" placeholder="Search..." autocomplete="off">
          <button id="search-close" aria-label="Close search">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="search-results" id="search-results"></div>
      `;
      
      // Add to DOM (you might want to customize this)
      document.body.insertBefore(container, document.body.firstChild);
    }
  
    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Search input
      const searchInput = document.getElementById('search-input');
      
      searchInput.addEventListener('input', (e) => {
        this.handleSearchInput(e.target.value);
      });
      
      searchInput.addEventListener('keydown', (e) => {
        this.handleKeyDown(e);
      });
      
      searchInput.addEventListener('focus', () => {
        this.openSearch();
      });
      
      // Search close button
      document.getElementById('search-close').addEventListener('click', () => {
        this.closeSearch();
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-container')) {
          this.closeSearch();
        }
      });
      
      // Global shortcut to open search (Ctrl+K or Cmd+K)
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.openSearch();
        }
      });
    }
  
    /**
     * Build search index from page content
     */
    buildSearchIndex() {
      // Index headings
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        this.searchIndex.push({
          title: heading.textContent,
          url: `${window.location.pathname}#${heading.id}`,
          element: heading,
          type: 'heading'
        });
      });
      
      // Index articles
      document.querySelectorAll('article, section').forEach(section => {
        const title = section.querySelector('h1, h2, h3')?.textContent || 'Untitled Section';
        this.searchIndex.push({
          title,
          url: `${window.location.pathname}#${section.id}`,
          element: section,
          type: 'section'
        });
      });
      
      // Index links
      document.querySelectorAll('a[href]').forEach(link => {
        if (link.href.startsWith(window.location.origin)) {
          this.searchIndex.push({
            title: link.textContent,
            url: link.href.replace(window.location.origin, ''),
            element: link,
            type: 'link'
          });
        }
      });
    }
  
    /**
     * Handle search input
     */
    handleSearchInput(query) {
      if (query.length < 2) {
        this.clearResults();
        return;
      }
      
      // Perform search
      this.searchResults = this.searchQuery(query);
      
      // Display results
      this.displayResults();
    }
  
    /**
     * Search query against index
     */
    searchQuery(query) {
      const results = [];
      const queryLower = query.toLowerCase();
      
      // Simple fuzzy search
      this.searchIndex.forEach(item => {
        const titleLower = item.title.toLowerCase();
        
        // Check for matches
        if (titleLower.includes(queryLower)) {
          // Calculate score (simple for now)
          const score = titleLower.indexOf(queryLower);
          results.push({ ...item, score });
        }
      });
      
      // Sort by score
      results.sort((a, b) => a.score - b.score);
      
      return results;
    }
  
    /**
     * Display search results
     */
    displayResults() {
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = '';
      
      if (this.searchResults.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        return;
      }
      
      // Create result items
      this.searchResults.forEach((result, index) => {
        const resultItem = document.createElement('a');
        resultItem.className = 'search-result';
        resultItem.href = result.url;
        resultItem.innerHTML = `
          <div class="search-result-title">${this.highlightMatches(result.title)}</div>
          <div class="search-result-type">${result.type}</div>
        `;
        
        // Add click handler
        resultItem.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateToResult(result);
        });
        
        resultsContainer.appendChild(resultItem);
      });
      
      // Reset selection
      this.selectedIndex = -1;
    }
  
    /**
     * Highlight matching text in results
     */
    highlightMatches(text) {
      const query = document.getElementById('search-input').value.toLowerCase();
      if (!query) return text;
      
      const lowerText = text.toLowerCase();
      const index = lowerText.indexOf(query);
      
      if (index === -1) return text;
      
      const before = text.substring(0, index);
      const match = text.substring(index, index + query.length);
      const after = text.substring(index + query.length);
      
      return `${before}<span class="search-highlight">${match}</span>${after}`;
    }
  
    /**
     * Handle keyboard navigation
     */
    handleKeyDown(e) {
      const results = document.querySelectorAll('.search-result');
      if (results.length === 0) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.selectNextResult(results);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.selectPreviousResult(results);
          break;
        case 'Enter':
          if (this.selectedIndex >= 0) {
            e.preventDefault();
            this.navigateToResult(this.searchResults[this.selectedIndex]);
          }
          break;
        case 'Escape':
          this.closeSearch();
          break;
      }
    }
  
    /**
     * Select next result
     */
    selectNextResult(results) {
      if (this.selectedIndex < results.length - 1) {
        this.selectedIndex++;
        this.updateSelectedResult(results);
      }
    }
  
    /**
     * Select previous result
     */
    selectPreviousResult(results) {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
        this.updateSelectedResult(results);
      }
    }
  
    /**
     * Update selected result styling
     */
    updateSelectedResult(results) {
      results.forEach((result, index) => {
        result.classList.toggle('selected', index === this.selectedIndex);
        
        if (index === this.selectedIndex) {
          result.scrollIntoView({ block: 'nearest' });
        }
      });
    }
  
    /**
     * Navigate to search result
     */
    navigateToResult(result) {
      // Close search
      this.closeSearch();
      
      // Navigate to result
      if (result.url.startsWith('#')) {
        // Scroll to element on current page
        const target = document.querySelector(result.url);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
          });
          
          // Highlight element briefly
          target.classList.add('search-target-highlight');
          setTimeout(() => {
            target.classList.remove('search-target-highlight');
          }, 2000);
        }
      } else {
        // Navigate to new page
        window.location.href = result.url;
      }
    }
  
    /**
     * Open search overlay
     */
    openSearch() {
      const container = document.getElementById('search-container');
      container.classList.add('open');
      
      // Focus input
      const input = document.getElementById('search-input');
      input.focus();
      
      // Dispatch event
      document.dispatchEvent(new CustomEvent('search:open'));
    }
  
    /**
     * Close search overlay
     */
    closeSearch() {
      const container = document.getElementById('search-container');
      container.classList.remove('open');
      
      // Clear input and results
      document.getElementById('search-input').value = '';
      this.clearResults();
    }
  
    /**
     * Clear search results
     */
    clearResults() {
      document.getElementById('search-results').innerHTML = '';
      this.searchResults = [];
      this.selectedIndex = -1;
    }
  
    /**
     * Add item to search index
     */
    addToIndex(item) {
      this.searchIndex.push(item);
    }
  
    /**
     * Remove item from search index
     */
    removeFromIndex(item) {
      this.searchIndex = this.searchIndex.filter(i => i !== item);
    }
  
    /**
     * Rebuild search index
     */
    rebuildIndex() {
      this.searchIndex = [];
      this.buildSearchIndex();
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const search = new Search();
    
    // Make available globally
    window.search = search;
  });
  
  // Export for module usage
  export const search = new Search();