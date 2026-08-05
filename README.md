# The Cashier System

A brandable, offline-first till (point-of-sale) platform for UK retail and hospitality — built as a single self-contained web app prototype. No build step, no backend, no server: open `till_1.html` (or `index.html`, which redirects to it) in a browser and it runs entirely on-device.

This build implements the positioning set out in the project's case file: **powerful enough for a real business, priced honestly, quick to set up, and genuinely brandable** — sitting in the gap between the payment companies (Square, SumUp, Zettle) who keep software shallow, and the software companies (Epos Now, Lightspeed, Zonal) who lock merchants into long contracts.

## Try it

Open `till_1.html` directly, or visit the GitHub Pages deployment. Choose **"Explore with demo data"** on the welcome screen for a pre-populated shop (admin PIN `1234`, cashier PIN `1111`), or **"Set up my business"** to go through the real onboarding wizard.

## What's in this build

**Table-stakes till features**
- Product grid with categories, search by name/SKU/barcode, variants via details field
- Cash, card (simulated), split-by-amount and split-ways (evenly or by item) payments
- Line-level and order-level discounts, with manager-PIN approval above a threshold
- Audited void-sale and no-sale actions, all requiring manager approval
- Refunds linked to the original transaction, partial or full, with reason capture and choice of tender
- Park / recall sale (doubles as "open tabs" for hospitality-type businesses)
- Cash-up / Z-report with expected vs. declared cash and variance
- Stock tracking (optional, per item): live levels, low-stock alerts, stock takes, wastage logging
- Age-restricted items with a logged Challenge 25 prompt
- Customers & a simple loyalty points scheme, redeemable at checkout
- Receipts: print, email (simulated) or none, from a single step

**The brandability / customisation USP**
- Full theme studio: logo, colours, corner-radius style, typeface, light/dark/auto appearance
- **Branding depth, set per stage**: during setup (and any time after, from Control panel → Branding & theme) the owner chooses how strongly their identity shows up — *Subtle* (plain text, no logo), *Standard* (logo + brand colours, light touch) or *Bold* (full brand-colour bar, largest logo, watermark) — picked independently for the till screen, login screen, receipts and the customer display
- **Multiple brand images**, not just one logo: an additional till watermark, login-screen background and receipt banner, each optional and each surfaced only where relevant (uploaded from Control panel → Branding & theme)
- A design language closer to a traditional EPOS terminal than a generic app: solid brand-colour product keys with bold, plain-worded labels (no emoji anywhere in the till, checkout, receipt or customer-display screens — icons are words), a clear itemised order ticket, and function buttons (Tickets, No sale, Display, Control panel, Log out) instead of icon glyphs
- Editable terminology (what your items are called), receipt template, paper width
- 200+ business types across 13 industry groups, each mapped to a starter catalogue "configuration pack" (retail, café, bar, restaurant, takeaway, services, market stall, general)
- A second, live customer-facing display screen (open via the "Display" button) mirroring the current sale, themed by its own branding depth

**Trust & positioning differentiators from the case file**
- Offline-first: all data lives in `localStorage` on the device; the app is fully usable with no connection, survives reloads, and installs as a PWA via `manifest.json` + `sw.js`
- Processor neutrality: a "Payments & hardware" settings tab for choosing/switching acquirer, cosmetic in this prototype but modelled as a swappable layer
- Full data portability: export everything as JSON, or catalogue/sales as CSV, any time, plus import and a local data wipe
- A published customer charter (rolling terms, no exit fees, capped price rises, your data, your hardware)
- An "Insights" panel in Reports — plain-English, explainable observations computed only from this till's own local data

## Project structure

- `till_1.html` — the entire application (markup, styles and logic in one file)
- `index.html` — redirects to `till_1.html` (keeps the GitHub Pages root working)
- `manifest.json`, `icon.svg`, `sw.js` — PWA/offline support for `till_1.html`

## Status

Prototype / early build, matching Phase 0–1 of the case file's plan of action. Payment processing, SMS receipts and multi-site/reseller features are simulated or out of scope for this stage.
