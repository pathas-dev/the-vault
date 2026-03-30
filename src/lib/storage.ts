import { RoundsSchema, type RoundData } from './schemas'

const STORAGE_KEY = 'vault_rounds'

export function getSavedRounds(): RoundData[] {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return []
  }

  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return []
  }

  try {
    const parsed = JSON.parse(saved)
    const result = RoundsSchema.safeParse(parsed)

    if (result.success) {
      return result.data
    } else {
      console.error('Session storage data failed schema validation:', result.error)
      return []
    }
  } catch (error) {
    console.error('Failed to parse session storage data:', error)
    return []
  }
}

export function saveRounds(rounds: RoundData[]): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rounds))
  }
}

export function clearSavedRounds(): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
