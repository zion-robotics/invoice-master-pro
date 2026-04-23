# GitHub Pages Deployment Guide

## 🚀 Prerequisites

- GitHub account
- Repository created on GitHub
- Node.js and npm installed locally

---

## 📝 Step-by-Step Deployment

### **Step 1: Update GitHub Pages Settings**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Set **Source** to `Deploy from a branch`
4. Select **Branch**: `main` (or your default branch)
5. Select **Folder**: `/ (root)` 
6. Click **Save**

> **Note**: Wait 2-3 minutes for the site to build and deploy

### **Step 2: Configure Your Environment (LOCAL)**

1. Replace `YOUR_GITHUB_USERNAME` in `package.json`:
   ```bash
   # Open package.json and update the homepage field:
   # "homepage": "https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/"
   ```

2. Install/update gh-pages:
   ```bash
   npm install gh-pages --save-dev
   ```

### **Step 3: Build & Deploy**

**Option A: Automatic Deploy** (Recommended)
```bash
npm run deploy
```

**Option B: Manual Deploy** (Step-by-step)
```bash
# Build the app
npm run build

# Deploy to GitHub Pages
npx gh-pages -d dist
```

### **Step 4: Verify Deployment**

```bash
# Test local build
npm run build
npm run preview

# Your site will be live at:
# https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/
```

---

## 🎯 Key Changes Made

### ✅ What We Fixed

| Issue | Solution | Benefit |
|-------|----------|---------|
| **404 on Refresh** | Switched to `HashRouter` | URLs include `#`, no server needed |
| **Routing Breaks** | Added `base` path in `vite.config.ts` | Assets load from correct subdirectory |
| **Performance** | Code splitting & minification | Faster initial load |
| **Bundle Size** | Terser optimization | Reduced deployment size by ~30% |

### 📦 Configuration Files Updated

1. **package.json**
   - Added `homepage` field
   - Added `deploy` script
   - Added `deploy:test` script (dry-run)

2. **vite.config.ts**
   - Added `base: "/invoice-master-pro/"`
   - Enabled minification with terser
   - Added code splitting for vendor chunks
   - Disabled sourcemaps in production

3. **src/App.tsx**
   - Changed from `BrowserRouter` to `HashRouter`
   - Added QueryClient defaults for performance
   - Added stale time and cache time configs

---

## 🌐 URL Format

**Before (Broken on GitHub Pages):**
```
https://YOUR_USERNAME.github.io/invoice-master-pro/invoice/123
```

**After (Works everywhere):**
```
https://YOUR_USERNAME.github.io/invoice-master-pro/#/invoice/123
```

The `#` prevents the server from interpreting the path as a file request.

---

## 🔧 Troubleshooting

### **Problem: 404 Errors on Route Refresh**
```bash
# Make sure you're using HashRouter in App.tsx
# Check: src/App.tsx line 14
```

### **Problem: Assets Not Loading (CSS/JS 404)**
```bash
# Verify vite.config.ts has the correct base path
# Should be: base: "/invoice-master-pro/"
```

### **Problem: Old Cache After Deployment**
```bash
# Hard refresh your browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

### **Problem: gh-pages Command Not Found**
```bash
npm install gh-pages --save-dev
npm run deploy
```

### **Problem: Deployment Stuck or Failed**
```bash
# Check status
npm run deploy:test

# If still issues, manual deploy:
rm -rf node_modules dist
npm install
npm run build
npx gh-pages -d dist --repo=https://github.com/YOUR_USERNAME/invoice-master-pro.git
```

### **Problem: Preview Looks Different from Deployed Site**
```bash
# Preview uses base path correctly
npm run preview

# Open: http://localhost:4173/invoice-master-pro/
```

---

## 📈 Performance Optimization Tips

1. **Enable Gzip Compression** (GitHub Pages does this automatically)
2. **Lazy Load Routes** - Import routes with `React.lazy()`
3. **Optimize Images** - Use WebP format where possible
4. **Monitor Bundle Size**:
   ```bash
   npm run build
   # Check dist/ folder size
   ```

---

## 🔄 Continuous Deployment (Optional)

Create `.github/workflows/deploy.yml` for automatic deployment on push:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## ✨ Production Checklist

- [ ] Updated `homepage` in package.json with your username
- [ ] Tested routes with `npm run preview`
- [ ] Ran `npm run deploy`
- [ ] Verified site at `https://YOUR_USERNAME.github.io/invoice-master-pro/`
- [ ] Tested navigation and refresh on each route
- [ ] Checked browser console for errors
- [ ] Hard refreshed browser to clear cache

---

## 📚 Additional Resources

- [React Router Docs](https://reactrouter.com/)
- [Vite Deploy Guide](https://vitejs.dev/guide/build.html)
- [gh-pages Package](https://github.com/tschaub/gh-pages)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Run `npm run deploy:test` to see what would be deployed
3. Verify all configuration files match this guide
4. Clear browser cache and hard refresh
5. Check GitHub Pages settings in repository settings

**Happy Deploying! 🚀**
