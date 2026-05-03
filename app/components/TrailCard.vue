<script setup lang="ts">
import type { TrailCardData, SlotStatus, SlotPcts, GroupCounts } from '~/utils/trail'
import { statusClass, statusLabel, ASSUMED_CAPACITY } from '~/utils/trail'

const { card, thresholds, groupCounts } = defineProps<{
  card: TrailCardData
  thresholds: SlotPcts
  groupCounts: GroupCounts
}>()

const totalGroup = computed(() =>
  groupCounts.residents + groupCounts.nonResidents + groupCounts.operators,
)

const status = computed((): SlotStatus => statusClass(card.fitsCount, card.parsed.length))
const label = computed(() => statusLabel(card.fitsCount, card.parsed.length))

const statusBgClasses: Record<SlotStatus, string> = {
  full: 'bg-[#fdf0f0] text-skin-full',
  low: 'bg-[#fdf3ec] text-skin-orange',
  medium: 'bg-[#fdf8ec] text-[#9a6b00]',
  good: 'bg-[#eef8f3] text-[#1d7a4e]',
}

interface DateGroup {
  date: string
  dateLabel: string
  slots: Array<{ pcts: SlotPcts; time: string }>
}

const dateGroups = computed((): DateGroup[] => {
  const byDate: Record<string, Array<{ pcts: SlotPcts; time: string }>> = {}
  for (const s of card.parsed) {
    if (!byDate[s.date]) byDate[s.date] = []
    byDate[s.date].push({ pcts: s.pcts, time: s.time })
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, slots]) => ({
      date,
      dateLabel: new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      slots,
    }))
})

const timeHeaders = computed(() =>
  dateGroups.value.length > 0
    ? dateGroups.value[0].slots.map(s => s.time)
    : [],
)
</script>

<template>
  <div class="rounded-md border border-skin-border bg-skin-card p-4 shadow-[0_1px_2px_rgba(45,42,38,0.03)] transition-all hover:border-[#d4cfc7] hover:shadow-[0_3px_12px_rgba(45,42,38,0.08)]">
    <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
      <span class="text-[0.9rem] font-semibold tracking-tight">{{ card.trail.name }}</span>
      <span
        class="whitespace-nowrap rounded-[3px] px-2 py-0.5 text-[0.7rem] font-semibold"
        :class="statusBgClasses[status]"
      >
        {{ label }} — {{ card.fitsCount }}/{{ card.parsed.length }} slots fit {{ totalGroup }}
      </span>
    </div>

    <template v-for="(group, i) in dateGroups" :key="group.date">
      <div v-if="i === 0" class="mb-1">
        <div class="text-[0.68rem] font-medium text-skin-muted">
          &nbsp;
        </div>
        <div class="flex flex-nowrap gap-0.5 overflow-x-auto">
          <div
            v-for="time in timeHeaders"
            :key="time"
            class="flex h-[22px] w-7 items-center justify-center text-[0.55rem] font-medium text-skin-muted"
          >
            {{ time }}
          </div>
        </div>
      </div>
      <div class="mb-0.5">
        <div class="text-[0.68rem] font-medium text-skin-muted">
          {{ group.dateLabel }}
        </div>
        <div class="flex flex-nowrap gap-0.5 overflow-x-auto">
          <TrailSlot
            v-for="(slot, j) in group.slots"
            :key="`${group.date}-${j}`"
            :pcts="slot.pcts"
            :time="slot.time"
            :thresholds="thresholds"
            :group-counts="groupCounts"
          />
        </div>
      </div>
    </template>

    <div class="mt-2 text-[0.72rem] text-skin-muted">
      {{ totalGroup }} people (cap ~{{ ASSUMED_CAPACITY }}) • Avg availability: {{ card.avgPct }}%
    </div>
  </div>
</template>
