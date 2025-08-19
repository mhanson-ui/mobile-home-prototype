# Project Structure

```
MobileHomeProto_V1/
├── README.md                    # Project overview and documentation
├── PROJECT_STRUCTURE.md         # This file - detailed structure
├── index.html                   # Main demo launcher
├── assets/
│   ├── app.js                   # Core application logic
│   └── styles.css               # Comprehensive styling
├── demo_balanced/               # Balanced content experience
│   ├── index.html              # Main balanced demo
│   └── data_balanced.json      # Balanced content data
├── demo_sports/                 # Sports-optimized experience
│   ├── index.html              # Main sports demo
│   └── data_sports.json        # Sports content data
├── demos/                       # Individual rail demonstrations
│   ├── demo_hero_spotlight.html
│   ├── demo_editorial_hero.html
│   ├── demo_continue_watching.html
│   ├── demo_live_now.html
│   ├── demo_starting_soon.html
│   ├── demo_because_you_watched.html
│   ├── demo_new_and_noteworthy.html
│   ├── demo_trending.html
│   ├── demo_for_you_mosaic.html
│   ├── demo_collections_packs.html
│   ├── demo_team_league_hubs.html
│   ├── demo_highlights_reels.html
│   ├── demo_reels_grid.html
│   ├── demo_channel_surf.html
│   ├── demo_expiring_soon.html
│   └── demo_people_suggestion.html
├── images/                      # Wireframe and concept images
│   ├── user_flow.png
│   ├── taxonomy.png
│   ├── ia.png
│   ├── differentiation.png
│   └── wire_*.png              # Individual rail wireframes
└── Documentation/               # Analysis and research
    ├── carousel_analysis_v_1.md
    ├── Carousel Analysis va1.md
    ├── Optimizing Sports Video Consumption: An .sty
    └── # Current UI & Interaction Patterns — Au.md
```

## File Purposes

### Core Application
- **`index.html`**: Interactive demo launcher showcasing all features
- **`assets/app.js`**: Main JavaScript with rail rendering, navigation, and interactions
- **`assets/styles.css`**: Complete styling system with mobile-first responsive design

### Demo Experiences
- **`demo_balanced/`**: General content discovery with all rail types
- **`demo_sports/`**: Sports-optimized experience with live games and team hubs
- **`demos/`**: Individual rail demonstrations with purpose explanations

### Content Data
- **JSON files**: Structured content with metadata, chips, badges, and progress
- **Dynamic rendering**: All demos render from JSON data for easy customization

### Documentation
- **Analysis files**: Source research and optimization strategies
- **README**: Comprehensive project overview and usage instructions
- **Structure**: This file for development reference

## Key Features by File

### `assets/app.js`
- Rail token definitions and visual properties
- Content rendering and sorting system
- Navigation and end-to-end journeys
- DVR controls and sports features
- Debug panel and analytics
- Hero carousel with cycling thumbnails

### `assets/styles.css`
- Mobile-first responsive design
- Rail-specific styling and layouts
- Card silhouettes and sizing
- Touch interactions and animations
- Detail page styling
- Debug panel and console

### Demo Pages
- **Balanced**: Mixed content types and interactions
- **Sports**: Live games, highlights, team hubs
- **Individual**: Focused rail demonstrations
- **All**: Context-aware navigation and home routing
