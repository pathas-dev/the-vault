import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getSavedRounds, saveRounds, clearSavedRounds } from './storage'
import { type RoundData } from './schemas'

describe('storage utility', () => {
  const mockRound: RoundData = {
    targetHouse: 'A',
    startPoint: 'A',
    horizontalWall: null,
    verticalWall: null,
    vaultValues: { '101': ['10'] }
  }

  beforeEach(() => {
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
  })

  it('should return an empty array if nothing is saved', () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue(null)
    expect(getSavedRounds()).toEqual([])
  })

  it('should return saved rounds if data is valid', () => {
    const rounds = [mockRound]
    vi.mocked(sessionStorage.getItem).mockReturnValue(JSON.stringify(rounds))
    expect(getSavedRounds()).toEqual(rounds)
  })

  it('should return an empty array if data is invalid JSON', () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue('invalid-json')
    expect(getSavedRounds()).toEqual([])
  })

  it('should return an empty array if data does not match schema', () => {
    const invalidRounds = [{ something: 'else' }]
    vi.mocked(sessionStorage.getItem).mockReturnValue(JSON.stringify(invalidRounds))
    expect(getSavedRounds()).toEqual([])
  })

  it('should save rounds to sessionStorage', () => {
    const rounds = [mockRound]
    saveRounds(rounds)
    expect(sessionStorage.setItem).toHaveBeenCalledWith('vault_rounds', JSON.stringify(rounds))
  })

  it('should clear rounds from sessionStorage', () => {
    clearSavedRounds()
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('vault_rounds')
  })
})
