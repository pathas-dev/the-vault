import { MAX_VAULT_VALUE } from '../config'

export function isValidValue(val: string): boolean {
  return val === '' || (Number(val) >= 0 && Number(val) <= MAX_VAULT_VALUE)
}

export function isFormValid(selectedVaults: string[], vaultValues: Record<string, string[]>): boolean {
  return (
    selectedVaults.length === 0 ||
    selectedVaults.every((v) => {
      const values = vaultValues[v]
      return (
        values.some((val) => val !== '') &&
        values.every((val) => isValidValue(val))
      )
    })
  )
}
