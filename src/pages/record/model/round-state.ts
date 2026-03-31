import { useState, useReducer, useEffect, useCallback } from 'react'
import { useNavigate, useSearch, useBlocker } from '@tanstack/react-router'
import { getSavedRounds, saveRounds, clearSavedRounds } from '@/shared/api/storage'
import { initVaultValues, VAULT_CONFIG, TOTAL_ROUNDS } from '@/shared/config'
import type { RoundData } from '@/entities/round'

interface UndoInfo {
  vault: string
  values: string[]
  timeoutId: ReturnType<typeof setTimeout>
}

interface RoundState {
  viewMode: 'input' | 'summary'
  isHistoryOpen: boolean
  historyRounds: RoundData[]
  targetHouse: 'A' | 'B' | 'C' | 'D'
  startPoint: 'A' | 'B'
  horizontalWall: 'ㄴ' | 'ㄷ' | null
  verticalWall: 'a' | 'b' | 'c' | 'd' | null
  selectedVaults: string[]
  vaultValues: Record<string, string[]>
  numpadTarget: { vault: string; index: number } | null
  numpadError: boolean
  undoInfo: UndoInfo | null
}

type RoundAction =
  | { type: 'SET_VIEW_MODE'; payload: 'input' | 'summary' }
  | { type: 'SET_HISTORY_OPEN'; payload: boolean }
  | { type: 'SET_HISTORY_ROUNDS'; payload: RoundData[] }
  | { type: 'SET_TARGET_HOUSE'; payload: 'A' | 'B' | 'C' | 'D' }
  | { type: 'SET_START_POINT'; payload: 'A' | 'B' }
  | { type: 'SET_HORIZONTAL_WALL'; payload: 'ㄴ' | 'ㄷ' | null }
  | { type: 'SET_VERTICAL_WALL'; payload: 'a' | 'b' | 'c' | 'd' | null }
  | { type: 'SET_SELECTED_VAULTS'; payload: string[] }
  | { type: 'SET_VAULT_VALUES'; payload: Record<string, string[]> }
  | { type: 'UPDATE_VAULT_VALUE'; payload: { vault: string; index: number; value: string } }
  | { type: 'TOGGLE_VAULT'; payload: string }
  | { type: 'SET_NUMPAD_TARGET'; payload: { vault: string; index: number } | null }
  | { type: 'SET_NUMPAD_ERROR'; payload: boolean }
  | { type: 'RESET_ROUND' }
  | { type: 'SET_UNDO_INFO'; payload: UndoInfo | null }
  | { type: 'EXECUTE_UNDO' }
  | { type: 'CLEAR_UNDO' }

function createInitialState(): RoundState {
  return {
    viewMode: 'input',
    isHistoryOpen: false,
    historyRounds: [],
    targetHouse: 'A',
    startPoint: 'A',
    horizontalWall: null,
    verticalWall: null,
    selectedVaults: [],
    vaultValues: initVaultValues(),
    numpadTarget: null,
    numpadError: false,
    undoInfo: null,
  }
}

function roundReducer(state: RoundState, action: RoundAction): RoundState {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    case 'SET_HISTORY_OPEN':
      return { ...state, isHistoryOpen: action.payload }
    case 'SET_HISTORY_ROUNDS':
      return { ...state, historyRounds: action.payload }
    case 'SET_TARGET_HOUSE':
      return { ...state, targetHouse: action.payload }
    case 'SET_START_POINT':
      return { ...state, startPoint: action.payload }
    case 'SET_HORIZONTAL_WALL':
      return { ...state, horizontalWall: action.payload }
    case 'SET_VERTICAL_WALL':
      return { ...state, verticalWall: action.payload }
    case 'SET_SELECTED_VAULTS':
      return { ...state, selectedVaults: action.payload }
    case 'SET_VAULT_VALUES':
      return { ...state, vaultValues: action.payload }
    case 'UPDATE_VAULT_VALUE': {
      const { vault, index, value } = action.payload
      const arr = [...state.vaultValues[vault]]
      arr[index] = value
      return { ...state, vaultValues: { ...state.vaultValues, [vault]: arr } }
    }
    case 'TOGGLE_VAULT': {
      const vault = action.payload
      if (state.selectedVaults.includes(vault)) {
        const currentValues = state.vaultValues[vault]
        const hasValues = currentValues.some((v) => v !== '')
        const newNumpadTarget = state.numpadTarget?.vault === vault ? null : state.numpadTarget

        if (hasValues) {
          // Values exist — defer actual clearing; undo toast will handle it
          return {
            ...state,
            numpadTarget: newNumpadTarget,
            selectedVaults: state.selectedVaults.filter((v) => v !== vault),
            // Keep current values intact until undo window expires
          }
        }

        return {
          ...state,
          numpadTarget: newNumpadTarget,
          selectedVaults: state.selectedVaults.filter((v) => v !== vault),
          vaultValues: {
            ...state.vaultValues,
            [vault]: Array(VAULT_CONFIG[vault]).fill(''),
          },
        }
      }
      return {
        ...state,
        selectedVaults: [...state.selectedVaults, vault],
      }
    }
    case 'SET_NUMPAD_TARGET':
      return { ...state, numpadTarget: action.payload }
    case 'SET_NUMPAD_ERROR':
      return { ...state, numpadError: action.payload }
    case 'RESET_ROUND':
      return {
        ...state,
        viewMode: 'input',
        targetHouse: 'A',
        startPoint: 'A',
        horizontalWall: null,
        verticalWall: null,
        selectedVaults: [],
        vaultValues: initVaultValues(),
        numpadTarget: null,
        numpadError: false,
        undoInfo: null,
      }
    case 'SET_UNDO_INFO':
      return { ...state, undoInfo: action.payload }
    case 'EXECUTE_UNDO': {
      if (!state.undoInfo) return state
      const { vault, values } = state.undoInfo
      return {
        ...state,
        selectedVaults: [...state.selectedVaults, vault],
        vaultValues: { ...state.vaultValues, [vault]: values },
        undoInfo: null,
      }
    }
    case 'CLEAR_UNDO': {
      if (!state.undoInfo) return state
      const { vault } = state.undoInfo
      return {
        ...state,
        vaultValues: {
          ...state.vaultValues,
          [vault]: Array(VAULT_CONFIG[vault]).fill(''),
        },
        undoInfo: null,
      }
    }
    default:
      return state
  }
}

export function useRoundState() {
  const navigate = useNavigate()
  const { round: roundParam, new: isNewGame } = useSearch({ from: '/' })
  const currentRound = roundParam ?? 1

  const [state, dispatch] = useReducer(roundReducer, undefined, createInitialState)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Force-replace the initial URL to /?round=1 if no round is specified
  useEffect(() => {
    if (roundParam === undefined) {
      navigate({
        to: '/',
        search: { round: 1 },
        replace: true,
      })
    }
  }, [roundParam, navigate])

  // Navigation blocker
  const hasUnsavedData =
    state.selectedVaults.length > 0 ||
    Object.values(state.vaultValues).some((vals) => vals.some((v) => v !== ''))
  const { proceed, reset, status: blockerStatus } = useBlocker({
    shouldBlockFn: ({ action }) => action === 'BACK',
    withResolver: true,
    enableBeforeUnload: () => hasUnsavedData,
  })

  // Handle initialization and reset on round 1 or refresh
  useEffect(() => {
    const data = getSavedRounds()

    if (currentRound === 1 && isNewGame) {
      clearSavedRounds()
      dispatch({ type: 'SET_HISTORY_ROUNDS', payload: [] })
    } else {
      dispatch({ type: 'SET_HISTORY_ROUNDS', payload: data })

      if (data.length < currentRound - 1) {
        navigate({ to: '/', search: { round: data.length + 1 }, replace: true })
      }
    }
  }, [currentRound, isNewGame, navigate])

  const toggleHistory = useCallback(() => {
    dispatch({ type: 'SET_HISTORY_ROUNDS', payload: getSavedRounds() })
    dispatch({ type: 'SET_HISTORY_OPEN', payload: !state.isHistoryOpen })
  }, [state.isHistoryOpen])

  const handleVaultValueChange = useCallback(
    (vault: string, index: number, val: string) => {
      dispatch({ type: 'UPDATE_VAULT_VALUE', payload: { vault, index, value: val } })
    },
    [],
  )

  const handleNumpadDigit = useCallback(
    (digit: string) => {
      if (!state.numpadTarget) return
      const current = state.vaultValues[state.numpadTarget.vault][state.numpadTarget.index]
      const newVal = current + digit
      if (newVal.length <= 3 && parseInt(newVal) <= 100) {
        handleVaultValueChange(state.numpadTarget.vault, state.numpadTarget.index, newVal)
      } else {
        dispatch({ type: 'SET_NUMPAD_ERROR', payload: true })
        setTimeout(() => dispatch({ type: 'SET_NUMPAD_ERROR', payload: false }), 500)
      }
    },
    [state.numpadTarget, state.vaultValues, handleVaultValueChange],
  )

  const handleNumpadBackspace = useCallback(() => {
    if (!state.numpadTarget) return
    const current = state.vaultValues[state.numpadTarget.vault][state.numpadTarget.index]
    handleVaultValueChange(state.numpadTarget.vault, state.numpadTarget.index, current.slice(0, -1))
  }, [state.numpadTarget, state.vaultValues, handleVaultValueChange])

  const handleNumpadConfirm = useCallback(() => {
    dispatch({ type: 'SET_NUMPAD_TARGET', payload: null })
  }, [])

  const handleNextRound = useCallback(() => {
    const currentData: RoundData = {
      targetHouse: state.targetHouse,
      startPoint: state.startPoint,
      horizontalWall: state.horizontalWall,
      verticalWall: state.verticalWall,
      vaultValues: state.vaultValues,
    }
    const allRounds = [...getSavedRounds(), currentData]
    saveRounds(allRounds)

    dispatch({ type: 'SET_HISTORY_ROUNDS', payload: allRounds })

    if (currentRound < TOTAL_ROUNDS) {
      navigate({ to: '/', search: { round: currentRound + 1 } })
      dispatch({ type: 'RESET_ROUND' })
      window.scrollTo(0, 0)
    } else {
      navigate({ to: '/summary' })
    }
  }, [state, currentRound, navigate])

  const toggleVault = useCallback(
    (vault: string) => {
      const currentValues = state.vaultValues[vault]
      const hasValues = currentValues?.some((v) => v !== '')
      const isSelected = state.selectedVaults.includes(vault)

      if (isSelected && hasValues) {
        // Cancel any previous pending undo first
        if (state.undoInfo) {
          clearTimeout(state.undoInfo.timeoutId)
          dispatch({ type: 'CLEAR_UNDO' })
        }

        const timeoutId = setTimeout(() => {
          dispatch({ type: 'CLEAR_UNDO' })
        }, 5000)

        dispatch({
          type: 'SET_UNDO_INFO',
          payload: { vault, values: currentValues, timeoutId },
        })
      }

      dispatch({ type: 'TOGGLE_VAULT', payload: vault })
    },
    [state.selectedVaults, state.vaultValues, state.undoInfo],
  )

  const executeUndo = useCallback(() => {
    if (state.undoInfo) {
      clearTimeout(state.undoInfo.timeoutId)
    }
    dispatch({ type: 'EXECUTE_UNDO' })
  }, [state.undoInfo])

  const setTargetHouse = useCallback((house: 'A' | 'B' | 'C' | 'D') => {
    dispatch({ type: 'SET_TARGET_HOUSE', payload: house })
  }, [])

  const setStartPoint = useCallback((point: 'A' | 'B') => {
    dispatch({ type: 'SET_START_POINT', payload: point })
  }, [])

  const setHorizontalWall = useCallback((wall: 'ㄴ' | 'ㄷ' | null) => {
    dispatch({ type: 'SET_HORIZONTAL_WALL', payload: wall })
  }, [])

  const setVerticalWall = useCallback((wall: 'a' | 'b' | 'c' | 'd' | null) => {
    dispatch({ type: 'SET_VERTICAL_WALL', payload: wall })
  }, [])

  const setNumpadTarget = useCallback((target: { vault: string; index: number } | null) => {
    dispatch({ type: 'SET_NUMPAD_TARGET', payload: target })
  }, [])

  const closeHistory = useCallback(() => {
    dispatch({ type: 'SET_HISTORY_OPEN', payload: false })
  }, [])

  const handlePhaseSubmit = useCallback(() => {
    dispatch({ type: 'SET_NUMPAD_TARGET', payload: null })
    dispatch({ type: 'SET_VIEW_MODE', payload: 'summary' })
  }, [])

  return {
    // State
    ...state,
    currentRound,
    isMobile,
    isFinalRound: currentRound === TOTAL_ROUNDS,

    // Blocker
    blockerStatus,
    blockerProceed: proceed,
    blockerReset: reset,

    // Actions
    toggleHistory,
    closeHistory,
    handleVaultValueChange,
    handleNumpadDigit,
    handleNumpadBackspace,
    handleNumpadConfirm,
    handlePhaseSubmit,
    handleNextRound,
    toggleVault,
    executeUndo,
    setTargetHouse,
    setStartPoint,
    setHorizontalWall,
    setVerticalWall,
    setNumpadTarget,
  }
}
