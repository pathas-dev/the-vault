/** Recharts requires raw hex — CSS custom properties not supported in SVG fill */
export const CHART_COLORS = {
  bar: '#ffc637',        // --color-primary
  text: '#dfe2eb',       // --color-on-surface
  tooltip: '#181c22',    // --color-surface-container
  tooltipBorder: 'rgba(255,198,55,0.2)',
  cursor: 'rgba(255,198,55,0.05)',
} as const

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
  '401': 2,
}

export const VAULT_NUMBERS = Object.keys(VAULT_CONFIG)
export const MAX_CAPACITY = Math.max(...Object.values(VAULT_CONFIG))
export const START_POINTS = ['A', 'B'] as const
export const HORIZONTAL_WALLS = ['ㄱ', 'ㄴ'] as const
export const VERTICAL_WALLS = ['a', 'b', 'c', 'd'] as const

export function initVaultValues(): Record<string, string[]> {
  return VAULT_NUMBERS.reduce(
    (acc, v) => ({ ...acc, [v]: Array(VAULT_CONFIG[v]).fill('') }),
    {} as Record<string, string[]>,
  )
}
