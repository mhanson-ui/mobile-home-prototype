# Rail Management Guide
## How to Add, Remove, and Reorder Rails in the Mobile Home Prototype

This guide explains how to use the built-in rail management system in the Mobile Home Prototype to customize your content layout.

## Overview

The prototype includes an **Inline Rail Controls** system that allows you to:
- **Add** new rails from a predefined set of rail types
- **Remove** existing rails (hide them from view)
- **Reorder** rails by moving them up or down in the layout
- **Duplicate** rails to create multiple instances of the same type

## Accessing Rail Controls

### 1. Enable Debug Mode
The rail controls are part of the debug panel. To access them:

1. Open the prototype in your browser
2. Look for the **🔧 Debug Panel** in the top-right corner
3. If not visible, the controls may be automatically injected into each rail

### 2. Rail Control Buttons
Each rail will display control buttons in its header:
- **↑** (Move Up) - Move this rail one position higher
- **↓** (Move Down) - Move this rail one position lower  
- **×** (Remove) - Hide this rail from view
- **+ Add Rail** - Add a new rail after this one

## Available Rail Types

The prototype includes 20+ predefined rail types organized by user intent:

### 🎯 DECIDE (Hero Carousels)
- **Hero Spotlight** - Campaign presence with cycling thumbnails
- **Editorial Hero** - Editorial content with rich metadata

### 🔄 CONTINUE (Utility Carousels)
- **Continue Watching** - Resume progress with smart deduplication
- **Live Now** - Real-time content with live indicators
- **Starting Soon** - Upcoming content with countdown timers

### 🔍 DISCOVER (Discovery Carousels)
- **For You Mosaic** - Mixed-size discovery grid
- **New & Noteworthy** - Fresh content with new badges
- **Trending Near You** - Popular content aggregation
- **Channel Surf** - Browse channels
- **Expiring Soon** - Content leaving soon
- **People Suggestion** - Suggested profiles

### 🗂️ EXPLORE (Cluster Carousels)
- **Collections & Packs** - Themed content groupings
- **Teams & Leagues** - Sports-specific navigation

### 💰 UPSELL (Editorial Carousels)
- **Because You Watched** - AI-powered recommendations
- **Highlights & Reels** - Short-form highlights
- **Reels Grid** - Grid layout for reels
- **Sponsored Shop** - Shopping content

## How to Add Rails

### Method 1: Using the Add Rail Button
1. Find the **+ Add Rail** button below any existing rail
2. Click the button to open the rail selection dropdown
3. Choose the rail type you want to add
4. The new rail will be inserted after the selected rail

### Method 2: Programmatically
```javascript
// Add a specific rail type after another rail
InlineRailControls.addRail('trending', 'continue_watching');

// Add a rail at the end
InlineRailControls.addRail('hero_spotlight', null);
```

### Method 3: Using Templates
The system automatically uses predefined templates for new rails:
- Each rail type has a default template with sample content
- Templates include proper styling, metadata, and structure
- New rails get unique IDs to avoid conflicts

## How to Remove Rails

### Method 1: Using the Remove Button
1. Find the **×** (Remove) button in the rail header
2. Click to hide the rail from view
3. The rail is hidden but not deleted (can be restored)

### Method 2: Programmatically
```javascript
// Remove a specific rail type
InlineRailControls.removeRail('trending');

// Remove multiple rails
['trending', 'channel_surf'].forEach(type => 
  InlineRailControls.removeRail(type)
);
```

### Method 3: CSS Hiding
```css
/* Hide specific rail types */
[data-rail="trending"] { display: none; }
[data-rail="sponsored_shop"] { display: none; }
```

## How to Reorder Rails

### Method 1: Using Move Buttons
1. Find the **↑** (Move Up) or **↓** (Move Down) buttons in the rail header
2. Click to move the rail one position in that direction
3. The rail will be repositioned in the DOM

### Method 2: Programmatically
```javascript
// Move a rail up
InlineRailControls.moveUp('trending');

// Move a rail down
InlineRailControls.moveDown('continue_watching');
```

### Method 3: Manual DOM Manipulation
```javascript
// Get rail elements
const rail = document.querySelector('[data-rail="trending"]');
const targetRail = document.querySelector('[data-rail="hero_spotlight"]');

// Move rail before target
targetRail.parentNode.insertBefore(rail, targetRail);
```

## Rail Priority System

The prototype includes a built-in priority system that automatically orders rails by importance:

### Priority Levels
- **0**: Hero Spotlight (highest priority)
- **1**: Editorial Hero, Continue Watching
- **2-3**: Live Now, Starting Soon
- **4-7**: For You Mosaic, Because You Watched, New & Noteworthy
- **8-9**: Collections & Packs, Teams & Leagues
- **10-15**: Highlights & Reels, Channel Surf, Expiring Soon, etc.

### Automatic Sorting
```javascript
// Sort rails by priority
const sortedRails = RailEngine.sortRailsByPriority(rails);

// Get rail configuration
const config = RailEngine.getRailConfig('trending');
console.log(config.priority); // 7
```

## Advanced Features

### Rail Deduplication
The system automatically detects and handles duplicate content across rails:
- Content appearing in multiple rails gets visual indicators
- "Also in another rail" badges are added
- Deduplication can be toggled on/off

### Content Intelligence
```javascript
// Get rail statistics
const stats = RailEngine.getRailStats(rails);
console.log(stats.byIntent); // Count by user intent
console.log(stats.byHeight); // Count by visual height
console.log(stats.byMotion); // Count by motion type
```

### Custom Rail Creation
You can create custom rails by extending the system:
```javascript
// Add custom rail type
RailTokens.custom_rail = {
  intent: 'discover',
  silhouette: 'custom',
  accent: '#ff0000',
  motion: 'hover',
  cta: 'Custom Action',
  height: 'm',
  priority: 20
};

// Add to available rails
InlineRailControls.availableRails.custom_rail = 'Custom Rail';
```

## Best Practices

### 1. Rail Ordering
- Keep hero/editorial rails at the top
- Group utility rails (continue, live, starting) together
- Place discovery rails in the middle
- Put upsell rails near the bottom

### 2. Content Variety
- Mix different rail types for visual interest
- Avoid too many similar rails in sequence
- Use mosaic and grid layouts to break up monotony

### 3. Performance
- Limit total number of rails (recommended: 10-15)
- Use lazy loading for off-screen content
- Monitor rail visibility for analytics

### 4. Accessibility
- Each rail has proper ARIA labels
- Navigation controls are keyboard accessible
- Screen reader friendly structure

## Troubleshooting

### Common Issues

**Rails not appearing:**
- Check if debug mode is enabled
- Verify rail controls are injected
- Check browser console for errors

**Controls not working:**
- Ensure JavaScript is loaded
- Check for conflicting CSS
- Verify DOM structure integrity

**Performance issues:**
- Reduce number of visible rails
- Enable viewport-aware optimizations
- Use lazy loading for content

### Debug Tools
```javascript
// Check rail count
console.log(document.querySelectorAll('[data-rail]').length);

// Verify rail structure
console.log(RailEngine.getAllRailTypes());

// Test rail functions
InlineRailControls.addRail('trending', 'continue_watching');
```

## Examples

### Complete Rail Management Session
```javascript
// 1. Add a trending rail after continue watching
InlineRailControls.addRail('trending', 'continue_watching');

// 2. Move the new trending rail up one position
InlineRailControls.moveUp('trending');

// 3. Add a hero spotlight at the top
InlineRailControls.addRail('hero_spotlight', null);

// 4. Remove the sponsored shop rail
InlineRailControls.removeRail('sponsored_shop');

// 5. Reorder: move live now above starting soon
InlineRailControls.moveUp('live_now');
```

### Custom Layout Creation
```javascript
// Create a sports-focused layout
const sportsRails = [
  'hero_spotlight',      // Top priority
  'live_now',           // Live sports
  'team_league_hubs',   // Team navigation
  'highlights_reels',   // Game highlights
  'trending',           // Popular content
  'collections_packs'   // Sports collections
];

// Apply the layout
sportsRails.forEach((railType, index) => {
  if (index === 0) {
    InlineRailControls.addRail(railType, null);
  } else {
    const prevRail = sportsRails[index - 1];
    InlineRailControls.addRail(railType, prevRail);
  }
});
```

## Conclusion

The rail management system provides a powerful and intuitive way to customize your content layout. By understanding the available rail types, priority system, and management functions, you can create engaging and well-structured content experiences.

For additional help, refer to the debug panel console or check the browser developer tools for any error messages.
