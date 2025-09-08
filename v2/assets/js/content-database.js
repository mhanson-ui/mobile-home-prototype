// Content Database Module - Manages content data from CSV
export class ContentDatabase {
  constructor() {
    this.content = [];
    this.loaded = false;
  }

  async load() {
    try {
      const response = await fetch('/v2/assets/content-database.csv');
      const csvText = await response.text();
      this.content = this.parseCSV(csvText);
      this.loaded = true;
      console.log('Content database loaded:', this.content.length, 'items');
    } catch (error) {
      console.error('Failed to load content database:', error);
    }
  }

  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const content = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const item = {};
      
      headers.forEach((header, index) => {
        let value = values[index];
        
        // Convert boolean strings
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        
        // Convert numbers
        else if (!isNaN(value) && value !== '') value = parseInt(value);
        
        item[header] = value;
      });
      
      content.push(item);
    }

    return content;
  }

  parseCSVLine(line) {
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

  getContentForRail(railDef, genreFilter = 'all') {
    let filtered = [...this.content];

    // Apply genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.genre === genreFilter || 
        item.subgenre === genreFilter ||
        item.tags?.includes(genreFilter)
      );
    }

    // Filter by rail type
    switch(railDef.id) {
      case 'continue_watching':
        return filtered.filter(item => item.progress > 0 && item.progress < 100);
      
      case 'currently_live':
      case 'live_now':
      case 'live_channels':
        return filtered.filter(item => item.is_live === true);
      
      case 'upcoming_games':
      case 'todays_games':
        return filtered.filter(item => 
          item.type === 'sports' && !item.is_live && 
          (item.tags?.includes('upcoming') || item.subgenre === 'sports')
        );
      
      case 'featured_picks':
      case 'editorial_picks':
      case 'recommended':
        return filtered.filter(item => 
          item.thumbnail_key?.startsWith('editorial/') || 
          item.rating === 'TV-MA' || 
          item.year >= 2023
        );
      
      case 'gamestream':
      case 'highlights':
      case 'reels_grid':
        return filtered.filter(item => 
          item.duration <= 30 || 
          item.thumbnail_key?.startsWith('gamestream/') ||
          item.tags?.includes('highlights')
        );
      
      case 'trending':
      case 'trending_near_you':
        return filtered.filter(item => 
          item.thumbnail_key?.startsWith('trending/') ||
          item.is_new === true
        );
      
      case 'collections_packs':
        return filtered.filter(item => 
          item.thumbnail_key?.startsWith('collections/') ||
          item.type === 'tv'
        );
      
      case 'sponsored_shop':
        return filtered.filter(item => 
          item.thumbnail_key?.startsWith('sponsored/') ||
          item.tags?.includes('ppv')
        );
      
      case 'recordings':
        return filtered.filter(item => 
          item.type === 'tv' || item.type === 'movie'
        ).slice(0, 10);
      
      case 'new_and_noteworthy':
        return filtered.filter(item => item.is_new === true);
      
      case 'expiring_soon':
        return filtered.filter(item => item.is_expiring === true);
      
      default:
        return filtered.slice(0, 12); // Default to first 12 items
    }
  }

  getGenres() {
    const genres = new Set();
    this.content.forEach(item => {
      if (item.genre) genres.add(item.genre);
      if (item.subgenre) genres.add(item.subgenre);
    });
    return Array.from(genres).sort();
  }

  getContentById(id) {
    return this.content.find(item => item.id === id);
  }
}
