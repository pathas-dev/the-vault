import { createFileRoute } from '@tanstack/react-router'
import { SummaryScreen } from '@/pages/summary'

export const Route = createFileRoute('/summary' as any)({
  component: SummaryScreen,
})
