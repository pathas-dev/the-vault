import { describe, it, expect } from 'vitest'
import { isValidValue, isFormValid } from './validation'

describe('isValidValue', () => {
  it('returns true for empty string', () => {
    expect(isValidValue('')).toBe(true)
  })

  it('returns true for "50"', () => {
    expect(isValidValue('50')).toBe(true)
  })

  it('returns true for "100"', () => {
    expect(isValidValue('100')).toBe(true)
  })

  it('returns false for "0" (below range)', () => {
    expect(isValidValue('0')).toBe(false)
  })

  it('returns false for "101" (above range)', () => {
    expect(isValidValue('101')).toBe(false)
  })

  it('returns false for "-1"', () => {
    expect(isValidValue('-1')).toBe(false)
  })

  it('returns false for "abc"', () => {
    expect(isValidValue('abc')).toBe(false)
  })
})

describe('isFormValid', () => {
  it('returns true when no vaults are selected (skip round)', () => {
    expect(isFormValid([], {})).toBe(true)
  })

  it('returns true when selected vaults have valid values', () => {
    const selectedVaults = ['101', '102']
    const vaultValues = {
      '101': ['50'],
      '102': ['75'],
    }
    expect(isFormValid(selectedVaults, vaultValues)).toBe(true)
  })

  it('returns false when selected vaults have invalid values', () => {
    const selectedVaults = ['101']
    const vaultValues = {
      '101': ['101'],
    }
    expect(isFormValid(selectedVaults, vaultValues)).toBe(false)
  })

  it('returns false when selected vaults have all empty values (no entry at all)', () => {
    const selectedVaults = ['103']
    const vaultValues = {
      '103': ['', ''],
    }
    expect(isFormValid(selectedVaults, vaultValues)).toBe(false)
  })

  it('returns true when selected vault has at least one non-empty valid value', () => {
    const selectedVaults = ['103']
    const vaultValues = {
      '103': ['50', ''],
    }
    expect(isFormValid(selectedVaults, vaultValues)).toBe(true)
  })
})
