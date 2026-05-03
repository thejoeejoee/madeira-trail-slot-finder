<script setup lang="ts">
</script>

<template>
  <div class="rounded-md border border-skin-accent bg-[#fdf8f3] p-4 text-sm leading-relaxed">
    <p class="mb-1 text-[0.82rem] font-semibold text-skin-text">
      Why this exists
    </p>
    <p class="mb-3 text-skin-muted">
      Simplifica only shows availability one trail at a time with no overview — making it tedious to compare slots across trails and dates.
    </p>
    <p class="mb-1 text-[0.82rem] font-semibold text-skin-text">
      How it works
    </p>
    <ul class="mb-3 ml-5 list-disc space-y-0.5 text-skin-muted">
      <li>Fetches all trails at once and displays availability across all categories as a color-coded heatmap</li>
      <li>Set your group size per category to highlight slots that can fit your party</li>
      <li>Exact capacity per slot is not published — percentage-to-headcount conversion is approximate (~40 assumed)</li>
      <li>Slots below your threshold are marked <strong class="text-skin-full">×</strong></li>
      <li>Only a few days are shown — Simplifica releases slots on a rolling window, not months ahead</li>
      <li>Data is cached locally for 1 hour</li>
    </ul>
    <div class="mb-3 flex flex-wrap gap-5 text-xs font-medium text-skin-muted">
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-2.5 rounded-sm bg-skin-green" />
        75–100%
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-2.5 rounded-sm bg-skin-yellow" />
        40–74%
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-2.5 rounded-sm bg-skin-orange" />
        1–39%
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-2.5 rounded-sm bg-skin-full" />
        0% (Full)
      </span>
    </div>
    <p class="text-[0.7rem] text-skin-muted opacity-70">
      Not affiliated with Simplifica Madeira or Governo Regional da Madeira. Data may be inaccurate or outdated. Use at your own risk — no warranties of any kind.
    </p>
  </div>
</template>
