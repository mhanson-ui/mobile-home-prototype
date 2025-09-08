# V2 Deployment Guide

## 🚀 V2 Staging Environment

The V2 prototype is deployed to a separate Railway staging environment.

### URLs
- **Production (V1)**: `[your-main-railway-url]`
- **V2 Staging**: `[your-v2-staging-railway-url]`

## 📱 V2 Navigation

Access the V2 prototype at these paths:

- **V2 Home**: `/v2/`
- **Approach 1 - Intent-Based**: `/v2/approach-1-intent/`
- **Approach 2 - Mixed Aspect**: `/v2/approach-2-mixed/`
- **Approach 3 - Contextual**: `/v2/approach-3-contextual/`
- **Approach 4 - Anchor+Rotational**: `/v2/approach-4-anchor/`

## 🎯 Key V2 Features to Test

### 1. Genre Filtering
- Click genre chips at the top
- Watch carousels filter/hide based on content
- Try "Sports", "Drama", "Live" filters

### 2. Approach-Specific Behaviors
- **Approach 1**: Fixed intent-based ordering
- **Approach 2**: Mixed rails differentiated by aspect ratio
- **Approach 3**: Toggle Morning/Evening/Next Day contexts
- **Approach 4**: Note immovable anchor rails (📌)

### 3. Rail Controls
- Add new rails with "+ Add Rail" button
- Remove rails (except anchors)
- Reorder rails (where allowed)

### 4. Auto-Advance
- Leave a rail idle for 5 seconds
- Watch it auto-advance every 3 seconds
- Interaction stops auto-advance

## 🔄 Deployment Process

### Staging (v2-prototype branch)
```bash
git checkout v2-prototype
git add .
git commit -m "V2 updates"
git push origin v2-prototype
```
→ Auto-deploys to V2 staging environment

### Production (when ready)
```bash
git checkout main
git merge v2-prototype
git push origin main
```
→ Auto-deploys to production environment

## 🐛 Debugging

- Check Railway logs in the staging environment
- Browser console for client-side errors
- Network tab for failed asset loads

## 📊 Environment Variables

Both environments should have:
- `NODE_ENV`: production
- `PORT`: (Railway provides this)

---
**V2 Prototype - Testing Next Generation Features**
