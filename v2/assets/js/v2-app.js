// V2 App - Main application logic for V2 prototypes

// Load content database
let contentDatabase = [];

async function loadContentDatabase() {
  try {
    const response = await fetch('../assets/content-database.csv');
    const csvText = await response.text();
    contentDatabase = parseCSV(csvText);
    console.log('Content database loaded:', contentDatabase.length, 'items');
  } catch (error) {
    console.error('Failed to load content database:', error);
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const content = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const item = {};
    
    headers.forEach((header, index) => {
      let value = values[index];
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(value) && value !== '') value = parseInt(value);
      item[header] = value;
    });
    
    content.push(item);
  }

  return content;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

// Main V2 App Class
class V2App {
  constructor(approach, container) {
    this.approach = approach;
    this.container = container;
    this.activeGenre = 'all';
    this.rails = [];
    this.autoAdvanceTimers = new Map();
  }

  async init() {
    // Load content
    await loadContentDatabase();
    
    // Set up genre filters
    this.setupGenreFilters();
    
    // Load initial rails
    this.loadRails();
  }

  setupGenreFilters() {
    // Create filter UI if it doesn't exist
    if (!document.querySelector('.v2-genre-filters')) {
      const filterContainer = document.createElement('div');
      filterContainer.className = 'v2-genre-filters';
      filterContainer.innerHTML = `
        <div class="filter-chips">
          <div class="chip active" data-genre="all">All</div>
          <div class="chip" data-genre="live">Live</div>
          <div class="chip" data-genre="sports">Sports</div>
          <div class="chip" data-genre="drama">Drama</div>
          <div class="chip" data-genre="comedy">Comedy</div>
          <div class="chip" data-genre="action">Action</div>
          <div class="chip" data-genre="documentary">Documentary</div>
          <div class="chip" data-genre="reality">Reality</div>
          <div class="chip" data-genre="news">News</div>
          <div class="chip" data-genre="animation">Animation</div>
        </div>
      `;
      document.body.insertBefore(filterContainer, this.container);
    }

    // Add event listeners
    const chips = document.querySelectorAll('.v2-genre-filters .chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        // Update active state
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        // Filter content
        this.activeGenre = chip.getAttribute('data-genre');
        this.loadRails();
      });
    });
  }

  loadRails() {
    // Clear existing rails
    this.container.innerHTML = '';
    this.rails = [];
    
    // Stop all auto-advance timers
    this.autoAdvanceTimers.forEach(timer => {
      if (timer.interval) clearInterval(timer.interval);
      if (timer.timeout) clearTimeout(timer.timeout);
    });
    this.autoAdvanceTimers.clear();
    
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

  getCurrentContext() {
    const override = localStorage.getItem('v2-context');
    if (override) return override;

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 17 && hour < 23) return 'evening';
    return 'nextday';
  }

  getContentForRail(railDef) {
    let filtered = [...contentDatabase];

    // Apply genre filter
    if (this.activeGenre !== 'all') {
      filtered = filtered.filter(item => 
        item.genre === this.activeGenre || 
        item.subgenre === this.activeGenre ||
        (item.tags && item.tags.includes(this.activeGenre))
      );
    }

    // Filter by rail type
    switch(railDef.id) {
      case 'continue_watching':
        return filtered.filter(item => item.progress > 0 && item.progress < 100).slice(0, 8);
      
      case 'currently_live':
      case 'live_now':
      case 'live_channels':
        return filtered.filter(item => item.is_live === true).slice(0, 8);
      
      case 'upcoming_games':
      case 'todays_games':
        return filtered.filter(item => 
          item.type === 'sports' && !item.is_live
        ).slice(0, 8);
      
      case 'featured_picks':
      case 'editorial_picks':
      case 'recommended':
      case 'editorial_story':
        return filtered.filter(item => 
          item.year >= 2023 || item.rating === 'TV-MA'
        ).slice(0, 8);
      
      case 'gamestream':
      case 'highlights':
      case 'reels_grid':
        return filtered.filter(item => 
          item.duration <= 30 || item.type === 'sports'
        ).slice(0, 8);
      
      case 'recordings':
        return filtered.filter(item => 
          item.type === 'tv' || item.type === 'movie'
        ).slice(0, 8);
      
      default:
        return filtered.slice(0, 8);
    }
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
    
    // Set up auto-advance
    this.setupAutoAdvance(rail.querySelector('.carousel'), definition.id);
    
    // Set up rail controls
    this.setupRailControls(rail);
  }

  createCard(item, railDef) {
    const placeholderFile = railDef.aspect === '2:3' ? '_placeholder_2x3.svg' : '_placeholder_16x9.svg';
    const thumbnailSrc = `/v2/public/thumbs/${placeholderFile}`;
    const sizeClass = `size-${railDef.size}`;
    const aspectClass = railDef.aspect === '2:3' ? 'aspect-2-3' : 'aspect-16-9';

    return `
      <div class="card ${sizeClass} ${aspectClass}" data-id="${item.id}" data-genre="${item.genre}">
        <img src="${thumbnailSrc}" alt="${item.title}" class="thumb" onerror="this.src='/v2/public/thumbs/_placeholder.svg'">
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

  setupCarousel(carousel) {
    const track = carousel.querySelector('.track');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');

    const scrollByCard = (direction) => {
      const card = track.querySelector('.card');
      if (!card) return;
      const cardWidth = card.offsetWidth;
      const scrollAmount = cardWidth * 3;
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

  setupAutoAdvance(carousel, railId) {
    const track = carousel.querySelector('.track');
    const cards = Array.from(carousel.querySelectorAll('.card'));
    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoAdvanceInterval = null;
    let inactivityTimer = null;

    const isTopmostCarousel = () => {
      // Get all carousels on the page
      const allCarousels = Array.from(document.querySelectorAll('.carousel'));
      
      // Get the position of this carousel
      const carouselRect = carousel.getBoundingClientRect();
      
      // Find the topmost visible carousel
      let topmostCarousel = null;
      let topmostTop = Infinity;
      
      allCarousels.forEach(c => {
        const rect = c.getBoundingClientRect();
        // Check if carousel is visible in viewport
        if (rect.top >= 0 && rect.bottom <= window.innerHeight && rect.top < topmostTop) {
          topmostTop = rect.top;
          topmostCarousel = c;
        }
      });
      
      // If no carousel is fully visible, find the one that's most visible at the top
      if (!topmostCarousel) {
        allCarousels.forEach(c => {
          const rect = c.getBoundingClientRect();
          // Check if carousel is at least partially visible and closer to top
          if (rect.bottom > 0 && rect.top < window.innerHeight && rect.top < topmostTop) {
            topmostTop = rect.top;
            topmostCarousel = c;
          }
        });
      }
      
      return carousel === topmostCarousel;
    };

    const advanceToNext = () => {
      // Only advance if this is still the topmost carousel
      if (!isTopmostCarousel()) {
        stopAutoAdvance();
        return;
      }
      
      currentIndex = (currentIndex + 1) % cards.length;
      const card = cards[currentIndex];
      if (card) {
        const cardLeft = card.offsetLeft;
        track.scrollTo({
          left: cardLeft - 20,
          behavior: 'smooth'
        });
      }
    };

    const startAutoAdvance = () => {
      // Only start if this is the topmost carousel
      if (!isTopmostCarousel()) return;
      
      if (autoAdvanceInterval) return;
      
      autoAdvanceInterval = setInterval(advanceToNext, 3000);
      
      // Show indicator
      if (!carousel.querySelector('.auto-advance-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'auto-advance-indicator';
        indicator.innerHTML = 'Auto-advancing';
        carousel.appendChild(indicator);
      }
      
      console.log('Auto-advance started for rail:', railId);
    };

    const stopAutoAdvance = () => {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
      
      // Remove indicator
      const indicator = carousel.querySelector('.auto-advance-indicator');
      if (indicator) indicator.remove();
    };

    const resetInactivityTimer = () => {
      stopAutoAdvance();
      
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      inactivityTimer = setTimeout(() => {
        if (isTopmostCarousel()) {
          startAutoAdvance();
        }
      }, 5000);
    };

    // User interaction events
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
      carousel.addEventListener(event, resetInactivityTimer);
    });

    // Global scroll event to check if carousel position changed
    window.addEventListener('scroll', () => {
      if (autoAdvanceInterval && !isTopmostCarousel()) {
        stopAutoAdvance();
      } else if (!autoAdvanceInterval && isTopmostCarousel()) {
        resetInactivityTimer();
      }
    });

    // Store timers for cleanup
    this.autoAdvanceTimers.set(railId, {
      interval: autoAdvanceInterval,
      timeout: inactivityTimer
    });

    // Start inactivity timer
    resetInactivityTimer();
  }

  setupRailControls(rail) {
    const controlsContainer = rail.querySelector('.rail-controls');
    if (!controlsContainer) return;

    const railId = rail.getAttribute('data-rail');
    const isAnchor = rail.getAttribute('data-anchor') === 'true';

    // Move Up button
    if (!isAnchor && rail.previousElementSibling && this.approach !== 'contextual') {
      const moveUpBtn = document.createElement('button');
      moveUpBtn.className = 'rail-control-btn';
      moveUpBtn.innerHTML = '↑';
      moveUpBtn.title = 'Move Up';
      moveUpBtn.addEventListener('click', () => {
        rail.parentNode.insertBefore(rail, rail.previousElementSibling);
        this.updateAllRailControls();
      });
      controlsContainer.appendChild(moveUpBtn);
    }

    // Move Down button
    if (!isAnchor && rail.nextElementSibling && this.approach !== 'contextual') {
      const moveDownBtn = document.createElement('button');
      moveDownBtn.className = 'rail-control-btn';
      moveDownBtn.innerHTML = '↓';
      moveDownBtn.title = 'Move Down';
      moveDownBtn.addEventListener('click', () => {
        rail.parentNode.insertBefore(rail.nextElementSibling, rail);
        this.updateAllRailControls();
      });
      controlsContainer.appendChild(moveDownBtn);
    }

    // Remove button
    if (!isAnchor) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'rail-control-btn';
      removeBtn.innerHTML = '×';
      removeBtn.title = 'Remove Rail';
      removeBtn.addEventListener('click', () => {
        rail.style.opacity = '0';
        setTimeout(() => {
          rail.remove();
          this.updateAllRailControls();
        }, 300);
      });
      controlsContainer.appendChild(removeBtn);
    }

    // Add Rail button
    const addBtn = document.createElement('button');
    addBtn.className = 'rail-control-btn add-rail-btn';
    addBtn.innerHTML = '+ Add Rail';
    addBtn.title = 'Add New Rail';
    addBtn.addEventListener('click', () => this.showAddRailMenu(rail));
    controlsContainer.appendChild(addBtn);
  }

  updateAllRailControls() {
    const rails = this.container.querySelectorAll('.row');
    rails.forEach(rail => {
      const controls = rail.querySelector('.rail-controls');
      controls.innerHTML = '';
      this.setupRailControls(rail);
    });
  }

  showAddRailMenu(afterRail) {
    // Implementation would show a menu to add new rails
    console.log('Add rail menu would appear here');
  }
}

// Export for use
window.V2App = V2App;
