// Rail Controls Module - Handles add/remove/reorder functionality
export class RailControls {
  constructor(app) {
    this.app = app;
    this.availableRails = {
      // UTILITY
      'continue_watching': 'Continue Watching',
      'recordings': 'Recordings', 
      'upcoming_games': 'Upcoming Games',
      'todays_games': "Today's Games",
      
      // LIVE
      'currently_live': 'Currently Live',
      'live_now': 'Live Now',
      'live_channels': 'Live Channels',
      
      // EDITORIAL
      'featured_picks': 'Featured Picks',
      'recommended': 'Recommended',
      'editorial_picks': 'Editorial Picks',
      'editorial_story': 'Editorial Story',
      
      // SHORT-FORM
      'gamestream': 'GameStream',
      'highlights': 'Highlights',
      'reels_grid': 'Reels Grid',
      
      // DISCOVERY
      'trending': 'Trending',
      'trending_near_you': 'Trending Near You',
      'new_and_noteworthy': 'New & Noteworthy',
      'expiring_soon': 'Expiring Soon',
      
      // CLUSTERS
      'collections_packs': 'Collections & Packs',
      'sponsored_shop': 'Sponsored Shop'
    };
  }

  init() {
    // Add controls to each rail
    const rails = this.app.container.querySelectorAll('.row');
    rails.forEach(rail => this.addControlsToRail(rail));
  }

  addControlsToRail(rail) {
    const controlsContainer = rail.querySelector('.rail-controls');
    if (!controlsContainer) return;

    const railId = rail.getAttribute('data-rail');
    const isAnchor = rail.getAttribute('data-anchor') === 'true';
    const config = this.app.config;

    // Clear existing controls
    controlsContainer.innerHTML = '';

    // Move Up button (if allowed and not first)
    if (config.allowReorder && !isAnchor && rail.previousElementSibling) {
      const moveUpBtn = document.createElement('button');
      moveUpBtn.className = 'rail-control-btn';
      moveUpBtn.innerHTML = '↑';
      moveUpBtn.title = 'Move Up';
      moveUpBtn.addEventListener('click', () => this.moveRail(rail, 'up'));
      controlsContainer.appendChild(moveUpBtn);
    }

    // Move Down button (if allowed and not last)
    if (config.allowReorder && !isAnchor && rail.nextElementSibling) {
      const moveDownBtn = document.createElement('button');
      moveDownBtn.className = 'rail-control-btn';
      moveDownBtn.innerHTML = '↓';
      moveDownBtn.title = 'Move Down';
      moveDownBtn.addEventListener('click', () => this.moveRail(rail, 'down'));
      controlsContainer.appendChild(moveDownBtn);
    }

    // Remove button (not for anchors)
    if (!isAnchor) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'rail-control-btn';
      removeBtn.innerHTML = '×';
      removeBtn.title = 'Remove Rail';
      removeBtn.addEventListener('click', () => this.removeRail(rail));
      controlsContainer.appendChild(removeBtn);
    }

    // Add Rail button (if allowed)
    if (config.allowAdd) {
      const addBtn = document.createElement('button');
      addBtn.className = 'rail-control-btn add-rail-btn';
      addBtn.innerHTML = '+ Add Rail';
      addBtn.title = 'Add New Rail';
      addBtn.addEventListener('click', () => this.showAddRailMenu(rail));
      controlsContainer.appendChild(addBtn);
    }
  }

  moveRail(rail, direction) {
    if (direction === 'up' && rail.previousElementSibling) {
      rail.parentNode.insertBefore(rail, rail.previousElementSibling);
    } else if (direction === 'down' && rail.nextElementSibling) {
      rail.parentNode.insertBefore(rail.nextElementSibling, rail);
    }

    // Refresh controls
    this.init();
  }

  removeRail(rail) {
    rail.style.transition = 'opacity 0.3s, height 0.3s';
    rail.style.opacity = '0';
    
    setTimeout(() => {
      rail.remove();
      // Refresh controls
      this.init();
    }, 300);
  }

  showAddRailMenu(afterRail) {
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'add-rail-menu';
    
    // Get existing rails to filter out
    const existingRails = Array.from(this.app.container.querySelectorAll('.row'))
      .map(r => r.getAttribute('data-rail'));

    // Build menu options
    const options = Object.entries(this.availableRails)
      .filter(([id, title]) => !existingRails.includes(id))
      .map(([id, title]) => `
        <div class="rail-option" data-rail-id="${id}">${title}</div>
      `).join('');

    menu.innerHTML = options || '<div class="rail-option disabled">No more rails available</div>';

    // Position menu
    const rect = afterRail.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left}px`;
    menu.style.zIndex = '1000';

    document.body.appendChild(menu);

    // Handle selection
    menu.addEventListener('click', (e) => {
      const option = e.target.closest('.rail-option');
      if (option && !option.classList.contains('disabled')) {
        const railId = option.getAttribute('data-rail-id');
        this.addRail(railId, afterRail);
        menu.remove();
      }
    });

    // Close menu on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 0);
  }

  addRail(railId, afterRail) {
    // Create rail definition
    const railDef = this.getRailDefinition(railId);
    
    // Get content for the rail
    const content = this.app.getContentForRail(railDef);
    
    if (content.length > 0) {
      // Create the rail
      this.app.createRail(railDef, content);
      
      // Move it after the specified rail
      const newRail = this.app.container.lastElementChild;
      afterRail.parentNode.insertBefore(newRail, afterRail.nextSibling);
      
      // Set up carousel behavior
      this.app.setupCarousel(newRail.querySelector('.carousel'));
      
      // Set up auto-advance
      const carousel = newRail.querySelector('.carousel');
      if (carousel) {
        new (await import('./rail-auto-advance.js')).RailAutoAdvance(carousel, this.app.config);
      }
      
      // Refresh controls
      this.init();
    }
  }

  getRailDefinition(railId) {
    // Default rail definitions
    const definitions = {
      'continue_watching': { type: 'utility', aspect: '16:9', size: 'small' },
      'recordings': { type: 'utility', aspect: '16:9', size: 'small' },
      'upcoming_games': { type: 'utility', aspect: '16:9', size: 'medium' },
      'todays_games': { type: 'utility', aspect: '16:9', size: 'medium' },
      'currently_live': { type: 'live', aspect: '16:9', size: 'large' },
      'live_now': { type: 'live', aspect: '16:9', size: 'large' },
      'live_channels': { type: 'live', aspect: '16:9', size: 'medium' },
      'featured_picks': { type: 'editorial', aspect: '16:9', size: 'medium' },
      'recommended': { type: 'editorial', aspect: '16:9', size: 'medium' },
      'editorial_picks': { type: 'editorial', aspect: '16:9', size: 'medium' },
      'editorial_story': { type: 'editorial', aspect: '16:9', size: 'medium' },
      'gamestream': { type: 'shortform', aspect: '2:3', size: 'medium' },
      'highlights': { type: 'shortform', aspect: '2:3', size: 'medium' },
      'reels_grid': { type: 'shortform', aspect: '2:3', size: 'medium' },
      'trending': { type: 'discovery', aspect: '16:9', size: 'medium' },
      'trending_near_you': { type: 'discovery', aspect: '16:9', size: 'medium' },
      'new_and_noteworthy': { type: 'discovery', aspect: '16:9', size: 'medium' },
      'expiring_soon': { type: 'discovery', aspect: '16:9', size: 'small' },
      'collections_packs': { type: 'cluster', aspect: '16:9', size: 'large' },
      'sponsored_shop': { type: 'editorial', aspect: '16:9', size: 'medium' }
    };

    return {
      id: railId,
      title: this.availableRails[railId],
      ...definitions[railId]
    };
  }
}
