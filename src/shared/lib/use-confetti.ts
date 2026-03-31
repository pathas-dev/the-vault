import { useCallback } from 'react'

export function useConfetti() {
  const fire = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    // Gold-themed confetti matching the app's primary color
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffc637', '#e2aa00', '#f1c97d', '#dfe2eb'],
      disableForReducedMotion: true,
    })
  }, [])

  return { fire }
}
