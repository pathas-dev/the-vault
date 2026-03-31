import { useCallback } from 'react'
import { VAULT_CONFIG } from '@/shared/config'

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      vault: string,
      valueIndex: number,
      visibleVaults: string[],
    ) => {
      const currentIndex = visibleVaults.indexOf(vault)
      const capacity = VAULT_CONFIG[vault]
      if (e.key === 'Enter') {
        e.preventDefault()
        if (valueIndex < capacity - 1) {
          const nextInput = document.querySelector<HTMLInputElement>(
            `input[name="${vault}-v${valueIndex + 1}"]`,
          )
          nextInput?.focus()
        } else {
          const nextVault = visibleVaults[currentIndex + 1]
          if (nextVault) {
            const nextInput = document.querySelector<HTMLInputElement>(
              `input[name="${nextVault}-v0"]`,
            )
            nextInput?.focus()
          }
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextVault = visibleVaults[currentIndex + 1]
        if (nextVault) {
          const targetIdx = Math.min(valueIndex, VAULT_CONFIG[nextVault] - 1)
          const nextInput = document.querySelector<HTMLInputElement>(
            `input[name="${nextVault}-v${targetIdx}"]`,
          )
          nextInput?.focus()
        }
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prevVault = visibleVaults[currentIndex - 1]
        if (prevVault) {
          const targetIdx = Math.min(valueIndex, VAULT_CONFIG[prevVault] - 1)
          const prevInput = document.querySelector<HTMLInputElement>(
            `input[name="${prevVault}-v${targetIdx}"]`,
          )
          prevInput?.focus()
        }
      }
      if (e.key === 'ArrowRight' && valueIndex < capacity - 1) {
        const nextInput = document.querySelector<HTMLInputElement>(
          `input[name="${vault}-v${valueIndex + 1}"]`,
        )
        nextInput?.focus()
      }
      if (e.key === 'ArrowLeft' && valueIndex > 0) {
        const prevInput = document.querySelector<HTMLInputElement>(
          `input[name="${vault}-v${valueIndex - 1}"]`,
        )
        prevInput?.focus()
      }
    },
    [],
  )

  return { handleKeyDown }
}
