import { useState, useEffect } from 'react'

export function useCountUp(target: number, duration: number = 1200): number {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (target === 0) { setDisplay(0); return }
    const steps = Math.ceil(duration / 30)
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(Math.round(current))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [target, duration])
  return display
}
