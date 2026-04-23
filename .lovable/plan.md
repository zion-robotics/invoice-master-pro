
# Invoice Management App

A pixel-faithful replica of the Figma design — full CRUD invoicing with Lovable Cloud persistence, light/dark mode, status filtering, and full responsiveness.

## Design system (from uploaded design spec)
- **Colors**: Primary `#7C5DFA` (hover `#9277FF`), dark navy `#1E2139` / `#252946`, light bg `#F8F8FB`, dark bg `#141625`, text `#0C0E16`, muted `#888EB0` / `#7E88C3` / `#DFE3FA`, danger `#EC5757` (hover `#FF9797`), success `#33D69F`, pending `#FF8F00`, draft `#373B53`.
- **Typography**: League Spartan (headings + body), bold weights for figures and headings.
- **Components**: Pill-shaped buttons, rounded inputs, soft shadows, status badges with colored dot + tinted background.

## Pages & layout
- **Sidebar (persistent)**: Purple logo top, theme toggle + avatar bottom. Vertical on desktop, horizontal top bar on mobile.
- **/ — Invoice List**: Title + count, "Filter by status" dropdown (checkboxes: Draft / Pending / Paid), "+ New Invoice" pill button. List of invoice cards (#ID, due date, client name, amount, status badge, chevron). Empty state illustration + "There is nothing here" copy when filtered/empty.
- **/invoice/:id — Detail**: Back button, status bar with Edit / Delete / Mark as Paid actions, full invoice card (sender + client address, dates, itemized table with totals, dark amount-due footer).
- **Create / Edit drawer**: Slides in from left over dimmed backdrop. Bill From → Bill To → dates / payment terms / description → editable item list with add/remove rows. Sticky footer: Discard + Save as Draft + Save & Send (Edit mode: Cancel + Save Changes).
- **Delete modal**: Centered confirm dialog with Cancel + Delete buttons, focus-trapped, ESC closes.

## Features
1. **CRUD via Lovable Cloud** — `invoices` table + `invoice_items` table, public read/write (no auth, matches Figma).
2. **Seed data** — 7 sample invoices (RT3080, XM9141, RG0314, RT2080, AA1449, TY9141, FV2353) auto-loaded on first visit.
3. **Status logic** — Draft → Pending (on Save & Send), Pending → Paid (one-way, button disabled once Paid). Paid invoices cannot be marked back to Draft.
4. **Form validation** — Zod schemas: required address fields, valid email, ≥1 item, qty/price > 0. Inline error messages + red border state. Submit blocked while invalid.
5. **Filter** — Multi-select status checkboxes; list updates instantly; empty state when no matches.
6. **Theme toggle** — Light/dark via class on `<html>`, persisted to localStorage, all tokens swap cleanly.
7. **Responsive** — Mobile (320+): stacked cards, full-width drawer, bottom-stacked actions. Tablet (768+): wider cards. Desktop (1024+): sidebar + max-width content column matching Figma.
8. **Hover states** — Buttons lighten, list rows highlight ID in purple, chevron animates, inputs get purple border on focus.
9. **Accessibility** — Semantic `<button>`/`<label>`, focus-trapped modal/drawer, ESC to close, keyboard nav, WCAG AA contrast in both themes.

## Data model (Lovable Cloud)
- `invoices`: id (text, e.g. "XM9141"), created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address (jsonb), client_address (jsonb), total.
- `invoice_items`: id, invoice_id (fk), name, quantity, price, total.
- RLS: public select/insert/update/delete (single-user demo app).

## Out of scope
- Authentication, multi-user, email sending, PDF export.
