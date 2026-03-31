import { z } from 'zod'

// Valid vault numbers (reserved for future key validation)
export const VALID_VAULT_NUMBERS = [
  '101', '102', '103', '111', '112', '113',
  '201', '202', '203', '211', '212', '213',
  '301', '302', '303', '304', '401',
] as const

export const RoundDataSchema = z.object({
  targetHouse: z.enum(['A', 'B', 'C', 'D']),
  startPoint: z.enum(['A', 'B']),
  horizontalWall: z.enum(['ㄱ', 'ㄴ']).nullable(),
  verticalWall: z.enum(['a', 'b', 'c', 'd']).nullable(),
  vaultValues: z.record(
    z.string(),
    z.array(z.string().regex(/^(\d{1,3})?$/).max(3))
  ),
})

export const RoundsSchema = z.array(RoundDataSchema)

export type RoundData = z.infer<typeof RoundDataSchema>
