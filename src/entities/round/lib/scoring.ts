import type { RoundData } from '../model/round'

export function calculateRoundTotal(round: RoundData): number {
  return Object.values(round.vaultValues).reduce(
    (sum, values) => sum + values.reduce((s, v) => s + (parseInt(v) || 0), 0),
    0
  )
}

export function calculateGrandTotal(rounds: RoundData[]): number {
  return rounds.reduce((sum, round) => sum + calculateRoundTotal(round), 0)
}
