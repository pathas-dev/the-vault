import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RecordScreen } from '@/pages/record'

const vaultSearchSchema = z.object({
  round: z.coerce.number().optional(),
  new: z.boolean().optional(),
})

export const Route = createFileRoute('/')({
  component: RecordScreen,
  validateSearch: (search) => vaultSearchSchema.parse(search),
})
