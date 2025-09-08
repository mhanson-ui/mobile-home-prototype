# V2 Mobile Homepage Prototype Overview

## What is this?

This is an interactive prototype system for the V2 Mobile Homepage that demonstrates four different content organization approaches based on the UX brief. The prototype allows stakeholders to experience and evaluate different carousel strategies for organizing ~30 content rails in a coherent, user-friendly manner.

## Purpose

The V2 prototype addresses key challenges identified in V1:
- **Visual sameness** - All carousels looked similar, causing user confusion
- **Lack of organizing principle** - No clear strategy for what content appears where
- **Discovery friction** - Hard to find relevant content among 30+ carousels
- **Habitual usage** - Need to make the homepage a daily destination

## The Four Approaches

### 1. Intent-Based Stacking
Rails organized by user intent in a fixed hierarchy: Utility → Live → Editorial → Short-form
- **Best for**: Users who want predictable content placement
- **Key feature**: Clear functional grouping

### 2. Mixed Aspect Ratio
Visual differentiation through aspect ratios (2:3 = short form, 16:9 = standard)
- **Best for**: Quick visual scanning and content type recognition
- **Key feature**: Each content type has distinct visual treatment

### 3. Contextual Programming
Rails dynamically reorder based on time of day/context
- **Best for**: Always-relevant content surfacing
- **Key feature**: Morning shows "Today's Games", evening prioritizes "Live Now"

### 4. Anchor + Rotational
Fixed anchor rails (Continue Watching, Live, GameStream) with rotating content below
- **Best for**: Balance of consistency and fresh discovery
- **Key feature**: Reliable top rails with variety below

## Key Features Implemented

### Content Organization
- **Utility Rails**: Continue Watching, Recordings, Upcoming Games (quick access)
- **Live Rails**: Currently Live (16:9 events), Live Channels (2:3 networks)
- **Editorial Rails**: Featured Picks, Recommended content
- **Short-form Rails**: GameStream clips, Shortform Placeholder (full-width 2:3)

### Interactive Elements
1. **Genre Filtering**: Click genre chips to filter all content instantly
2. **Personalization**: Select viewer type (TV, Movies, News, Sports, Sports Pro) for tailored content
3. **Rail Management**: Add/remove/reorder rails (with approach-specific constraints)
4. **Auto-advance**: Top carousel auto-scrolls when user is idle

### Visual Design System
- **Aspect Ratios**: 16:9 (standard), 2:3 (short-form/channels)
- **Card Sizes**: Small, Medium, Large, Full-width
- **Smart Badges**: LIVE (top-left), NEW (top-right), content tags (30% distribution)
- **Color Coding**: Utility (green), Live (gradient), Editorial (blue/purple)

## How to Use

### Accessing the Prototype
1. Navigate to the V2 landing page from the main prototype home
2. Choose your viewer type (first-time visitors)
3. Select one of the four approaches to explore

### Testing Features
- **Genre Filtering**: Click any genre chip at the top
- **Rail Controls**: Hover over any carousel to see management options
- **Content Interaction**: Click cards to simulate selection
- **Personalization**: Change viewer type from the V2 home

### Evaluation Criteria
When reviewing, consider:
- Which approach best reduces cognitive load?
- Which makes content discovery easiest?
- Which would drive most habitual daily usage?
- Which scales best to 30+ carousels?

## Technical Implementation

### Architecture
- **Frontend**: Vanilla JavaScript with modular components
- **Data**: CSV-based content database (40+ real show examples)
- **Styling**: Approach-specific CSS with consistent design tokens
- **State**: LocalStorage for personalization preferences

### Browser Support
- Optimized for mobile viewport (375px - 430px)
- Works on desktop with mobile preview
- Chrome, Safari, Firefox, Edge supported

## Next Steps

1. **Stakeholder Review**: Gather feedback on each approach
2. **Analytics Integration**: Track interaction patterns
3. **A/B Testing**: Compare approaches with real users
4. **Refinement**: Iterate based on feedback and data

## Key Decisions Needed

1. Which approach(es) to move forward with?
2. Should we combine elements from multiple approaches?
3. What additional rail types are needed?
4. How should personalization affect rail ordering?

## Contact

For questions or feedback about this prototype:
- Review the [UX Brief](../uxbrief) for detailed rationale
- Check [README.md](README.md) for technical details
- View [CHANGELOG.md](CHANGELOG.md) for latest updates

---

*This prototype demonstrates content organization strategies only. Final implementation may vary based on technical constraints and business requirements.*
