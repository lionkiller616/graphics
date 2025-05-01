/**
 * Advanced TreeView Component with UI/UX Focus
 * Features: Expand/collapse, drag and drop, keyboard navigation
 */
class TreeView {
    constructor() {
      this.treeItems = [];
      this.draggedItem = null;
      this.init();
    }
  
    /**
     * Initialize tree view
     */
    init() {
      // Find all tree views in the document
      this.trees = document.querySelectorAll('[data-treeview]');
      if (this.trees.length === 0) return;
      
      // Initialize each tree
      this.trees.forEach(tree => {
        this.initTree(tree);
      });
    }
  
    /**
     * Initialize a single tree
     */
    initTree(tree) {
      // Set ARIA attributes
      tree.setAttribute('role', 'tree');
      
      // Find all tree items
      const items = tree.querySelectorAll('[data-treeitem]');
      this.treeItems = [...items];
      
      // Initialize each item
      items.forEach(item => {
        this.initTreeItem(item);
      });
      
      // Set up keyboard navigation for the tree
      tree.addEventListener('keydown', e => this.handleTreeKeyDown(e));
      
      // Set up drag and drop
      if (tree.dataset.treeviewDraggable === 'true') {
        this.initDragAndDrop(tree);
      }
    }
  
    /**
     * Initialize a tree item
     */
    initTreeItem(item) {
      // Set ARIA attributes
      item.setAttribute('role', 'treeitem');
      
      // Check if item has children
      const group = item.querySelector('[role="group"]');
      if (group) {
        // It's a parent item
        item.setAttribute('aria-expanded', 'false');
        item.classList.add('has-children');
        
        // Add toggle button
        const toggle = document.createElement('button');
        toggle.className = 'tree-toggle';
        toggle.setAttribute('aria-label', 'Toggle');
        toggle.innerHTML = '+';
        item.insertBefore(toggle, item.firstChild);
        
        // Set up click handler for toggle
        toggle.addEventListener('click', e => {
          e.stopPropagation();
          this.toggleItem(item);
        });
      }
      
      // Set up click handler for selection
      item.addEventListener('click', e => {
        if (!e.target.classList.contains('tree-toggle')) {
          this.selectItem(item);
        }
      });
    }
  
    /**
     * Toggle item expansion
     */
    toggleItem(item) {
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      
      // Update toggle icon
      const toggle = item.querySelector('.tree-toggle');
      if (toggle) {
        toggle.innerHTML = isExpanded ? '+' : '-';
      }
      
      // Dispatch event
      item.dispatchEvent(new CustomEvent('treeitem:toggle', {
        detail: { expanded: !isExpanded }
      }));
    }
  
    /**
     * Select an item
     */
    selectItem(item) {
      // Deselect all items
      this.treeItems.forEach(i => {
        i.classList.remove('selected');
        i.setAttribute('aria-selected', 'false');
      });
      
      // Select clicked item
      item.classList.add('selected');
      item.setAttribute('aria-selected', 'true');
      
      // Focus the item
      item.focus();
      
      // Dispatch event
      item.dispatchEvent(new CustomEvent('treeitem:select', {
        detail: { item }
      }));
    }
  
    /**
     * Handle keyboard navigation
     */
    handleTreeKeyDown(e) {
      const tree = e.currentTarget;
      const currentItem = document.activeElement.closest('[role="treeitem"]');
      
      if (!currentItem) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this.focusPreviousItem(currentItem);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.focusNextItem(currentItem);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentItem.getAttribute('aria-expanded') === 'true') {
            this.toggleItem(currentItem);
          } else {
            const parentGroup = currentItem.closest('[role="group"]');
            if (parentGroup) {
              const parentItem = parentGroup.closest('[role="treeitem"]');
              if (parentItem) {
                this.selectItem(parentItem);
              }
            }
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentItem.classList.contains('has-children')) {
            if (currentItem.getAttribute('aria-expanded') === 'false') {
              this.toggleItem(currentItem);
            } else {
              // Move to first child
              const firstChild = currentItem.querySelector('[role="treeitem"]:first-child');
              if (firstChild) {
                this.selectItem(firstChild);
              }
            }
          }
          break;
        case 'Home':
          e.preventDefault();
          const firstItem = tree.querySelector('[role="treeitem"]:first-child');
          if (firstItem) {
            this.selectItem(firstItem);
          }
          break;
        case 'End':
          e.preventDefault();
          const lastItem = this.getLastVisibleItem(tree);
          if (lastItem) {
            this.selectItem(lastItem);
          }
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          this.selectItem(currentItem);
          if (currentItem.classList.contains('has-children')) {
            this.toggleItem(currentItem);
          }
          break;
      }
    }
  
    /**
     * Get the last visible item in the tree
     */
    getLastVisibleItem(tree) {
      const items = Array.from(tree.querySelectorAll('[role="treeitem"]'));
      let lastItem = items[items.length - 1];
      
      while (lastItem && lastItem.getAttribute('aria-expanded') === 'true') {
        const children = lastItem.querySelectorAll('[role="treeitem"]');
        if (children.length > 0) {
          lastItem = children[children.length - 1];
        } else {
          break;
        }
      }
      
      return lastItem;
    }
  
    /**
     * Focus the previous item
     */
    focusPreviousItem(currentItem) {
      const allItems = this.getFlatItemList(currentItem.closest('[role="tree"]'));
      const currentIndex = allItems.indexOf(currentItem);
      
      if (currentIndex > 0) {
        this.selectItem(allItems[currentIndex - 1]);
      }
    }
  
    /**
     * Focus the next item
     */
    focusNextItem(currentItem) {
      const allItems = this.getFlatItemList(currentItem.closest('[role="tree"]'));
      const currentIndex = allItems.indexOf(currentItem);
      
      if (currentIndex < allItems.length - 1) {
        this.selectItem(allItems[currentIndex + 1]);
      }
    }
  
    /**
     * Get a flat list of all visible items
     */
    getFlatItemList(tree) {
      const items = [];
      
      function traverse(node) {
        if (node.getAttribute('role') === 'treeitem') {
          items.push(node);
          
          if (node.getAttribute('aria-expanded') === 'true') {
            const group = node.querySelector('[role="group"]');
            if (group) {
              const children = group.querySelectorAll('[role="treeitem"]');
              children.forEach(child => traverse(child));
            }
          }
        } else {
          const children = node.querySelectorAll('[role="treeitem"]');
          children.forEach(child => traverse(child));
        }
      }
      
      traverse(tree);
      return items;
    }
  
    /**
     * Initialize drag and drop
     */
    initDragAndDrop(tree) {
      // Set up draggable items
      const items = tree.querySelectorAll('[role="treeitem"]');
      items.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', e => {
          this.draggedItem = item;
          e.dataTransfer.setData('text/plain', item.id);
          item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          this.draggedItem = null;
        });
      });
      
      // Set up drop zones
      const groups = tree.querySelectorAll('[role="group"]');
      groups.forEach(group => {
        group.addEventListener('dragover', e => {
          e.preventDefault();
          group.classList.add('drop-target');
        });
        
        group.addEventListener('dragleave', () => {
          group.classList.remove('drop-target');
        });
        
        group.addEventListener('drop', e => {
          e.preventDefault();
          group.classList.remove('drop-target');
          
          if (this.draggedItem && !group.contains(this.draggedItem)) {
            // Move item to new location
            const parentItem = group.closest('[role="treeitem"]');
            
            // Check if we're allowed to drop here
            if (this.canDrop(this.draggedItem, parentItem)) {
              group.appendChild(this.draggedItem);
              
              // Ensure parent is expanded
              if (parentItem) {
                parentItem.setAttribute('aria-expanded', 'true');
                parentItem.querySelector('.tree-toggle').innerHTML = '-';
              }
              
              // Dispatch event
              tree.dispatchEvent(new CustomEvent('treeview:change', {
                detail: { 
                  movedItem: this.draggedItem,
                  newParent: parentItem 
                }
              }));
            }
          }
        });
      });
    }
  
    /**
     * Check if an item can be dropped in a new location
     */
    canDrop(item, newParent) {
      // Basic check to prevent dropping into itself or its children
      if (newParent && (item === newParent || item.contains(newParent))) {
        return false;
      }
      
      // Add additional business logic here if needed
      return true;
    }
  
    /**
     * Expand all items
     */
    expandAll(tree) {
      const items = tree.querySelectorAll('[role="treeitem"].has-children');
      items.forEach(item => {
        item.setAttribute('aria-expanded', 'true');
        item.querySelector('.tree-toggle').innerHTML = '-';
      });
    }
  
    /**
     * Collapse all items
     */
    collapseAll(tree) {
      const items = tree.querySelectorAll('[role="treeitem"].has-children');
      items.forEach(item => {
        item.setAttribute('aria-expanded', 'false');
        item.querySelector('.tree-toggle').innerHTML = '+';
      });
    }
  
    /**
     * Add a new item to the tree
     */
    addItem(tree, parentItem, itemData) {
      const item = document.createElement('li');
      item.setAttribute('role', 'treeitem');
      item.setAttribute('data-treeitem', '');
      item.textContent = itemData.label;
      
      if (itemData.children && itemData.children.length > 0) {
        item.classList.add('has-children');
        item.setAttribute('aria-expanded', 'false');
        
        const toggle = document.createElement('button');
        toggle.className = 'tree-toggle';
        toggle.setAttribute('aria-label', 'Toggle');
        toggle.innerHTML = '+';
        item.insertBefore(toggle, item.firstChild);
        
        const group = document.createElement('ul');
        group.setAttribute('role', 'group');
        
        itemData.children.forEach(childData => {
          this.addItem(tree, group, childData);
        });
        
        item.appendChild(group);
      }
      
      const parentGroup = parentItem 
        ? parentItem.querySelector('[role="group"]') || this.createGroup(parentItem)
        : tree;
      
      parentGroup.appendChild(item);
      this.initTreeItem(item);
      
      // Expand parent if it was collapsed
      if (parentItem && parentItem.getAttribute('aria-expanded') === 'false') {
        this.toggleItem(parentItem);
      }
      
      return item;
    }
  
    /**
     * Create a group for parent items
     */
    createGroup(parentItem) {
      const group = document.createElement('ul');
      group.setAttribute('role', 'group');
      parentItem.appendChild(group);
      
      // Add toggle button if it doesn't exist
      if (!parentItem.querySelector('.tree-toggle')) {
        parentItem.classList.add('has-children');
        parentItem.setAttribute('aria-expanded', 'false');
        
        const toggle = document.createElement('button');
        toggle.className = 'tree-toggle';
        toggle.setAttribute('aria-label', 'Toggle');
        toggle.innerHTML = '+';
        parentItem.insertBefore(toggle, parentItem.firstChild);
      }
      
      return group;
    }
  
    /**
     * Remove an item from the tree
     */
    removeItem(item) {
      const parentGroup = item.parentNode;
      item.remove();
      
      // If parent group is now empty, remove toggle button
      if (parentGroup.getAttribute('role') === 'group' && parentGroup.children.length === 0) {
        const parentItem = parentGroup.closest('[role="treeitem"]');
        if (parentItem) {
          const toggle = parentItem.querySelector('.tree-toggle');
          if (toggle) {
            toggle.remove();
            parentItem.classList.remove('has-children');
            parentItem.removeAttribute('aria-expanded');
          }
        }
      }
    }
  
    /**
     * Get the current tree structure as JSON
     */
    getTreeData(tree) {
      const rootItems = tree.querySelectorAll('[role="treeitem"]');
      const data = [];
      
      rootItems.forEach(item => {
        data.push(this.getItemData(item));
      });
      
      return data;
    }
  
    /**
     * Get data for a single item
     */
    getItemData(item) {
      const data = {
        label: item.textContent.trim(),
        id: item.id || null
      };
      
      const group = item.querySelector('[role="group"]');
      if (group) {
        data.children = [];
        const children = group.querySelectorAll('[role="treeitem"]');
        children.forEach(child => {
          data.children.push(this.getItemData(child));
        });
      }
      
      return data;
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const treeView = new TreeView();
    
    // Make available globally
    window.treeView = treeView;
  });
  
  // Export for module usage
  export const treeView = new TreeView();