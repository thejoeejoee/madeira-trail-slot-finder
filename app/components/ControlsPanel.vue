<script setup lang="ts">
import type { GroupCounts } from '~/utils/trail'

const { groupCounts, filtersOpen } = defineProps<{
  groupCounts: GroupCounts
  filtersOpen: boolean
}>()

const emit = defineEmits<{
  'update:residents': [value: number]
  'update:nonResidents': [value: number]
  'update:operators': [value: number]
  'reload': []
  'toggle-filters': []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 rounded-md border border-skin-border bg-skin-card p-4 shadow-[0_1px_3px_rgba(45,42,38,0.04)]">
    <div>
      <label class="text-xs font-semibold uppercase tracking-wider text-skin-muted">Residents</label>
      <input
        type="number"
        :value="groupCounts.residents"
        min="0"
        max="40"
        class="mt-1 block w-14 rounded border border-skin-border bg-skin-bg px-2 py-2 font-sans text-sm"
        @input="emit('update:residents', Number(($event.target as HTMLInputElement).value) || 0)"
      >
    </div>
    <div>
      <label class="text-xs font-semibold uppercase tracking-wider text-skin-muted">Non-residents</label>
      <input
        type="number"
        :value="groupCounts.nonResidents"
        min="0"
        max="40"
        class="mt-1 block w-14 rounded border border-skin-border bg-skin-bg px-2 py-2 font-sans text-sm"
        @input="emit('update:nonResidents', Number(($event.target as HTMLInputElement).value) || 0)"
      >
    </div>
    <div>
      <label class="text-xs font-semibold uppercase tracking-wider text-skin-muted">Operators</label>
      <input
        type="number"
        :value="groupCounts.operators"
        min="0"
        max="40"
        class="mt-1 block w-14 rounded border border-skin-border bg-skin-bg px-2 py-2 font-sans text-sm"
        @input="emit('update:operators', Number(($event.target as HTMLInputElement).value) || 0)"
      >
    </div>
    <button
      class="rounded border border-skin-border bg-transparent px-4 py-2 text-[0.825rem] font-semibold text-skin-muted transition-colors hover:bg-skin-bg"
      :class="filtersOpen ? 'border-skin-accent text-skin-accent' : ''"
      @click="emit('toggle-filters')"
    >
      Filters
    </button>
    <button
      class="ml-auto rounded border-none bg-skin-text px-5 py-2 text-[0.825rem] font-semibold text-skin-bg transition-colors hover:bg-[#1a1815]"
      @click="emit('reload')"
    >
      Reset Cache & Reload
    </button>
  </div>
</template>
