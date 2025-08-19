// Demo Template System - Unified demo creation and management
// Eliminates boilerplate code across individual demo files

const DemoTemplate = {
  // Default demo configuration
  defaultConfig: {
    title: 'Rail Demo',
    description: 'Individual rail demonstration',
    enableDebug: true,
    enableToggles: false,
    enableAnalytics: true,
    showPurpose: true,
    autoAdvance: true,
    dedupe: true
  },

  // Create a demo page with minimal configuration
  createDemo(config = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Set page title
    document.title = finalConfig.title;
    
    // Create main container
    const main = document.querySelector('main') || document.createElement('main');
    if (!document.querySelector('main')) {
      document.body.appendChild(main);
    }
    
    // Add demo header if description provided
    if (finalConfig.description) {
      const header = document.createElement('header');
      header.innerHTML = `
        <h1>${finalConfig.title}</h1>
        <p class="note">${finalConfig.description}</p>
        <div class="demo-controls">
          <button onclick="window.history.back()" class="back-btn">← Back to Launcher</button>
          <button onclick="window.location.href='../index.html'" class="home-btn">🏠 Home</button>
        </div>
      `;
      main.insertBefore(header, main.firstChild);
    }
    
    // Initialize debug panel if enabled
    if (finalConfig.enableDebug && window.Console) {
      Console.init();
    }
    
    // Initialize feature toggles if enabled
    if (finalConfig.enableToggles && window.FeatureToggles) {
      FeatureToggles.mount();
    }
    
    // Setup analytics if enabled
    if (finalConfig.enableAnalytics) {
      this.setupAnalytics();
    }
    
    return main;
  },

  // Render rails from JSON data with unified configuration
  renderRails(json, container, options = {}) {
    const finalOptions = {
      showPurpose: true,
      autoAdvance: true,
      dedupe: true,
      viewportAware: true,
      ...options
    };
    
    // Validate and sort rails
    const rails = RailEngine.sortRailsByPriority(json.rails || []);
    
    // Render HTML
    const html = rails.map(rail => this.renderRail(rail)).join('');
    container.innerHTML = html;
    
    // Mount behaviors
    this.mountRailBehaviors(container, finalOptions);
    
    // Apply deduplication
    if (finalOptions.dedupe) {
      const dedupeCount = RailEngine.applyOwnershipDedupe(container, {
        enabled: true,
        viewportAware: finalOptions.viewportAware
      });
      
      if (Console.updateStats) {
        Console.updateStats(rails.length, dedupeCount);
      }
    }
    
    // Inject purpose information
    if (finalOptions.showPurpose && json.meta) {
      this.injectPurpose(container, json.meta);
    }
    
    // Setup rail visibility observation
    this.observeRailsVisibility(container);
    
    // Setup countdowns for time-sensitive content
    this.renderCountdowns(container);
    
    return rails;
  },

  // Render individual rail with unified logic
  renderRail(rail) {
    const config = RailEngine.getRailConfig(rail.type);
    const railId = `rail_${rail.type}_${Date.now()}`;
    const headerId = `header_${railId}`;
    
    // Get rail label and micro text
    const label = rail.label || this.getRailLabel(rail.type);
    const micro = rail.micro || this.getRailMicro(rail.type);
    
    // Create intent type HTML
    const intentTypeHTML = `<span class="intent-type">${config.intent.toUpperCase()}</span>`;
    
    // Render cards based on rail type
    let cards = '';
    let layoutAttr = '';
    let ticker = '';
    
    if (rail.type === 'hero_spotlight') {
      return this.renderHeroSpotlight(rail, config, railId, headerId, label, micro, intentTypeHTML);
    }
    
    // Standard rail rendering
    cards = rail.items.map((item, idx) => 
      this.cardFromItem(item, rail.type, idx)
    ).join('');
    
    // Add navigation for rails with multiple items
    const showNav = rail.items.length > 3;
    
    // Add ticker for live content
    if (config.motion === 'ticker') {
      ticker = ' data-ticker="true"';
    }
    
    // Add layout attributes
    if (config.silhouette === 'mosaic') {
      layoutAttr = ' data-layout="mosaic"';
    }
    
    return `
    <section class="row" tabindex="-1" data-rail="${rail.type}" data-rail-id="${railId}" style="--rail-accent:${config.accent}" role="region" aria-labelledby="${headerId}">
      <div class="row-header" tabindex="0">
        <h2 id="${headerId}">${label}${intentTypeHTML}</h2>
        ${micro ? `<div class="micro">${micro}</div>` : ''}
      </div>
      <div class="carousel" tabindex="0"${ticker}${layoutAttr}>
        ${showNav ? '<button class="nav prev" aria-label="Prev" tabindex="0">◀</button>' : ''}
        ${showNav ? '<button class="nav next" aria-label="Next" tabindex="0">▶</button>' : ''}
        <div class="track">${cards}</div>
      </div>
    </section>`;
  },

  // Render hero spotlight with special treatment
  renderHeroSpotlight(rail, config, railId, headerId, label, micro, intentTypeHTML) {
    const heroCard = this.cardFromItem(rail.items[0], rail.type, 0, true);
    const thumbCards = rail.items.slice(1).map((item, idx) => 
      this.cardFromItem(item, rail.type, idx + 1)
    ).join('');
    
    return `
    <section class="row" tabindex="-1" data-rail="${rail.type}" data-rail-id="${railId}" style="--rail-accent:${config.accent}" role="region" aria-labelledby="${headerId}">
      <div class="row-header" tabindex="0">
        <h2 id="${headerId}">${label}${intentTypeHTML}</h2>
        ${micro ? `<div class="micro">${micro}</div>` : ''}
      </div>
      <div class="carousel hero-carousel" tabindex="0">
        <div class="hero-main-container">${heroCard}</div>
        <div class="hero-thumbs-container">
          <div class="hero-thumbs-track">${thumbCards}</div>
        </div>
      </div>
    </section>`;
  },

  // Create card HTML from item data
  cardFromItem(item, railType, idx, isHero = false) {
    const config = RailEngine.getRailConfig(railType);
    const imageSize = isHero ? '800/450' : '480/270';
    const image = item.image || `https://picsum.photos/seed/${item.id || idx}/${imageSize}`;
    const title = item.title || 'Untitled Content';
    let meta = '';
    let badges = '';
    let chips = '';

    // Determine classes
    let classes = ['card'];
    if (railType === 'hero_spotlight') {
      classes.push(isHero ? 'hero-main' : 'hero-thumb');
    }
    if (railType === 'collections_packs' && idx > 0 && idx < 6) {
      // Give stacked visual hint for medium cards
      classes.push('stack');
    }

    // Metadata
    if (railType === 'continue_watching' && item.progress !== undefined) {
      meta = `<div class="progress-bar"><div class="progress-fill" style="width:${item.progress}%"></div></div>`;
      if (item.last_position) meta += `<div class="last-position">${item.last_position}</div>`;
    }
    if (railType === 'live_now') {
      meta = '<div class="live-indicator">🔴 LIVE</div>';
    }
    if (railType === 'starting_soon' && item.startTime) {
      meta = `<div class="start-time" data-start="${item.startTime}">Starting soon</div>`;
    }

    // Badges
    if (item.badges && Array.isArray(item.badges)) {
      badges = item.badges.map(badge => `<span class="badge">${badge}</span>`).join('');
    }
    // Chips
    if (item.chips && Array.isArray(item.chips)) {
      chips = item.chips.map(chip => `<span class="chip">${chip}</span>`).join('');
    }

    // Inline background to match existing CSS sizing
    const safeUrl = String(image).replace(/"/g, '');
    const inlineStyle = `background-image:url('${safeUrl}');background-size:cover;background-position:center;`;

    return `
    <div class="${classes.join(' ')}" data-id="${item.id || `item_${idx}`}" data-rail-type="${railType}" tabindex="0" role="button" style="${inlineStyle}">
      <div class="card-content">
        <div class="meta">${title}</div>
        ${meta}
        ${badges}
        ${chips}
      </div>
    </div>`;
  },

  // Get rail label from type
  getRailLabel(type) {
    const labels = {
      hero_spotlight: 'Hero Spotlight',
      editorial_hero: 'Editorial Hero',
      continue_watching: 'Continue Watching',
      live_now: 'Live Now',
      starting_soon: 'Starting Soon',
      because_you_watched: 'Because You Watched',
      new_and_noteworthy: 'New & Noteworthy',
      trending: 'Trending',
      for_you_mosaic: 'For You',
      collections_packs: 'Collections & Packs',
      team_league_hubs: 'Team & League Hubs',
      highlights_reels: 'Highlights & Reels',
      reels_grid: 'Reels Grid',
      channel_surf: 'Channel Surf',
      expiring_soon: 'Expiring Soon',
      people_suggestion: 'People You May Like',
      sponsored_shop: 'Sponsored'
    };
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  // Get rail micro description
  getRailMicro(type) {
    const micros = {
      hero_spotlight: 'Campaign presence with cycling thumbnails',
      editorial_hero: 'Editorial content with rich metadata',
      continue_watching: 'Resume where you left off',
      live_now: 'Real-time content happening now',
      starting_soon: 'Upcoming scheduled content',
      because_you_watched: 'AI-powered recommendations',
      new_and_noteworthy: 'Latest releases and trending',
      trending: 'Popular content right now',
      for_you_mosaic: 'Mixed-size discovery grid',
      collections_packs: 'Themed content groupings',
      team_league_hubs: 'Sports team and league coverage',
      highlights_reels: 'Short-form vertical content',
      reels_grid: 'Multi-column short-form layout',
      channel_surf: 'Network and channel browsing',
      expiring_soon: 'Limited-time content',
      people_suggestion: 'Creator and person discovery',
      sponsored_shop: 'Premium and sponsored content'
    };
    return micros[type] || '';
  },

  // Mount rail behaviors (carousel setup, etc.)
  mountRailBehaviors(container, options) {
    // Setup standard carousels
    container.querySelectorAll('.carousel:not(.hero-carousel)').forEach(carousel => {
      this.setupCarousel(carousel);
    });
    
    // Setup hero carousels
    container.querySelectorAll('.hero-carousel').forEach(carousel => {
      this.setupHeroCarousel(carousel);
    });
    
    // Setup auto-advance if enabled
    if (options.autoAdvance) {
      container.querySelectorAll('.carousel:not(.hero-carousel)').forEach(carousel => {
        this.setupRailAutoAdvance(carousel);
      });
    }
    
    // Setup header click logging
    container.querySelectorAll('.row-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('section.row');
        const railType = section?.getAttribute('data-rail') || 'rail';
        if (Console.log) {
          Console.log(`rail_header_click type=${railType}`);
        }
      });
    });
    
    // Apply rail-specific optimizations if available
    if (window.applyRailOptimizations) {
      container.querySelectorAll('section.row').forEach(rail => {
        applyRailOptimizations(rail);
      });
    }
  },

  // Setup carousel interactions
  setupCarousel(carousel) {
    const track = carousel.querySelector('.track');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    const cards = Array.from(carousel.querySelectorAll('.card'));
    
    if (!track) return;
    
    function scrollByCard(dir) {
      const step = Math.max(120, Math.floor(track.clientWidth * 0.9));
      track.scrollBy({ left: dir * step, behavior: 'smooth' });
      if (Console.log) {
        Console.log(`scroll ${dir > 0 ? 'next' : 'prev'} step=${step}`);
      }
    }
    
    // Navigation buttons
    if (prev) prev.addEventListener('click', () => scrollByCard(-1));
    if (next) next.addEventListener('click', () => scrollByCard(1));
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') scrollByCard(1);
      if (e.key === 'ArrowLeft') scrollByCard(-1);
      if (e.key === 'Enter') {
        const first = carousel.querySelector('.card');
        if (first) first.focus();
      }
    });
    
    // Card interactions
    this.setupCardInteractions(carousel);
    
    // Intersection observer for visibility
    this.setupCarouselVisibility(carousel);
  },

  // Setup hero carousel with cycling
  setupHeroCarousel(carousel) {
    const mainContainer = carousel.querySelector('.hero-main-container');
    const thumbsTrack = carousel.querySelector('.hero-thumbs-track');
    
    if (!mainContainer || !thumbsTrack) return;
    
    let currentIndex = 0;
    const cards = Array.from(carousel.querySelectorAll('.card'));
    
    function showCard(index) {
      if (cards.length === 0) return;
      
      currentIndex = (index + cards.length) % cards.length;
      const selected = cards[currentIndex];
      
      // Clone and promote selected thumb to hero-main
      const promoted = selected.cloneNode(true);
      promoted.className = promoted.className
        .replace(/\bhero-thumb\b/g, '')
        .trim();
      if (!/\bhero-main\b/.test(promoted.className)) {
        promoted.className += ' hero-main';
      }
      
      // Render main
      mainContainer.innerHTML = '';
      mainContainer.appendChild(promoted);
      
      // Update thumbnail active state
      cards.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentIndex);
      });
      
      if (Console.log) {
        const title = promoted.querySelector('.meta')?.textContent || 'card';
        Console.log(`hero_cycle index=${currentIndex} title=${title}`);
      }
    }
    
    // Auto-cycle every 5 seconds
    setInterval(() => {
      if (cards.length > 1) {
        showCard(currentIndex + 1);
      }
    }, 5000);
    
    // Thumbnail click to cycle
    thumbsTrack.addEventListener('click', (e) => {
      const thumb = e.target.closest('.card');
      if (thumb) {
        const index = cards.indexOf(thumb);
        showCard(index);
      }
    });
    
    // Show first card
    showCard(0);
  },

  // Setup card interactions
  setupCardInteractions(carousel) {
    carousel.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      
      const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent?.trim() || 'card';
      const railId = card.closest('section.row')?.getAttribute('data-rail-id') || '';
      const railType = card.closest('section.row')?.getAttribute('data-rail') || '';
      
      if (Console.log) {
        Console.log(`card_click_play id=${id}${railId ? ` rail_id=${railId}` : ''}`);
      }
      
      // Navigate to content (placeholder for now)
      this.navigateToContent(id, railType, card);
    });
    
    carousel.addEventListener('focusin', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      
      const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent?.trim() || 'card';
      const railId = card.closest('section.row')?.getAttribute('data-rail-id') || '';
      
      if (Console.log) {
        Console.log(`card_focus id=${id}${railId ? ` rail_id=${railId}` : ''}`);
      }
    });
  },

  // Setup carousel visibility tracking
  setupCarouselVisibility(carousel) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const title = entry.target.querySelector('.meta')?.textContent || 'card';
          if (Console.log) {
            Console.log(`visible: ${title.trim()}`);
          }
        }
      });
    });
    
    carousel.querySelectorAll('.card').forEach(card => io.observe(card));
  },

  // Setup rail auto-advance
  setupRailAutoAdvance(carousel) {
    const track = carousel.querySelector('.track');
    if (!track) return;
    
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
      autoAdvanceInterval = setInterval(() => {
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }, 8000);
    }
    
    function stopAutoAdvance() {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
    }
    
    // Start auto-advance
    startAutoAdvance();
    
    // Pause on hover/focus
    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('focusin', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);
    carousel.addEventListener('focusout', startAutoAdvance);
  },

  // Render countdowns for time-sensitive content
  renderCountdowns(container) {
    const countdownElements = container.querySelectorAll('[data-start]');
    
    countdownElements.forEach(element => {
      const startTime = new Date(element.getAttribute('data-start'));
      
      function updateCountdown() {
        const now = new Date();
        const diff = startTime - now;
        
        if (diff <= 0) {
          element.textContent = 'Starting now';
          element.classList.add('live');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (hours > 0) {
            element.textContent = `Starts in ${hours}h ${minutes}m`;
          } else if (minutes > 0) {
            element.textContent = `Starts in ${minutes}m ${seconds}s`;
          } else {
            element.textContent = `Starts in ${seconds}s`;
          }
        }
      }
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    });
  },

  // Inject purpose information
  injectPurpose(container, meta) {
    if (!meta.purpose && !meta.rationale) return;
    
    const panel = document.createElement('div');
    panel.className = 'panel purpose';
    panel.innerHTML = `
      <div class="purpose-block">
        <div class="purpose-title">Purpose</div>
        <p>${meta.purpose || ''}</p>
        <div class="purpose-title">Rationale</div>
        <p>${meta.rationale || ''}</p>
      </div>`;
    
    container.insertBefore(panel, container.firstChild);
  },

  // Observe rails visibility for analytics
  observeRailsVisibility(container) {
    const railSections = container.querySelectorAll('section.row');
    
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const railType = entry.target.getAttribute('data-rail');
          const railId = entry.target.getAttribute('data-rail-id');
          
          if (Console.log) {
            Console.log(`rail_visible type=${railType} id=${railId}`);
          }
        }
      });
    }, { threshold: 0.1 });
    
    railSections.forEach(section => io.observe(section));
  },

  // Setup analytics tracking
  setupAnalytics() {
    // Track page views
    if (Console.log) {
      Console.log(`page_view title=${document.title} url=${window.location.href}`);
    }
    
    // Track user interactions
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.matches('button, .card, .nav')) {
        const action = target.textContent || target.className || 'click';
        if (Console.log) {
          Console.log(`user_interaction action=${action} target=${target.tagName.toLowerCase()}`);
        }
      }
    });
  },

  // Navigate to content (placeholder for end-to-end journeys)
  navigateToContent(id, railType, card) {
    // This would integrate with your navigation system
    console.log(`Navigate to: ${id} from rail: ${railType}`);
    
    // For demo purposes, show a simple alert
    const title = card.querySelector('.meta')?.textContent || 'Content';
    alert(`Navigating to: ${title}\n\nThis would open the content player or detail page in a real implementation.`);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoTemplate;
} else {
  // Browser global
  window.DemoTemplate = DemoTemplate;
}
