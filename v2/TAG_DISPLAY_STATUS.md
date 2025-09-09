# V2 Tag Display Status

## Current Implementation ✅

### HTML Structure
```html
<div class="content-tag">ACTION</div>
```
- Rendered as a separate div element
- NOT part of metadata array
- Positioned between badges and metadata

### CSS Styling
- **Position**: Absolute, top: 8px, left: 8px
- **Editorial Rails**: Purple background (rgba(99, 102, 241, 0.9))
- **Shortform Rails**: Pink background (rgba(236, 72, 153, 0.9))
- **Live Rails**: Blue background (rgba(59, 130, 246, 0.9))
- **Text**: White color, uppercase, 9px font

### Tag Display Rules
1. Only shows on Editorial, Shortform, and Live rail types
2. Hidden if item has progress (Continue Watching)
3. Hidden if item has LIVE badge
4. Hidden if item has NEW badge
5. Maximum 1 tag per card
6. 30% of eligible cards show tags (balanced distribution)

## Troubleshooting

If tags appear as black text under metadata:

1. **Clear Browser Cache**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   
2. **Verify CSS Loading**
   - Check browser console for CSS errors
   - Ensure v2-styles.css is loaded
   
3. **Check Rail Type**
   - Open browser DevTools
   - Inspect a card element
   - Verify it has `data-rail-type="editorial"` (or shortform/live)
   
4. **Run Diagnostic**
   - Open browser console
   - Copy/paste contents of check-tags.js
   - Review output for issues

## Expected Behavior

### Editorial Rails (Featured Picks, Recommended)
- Purple tag badges in top-left
- Tags like "adaptation", "sequel", "exclusive"

### Shortform Rails (GameStream, Shortform Placeholder)
- Pink tag badges in top-left
- Tags like "highlights", "behind scenes"

### Live Rails (Live Channels, Currently Live)
- Blue tag badges in top-left (only if not showing LIVE badge)
- Tags like "4K", "sports", "news"

### Utility Rails (Continue Watching, Recordings)
- NO tags shown (by design)
