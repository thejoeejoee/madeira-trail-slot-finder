const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export function useCache() {
  function get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const { ts, data } = JSON.parse(raw) as { ts: number; data: T }
      if (Date.now() - ts > CACHE_TTL) {
        localStorage.removeItem(key)
        return null
      }
      return data
    } catch {
      return null
    }
  }

  function set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }))
    } catch {
      // localStorage full or unavailable
    }
  }

  function clear(): number {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('madeira_'))
    keys.forEach(k => localStorage.removeItem(k))
    return keys.length
  }

  async function cachedFetch<T>(url: string, cacheKey: string): Promise<T> {
    const cached = get<T>(cacheKey)
    if (cached) return cached
    const res = await fetch(url)
    const json = await res.json() as T
    set(cacheKey, json)
    return json
  }

  return { get, set, clear, cachedFetch }
}
