import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/about' as any)({
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})
