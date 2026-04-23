# 🚀 Quick Deploy Guide

## One-Time Setup (5 minutes)

### 1. Update Configuration
```bash
# Edit package.json - Replace YOUR_GITHUB_USERNAME
# Line: "homepage": "https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/"
```

### 2. Configure GitHub Pages
1. Go to GitHub repo **Settings** → **Pages**
2. Set **Source** to `Deploy from a branch`
3. Select **main** branch, **root** folder
4. Save and wait 2-3 minutes

### 3. Deploy
```bash
npm run deploy
```

## ✅ Verify Deployment

Visit: `https://YOUR_USERNAME.github.io/invoice-master-pro/`

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm run preview         # Preview production build locally

# Deployment
npm run deploy          # Build + deploy to GitHub Pages
npm run deploy:test     # Dry-run (see what would be deployed)

# Testing
npm run lint            # Check code style
npm run test            # Run tests
```

---

## The Fix Explained

| What | Why | Impact |
|------|-----|--------|
| **HashRouter** | GitHub Pages doesn't support server-side routing | No 404 on refresh ✅ |
| **base path** | App deployed in subdirectory | CSS/JS load correctly ✅ |
| **Code splitting** | Faster initial load | Better performance ✅ |
| **Minification** | Smaller bundle size | Faster deployment ✅ |

---

## Troubleshooting

### ❌ 404 on page refresh
```bash
# Check: Is your browser showing /#/invoice/123 ?
# If yes: This is normal and correct for GitHub Pages
# If no: Rebuild and redeploy
npm run deploy
```

### ❌ CSS/Assets not loading
```bash
# Verify vite.config.ts has:
# base: "/invoice-master-pro/"
npm run build && npm run preview
```

### ❌ Site still shows old version
```bash
# Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
# GitHub Pages may cache for 5-10 minutes
```

---

## Optional: Automatic Deployment

To auto-deploy on every push to main:

1. Create folder: `.github/workflows/`
2. Move or rename: `.github-workflows-deploy.yml` → `.github/workflows/deploy.yml`
3. Push to GitHub

Now it deploys automatically! ✨

---

## Performance Metrics (After Deploy)

Expected results:
- **Bundle size:** ~150-250 KB (gzipped)
- **Load time:** <2 seconds
- **Lighthouse Score:** 80+

---

**Ready to deploy? Run: `npm run deploy`** 🚀
