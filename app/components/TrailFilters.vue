<script setup lang="ts">
defineProps<{
  names: string[]
  selected: Set<string>
  allSelected: boolean
}>()

const emit = defineEmits<{
  'toggle': [name: string]
  'toggle-all': []
}>()
</script>

<template>
  <div
    v-if="names.length > 0"
    class="rounded-md border border-skin-border bg-skin-card p-4 shadow-[0_1px_3px_rgba(45,42,38,0.04)]"
  >
    <div class="mb-2 flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-wider text-skin-muted">
        Filter Trails
      </span>
      <span
        class="cursor-pointer text-xs text-skin-muted underline"
        @click="emit('toggle-all')"
      >
        {{ allSelected ? 'Deselect all' : 'Select all' }}
      </span>
    </div>
    <div class="columns-2 gap-x-6 sm:columns-3 md:columns-4">
      <label
        v-for="name in names"
        :key="name"
        class="flex cursor-pointer select-none items-center gap-1.5 py-0.5 text-[0.8rem]"
      >
        <input
          type="checkbox"
          :checked="selected.has(name)"
          class="accent-skin-accent"
          @change="emit('toggle', name)"
        >
        <span class="truncate">{{ name }}</span>
      </label>
    </div>
  </div>
</template>
