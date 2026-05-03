export const API_BASE = 'https://simplifica.madeira.gov.pt/api/infoProcess'
export const PROCESS_ID = 3314695
export const SERVICE_ID = 259
export const ASSUMED_CAPACITY = 40

export type SlotStatus = 'full' | 'low' | 'medium' | 'good'

export interface GroupCounts {
  residents: number
  nonResidents: number
  operators: number
}

export interface SlotPcts {
  residents: number
  nonResidents: number
  operators: number
}

export interface ParsedSlot {
  pcts: SlotPcts
  time: string
  date: string
}

export interface TrailResource {
  id: number
  name: string
}

export interface TrailConfig {
  intervals: Array<{
    slotTitle: string
    begin: { date: string }
  }>
}

export interface TrailResult {
  trail: TrailResource
  config: TrailConfig | null
}

export interface TrailCardData {
  trail: TrailResource
  parsed: ParsedSlot[]
  minPct: number
  avgPct: number
  fitsCount: number
}

export function minPctForGroup(count: number): number {
  if (count <= 0) return 0
  return Math.ceil((count / ASSUMED_CAPACITY) * 100)
}

export function parseSlotCategories(slotTitle: string): SlotPcts | null {
  const r = slotTitle.match(/(\d+)%\s*Residentes/)
  const nr = slotTitle.match(/(\d+)%\s*N[ãa]o residentes/)
  const op = slotTitle.match(/(\d+)%\s*Operadores econ[óo]micos/)
  if (!r && !nr && !op) return null
  return {
    residents: r ? parseInt(r[1], 10) : 0,
    nonResidents: nr ? parseInt(nr[1], 10) : 0,
    operators: op ? parseInt(op[1], 10) : 0,
  }
}

export function slotStatusMulti(pcts: SlotPcts, thresholds: SlotPcts): SlotStatus {
  const active: Array<{ pct: number; thresh: number }> = []
  if (thresholds.residents > 0) active.push({ pct: pcts.residents, thresh: thresholds.residents })
  if (thresholds.nonResidents > 0) active.push({ pct: pcts.nonResidents, thresh: thresholds.nonResidents })
  if (thresholds.operators > 0) active.push({ pct: pcts.operators, thresh: thresholds.operators })

  if (active.length === 0) return 'good'

  let worst: SlotStatus = 'good'
  for (const { pct, thresh } of active) {
    const s = slotClass(pct, thresh)
    if (statusRank(s) < statusRank(worst)) worst = s
  }
  return worst
}

export function slotClass(pct: number, threshold: number): SlotStatus {
  if (pct < threshold) return 'full'
  if (pct < threshold + 20) return 'low'
  if (pct < threshold + 50) return 'medium'
  return 'good'
}

export function statusClass(fitsCount: number, total: number): SlotStatus {
  const ratio = total > 0 ? fitsCount / total : 0
  if (ratio === 0) return 'full'
  if (ratio < 0.25) return 'low'
  if (ratio < 0.6) return 'medium'
  return 'good'
}

export function statusLabel(fitsCount: number, total: number): string {
  const ratio = total > 0 ? fitsCount / total : 0
  if (ratio === 0) return 'No Space'
  if (ratio < 0.25) return 'Mostly Full'
  if (ratio < 0.6) return 'Limited'
  if (ratio < 0.85) return 'Moderate'
  return 'Available'
}

function statusRank(s: SlotStatus): number {
  switch (s) {
    case 'full': return 0
    case 'low': return 1
    case 'medium': return 2
    case 'good': return 3
  }
}

export function effectivePct(pcts: SlotPcts, counts: GroupCounts): number {
  const active: number[] = []
  if (counts.residents > 0) active.push(pcts.residents)
  if (counts.nonResidents > 0) active.push(pcts.nonResidents)
  if (counts.operators > 0) active.push(pcts.operators)
  if (active.length === 0) return 100
  return Math.min(...active)
}

export function slotFits(pcts: SlotPcts, thresholds: SlotPcts): boolean {
  if (thresholds.residents > 0 && pcts.residents < thresholds.residents) return false
  if (thresholds.nonResidents > 0 && pcts.nonResidents < thresholds.nonResidents) return false
  if (thresholds.operators > 0 && pcts.operators < thresholds.operators) return false
  return true
}

export function parseTrailNumber(name: string): number {
  const m = name.match(/PR(\d+)(?:\.(\d+))?/)
  if (!m) return Infinity
  return parseInt(m[1], 10) * 100 + (m[2] ? parseInt(m[2], 10) : 0)
}
