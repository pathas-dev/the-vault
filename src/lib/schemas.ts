import { z } from 'zod'

export const RoundDataSchema = z.object({
  targetHouse: z.string(),
  startPoint: z.string(),
  horizontalWall: z.string().nullable(),
  verticalWall: z.string().nullable(),
  vaultValues: z.record(z.array(z.string())),
})

export const RoundsSchema = z.array(RoundDataSchema)

export type RoundData = z.infer<typeof RoundDataSchema>
