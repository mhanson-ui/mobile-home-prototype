// MobileHomeProto V1 - Modular Application
// Uses extracted components: rail-engine.js, feature-toggles.js, demo-template.js

// Enhanced debug panel for main experiences
const Console = (()=>{
  let el;
  let isVisible = true;
  function init(){
    if (el) return;
    el = document.createElement('div');
    el.className = 'debug-panel';
    el.innerHTML = `
      <div class="debug-header">
        <h3>🔧 Debug Panel</h3>
        <button class="debug-toggle" onclick="Console.toggle()">−</button>
      </div>
      <div class="debug-content">
        <div class="debug-stats">
          <div class="stat">Rails: <span id="rail-count">0</span></div>
          <div class="stat">Events: <span id="event-count">0</span></div>
          <div class="stat">Dedupes: <span id="dedupe-count">0</span></div>
        </div>
        <div class="log"></div>
      </div>`;
    document.body.appendChild(el);
  }
  function log(msg){ 
    if (!el) return; // Guard against uninitialized debug panel
    const log = el.querySelector('.log'); 
    if (!log) return;
    const line = '['+new Date().toLocaleTimeString()+'] '+msg+'\n'; 
    log.textContent += line; 
    log.scrollTop = log.scrollHeight;
    
    // Update event counter
    const eventCount = el.querySelector('#event-count');
    if (eventCount) eventCount.textContent = parseInt(eventCount.textContent) + 1;
  }
  function toggle(){
    isVisible = !isVisible;
    const content = el.querySelector('.debug-content');
    const toggle = el.querySelector('.debug-toggle');
    content.style.display = isVisible ? 'block' : 'none';
    toggle.textContent = isVisible ? '−' : '+';
  }
  function updateStats(rails, dedupes){
    if (!el) return; // Guard against uninitialized debug panel
    const railCount = el.querySelector('#rail-count');
    const dedupeCount = el.querySelector('#dedupe-count');
    if (railCount) railCount.textContent = rails || 0;
    if (dedupeCount) dedupeCount.textContent = dedupes || 0;
  }
  return { init, log, toggle, updateStats };
})();

// Enhanced DVR Controls for catch-up-to-live functionality
const DVRControls = {
  createPlayer: (container, isLive = false, options = {}) => {
    const currentTime = options.currentTime || '1:23:45';
    const totalTime = options.totalTime || '2:30:00';
    const progress = options.progress || 35;
    const isPlaying = options.isPlaying !== false;
    
    const playerHTML = `
      <div class="video-player" data-live="${isLive}" data-playing="${isPlaying}">
        <div class="video-screen">
          <div class="play-button" style="display:${isPlaying ? 'none' : 'flex'}">▶</div>
          ${isLive ? '<div class="live-indicator">🔴 LIVE</div>' : ''}
          <div class="video-overlay">
            <div class="overlay-controls">
              <button class="overlay-btn rewind-10">↶ 10s</button>
              <button class="overlay-btn play-pause-big">${isPlaying ? '⏸' : '▶'}</button>
              <button class="overlay-btn forward-10">10s ↷</button>
            </div>
          </div>
        </div>
        <div class="video-controls">
          <button class="control-btn rewind" title="Rewind">⏪</button>
          <button class="control-btn play-pause" title="${isPlaying ? 'Pause' : 'Play'}">${isPlaying ? '⏸' : '▶'}</button>
          <button class="control-btn fast-forward" title="Fast Forward">⏩</button>
          <div class="timeline">
            <div class="timeline-bar" data-progress="${progress}">
              <div class="progress-bar" style="width: ${progress}%"></div>
              <div class="playhead" style="left: ${progress}%"></div>
            </div>
            <div class="time-display">${currentTime} / ${totalTime}</div>
          </div>
          ${isLive ? '<button class="jump-to-live" title="Jump to Live">🔴 LIVE</button>' : ''}
          <div class="view-options">
            <button class="control-btn multi-cam" title="Camera Angles">📹</button>
            <button class="control-btn audio-options" title="Audio Options">🔊</button>
            <button class="control-btn captions" title="Captions">CC</button>
            <button class="control-btn fullscreen" title="Fullscreen">⛶</button>
          </div>
        </div>
      </div>`;
    container.innerHTML = playerHTML;
    
    const player = container.querySelector('.video-player');
    setupDVRInteractions(player, isLive);
    return player;
  }
};

// DVR interaction setup
function setupDVRInteractions(player, isLive) {
  const playPause = player.querySelector('.play-pause');
  const playPauseBig = player.querySelector('.play-pause-big');
  const playButton = player.querySelector('.play-button');
  const rewind = player.querySelector('.rewind');
  const fastForward = player.querySelector('.fast-forward');
  const jumpToLive = player.querySelector('.jump-to-live');
  const timelineBar = player.querySelector('.timeline-bar');
  const progressBar = player.querySelector('.progress-bar');
  const playhead = player.querySelector('.playhead');
  const timeDisplay = player.querySelector('.time-display');
  
  let isPlaying = player.getAttribute('data-playing') === 'true';
  let currentProgress = parseInt(timelineBar?.getAttribute('data-progress') || '35');
  
  function updatePlayState(playing) {
    isPlaying = playing;
    player.setAttribute('data-playing', playing);
    playPause.textContent = playing ? '⏸' : '▶';
    playPause.title = playing ? 'Pause' : 'Play';
    if (playPauseBig) playPauseBig.textContent = playing ? '⏸' : '▶';
    if (playButton) playButton.style.display = playing ? 'none' : 'flex';
    
    if (FeatureToggles.isEnabled('analytics')) Console.log('dvr_play_pause playing='+playing);
  }
  
  function updateProgress(progress) {
    currentProgress = Math.max(0, Math.min(100, progress));
    progressBar.style.width = currentProgress + '%';
    playhead.style.left = currentProgress + '%';
    
    // Update time display based on progress
    const totalSeconds = 2.5 * 3600; // 2:30:00 in seconds
    const currentSeconds = Math.floor((currentProgress / 100) * totalSeconds);
    const hours = Math.floor(currentSeconds / 3600);
    const minutes = Math.floor((currentSeconds % 3600) / 60);
    const seconds = currentSeconds % 60;
    
    const currentTimeStr = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeDisplay.textContent = `${currentTimeStr} / ${totalTime}`;
  }
  
  // Play/Pause functionality
  [playPause, playPauseBig, playButton].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => updatePlayState(!isPlaying));
    }
  });
  
  // Rewind/Fast Forward
  if (rewind) {
    rewind.addEventListener('click', () => {
      const newProgress = Math.max(0, currentProgress - 10);
      updateProgress(newProgress);
      if (FeatureToggles.isEnabled('analytics')) Console.log('dvr_rewind_10s');
    });
  }
  
  if (fastForward) {
    fastForward.addEventListener('click', () => {
      const newProgress = Math.min(100, currentProgress + 10);
      updateProgress(newProgress);
      if (FeatureToggles.isEnabled('analytics')) Console.log('dvr_fast_forward_10s');
    });
  }
  
  // Jump to Live
  if (jumpToLive && isLive) {
    jumpToLive.addEventListener('click', () => {
      updateProgress(100);
      if (FeatureToggles.isEnabled('analytics')) Console.log('dvr_jump_to_live');
    });
  }
  
  // Timeline scrubbing
  if (timelineBar) {
    timelineBar.addEventListener('click', (e) => {
      const rect = timelineBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      updateProgress(newProgress);
      if (FeatureToggles.isEnabled('analytics')) Console.log('dvr_timeline_scrub progress='+Math.round(newProgress));
    });
  }
}

// Content navigation and end-to-end journeys
function navigateToContent(id, railType, card) {
  const title = card.querySelector('.meta')?.textContent || 'Content';
  const railId = card.closest('section.row')?.getAttribute('data-rail-id') || '';
  
  if (FeatureToggles.isEnabled('analytics')) {
    Console.log(`navigate_to_content id=${id} rail_type=${railType} rail_id=${railId}`);
  }
  
  // Determine navigation target based on rail type
  let target = 'content-player';
  
  switch (railType) {
    case 'hero_spotlight':
    case 'editorial_hero':
      target = 'hero-content';
      break;
    case 'continue_watching':
      target = 'resume-player';
      break;
    case 'live_now':
      target = 'live-player';
      break;
    case 'starting_soon':
      target = 'schedule';
      break;
    case 'collections_packs':
    case 'team_league_hubs':
      target = 'collection-hub';
      break;
    case 'sponsored_shop':
      target = 'shop';
      break;
    default:
      target = 'content-player';
  }
  
  // For demo purposes, show navigation info
  const message = `Navigating to: ${title}\n\nTarget: ${target}\nRail: ${railType}\n\nThis would open the appropriate page/player in a real implementation.`;
  
  // Check if we're in a demo context
  if (window.location.pathname.includes('/demos/')) {
    alert(message);
  } else {
    // In main experience, could trigger actual navigation
    console.log(message);
    
    // Simulate navigation delay
    setTimeout(() => {
      if (FeatureToggles.isEnabled('analytics')) {
        Console.log(`navigation_complete target=${target} id=${id}`);
      }
    }, 100);
  }
}

// Preview functionality for enhanced interactions
function startPreview(card, railType) {
  if (!FeatureToggles.isEnabled('previews')) return;
  
  const title = card.querySelector('.meta')?.textContent || 'Content';
  card.style.outline = '3px solid #4a90e2';
  
  if (FeatureToggles.isEnabled('analytics')) {
    Console.log(`preview_start rail_type=${railType} title=${title}`);
  }
  
  // Add preview content or animation
  card.classList.add('preview-active');
}

function stopPreview(card) {
  if (!FeatureToggles.isEnabled('previews')) return;
  
  card.style.outline = '2px solid #000';
  card.classList.remove('preview-active');
}

// Main rendering function for backward compatibility
function renderHomeFromJSON(json) {
  const main = document.querySelector('main');
  if (!main) {
    console.error('No main element found');
    return;
  }
  
  // Use the modular template system
  if (window.DemoTemplate) {
    DemoTemplate.renderRails(json, main, {
      showPurpose: true,
      autoAdvance: FeatureToggles.isEnabled('autoAdvance'),
      dedupe: FeatureToggles.isEnabled('ownership'),
      viewportAware: true
    });
  } else {
    // Fallback to legacy rendering
    console.warn('DemoTemplate not available, using legacy rendering');
    renderRailsFromData(json, main);
  }
}

// Legacy rendering function (kept for backward compatibility)
function renderRailsFromData(json, container) {
  if (!window.RailEngine) {
    console.error('RailEngine not available');
    return;
  }
  
  const rails = RailEngine.sortRailsByPriority(json.rails || []);
  
  // Basic HTML rendering (simplified)
  const html = rails.map(rail => {
    const config = RailEngine.getRailConfig(rail.type);
    const railId = `rail_${rail.type}_${Date.now()}`;
    const headerId = `header_${railId}`;
    
    const label = rail.label || rail.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cards = rail.items.map((item, idx) => `
      <div class="card" data-id="${item.id || `item_${idx}`}" data-rail-type="${rail.type}" tabindex="0">
        <div class="card-image">
          <img src="${item.image || `https://picsum.photos/seed/${item.id || idx}/480/270`}" alt="${item.title || 'Content'}" loading="lazy">
        </div>
        <div class="card-content">
          <div class="meta">${item.title || 'Untitled'}</div>
        </div>
      </div>
    `).join('');
    
    return `
    <section class="row" data-rail="${rail.type}" data-rail-id="${railId}" style="--rail-accent:${config.accent}">
      <div class="row-header">
        <h2 id="${headerId}">${label}</h2>
      </div>
      <div class="carousel">
        <div class="track">${cards}</div>
      </div>
    </section>`;
  }).join('');
  
  container.innerHTML = html;
  
  // Setup basic interactions
  container.querySelectorAll('.carousel').forEach(carousel => {
    setupBasicCarousel(carousel);
  });
  
  // Apply deduplication if enabled
  if (FeatureToggles.isEnabled('ownership')) {
    const dedupeCount = RailEngine.applyOwnershipDedupe(container);
    if (Console.updateStats) {
      Console.updateStats(rails.length, dedupeCount);
    }
  }
}

// Basic carousel setup for legacy support
function setupBasicCarousel(carousel) {
  const track = carousel.querySelector('.track');
  if (!track) return;
  
  // Basic keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      track.scrollBy({ left: 200, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      track.scrollBy({ left: -200, behavior: 'smooth' });
    }
  });
  
  // Basic click handling
  carousel.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
      const id = card.getAttribute('data-id');
      const railType = card.closest('section.row')?.getAttribute('data-rail') || '';
      navigateToContent(id, railType, card);
    }
  });
}

// Initialize the application
function initApp() {
  // Initialize debug panel
  Console.init();
  
  // Initialize feature toggles
  if (window.FeatureToggles) {
    FeatureToggles.mount();
  }
  
  // Log app initialization
  if (FeatureToggles.isEnabled('analytics')) {
    Console.log('app_initialized version=modular');
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Console,
    DVRControls,
    navigateToContent,
    renderHomeFromJSON,
    renderRailsFromData,
    initApp
  };
} else {
  // Browser global
  window.renderHomeFromJSON = renderHomeFromJSON;
  window.renderRailsFromData = renderRailsFromData;
  window.initApp = initApp;
}
