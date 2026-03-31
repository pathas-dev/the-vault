import { createFileRoute, useBlocker, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { FloatingActions } from '../components/Layout'
import { WallMiniMap } from '../components/WallMiniMap'
import { type RoundData } from '../lib/schemas'
import { getSavedRounds, saveRounds, clearSavedRounds } from '../lib/storage'

const vaultSearchSchema = z.object({
  round: z.coerce.number().optional(),
})

const VAULT_CONFIG: Record<string, number> = {
  '101': 1,
  '102': 1,
  '103': 2,
  '111': 1,
  '112': 1,
  '113': 2,
  '201': 1,
  '202': 2,
  '203': 2,
  '211': 1,
  '212': 2,
  '213': 2,
  '301': 1,
  '302': 2,
  '303': 2,
  '304': 2,
  '401': 3,
}

const VAULT_NUMBERS = Object.keys(VAULT_CONFIG)
const MAX_CAPACITY = 3

function initVaultValues(): Record<string, string[]> {
  return VAULT_NUMBERS.reduce(
    (acc, v) => ({ ...acc, [v]: Array(VAULT_CONFIG[v]).fill('') }),
    {} as Record<string, string[]>,
  )
}

function RecordScreen() {
  const navigate = useNavigate()
  const { round: roundParam } = useSearch({ from: '/' })
  const currentRound = roundParam ?? 1
  
  const [viewMode, setViewMode] = useState<'input' | 'summary'>('input')
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyRounds, setHistoryRounds] = useState<RoundData[]>([])

  const [targetHouse, setTargetHouse] = useState('A')
  const [startPoint, setStartPoint] = useState('A')
  const [horizontalWall, setHorizontalWall] = useState<string | null>(null)
  const [verticalWall, setVerticalWall] = useState<string | null>(null)
  const [selectedVaults, setSelectedVaults] = useState<string[]>([])
  const [vaultValues, setVaultValues] =
    useState<Record<string, string[]>>(initVaultValues())

  // Force-replace the initial URL to /?round=1 if no round is specified
  // this prevents the user from going back to the "pre-game" state
  useEffect(() => {
    if (roundParam === undefined) {
      navigate({
        to: '/',
        search: { round: 1 },
        replace: true,
      })
    }
  }, [roundParam, navigate])

  // 게임 진행 중 뒤로가기(POP) 차단 + 입력 데이터 있을 때 탭 닫기 경고
  const hasUnsavedData = selectedVaults.length > 0 || Object.values(vaultValues).some(vals => vals.some(v => v !== ''))
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: ({ action }) => action === 'BACK',
    withResolver: true,
    enableBeforeUnload: () => hasUnsavedData,
  })

  // Handle initialization and reset on round 1 or refresh
  useEffect(() => {
    const data = getSavedRounds()
    
    if (currentRound === 1) {
      clearSavedRounds()
      setHistoryRounds([])
    } else {
      // Ensure history is loaded for later rounds
      setHistoryRounds(data)
      
      // If data is inconsistent (e.g. at round 3 but only 1 round saved), 
      // it might be better to redirect back to round 1 if missing data.
      if (data.length < currentRound - 1) {
        navigate({ to: '/', search: { round: data.length + 1 }, replace: true })
      }
    }
  }, [currentRound, navigate])

  const toggleHistory = () => {
    setHistoryRounds(getSavedRounds())
    setIsHistoryOpen(!isHistoryOpen)
  }

  const handleVaultValueChange = (
    vault: string,
    index: number,
    val: string,
  ) => {
    setVaultValues((prev) => {
      const arr = [...prev[vault]]
      arr[index] = val
      return { ...prev, [vault]: arr }
    })
  }

  const handleKeyDown = (
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
  }

  const handlePhaseSubmit = () => setViewMode('summary')

  const handleNextRound = () => {
    const currentData: RoundData = {
      targetHouse,
      startPoint,
      horizontalWall,
      verticalWall,
      vaultValues,
    }
    const allRounds = [...getSavedRounds(), currentData]
    saveRounds(allRounds)

    setHistoryRounds(allRounds)

    if (currentRound < 7) {
      // Navigate to next round via URL (replace to prevent going back)
      navigate({ to: '/', search: { round: currentRound + 1 } })
      
      // Reset current round state
      setViewMode('input')
      setTargetHouse('A')
      setStartPoint('A')
      setHorizontalWall(null)
      setVerticalWall(null)
      setSelectedVaults([])
      setVaultValues(initVaultValues())
      window.scrollTo(0, 0)
    } else {
      navigate({ to: '/summary' })
    }
  }

  const isFinalRound = currentRound === 7
  const isValidValue = (val: string) =>
    val === '' || (Number(val) >= 1 && Number(val) <= 100)
  const isFormValid =
    selectedVaults.length === 0 ||
    selectedVaults.every((v) => {
      const values = vaultValues[v]
      return (
        values.some((val) => val !== '') &&
        values.every((val) => isValidValue(val))
      )
    })

  const toggleVault = (vault: string) => {
    if (selectedVaults.includes(vault)) {
      setSelectedVaults((prev) => prev.filter((v) => v !== vault))
      setVaultValues((prev) => ({
        ...prev,
        [vault]: Array(VAULT_CONFIG[vault]).fill(''),
      }))
    } else {
      setSelectedVaults((prev) => [...prev, vault])
    }
  }

  const VaultCell = ({
    vault,
    className,
    style,
  }: {
    vault: string
    className?: string
    style?: React.CSSProperties
  }) => {
    const capacity = VAULT_CONFIG[vault]
    const isSelected = selectedVaults.includes(vault)
    return (
      <button
        onClick={() => toggleVault(vault)}
        aria-pressed={isSelected}
        aria-label={`금고 ${vault} ${isSelected ? '선택 해제' : '선택'}`}
        className={`flex flex-col items-center justify-center gap-0.5 p-1 md:p-3 border rounded-sm min-h-11 md:min-h-16 btn-press ${
          isSelected
            ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary shadow-lg z-10 vault-selected'
            : 'bg-surface-container-lowest text-on-surface/50 border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container-low hover:shadow-md hover:shadow-primary/5'
        } ${className || ''}`}
        style={style}
      >
        <span className="serif-text text-[10px] md:text-sm font-black">
          {vault}
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: capacity }, (_, i) => (
            <span
              key={i}
              className={`size-2 md:size-3 rounded-sm border flex items-center justify-center text-label-xs md:text-label-xs font-black ${
                isSelected
                  ? 'border-on-primary/40 text-on-primary/70'
                  : 'border-on-surface/15 text-on-surface/20'
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </button>
    )
  }

  const HWallButton = ({
    value,
    className,
  }: {
    value: string
    className?: string
  }) => {
    const isSelected = horizontalWall === value
    return (
      <div className={`relative h-0 z-10 ${className || ''}`}>
        <button
          onClick={() => setHorizontalWall(isSelected ? null : value)}
          aria-pressed={isSelected}
          aria-label={`가로벽 ${value} ${isSelected ? '해제' : '설치'}`}
          className="absolute inset-x-0 -top-4 h-8 flex items-center cursor-pointer group"
          title={`가로벽 ${value}`}
        >
          <div className="h-0.5 flex-1 bg-outline-variant/25" />
          <div
            className={`h-1 w-8 mx-0.5 rounded-full transition-all duration-300 ${
              isSelected
                ? 'bg-tertiary shadow-[0_0_12px_rgba(241,201,125,0.9)]'
                : 'bg-tertiary/15 shadow-[0_0_6px_rgba(241,201,125,0.1)] group-hover:bg-tertiary/30 group-hover:shadow-[0_0_8px_rgba(241,201,125,0.2)]'
            }`}
          />
          <div className="h-0.5 flex-1 bg-outline-variant/25" />
        </button>
      </div>
    )
  }

  const VWallButton = ({
    value,
    className,
  }: {
    value: string
    className?: string
  }) => {
    const isSelected = verticalWall === value
    return (
      <div className={`relative w-0 z-10 ${className || ''}`}>
        <button
          onClick={() => setVerticalWall(isSelected ? null : value)}
          aria-pressed={isSelected}
          aria-label={`세로벽 ${value} ${isSelected ? '해제' : '설치'}`}
          className="absolute inset-y-0 -left-4 w-8 flex flex-col items-center cursor-pointer group"
          title={`세로벽 ${value}`}
        >
          <div className="w-0.5 flex-1 bg-outline-variant/25" />
          <div
            className={`w-1 h-8 my-0.5 rounded-full transition-all duration-300 ${
              isSelected
                ? 'bg-tertiary shadow-[0_0_12px_rgba(241,201,125,0.9)]'
                : 'bg-tertiary/15 shadow-[0_0_6px_rgba(241,201,125,0.1)] group-hover:bg-tertiary/30 group-hover:shadow-[0_0_8px_rgba(241,201,125,0.2)]'
            }`}
          />
          <div className="w-0.5 flex-1 bg-outline-variant/25" />
        </button>
      </div>
    )
  }

  const visibleVaults = VAULT_NUMBERS.filter((v) => selectedVaults.includes(v))

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <FloatingActions
        actions={[
          { icon: 'history', label: '작전 이력 보기', onClick: toggleHistory },
        ]}
      />

      {/* 작전 이력 패널 (History Panel) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHistoryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setIsHistoryOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 size-full max-w-md bg-surface-container-high/90 backdrop-blur-[20px] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full bg-linear-to-b from-surface-container-high/40 to-transparent">
            <div className="flex justify-between items-center px-6 py-8 bg-surface-container-highest/30">
              <div>
                <span className="text-primary text-label-sm font-bold tracking-[0.4em] uppercase block opacity-60 mb-1">
                  Mission Log
                </span>
                <h2 className="serif-text text-2xl font-black text-primary tracking-tight">
                  작전 이력 요약
                </h2>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                aria-label="작전 이력 닫기"
                className="p-2 hover:bg-white/5 rounded-sm transition-colors group"
              >
                <span className="material-symbols-outlined text-on-surface/40 group-hover:text-primary">
                  close
                </span>
              </button>
            </div>


            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
              {historyRounds.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                  <span className="material-symbols-outlined text-6xl">
                    inventory
                  </span>
                  <p className="serif-text text-sm font-black tracking-widest text-center leading-relaxed">
                    확보된 정보가 없습니다.
                    <br />
                    1라운드 작전을 시작하십시오.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {historyRounds.map((round, idx) => (
                    <div
                      key={idx}
                      className="relative group animate-in fade-in slide-in-from-right-4 duration-500"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-0.5 w-6 bg-primary/40"></div>
                        <span className="serif-text text-lg font-black text-on-surface/80 group-hover:text-primary transition-colors">
                          PHASE {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="bg-surface-container-highest/50 rounded-sm p-4 space-y-4 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <p className="text-label-xs font-bold text-on-surface/30 uppercase tracking-widest">
                              터는 집
                            </p>
                            <p className="serif-text text-xl font-black text-primary">
                              {round.targetHouse}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-label-xs font-bold text-on-surface/30 uppercase tracking-widest mb-1">
                              벽 · 침투
                            </p>
                            <WallMiniMap
                              horizontalWall={round.horizontalWall}
                              verticalWall={round.verticalWall}
                              startPoint={round.startPoint}
                            />
                          </div>
                        </div>

                        <div className="pt-3 mt-3 bg-surface-container-low/30 -mx-4 px-4 rounded-sm">
                          <p className="text-label-xs font-bold text-on-surface/30 uppercase tracking-widest mb-2">
                            Secured Loot (Units)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(round.vaultValues)
                              .filter(([_, vals]) => vals.some((v) => v !== ''))
                              .map(([vault, vals]) => (
                                <div
                                  key={vault}
                                  className="bg-surface-container-low rounded-sm border border-outline-variant/5 flex items-center overflow-hidden"
                                >
                                  <span className="text-label-sm font-black text-on-surface-variant px-2 py-1">
                                    {vault}
                                  </span>
                                  {vals
                                    .filter((v) => v !== '')
                                    .map((val, i) => (
                                      <span
                                        key={i}
                                        className="text-label-sm font-black text-primary px-1.5 py-1 border-l border-outline-variant/10"
                                      >
                                        {val}
                                      </span>
                                    ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-surface-container-highest/20 opacity-30">
              <p className="text-label-xs font-black tracking-[0.4em] uppercase text-center">
                Protocol V-7 Active
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full pb-24 md:pb-12 text-on-surface">
        <section className="mb-6 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
            <div className="max-w-4xl w-full">
              <span className="text-primary/60 text-label-sm font-bold tracking-[0.4em] uppercase mb-2 md:mb-3 block">
                {viewMode === 'input'
                  ? '현장 상황 보고 (Field Recon)'
                  : '획득물 결산 (Loot Accounting)'}
              </span>
              <h1 className="serif-text text-2xl md:text-5xl font-black text-primary tracking-tight leading-tight mb-3 md:mb-4">
                작전 PHASE {currentRound.toString().padStart(2, '0')} / 07
              </h1>

              {/* 라운드 진행률 표시기 */}
              <div className="flex items-center gap-1.5 mb-4 md:mb-6">
                {Array.from({ length: 7 }, (_, i) => {
                  const round = i + 1
                  const isCompleted = round < currentRound
                  const isCurrent = round === currentRound
                  return (
                    <div key={round} className="flex items-center gap-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isCurrent
                            ? 'w-8 md:w-12 bg-primary shadow-[0_0_8px_rgba(255,198,55,0.3)]'
                            : isCompleted
                              ? 'w-4 md:w-6 bg-primary/60'
                              : 'w-4 md:w-6 bg-surface-container-highest'
                        }`}
                      />
                    </div>
                  )
                })}
              </div>

              {viewMode === 'input' ? (
                <div className="space-y-2 md:space-y-3 max-w-xs">
                  <label className="text-label-xs font-bold tracking-widest uppercase text-primary/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">
                      location_on
                    </span>{' '}
                    터는 집
                  </label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map((h) => (
                      <button
                        key={h}
                        onClick={() => setTargetHouse(h)}
                        aria-pressed={targetHouse === h}
                        aria-label={`집 ${h}`}
                        className={`flex-1 py-2 text-xs font-bold rounded-sm border btn-press ${targetHouse === h ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'}`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:gap-5 py-6 px-5 md:px-10 bg-surface-container-low rounded-sm relative overflow-hidden shadow-xl border border-outline-variant/5">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary to-primary/40"></div>
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-surface-container-lowest rounded-sm border border-outline-variant/10 relative">
                    <div className="absolute top-1 left-2 text-label-xs font-black text-primary/30 uppercase tracking-widest leading-none">
                      터는 집
                    </div>
                    <span className="serif-text text-3xl md:text-4xl font-black text-primary leading-none mt-1">
                      {targetHouse}
                    </span>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest p-3 md:p-4 rounded-sm border border-outline-variant/10 items-center justify-center space-y-2 relative">
                    <div className="absolute top-1 left-2 text-label-xs font-black text-primary/30 uppercase tracking-widest leading-none">
                      벽 · 침투
                    </div>
                    <WallMiniMap
                      horizontalWall={horizontalWall}
                      verticalWall={verticalWall}
                      startPoint={startPoint}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 금고 배치도 (Vault Floor Plan) */}
        {viewMode === 'input' && (
          <section className="mb-8 md:mb-12">
            <div className="flex items-center gap-2.5 mb-2 md:mb-3">
              <div className="h-px w-6 bg-primary/40"></div>
              <label className="text-label-xs font-bold tracking-[0.4em] uppercase text-primary/60">
                은닉 금고
              </label>
            </div>
            <p className="text-label-sm text-on-surface-variant/50 mb-4 md:mb-6">
              금고를 탭하여 선택 · 벽과 침투 지점(A/B)을 설정 · 하단 숫자는 수용량
            </p>

            <div className="bg-surface-container-low p-1.5 md:p-6 rounded-sm border border-outline-variant/10 overflow-x-auto">
              <div
                className="flex w-full mx-auto"
                style={{ maxWidth: '740px' }}
              >
                {/* Room 401 */}
                <div className="self-center border border-r-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3">
                  <VaultCell
                    vault="401"
                    className="w-full min-w-10 md:min-w-15 min-h-11 md:min-h-18"
                  />
                </div>

                {/* Room 3xx - 4 corners */}
                <div
                  className="border border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3"
                  style={{ flex: '0.7' }}
                >
                  <div className="flex flex-col gap-1 h-full">
                    <div className="grid grid-cols-2 gap-1">
                      <VaultCell vault="301" className="w-full" />
                      <VaultCell vault="302" className="w-full" />
                    </div>
                    <div className="flex-1" />
                    <div className="grid grid-cols-2 gap-1">
                      <VaultCell vault="303" className="w-full" />
                      <VaultCell vault="304" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Vertical walls a/b overlay: between 3xx and 20x/21x */}
                <div className="flex flex-col self-stretch w-0 z-10">
                  <VWallButton value="a" className="flex-1" />
                  <VWallButton value="b" className="flex-1" />
                </div>

                {/* 2xx column */}
                <div className="flex flex-col flex-1">
                  {/* Room 20x */}
                  <div className="border border-l-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                      <VaultCell vault="201" className="w-full" />
                      <VaultCell vault="202" className="w-full" />
                      <div />
                      <VaultCell vault="203" className="w-full" />
                    </div>
                  </div>
                  {/* Horizontal wall ㄴ overlay: between 20x and 21x */}
                  <HWallButton value="ㄴ" />
                  {/* Room 21x */}
                  <div className="border border-l-0 border-t-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                      <VaultCell vault="211" className="w-full" />
                      <VaultCell vault="212" className="w-full" />
                      <div />
                      <VaultCell vault="213" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Vertical walls c/d overlay: between 20x↔10x and 21x↔11x */}
                <div className="flex flex-col self-stretch w-0 z-10">
                  <VWallButton value="c" className="flex-1" />
                  <VWallButton value="d" className="flex-1" />
                </div>

                {/* 1xx column */}
                <div className="flex flex-col flex-1">
                  {/* Room 10x */}
                  <div className="border border-l-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1 relative overflow-hidden">
                    <div
                      className={`absolute right-0 inset-y-0 w-0.5 transition-all duration-500 ${startPoint === 'A' ? 'bg-intrusion shadow-[0_0_12px_rgba(255,45,85,0.8)]' : 'bg-transparent'}`}
                    />
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                      <VaultCell vault="101" className="w-full" />
                      <VaultCell vault="102" className="w-full" />
                      <div />
                      <VaultCell vault="103" className="w-full" />
                    </div>
                  </div>
                  {/* Horizontal wall ㄷ overlay: between 10x and 11x */}
                  <HWallButton value="ㄷ" />
                  {/* Room 11x */}
                  <div className="border border-l-0 border-t-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1 relative overflow-hidden">
                    <div
                      className={`absolute right-0 inset-y-0 w-0.5 transition-all duration-500 ${startPoint === 'B' ? 'bg-intrusion shadow-[0_0_12px_rgba(255,45,85,0.8)]' : 'bg-transparent'}`}
                    />
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                      <VaultCell vault="111" className="w-full" />
                      <VaultCell vault="112" className="w-full" />
                      <div />
                      <VaultCell vault="113" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Entry points: right side of 1xx */}
                <div className="flex flex-col self-stretch">
                  <button
                    onClick={() => setStartPoint('A')}
                    aria-label="침투 지점 A 선택"
                    aria-pressed={startPoint === 'A'}
                    className="flex-1 flex items-center px-2 group transition-all"
                    title="침투 지점 A (10x 방)"
                  >
                    <span
                      className={`serif-text text-sm md:text-base font-black transition-all duration-300 ${
                        startPoint === 'A'
                          ? 'text-intrusion drop-shadow-[0_0_8px_rgba(255,45,85,0.6)] scale-125'
                          : 'text-on-surface/15 group-hover:text-intrusion/40'
                      }`}
                      aria-hidden="true"
                    >
                      A
                    </span>
                  </button>
                  <button
                    onClick={() => setStartPoint('B')}
                    aria-label="침투 지점 B 선택"
                    aria-pressed={startPoint === 'B'}
                    className="flex-1 flex items-center px-2 group transition-all"
                    title="침투 지점 B (11x 방)"
                  >
                    <span
                      className={`serif-text text-sm md:text-base font-black transition-all duration-300 ${
                        startPoint === 'B'
                          ? 'text-intrusion drop-shadow-[0_0_8px_rgba(255,45,85,0.6)] scale-125'
                          : 'text-on-surface/15 group-hover:text-intrusion/40'
                      }`}
                      aria-hidden="true"
                    >
                      B
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 은닉 가치 입력 / 결산 */}
        {(viewMode === 'summary' || selectedVaults.length > 0) && (
          <section className="bg-surface-container-low rounded-sm overflow-hidden shadow-xl">
            <div
              className="bg-surface-container-high text-label-xs font-black uppercase tracking-widest py-3 md:py-4 px-5 md:px-10 text-primary/60"
              style={{
                display: 'grid',
                gridTemplateColumns: `100px repeat(${MAX_CAPACITY}, 1fr)`,
              }}
            >
              <div className="serif-text">금고</div>
              {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                <div key={i} className="text-center serif-text">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="max-h-[45vh] md:max-h-140 overflow-y-auto custom-scrollbar">
              {(viewMode === 'input'
                ? VAULT_NUMBERS.filter((v) => selectedVaults.includes(v))
                : VAULT_NUMBERS.filter((v) =>
                    vaultValues[v].some((val) => val !== ''),
                  )
              ).map((v) => (
                <div
                  key={v}
                  className="items-center py-3 md:py-4 px-5 md:px-10 hover:bg-surface-container-high group even:bg-surface-container-low/30 transition-colors"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `100px repeat(${MAX_CAPACITY}, 1fr)`,
                  }}
                >
                  <div className="serif-text text-base md:text-lg font-black text-on-surface/70 group-hover:text-primary transition-colors flex items-center gap-3">
                    <span className="w-0.5 h-4 bg-on-surface/10 group-hover:bg-primary transition-colors"></span>
                    {v}
                  </div>
                  {viewMode === 'input' ? (
                    <>
                      {Array.from({ length: MAX_CAPACITY }, (_, i) => {
                        const isSlotAvailable = i < VAULT_CONFIG[v]
                        const isUnlocked =
                          i === 0 ||
                          (vaultValues[v][i - 1] !== '' &&
                            isValidValue(vaultValues[v][i - 1]))
                        const isEnabled = isSlotAvailable && isUnlocked
                        return (
                          <div key={i} className="px-1.5 relative">
                            {isSlotAvailable ? (
                              <>
                                <input
                                  name={`${v}-v${i}`}
                                  aria-label={`${v} 금고 슬롯 ${i + 1}`}
                                  className={`w-full border text-center font-black rounded-sm py-2.5 md:py-3 outline-none text-base md:text-lg transition-all ${
                                    !isEnabled
                                      ? 'bg-surface-container-low border-outline-variant/5 text-on-surface/15 cursor-not-allowed'
                                      : vaultValues[v][i] !== '' &&
                                          !isValidValue(vaultValues[v][i])
                                        ? 'bg-surface-container-lowest border-error ring-1 ring-error/20 text-primary'
                                        : 'bg-surface-container-lowest border-outline-variant/10 text-primary input-glow focus:ring-1 focus:ring-primary/20'
                                  }`}
                                  placeholder={isEnabled ? '—' : ''}
                                  inputMode="numeric"
                                  type="number"
                                  disabled={!isEnabled}
                                  value={vaultValues[v][i]}
                                  onChange={(e) =>
                                    handleVaultValueChange(v, i, e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, v, i, visibleVaults)
                                  }
                                />
                                {vaultValues[v][i] !== '' &&
                                  !isValidValue(vaultValues[v][i]) && (
                                    <p className="absolute -bottom-4 inset-x-0 text-label-xs text-error font-black text-center">
                                      1-100
                                    </p>
                                  )}
                              </>
                            ) : (
                              <div className="w-full py-2.5 md:py-3 text-center text-on-surface/10 text-base">
                                —
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                        <div
                          key={i}
                          className="text-center serif-text font-black text-lg md:text-xl text-primary"
                        >
                          {i < VAULT_CONFIG[v] ? vaultValues[v][i] || '—' : '—'}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
            {((viewMode === 'input' && selectedVaults.length === 0) ||
              (viewMode === 'summary' &&
                !VAULT_NUMBERS.some((v) =>
                  vaultValues[v].some((val) => val !== ''),
                ))) && (
              <div className="py-20 text-center opacity-10 space-y-3">
                <span className="material-symbols-outlined text-4xl block">
                  database
                </span>
                <p className="text-label-sm font-bold tracking-[0.4em] uppercase">
                  {viewMode === 'input'
                    ? '조사된 데이터 없음'
                    : '확보한 전리품 없음'}
                </p>
              </div>
            )}
          </section>
        )}

        <section className="mt-12 md:mt-16 hidden md:flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-container rounded blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            {viewMode === 'input' ? (
              <button
                onClick={handlePhaseSubmit}
                disabled={!isFormValid}
                className={`relative flex items-center gap-4 px-12 py-5 ${isFormValid ? 'bg-linear-to-br from-primary to-primary-container text-on-primary shadow-xl hover:shadow-2xl hover:shadow-primary/20 btn-press' : 'bg-surface-container-highest text-on-surface/10 cursor-not-allowed opacity-40'} text-lg font-black rounded-sm tracking-widest`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isFormValid ? 'verified_user' : 'lock'}
                </span>{' '}
                작전 기록 확정
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="relative flex items-center gap-4 px-12 py-5 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary text-lg font-black rounded-sm shadow-xl hover:shadow-2xl btn-press tracking-widest"
              >
                <span className="material-symbols-outlined text-xl">
                  {isFinalRound ? 'analytics' : 'near_me'}
                </span>{' '}
                {isFinalRound ? '최종 장부 정리' : '다음 작전'}
              </button>
            )}
          </div>
          <div className="mt-6 flex items-center justify-center gap-1.5 opacity-30">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${
                  i + 1 === currentRound
                    ? 'w-6 bg-primary'
                    : i + 1 < currentRound
                      ? 'w-3 bg-primary/60'
                      : 'w-3 bg-surface-container-highest'
                }`}
              />
            ))}
          </div>
        </section>
      </main>

      <div className="md:hidden fixed inset-x-0 bottom-6 px-4 z-40">
        {viewMode === 'input' ? (
          <button
            onClick={handlePhaseSubmit}
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-3 py-4 font-black text-base rounded-sm shadow-xl ${isFormValid ? 'bg-linear-to-br from-primary to-primary-container text-on-primary btn-press' : 'bg-surface-container-highest text-on-surface/20 opacity-50'}`}
          >
            <span className="material-symbols-outlined text-lg">
              {isFormValid ? 'verified_user' : 'lock'}
            </span>{' '}
            작전 기록 확정
          </button>
        ) : (
          <button
            onClick={handleNextRound}
            className="w-full flex items-center justify-center gap-3 py-4 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary font-black text-base rounded-sm shadow-xl btn-press"
          >
            <span className="material-symbols-outlined text-lg">
              {isFinalRound ? 'analytics' : 'near_me'}
            </span>{' '}
            {isFinalRound ? '최종 장부 정리' : '다음 작전'}
          </button>
        )}
      </div>

      {/* 내비게이션 차단 확인 다이얼로그 */}
      {status === 'blocked' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={reset} />
          <div className="relative bg-surface-container-high rounded-sm p-6 md:p-8 shadow-2xl max-w-sm mx-4 space-y-4">
            <h3 className="serif-text text-lg font-black text-primary">작전 이탈 확인</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              입력 중인 데이터가 사라집니다.
              <br />
              정말 이탈하시겠습니까?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-3 bg-surface-container-low text-on-surface/60 font-bold text-sm rounded-sm btn-press hover:bg-surface-container"
              >
                계속 작전
              </button>
              <button
                onClick={proceed}
                className="flex-1 py-3 bg-error-container text-on-error-container font-bold text-sm rounded-sm btn-press"
              >
                이탈
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBahMjspscmOlRydFeZiCVATXkfw6pEATu-kblpB4U_8PQEydTQeB7dqX-cofBN8Rj1D8nGIP-tDvL1Bzbv6cFxQYognCmXh74BugeJs97eBtH25zbnPZY3x6hf1VbkImgJ68Uw0RG9YP2o7mWGrFtXPMWBntot6cYMJaFv1jPE_A1BveuEzGHoSZqbR-0DCc9_BDp26do3lzs4mYICAdE7PIunrll4h4At9pxGYAoLyB8kWVnmcihNFo80yPv_Vf_3kPRHg0l3ZfBZ')",
        }}
      ></div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: RecordScreen,
  validateSearch: (search) => vaultSearchSchema.parse(search),
})
