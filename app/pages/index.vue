<script setup lang="ts">
const trails = useTrails()
const filtersOpen = ref(false)

onMounted(() => {
  trails.fetchAll()
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-6 py-10 font-sans">
    <h1 class="font-serif text-[2rem] font-normal tracking-tight">
      Madeira Trail Slot Finder
    </h1>
    <p class="mb-6 text-sm text-skin-muted">
      Slot availability — <a href="https://simplifica.madeira.gov.pt/services/78-82-259" target="_blank" class="underline hover:text-skin-text">Simplifica Madeira reservation system</a>
    </p>

    <div class="space-y-4">
      <InfoPanel />

      <ControlsPanel
        :group-counts="trails.groupCounts"
        :filters-open="filtersOpen"
        @update:residents="trails.groupCounts.residents = $event"
        @update:non-residents="trails.groupCounts.nonResidents = $event"
        @update:operators="trails.groupCounts.operators = $event"
        @reload="trails.fetchAll(true)"
        @toggle-filters="filtersOpen = !filtersOpen"
      />

      <TrailFilters
        v-if="filtersOpen"
        :names="trails.availableTrailNames.value"
        :selected="trails.selectedTrails.value"
        :all-selected="trails.allSelected.value"
        @toggle="trails.toggleTrail($event)"
        @toggle-all="trails.allSelected.value ? trails.deselectAll() : trails.selectAll()"
      />

      <LoadingProgress
        :active="trails.loading.value"
        :text="trails.progressText.value"
      />

      <div v-if="trails.error.value" class="py-12 text-center text-sm text-skin-muted">
        Error: {{ trails.error.value }}
      </div>

      <div
        v-else-if="trails.filteredCards.value.length > 0"
        class="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <TrailCard
          v-for="card in trails.filteredCards.value"
          :key="card.trail.id"
          :card="card"
          :thresholds="trails.thresholds.value"
          :group-counts="trails.groupCounts"
        />
      </div>

      <div
        v-else-if="trails.pendingTrailNames.value.length > 0"
        class="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div
          v-for="name in trails.pendingTrailNames.value"
          :key="name"
          class="animate-pulse rounded-md border border-skin-border bg-skin-card p-4"
        >
          <div class="mb-3 text-[0.9rem] font-semibold tracking-tight text-skin-muted">
            {{ name }}
          </div>
          <div class="space-y-1.5">
            <div class="h-[22px] w-3/4 rounded bg-skin-border/50" />
            <div class="h-[22px] w-full rounded bg-skin-border/50" />
            <div class="h-[22px] w-2/3 rounded bg-skin-border/50" />
          </div>
        </div>
      </div>

      <div
        v-else-if="!trails.loading.value && trails.results.value.length > 0"
        class="py-12 text-center text-sm text-skin-muted"
      >
        No availability data found for this date range.
      </div>

      <div
        v-else-if="!trails.loading.value"
        class="py-12 text-center text-sm text-skin-muted"
      >
        Loading availability...
      </div>
    </div>

    <footer class="mt-10 border-t border-skin-border pt-4 text-center text-xs text-skin-muted">
      Built by <a href="https://github.com/thejoeejoee" target="_blank" class="underline hover:text-skin-text">@thejoeejoee</a>
      &middot;
      <a href="https://github.com/thejoeejoee/madeira-trail-slot-finder" target="_blank" class="underline hover:text-skin-text">Source on GitHub</a>
    </footer>
  </div>
</template>
