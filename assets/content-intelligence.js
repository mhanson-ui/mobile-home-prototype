// Content Intelligence System
// Smart content filtering, recommendations, and dynamic rail ordering

const ContentIntelligence = {
  // Enhanced chip system with filtering capabilities
  chips: {
    // Chip categories with metadata
    categories: {
      sports: {
        label: 'Sports',
        chips: ['Live', 'Highlights', 'Full Game', 'Team', 'League', 'Player', 'Championship', 'Playoff'],
        color: '#e60000',
        priority: 1
      },
      content: {
        label: 'Content',
        chips: ['New', 'Trending', 'Award Winner', '4K', 'HDR', 'Expiring', 'Exclusive', 'Original'],
        color: '#2c7be5',
        priority: 2
      },
      genre: {
        label: 'Genre',
        chips: ['Action', 'Drama', 'Comedy', 'Documentary', 'Sports', 'News', 'Reality', 'Animation'],
        color: '#b15a00',
        priority: 3
      },
      time: {
        label: 'Duration',
        chips: ['Under 30min', '30-60min', '1-2hrs', '2hrs+', 'Series', 'Movie', 'Episode'],
        color: '#6a2be2',
        priority: 4
      },
      rating: {
        label: 'Rating',
        chips: ['G', 'PG', 'PG-13', 'R', 'TV-MA', 'TV-Y', 'TV-Y7', 'TV-G'],
        color: '#0e7c86',
        priority: 5
      },
      quality: {
        label: 'Quality',
        chips: ['HD', '4K', 'HDR', 'Dolby Vision', 'Dolby Atmos', 'IMAX', 'Ultra HD'],
        color: '#ff6600',
        priority: 6
      }
    },

    // Get chips for a specific content item
    getChipsForContent: (item) => {
      const chips = [];
      
      // Extract chips from item properties
      if (item.badges) {
        chips.push(...item.badges.map(badge => ({ text: badge, category: 'content', source: 'badge' })));
      }
      
      if (item.chips) {
        chips.push(...item.chips.map(chip => ({ text: chip, category: 'custom', source: 'chip' })));
      }
      
      // Generate chips from other properties
      if (item.progress !== undefined) {
        chips.push({ text: `${item.progress}% Complete`, category: 'progress', source: 'calculated' });
      }
      
      if (item.runtime) {
        chips.push({ text: item.runtime, category: 'time', source: 'runtime' });
      }
      
      if (item.season && item.episode) {
        chips.push({ text: `S${item.season}E${item.episode}`, category: 'content', source: 'calculated' });
      }
      
      return chips;
    },

    // Filter content by chips
    filterByChips: (items, selectedChips) => {
      if (!selectedChips || selectedChips.length === 0) return items;
      
      return items.filter(item => {
        const itemChips = ContentIntelligence.chips.getChipsForContent(item);
        const itemChipTexts = itemChips.map(chip => chip.text.toLowerCase());
        
        return selectedChips.some(selectedChip => 
          itemChipTexts.some(itemChip => 
            itemChip.includes(selectedChip.toLowerCase()) || 
            selectedChip.toLowerCase().includes(itemChip)
          )
        );
      });
    },

    // Get chip suggestions based on content
    getSuggestions: (items, maxSuggestions = 10) => {
      const allChips = new Map();
      
      items.forEach(item => {
        const chips = ContentIntelligence.chips.getChipsForContent(item);
        chips.forEach(chip => {
          const key = chip.text.toLowerCase();
          if (allChips.has(key)) {
            allChips.get(key).count++;
          } else {
            allChips.set(key, { ...chip, count: 1 });
          }
        });
      });
      
      // Sort by frequency and return top suggestions
      return Array.from(allChips.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, maxSuggestions);
    }
  },

  // Smart content deduplication based on similarity
  deduplication: {
    // Calculate content similarity score (0-1)
    calculateSimilarity: (item1, item2) => {
      let score = 0;
      let factors = 0;
      
      // Title similarity
      if (item1.title && item2.title) {
        const title1 = item1.title.toLowerCase();
        const title2 = item2.title.toLowerCase();
        
        if (title1 === title2) {
          score += 1;
        } else if (title1.includes(title2) || title2.includes(title1)) {
          score += 0.8;
        } else {
          // Word overlap
          const words1 = title1.split(/\s+/);
          const words2 = title2.split(/\s+/);
          const commonWords = words1.filter(word => words2.includes(word));
          score += (commonWords.length / Math.max(words1.length, words2.length)) * 0.6;
        }
        factors++;
      }
      
      // Genre similarity
      if (item1.genre && item2.genre) {
        const genre1 = item1.genre.toLowerCase();
        const genre2 = item2.genre.toLowerCase();
        
        if (genre1 === genre2) {
          score += 1;
        } else if (genre1.includes(genre2) || genre2.includes(genre1)) {
          score += 0.7;
        }
        factors++;
      }
      
      // Runtime similarity
      if (item1.runtime && item2.runtime) {
        const runtime1 = ContentIntelligence.deduplication.parseRuntime(item1.runtime);
        const runtime2 = ContentIntelligence.deduplication.parseRuntime(item2.runtime);
        
        if (runtime1 && runtime2) {
          const diff = Math.abs(runtime1 - runtime2);
          const maxRuntime = Math.max(runtime1, runtime2);
          score += Math.max(0, 1 - (diff / maxRuntime));
          factors++;
        }
      }
      
      // Image similarity (placeholder for future ML implementation)
      if (item1.image && item2.image && item1.image === item2.image) {
        score += 1;
        factors++;
      }
      
      return factors > 0 ? score / factors : 0;
    },

    // Parse runtime string to minutes
    parseRuntime: (runtime) => {
      if (typeof runtime === 'number') return runtime;
      
      const match = runtime.match(/(\d+)h\s*(\d+)?m?/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        return hours * 60 + minutes;
      }
      
      const minuteMatch = runtime.match(/(\d+)m/);
      if (minuteMatch) {
        return parseInt(minuteMatch[1]);
      }
      
      return null;
    },

    // Apply smart deduplication
    applySmartDedupe: (rails, similarityThreshold = 0.7) => {
      const allItems = [];
      const itemToRail = new Map();
      
      // Collect all items with their rail information
      rails.forEach(rail => {
        rail.items.forEach(item => {
          allItems.push(item);
          itemToRail.set(item.id, rail.type);
        });
      });
      
      const duplicates = [];
      
      // Find similar items
      for (let i = 0; i < allItems.length; i++) {
        for (let j = i + 1; j < allItems.length; j++) {
          const similarity = ContentIntelligence.deduplication.calculateSimilarity(allItems[i], allItems[j]);
          
          if (similarity >= similarityThreshold) {
            duplicates.push({
              item1: allItems[i],
              item2: allItems[j],
              similarity: similarity,
              rail1: itemToRail.get(allItems[i].id),
              rail2: itemToRail.get(allItems[j].id)
            });
          }
        }
      }
      
      // Sort duplicates by similarity and rail priority
      duplicates.sort((a, b) => {
        if (Math.abs(a.similarity - b.similarity) > 0.1) {
          return b.similarity - a.similarity;
        }
        
        // If similarity is close, prioritize by rail priority
        const priority1 = RailPriority[a.rail1] || 999;
        const priority2 = RailPriority[b.rail2] || 999;
        return priority1 - priority2;
      });
      
      return duplicates;
    }
  },

  // Dynamic rail ordering based on user behavior and content relevance
  ordering: {
    // User behavior tracking
    userBehavior: {
      clicks: new Map(),
      views: new Map(),
      timeSpent: new Map(),
      
      // Track user interaction
      trackClick: (railType, itemId) => {
        const key = `${railType}_${itemId}`;
        const current = ContentIntelligence.ordering.userBehavior.clicks.get(key) || 0;
        ContentIntelligence.ordering.userBehavior.clicks.set(key, current + 1);
      },
      
      trackView: (railType, itemId, duration = 1) => {
        const key = `${railType}_${itemId}`;
        const current = ContentIntelligence.ordering.userBehavior.views.get(key) || 0;
        ContentIntelligence.ordering.userBehavior.views.set(key, current + duration);
      },
      
      trackTimeSpent: (railType, itemId, seconds) => {
        const key = `${railType}_${itemId}`;
        const current = ContentIntelligence.ordering.userBehavior.timeSpent.get(key) || 0;
        ContentIntelligence.ordering.userBehavior.timeSpent.set(key, current + seconds);
      }
    },

    // Calculate rail relevance score
    calculateRailRelevance: (rail, userBehavior) => {
      let score = 0;
      
      // Base priority score
      const basePriority = RailPriority[rail.type] || 999;
      score += (100 - basePriority) * 0.3;
      
      // User engagement score
      const engagementScore = rail.items.reduce((total, item) => {
        const key = `${rail.type}_${item.id}`;
        const clicks = userBehavior.clicks.get(key) || 0;
        const views = userBehavior.views.get(key) || 0;
        const timeSpent = userBehavior.timeSpent.get(key) || 0;
        
        return total + (clicks * 2) + views + (timeSpent / 60);
      }, 0);
      
      score += Math.min(engagementScore * 0.2, 30);
      
      // Content freshness score
      const freshnessScore = rail.items.reduce((total, item) => {
        if (item.badges && item.badges.includes('NEW')) {
          return total + 10;
        }
        if (item.badges && item.badges.includes('Trending')) {
          return total + 5;
        }
        return total;
      }, 0);
      
      score += Math.min(freshnessScore, 20);
      
      // Time-based relevance
      const now = new Date();
      if (rail.type === 'live_now') {
        score += 25; // Live content gets boost
      }
      if (rail.type === 'starting_soon') {
        const timeBoost = rail.items.reduce((total, item) => {
          if (item.startTime) {
            const startTime = new Date(item.startTime);
            const timeUntilStart = startTime - now;
            if (timeUntilStart > 0 && timeUntilStart < 3600000) { // Within 1 hour
              return total + 15;
            }
          }
          return total;
        }, 0);
        score += timeBoost;
      }
      
      return Math.round(score);
    },

    // Reorder rails based on relevance
    reorderRailsByRelevance: (rails) => {
      const userBehavior = ContentIntelligence.ordering.userBehavior;
      
      return rails.map(rail => ({
        ...rail,
        relevanceScore: ContentIntelligence.ordering.calculateRailRelevance(rail, userBehavior)
      })).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
  },

  // Content recommendations based on user behavior
  recommendations: {
    // Generate personalized recommendations
    generateRecommendations: (userHistory, availableContent, maxRecommendations = 10) => {
      const recommendations = [];
      const userPreferences = ContentIntelligence.recommendations.analyzeUserPreferences(userHistory);
      
      // Score each available content item
      const scoredContent = availableContent.map(item => {
        const score = ContentIntelligence.recommendations.calculateRecommendationScore(item, userPreferences);
        return { ...item, recommendationScore: score };
      });
      
      // Sort by score and return top recommendations
      return scoredContent
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, maxRecommendations);
    },

    // Analyze user preferences from history
    analyzeUserPreferences: (userHistory) => {
      const preferences = {
        genres: new Map(),
        contentTypes: new Map(),
        durations: new Map(),
        quality: new Map()
      };
      
      userHistory.forEach(item => {
        // Genre preferences
        if (item.genre) {
          const current = preferences.genres.get(item.genre) || 0;
          preferences.genres.set(item.genre, current + 1);
        }
        
        // Content type preferences
        if (item.type) {
          const current = preferences.contentTypes.get(item.type) || 0;
          preferences.contentTypes.set(item.type, current + 1);
        }
        
        // Duration preferences
        if (item.runtime) {
          const duration = ContentIntelligence.deduplication.parseRuntime(item.runtime);
          if (duration) {
            let durationCategory = 'short';
            if (duration > 120) durationCategory = 'long';
            else if (duration > 60) durationCategory = 'medium';
            
            const current = preferences.durations.get(durationCategory) || 0;
            preferences.durations.set(durationCategory, current + 1);
          }
        }
        
        // Quality preferences
        if (item.badges) {
          item.badges.forEach(badge => {
            if (['4K', 'HDR', 'Dolby Vision'].includes(badge)) {
              const current = preferences.quality.get(badge) || 0;
              preferences.quality.set(badge, current + 1);
            }
          });
        }
      });
      
      return preferences;
    },

    // Calculate recommendation score for an item
    calculateRecommendationScore: (item, userPreferences) => {
      let score = 0;
      
      // Genre match
      if (item.genre && userPreferences.genres.has(item.genre)) {
        score += userPreferences.genres.get(item.genre) * 2;
      }
      
      // Content type match
      if (item.type && userPreferences.contentTypes.has(item.type)) {
        score += userPreferences.contentTypes.get(item.type) * 1.5;
      }
      
      // Duration match
      if (item.runtime) {
        const duration = ContentIntelligence.deduplication.parseRuntime(item.runtime);
        if (duration) {
          let durationCategory = 'short';
          if (duration > 120) durationCategory = 'long';
          else if (duration > 60) durationCategory = 'medium';
          
          if (userPreferences.durations.has(durationCategory)) {
            score += userPreferences.durations.get(durationCategory);
          }
        }
      }
      
      // Quality match
      if (item.badges) {
        item.badges.forEach(badge => {
          if (userPreferences.quality.has(badge)) {
            score += userPreferences.quality.get(badge) * 0.5;
          }
        });
      }
      
      // Recency bonus
      if (item.badges && item.badges.includes('NEW')) {
        score += 5;
      }
      
      // Popularity bonus
      if (item.badges && item.badges.includes('Trending')) {
        score += 3;
      }
      
      return score;
    }
  },

  // Performance analytics for content and rails
  analytics: {
    // Track rail performance metrics
    railMetrics: new Map(),
    
    // Start tracking a rail
    startTracking: (railType, railId) => {
      const key = `${railType}_${railId}`;
      ContentIntelligence.analytics.railMetrics.set(key, {
        startTime: Date.now(),
        impressions: 0,
        clicks: 0,
        timeVisible: 0,
        scrollDepth: 0
      });
    },
    
    // Track rail impression
    trackImpression: (railType, railId) => {
      const key = `${railType}_${railId}`;
      const metrics = ContentIntelligence.analytics.railMetrics.get(key);
      if (metrics) {
        metrics.impressions++;
      }
    },
    
    // Track rail click
    trackClick: (railType, railId) => {
      const key = `${railType}_${railId}`;
      const metrics = ContentIntelligence.analytics.railMetrics.get(key);
      if (metrics) {
        metrics.clicks++;
      }
    },
    
    // Track rail visibility time
    trackVisibility: (railType, railId, duration) => {
      const key = `${railType}_${railId}`;
      const metrics = ContentIntelligence.analytics.railMetrics.get(key);
      if (metrics) {
        metrics.timeVisible += duration;
      }
    },
    
    // Get rail performance report
    getRailReport: (railType, railId) => {
      const key = `${railType}_${railId}`;
      const metrics = ContentIntelligence.analytics.railMetrics.get(key);
      
      if (!metrics) return null;
      
      const totalTime = Date.now() - metrics.startTime;
      const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
      const avgTimeVisible = metrics.impressions > 0 ? metrics.timeVisible / metrics.impressions : 0;
      
      return {
        railType,
        railId,
        impressions: metrics.impressions,
        clicks: metrics.clicks,
        ctr: Math.round(ctr * 100) / 100,
        avgTimeVisible: Math.round(avgTimeVisible),
        totalTime: Math.round(totalTime / 1000),
        engagement: Math.round((ctr * avgTimeVisible) / 100)
      };
    },
    
    // Get overall performance summary
    getPerformanceSummary: () => {
      const summary = {
        totalRails: ContentIntelligence.analytics.railMetrics.size,
        totalImpressions: 0,
        totalClicks: 0,
        avgCTR: 0,
        topPerformingRails: []
      };
      
      const railReports = [];
      
      ContentIntelligence.analytics.railMetrics.forEach((metrics, key) => {
        const [railType, railId] = key.split('_');
        const report = ContentIntelligence.analytics.getRailReport(railType, railId);
        if (report) {
          railReports.push(report);
          summary.totalImpressions += report.impressions;
          summary.totalClicks += report.clicks;
        }
      });
      
      summary.avgCTR = summary.totalImpressions > 0 ? 
        (summary.totalClicks / summary.totalImpressions) * 100 : 0;
      
      summary.topPerformingRails = railReports
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);
      
      return summary;
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentIntelligence;
} else {
  // Browser global
  window.ContentIntelligence = ContentIntelligence;
}
