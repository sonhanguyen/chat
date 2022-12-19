export default class LocalDataService<T extends {}> {
  get<K extends string & keyof T>(key: K): T[K] | null {
    if (typeof window === 'undefined') return null
    const value = localStorage.getItem(key)
    if (value === null) return null
    return JSON.parse(value)
  }

  set<K extends string & keyof T>(key: K, val: T[K]) {
    localStorage.setItem(key, JSON.stringify(val))
  }

  clear() {
    localStorage.clear()
  }
}