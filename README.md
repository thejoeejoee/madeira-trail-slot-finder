# Madeira Trail Slot Finder

Availability heatmap for all Madeira levada and vereda trails in one view. Pulls data from the [Simplifica Madeira](https://simplifica.madeira.gov.pt/services/78-82-259) API.

**[Live app](https://thejoeejoee.github.io/madeira-trail-slot-finder/)**

## What it does

Simplifica shows trail availability one route at a time — this app fetches all of them at once and displays a color-coded heatmap. Set your group size per booking category (residents, non-residents, tour operators) to see which slots still fit.

Only a few days ahead are shown because Simplifica releases slots on a rolling window.

## Running locally

```bash
npm install
npm run dev
```

## Stack

Nuxt 4, Tailwind CSS, client-side only (no backend). Deployed to GitHub Pages via Actions.

## Disclaimer

Not affiliated with Simplifica Madeira or Governo Regional da Madeira. Data may be inaccurate or outdated.
