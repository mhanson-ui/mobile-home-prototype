// Rail Engine - Core rendering and management system
// Extracted from app.js for modularity and maintainability

// Rail tokens (visual + behavioral) with varying heights based on content priority
// Five User Intent Paradigms: Continue, Discover, Explore, Decide, Upsell
const RailTokens = {
  // 1. CONTINUE → UTILITY CAROUSEL: Resume watching, shortcuts, ongoing engagement
  continue_watching: { intent: 'continue', silhouette: 'large', accent: '#4a90e2', motion: 'off', cta: 'Resume', height: 'xl', priority: 1 },
  live_now: { intent: 'continue', silhouette: 'landscape', accent: '#e60000', motion: 'ticker', cta: 'Watch Live', height: 'l', priority: 2 },
  starting_soon: { intent: 'continue', silhouette: 'landscape', accent: '#6a2be2', motion: 'countdown', cta: 'Notify', height: 'l', priority: 3 },
  
  // 2. DISCOVER → DISCOVERY CAROUSEL: Smaller, faster-browse tiles for scanning and finding new content
  for_you_mosaic: { intent: 'discover', silhouette: 'mosaic', accent: '#2c7be5', motion: 'quick', cta: 'Play', height: 'variable', priority: 4 },
  new_and_noteworthy: { intent: 'discover', silhouette: 'thumbnail', accent: '#b15a00', motion: 'quick', cta: 'Play', height: 'm', priority: 6 },
  trending: { intent: 'discover', silhouette: 'thumbnail', accent: '#ff3366', motion: 'quick', cta: 'Play', height: 'm', priority: 7 },
  channel_surf: { intent: 'discover', silhouette: 'square', accent: '#555', motion: 'quick', cta: 'Watch', height: 's', priority: 11 },
  expiring_soon: { intent: 'discover', silhouette: 'thumbnail', accent: '#b15a00', motion: 'quick', cta: 'Play', height: 'm', priority: 12 },
  people_suggestion: { intent: 'discover', silhouette: 'circle', accent: '#0e7c86', motion: 'quick', cta: 'Follow', height: 'm', priority: 13 },
  
  // 3. EXPLORE → CLUSTER CAROUSEL: Grouped by theme, mood, or pack for diving into particular areas
  collections_packs: { intent: 'explore', silhouette: 'stack', accent: '#333', motion: 'hover', cta: 'Explore', height: 'l', priority: 8 },
  team_league_hubs: { intent: 'explore', silhouette: 'large', accent: '#ff6600', motion: 'hover', cta: 'Explore Hub', height: 'l', priority: 8 },
  
  // 4. DECIDE → HERO CAROUSEL: Oversized, motion-rich cards with presence and context for picking one thing
  hero_spotlight: { intent: 'decide', silhouette: 'hero', accent: '#111', motion: 'preview', cta: 'Watch Now', height: 'xxl', priority: 0 },
  editorial_hero: { intent: 'decide', silhouette: 'editorial', accent: '#111', motion: 'preview', cta: 'Read More', height: 'xl', priority: 1 },
  
  // 5. UPSELL → EDITORIAL CAROUSEL: Curated blends for nudging toward premium, add-ons, cross-sell
  because_you_watched: { intent: 'upsell', silhouette: 'mixed', accent: '#0e7c86', motion: 'focus', cta: 'Watch Similar', height: 'l', priority: 5 },
  highlights_reels: { intent: 'upsell', silhouette: 'poster', accent: '#111', motion: 'focus', cta: 'Watch Full Game', height: 'xl', priority: 9 },
  reels_grid: { intent: 'upsell', silhouette: 'grid', accent: '#111', motion: 'focus', cta: 'See More Reels', height: 'xl', priority: 10 },
  sponsored_shop: { intent: 'upsell', silhouette: 'product', accent: '#006644', motion: 'hover', cta: 'Shop Now', height: 'l', priority: 14 }
};

// Rail priority system for proper ordering
const RailPriority = {
  hero_spotlight: 0,
  editorial_hero: 1,
  continue_watching: 2,
  live_now: 3,
  starting_soon: 4,
  for_you_mosaic: 5,
  because_you_watched: 6,
  new_and_noteworthy: 7,
  collections_packs: 8,
  team_league_hubs: 9,
  highlights_reels: 10,
  reels_grid: 11,
  channel_surf: 12,
  expiring_soon: 13,
  people_suggestion: 14,
  sponsored_shop: 15
};

// Purpose copy for rail explanations
const PurposeCopy = {
  'Hero Spotlight': {
    purpose: 'Campaign presence with cycling thumbnails and hero treatment',
    rationale: 'Disney+ style hero carousel for major content launches and campaigns'
  },
  'Editorial Hero': {
    purpose: 'Editorial content with rich metadata and curator attribution',
    rationale: 'Large editorial cards for featured content and curated experiences'
  },
  'Continue Watching': {
    purpose: 'Resume progress with smart deduplication and progress tracking',
    rationale: 'Utility carousel for ongoing engagement and quick resume'
  },
  'Live Now': {
    purpose: 'Real-time content with live indicators and ticker animations',
    rationale: 'Live content discovery with urgency and real-time updates'
  },
  'Starting Soon': {
    purpose: 'Upcoming content with countdown timers and notification CTAs',
    rationale: 'Planning utility for scheduled content and appointment viewing'
  },
  'Because You Watched': {
    purpose: 'AI-powered recommendations based on viewing history',
    rationale: 'Personalized discovery using machine learning and user behavior'
  },
  'New & Noteworthy': {
    purpose: 'Fresh content discovery with new badges and recency indicators',
    rationale: 'Discovery carousel for latest releases and trending content'
  },
  'Trending': {
    purpose: 'Popular content aggregation with social proof indicators',
    rationale: 'Social discovery based on popularity and community engagement'
  },
  'For You Mosaic': {
    purpose: 'Mixed-size discovery grid for varied content exploration',
    rationale: 'Fast-scanning discovery with visual variety and quick browsing'
  },
  'Collections & Packs': {
    purpose: 'Themed content groupings with curator attribution',
    rationale: 'Exploration carousel for diving into specific content areas'
  },
  'Team/League Hubs': {
    purpose: 'Sports-specific navigation with comprehensive team coverage',
    rationale: 'Sports optimization for team loyalty and league engagement'
  },
  'Highlights & Reels': {
    purpose: 'Short-form vertical content with full-game CTAs',
    rationale: 'Upsell carousel for converting highlights to full content'
  },
  'Reels Grid': {
    purpose: 'Multi-column short-form layout for content discovery',
    rationale: 'Grid-based discovery for efficient short-form browsing'
  },
  'Channel Surf': {
    purpose: 'Network/channel browsing with quick access patterns',
    rationale: 'Discovery carousel for network loyalty and channel exploration'
  },
  'Expiring Soon': {
    purpose: 'Time-sensitive content with urgency indicators',
    rationale: 'Discovery carousel for limited-time content and FOMO'
  },
  'People Suggestion': {
    purpose: 'Creator/person discovery with follow CTAs',
    rationale: 'Social discovery for creator loyalty and content exploration'
  },
  'Sponsored Shop': {
    purpose: 'Curated blends for premium content and cross-selling',
    rationale: 'Upsell carousel for monetization and content promotion'
  }
};

// Core rail rendering functions
const RailEngine = {
  // Sort rails by priority for proper ordering
  sortRailsByPriority(rails) {
    return (rails || []).slice().sort((a, b) => {
      const pa = RailPriority[a.type] || 999;
      const pb = RailPriority[b.type] || 999;
      return pa - pb;
    });
  },

  // Apply ownership deduplication across rails
  applyOwnershipDedupe(container, options = {}) {
    const { enabled = true, viewportAware = true } = options;
    if (!enabled) return 0;
    
    const railSections = Array.from(container.querySelectorAll('section.row'));
    const viewportHeight = window.innerHeight || 800;
    let dedupeCount = 0;
    
    railSections.forEach((section, idx) => {
      const prior = railSections.slice(0, idx);
      const visiblePrior = viewportAware ? prior.filter(sec => {
        const r = sec.getBoundingClientRect();
        return r.bottom > 0; // if entirely above viewport, it no longer owns
      }) : prior;
      
      const owned = new Set();
      visiblePrior.forEach(sec => {
        sec.querySelectorAll('.card').forEach(card => {
          const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent.trim();
          if (id) owned.add(id);
        });
      });
      
      section.querySelectorAll('.card').forEach(card => {
        const id = card.getAttribute('data-id') || card.querySelector('.meta')?.textContent.trim();
        if (!id) return;
        if (owned.has(id)) {
          card.classList.add('suppressed');
          const meta = card.querySelector('.meta');
          if (meta && !meta.textContent.includes('Also in')) {
            meta.textContent += ' • Also in another rail';
          }
          dedupeCount++;
        } else {
          card.classList.remove('suppressed');
        }
      });
    });
    
    return dedupeCount;
  },

  // Get rail configuration by type
  getRailConfig(type) {
    return RailTokens[type] || {
      intent: 'unknown',
      silhouette: 'thumbnail',
      accent: '#999',
      motion: 'off',
      cta: 'Play',
      height: 'm',
      priority: 999
    };
  },

  // Get purpose information for a rail
  getRailPurpose(railType, title) {
    if (PurposeCopy[title]) {
      return PurposeCopy[title];
    }
    return PurposeCopy[Object.keys(PurposeCopy).find(key => 
      key.toLowerCase().includes(railType.replace(/_/g, ' ').toLowerCase())
    )] || null;
  },

  // Validate rail data structure
  validateRailData(rail) {
    const required = ['type', 'items'];
    const missing = required.filter(field => !rail[field]);
    
    if (missing.length > 0) {
      console.warn(`Rail missing required fields: ${missing.join(', ')}`, rail);
      return false;
    }
    
    if (!Array.isArray(rail.items) || rail.items.length === 0) {
      console.warn(`Rail has no items: ${rail.type}`, rail);
      return false;
    }
    
    return true;
  },

  // Get all rail types for debugging and development
  getAllRailTypes() {
    return Object.keys(RailTokens);
  },

  // Get rail statistics for analytics
  getRailStats(rails) {
    const stats = {
      total: rails.length,
      byIntent: {},
      byHeight: {},
      byMotion: {}
    };
    
    rails.forEach(rail => {
      const config = this.getRailConfig(rail.type);
      
      // Count by intent
      stats.byIntent[config.intent] = (stats.byIntent[config.intent] || 0) + 1;
      
      // Count by height
      stats.byHeight[config.height] = (stats.byHeight[config.height] || 0) + 1;
      
      // Count by motion
      stats.byMotion[config.motion] = (stats.byMotion[config.motion] || 0) + 1;
    });
    
    return stats;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RailEngine, RailTokens, RailPriority, PurposeCopy };
} else {
  // Browser global
  window.RailEngine = RailEngine;
  window.RailTokens = RailTokens;
  window.RailPriority = RailPriority;
  window.PurposeCopy = PurposeCopy;
}
