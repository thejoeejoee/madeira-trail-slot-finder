<script setup lang="ts">
defineProps<{
  active: boolean
  text: string
}>()
</script>

<template>
  <div
    v-if="active"
    class="flex items-center gap-2 text-sm text-skin-muted"
  >
    <div class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-skin-border border-t-skin-accent" />
    <span>{{ text }}</span>
  </div>
</template>
