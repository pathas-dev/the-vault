import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/record' as any)({
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})
