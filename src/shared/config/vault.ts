// Domain constants for vault configuration
export const TOTAL_ROUNDS = 7
export const MAX_VAULT_VALUE = 100

export const VAULT_CONFIG: Record<string, number> = {
  '101': 1,
  '102': 1,
  '103': 2,
  '111': 1,
  '112': 1,
  '113': 2,
  '201': 1,
  '202': 2,
  '203': 2,
  '211': 1,
  '212': 2,
  '213': 2,
  '301': 1,
  '302': 2,
  '303': 2,
  '304': 2,
  '401': 3,
}

export const VAULT_NUMBERS = Object.keys(VAULT_CONFIG)
export const MAX_CAPACITY = Math.max(...Object.values(VAULT_CONFIG))

export const TARGET_HOUSES = ['A', 'B', 'C', 'D'] as const
export const START_POINTS = ['A', 'B'] as const
export const HORIZONTAL_WALLS = ['ㄴ', 'ㄷ'] as const
export const VERTICAL_WALLS = ['a', 'b', 'c', 'd'] as const

export function initVaultValues(): Record<string, string[]> {
  return VAULT_NUMBERS.reduce(
    (acc, v) => ({ ...acc, [v]: Array(VAULT_CONFIG[v]).fill('') }),
    {} as Record<string, string[]>,
  )
}
