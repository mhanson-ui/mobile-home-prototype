# V2 Prototype Demo Guide

## 5-Minute Demo Script

### Opening (30 seconds)
"Today I'll show you 4 different approaches for organizing content on our mobile homepage. Each solves the 'visual sameness' problem differently."

### Show V2 Home (30 seconds)
1. Point out the 4 approach cards
2. Mention personalization (viewer types)
3. Click into Approach 1

### Approach 1: Intent-Based (1 minute)
- "Notice the clear sections: Utility at top, then Live, Editorial, Short-form"
- Scroll to show the pattern repeating
- "Users always know where to find Continue Watching or Live content"
- Demo genre filtering - click "Sports" chip
- Show how non-sports rails disappear

### Approach 2: Mixed Aspect (1 minute)
- "This uses visual shapes to differentiate content types"
- Point out 2:3 portrait cards for short-form
- "Each content type has its own visual language"
- Show genre filtering works here too

### Approach 3: Contextual (1 minute)
- "Content position changes based on context"
- Show time toggle if implemented
- "Morning prioritizes Today's Games, evening shows Live content first"
- Mention this could be automatic based on actual time

### Approach 4: Anchor + Rotational (1 minute)
- "Combines consistency with variety"
- Point out the 3 anchor rails that never move
- "Everything below rotates for freshness"
- Show rail management (can't move anchors)

### Key Features (30 seconds)
- Show personalization: "Content adapts to viewer preferences"
- Point out badge system: "LIVE events vs channels are now distinct"
- Mention auto-advance on idle

### Close (30 seconds)
"Each approach has trade-offs between predictability and discovery. Which feels most natural to you?"

## Key Talking Points

### If asked about visual design:
- "Colors and styling are functional - green for utility, gradients for live"
- "Final visual design would follow brand guidelines"

### If asked about content:
- "Using real show data to make it realistic"
- "Would connect to actual content APIs in production"

### If asked about performance:
- "This is optimized for mobile devices"
- "Production version would lazy-load content"

### If asked about other platforms:
- "Focusing on mobile first since it's 70% of usage"
- "Patterns would adapt for TV/desktop"

## Common Questions & Answers

**Q: How many carousels can we support?**
A: The system scales to 30+ carousels while maintaining clarity

**Q: Can we mix approaches?**
A: Yes, we could combine elements - like anchors from #4 with visual differentiation from #2

**Q: How does personalization work?**
A: Content sorting adapts based on viewer type, but rail organization stays consistent

**Q: What about international content?**
A: The framework supports any content - these are organization patterns, not content-specific

## Demo Tips
- Always start with "why" - the problem we're solving
- Let them interact - hand over control when possible  
- Focus on feelings/reactions, not implementation details
- Take notes on which approach resonates most
