# Terminal Commands for GitHub Pages Deployment

## 🔴 IMPORTANT: First Step
Edit `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```diff
- "homepage": "https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/",
+ "homepage": "https://john-doe.github.io/invoice-master-pro/",
```

---

## ✅ Step-by-Step Deployment Process

### Step 1: Verify Setup (Local Testing)
```bash
# Navigate to project directory
cd c:\HNG\Stage 2\invoice-master-pro

# Install dependencies (if not already done)
npm install

# Verify build works
npm run build
```

### Step 2: Test Locally (Optional but Recommended)
```bash
# Preview production build locally
npm run preview

# Your app will be at: http://localhost:4173/invoice-master-pro/
# Test all routes and verify they work with refresh
```

### Step 3: Commit Your Configuration Changes
```bash
# Add all configuration changes
git add .

# Commit changes
git commit -m "chore: configure for GitHub Pages deployment with HashRouter"

# Push to GitHub
git push origin main
```

### Step 4: Deploy to GitHub Pages
```bash
# OPTION A: One-command deploy (builds + deploys)
npm run deploy

# OPTION B: Step-by-step deployment
npm run build
npx gh-pages -d dist
```

### Step 5: Verify Deployment
```bash
# Open browser to:
# https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/

# Test routes:
# - Homepage: https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/#/
# - Invoice page: https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/#/invoice/123
# - 404 page: https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/#/nonexistent
```

---

## 📊 Deployment Status Checks

### Check 1: Build Output
```bash
# Verify build succeeds without errors
npm run build

# Expected output:
# ✓ built in XXXms
# dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-XXXXX.js
#   │   └── index-XXXXX.css
```

### Check 2: Deployment Test
```bash
# Simulate deployment without pushing
npm run deploy:test

# You'll see what would be deployed
```

### Check 3: Production Preview
```bash
# Preview exactly what will be deployed
npm run build
npm run preview

# Manually test all routes at: http://localhost:4173/invoice-master-pro/
```

---

## 🚨 Troubleshooting Commands

### Issue: 404 Errors on Route Refresh

**Quick Fix:**
```bash
# Verify HashRouter is used
# Should see: import { HashRouter } from "react-router-dom"
```

**If still broken:**
```bash
# Rebuild and redeploy
npm run build
npm run deploy
```

### Issue: CSS/Assets Not Loading

**Check:**
```bash
# Verify base path is set
# Should see: base: "/invoice-master-pro/" in vite.config.ts
```

**Fix:**
```bash
# Rebuild with correct base
npm run build

# Preview to verify
npm run preview
```

### Issue: Deployment Fails

**Debug:**
```bash
# Check if gh-pages is installed
npm list gh-pages

# If missing, install it
npm install gh-pages --save-dev

# Try deployment again
npm run deploy
```

**If still fails:**
```bash
# Manual deployment with more details
npx gh-pages -d dist -r https://github.com/YOUR_USERNAME/invoice-master-pro.git
```

### Issue: Old Cached Version Showing

**Browser Cache Clear:**
```
Windows/Linux: Ctrl + Shift + Delete → Clear browsing data
Mac: Cmd + Shift + Delete → Clear browsing data

OR: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) for hard refresh
```

**GitHub Pages Cache (May take 5-10 minutes to clear)**

### Issue: Can't Find Deployment

**Verify Deployment Went Through:**
```bash
# Check GitHub repo for gh-pages branch
git branch -r

# You should see: origin/gh-pages

# If not present, first deployment may still be processing
```

---

## 🔄 Redeployment Commands

After making code changes:

```bash
# Quick redeploy
npm run deploy

# Or step-by-step with testing
npm run build
npm run preview    # Test locally first
npm run deploy     # Then deploy
```

---

## 🔧 Development Workflow

```bash
# Start development server
npm run dev

# In another terminal, when ready to deploy:
npm run build && npm run preview

# After testing, deploy
npm run deploy
```

---

## 📋 Configuration Verification

Run these commands to verify everything is set up correctly:

```bash
# 1. Check package.json has homepage
grep "homepage" package.json

# Expected output:
# "homepage": "https://YOUR_USERNAME.github.io/invoice-master-pro/",

# 2. Check vite.config.ts has base path
grep "base:" vite.config.ts

# Expected output:
# base: "/invoice-master-pro/",

# 3. Check App.tsx uses HashRouter
grep "HashRouter" src/App.tsx

# Expected output:
# import { HashRouter, Route, Routes } from "react-router-dom";
# <HashRouter>

# 4. Verify gh-pages is installed
npm list gh-pages

# Expected output:
# gh-pages@6.3.0 (or higher)
```

---

## 🎯 One-Command Quick Deploy

After initial setup, use this for all future deployments:

```bash
npm run deploy
```

That's it! It will:
1. ✅ Build the app
2. ✅ Optimize for production
3. ✅ Deploy to GitHub Pages
4. ✅ Your site is live in ~30 seconds

---

## 📱 Testing on Different Devices

After deployment, test on:

```bash
# Desktop browsers
# - Chrome
# - Firefox
# - Safari
# - Edge

# Mobile browsers
# - iOS Safari
# - Chrome Mobile
# - Firefox Mobile

# Test these URLs on each:
# https://YOUR_USERNAME.github.io/invoice-master-pro/
# https://YOUR_USERNAME.github.io/invoice-master-pro/#/
# https://YOUR_USERNAME.github.io/invoice-master-pro/#/invoice/any-id
```

---

## 🚀 Performance Metrics

Check deployment size and performance:

```bash
# Check build size
npm run build

# List dist folder contents
dir /s dist

# Expected size: 200-400 KB total
# Expected gzipped: 60-120 KB

# Performance check
npm run preview

# Lighthouse audit score should be 80+
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| **Start dev** | `npm run dev` |
| **Build only** | `npm run build` |
| **Preview build** | `npm run preview` |
| **Deploy** | `npm run deploy` |
| **Deploy (dry-run)** | `npm run deploy:test` |
| **Lint code** | `npm run lint` |
| **Run tests** | `npm run test` |

---

## ✨ Post-Deployment Checklist

- [ ] Deployment completed without errors
- [ ] Visited live site and confirmed it loads
- [ ] Tested homepage route works
- [ ] Tested invoice detail route works
- [ ] Tested 404 page works
- [ ] Refreshed page on each route - no 404 errors
- [ ] Hard refreshed browser to clear cache
- [ ] Tested on mobile device
- [ ] Verified CSS/images load correctly
- [ ] Checked browser console for errors

---

**Your app is ready to deploy! 🎉**

Run: `npm run deploy`

Then visit: `https://YOUR_USERNAME.github.io/invoice-master-pro/`
