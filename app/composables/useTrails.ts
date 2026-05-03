import type { TrailResource, TrailConfig, TrailResult, TrailCardData, ParsedSlot, GroupCounts, SlotPcts } from '~/utils/trail'
import { API_BASE, PROCESS_ID, SERVICE_ID, minPctForGroup, parseSlotCategories, slotFits, parseTrailNumber } from '~/utils/trail'

export function useTrails() {
  const { cachedFetch, clear: clearCacheStorage } = useCache()

  const groupCounts = reactive<GroupCounts>({
    residents: 0,
    nonResidents: 1,
    operators: 0,
  })

  const loading = ref(false)
  const progressText = ref('')
  const error = ref<string | null>(null)
  const results = ref<TrailResult[]>([])
  const pendingTrailNames = ref<string[]>([])
  const selectedTrails = ref<Set<string>>(new Set())

  const thresholds = computed((): SlotPcts => ({
    residents: minPctForGroup(groupCounts.residents),
    nonResidents: minPctForGroup(groupCounts.nonResidents),
    operators: minPctForGroup(groupCounts.operators),
  }))

  const availableTrailNames = computed(() =>
    results.value
      .filter(r => r.config?.intervals)
      .map(r => r.trail.name)
      .sort((a, b) => parseTrailNumber(a) - parseTrailNumber(b)),
  )

  const filteredCards = computed((): TrailCardData[] => {
    const cards: TrailCardData[] = []
    const thresh = thresholds.value

    for (const { trail, config } of results.value) {
      if (!selectedTrails.value.has(trail.name)) continue
      if (!config?.intervals) continue

      const parsed: ParsedSlot[] = []
      for (const s of config.intervals) {
        const pcts = parseSlotCategories(s.slotTitle)
        if (!pcts) continue
        const time = s.begin.date.substring(11, 16)
        const date = s.begin.date.substring(0, 10)
        parsed.push({ pcts, time, date })
      }

      if (parsed.length === 0) continue

      const worstPcts = parsed.map((s) => {
        const active: number[] = []
        if (thresh.residents > 0) active.push(s.pcts.residents)
        if (thresh.nonResidents > 0) active.push(s.pcts.nonResidents)
        if (thresh.operators > 0) active.push(s.pcts.operators)
        return active.length > 0 ? Math.min(...active) : 100
      })

      const minPct = Math.min(...worstPcts)
      const avgPct = Math.round(worstPcts.reduce((a, v) => a + v, 0) / worstPcts.length)
      const fitsCount = parsed.filter(s => slotFits(s.pcts, thresh)).length

      cards.push({ trail, parsed, minPct, avgPct, fitsCount })
    }

    cards.sort((a, b) => parseTrailNumber(a.trail.name) - parseTrailNumber(b.trail.name))
    return cards
  })

  async function fetchAll(force = false) {
    if (force) {
      clearCacheStorage()
      results.value = []
      pendingTrailNames.value = []
      selectedTrails.value = new Set()
    }
    loading.value = true
    error.value = null
    progressText.value = 'Fetching trail list...'

    try {
      const listData = await cachedFetch<{ data: TrailResource[] }>(
        `${API_BASE}/${SERVICE_ID}/resources?processId=${PROCESS_ID}`,
        'madeira_trails_list',
      )
      const trails = listData.data

      pendingTrailNames.value = trails
        .map(t => t.name)
        .sort((a, b) => parseTrailNumber(a) - parseTrailNumber(b))

      progressText.value = `Loading 0/${trails.length} trails...`

      const fetchedResults: TrailResult[] = []
      const batchSize = 6

      for (let i = 0; i < trails.length; i += batchSize) {
        const batch = trails.slice(i, i + batchSize)
        const promises = batch.map(t =>
          cachedFetch<{ data: TrailConfig }>(
            `${API_BASE}/${PROCESS_ID}/resources/${t.id}/configuration`,
            `madeira_trail_${t.id}`,
          )
            .then(d => ({ trail: t, config: d.data }))
            .catch(() => ({ trail: t, config: null })),
        )
        const batchResults = await Promise.all(promises)
        fetchedResults.push(...batchResults)
        progressText.value = `Loading ${Math.min(i + batchSize, trails.length)}/${trails.length} trails...`
      }

      results.value = fetchedResults
      pendingTrailNames.value = []
      selectedTrails.value = new Set(
        fetchedResults
          .filter(r => r.config?.intervals)
          .map(r => r.trail.name),
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function toggleTrail(name: string) {
    const s = new Set(selectedTrails.value)
    if (s.has(name)) {
      s.delete(name)
    } else {
      s.add(name)
    }
    selectedTrails.value = s
  }

  function selectAll() {
    selectedTrails.value = new Set(availableTrailNames.value)
  }

  function deselectAll() {
    selectedTrails.value = new Set()
  }

  const allSelected = computed(() =>
    availableTrailNames.value.length > 0
    && availableTrailNames.value.every(n => selectedTrails.value.has(n)),
  )

  function clearCache() {
    const count = clearCacheStorage()
    alert(`Cleared ${count} cached items.`)
  }

  return {
    groupCounts,
    loading,
    progressText,
    error,
    results,
    pendingTrailNames,
    selectedTrails,
    thresholds,
    availableTrailNames,
    filteredCards,
    allSelected,
    fetchAll,
    toggleTrail,
    selectAll,
    deselectAll,
    clearCache,
  }
}
