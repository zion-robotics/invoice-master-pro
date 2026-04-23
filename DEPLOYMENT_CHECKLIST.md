# ✅ Deployment Checklist

## Pre-Deployment (Do This First!)

### Configuration
- [ ] Open `package.json` in editor
- [ ] Find line: `"homepage": "https://YOUR_GITHUB_USERNAME.github.io/invoice-master-pro/"`
- [ ] Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username
- [ ] Example: `"homepage": "https://john-doe.github.io/invoice-master-pro/"`
- [ ] Save the file

### Verification
- [ ] Verify you're in correct directory: `c:\HNG\Stage 2\invoice-master-pro\`
- [ ] Check that `package.json` has deploy scripts:
  ```
  "deploy": "npm run build && gh-pages -d dist",
  "deploy:test": "npm run build && gh-pages -d dist --dry-run"
  ```
- [ ] Check that `vite.config.ts` has: `base: "/invoice-master-pro/",`
- [ ] Check that `src/App.tsx` uses `HashRouter` (not `BrowserRouter`)

### GitHub Setup
- [ ] Go to your GitHub repository
- [ ] Click **Settings** → **Pages**
- [ ] Set **Source** to "Deploy from a branch"
- [ ] Select **main** branch
- [ ] Select **root** folder
- [ ] Click **Save**
- [ ] Wait 2-3 minutes for initial setup

---

## Local Testing (Before Deployment!)

### Build Test
```bash
npm run build
```
- [ ] No errors in output
- [ ] `dist/` folder created
- [ ] Files in dist/: index.html, assets/

### Preview Test
```bash
npm run preview
```
- [ ] App opens at `http://localhost:4173/invoice-master-pro/`
- [ ] Click through each route
- [ ] Refresh page on each route (should work!)
- [ ] No 404 errors
- [ ] CSS/styling loads correctly
- [ ] Images/assets display properly
- [ ] Browser console has no errors (F12)
- [ ] Stop preview (Ctrl+C)

---

## Pre-Deployment Commit

### Commit Changes
```bash
git add .
```
- [ ] Command ran successfully

```bash
git status
```
- [ ] See modified files: package.json, vite.config.ts, src/App.tsx
- [ ] See new files: documentation .md files

```bash
git commit -m "chore: configure GitHub Pages deployment"
```
- [ ] Commit message shows changes accepted

```bash
git push origin main
```
- [ ] Code pushed to GitHub
- [ ] No errors in push

### Verify GitHub
- [ ] Go to GitHub repository
- [ ] See your latest commit in history
- [ ] Verify main branch has latest code

---

## Deployment

### Deploy to GitHub Pages
```bash
npm run deploy
```
- [ ] Build starts
- [ ] No errors during build
- [ ] gh-pages starts deployment
- [ ] You see message: `Deploying...`
- [ ] Complete message appears
- [ ] Command finishes successfully

### Check GitHub Pages Branch
```bash
git branch -r
```
- [ ] You see: `origin/gh-pages` in output
- [ ] This means deployment worked!

---

## Post-Deployment Verification (IMPORTANT!)

### Visit Live Site
- [ ] Navigate to: `https://YOUR_USERNAME.github.io/invoice-master-pro/`
- [ ] (Replace YOUR_USERNAME with your GitHub username)
- [ ] Page loads successfully
- [ ] You see the invoice app interface

### Test Homepage
- [ ] Visit: `https://YOUR_USERNAME.github.io/invoice-master-pro/`
- [ ] Homepage renders correctly
- [ ] All buttons/links visible
- [ ] No layout breaks

### Test Routing
- [ ] Click on an invoice (or navigate to `/#/invoice/123`)
- [ ] Invoice page loads
- [ ] Page shows correct content
- [ ] **REFRESH THE PAGE** - this is critical!
- [ ] Still shows the invoice (no 404)
- [ ] Go back to home with browser back button
- [ ] Homepage loads again

### Test 404 Page
- [ ] Navigate to: `https://YOUR_USERNAME.github.io/invoice-master-pro/#/nonexistent`
- [ ] 404 page displays
- [ ] Error message shows properly

### Browser Console Check
- [ ] Press F12 (or Dev Tools)
- [ ] Click **Console** tab
- [ ] No red errors displayed
- [ ] No CORS warnings related to your domain

### Performance Check
- [ ] Open **Network** tab in Dev Tools
- [ ] Refresh page
- [ ] Watch files load
- [ ] CSS should load (not show 404)
- [ ] JavaScript should load (not show 404)
- [ ] Initial load under 3 seconds

### Cache Clearing Check
- [ ] Hard refresh: **Ctrl+Shift+R** (or Cmd+Shift+R on Mac)
- [ ] Site still works
- [ ] No layout shifts after hard refresh

### Mobile Check (if possible)
- [ ] Open on mobile phone
- [ ] Test on different screen size
- [ ] Navigation works on touch
- [ ] Responsive layout looks good
- [ ] Refresh page on mobile (no 404)

---

## Troubleshooting Checklist

### If You See 404 on Page Refresh

**Check 1: Router Type**
- [ ] Open `src/App.tsx`
- [ ] Confirm you see: `import { HashRouter }`
- [ ] Confirm you see: `<HashRouter>` (not `<BrowserRouter>`)
- [ ] If not: the deployment used wrong router

**Check 2: Base Path**
- [ ] Open `vite.config.ts`
- [ ] Confirm you see: `base: "/invoice-master-pro/",`
- [ ] If missing: assets won't load correctly

**Check 3: Rebuild and Redeploy**
```bash
npm run build
npm run deploy
```
- [ ] Rebuilds with correct configuration
- [ ] Redeploys to GitHub Pages

### If CSS/Assets Don't Load

**Check 1: Base Path Setting**
```
Wrong: <link href="/style.css">        (404)
Right: <link href="/invoice-master-pro/style.css"> (Works)
```

**Fix:**
```bash
npm run build  # Rebuilds with base path
npm run preview  # Test locally
npm run deploy  # Deploy
```

### If Site Still Shows Old Version

**Clear GitHub Cache:**
```bash
# Hard refresh in browser
Ctrl+Shift+R  (Windows/Linux)
Cmd+Shift+R   (Mac)
```

- [ ] GitHub Pages caches for 5-10 minutes
- [ ] Wait and try again if needed

### If Deployment Command Fails

**Check gh-pages Installation:**
```bash
npm list gh-pages
```
- [ ] Should show: `gh-pages@6.3.0` (or higher)

**If Missing, Install:**
```bash
npm install gh-pages --save-dev
npm run deploy
```

---

## Performance Checklist

### Bundle Size
```bash
npm run build
```
- [ ] Total dist/ size under 500 KB
- [ ] After gzip, under 150 KB
- [ ] Initial load time under 2 seconds

### Check Build Output
- [ ] Run: `npm run build`
- [ ] Look for: mentions of `vendors`, `chunks`
- [ ] Should see multiple JS files (code splitting)

### Lighthouse Score
- [ ] Open DevTools → Lighthouse
- [ ] Run performance audit
- [ ] Score should be 80+
- [ ] Try to optimize further if lower

---

## Final Checklist

### Everything Ready?
- [ ] GitHub username in package.json ✅
- [ ] All files modified correctly ✅
- [ ] Changes committed and pushed ✅
- [ ] GitHub Pages settings configured ✅
- [ ] Local preview tested ✅
- [ ] Deployment command succeeded ✅
- [ ] Live site loads without 404 ✅
- [ ] All routes work on refresh ✅
- [ ] CSS/assets load correctly ✅
- [ ] No console errors ✅
- [ ] Mobile responsive ✅

---

## Success Criteria ✅

Your deployment is **SUCCESSFUL** when:

1. ✅ Site opens at: `https://YOUR_USERNAME.github.io/invoice-master-pro/`
2. ✅ Homepage displays correctly
3. ✅ Can navigate to invoice detail page
4. ✅ **Page refreshes without 404 error**
5. ✅ CSS and images load correctly
6. ✅ No red errors in browser console
7. ✅ Mobile view looks good
8. ✅ Navigation is smooth and fast

---

## Troubleshooting Decision Tree

```
Does site load?
├─ NO → Check GitHub Pages settings, wait 5 mins
└─ YES
   ├─ Do you see 404 on refresh?
   │  ├─ YES → Check HashRouter in App.tsx
   │  └─ NO → ✅ Good! Continue testing
   ├─ Is CSS loading?
   │  ├─ NO → Check base path in vite.config.ts
   │  └─ YES → ✅ Good! Continue testing
   ├─ Are all routes working?
   │  ├─ NO → May be old cache, hard refresh (Ctrl+Shift+R)
   │  └─ YES → ✅ Success!
```

---

## Quick Recovery Commands

If something goes wrong:

```bash
# Check what's in dist folder
ls dist

# Test locally before redeploying
npm run preview

# Safe deployment (dry-run)
npm run deploy:test

# Force redeploy
npm run deploy

# Clear local cache and rebuild
rm -rf dist node_modules/.vite
npm run build
npm run deploy
```

---

**Remember: Your deployment is successful when you can refresh any page without seeing a 404 error! 🎉**
