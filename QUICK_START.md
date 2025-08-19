# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start Local Server
```bash
cd /Users/matthewhanson/Desktop/MobileHomeProto_V1
python3 -m http.server 8000
```

### 2. Open Demo Launcher
Navigate to: `http://localhost:8000`

### 3. Explore Experiences
- **Balanced Experience**: General content discovery
- **Sports Experience**: Sports-optimized features
- **Individual Demos**: Focused rail demonstrations

## 🔧 Development Workflow

### Testing Changes
1. Make edits to `assets/app.js` or `assets/styles.css`
2. Refresh browser to see changes
3. Use debug panel (top-right button) for insights

### Adding New Content
1. Edit JSON data files in `demo_balanced/` or `demo_sports/`
2. Add new items with proper metadata
3. Refresh to see new content

### Creating New Rails
1. Add rail type to `RailTokens` in `app.js`
2. Define visual properties and priority
3. Add to `RailPriority` for ordering
4. Create demo page in `demos/` folder

## 📱 Key Features to Test

### Mobile Experience
- Touch navigation and swipe gestures
- Responsive design across screen sizes
- Native app-like interactions

### Content Discovery
- Differentiated rail types
- Smart deduplication
- Chips and metadata system

### End-to-End Journeys
- Click through to detail pages
- Context-aware navigation
- Complete user flows

## 🐛 Debug & Troubleshooting

### Debug Panel
- Click top-right button to open
- View rail statistics and interactions
- Monitor performance metrics

### Common Issues
- **Content not loading**: Check JSON syntax
- **Styling issues**: Verify CSS class names
- **Navigation problems**: Check console for errors

### Console Logs
- Open browser developer tools
- Check for JavaScript errors
- Monitor network requests

## 📚 Next Steps

### Deep Dive
- Read `README.md` for comprehensive overview
- Review `PROJECT_STRUCTURE.md` for file organization
- Study analysis documents in `Documentation/` folder

### Customization
- Modify rail priorities and ordering
- Add new content types and metadata
- Extend styling and interactions

### Integration
- Adapt for your content platform
- Integrate with your data sources
- Customize for your brand guidelines

---

**Ready to build the future of mobile content discovery! 🎉**
