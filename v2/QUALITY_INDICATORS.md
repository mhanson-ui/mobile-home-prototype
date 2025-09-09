# V2 Quality Indicators Strategy

## Current Implementation

### Quality Badges (Dynamic)
- **4K** and **4K HDR** badges appear in bottom-right corner
- Applied dynamically based on content metadata
- Black semi-transparent background with white text
- Only shows for content marked as 4K quality in database

### Placeholder Images
- Clean gray boxes with aspect ratio labels only
- No quality indicators baked into placeholders
- Located in `/v2/public/thumbs/`

## Best Practices

### DO ✅
- Use quality badges for actual quality indicators (4K, 4K HDR)
- Keep placeholder images neutral
- Let the system apply badges dynamically
- Position quality badges in bottom-right to avoid conflicts

### DON'T ❌
- Bake quality indicators into thumbnail images
- Include "4K" text in placeholder graphics
- Use quality as a content tag (tags are for genre/type)

## Badge Positioning Guide

```
┌─────────────────────┐
│ LIVE  ACTION        │  ← Top-left: Status badges & content tags
│                     │
│                     │
│                     │
│        [Image]      │
│                     │
│                     │
│                     │
│ Progress Bar     4K │  ← Bottom: Progress bar & quality badge
└─────────────────────┘
```

## Why This Approach?

1. **Flexibility**: Content quality can change without replacing images
2. **Consistency**: All quality indicators look the same
3. **Clarity**: Quality is separate from content type/genre
4. **Performance**: One placeholder serves all quality levels

## If You See "4K" in Images

This suggests:
1. Using production thumbnails instead of placeholders
2. Legacy images with baked-in quality indicators
3. Custom placeholders that need updating

## Recommendation

Keep placeholders clean and let the badge system handle quality indicators. This provides maximum flexibility and consistency across the prototype.
