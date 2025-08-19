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
    const log = el.querySelector('.log'); 
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
    const railCount = el.querySelector('#rail-count');
    const dedupeCount = el.querySelector('#dedupe-count');
    if (railCount) railCount.textContent = rails || 0;
    if (dedupeCount) dedupeCount.textContent = dedupes || 0;
  }
  return { init, log, toggle, updateStats };
})();

// Feature toggles (dedupe, previews, analytics)
const Toggles = (()=>{
  const state = { dedupe:false, previews:false, analytics:true, ownership:true, ticker:false };
  function mount(){
    if (document.querySelector('.togglebar')) return;
    const bar = document.createElement('div');
    bar.className = 'panel togglebar';
    bar.innerHTML = `
      <label><input type="checkbox" id="tg-dedupe"> viewport-aware de-dup (demo)</label>
      <label><input type="checkbox" id="tg-previews"> preview-on-focus (demo)</label>
      <label><input type="checkbox" id="tg-analytics" checked> metrics console</label>
      <label><input type="checkbox" id="tg-ownership" checked> ownership de-dup (cross-rail)</label>
      <label><input type="checkbox" id="tg-ticker"> auto-ticker for Live Now</label>
    `;
    const target = document.querySelector('header') || document.querySelector('main') || document.body;
    target.appendChild(bar);
    bar.querySelector('#tg-dedupe').addEventListener('change', e => state.dedupe = e.target.checked);
    bar.querySelector('#tg-previews').addEventListener('change', e => state.previews = e.target.checked);
    bar.querySelector('#tg-analytics').addEventListener('change', e => state.analytics = e.target.checked);
    bar.querySelector('#tg-ownership').addEventListener('change', e => state.ownership = e.target.checked);
    bar.querySelector('#tg-ticker').addEventListener('change', e => state.ticker = e.target.checked);
  }
  return { mount, state };
})();

// Rail tokens (visual + behavioral) with varying heights based on content priority
// Five User Intent Paradigms: Continue, Discover, Explore, Decide, Upsell
const RailTokens = {
  // 1. CONTINUE → UTILITY CAROUSEL: Resume watching, shortcuts, ongoing engagement
  continue_watching: { intent: 'continue', silhouette: 'large', accent: '#4a90e2', motion: 'off', cta: 'Resume', height: 'xl', priority: 1 },
  live_now: { intent: 'continue', silhouette: 'landscape', accent: '#4a90e2', motion: 'ticker', cta: 'Watch Live', height: 'l', priority: 2 },
  starting_soon: { intent: 'continue', silhouette: 'landscape', accent: '#4a90e2', motion: 'countdown', cta: 'Notify', height: 'l', priority: 3 },
  
  // 2. DISCOVER → DISCOVERY CAROUSEL: Smaller, faster-browse tiles for scanning and finding new content
  for_you_mosaic: { intent: 'discover', silhouette: 'mosaic', accent: '#9333ea', motion: 'quick', cta: 'Play', height: 'variable', priority: 4 },
  new_and_noteworthy: { intent: 'discover', silhouette: 'thumbnail', accent: '#9333ea', motion: 'quick', cta: 'Play', height: 'm', priority: 6 },
  trending: { intent: 'discover', silhouette: 'thumbnail', accent: '#9333ea', motion: 'quick', cta: 'Play', height: 'm', priority: 7 },
  channel_surf: { intent: 'discover', silhouette: 'square', accent: '#9333ea', motion: 'quick', cta: 'Watch', height: 's', priority: 11 },
  expiring_soon: { intent: 'discover', silhouette: 'thumbnail', accent: '#9333ea', motion: 'quick', cta: 'Play', height: 'm', priority: 12 },
  people_suggestion: { intent: 'discover', silhouette: 'circle', accent: '#9333ea', motion: 'quick', cta: 'Follow', height: 'm', priority: 13 },
  
  // 3. EXPLORE → CURATED SETS AND THEMES: Grouped by theme, mood, or pack for diving into particular areas
  collections_packs: { intent: 'explore', silhouette: 'stack', accent: '#059669', motion: 'hover', cta: 'Explore', height: 'l', priority: 8 },
  team_league_hubs: { intent: 'explore', silhouette: 'large', accent: '#059669', motion: 'hover', cta: 'Explore Hub', height: 'l', priority: 8 },
  
  // 4. DECIDE → HERO CAROUSEL: Oversized, motion-rich cards with presence and context for picking one thing
  hero_spotlight: { intent: 'decide', silhouette: 'hero', accent: '#dc2626', motion: 'preview', cta: 'Watch Now', height: 'xxl', priority: 0 },
  editorial_hero: { intent: 'decide', silhouette: 'editorial', accent: '#dc2626', motion: 'preview', cta: 'Read More', height: 'xl', priority: 1 },
  
  // 5. UPSELL → EDITORIAL CAROUSEL: Curated blends for nudging toward premium, add-ons, cross-sell
  because_you_watched: { intent: 'upsell', silhouette: 'mixed', accent: '#ea580c', motion: 'focus', cta: 'Watch Similar', height: 'l', priority: 5 },
  highlights_reels: { intent: 'upsell', silhouette: 'poster', accent: '#ea580c', motion: 'focus', cta: 'Watch Full Game', height: 'xl', priority: 9 },
  reels_grid: { intent: 'upsell', silhouette: 'grid', accent: '#ea580c', motion: 'focus', cta: 'See More Reels', height: 'xl', priority: 10 },
  sponsored_shop: { intent: 'upsell', silhouette: 'product', accent: '#ea580c', motion: 'hover', cta: 'Shop Now', height: 'l', priority: 14 }
};

// Chips/Filters system for metadata-driven discovery
const ChipSystem = {
  sports: ['Live', 'Highlights', 'Full Game', 'Team', 'League', 'Player'],
  content: ['New', 'Trending', 'Award Winner', '4K', 'HDR', 'Expiring'],
  genre: ['Action', 'Drama', 'Comedy', 'Documentary', 'Sports', 'News'],
  time: ['Under 30min', '30-60min', '1-2hrs', '2hrs+'],
  rating: ['G', 'PG', 'PG-13', 'R', 'TV-MA'],
  quality: ['HD', '4K', 'HDR', 'Dolby Vision']
};

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
    
    if (Toggles.state.analytics) Console.log('dvr_play_pause playing='+playing);
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
    const currentTime = `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    timeDisplay.textContent = `${currentTime} / 2:30:00`;
    
    if (Toggles.state.analytics) Console.log('dvr_seek progress='+currentProgress);
  }
  
  // Play/pause interactions
  [playPause, playPauseBig, playButton].forEach(btn => {
    if (btn) btn.addEventListener('click', () => updatePlayState(!isPlaying));
  });
  
  // Rewind/fast-forward
  rewind?.addEventListener('click', () => {
    updateProgress(currentProgress - 10);
    if (Toggles.state.analytics) Console.log('dvr_rewind');
  });
  
  fastForward?.addEventListener('click', () => {
    updateProgress(currentProgress + 10);
    if (Toggles.state.analytics) Console.log('dvr_fast_forward');
  });
  
  // Jump to live (for live content)
  jumpToLive?.addEventListener('click', () => {
    updateProgress(100);
    updatePlayState(true);
    if (Toggles.state.analytics) Console.log('dvr_jump_to_live');
  });
  
  // Timeline scrubbing
  timelineBar?.addEventListener('click', (e) => {
    const rect = timelineBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    updateProgress(newProgress);
  });
  
  // Multi-cam and audio options
  player.querySelector('.multi-cam')?.addEventListener('click', () => {
    if (Toggles.state.analytics) Console.log('dvr_multi_cam_open');
    // In real app, would open camera selection
  });
  
  player.querySelector('.audio-options')?.addEventListener('click', () => {
    if (Toggles.state.analytics) Console.log('dvr_audio_options_open');
    // In real app, would open audio track selection
  });
}

// Microcopy per rail type
const RailMicrocopy = {
  continue_watching: 'Pick up where you left off',
  live_now: 'Happening right now',
  starting_soon: 'Countdown to start',
  for_you_mosaic: 'Personalized for you',
  because_you_watched: (rail)=>`Shows like${rail?.seed?` ${rail.seed}`:''}`,
  new_and_noteworthy: 'Just added and trending',
  trending: 'Popular near you',
  collections_packs: 'Curated sets and themes',
  highlights_reels: 'Short-form highlights',
  channel_surf: 'Browse channels',
  expiring_soon: 'Leaving soon',
  editorial_hero: (rail)=> rail?.label || 'Featured editorial',
  hero_spotlight: 'Spotlight',
  people_suggestion: 'Suggested profiles',
  sponsored_shop: 'Shop now',
  reels_grid: 'Scroll to explore'
};

let __rowIdCounter = 0;

// Chip priority system - most important chip per content type
function getMostImportantChip(chips, railType) {
  const chipPriority = {
    // Live content prioritizes state
    live_now: ['Live', 'LIVE', 'Betting', 'Multi-Cam', '4K', 'HD', 'NBA', 'NFL', 'Tennis'],
    // Starting soon prioritizes timing
    starting_soon: ['Soon', 'Starting', 'Notify', 'Upcoming', 'Live'],
    // New content prioritizes freshness
    new_and_noteworthy: ['NEW', 'Just Added', 'Fresh', 'Latest', 'Award Winner'],
    // Trending prioritizes social proof
    trending: ['Trending', 'Popular', 'Hot', 'Viral', '#1'],
    // Highlights prioritize moment significance
    highlights_reels: ['Clutch', 'Game Winner', 'Buzzer Beater', 'Top Play', 'Highlights'],
    // Quality content prioritizes technical specs
    for_you_mosaic: ['4K', 'HDR', 'HD', 'Award Winner', 'New'],
    // Commerce prioritizes urgency/value
    sponsored_shop: ['Limited', 'Sale', 'New', 'Exclusive', 'Free Shipping'],
    // People prioritize social context
    people_suggestion: ['Verified', 'Popular', 'New', 'Trending'],
    // Default priority for other rails
    default: ['Live', 'NEW', '4K', 'HDR', 'HD', 'Trending', 'Popular']
  };
  
  const priorities = chipPriority[railType] || chipPriority.default;
  
  // Find the highest priority chip that exists in the item's chips
  for (const priorityChip of priorities) {
    const found = chips.find(chip => 
      String(chip).toLowerCase().includes(priorityChip.toLowerCase()) ||
      priorityChip.toLowerCase().includes(String(chip).toLowerCase())
    );
    if (found) return found;
  }
  
  // Fallback to first chip if no priority match
  return chips[0];
}

// Purpose/rationale copy per prototype (by title/rail) - Human language focused on impact
const PurposeCopy = {
  'Balanced Demo (Mock JSON)': {
    purpose: 'Demonstrate the five user intent paradigms: Continue, Discover, Explore, Decide, and Upsell through differentiated carousel design.',
    rationale: 'Users have different intents when browsing content. This demo shows how carousel design can support each intent: utility for continuing, discovery for scanning, curated sets and themes for exploring, heroes for deciding, and editorial for upselling.'
  },
  'Sports Demo (Mock JSON)': {
    purpose: 'Show how the five intent paradigms optimize sports content: Continue with live games, Discover highlights, Explore team hubs, Decide on featured games, Upsell premium features.',
    rationale: 'Sports fans have specific intent patterns: continuing live action, discovering quick highlights, exploring team content, deciding on featured games, and being upsold to premium sports packages and multi-cam experiences.'
  },
  'Hero Spotlight': { 
    purpose: 'DECIDE → HERO CAROUSEL: Help users pick one thing with oversized, motion-rich cards providing presence and context.', 
    rationale: 'When users need to decide what to watch, they need enough visual presence and context to commit. Large format with preview motion gives them confidence to choose.' 
  },
  'Continue Watching': { 
    purpose: 'CONTINUE → UTILITY CAROUSEL: Enable resume watching and ongoing engagement with shortcuts and progress indicators.', 
    rationale: 'Users want to continue their viewing journey without friction. Clear progress indicators and Resume shortcuts maintain ongoing engagement and prevent abandonment.' 
  },
  'Live Now': { 
    purpose: 'CONTINUE → UTILITY CAROUSEL: Enable ongoing engagement with live content through real-time shortcuts and ticker motion.', 
    rationale: 'Users want to continue engaging with live events without missing anything. LIVE badges and ticker motion create urgency and provide immediate access to ongoing content.' 
  },
  'Starting Soon': { 
    purpose: 'Show upcoming events with clear countdown timers so users can plan ahead.', 
    rationale: 'When users can\'t tell when something starts, they either miss it or check back repeatedly. Countdown timers reduce anxiety and let users set reminders or come back at the right time.' 
  },
  'For You Mosaic': { 
    purpose: 'DISCOVER → DISCOVERY CAROUSEL: Enable scanning and finding new content through smaller, faster-browse tiles.', 
    rationale: 'Users in discovery mode want to scan quickly to find something new. Smaller tiles with varied layouts encourage rapid browsing and serendipitous discovery.' 
  },
  'Because You Watched': { 
    purpose: 'UPSELL → EDITORIAL CAROUSEL: Nudge toward premium content and cross-sell through curated blends and recommendations.', 
    rationale: 'Users trust curated recommendations that explain the connection. "Because you watched X" creates upsell opportunities by building on existing engagement and suggesting premium or related content.' 
  },
  'New & Noteworthy': { 
    purpose: 'DISCOVER → DISCOVERY CAROUSEL: Enable scanning for fresh content through smaller tiles optimized for finding something new.', 
    rationale: 'Users in discovery mode want to quickly find fresh content they haven\'t seen. Smaller tiles with NEW badges enable rapid scanning and serendipitous discovery of recent additions.' 
  },
  'Trending Near You': { 
    purpose: 'Use social proof to help users discover what\'s popular in their area.', 
    rationale: 'People want to watch what others are talking about, but generic popularity lists feel impersonal. Location-aware trending makes recommendations feel more relevant and creates FOMO.' 
  },
  'Collections & Packs': { 
    purpose: 'EXPLORE → CURATED SETS AND THEMES: Help users dive into particular areas through theme, mood, or pack groupings.', 
    rationale: 'Users want to explore specific topics deeply rather than browse randomly. Curated sets and themes like "Championship Road" create focused exploration paths that encourage binge viewing.' 
  },
  'Highlights & Reels': { 
    purpose: 'UPSELL → EDITORIAL CAROUSEL: Nudge toward full game viewing and premium sports packages through curated highlight storytelling.', 
    rationale: 'Curated "clutch moments" create desire for the full experience. Editorial focus on premium moments drives upsell to full games, premium sports packages, and multi-cam viewing options.' 
  },
  'Channel Surf': { 
    purpose: 'Let users browse channels quickly like flipping through TV, but smarter.', 
    rationale: 'Traditional channel guides are overwhelming. Logo chips with live/next previews recreate the familiar TV surfing experience while showing what\'s actually worth watching.' 
  },
  'Expiring Soon': { 
    purpose: 'Create urgency around content that\'s about to disappear.', 
    rationale: 'Users often discover great content right before it leaves the platform. Clear expiration dates and EXP badges help users prioritize what to watch now vs. what can wait.' 
  },
  'Editorial Hero': { 
    purpose: 'Showcase curated editorial content with clear section context.', 
    rationale: 'Users trust editorial recommendations more when they understand the source. Apple News-style section labels like "Food" or "Sports" help users quickly identify content that matches their interests.' 
  },
  'People Suggestion': { 
    purpose: 'Help users discover creators and personalities they might want to follow.', 
    rationale: 'Mixing people and content in the same rails confuses users about whether to watch or follow. Dedicated people rails with social proof ("Followed by 5 friends") make discovery feel more trustworthy.' 
  },
  'Sponsored Shop': { 
    purpose: 'Integrate commerce naturally without disrupting the content experience.', 
    rationale: 'Poorly integrated ads feel intrusive and get ignored. Product rails that match the content aesthetic but use clear "Shop Now" CTAs feel less disruptive while driving commerce engagement.' 
  },
  'Reels Grid': { 
    purpose: 'Offer an alternative to horizontal scrolling with vertical, grid-based exploration.', 
    rationale: 'Endless horizontal scrolling causes fatigue and makes users feel like they\'re not making progress. A 3-up vertical grid provides a different browsing rhythm and helps users feel like they\'re exploring more efficiently.' 
  }
};

function injectPurpose(container, meta){
  // Skip purpose injection for main experiences (Balanced/Sports demos)
  const isMainExperience = document.title.includes('Balanced Demo') || document.title.includes('Sports Demo');
  if (isMainExperience) return;
  
  const main = container;
  const existing = main.querySelector('.panel.purpose');
  if (existing) return;
  let purpose = meta?.purpose || '';
  let rationale = meta?.rationale || '';
  if(!purpose || !rationale){
    const title = document.querySelector('header h1')?.textContent?.trim();
    if (title && PurposeCopy[title]){
      purpose = purpose || PurposeCopy[title].purpose;
      rationale = rationale || PurposeCopy[title].rationale;
    } else if (document.querySelector('.row-header h2')){
      const railTitle = document.querySelector('.row-header h2').textContent.trim();
      if (PurposeCopy[railTitle]){
        purpose = purpose || PurposeCopy[railTitle].purpose;
        rationale = rationale || PurposeCopy[railTitle].rationale;
      }
    }
  }
  if(!purpose && !rationale) return;
  const panel = document.createElement('div');
  panel.className = 'panel purpose';
  panel.innerHTML = `
    <div class="purpose-block">
      <div class="purpose-title">Purpose</div>
      <p>${purpose || ''}</p>
      <div class="purpose-title">Rationale</div>
      <p>${rationale || ''}</p>
    </div>`;
  main.insertBefore(panel, main.firstChild);
}

function setupCarousel(root){
  const track = root.querySelector('.track');
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  const cards = Array.from(root.querySelectorAll('.card'));

  function scrollByCard(dir){
    const step = Math.max(120, Math.floor(track.clientWidth * 0.9));
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
    Console.log('scroll '+(dir>0?'next':'prev')+` step=${step}`);
  }
  prev?.addEventListener('click', ()=>scrollByCard(-1));
  next?.addEventListener('click', ()=>scrollByCard(1));

  // Keyboard
  root.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight'){ scrollByCard(1); }
    if(e.key==='ArrowLeft'){ scrollByCard(-1); }
    if(e.key==='Enter'){ Console.log('enter on card'); }
  });

  // Focus helpers: Enter on carousel focuses first card
  root.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' && e.target === root.querySelector('.carousel')){
      const first = root.querySelector('.card');
      if(first) first.focus();
    }
  });

  // Click/focus instrumentation with end-to-end navigation
  root.addEventListener('click', (e)=>{
    const card = e.target.closest('.card');
    if(!card) return;
    const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent?.trim() || 'card';
    const railId = card.closest('section.row')?.getAttribute('data-rail-id') || '';
    const railType = card.closest('section.row')?.getAttribute('data-rail') || '';
    
    if (Toggles.state.analytics) Console.log('card_click_play id='+id+(railId?(' rail_id='+railId):''));
    
    // Navigate to appropriate page based on rail type and content
    navigateToContent(id, railType, card);
  });
  root.addEventListener('focusin', (e)=>{
    const card = e.target.closest('.card');
    if(!card) return;
    const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent?.trim() || 'card';
    const railId = card.closest('section.row')?.getAttribute('data-rail-id') || '';
    const railType = card.getAttribute('data-rail-type') || '';
    
    if (Toggles.state.analytics) Console.log('card_focus id='+id+(railId?(' rail_id='+railId):''));
    
    // Preview functionality for Hero, Trending, Reels
    if (card.hasAttribute('data-preview') && Toggles.state.previews) {
      startPreview(card, railType);
    }
  });
  
  root.addEventListener('focusout', (e)=>{
    const card = e.target.closest('.card');
    if(!card) return;
    stopPreview(card);
  });

  // IntersectionObserver to simulate viewport-aware behavior + dedupe demo
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const t = en.target.querySelector('.meta')?.textContent || 'card';
        if (Toggles.state.analytics) Console.log('visible: '+t.trim());
        // preview demo
        if (Toggles.state.previews){
          en.target.style.outline = '3px solid #4a90e2';
          setTimeout(()=> en.target.style.outline='2px solid #000', 400);
        }
      }
    });
  }, { root: track, threshold: .9 });
  cards.forEach(c=>io.observe(c));

  // Deduplicate demo: if two cards share same label within view, suppress the later ones
  function dedupeWithinView(){
    if(!Toggles.state.dedupe){ cards.forEach(c=>c.classList.remove('suppressed')); return; }
    const seen = new Set();
    cards.forEach(c=>{
      const label = c.querySelector('.meta')?.textContent.trim();
      if(seen.has(label)) c.classList.add('suppressed');
      else c.classList.remove('suppressed'), seen.add(label);
    });
  }
  // run on toggle and on scroll
  track.addEventListener('scroll', ()=>{ if (Toggles.state.dedupe) dedupeWithinView(); });
  document.addEventListener('change', (e)=>{
    if (e.target && (e.target.id==='tg-dedupe')) dedupeWithinView();
  });

  // Optional auto-ticker for rails that opt in
  const isTicker = root.hasAttribute('data-ticker');
  let tickerInterval;
  function startTicker(){
    if(!isTicker) return;
    stopTicker();
    if(!Toggles.state.ticker) return;
    tickerInterval = setInterval(()=> scrollByCard(1), 2500);
  }
  function stopTicker(){ if(tickerInterval) clearInterval(tickerInterval); }
  root.addEventListener('mouseenter', stopTicker);
  root.addEventListener('mouseleave', startTicker);
  startTicker();
}

function makeRow(title, cls='card', count=8, opts={}){
  const cardHTML = Array.from({length:count}, (_,i)=>{
    const live = opts.live ? '<div class="badge-live">LIVE</div>' : '';
    const prog = opts.progress ? `<div class="progress" style="width:${(i+1)*8}%"></div>` : '';
    return `<div class="${cls}" tabindex="0">${live}<div class="meta">${title} #${i+1}</div>${prog}</div>`;
  }).join('');
  return `
  <section class="row" tabindex="-1">
    <div class="row-header"><h2>${title}</h2></div>
    <div class="carousel" tabindex="0">
      <button class="nav prev" aria-label="Prev">◀</button>
      <button class="nav next" aria-label="Next">▶</button>
      <div class="track">${cardHTML}</div>
    </div>
  </section>`;
}

// ------- Data-driven rendering (balanced/sports home demos) -------

const RailPriority = {
  // Hero carousels first
  'hero_spotlight': 0,
  'editorial_hero': 2,
  // Utility next
  'continue_watching': 3,
  'live_now': 4,
  'starting_soon': 5,
  // Discovery
  'for_you_mosaic': 6,
  'because_you_watched': 7,
  'new_and_noteworthy': 8,
  'trending': 9,
  // Explore / curated sets and themes
  'collections_packs': 10,
  'team_league_hubs': 11,
  // Editorial upsell / deep catalog
  'highlights_reels': 12,
  'reels_grid': 13,
  'channel_surf': 14,
  'expiring_soon': 15,
  'people_suggestion': 16,
  'sponsored_shop': 17
};

function makeBadgeHTML(badges){
  if(!badges || !badges.length) return '';
  return badges.map(b=>{
    if (typeof b === 'object' && b.type && b.value) {
      // Date-specific expiring badge
      if (b.type === 'expiring') return `<div class="badge-exp">Expires ${b.value}</div>`;
      return '';
    }
    const k = String(b).toUpperCase();
    if(k==='LIVE') return '<div class="badge-live">LIVE</div>';
    if(k==='NEW') return '<div class="badge-new">NEW</div>';
    if(k==='EXP' || k==='EXPIRING') return '<div class="badge-exp">EXP</div>';
    if(k==='4K') return '<div class="badge-quality">4K</div>';
    if(k==='HDR') return '<div class="badge-quality">HDR</div>';
    if(k==='JUST ADDED') return '<div class="badge-new">Just Added</div>';
    return '';
  }).join('');
}

function makeCountdownHTML(startTime, title = ''){
  if(!startTime) return '';
  const countdownText = title ? `${title} ` : '';
  return `<div class="countdown" data-start="${startTime}">${countdownText}--:--:--</div>`;
}

function renderCountdowns(scope){
  const nodes = (scope||document).querySelectorAll('.countdown[data-start]');
  if(!nodes.length) return;
  function fmt(n){ return String(Math.max(0, n)).padStart(2,'0'); }
  
  // Store original text on first run
  nodes.forEach(el => {
    if (!el.hasAttribute('data-original-text')) {
      el.setAttribute('data-original-text', el.textContent);
    }
  });
  
  function tick(){
    nodes.forEach(el=>{
      const ts = Date.parse(el.getAttribute('data-start'));
      if(Number.isNaN(ts)) return;
      const diff = Math.max(0, ts - Date.now());
      const hh = Math.floor(diff/3.6e6); const mm = Math.floor(diff%3.6e6/6e4); const ss = Math.floor(diff%6e4/1e3);
      
      // Get the original text with title
      const originalText = el.getAttribute('data-original-text') || '';
      const titlePrefix = originalText.replace(/--:--:--/, '');
      
      el.textContent = `${titlePrefix}${fmt(hh)}:${fmt(mm)}:${fmt(ss)}`;
    });
  }
  tick();
  setInterval(tick, 1000);
}

function cardFromItem(item, type, index = 0){
  const title = item.title || 'Untitled';
  const id = item.id || title;
  // Skip LIVE badges for live_now rail since it's redundant
  const badges = (type === 'live_now') ? '' : makeBadgeHTML(item.badges);
  
  // Enhanced progress bar without redundant Resume CTA
  let progress = '';
  if (typeof item.progress === 'number') {
    const progressPct = Math.max(0, Math.min(100, item.progress));
    progress = `<div class="progress" style="width:${progressPct}%"></div>`;
  }
  
  // For non-sports (Balanced/index) experiences, hide the title prefix in the countdown pill
  let countdown = '';
  if (type === 'starting_soon') {
    const isSportsExperience = (typeof window !== 'undefined' && window.currentExperience === 'sports');
    const countdownLabel = item.countdown_label || (isSportsExperience ? (item.title || '') : '');
    countdown = makeCountdownHTML(item.startTime, countdownLabel);
  }
  let cls = 'card';
  const tok = RailTokens[type] || {};
  const silhouette = tok.silhouette;
  
  // Vertical cards for short-form content
  if (type === 'highlights_reels' || type === 'reels_grid') {
    cls += ' vertical';
  }
  
  // People get circular treatment
  if (type === 'people_suggestion') {
    cls += ' circle';
  }
  
  // First card emphasis for editorial rails (Because You Watched, Collections)
  if ((type === 'because_you_watched' || type === 'collections_packs') && index === 0) {
    cls += ' first-emphasis';
  }
  
  // Hero gets special treatment - main hero vs thumbnail
  if (type === 'hero_spotlight') {
    cls += index === 0 ? ' hero-main' : ' hero-thumb';
  } else if (type === 'editorial_hero') {
    cls += ' hero-size';
  }
  
  // Special event banners
  if (item.banner) {
    cls += ' has-banner';
  }
  
  // Card states
  if (item.watched) cls += ' watched';
  if (item.disabled) cls += ' disabled';
  
  const live = ''; // Removed redundant LIVE badge from live_now rail
  
  // Image support + mosaic sizing
  let style = '';
  if (item.image){
    const safeUrl = String(item.image).replace(/"/g,'');
    style += `background-image:url('${safeUrl}');background-size:cover;background-position:center;`;
  } else {
    const hue = Math.abs([...title].reduce((a,c)=>a+c.charCodeAt(0),0)) % 360;
    style += `background:linear-gradient(135deg, hsl(${hue} 60% 80%), hsl(${(hue+40)%360} 50% 65%));`;
  }
  
  let extra = '';
  if (type==='for_you_mosaic' || type==='collections_packs' || type==='team_league_hubs'){
    const size = (item.size||'M').toUpperCase();
    extra = ` mosaic-${size}`;
  }
  if (type==='highlights_reels' && item.format){
    extra = ` ${item.format}`;
  }
  if (type==='expiring_soon'){
    extra = ` expiring-card`;
  }
  
  // Add only the most important chip
  let chipsHTML = '';
  if (item.chips && item.chips.length) {
    const mostImportantChip = getMostImportantChip(item.chips, type);
    chipsHTML = `<div class="card-chips"><span class="card-chip">${mostImportantChip}</span></div>`;
  }
  
  // Enhanced metadata based on entity type
  let metaExtras = '';
  if (item.season && item.episode) metaExtras += ` • S${item.season}E${item.episode}`;
  if (item.duration) metaExtras += ` • ${item.duration}`;
  if (item.score) metaExtras += ` • ${item.score}`;
  if (item.curator) metaExtras += ` • ${item.curator}`;
  if (item.starts_in) metaExtras += ` • Starts in ${item.starts_in}`;
  if (item.moment_tag) metaExtras += ` • ${item.moment_tag}`;
  if (item.record) metaExtras += ` • ${item.record}`;
  if (item.next_game) metaExtras += ` • ${item.next_game}`;
  if (item.fixtures) metaExtras += ` • ${item.fixtures}`;
  if (item.standings) metaExtras += ` • ${item.standings}`;
  // Matchup is now the main title for starting_soon, not an extra
  
  // Preview capability based on motion policy
  const previewAttr = (tok.motion === 'focus') ? ' data-preview="true"' : '';
  
  // Special event banner
  let bannerHTML = '';
  if (item.banner) {
    bannerHTML = `<div class="event-banner">${item.banner}</div>`;
  }
  
  // Add background image styling
  let bgImage = '';
  let metaStyle = '';
  let fullStyle = style;
  
  if (type === 'highlights_reels' && item.format === 'horizontal') {
    // For horizontal highlights, put background on meta div
    metaStyle = item.image ? `style="background-image: url('${item.image}');"` : '';
  } else {
    // For all other cards, put background on card
    bgImage = item.image ? `background-image: url('${item.image}'); ` : '';
    fullStyle = `${style}${bgImage}`;
  }
  
  // Add metadata section for horizontal highlights
  let metadataHTML = '';
  if (type === 'highlights_reels' && item.format === 'horizontal') {
    const duration = item.duration || '';
    const views = item.views || '';
    const uploaded = item.uploaded || '';
    const description = item.description || '';
    metadataHTML = `<div class="highlight-metadata">
      <div class="highlight-stats">
        ${duration ? `<span class="duration">${duration}</span>` : ''}
        ${views ? `<span class="views">${views} views</span>` : ''}
        ${uploaded ? `<span class="uploaded">${uploaded}</span>` : ''}
      </div>
      ${description ? `<div class="highlight-description">${description}</div>` : ''}
    </div>`;
  }
  
  return `<div class="${cls}${extra}" tabindex="0" data-id="${String(id).replace(/"/g,'')}" data-rail-type="${type}" style="${fullStyle}"${previewAttr}>${bannerHTML}${live}${badges}${chipsHTML}<div class="meta" ${metaStyle}>${title}${metaExtras}</div>${metadataHTML}${progress}${countdown}</div>`;
}

// Inline Rail Controls System
const InlineRailControls = (()=>{
  const availableRails = {
    // DECIDE → Hero Carousels
    'hero_spotlight': 'Hero Spotlight',
    'editorial_hero': 'Editorial Hero',
    
    // CONTINUE → Utility Carousels  
    'continue_watching': 'Continue Watching',
    'live_now': 'Live Now',
    'starting_soon': 'Starting Soon',
    
    // DISCOVER → Discovery Carousels
    'for_you_mosaic': 'For You Mosaic',
    'new_and_noteworthy': 'New & Noteworthy',
    'trending': 'Trending Near You',
    'channel_surf': 'Channel Surf',
    'expiring_soon': 'Expiring Soon',
    'people_suggestion': 'People Suggestion',
    
    // EXPLORE → Cluster Carousels
    'collections_packs': 'Collections & Packs',
    'team_league_hubs': 'Teams & Leagues',
    
    // UPSELL → Editorial Carousels
    'because_you_watched': 'Because You Watched',
    'highlights_reels': 'Highlights & Reels',
    'reels_grid': 'Reels Grid',
    'sponsored_shop': 'Sponsored Shop'
  };
  
  const railTemplates = {
    'hero_spotlight': {
      title: 'Hero Spotlight',
      accent: '#111',
      intent: 'Hero',
      micro: 'Spotlight',
      items: [
        { id: 'new_hero_1', title: 'Featured Content', badges: ['NEW'], image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=640&h=360&fit=crop' }
      ]
    },
    'editorial_hero': {
      title: 'Editorial Hero',
      accent: '#111', 
      intent: 'Hero',
      micro: 'Editorial',
      items: [
        { id: 'editorial_new_1', title: 'Editorial Content', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' }
      ]
    },
    'continue_watching': {
      title: 'Continue Watching',
      accent: '#4a90e2',
      intent: 'Utility', 
      micro: 'Pick up where you left off',
      items: [
        { id: 'continue_new_1', title: 'Sample Show', progress: 45, image: 'https://images.unsplash.com/photo-1489599577225-cf2b6e6cd0e5?w=480&h=270&fit=crop', chips: ['Drama', 'HD'] }
      ]
    },
    'live_now': {
      title: 'Live Now',
      accent: '#e60000',
      intent: 'Utility',
      micro: 'Happening right now', 
      items: [
        { id: 'live_new_1', title: 'Live Content', image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=480&h=270&fit=crop', chips: ['Live', 'HD'] }
      ]
    },
    'starting_soon': {
      title: 'Starting Soon',
      accent: '#6a2be2',
      intent: 'Utility',
      micro: 'Countdown to start',
      items: [
        { id: 'soon_new_1', title: 'Upcoming Show', startTime: '2024-12-31T22:00:00Z', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=160&h=240&fit=crop' }
      ]
    },
    'new_and_noteworthy': {
      title: 'New & Noteworthy',
      accent: '#b15a00',
      intent: 'Discovery',
      micro: 'Just added and trending',
      items: [
        { id: 'new_content_1', title: 'New Release', badges: ['NEW'], image: 'https://images.unsplash.com/photo-1489599577225-cf2b6e6cd0e5?w=480&h=270&fit=crop' }
      ]
    },
    'trending': {
      title: 'Trending Near You', 
      accent: '#ff3366',
      intent: 'Discovery',
      micro: 'Popular near you',
      items: [
        { id: 'trending_new_1', title: 'Trending Content', image: 'https://images.unsplash.com/photo-1497015289630-41fcbea7f58c?w=480&h=270&fit=crop' },
        { id: 'trending_new_2', title: 'Popular Show', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=480&h=270&fit=crop' },
        { id: 'trending_new_3', title: 'Viral Content', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=480&h=270&fit=crop' }
      ]
    },
    'channel_surf': {
      title: 'Channel Surf',
      accent: '#555',
      intent: 'Discovery',
      micro: 'Browse channels',
      items: [
        { id: 'channel_new_1', title: 'ESPN', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=160&h=240&fit=crop' },
        { id: 'channel_new_2', title: 'ABC', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=160&h=240&fit=crop' },
        { id: 'channel_new_3', title: 'HBO', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=160&h=240&fit=crop' }
      ]
    },
    'expiring_soon': {
      title: 'Expiring Soon',
      accent: '#b15a00',
      intent: 'Discovery',
      micro: 'Leaving soon',
      items: [
        { id: 'exp_new_1', title: 'Leaving Soon: Classic Movie', badges: [{"type": "expiring", "value": "Jan 15"}], image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=480&h=270&fit=crop' },
        { id: 'exp_new_2', title: 'Leaving Soon: Drama Series', badges: [{"type": "expiring", "value": "Jan 20"}], image: 'https://images.unsplash.com/photo-1497015289630-41fcbea7f58c?w=480&h=270&fit=crop' }
      ]
    },
    'people_suggestion': {
      title: 'People Suggestion',
      accent: '#0e7c86',
      intent: 'Discovery',
      micro: 'Suggested profiles',
      items: [
        { id: 'people_new_1', title: 'Creator Name', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face', followers: 'Followed by friends' },
        { id: 'people_new_2', title: 'Artist Name', image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&h=120&fit=crop&crop=face', followers: 'Popular creator' },
        { id: 'people_new_3', title: 'Influencer', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=120&h=120&fit=crop&crop=face', followers: 'Trending creator' }
      ]
    },
    'collections_packs': {
      title: 'Collections & Packs',
      accent: '#333',
      intent: 'Cluster',
      micro: 'Curated sets and themes',
      items: [
        { id: 'pack_new_1', title: 'Action Collection', curator: 'Staff', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=480&h=270&fit=crop', size: 'L' },
        { id: 'pack_new_2', title: 'Comedy Pack', curator: 'Comedy', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480&h=270&fit=crop', size: 'M' },
        { id: 'pack_new_3', title: 'Drama Set', curator: 'Drama', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68e?w=480&h=270&fit=crop', size: 'S' },
        { id: 'pack_new_4', title: 'Thriller Pack', curator: 'Thriller', image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=480&h=270&fit=crop', size: 'M' }
      ]
    },
    'because_you_watched': {
      title: 'Because You Watched',
      accent: '#0e7c86',
      intent: 'Editorial',
      micro: 'Similar content',
      seed: 'Sample Show',
      items: [
        { id: 'rec_new_1', title: 'Similar Show 1', image: 'https://images.unsplash.com/photo-1489599577225-cf2b6e6cd0e5?w=480&h=270&fit=crop' },
        { id: 'rec_new_2', title: 'Similar Show 2', image: 'https://images.unsplash.com/photo-1497015289630-41fcbea7f58c?w=480&h=270&fit=crop' },
        { id: 'rec_new_3', title: 'Similar Show 3', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=480&h=270&fit=crop' }
      ]
    },
    'highlights_reels': {
      title: 'Highlights & Reels',
      accent: '#111',
      intent: 'Editorial',
      micro: 'Short-form highlights',
      items: [
        { id: 'hl_new_1', title: 'Highlight Reel 1', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=288&h=512&fit=crop', format: 'vertical', duration: '1:30', views: '500K' },
        { id: 'hl_new_2', title: 'Best Moments', image: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?w=480&h=270&fit=crop', format: 'horizontal', duration: '3:15', views: '1.2M', description: 'Top moments compilation' }
      ]
    },
    'reels_grid': {
      title: 'Reels Grid',
      accent: '#111',
      intent: 'Editorial',
      micro: 'Grid layout',
      items: [
        { id: 'grid_new_1', title: 'Reel 1', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=288&h=512&fit=crop' },
        { id: 'grid_new_2', title: 'Reel 2', image: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?w=288&h=512&fit=crop' }
      ]
    },
    'sponsored_shop': {
      title: 'Sponsored Shop',
      accent: '#006644',
      intent: 'Editorial',
      micro: 'Shop now',
      items: [
        { id: 'shop_new_1', title: 'Product Showcase', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=480&h=720&fit=crop', sponsor: 'brand', cta: 'Shop now' }
      ]
    }
  };
  
  function addControlsToRails() {
    // Get only visible rails for proper indexing
    const allRails = document.querySelectorAll('.row[data-rail]');
    const visibleRails = Array.from(allRails).filter(rail => rail.style.display !== 'none');
    
    visibleRails.forEach((rail, index) => {
      const header = rail.querySelector('.row-header');
      if (!header || header.querySelector('.rail-controls')) return; // Already has controls
      
      const railType = rail.getAttribute('data-rail');
      const isFirst = index === 0;
      const isLast = index === visibleRails.length - 1;
      
      const controls = document.createElement('div');
      controls.className = 'rail-controls';
      controls.innerHTML = `
        <button class="rail-control-btn" onclick="InlineRailControls.moveUp('${railType}')" ${isFirst ? 'disabled' : ''} title="Move Up">↑</button>
        <button class="rail-control-btn" onclick="InlineRailControls.moveDown('${railType}')" ${isLast ? 'disabled' : ''} title="Move Down">↓</button>
        <button class="rail-control-btn" onclick="InlineRailControls.removeRail('${railType}')" title="Remove">×</button>
      `;
      
      header.appendChild(controls);
      
      // Add "add rail" button after each rail
      const addSpacer = document.createElement('div');
      addSpacer.className = 'add-rail-spacer';
      addSpacer.innerHTML = `<button class="add-rail-btn" onclick="InlineRailControls.showAddRailMenu('${railType}')">+ Add Rail</button>`;
      rail.parentNode.insertBefore(addSpacer, rail.nextSibling);
    });
  }
  
  function moveUp(railType) {
    const rail = document.querySelector(`[data-rail="${railType}"]`);
    const prevRail = getPreviousRail(rail);
    
    if (prevRail) {
      rail.parentNode.insertBefore(rail, prevRail);
      refreshControls();
    }
  }
  
  function moveDown(railType) {
    const rail = document.querySelector(`[data-rail="${railType}"]`);
    const nextRail = getNextRail(rail);
    
    if (nextRail) {
      const afterNext = nextRail.nextElementSibling;
      if (afterNext) {
        rail.parentNode.insertBefore(rail, afterNext);
      } else {
        rail.parentNode.appendChild(rail);
      }
      refreshControls();
    }
  }
  
  function getPreviousRail(rail) {
    let prev = rail.previousElementSibling;
    while (prev && (!prev.classList.contains('row') || prev.style.display === 'none')) {
      prev = prev.previousElementSibling;
    }
    return prev && prev.classList.contains('row') ? prev : null;
  }
  
  function getNextRail(rail) {
    let next = rail.nextElementSibling;
    while (next && (!next.classList.contains('row') || next.style.display === 'none')) {
      next = next.nextElementSibling;
    }
    return next && next.classList.contains('row') ? next : null;
  }
  
  function refreshControls() {
    // Remove all existing controls
    document.querySelectorAll('.rail-controls, .add-rail-spacer').forEach(el => el.remove());
    // Re-add controls with updated states
    setTimeout(() => addControlsToRails(), 50);
  }
  
  function removeRail(railType) {
    const rail = document.querySelector(`[data-rail="${railType}"]`);
    if (rail) {
      rail.style.display = 'none';
      updateControlStates();
    }
  }
  
  function updateControlStates() {
    // Remove all controls and re-add them to get fresh state
    refreshControls();
  }
  
  function showAddRailMenu(afterRailType) {
    // Allow duplicates - show all rail types
    const availableOptions = Object.entries(availableRails);
    
    // Create dropdown HTML
    const optionsHTML = availableOptions.map(([type, name]) => 
      `<option value="${type}">${name}</option>`
    ).join('');
    
    const dropdown = document.createElement('select');
    dropdown.innerHTML = `<option value="">Choose rail to add...</option>${optionsHTML}`;
    dropdown.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 12px;
      font-size: 14px;
      border: 2px solid #007AFF;
      border-radius: 8px;
      background: white;
      z-index: 1000;
      min-width: 200px;
    `;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `;
    
    dropdown.onchange = () => {
      if (dropdown.value) {
        addRail(dropdown.value, afterRailType);
      }
      document.body.removeChild(dropdown);
      document.body.removeChild(overlay);
    };
    
    overlay.onclick = () => {
      document.body.removeChild(dropdown);
      document.body.removeChild(overlay);
    };
    
    document.body.appendChild(overlay);
    document.body.appendChild(dropdown);
    dropdown.focus();
  }
  
  function addRail(railType, afterRailType) {
    const afterRail = document.querySelector(`[data-rail="${afterRailType}"]`);
    const template = railTemplates[railType];
    
    // Generate unique rail ID for duplicates
    const existingRails = document.querySelectorAll(`[data-rail^="${railType}"]`);
    const uniqueRailType = existingRails.length > 0 ? `${railType}_${existingRails.length + 1}` : railType;
    
    if (!template) {
      // Fallback for rails without templates
      const newRail = document.createElement('section');
      newRail.className = 'row';
      newRail.setAttribute('data-rail', uniqueRailType);
      newRail.innerHTML = `
        <div class="row-header">
          <h2>${availableRails[railType]} <span class="intent-type">• Added</span></h2>
          <div class="micro">Newly added rail</div>
        </div>
        <div class="carousel">
          <div class="track">
            <div class="card" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;">
              <div class="meta">Sample content for ${availableRails[railType]}</div>
            </div>
          </div>
        </div>
      `;
      afterRail.parentNode.insertBefore(newRail, afterRail.nextSibling);
    } else {
      // Use proper template to generate rail with unique IDs
      const railData = {
        type: railType,
        ...template,
        items: template.items.map((item, idx) => ({
          ...item,
          id: `${item.id}_${Date.now()}_${idx}` // Ensure unique IDs
        }))
      };
      
      const railHTML = rowFromRail(railData);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = railHTML;
      const newRail = tempDiv.firstElementChild;
      newRail.setAttribute('data-rail', uniqueRailType);
      
      afterRail.parentNode.insertBefore(newRail, afterRail.nextSibling);
      
      // Initialize dynamic elements for new rail
      if (typeof window.renderCountdowns === 'function') {
        window.renderCountdowns(newRail);
      }
    }
    
    // Refresh controls
    refreshControls();
  }
  
  return { addControlsToRails, moveUp, moveDown, removeRail, showAddRailMenu };
})();

function rowFromRail(rail){
  const titleMap = {
    'continue_watching': 'Continue Watching',
    'live_now': 'Live Now',
    'starting_soon': 'Starting Soon',
    'for_you_mosaic': 'For You',
    'because_you_watched': 'Shows Like',
    'new_and_noteworthy': 'New & Noteworthy',
    'trending': 'Trending Near You',
    'collections_packs': 'Collections & Packs',
    'highlights_reels': 'Highlights & Reels',
    'channel_surf': 'Channel Surf',
    'expiring_soon': 'Expiring Soon',
    'editorial_hero': 'Editorial Hero',
    'hero_spotlight': 'Hero Spotlight',
    'people_suggestion': 'People',
    'sponsored_shop': 'Shop',
    'reels_grid': 'Reels Grid',
    'team_league_hubs': 'Teams & Leagues'
  };
  // Enhanced header with seed for Because You Watched
  let label = titleMap[rail.type] || (rail.title || 'Rail');
  if (rail.type === 'because_you_watched' && rail.seed) {
    label = `Shows like ${rail.seed}`;
  }
  
  // Add intent type for balanced/sports experiences
  const intentLabels = {
    'continue': 'Utility',
    'discover': 'Discovery', 
    'explore': 'Cluster',
    'decide': 'Hero',
    'upsell': 'Editorial'
  };
  
  // Add intent type for balanced/sports experiences
  let intentTypeHTML = '';
  const token = RailTokens[rail.type];
  if (token && token.intent && intentLabels[token.intent]) {
    // Check if we're in a main experience (not individual demo)
    const isMainExperience = document.title.includes('Balanced Demo') || document.title.includes('Sports Demo');
    if (isMainExperience) {
      intentTypeHTML = ` <span class="intent-type">• ${intentLabels[token.intent]}</span>`;
    }
  }
  
  const micro = (()=>{
    const mc = RailMicrocopy[rail.type];
    if(typeof mc === 'function') return mc(rail);
    if(typeof mc === 'string') return mc;
    return rail.subtitle || '';
  })();
  
  // Add upgrade button for upsell rails
  let upgradeButton = '';
  if (rail.upsell) {
    upgradeButton = `<button class="upgrade-btn" onclick="showUpgradeModal('${rail.title || rail.type}')">🔓 Upgrade to Premium</button>`;
  }
  // Special handling for mosaic layout
  let cards;
  if (rail.type === 'for_you_mosaic' || rail.type === 'collections_packs' || rail.type === 'team_league_hubs') {
    // Group cards into mosaic groups of 4 to match the new layout
    const items = rail.items || [];
    let mosaicGroups = [];
    for (let i = 0; i < items.length; i += 4) {
      const groupItems = items.slice(i, i + 4);
      const groupCards = groupItems.map((it, idx) => cardFromItem(it, rail.type, idx + 1)).join('');
      mosaicGroups.push(`<div class="mosaic-group">${groupCards}</div>`);
    }
    cards = mosaicGroups.join('');
  } else {
    cards = (rail.items||[]).map((it, idx)=>cardFromItem(it, rail.type, idx)).join('');
  }
  const ticker = rail.type==='live_now' ? ' data-ticker' : '';
  const accent = (RailTokens[rail.type]?.accent) || '#999';
  
  // Special layout handling
  let layoutAttr = '';
  if (rail.type === 'for_you_mosaic' || rail.type === 'collections_packs' || rail.type === 'team_league_hubs') {
    layoutAttr = ' data-layout="mosaic"';
  } else if (rail.type === 'reels_grid') {
    layoutAttr = ' data-layout="grid-3"';
  } else if (rail.type === 'hero_spotlight') {
    layoutAttr = ' data-layout="hero"';
  }
  
  const showNav = !(rail.type==='for_you_mosaic' || rail.type==='collections_packs' || rail.type==='team_league_hubs' || rail.type==='reels_grid' || rail.type==='hero_spotlight');
  const headerId = `rowh-${__rowIdCounter++}`;
  const railId = `rail-${Math.random().toString(36).slice(2,8)}`;
  // Special hero carousel structure
  if (rail.type === 'hero_spotlight') {
    // Render main from the first item explicitly to ensure correct classes
    const heroCard = rail.items.length ? cardFromItem(rail.items[0], rail.type, 0) : '';
    const thumbCards = rail.items.slice(1).map((it, idx)=>cardFromItem(it, rail.type, idx + 1)).join('');

    return `
    <section class="row" tabindex="-1" data-rail="${rail.type}" data-rail-id="${railId}" style="--rail-accent:${accent}" role="region" aria-labelledby="${headerId}">
      <div class="row-header" tabindex="0"><h2 id="${headerId}">${label}${intentTypeHTML}</h2>${micro?`<div class=\"micro\">${micro}</div>`:''}${upgradeButton}</div>
      <div class="carousel hero-carousel" tabindex="0"${layoutAttr}>
        <div class="hero-main-container">${heroCard}</div>
        <div class="hero-thumbs-container">
          <div class="hero-thumbs-track">${thumbCards}</div>
        </div>
      </div>
    </section>`;
  }
  
  // No special track styling needed
  let trackStyle = '';
  
  return `
  <section class="row" tabindex="-1" data-rail="${rail.type}" data-rail-id="${railId}" style="--rail-accent:${accent}" role="region" aria-labelledby="${headerId}">
    <div class="row-header" tabindex="0"><h2 id="${headerId}">${label}${intentTypeHTML}</h2>${micro?`<div class=\"micro\">${micro}</div>`:''}${upgradeButton}</div>
    <div class="carousel" tabindex="0"${ticker}${layoutAttr}>
      ${showNav?'<button class="nav prev" aria-label="Prev" tabindex="0">◀</button>':''}
      ${showNav?'<button class="nav next" aria-label="Next" tabindex="0">▶</button>':''}
      <div class="track"${trackStyle}>${cards}</div>
    </div>
  </section>`;
}

function sortRailsByPriority(rails){
  return (rails||[]).slice().sort((a,b)=>{
    const pa = RailPriority[a.type] || 999;
    const pb = RailPriority[b.type] || 999;
    return pa - pb;
  });
}

function applyOwnershipDedupe(container){
  if(!Toggles.state.ownership) return 0;
  const railSections = Array.from(container.querySelectorAll('section.row'));
  const viewportHeight = window.innerHeight || 800;
  let dedupeCount = 0;
  
  railSections.forEach((section, idx)=>{
    const prior = railSections.slice(0, idx);
    const visiblePrior = prior.filter(sec=>{
      const r = sec.getBoundingClientRect();
      return r.bottom > 0; // if entirely above viewport (bottom <= 0), it no longer owns
    });
    const owned = new Set();
    visiblePrior.forEach(sec=>{
      sec.querySelectorAll('.card').forEach(card=>{
        const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent.trim();
        if(id) owned.add(id);
      });
    });
    section.querySelectorAll('.card').forEach(card=>{
      const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent.trim();
      if(!id) return;
      if(owned.has(id)){
        card.classList.add('suppressed');
        const meta = card.querySelector('.meta');
        if(meta && !meta.textContent.includes('Also in')) meta.textContent += ' • Also in another rail';
        dedupeCount++;
      } else {
        card.classList.remove('suppressed');
      }
    });
  });
  
  return dedupeCount;
}

function renderRailsFromData(json, container){
  const rails = sortRailsByPriority(json.rails||[]);
  
  const html = rails.map(rowFromRail).join('');
  container.innerHTML = html;
  
  // Mount behaviors
  Console.init();
  // Toggles.mount(); // Disabled - no header to mount to
  document.querySelectorAll('.carousel:not(.hero-carousel)').forEach(setupCarousel);
  document.querySelectorAll('.hero-carousel').forEach(setupHeroCarousel);
  
  // Setup auto-advance for all rails except hero (universal auto-advance)
  document.querySelectorAll('.carousel:not(.hero-carousel)').forEach(setupRailAutoAdvance);
  
  renderCountdowns(container);
  
  // Apply dedupe and count suppressions
  const dedupeCount = applyOwnershipDedupe(container);
  
  injectPurpose(container, json.meta);
  observeRailsVisibility(container);
  
  // Update debug panel stats
  Console.updateStats(rails.length, dedupeCount);
  
  // Add inline rail controls
  setTimeout(() => InlineRailControls.addControlsToRails(), 100);
  
  // Header click logging
  container.querySelectorAll('.row-header').forEach(h=>{
    h.addEventListener('click', ()=>{
      const sec = h.closest('section.row');
      const rail = sec?.getAttribute('data-rail') || 'rail';
      if (Toggles.state.analytics) Console.log('rail_header_click type='+rail);
    });
  });
  
  // Viewport-aware dedupe updates on scroll/resize
  window.addEventListener('scroll', ()=>{
    const count = applyOwnershipDedupe(container);
    Console.updateStats(rails.length, count);
  });
  window.addEventListener('resize', ()=>{
    const count = applyOwnershipDedupe(container);
    Console.updateStats(rails.length, count);
  });
}

// Expose entry point for demo pages
window.renderHomeFromJSON = function(json){
  const main = document.querySelector('main') || document.body;
  renderRailsFromData(json, main);
}

// Preview functionality
function startPreview(card, railType) {
  const id = card.getAttribute('data-id');
  if (Toggles.state.analytics) Console.log('card_preview_start id='+id+' type='+railType);
  
  // Add preview indicator
  card.classList.add('previewing');
  
  // Simulate preview (in real app, would start video preview)
  const previewOverlay = document.createElement('div');
  previewOverlay.className = 'preview-overlay';
  previewOverlay.innerHTML = `
    <div class="preview-indicator">▶ Preview (Muted)</div>
    <div class="preview-captions">Auto-generated captions...</div>
  `;
  card.appendChild(previewOverlay);
  
  // Track preview time
  card._previewStart = performance.now();
}

function stopPreview(card) {
  if (!card.classList.contains('previewing')) return;
  
  const previewMs = card._previewStart ? Math.round(performance.now() - card._previewStart) : 0;
  const id = card.getAttribute('data-id');
  
  if (Toggles.state.analytics && previewMs > 0) {
    Console.log('card_preview_ms id='+id+' ms='+previewMs);
  }
  
  card.classList.remove('previewing');
  const overlay = card.querySelector('.preview-overlay');
  if (overlay) overlay.remove();
  delete card._previewStart;
}

// Store current experience context for proper home navigation
window.currentExperience = window.currentExperience || (function() {
  if (document.title.includes('Balanced Demo')) return 'balanced';
  if (document.title.includes('Sports Demo')) return 'sports';
  return 'index';
})();

// Helper function to get the correct home URL
function getHomeUrl() {
  switch (window.currentExperience) {
    case 'balanced': return '../demo_balanced/index.html';
    case 'sports': return '../demo_sports/index.html';
    default: return '../../index.html';
  }
}

// Universal Rail Auto-Advance Setup (for all rails except hero)
function setupRailAutoAdvance(carousel) {
  const track = carousel.querySelector('.track');
  const cards = Array.from(track.querySelectorAll('.card'));
  const navButtons = carousel.querySelectorAll('.nav');
  const row = carousel.closest('.row');
  
  // Skip if this is a hero carousel or has insufficient cards
  if (row && row.getAttribute('data-rail') === 'hero_spotlight') return;
  if (cards.length <= 1) return; // No need to auto-advance if only one card
  
  let currentIndex = 0;
  let autoAdvanceInterval = null;
  let inactivityTimer = null;
  const INACTIVITY_DELAY = 2000; // 2 seconds
  const ADVANCE_INTERVAL = 4000; // 4 seconds between advances (slightly slower for non-hero rails)
  
  // Check if this rail is at the top of the viewport
  function isAtTopOfViewport() {
    if (!row) return false;
    
    const rect = row.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if the row is fully visible and at the top portion of the viewport
    // Allow some tolerance (within 20% of viewport height from top)
    const tolerance = viewportHeight * 0.2;
    const isAtTop = rect.top >= 0 && rect.top <= tolerance;
    const isFullyVisible = rect.bottom <= viewportHeight && rect.top >= 0;
    
    return isAtTop && isFullyVisible;
  }
  
  // Auto-advance to next card
  function advanceToNext() {
    if (!isAtTopOfViewport()) return;
    
    currentIndex = (currentIndex + 1) % cards.length;
    const targetCard = cards[currentIndex];
    
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      
      // Debug logging
      if (window.console && console.log) {
        const railType = row ? row.getAttribute('data-rail') : 'unknown';
        console.log(`${railType} rail auto-advanced to card ${currentIndex + 1}/${cards.length}`);
      }
    }
  }
  
  // Add visual indicator for auto-advance
  function showAutoAdvanceIndicator() {
    if (!carousel.querySelector('.auto-advance-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'auto-advance-indicator';
      indicator.innerHTML = '▶ Auto-advancing';
      carousel.appendChild(indicator);
    }
  }
  
  function hideAutoAdvanceIndicator() {
    const indicator = carousel.querySelector('.auto-advance-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  // Start auto-advance
  function startAutoAdvance() {
    if (!isAtTopOfViewport()) {
      // Debug logging for why auto-advance didn't start
      if (window.console && console.log) {
        if (row) {
          const rect = row.getBoundingClientRect();
          const railType = row.getAttribute('data-rail');
          console.log(`${railType} rail auto-advance blocked - not at top of viewport:`, {
            top: rect.top,
            bottom: rect.bottom,
            viewportHeight: window.innerHeight,
            tolerance: window.innerHeight * 0.2
          });
        }
      }
      return;
    }
    
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
    }
    
    autoAdvanceInterval = setInterval(advanceToNext, ADVANCE_INTERVAL);
    showAutoAdvanceIndicator();
    
    // Debug logging
    if (window.console && console.log) {
      const railType = row ? row.getAttribute('data-rail') : 'unknown';
      console.log(`${railType} rail auto-advance started`);
    }
  }
  
  // Stop auto-advance
  function stopAutoAdvance() {
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = null;
    }
    hideAutoAdvanceIndicator();
  }
  
  // Handle user interaction
  function handleUserInteraction() {
    stopAutoAdvance();
    
    // Clear existing inactivity timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    // Start inactivity timer
    inactivityTimer = setTimeout(() => {
      if (isAtTopOfViewport()) {
        startAutoAdvance();
      }
    }, INACTIVITY_DELAY);
  }
  
  // Add event listeners for user interaction
  carousel.addEventListener('click', handleUserInteraction);
  carousel.addEventListener('touchstart', handleUserInteraction);
  carousel.addEventListener('keydown', handleUserInteraction);
  
  // Add event listeners to navigation buttons
  navButtons.forEach(button => {
    button.addEventListener('click', handleUserInteraction);
  });
  
  // Add event listeners to cards
  cards.forEach(card => {
    card.addEventListener('click', handleUserInteraction);
    card.addEventListener('focus', handleUserInteraction);
  });
  
  // Add scroll event listener to check viewport position
  window.addEventListener('scroll', () => {
    if (autoAdvanceInterval) {
      // If auto-advance is running but we're no longer at top, stop it
      if (!isAtTopOfViewport()) {
        stopAutoAdvance();
      }
    } else {
      // If auto-advance is not running but we are at top, restart inactivity timer
      if (isAtTopOfViewport()) {
        handleUserInteraction();
      }
    }
  });
  
  // Start inactivity timer initially
  inactivityTimer = setTimeout(() => {
    if (isAtTopOfViewport()) {
      startAutoAdvance();
    }
  }, INACTIVITY_DELAY);
  
  // Cleanup function
  return function cleanup() {
    stopAutoAdvance();
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
  };
}

// Hero Carousel Setup (Disney+ style)
function setupHeroCarousel(heroCarousel) {
  const mainContainer = heroCarousel.querySelector('.hero-main-container');
  const thumbsTrack = heroCarousel.querySelector('.hero-thumbs-track');
  let thumbs = Array.from(thumbsTrack.querySelectorAll('.card.hero-thumb'));
  let currentMainCard = mainContainer.querySelector('.card.hero-main');
  let currentIndex = 0;
  
  // Initialize active state
  if (thumbs.length > 0) {
    thumbs[0].classList.add('active');
  }
  
  // Auto-cycle every 5 seconds
  let autoInterval = setInterval(() => {
    cycleToNext();
  }, 5000);
  
  // Add click handlers to all thumbnails
  function addThumbClickHandlers() {
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        clearInterval(autoInterval);
        cycleToThumb(index);
        // Restart auto-cycle
        autoInterval = setInterval(() => {
          cycleToNext();
        }, 5000);
      });
    });
  }
  
  addThumbClickHandlers();
  
  // Pause auto-cycle on hover
  heroCarousel.addEventListener('mouseenter', () => {
    clearInterval(autoInterval);
  });
  
  heroCarousel.addEventListener('mouseleave', () => {
    autoInterval = setInterval(() => {
      cycleToNext();
    }, 5000);
  });
  
  function cycleToNext() {
    if (thumbs.length === 0) return;
    cycleToThumb(0);
  }
  
  function cycleToThumb(thumbIndex) {
    if (thumbIndex >= thumbs.length || thumbs.length === 0) return;
    
    const selectedThumb = thumbs[thumbIndex];
    
    // Remove active state from all thumbs
    thumbs.forEach(t => t.classList.remove('active'));
    
    // Clone the selected thumbnail to become the new main card
    const newMainCard = selectedThumb.cloneNode(true);
    newMainCard.className = newMainCard.className.replace('hero-thumb', 'hero-main');
    
    // Clone the current main card to become a thumbnail
    const newThumb = currentMainCard.cloneNode(true);
    newThumb.className = newThumb.className.replace('hero-main', 'hero-thumb');
    
    // Replace main card
    mainContainer.innerHTML = '';
    mainContainer.appendChild(newMainCard);
    currentMainCard = newMainCard;
    
    // Remove the selected thumbnail from DOM
    selectedThumb.remove();
    
    // Add the old main card as a new thumbnail at the end
    thumbsTrack.appendChild(newThumb);
    
    // Update thumbs array - remove selected, add new one at end
    thumbs.splice(thumbIndex, 1);
    thumbs.push(newThumb);
    
    // Add active state to first thumb (next in line)
    if (thumbs.length > 0) {
      thumbs[0].classList.add('active');
    }
    
    // Re-add click handlers to all thumbs (including the new one)
    addThumbClickHandlers();
    
    // Add navigation capability to new main card
    newMainCard.addEventListener('click', () => {
      const id = newMainCard.getAttribute('data-id');
      const railType = newMainCard.getAttribute('data-rail-type');
      if (id && railType) {
        navigateToContent(id, railType, newMainCard);
      }
    });
  }
}

// Navigation system for end-to-end experiences
function navigateToContent(id, railType, cardElement) {
  const title = cardElement.querySelector('.meta')?.textContent?.trim() || 'Content';
  const isLive = railType === 'live_now' || cardElement.querySelector('.badge-live');
  
  // Create detail page based on content type
  if (railType === 'live_now') {
    showLivePlayerPage(title, id);
  } else if (railType === 'collections_packs') {
    showCollectionPage(title, id);
  } else if (railType === 'highlights_reels' || railType === 'reels_grid') {
    showReelsPlayer(title, id);
  } else if (railType === 'channel_surf') {
    showChannelPage(title, id);
  } else if (railType === 'people_suggestion') {
    showProfilePage(title, id);
  } else if (railType === 'sponsored_shop') {
    showShopPage(title, id);
  } else if (railType === 'team_league_hubs') {
    showTeamLeagueHub(title, id);
  } else {
    showVideoPlayerPage(title, id, railType === 'continue_watching');
  }
}

function showLivePlayerPage(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page live-page">
      <div class="global-nav">
        <button class="home-btn" onclick="window.location.href=getHomeUrl()">🏠</button>
        <button class="back-btn" onclick="history.back()">←</button>
      </div>
      <div class="page-header">
        <h1>${title}</h1>
        <div class="live-badge">LIVE</div>
      </div>
      <div class="player-container"></div>
      <div class="live-info">
        <div class="chips-container">
          <div class="chip">Live</div>
          <div class="chip">Sports</div>
          <div class="chip">HD</div>
          <div class="chip">Multi-Cam</div>
          <div class="chip">Betting</div>
        </div>
        <p>Watch live as the action unfolds. Use DVR controls to pause, rewind, or jump back to live.</p>
      </div>
      <div class="game-timeline">
        <h3>Key Plays Timeline</h3>
        <div class="timeline-scrub">
          <div class="timeline-marker" style="left: 25%">Goal • 23:45</div>
          <div class="timeline-marker" style="left: 60%">Red Card • 58:12</div>
          <div class="timeline-marker" style="left: 85%">Goal • 89:30</div>
        </div>
      </div>
      <div class="multi-angle-highlights">
        <h3>Multi-Angle Highlights</h3>
        <div class="angle-grid">
          <div class="angle-card">Main Camera</div>
          <div class="angle-card">Player Cam</div>
          <div class="angle-card">Tactical View</div>
          <div class="angle-card">Ref Cam</div>
        </div>
      </div>
      <div class="related-content">
        <h3>More from this event</h3>
        <div class="mini-carousel">
          <div class="mini-card">Highlights</div>
          <div class="mini-card">Pre-Game</div>
          <div class="mini-card">Stats</div>
        </div>
      </div>
    </div>`;
  
  const playerContainer = main.querySelector('.player-container');
  DVRControls.createPlayer(playerContainer, true, { 
    currentTime: '1:23:45', 
    totalTime: '2:30:00', 
    progress: 55, 
    isPlaying: true 
  });
}

function showTeamLeagueHub(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page team-hub-page">
      <div class="page-header">
        <button class="back-btn" onclick="history.back()">← Back</button>
        <div class="hub-info">
          <div class="hub-logo">${title}</div>
          <div>
            <h1>${title} Hub</h1>
            <div class="hub-stats">32 teams • Season in progress</div>
          </div>
        </div>
      </div>
      <div class="hub-tabs">
        <div class="hub-tab active" data-tab="live">Live</div>
        <div class="hub-tab" data-tab="standings">Standings</div>
        <div class="hub-tab" data-tab="highlights">Highlights</div>
        <div class="hub-tab" data-tab="teams">Teams</div>
      </div>
      <div class="hub-content">
        <div class="hub-panel active" data-panel="live">
          <div class="fixtures-scroll">
            <div class="fixture-card live" onclick="navigateToContent('live1','live_now',this)">
              <div class="fixture-teams">Lakers vs Warriors</div>
              <div class="fixture-time">LIVE • Q3 • 89-92</div>
              <div class="fixture-badge">🔴 LIVE</div>
            </div>
            <div class="fixture-card" onclick="navigateToContent('soon1','starting_soon',this)">
              <div class="fixture-teams">Celtics vs Heat</div>
              <div class="fixture-time">8:30 PM EST</div>
              <div class="fixture-badge">⏰ Soon</div>
            </div>
            <div class="fixture-card" onclick="navigateToContent('soon2','starting_soon',this)">
              <div class="fixture-teams">Bulls vs Knicks</div>
              <div class="fixture-time">9:00 PM EST</div>
              <div class="fixture-badge">📺 Later</div>
            </div>
          </div>
        </div>
        <div class="hub-panel" data-panel="standings">
          <div class="standings-scroll">
            <div class="standings-row">1. Lakers • 45-15 • .750</div>
            <div class="standings-row">2. Warriors • 42-18 • .700</div>
            <div class="standings-row">3. Celtics • 40-20 • .667</div>
            <div class="standings-row">4. Heat • 38-22 • .633</div>
            <div class="standings-row">5. Bulls • 35-25 • .583</div>
          </div>
        </div>
        <div class="hub-panel" data-panel="highlights">
          <div class="highlights-scroll">
            <div class="highlight-card" onclick="navigateToContent('hl1','highlights_reels',this)">
              <div class="highlight-thumb" style="background:linear-gradient(135deg, #ff6b6b, #4ecdc4)"></div>
              <div class="highlight-info">
                <div class="highlight-title">Last Night's Best</div>
                <div class="highlight-meta">3:45 • Top Plays</div>
              </div>
            </div>
            <div class="highlight-card" onclick="navigateToContent('hl2','highlights_reels',this)">
              <div class="highlight-thumb" style="background:linear-gradient(135deg, #a8e6cf, #ffd93d)"></div>
              <div class="highlight-info">
                <div class="highlight-title">Weekly Recap</div>
                <div class="highlight-meta">5:20 • Summary</div>
              </div>
            </div>
          </div>
        </div>
        <div class="hub-panel" data-panel="teams">
          <div class="teams-grid">
            <div class="team-card">Lakers</div>
            <div class="team-card">Warriors</div>
            <div class="team-card">Celtics</div>
            <div class="team-card">Heat</div>
          </div>
        </div>
      </div>
    </div>`;
  
  setupHubTabs();
}

function showCollectionPage(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page collection-page">
      <div class="global-nav">
        <button class="home-btn" onclick="window.location.href=getHomeUrl()">🏠</button>
        <button class="back-btn" onclick="history.back()">←</button>
      </div>
      <div class="page-header">
        <h1>${title}</h1>
        <div class="collection-meta">Curated by Staff • 12 items</div>
      </div>
      <div class="chips-filter-bar">
        <div class="chip active" data-filter="all">All</div>
        <div class="chip" data-filter="highlights">Highlights</div>
        <div class="chip" data-filter="games">Full Games</div>
        <div class="chip" data-filter="interviews">Interviews</div>
        <div class="chip" data-filter="behind">Behind Scenes</div>
      </div>
      <div class="collection-grid">
        <div class="collection-item" data-type="highlights" onclick="navigateToContent('hl1','highlights_reels',this)">
          <div class="item-thumb" style="background:linear-gradient(135deg, #ff6b6b, #4ecdc4)"></div>
          <div class="item-info">
            <div class="item-title">Game 1 Highlights</div>
            <div class="item-meta">2:30 • Highlights</div>
          </div>
        </div>
        <div class="collection-item" data-type="games" onclick="navigateToContent('game1','continue_watching',this)">
          <div class="item-thumb" style="background:linear-gradient(135deg, #a8e6cf, #ffd93d)"></div>
          <div class="item-info">
            <div class="item-title">Championship Replay</div>
            <div class="item-meta">2h 45m • Full Game</div>
          </div>
        </div>
        <div class="collection-item" data-type="interviews" onclick="navigateToContent('int1','highlights_reels',this)">
          <div class="item-thumb" style="background:linear-gradient(135deg, #ff9a9e, #fecfef)"></div>
          <div class="item-info">
            <div class="item-title">Player Interviews</div>
            <div class="item-meta">15:20 • Interview</div>
          </div>
        </div>
        <div class="collection-item" data-type="behind" onclick="navigateToContent('bts1','highlights_reels',this)">
          <div class="item-thumb" style="background:linear-gradient(135deg, #a8e6cf, #88d8c0)"></div>
          <div class="item-info">
            <div class="item-title">Behind the Scenes</div>
            <div class="item-meta">8:45 • Exclusive</div>
          </div>
        </div>
      </div>
    </div>`;
  
  setupCollectionFilters();
}

function showVideoPlayerPage(title, id, isContinueWatching = false) {
  const main = document.querySelector('main');
  const progressText = isContinueWatching ? '<div class="resume-info">Resume from 23:45</div>' : '';
  
  main.innerHTML = `
    <div class="detail-page video-page">
      <div class="page-header">
        <button class="back-btn" onclick="history.back()">← Back</button>
        <h1>${title}</h1>
      </div>
      <div class="player-container"></div>
      ${progressText}
      <div class="video-info">
        <div class="chips-container">
          <div class="chip">HD</div>
          <div class="chip">Sports</div>
          ${isContinueWatching ? '<div class="chip">38% watched</div>' : '<div class="chip">New</div>'}
        </div>
        <p>Experience the full game with multiple camera angles and commentary options.</p>
      </div>
    </div>`;
  
  const playerContainer = main.querySelector('.player-container');
  const resumeTime = isContinueWatching ? '23:45' : '0:00';
  const progress = isContinueWatching ? 38 : 0;
  DVRControls.createPlayer(playerContainer, false, { 
    currentTime: resumeTime, 
    totalTime: '2:15:00', 
    progress: progress, 
    isPlaying: false 
  });
}

function showReelsPlayer(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page reels-page">
      <div class="global-nav">
        <button class="home-btn" onclick="window.location.href=getHomeUrl()">🏠</button>
        <button class="back-btn" onclick="history.back()">←</button>
      </div>
      <div class="reels-container">
        <div class="reel-stack" data-stack="0">
          <div class="reel-video active" data-index="0" style="background:linear-gradient(135deg, #ff6b6b, #4ecdc4)">
            <div class="reel-content">
              <div class="reel-title">${title}</div>
              <div class="reel-meta">0:15 • Clutch • NBA</div>
              <div class="reel-creator">@nba • Original audio</div>
            </div>
            <div class="reel-actions">
              <button class="reel-action">❤️<span>1.2k</span></button>
              <button class="reel-action">💬<span>89</span></button>
              <button class="reel-action">📤</button>
              <button class="reel-action">⋯</button>
            </div>
            <div class="reel-controls">
              <button class="play-pause-btn">⏸</button>
            </div>
          </div>
          <div class="reel-video" data-index="1" style="background:linear-gradient(135deg, #a8e6cf, #ffd93d)">
            <div class="reel-content">
              <div class="reel-title">Buzzer Beater • Final Second</div>
              <div class="reel-meta">0:12 • Buzzer Beater • Basketball</div>
              <div class="reel-creator">@espn • Original audio</div>
            </div>
            <div class="reel-actions">
              <button class="reel-action">❤️<span>856</span></button>
              <button class="reel-action">💬<span>45</span></button>
              <button class="reel-action">📤</button>
              <button class="reel-action">⋯</button>
            </div>
          </div>
          <div class="reel-video" data-index="2" style="background:linear-gradient(135deg, #ff9a9e, #fecfef)">
            <div class="reel-content">
              <div class="reel-title">Best Saves of the Week</div>
              <div class="reel-meta">0:30 • Highlights • Soccer</div>
              <div class="reel-creator">@fifa • Original audio</div>
            </div>
            <div class="reel-actions">
              <button class="reel-action">❤️<span>2.1k</span></button>
              <button class="reel-action">💬<span>156</span></button>
              <button class="reel-action">📤</button>
              <button class="reel-action">⋯</button>
            </div>
          </div>
        </div>
        <div class="reel-stack" data-stack="1">
          <div class="reel-video" data-index="0" style="background:linear-gradient(135deg, #667eea, #764ba2)">
            <div class="reel-content">
              <div class="reel-title">Behind the Scenes</div>
              <div class="reel-meta">1:23 • Exclusive • NFL</div>
              <div class="reel-creator">@nfl • Original audio</div>
            </div>
            <div class="reel-actions">
              <button class="reel-action">❤️<span>934</span></button>
              <button class="reel-action">💬<span>67</span></button>
              <button class="reel-action">📤</button>
              <button class="reel-action">⋯</button>
            </div>
          </div>
        </div>
      </div>
      <div class="reel-nav-hint">
        <div class="swipe-hint">↑ ↓ Browse • ← → Categories</div>
      </div>
    </div>`;
  
  setupReelsNavigation();
}

function showChannelPage(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page channel-page">
      <div class="page-header">
        <button class="back-btn" onclick="history.back()">← Back</button>
        <h1>${title}</h1>
        <div class="channel-status">Live Now: Sports Center</div>
      </div>
      <div class="player-container"></div>
      <div class="channel-schedule">
        <h3>Coming Up</h3>
        <div class="schedule-item">2:00 PM - Game Analysis</div>
        <div class="schedule-item">3:30 PM - Live Game</div>
        <div class="schedule-item">6:00 PM - Highlights Show</div>
      </div>
    </div>`;
  
  const playerContainer = main.querySelector('.player-container');
  DVRControls.createPlayer(playerContainer, true, { 
    currentTime: '1:23:45', 
    totalTime: '2:30:00', 
    progress: 55, 
    isPlaying: true 
  });
}

function showProfilePage(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page profile-page">
      <div class="page-header">
        <button class="back-btn" onclick="history.back()">← Back</button>
        <div class="profile-info">
          <div class="profile-avatar">${title.charAt(0)}</div>
          <div>
            <h1>${title}</h1>
            <div class="profile-stats">2.1M followers • 450 following</div>
          </div>
          <button class="follow-btn">Follow</button>
        </div>
      </div>
      <div class="profile-content">
        <div class="content-tabs">
          <div class="tab active">Videos</div>
          <div class="tab">Highlights</div>
          <div class="tab">Live</div>
        </div>
        <div class="profile-grid">
          <div class="profile-video">Recent Game</div>
          <div class="profile-video">Best Moments</div>
          <div class="profile-video">Training</div>
        </div>
      </div>
    </div>`;
}

function showShopPage(title, id) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="detail-page shop-page">
      <div class="page-header">
        <button class="back-btn" onclick="history.back()">← Back</button>
        <h1>${title}</h1>
      </div>
      <div class="product-showcase">
        <div class="product-image">📦</div>
        <div class="product-info">
          <h2>Official Team Jersey</h2>
          <div class="price">$89.99</div>
          <div class="chips-container">
            <div class="chip">Official</div>
            <div class="chip">Limited Edition</div>
            <div class="chip">Free Shipping</div>
          </div>
          <button class="shop-btn">Add to Cart</button>
        </div>
      </div>
    </div>`;
}

function page(title, body){
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
  <link rel="stylesheet" href="../assets/styles.css"></head><body>
  <header><h1>${title}</h1><div class="note">Use arrow keys or buttons. Toggle features in the bar above.</div></header>
  <main>${body}<div class="footer">Wireframe demo</div></main>
  <script src="../assets/app.js"></script></body></html>`;
}

// Enhanced reels navigation with horizontal/vertical swipe
function setupReelsNavigation() {
  const container = document.querySelector('.reels-container');
  if (!container) return;
  
  const stacks = Array.from(container.querySelectorAll('.reel-stack'));
  let currentStack = 0;
  let currentReel = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  
  function showStack(stackIndex) {
    stacks.forEach((stack, i) => {
      stack.style.transform = `translateX(${(i - stackIndex) * 100}%)`;
      stack.style.opacity = i === stackIndex ? '1' : '0.3';
    });
    currentStack = stackIndex;
    currentReel = 0; // Reset to first reel in new stack
    showReelInStack(0);
    if (Toggles.state.analytics) Console.log('reel_stack_change stack='+stackIndex);
  }
  
  function showReelInStack(reelIndex) {
    const currentStackEl = stacks[currentStack];
    if (!currentStackEl) return;
    
    const reels = Array.from(currentStackEl.querySelectorAll('.reel-video'));
    reels.forEach((reel, i) => {
      reel.classList.toggle('active', i === reelIndex);
      reel.style.transform = `translateY(${(i - reelIndex) * 100}%)`;
    });
    currentReel = reelIndex;
    if (Toggles.state.analytics) Console.log('reel_view stack='+currentStack+' reel='+reelIndex);
  }
  
  function nextStack() {
    if (currentStack < stacks.length - 1) showStack(currentStack + 1);
  }
  
  function prevStack() {
    if (currentStack > 0) showStack(currentStack - 1);
  }
  
  function nextReel() {
    const currentStackEl = stacks[currentStack];
    const reels = Array.from(currentStackEl.querySelectorAll('.reel-video'));
    if (currentReel < reels.length - 1) showReelInStack(currentReel + 1);
  }
  
  function prevReel() {
    if (currentReel > 0) showReelInStack(currentReel - 1);
  }
  
  // Touch events for mobile swipe (both directions)
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  });
  
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scroll
  });
  
  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = startX - endX;
    const deltaY = startY - endY;
    const threshold = 50;
    
    // Determine primary swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      // Horizontal swipe - change category/stack
      if (deltaX > 0) nextStack(); // Swipe left
      else prevStack(); // Swipe right
    } else if (Math.abs(deltaY) > threshold) {
      // Vertical swipe - change reel within stack
      if (deltaY > 0) nextReel(); // Swipe up
      else prevReel(); // Swipe down
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); prevReel(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); nextReel(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevStack(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nextStack(); }
  });
  
  // Initialize
  showStack(0);
}

// Collection filters functionality
function setupCollectionFilters() {
  const chips = document.querySelectorAll('.chips-filter-bar .chip');
  const items = document.querySelectorAll('.collection-item');
  
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active chip
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const filter = chip.getAttribute('data-filter');
      
      // Filter items
      items.forEach(item => {
        const type = item.getAttribute('data-type');
        const show = filter === 'all' || type === filter;
        item.style.display = show ? 'block' : 'none';
      });
      
      if (Toggles.state.analytics) Console.log('collection_filter filter='+filter);
    });
  });
}

// Hub tabs functionality
function setupHubTabs() {
  const tabs = document.querySelectorAll('.hub-tab');
  const panels = document.querySelectorAll('.hub-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show target panel
      panels.forEach(panel => {
        const panelType = panel.getAttribute('data-panel');
        panel.classList.toggle('active', panelType === targetPanel);
      });
      
      if (Toggles.state.analytics) Console.log('hub_tab_switch tab='+targetPanel);
    });
  });
}

function mount(){
  Console.init();
  // Toggles.mount(); // Disabled - no header to mount to
  document.querySelectorAll('.carousel:not(.hero-carousel)').forEach(setupCarousel);
  document.querySelectorAll('.hero-carousel').forEach(setupHeroCarousel);
  const main = document.querySelector('main') || document.body;
  injectPurpose(main, null);
}
document.addEventListener('DOMContentLoaded', mount);

// Rail-level visibility instrumentation
function observeRailsVisibility(container){
  if(!Toggles.state.analytics) return;
  const sections = Array.from(container.querySelectorAll('section.row'));
  const stateMap = new Map();
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      const sec = en.target;
      const railId = sec.getAttribute('data-rail-id') || '';
      const railType = sec.getAttribute('data-rail') || '';
      let st = stateMap.get(sec);
      if(!st){ st = { seen:false, visibleSince:0, totalMs:0 }; stateMap.set(sec, st); }
      if(en.isIntersecting){
        if(!st.seen){ Console.log('rail_impression rail_id='+railId+' type='+railType); st.seen=true; }
        if(!st.visibleSince){ st.visibleSince = performance.now(); }
      } else {
        if(st.visibleSince){
          const ms = performance.now() - st.visibleSince; st.totalMs += ms; st.visibleSince = 0;
          Console.log('rail_visible_ms rail_id='+railId+' type='+railType+' ms='+Math.round(ms));
        }
      }
    });
  }, { threshold: 0.25 });
  sections.forEach(sec=>io.observe(sec));
  window.addEventListener('beforeunload', ()=>{
    stateMap.forEach((st, sec)=>{
      if(st.visibleSince){
        const railId = sec.getAttribute('data-rail-id') || '';
        const railType = sec.getAttribute('data-rail') || '';
        const ms = performance.now() - st.visibleSince; st.visibleSince = 0;
        Console.log('rail_visible_ms rail_id='+railId+' type='+railType+' ms='+Math.round(ms));
      }
    });
  });
}
