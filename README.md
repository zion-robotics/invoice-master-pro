# Invoice Management App

A fully responsive Invoice Management Application built with React, TypeScript, and Tailwind CSS.

## Live Demo

[View Live App](https://zion-robotics.github.io/invoice-master-pro/) <!-- Replace with your Vercel/Netlify URL -->

## GitHub Repository

(https://github.com/zion-robotics/invoice-master-pro)

---

## Setup Instructions

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/zion-robotics/invoice-master-pro.git
cd invoice-master-pro

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

### Run Tests

```bash
npm run test
# or
bun test
```

---

## Architecture

### Tech Stack

- **React 18** — UI library with hooks
- **TypeScript** — static typing throughout
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible UI primitives
- **React Router v6** — client-side routing
- **Zod** — runtime form validation
- **date-fns** — date formatting and arithmetic
- **Vite** — build tool and dev server

### Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, dialog, etc.)
│   ├── DeleteDialog.tsx     # Confirmation modal before deletion
│   ├── EmptyState.tsx       # Shown when no invoices match filter
│   ├── InvoiceCard.tsx      # Single invoice row in the list
│   ├── InvoiceForm.tsx      # Create / edit invoice drawer form
│   ├── ListHeader.tsx       # Title, filter dropdown, new invoice button
│   ├── Sidebar.tsx          # Navigation sidebar with theme toggle
│   └── StatusBadge.tsx      # Colour-coded draft / pending / paid badge
│
├── hooks/
│   ├── useInvoices.ts       # Reactive store — useSyncExternalStore over localStorage
│   └── useTheme.ts          # Light/dark mode toggle with localStorage persistence
│
├── lib/
│   ├── format.ts            # formatDate, formatMoney helpers
│   ├── seed.ts              # Initial seed data for first load
│   ├── storage.ts           # All localStorage read/write operations (CRUD)
│   ├── types.ts             # Invoice, InvoiceItem, Address, InvoiceStatus types
│   └── utils.ts             # cn() class merging utility
│
├── pages/
│   ├── Index.tsx            # Invoice list page with status filtering
│   ├── InvoiceDetail.tsx    # Single invoice view with edit/delete/mark paid
│   └── NotFound.tsx         # 404 fallback
│
└── App.tsx                  # Router setup and layout shell
```

### Data Flow

```
localStorage
     ↕
storage.ts  (getAllInvoices, saveInvoice, deleteInvoice, updateStatus)
     ↕
useInvoices.ts  (useSyncExternalStore + notifyInvoicesChanged)
     ↕
React components (Index, InvoiceDetail, InvoiceForm)
```

All state lives in `localStorage`. The `useInvoices` hook uses React's `useSyncExternalStore` to subscribe to a custom event bus (`notifyInvoicesChanged`). Any write operation calls `notify()`, which triggers a re-render in all subscribed components — no Context Provider or Redux needed.

### Key Design Decisions

- **`useSyncExternalStore`** over Context/Redux — avoids unnecessary re-renders and keeps the store logic outside React's tree
- **Single `useInvoice(id)` hook** in the detail page — eliminates dual state (a `useState` + a store subscription), which was the root cause of stale UI after edits
- **Zod validation** — schema-first validation with per-field error paths mapped directly to form field keys
- **Snapshot caching** — the store caches the last serialised string so `JSON.stringify` only runs when data actually changes

---

## Trade-offs

| Decision | Benefit | Trade-off |
|---|---|---|
| localStorage only | Zero backend setup, works offline, fast | Data is device-local, no multi-device sync |
| useSyncExternalStore | Concurrent-mode safe, no provider needed | Slightly more boilerplate than Context |
| shadcn/ui primitives | Accessible, unstyled, fully owned code | Larger initial component footprint |
| Zod for validation | Type-safe, composable schemas | Adds ~13KB to bundle |
| Vite + Bun | Very fast dev/build | Bun lock file can cause issues on some CI environments |

---

## Accessibility Notes

- **Semantic HTML** — all sections use proper landmark elements (`<main>`, `<nav>`, `<address>`)
- **Form labels** — every input is paired with a visible `<label>` element
- **Buttons** — all interactive controls use `<button>` elements, never `<div>` or `<span>`
- **Delete modal** — uses the native `AlertDialog` from shadcn/ui which traps focus, closes on `ESC`, and sets `aria-modal="true"`
- **Invoice form drawer** — listens for `ESC` keydown to close, sets `aria-modal="true"` and `role="dialog"` with a descriptive `aria-label`
- **Status badges** — colour alone is not the only indicator; text label is always present for screen readers
- **Keyboard navigation** — all interactive elements are reachable via `Tab` and activatable via `Enter`/`Space`
- **Color contrast** — both light and dark themes are designed to meet WCAG AA contrast ratios (4.5:1 for normal text)
- **Disabled states** — the "Mark as Paid" button uses `disabled` attribute with reduced opacity, not just visual styling

---

## Features Beyond Requirements

- **Seed data on first load** — the app populates with realistic sample invoices so reviewers see a working state immediately without manual data entry
- **Snapshot caching** in `useInvoices` — prevents unnecessary re-renders by only re-parsing localStorage when data actually changes
- **Reactive single-invoice hook** (`useInvoice(id)`) — the detail page auto-updates on any change without manual state syncing
- **Mobile sticky action bar** — edit/delete/mark-paid buttons stick to the bottom of the screen on mobile for thumb-friendly access
- **Payment terms select** — 1, 7, 14, 30 day options with automatic `paymentDue` date calculation
