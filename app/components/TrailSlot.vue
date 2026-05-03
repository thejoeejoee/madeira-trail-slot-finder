<script setup lang="ts">
import type { SlotStatus, SlotPcts, GroupCounts } from '~/utils/trail'
import { slotStatusMulti, slotFits } from '~/utils/trail'

const { pcts, time, thresholds, groupCounts } = defineProps<{
  pcts: SlotPcts
  time: string
  thresholds: SlotPcts
  groupCounts: GroupCounts
}>()

const status = computed((): SlotStatus => slotStatusMulti(pcts, thresholds))
const noSpace = computed(() => !slotFits(pcts, thresholds))

const bgClasses: Record<SlotStatus, string> = {
  full: 'bg-skin-full',
  low: 'bg-skin-orange',
  medium: 'bg-skin-yellow',
  good: 'bg-skin-green',
}

const tooltipParts = computed(() => {
  const parts: string[] = [`${time}`]
  if (groupCounts.residents > 0) parts.push(`R:${pcts.residents}%`)
  if (groupCounts.nonResidents > 0) parts.push(`NR:${pcts.nonResidents}%`)
  if (groupCounts.operators > 0) parts.push(`Op:${pcts.operators}%`)
  return parts.join(' • ')
})
</script>

<template>
  <div
    class="group relative flex h-[22px] w-7 cursor-default items-center justify-center rounded-[3px] text-[0.6rem] font-semibold text-white"
    :class="bgClasses[status]"
  >
    <span v-if="noSpace">×</span>
    <div class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-skin-text px-2 py-1 text-[0.68rem] font-normal text-skin-bg group-hover:block">
      {{ tooltipParts }}
    </div>
  </div>
</template>
