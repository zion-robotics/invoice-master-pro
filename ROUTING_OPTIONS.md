# Alternative Routing Solutions

## Option 1: HashRouter ✅ (CURRENTLY IMPLEMENTED)

**Use Case:** Safest option for GitHub Pages

**Pros:**
- No server configuration needed
- Works with GitHub Pages immediately
- All routes work on refresh
- No 404 fallback required

**Cons:**
- URLs include `#` symbol: `/#/invoice/123`
- Less SEO-friendly (but fine for internal apps)

**Implementation:** Already done in `src/App.tsx`

---

## Option 2: BrowserRouter with 404.html Fallback

**Use Case:** You want clean URLs without `#`

**Setup:**

1. **In `src/App.tsx`** - Switch back to BrowserRouter:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default App = () => (
  <BrowserRouter basename="/invoice-master-pro">
    {/* routes */}
  </BrowserRouter>
);
```

2. **Create `public/404.html`**:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript">
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + 
        (l.port ? ':' + l.port : '') + 
        '/invoice-master-pro/' + 
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/') + 
        (l.search ? '?' + l.search.slice(1) : '')
      );
    </script>
  </head>
  <body>&nbsp;</body>
</html>
```

3. **Update `vite.config.ts`**:
```ts
export default defineConfig(({ mode }) => ({
  base: "/invoice-master-pro/",
  build: {
    // ... other configs
  },
}));
```

**Why it works:**
- GitHub Pages serves 404.html for non-existent routes
- Script redirects to hash-based URL that React can handle

**Cons:**
- Added complexity
- Slight redirect delay on unknown routes
- Requires 404.html file management

---

## Option 3: BrowserRouter with basename (ADVANCED)

**Use Case:** Clean URLs with proper SPA handling

**Setup:**

```tsx
// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default App = () => (
  <BrowserRouter basename="/invoice-master-pro">
    <Routes>
      {/* routes */}
    </Routes>
  </BrowserRouter>
);
```

**Problem:** GitHub Pages doesn't have server-side routing
- Accessing `/invoice/123` directly returns 404
- Only works after initial page load

**Solution:** Use with GitHub Actions to enable proper deployment

---

## Decision Matrix

| Feature | HashRouter | BrowserRouter + 404 | BrowserRouter + basename |
|---------|-----------|-------|--------|
| **Clean URLs** | ❌ (has #) | ✅ | ✅ |
| **Works on refresh** | ✅ | ✅ | ❌ |
| **GitHub Pages ready** | ✅ | ⚠️ (needs 404.html) | ❌ |
| **Complexity** | Low | Medium | High |
| **Setup time** | 5 min | 15 min | 30 min+ |
| **Maintenance** | Easy | Easy | Medium |

---

## Recommendation

**Use HashRouter (Current Implementation)** because:
1. ✅ Zero configuration needed
2. ✅ Works 100% on GitHub Pages
3. ✅ Fastest setup and deployment
4. ✅ No special file management
5. ✅ Excellent for internal/admin apps (like invoicing)

The `#` in URLs is standard practice for single-page apps on static hosts.

---

## How to Switch Routes

If you want to change from HashRouter to another approach:

### Switch to Option 2 (BrowserRouter + 404.html):

```bash
# 1. Update App.tsx
# Change HashRouter to BrowserRouter with basename

# 2. Create 404.html
# Copy the file content from Option 2 above to public/404.html

# 3. Rebuild and deploy
npm run build
npm run deploy
```

### Switch back to Option 1 (HashRouter):

```bash
# 1. Ensure src/App.tsx uses HashRouter (already done)
# 2. Delete public/404.html if it exists
# 3. Rebuild and deploy
npm run build
npm run deploy
```

---

## Testing Each Approach

### Test HashRouter:
```bash
npm run build
npm run preview
# Visit http://localhost:4173/invoice-master-pro/#/
# Navigate around, then refresh - should work fine
```

### Test BrowserRouter + 404:
```bash
npm run build
npm run preview
# Visit http://localhost:4173/invoice-master-pro/
# Navigate around, then refresh on /invoice/123
# Should redirect to /#/invoice/123
```

---

**Current Implementation: HashRouter ✅**

No additional configuration needed. Your app is ready to deploy!
