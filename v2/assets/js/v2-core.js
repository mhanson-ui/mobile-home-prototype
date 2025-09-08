// V2 Core Module - Enhanced functionality for V2 prototypes

// V2 Configuration
export const V2Config = {
  thumbnailBase: '/v2/public/thumbs/',
  autoAdvanceDelay: 5000, // 5 seconds of inactivity
  autoAdvanceInterval: 3000, // 3 seconds between advances
  
  // Approach-specific settings
  approaches: {
    'intent': {
      allowReorder: true,
      allowAdd: true,
      railOrder: ['utility', 'live', 'editorial', 'shortform']
    },
    'mixed': {
      allowReorder: true,
      allowAdd: true,
      useAspectRatioDifferentiation: true
    },
    'contextual': {
      allowReorder: false, // Time-based ordering
      allowAdd: true,
      contexts: ['morning', 'evening', 'nextday']
    },
    'anchor': {
      allowReorder: true, // But anchors are immovable
      allowAdd: true,
      anchors: ['continue_watching', 'live_now', 'gamestream']
    }
  }
};

// Main V2 Application
export class V2App {
  constructor(approach, container) {
    this.approach = approach;
    this.container = container;
    this.config = V2Config.approaches[approach];
    this.contentDb = new ContentDatabase();
    this.genreFilter = new GenreFilter(this);
    this.railControls = new RailControls(this);
    this.activeGenre = 'all';
    this.rails = [];
  }

  async init() {
    // Load content database
    await this.contentDb.load();
    
    // Initialize components
    this.genreFilter.init();
    
    // Load initial rails based on approach
    this.loadRails();
    
    // Set up auto-advance for all rails
    this.setupAutoAdvance();
    
    // Initialize rail controls
    this.railControls.init();
  }

  loadRails() {
    // Clear existing rails
    this.container.innerHTML = '';
    
    // Load rails based on approach
    switch(this.approach) {
      case 'intent':
        this.loadIntentBasedRails();
        break;
      case 'mixed':
        this.loadMixedAspectRails();
        break;
      case 'contextual':
        this.loadContextualRails();
        break;
      case 'anchor':
        this.loadAnchorRotationalRails();
        break;
    }
  }

  loadIntentBasedRails() {
    // Fixed order: Utility → Live → Editorial → Short-form
    const railDefinitions = [
      // UTILITY
      { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'small' },
      { id: 'recordings', title: 'Recordings', type: 'utility', aspect: '16:9', size: 'small' },
      { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'medium' },
      // LIVE
      { id: 'currently_live', title: 'Currently Live', type: 'live', aspect: '16:9', size: 'large' },
      { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '16:9', size: 'medium' },
      // EDITORIAL
      { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
      { id: 'recommended', title: 'Recommended', type: 'editorial', aspect: '16:9', size: 'medium' },
      // SHORT-FORM
      { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' }
    ];

    railDefinitions.forEach(def => {
      const content = this.getContentForRail(def);
      if (content.length > 0) {
        this.createRail(def, content);
      }
    });
  }

  loadMixedAspectRails() {
    // Mixed order, differentiated by aspect ratio
    const railDefinitions = [
      { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'small' },
      { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
      { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' },
      { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '16:9', size: 'medium' },
      { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'small' }
    ];

    railDefinitions.forEach(def => {
      const content = this.getContentForRail(def);
      if (content.length > 0) {
        this.createRail(def, content);
      }
    });
  }

  loadContextualRails() {
    const context = this.getCurrentContext();
    let railDefinitions = [];

    switch(context) {
      case 'morning':
        railDefinitions = [
          { id: 'todays_games', title: "Today's Games", type: 'utility', aspect: '16:9', size: 'medium' },
          { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'small' },
          { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
          { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' }
        ];
        break;
      case 'evening':
        railDefinitions = [
          { id: 'currently_live', title: 'Currently Live', type: 'live', aspect: '16:9', size: 'large' },
          { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '16:9', size: 'medium' },
          { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'medium' },
          { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' },
          { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' }
        ];
        break;
      case 'nextday':
        railDefinitions = [
          { id: 'highlights', title: "Tonight's Highlights", type: 'shortform', aspect: '2:3', size: 'medium' },
          { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'small' },
          { id: 'editorial_picks', title: 'Editorial Picks', type: 'editorial', aspect: '16:9', size: 'medium' }
        ];
        break;
    }

    railDefinitions.forEach(def => {
      const content = this.getContentForRail(def);
      if (content.length > 0) {
        this.createRail(def, content);
      }
    });
  }

  loadAnchorRotationalRails() {
    // Fixed anchors
    const anchors = [
      { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'small', isAnchor: true },
      { id: 'currently_live', title: 'Currently Live', type: 'live', aspect: '16:9', size: 'large', isAnchor: true },
      { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium', isAnchor: true }
    ];

    // Rotational rails
    const rotational = [
      { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
      { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'small' },
      { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '16:9', size: 'medium' },
      { id: 'editorial_story', title: 'Editorial Story', type: 'editorial', aspect: '16:9', size: 'medium' }
    ];

    // Add anchors first
    anchors.forEach(def => {
      const content = this.getContentForRail(def);
      if (content.length > 0) {
        this.createRail(def, content);
      }
    });

    // Add rotational rails
    rotational.forEach(def => {
      const content = this.getContentForRail(def);
      if (content.length > 0) {
        this.createRail(def, content);
      }
    });
  }

  getContentForRail(railDef) {
    // Get content from database based on rail type and current genre filter
    return this.contentDb.getContentForRail(railDef, this.activeGenre);
  }

  createRail(definition, content) {
    const rail = document.createElement('section');
    rail.className = 'row';
    rail.setAttribute('data-rail', definition.id);
    rail.setAttribute('data-rail-type', definition.type);
    rail.setAttribute('data-aspect', definition.aspect);
    rail.setAttribute('data-size', definition.size);
    if (definition.isAnchor) {
      rail.setAttribute('data-anchor', 'true');
    }

    rail.innerHTML = `
      <div class="row-header">
        <h2>${definition.title}</h2>
        <div class="rail-controls"></div>
      </div>
      <div class="carousel" tabindex="0">
        <div class="track">
          ${content.map(item => this.createCard(item, definition)).join('')}
        </div>
        <button class="nav prev" aria-label="Previous">&lt;</button>
        <button class="nav next" aria-label="Next">&gt;</button>
      </div>
    `;

    this.container.appendChild(rail);
    this.rails.push(rail);

    // Set up carousel behavior
    this.setupCarousel(rail.querySelector('.carousel'));
  }

  createCard(item, railDef) {
    const thumbnailSrc = this.getThumbnailSrc(item, railDef.aspect);
    const sizeClass = `size-${railDef.size}`;
    const aspectClass = railDef.aspect === '2:3' ? 'aspect-2-3' : 'aspect-16-9';

    return `
      <div class="card ${sizeClass} ${aspectClass}" data-id="${item.id}" data-genre="${item.genre}">
        <img src="${thumbnailSrc}" alt="${item.title}" class="thumb" onerror="this.src='${V2Config.thumbnailBase}_placeholder.svg'">
        ${item.progress > 0 ? `
          <div class="progress-bar">
            <div class="progress" style="width: ${item.progress}%"></div>
          </div>
        ` : ''}
        ${item.is_live ? '<div class="live-badge">LIVE</div>' : ''}
        ${item.is_new ? '<div class="new-badge">NEW</div>' : ''}
        <div class="meta">
          <div class="title">${item.title}</div>
          ${item.duration ? `<div class="duration">${item.duration}min</div>` : ''}
        </div>
      </div>
    `;
  }

  getThumbnailSrc(item, aspect) {
    // Generate thumbnail path based on item and aspect ratio
    const placeholderFile = aspect === '2:3' ? '_placeholder_2x3.svg' : '_placeholder_16x9.svg';
    return `${V2Config.thumbnailBase}${placeholderFile}`;
  }

  setupCarousel(carousel) {
    const track = carousel.querySelector('.track');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');

    const scrollByCard = (direction) => {
      const cardWidth = track.querySelector('.card').offsetWidth;
      const scrollAmount = cardWidth * 3; // Scroll 3 cards at a time
      track.scrollBy({ 
        left: direction * scrollAmount, 
        behavior: 'smooth' 
      });
    };

    prev?.addEventListener('click', () => scrollByCard(-1));
    next?.addEventListener('click', () => scrollByCard(1));

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') scrollByCard(1);
      if (e.key === 'ArrowLeft') scrollByCard(-1);
    });
  }

  setupAutoAdvance() {
    this.rails.forEach(rail => {
      const carousel = rail.querySelector('.carousel');
      if (carousel) {
        new RailAutoAdvance(carousel, V2Config);
      }
    });
  }

  getCurrentContext() {
    // For demo purposes, check if there's a manual override
    const override = localStorage.getItem('v2-context');
    if (override) return override;

    // Otherwise use time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 17 && hour < 23) return 'evening';
    return 'nextday';
  }

  filterByGenre(genre) {
    this.activeGenre = genre;
    
    // Reload rails with filtered content
    this.loadRails();
    
    // Re-setup auto-advance
    this.setupAutoAdvance();
    
    // Re-initialize rail controls
    this.railControls.init();
  }
}

// Export for use in approach pages
window.V2App = V2App;
