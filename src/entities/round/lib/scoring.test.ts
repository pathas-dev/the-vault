import { describe, it, expect } from 'vitest'
import { calculateRoundTotal, calculateGrandTotal } from './scoring'
import type { RoundData } from '../model/round'

const baseRound: Omit<RoundData, 'vaultValues'> = {
  targetHouse: 'A',
  startPoint: 'A',
  horizontalWall: null,
  verticalWall: null,
}

describe('calculateRoundTotal', () => {
  it('returns 0 for empty vaultValues', () => {
    const round: RoundData = { ...baseRound, vaultValues: {} }
    expect(calculateRoundTotal(round)).toBe(0)
  })

  it('returns correct sum for single vault with one value', () => {
    const round: RoundData = { ...baseRound, vaultValues: { '101': ['50'] } }
    expect(calculateRoundTotal(round)).toBe(50)
  })

  it('returns correct sum for multiple vaults with multiple values', () => {
    const round: RoundData = {
      ...baseRound,
      vaultValues: {
        '101': ['30'],
        '103': ['20', '15'],
        '401': ['10', '5', '8'],
      },
    }
    expect(calculateRoundTotal(round)).toBe(88)
  })

  it('ignores empty strings (treated as 0)', () => {
    const round: RoundData = {
      ...baseRound,
      vaultValues: {
        '101': [''],
        '103': ['', '25'],
      },
    }
    expect(calculateRoundTotal(round)).toBe(25)
  })
})

describe('calculateGrandTotal', () => {
  it('returns 0 for empty rounds array', () => {
    expect(calculateGrandTotal([])).toBe(0)
  })

  it('returns correct grand total for a full 7-round game scenario', () => {
    const rounds: RoundData[] = [
      { ...baseRound, vaultValues: { '101': ['50'] } },
      { ...baseRound, vaultValues: { '102': ['30'], '103': ['20', '10'] } },
      { ...baseRound, vaultValues: { '201': ['40'] } },
      { ...baseRound, vaultValues: { '401': ['100', '80', '60'] } },
      { ...baseRound, vaultValues: { '301': ['70'], '302': ['45', '55'] } },
      { ...baseRound, vaultValues: { '111': ['25'], '113': ['35', '15'] } },
      { ...baseRound, vaultValues: { '212': ['90', '10'] } },
    ]
    // 50 + 60 + 40 + 240 + 170 + 75 + 100 = 735
    expect(calculateGrandTotal(rounds)).toBe(735)
  })
})
