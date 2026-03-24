# HBS Entrepreneurship Summit 2026 — Digital Program

A static Next.js (App Router) site for the Harvard Business School Entrepreneurship Summit 2026.

## Tech Stack

- Next.js 16 (App Router, static export)
- TypeScript
- Tailwind CSS v4
- Google Fonts (Playfair Display)

## Features

- **Schedule tab** — filterable/searchable event list with save (star) functionality
- **Speakers tab** — sortable by event type, industry, or A–Z
- **Saved tab** — localStorage-persisted saved events
- **Map tab** — embedded Google Maps with building filters
- **Event detail pages** — `/event/[id]`
- **Speaker profile pages** — `/speaker/[name]`

## Admin Workflow

### 1. Edit speaker/event data

All data lives in `data/schedule.json`. Edit speaker bios, company descriptions, URLs, and event details there.

### 2. Add the summit logo

Drop a square PNG at `public/logo.png` (recommended: 144×144px or larger).

### 3. Add speaker photos

Place headshot images (JPG/PNG) in `public/speakers/` using the naming convention `first-last.jpg` (lowercase, hyphenated). Example: `jd-ross.jpg`, `shayne-coplan.jpg`.

**Automatic matching:** If you have a folder of photos with arbitrary filenames, run:

```bash
node scripts/match-photos.js ./path/to/photos
```

This fuzzy-matches photo filenames to speaker names and copies them to `public/speakers/` with correct names.

### 4. Validate data

```bash
node scripts/validate-data.js
```

Checks for missing bios, invalid URLs, and duplicate speaker names.

### 5. Deploy

```bash
git add -A
git commit -m "Update summit data"
git push
```

Vercel auto-deploys from the `master` branch.

## Development

```bash
npm run dev      # start dev server
npm run build    # build static export to /out
npm run lint     # lint
```

## Structure

```
app/                   # Next.js App Router pages
  page.tsx             # Main SPA shell (schedule/speakers/saved/map tabs)
  event/[id]/          # Event detail pages
  speaker/[name]/      # Speaker profile pages
components/            # Shared UI components
data/schedule.json     # All event and speaker data
lib/                   # Utilities and hooks
public/speakers/       # Speaker headshot photos
scripts/               # Admin helper scripts
```
