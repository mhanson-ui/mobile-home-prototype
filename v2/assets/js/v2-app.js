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
    
    // Get viewer type from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    this.viewerType = urlParams.get('viewer') || localStorage.getItem('v2-viewer-type') || 'all';
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
    
    // Reset global tag distribution tracker
    this.globalTagDistribution = {
      totalEligibleCards: 0,
      taggedCards: 0,
      targetTagPercentage: 0.3, // Aim for 30% of eligible cards to have tags
      usedTags: new Set(),
      processedItems: new Map() // Track which items have been processed
    };
    
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
    
    // Ensure minimum number of rails when filtering
    this.ensureMinimumRails();
  }

  loadIntentBasedRails() {
    const railDefinitions = [
      // UTILITY
      { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'medium' },
      { id: 'recordings', title: 'Recordings', type: 'utility', aspect: '16:9', size: 'small' },
      { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'medium' },
      // LIVE
      { id: 'currently_live', title: 'Currently Live', type: 'live', aspect: '16:9', size: 'large' },
      { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '2:3', size: 'medium' },
      // EDITORIAL
      { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
      { id: 'recommended', title: 'Recommended', type: 'editorial', aspect: '16:9', size: 'medium' },
      // SHORT-FORM
      { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' },
      { id: 'shortform_placeholder', title: 'Shortform Placeholder', type: 'shortform', aspect: '2:3', size: 'fullwidth' }
    ];

    // Repeat pattern 5 times
    for (let i = 0; i < 5; i++) {
      railDefinitions.forEach((def, index) => {
        const content = this.getContentForRail(def);
        if (content.length > 0) {
          // Create unique ID for repeated rails
          const uniqueDef = { ...def, id: `${def.id}_${i}` };
          // Add repeat number to title if not first iteration
          if (i > 0) {
            uniqueDef.title = `${def.title} ${i + 1}`;
          }
          this.createRail(uniqueDef, content);
        }
      });
    }
  }

  loadMixedAspectRails() {
    const railDefinitions = [
      { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'medium' },
      { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
      { id: 'shortform_placeholder', title: 'Shortform Placeholder', type: 'shortform', aspect: '2:3', size: 'fullwidth' },
      { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' },
      { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '2:3', size: 'medium' },
      { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'medium' }
    ];

    // Repeat pattern 5 times
    for (let i = 0; i < 5; i++) {
      railDefinitions.forEach(def => {
        const content = this.getContentForRail(def);
        if (content.length > 0) {
          const uniqueDef = { ...def, id: `${def.id}_${i}` };
          if (i > 0) {
            uniqueDef.title = `${def.title} ${i + 1}`;
          }
          this.createRail(uniqueDef, content);
        }
      });
    }
  }

  loadContextualRails() {
    const context = this.getCurrentContext();
    let railDefinitions = [];
    
    // Add pinned "On Now" rail first for all contexts
    const onNowRail = { 
      id: 'on_now', 
      title: 'On Now', 
      type: 'live', 
      aspect: '16:9', 
      size: 'fullwidth',
      isPinned: true 
    };

    switch(context) {
      case 'morning':
        railDefinitions = [
          onNowRail,
          { id: 'todays_games', title: "Today's Games", type: 'utility', aspect: '16:9', size: 'medium' },
          { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'medium' },
          { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
          { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' }
        ];
        break;
      case 'evening':
        railDefinitions = [
          onNowRail,
          { id: 'currently_live', title: 'Currently Live', type: 'live', aspect: '16:9', size: 'large' },
          { id: 'shortform_placeholder', title: 'Shortform Placeholder', type: 'shortform', aspect: '2:3', size: 'fullwidth' },
          { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '2:3', size: 'medium' },
          { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'medium' },
          { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium' },
          { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' }
        ];
        break;
      case 'nextday':
        railDefinitions = [
          onNowRail,
          { id: 'highlights', title: "Tonight's Highlights", type: 'shortform', aspect: '2:3', size: 'medium' },
          { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'medium' },
          { id: 'editorial_picks', title: 'Editorial Picks', type: 'editorial', aspect: '16:9', size: 'medium' }
        ];
        break;
    }

    // Add On Now rail first (only once, not repeated)
    const onNowContent = this.getContentForRail(onNowRail);
    if (onNowContent.length > 0) {
      this.createRail(onNowRail, onNowContent);
    }
    
    // Repeat pattern 5 times (excluding On Now)
    const repeatableRails = railDefinitions.filter(def => def.id !== 'on_now');
    for (let i = 0; i < 5; i++) {
      repeatableRails.forEach(def => {
        const content = this.getContentForRail(def);
        if (content.length > 0) {
          const uniqueDef = { ...def, id: `${def.id}_${i}` };
          if (i > 0) {
            uniqueDef.title = `${def.title} ${i + 1}`;
          }
          this.createRail(uniqueDef, content);
        }
      });
    }
  }

  loadAnchorRotationalRails() {
    // Fixed anchors
    const anchors = [
      { id: 'continue_watching', title: 'Continue Watching', type: 'utility', aspect: '16:9', size: 'medium', isAnchor: true },
      { id: 'currently_live', title: 'Currently Live', type: 'live', aspect: '16:9', size: 'large', isAnchor: true },
      { id: 'gamestream', title: 'GameStream', type: 'shortform', aspect: '2:3', size: 'medium', isAnchor: true }
    ];

    // Rotational rails
    const rotational = [
      { id: 'featured_picks', title: 'Featured Picks', type: 'editorial', aspect: '16:9', size: 'medium' },
      { id: 'shortform_placeholder', title: 'Shortform Placeholder', type: 'shortform', aspect: '2:3', size: 'fullwidth' },
      { id: 'upcoming_games', title: 'Upcoming Games', type: 'utility', aspect: '16:9', size: 'medium' },
      { id: 'live_channels', title: 'Live Channels', type: 'live', aspect: '2:3', size: 'medium' },
      { id: 'editorial_story', title: 'Editorial Story', type: 'editorial', aspect: '16:9', size: 'medium' }
    ];

    // Add anchors first (only once, not repeated)
    anchors.forEach(def => {
      const content = this.getContentForRail(def);
      if (content.length > 0) {
        this.createRail(def, content);
      }
    });

    // Repeat rotational pattern 5 times
    for (let i = 0; i < 5; i++) {
      rotational.forEach(def => {
        const content = this.getContentForRail(def);
        if (content.length > 0) {
          const uniqueDef = { ...def, id: `${def.id}_${i}` };
          if (i > 0) {
            uniqueDef.title = `${def.title} ${i + 1}`;
          }
          this.createRail(uniqueDef, content);
        }
      });
    }
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
    // Create deep copies to preserve tag selections
    let filtered = contentDatabase.map(item => ({...item}));

    // Apply genre filter
    if (this.activeGenre !== 'all') {
      filtered = filtered.filter(item => 
        item.genre === this.activeGenre || 
        item.subgenre === this.activeGenre ||
        (item.tags && item.tags.includes(this.activeGenre))
      );
    }
    
    // Apply viewer type personalization
    filtered = this.applyViewerTypePreferences(filtered, railDef);

    // Filter by rail type
    switch(railDef.id) {
      case 'continue_watching':
        return filtered.filter(item => item.progress > 0 && item.progress < 100).slice(0, 8);
      
      case 'currently_live':
      case 'live_now':
        return filtered.filter(item => item.is_live === true && item.type !== 'channel').slice(0, 8);
        
      case 'on_now':
        // Return only 1 live item for fullwidth carousel
        return filtered.filter(item => item.is_live === true && item.type !== 'channel').slice(0, 1);
        
      case 'live_channels':
        return filtered.filter(item => item.type === 'channel').slice(0, 8);
      
      case 'upcoming_games':
      case 'todays_games':
        const upcomingGames = filtered.filter(item => 
          item.type === 'sports' && !item.is_live
        ).slice(0, 8);
        if (this.activeGenre !== 'all' && upcomingGames.length === 0) {
          console.log(`No upcoming games for genre: ${this.activeGenre}`);
        }
        return upcomingGames;
      
      case 'featured_picks':
      case 'editorial_picks':
      case 'recommended':
      case 'editorial_story':
        return filtered.filter(item => 
          item.year >= 2023 || item.rating === 'TV-MA'
        ).slice(0, 8);
      
      case 'gamestream':
        // Only actual sports games/events, not sports-themed entertainment
        return filtered.filter(item => 
          // Live sports events
          (item.type === 'sports' && item.is_live === true) || 
          // Sports content that's not entertainment shows
          (item.genre === 'sports' && item.type !== 'tv' && item.type !== 'movie') ||
          // Sports documentaries about actual games/competitions
          (item.genre === 'sports' && item.subgenre === 'sports' && item.type === 'documentary')
        ).slice(0, 8);
        
      case 'highlights':
      case 'reels_grid':
        return filtered.filter(item => 
          item.duration <= 30 || item.type === 'sports'
        ).slice(0, 8);
      
      case 'shortform_placeholder':
        // Return only 1 item for fullwidth carousel
        return filtered.filter(item => 
          item.duration <= 30 || item.type === 'sports'
        ).slice(0, 1);
      
      case 'recordings':
        return filtered.filter(item => 
          item.type === 'tv' || item.type === 'movie'
        ).slice(0, 8);
      
      default:
        return filtered.slice(0, 8);
    }
  }

  createRail(definition, content) {
    // Apply tag variety before creating cards
    content = this.applyTagVariety(content, definition);
    
    const rail = document.createElement('section');
    rail.className = 'row';
    rail.setAttribute('data-rail', definition.id);
    rail.setAttribute('data-rail-type', definition.type);
    rail.setAttribute('data-aspect', definition.aspect);
    rail.setAttribute('data-size', definition.size);
    if (definition.isAnchor) {
      rail.setAttribute('data-anchor', 'true');
    }
    if (definition.isPinned) {
      rail.setAttribute('data-pinned', 'true');
    }

    // Rename GameStream to Entertainment for non-sports shortform content
    let title = definition.title;
    if (definition.id.includes('gamestream') && this.activeGenre !== 'sports' && this.activeGenre !== 'all') {
      title = title.replace('GameStream', 'Entertainment');
    }
    
    rail.innerHTML = `
      <div class="row-header">
        <h2>${title}</h2>
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
    const sizeClass = railDef.size === 'fullwidth' ? 'size-fullwidth' : `size-${railDef.size}`;
    const aspectClass = railDef.aspect === '2:3' ? 'aspect-2-3' : 'aspect-16-9';

    // Determine which badges/info to show based on content type and state
    const badges = [];
    
    // Primary badges (top priority)
    // Skip LIVE badge for On Now rail (has its own live indicator)
    if (item.is_live && railDef.id !== 'on_now') {
      badges.push('<div class="live-badge">LIVE</div>');
    } else if (item.is_new) {
      badges.push('<div class="new-badge">NEW</div>');
    } else if (item.is_expiring) {
      badges.push('<div class="expiring-badge">EXPIRING</div>');
    } else if (railDef.id && (railDef.id.includes('upcoming_games') || railDef.id.includes('todays_games')) && item.type === 'sports') {
      // Add countdown timer for upcoming games
      const countdownTime = this.generateCountdownTime();
      if (countdownTime) {
        badges.push(`<div class="countdown-badge">${countdownTime}</div>`);
      }
    }
    
    // Quality badge for premium content
    if (item.quality === '4K HDR') {
      badges.push('<div class="quality-badge">4K HDR</div>');
    } else if (item.quality === '4K') {
      badges.push('<div class="quality-badge">4K</div>');
    }
    
    // Additional metadata
    const metadata = [];
    
    // Show different info based on content type
    if (item.type === 'sports' && item.is_live) {
      // For live sports, show game time remaining
      if (railDef.id === 'on_now') {
        const gameTime = this.generateGameTime(item);
        metadata.push(`<span class="meta-item game-time">${gameTime}</span>`);
      } else if (item.duration) {
        metadata.push(`<span class="meta-item">${Math.floor(item.duration/60)}h ${item.duration%60}m</span>`);
      }
    } else if (railDef.id === 'on_now' && item.is_live) {
      // For other live content on On Now, show time remaining
      const timeRemaining = this.generateTimeRemaining(item);
      metadata.push(`<span class="meta-item time-remaining">${timeRemaining}</span>`);
    } else if (item.type === 'movie') {
      // For movies, show year and rating
      if (item.year) metadata.push(`<span class="meta-item">${item.year}</span>`);
      if (item.rating) metadata.push(`<span class="meta-item meta-rating">${item.rating}</span>`);
    } else if (item.type === 'tv') {
      // For TV shows, show network and episode duration
      if (item.network) metadata.push(`<span class="meta-item">${item.network}</span>`);
      if (item.duration) metadata.push(`<span class="meta-item">${item.duration}min</span>`);
    } else {
      // Default: show duration if available
      if (item.duration) metadata.push(`<span class="meta-item">${item.duration}min</span>`);
    }

    // Tag display rule: Maximum 1 tag per card
    // Not all content needs tags - use sparingly to avoid overwhelming users
    // Priority rules for showing tags:
    // 1. Show tags on editorial, shortform, and live rails
    // 2. No tags if item has progress bar (Continue Watching items)
    // 3. No tags if item already has LIVE or NEW badge
    const shouldShowTag = (railDef.type === 'editorial' || 
                          railDef.type === 'shortform' ||
                          railDef.type === 'live') && 
                         item.tags && 
                         item.progress === 0 && // No tags on Continue Watching items
                         !item.is_live && // No tags on live items (already have LIVE badge)
                         !item.is_new; // No tags on new items (already have NEW badge)
    
    // Use pre-selected tag if available, otherwise select based on rules
    let selectedTag = null;
    if (shouldShowTag) {
      // Check if tag was pre-selected by variety function
      if (item._selectedTag !== undefined) {
        selectedTag = item._selectedTag;
      } else if (item.tags) {
        // Fallback to original selection logic
        const tags = item.tags.split(',').map(tag => tag.trim());
        
        // Filter out redundant tags
        const redundantTags = ['live', 'new', 'hd', '4k', '4k hdr'];
        const filteredTags = tags.filter(tag => !redundantTags.includes(tag.toLowerCase()));
        
        // Prioritize certain tag types for better user value
        const priorityTags = ['adaptation', 'sequel', 'finale', 'premiere', 'exclusive', 'original'];
        selectedTag = filteredTags.find(tag => priorityTags.includes(tag.toLowerCase())) || filteredTags[0] || null;
      }
    }

    // Add live video indicator for On Now rail
    const liveVideoIndicator = railDef.id === 'on_now' ? '<div class="live-video-indicator">LIVE</div>' : '';
    
    return `
      <div class="card ${sizeClass} ${aspectClass}" data-id="${item.id}" data-genre="${item.genre}" data-rail-type="${railDef.type}">
        <img src="${thumbnailSrc}" alt="${item.title}" class="thumb" onerror="this.src='/v2/public/thumbs/_placeholder.svg'">
        ${item.progress > 0 ? `
          <div class="progress-bar">
            <div class="progress" style="width: ${item.progress}%"></div>
          </div>
        ` : ''}
        ${badges.join('')}
        ${selectedTag ? `<div class="content-tag">${selectedTag}</div>` : ''}
        ${liveVideoIndicator}
        <div class="meta">
          <div class="title">${item.title}</div>
          ${metadata.length > 0 ? `<div class="metadata">${metadata.join(' • ')}</div>` : ''}
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
    
    // Skip auto-advance for single-item carousels (On Now, Shortform Placeholder)
    if (cards.length === 1) return;

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
      
      // Move to next card, loop back to start if at end
      currentIndex = (currentIndex + 1) % cards.length;
      const card = cards[currentIndex];
      
      if (card) {
        // If we've looped back to the first card, ensure we scroll to the very beginning
        if (currentIndex === 0) {
          track.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          const cardLeft = card.offsetLeft;
          track.scrollTo({
            left: cardLeft - 20,
            behavior: 'smooth'
          });
        }
      }
    };

    const startAutoAdvance = () => {
      // Only start if this is the topmost carousel
      if (!isTopmostCarousel()) return;
      
      if (autoAdvanceInterval) return;
      
      autoAdvanceInterval = setInterval(advanceToNext, 3000);
      
      // Show indicator in header
      const rail = carousel.closest('.row');
      const header = rail.querySelector('.row-header h2');
      if (header && !header.querySelector('.auto-advance-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'auto-advance-indicator';
        indicator.innerHTML = 'Auto-advancing';
        header.appendChild(indicator);
      }
      
      console.log('Auto-advance started for rail:', railId);
    };

    const stopAutoAdvance = () => {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
      
      // Remove indicator from header
      const rail = carousel.closest('.row');
      const indicator = rail.querySelector('.auto-advance-indicator');
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
    
    // Check if this is the first rail and should be pinned
    const isFirstRail = rail === rail.parentElement.querySelector('.row:first-child');
    const isPinned = isFirstRail && (this.approach === 'contextual' || this.approach === 'anchor');
    
    // Add pinned indicator if applicable
    if (isPinned) {
      const pinnedIndicator = document.createElement('span');
      pinnedIndicator.className = 'rail-control-btn pinned-indicator';
      pinnedIndicator.innerHTML = 'PINNED';
      pinnedIndicator.title = 'Pinned Rail';
      pinnedIndicator.style.cursor = 'default';
      pinnedIndicator.style.opacity = '0.7';
      pinnedIndicator.style.fontSize = '10px';
      pinnedIndicator.style.fontWeight = '600';
      pinnedIndicator.style.letterSpacing = '0.5px';
      controlsContainer.appendChild(pinnedIndicator);
    }

    // Move Up button
    if (!isAnchor && !isPinned && rail.previousElementSibling && this.approach !== 'contextual') {
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
    if (!isAnchor && !isPinned && rail.nextElementSibling && this.approach !== 'contextual') {
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
    if (!isAnchor && !isPinned) {
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

    // Add Rail button - removed per user request
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
  
  applyViewerTypePreferences(content, railDef) {
    // Apply lighter personalization for utility rails
    const isUtilityRail = railDef.type === 'utility';
    
    let weighted = [...content];
    
    switch(this.viewerType) {
      case 'tv':
        // Prioritize TV shows, deprioritize movies and sports
        weighted = weighted.sort((a, b) => {
          // Lighter touch for utility rails - just subtle preference
          const multiplier = isUtilityRail ? 1 : 2;
          const scoreA = a.type === 'tv' ? multiplier : (a.type === 'movie' ? -1 : 0);
          const scoreB = b.type === 'tv' ? multiplier : (b.type === 'movie' ? -1 : 0);
          return scoreB - scoreA;
        });
        break;
        
      case 'movies':
        // Prioritize movies, deprioritize TV shows
        weighted = weighted.sort((a, b) => {
          const multiplier = isUtilityRail ? 1 : 2;
          const scoreA = a.type === 'movie' ? multiplier : (a.type === 'tv' ? -1 : 0);
          const scoreB = b.type === 'movie' ? multiplier : (b.type === 'tv' ? -1 : 0);
          return scoreB - scoreA;
        });
        break;
        
      case 'news':
        // Prioritize news and documentary content
        weighted = weighted.sort((a, b) => {
          const multiplier = isUtilityRail ? 1 : 2;
          const scoreA = (a.genre === 'news' || a.type === 'documentary') ? multiplier : -1;
          const scoreB = (b.genre === 'news' || b.type === 'documentary') ? multiplier : -1;
          return scoreB - scoreA;
        });
        break;
        
      case 'sports':
        // Moderate sports preference - live games and highlights
        weighted = weighted.sort((a, b) => {
          const multiplier = isUtilityRail ? 1 : 2;
          const scoreA = a.genre === 'sports' ? multiplier : (a.subgenre === 'sports' ? 1 : -1);
          const scoreB = b.genre === 'sports' ? multiplier : (b.subgenre === 'sports' ? 1 : -1);
          return scoreB - scoreA;
        });
        break;
        
      case 'sports-pro':
        // Heavy sports preference - everything sports related
        weighted = weighted.sort((a, b) => {
          const multiplier = isUtilityRail ? 1.5 : 3;
          const scoreA = (a.genre === 'sports' || a.subgenre === 'sports' || 
                          (a.tags && a.tags.includes('sports'))) ? multiplier : -2;
          const scoreB = (b.genre === 'sports' || b.subgenre === 'sports' || 
                          (b.tags && b.tags.includes('sports'))) ? multiplier : -2;
          return scoreB - scoreA;
        });
        break;
    }
    
    // For Continue Watching, also consider progress (recently watched first)
    if (railDef.id === 'continue_watching') {
      weighted = weighted.sort((a, b) => {
        // First sort by viewer preference (from above)
        const prefDiff = weighted.indexOf(a) - weighted.indexOf(b);
        // If same preference level, sort by progress (higher progress = watched more recently)
        if (Math.abs(prefDiff) < 2) {
          return (b.progress || 0) - (a.progress || 0);
        }
        return prefDiff;
      });
    }
    
    // Shuffle within score groups to maintain some variety
    return this.shuffleWithinGroups(weighted);
  }
  
  shuffleWithinGroups(arr) {
    // Simple shuffle to add variety while maintaining preference weights
    for (let i = arr.length - 1; i > 0; i--) {
      // Only shuffle within similar items (every 3-4 items)
      if (i % 4 === 0) {
        const j = Math.max(0, i - Math.floor(Math.random() * 4));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    return arr;
  }
  
  applyTagVariety(content, railDef) {
    // Only apply tag variety to rails that show tags
    if (railDef.type !== 'editorial' && railDef.type !== 'shortform' && railDef.type !== 'live') {
      return content;
    }
    
    const redundantTags = ['live', 'new', 'hd', '4k', '4k hdr'];
    const priorityTags = ['adaptation', 'sequel', 'finale', 'premiere', 'exclusive', 'original'];
    
    // Count eligible items in this rail
    const eligibleItems = content.filter(item => 
      item.tags && item.progress === 0 && !item.is_live && !item.is_new
    );
    
    this.globalTagDistribution.totalEligibleCards += eligibleItems.length;
    
    // Calculate how many tags this rail should show for balanced distribution
    const targetTagsForRail = Math.ceil(eligibleItems.length * this.globalTagDistribution.targetTagPercentage);
    let tagsAssignedInRail = 0;
    
    // Process each item with balanced distribution in mind
    content.forEach((item, index) => {
      // Check if this item was already processed
      if (this.globalTagDistribution.processedItems.has(item.id)) {
        item._selectedTag = this.globalTagDistribution.processedItems.get(item.id);
        return;
      }
      
      if (!item.tags || item.progress > 0 || item.is_live || item.is_new) {
        item._selectedTag = null;
        this.globalTagDistribution.processedItems.set(item.id, null);
        return;
      }
      
      const tags = item.tags.split(',').map(tag => tag.trim());
      const filteredTags = tags.filter(tag => !redundantTags.includes(tag.toLowerCase()));
      
      // Decide if this card should get a tag based on distribution
      const shouldAssignTag = this.shouldAssignTagForBalance(
        tagsAssignedInRail, 
        targetTagsForRail, 
        index, 
        eligibleItems.length
      );
      
      if (!shouldAssignTag || filteredTags.length === 0) {
        item._selectedTag = null;
        return;
      }
      
      // Priority tags always get preference
      let selectedTag = filteredTags.find(tag => priorityTags.includes(tag.toLowerCase()));
      
      // If no priority tag, find an unused tag globally
      if (!selectedTag) {
        selectedTag = filteredTags.find(tag => !this.globalTagDistribution.usedTags.has(tag.toLowerCase()));
      }
      
      // If all tags are used globally, pick the least used one
      if (!selectedTag) {
        selectedTag = this.selectLeastUsedTag(filteredTags);
      }
      
      // Store the selected tag
      if (selectedTag) {
        item._selectedTag = selectedTag;
        this.globalTagDistribution.usedTags.add(selectedTag.toLowerCase());
        this.globalTagDistribution.taggedCards++;
        this.globalTagDistribution.processedItems.set(item.id, selectedTag);
        tagsAssignedInRail++;
      } else {
        item._selectedTag = null;
        this.globalTagDistribution.processedItems.set(item.id, null);
      }
    });
    
    return content;
  }
  
  shouldAssignTagForBalance(assigned, target, index, total) {
    // If we haven't reached our target, distribute evenly
    if (assigned < target) {
      // Calculate even distribution across remaining items
      const remainingItems = total - index;
      const remainingTags = target - assigned;
      const probability = remainingTags / remainingItems;
      
      // Use deterministic distribution for consistency
      return (index % Math.ceil(1 / probability)) === 0;
    }
    return false;
  }
  
  selectLeastUsedTag(tags) {
    // When all tags have been used, select the one that appears least frequently
    const tagCounts = new Map();
    
    // Count global tag usage
    for (const tag of this.globalTagDistribution.usedTags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
    
    // Find the least used tag from available options
    let leastUsedTag = tags[0];
    let minCount = Infinity;
    
    for (const tag of tags) {
      const count = tagCounts.get(tag.toLowerCase()) || 0;
      if (count < minCount) {
        minCount = count;
        leastUsedTag = tag;
      }
    }
    
    return leastUsedTag;
  }
  
  ensureMinimumRails() {
    // Only apply minimum rails when filtering by genre (not "all")
    if (this.activeGenre === 'all') return;
    
    const visibleRails = this.container.querySelectorAll('.row').length;
    const minimumRails = 10;
    
    if (visibleRails < minimumRails) {
      console.log(`Only ${visibleRails} rails visible for genre ${this.activeGenre}, adding more...`);
      
      // Define fallback rails that work for any genre
      const fallbackRails = [
        { id: 'recommended_extra', title: `Recommended ${this.activeGenre.charAt(0).toUpperCase() + this.activeGenre.slice(1)}`, type: 'editorial', aspect: '16:9', size: 'medium' },
        { id: 'trending_extra', title: `Trending in ${this.activeGenre.charAt(0).toUpperCase() + this.activeGenre.slice(1)}`, type: 'editorial', aspect: '16:9', size: 'medium' },
        { id: 'top_rated_extra', title: `Top Rated ${this.activeGenre.charAt(0).toUpperCase() + this.activeGenre.slice(1)}`, type: 'editorial', aspect: '16:9', size: 'medium' },
        { id: 'new_releases_extra', title: `New ${this.activeGenre.charAt(0).toUpperCase() + this.activeGenre.slice(1)} Releases`, type: 'editorial', aspect: '16:9', size: 'medium' },
        { id: 'classics_extra', title: `Classic ${this.activeGenre.charAt(0).toUpperCase() + this.activeGenre.slice(1)}`, type: 'editorial', aspect: '16:9', size: 'medium' }
      ];
      
      let railsAdded = 0;
      const railsNeeded = minimumRails - visibleRails;
      
      // Add fallback rails until we reach minimum
      for (const railDef of fallbackRails) {
        if (railsAdded >= railsNeeded) break;
        
        const content = this.getContentForRail(railDef);
        if (content.length > 0) {
          this.createRail(railDef, content);
          railsAdded++;
        }
      }
      
      console.log(`Added ${railsAdded} additional rails`);
    }
  }
  
  generateCountdownTime() {
    // Generate a random countdown time between 30 minutes and 12 hours
    const minMinutes = 30;
    const maxMinutes = 12 * 60; // 12 hours in minutes
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
    
    // Convert to hours and minutes
    const hours = Math.floor(randomMinutes / 60);
    const minutes = randomMinutes % 60;
    
    // Format the countdown
    if (hours === 0) {
      return `${minutes}M`;
    } else if (minutes === 0) {
      return `${hours}H`;
    } else {
      return `${hours}H ${minutes}M`;
    }
  }
  
  generateGameTime(item) {
    // Generate sport-specific game time based on subgenre
    if (item.subgenre === 'football' || item.title.includes('NFL')) {
      // Football: Quarter and time
      const quarters = ['1Q', '2Q', '3Q', '4Q'];
      const quarter = quarters[Math.floor(Math.random() * quarters.length)];
      const minutes = Math.floor(Math.random() * 15);
      const seconds = Math.floor(Math.random() * 60);
      return `${quarter} ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (item.subgenre === 'basketball' || item.title.includes('NBA')) {
      // Basketball: Quarter and time
      const quarters = ['1st', '2nd', '3rd', '4th'];
      const quarter = quarters[Math.floor(Math.random() * quarters.length)];
      const minutes = Math.floor(Math.random() * 12);
      const seconds = Math.floor(Math.random() * 60);
      return `${quarter} ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (item.subgenre === 'soccer' || item.title.includes('Premier League')) {
      // Soccer: Minutes elapsed
      const minutes = Math.floor(Math.random() * 90) + 1;
      return `${minutes}'`;
    } else if (item.subgenre === 'baseball' || item.title.includes('MLB')) {
      // Baseball: Inning and count
      const inning = Math.floor(Math.random() * 9) + 1;
      const half = Math.random() > 0.5 ? 'Top' : 'Bot';
      return `${half} ${inning}`;
    } else if (item.subgenre === 'hockey' || item.title.includes('NHL')) {
      // Hockey: Period and time
      const periods = ['1st', '2nd', '3rd'];
      const period = periods[Math.floor(Math.random() * periods.length)];
      const minutes = Math.floor(Math.random() * 20);
      const seconds = Math.floor(Math.random() * 60);
      return `${period} ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      // Default sports time
      return `${Math.floor(Math.random() * 60) + 30} min`;
    }
  }
  
  generateTimeRemaining(item) {
    // Generate time remaining for non-sports content
    if (item.type === 'tv' || item.type === 'news') {
      // TV shows/news: usually shorter
      const minutes = Math.floor(Math.random() * 45) + 5;
      return `${minutes} min left`;
    } else {
      // Movies or other: could be longer
      const totalMinutes = Math.floor(Math.random() * 90) + 20;
      if (totalMinutes > 60) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m left`;
      } else {
        return `${totalMinutes} min left`;
      }
    }
  }
}

// Export for use
window.V2App = V2App;
