import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { FloatingActions } from '../components/Layout'
import { WallMiniMap } from '../components/WallMiniMap'

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

type RoundData = {
  targetHouse: string
  startPoint: string
  horizontalWall: string | null
  verticalWall: string | null
  vaultValues: Record<string, string[]>
}

function initVaultValues(): Record<string, string[]> {
  return VAULT_NUMBERS.reduce(
    (acc, v) => ({ ...acc, [v]: Array(VAULT_CONFIG[v]).fill('') }),
    {} as Record<string, string[]>,
  )
}

function RecordScreen() {
  const navigate = useNavigate()
  const [currentRound, setCurrentRound] = useState(1)
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

  useEffect(() => {
    const saved = sessionStorage.getItem('vault_rounds')
    if (saved) {
      const data = JSON.parse(saved)
      if (Array.isArray(data)) {
        setCurrentRound(data.length + 1)
        setHistoryRounds(data)
      }
    }
  }, [])

  const toggleHistory = () => {
    const saved = sessionStorage.getItem('vault_rounds')
    if (saved) setHistoryRounds(JSON.parse(saved))
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
        const nextInput = document.querySelector(
          `input[name="${vault}-v${valueIndex + 1}"]`,
        ) as HTMLInputElement
        nextInput?.focus()
      } else {
        const nextVault = visibleVaults[currentIndex + 1]
        if (nextVault) {
          const nextInput = document.querySelector(
            `input[name="${nextVault}-v0"]`,
          ) as HTMLInputElement
          nextInput?.focus()
        }
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextVault = visibleVaults[currentIndex + 1]
      if (nextVault) {
        const targetIdx = Math.min(valueIndex, VAULT_CONFIG[nextVault] - 1)
        const nextInput = document.querySelector(
          `input[name="${nextVault}-v${targetIdx}"]`,
        ) as HTMLInputElement
        nextInput?.focus()
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevVault = visibleVaults[currentIndex - 1]
      if (prevVault) {
        const targetIdx = Math.min(valueIndex, VAULT_CONFIG[prevVault] - 1)
        const prevInput = document.querySelector(
          `input[name="${prevVault}-v${targetIdx}"]`,
        ) as HTMLInputElement
        prevInput?.focus()
      }
    }
    if (e.key === 'ArrowRight' && valueIndex < capacity - 1) {
      const nextInput = document.querySelector(
        `input[name="${vault}-v${valueIndex + 1}"]`,
      ) as HTMLInputElement
      nextInput?.focus()
    }
    if (e.key === 'ArrowLeft' && valueIndex > 0) {
      const prevInput = document.querySelector(
        `input[name="${vault}-v${valueIndex - 1}"]`,
      ) as HTMLInputElement
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
    const saved = sessionStorage.getItem('vault_rounds')
    const allRounds = saved ? JSON.parse(saved) : []
    allRounds.push(currentData)
    sessionStorage.setItem('vault_rounds', JSON.stringify(allRounds))

    setHistoryRounds(allRounds)

    if (currentRound < 7) {
      setCurrentRound((prev) => prev + 1)
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
        className={`flex flex-col items-center justify-center gap-0.5 p-2 md:p-3 border rounded-sm min-h-[52px] md:min-h-[64px] btn-press ${
          isSelected
            ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary shadow-lg z-10 vault-selected'
            : 'bg-surface-container-lowest text-on-surface/50 border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container-low hover:shadow-md hover:shadow-primary/5'
        } ${className || ''}`}
        style={style}
      >
        <span className="serif-text text-[0.6875rem] md:text-sm font-black">
          {vault}
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: capacity }, (_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] border flex items-center justify-center text-[0.5625rem] md:text-[0.5625rem] font-black ${
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
          className="absolute left-0 right-0 -top-[8px] h-[16px] flex items-center cursor-pointer group"
          title={`가로벽 ${value}`}
        >
          <div className="h-[2px] flex-1 bg-outline-variant/25" />
          <div
            className={`h-[4px] w-8 mx-0.5 rounded-full transition-all duration-300 ${
              isSelected
                ? 'bg-tertiary shadow-[0_0_12px_rgba(241,201,125,0.9)]'
                : 'bg-tertiary/15 shadow-[0_0_6px_rgba(241,201,125,0.1)] group-hover:bg-tertiary/30 group-hover:shadow-[0_0_8px_rgba(241,201,125,0.2)]'
            }`}
          />
          <div className="h-[2px] flex-1 bg-outline-variant/25" />
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
          className="absolute top-0 bottom-0 -left-[8px] w-[16px] flex flex-col items-center cursor-pointer group"
          title={`세로벽 ${value}`}
        >
          <div className="w-[2px] flex-1 bg-outline-variant/25" />
          <div
            className={`w-[4px] h-8 my-0.5 rounded-full transition-all duration-300 ${
              isSelected
                ? 'bg-tertiary shadow-[0_0_12px_rgba(241,201,125,0.9)]'
                : 'bg-tertiary/15 shadow-[0_0_6px_rgba(241,201,125,0.1)] group-hover:bg-tertiary/30 group-hover:shadow-[0_0_8px_rgba(241,201,125,0.2)]'
            }`}
          />
          <div className="w-[2px] flex-1 bg-outline-variant/25" />
        </button>
      </div>
    )
  }

  const visibleVaults = VAULT_NUMBERS.filter((v) => selectedVaults.includes(v))

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <FloatingActions actions={[{ icon: 'history', label: '작전 이력 보기', onClick: toggleHistory }]} />

      {/* 작전 이력 패널 (History Panel) */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHistoryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setIsHistoryOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-surface-container-high/90 backdrop-blur-[20px] shadow-2xl border-l border-outline-variant/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full bg-linear-to-b from-surface-container-high/40 to-transparent">
            <div className="flex justify-between items-center px-6 py-8 border-b border-outline-variant/5">
              <div>
                <span className="text-primary text-[0.625rem] font-bold tracking-[0.4em] uppercase block opacity-60 mb-1">
                  Mission Log
                </span>
                <h2 className="serif-text text-2xl font-black text-primary tracking-tight">
                  작전 이력 요약
                </h2>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                aria-label="작전 이력 닫기"
                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
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

                      <div className="bg-surface-container-highest/50 rounded-sm p-4 space-y-4 border border-outline-variant/10 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <p className="text-[0.5625rem] font-bold text-on-surface/30 uppercase tracking-widest">
                              터는 집
                            </p>
                            <p className="serif-text text-xl font-black text-primary">
                              {round.targetHouse}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-[0.5625rem] font-bold text-on-surface/30 uppercase tracking-widest mb-1">
                              벽 · 침투
                            </p>
                            <WallMiniMap
                              horizontalWall={round.horizontalWall}
                              verticalWall={round.verticalWall}
                              startPoint={round.startPoint}
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-outline-variant/5">
                          <p className="text-[0.5625rem] font-bold text-on-surface/30 uppercase tracking-widest mb-2">
                            Secured Loot (Units)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(round.vaultValues)
                              .filter(([_, vals]) => vals.some((v) => v !== ''))
                              .map(([vault, vals]) => (
                                <div
                                  key={vault}
                                  className="bg-surface-container-low px-2 py-1 rounded-sm border border-outline-variant/5 flex items-center gap-2"
                                >
                                  <span className="text-[0.625rem] font-black text-on-surface-variant">
                                    {vault}
                                  </span>
                                  <span className="text-[0.625rem] font-black text-primary">
                                    {vals.filter((v) => v !== '').join('/')}
                                  </span>
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

            <div className="p-8 border-t border-outline-variant/5 opacity-30">
              <p className="text-[9px] font-black tracking-[0.4em] uppercase text-center">
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
              <span className="text-primary/60 text-[0.625rem] font-bold tracking-[0.4em] uppercase mb-2 md:mb-3 block">
                {viewMode === 'input'
                  ? '현장 상황 보고 (Field Recon)'
                  : '획득물 결산 (Loot Accounting)'}
              </span>
              <h1 className="serif-text text-3xl md:text-5xl font-black text-primary tracking-tight leading-tight mb-4 md:mb-6">
                작전 PHASE {currentRound.toString().padStart(2, '0')} / 07
              </h1>

              {viewMode === 'input' ? (
                <div className="space-y-2 md:space-y-3 max-w-xs">
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
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
                        className={`flex-1 py-2 text-xs font-bold rounded-sm border btn-press ${targetHouse === h ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'}`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:gap-5 py-6 px-5 md:px-10 bg-surface-container-low rounded-sm relative overflow-hidden shadow-xl border border-outline-variant/5">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-primary/40 via-primary to-primary/40"></div>
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-surface-container-lowest rounded-sm border border-outline-variant/10 relative">
                    <div className="absolute top-1 left-2 text-[0.5625rem] font-black text-primary/30 uppercase tracking-widest leading-none">
                      터는 집
                    </div>
                    <span className="serif-text text-3xl md:text-4xl font-black text-primary leading-none mt-1">
                      {targetHouse}
                    </span>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest p-3 md:p-4 rounded-sm border border-outline-variant/10 items-center justify-center space-y-2 relative">
                    <div className="absolute top-1 left-2 text-[0.5625rem] font-black text-primary/30 uppercase tracking-widest leading-none">
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
            <div className="flex items-center gap-2.5 mb-4 md:mb-6">
              <div className="h-px w-6 bg-primary/40"></div>
              <label className="text-[9px] font-bold tracking-[0.4em] uppercase text-primary/60 tracking-widest">
                은닉 금고
              </label>
            </div>

            <div className="bg-surface-container-low p-3 md:p-6 rounded-sm border border-outline-variant/10 overflow-x-auto">
              <div
                className="flex min-w-[340px] mx-auto"
                style={{ maxWidth: '740px' }}
              >
                {/* Room 401 */}
                <div className="self-center border border-r-0 border-outline-variant/15 bg-surface-container-lowest/30 p-2 md:p-3">
                  <VaultCell
                    vault="401"
                    className="w-full min-w-[48px] md:min-w-[60px] min-h-[60px] md:min-h-[72px]"
                  />
                </div>

                {/* Room 3xx - 4 corners */}
                <div
                  className="border border-outline-variant/15 bg-surface-container-lowest/30 p-2 md:p-3"
                  style={{ flex: '0.8' }}
                >
                  <div className="flex flex-col gap-2 h-full">
                    <div className="grid grid-cols-2 gap-2">
                      <VaultCell vault="301" className="w-full" />
                      <VaultCell vault="302" className="w-full" />
                    </div>
                    <div className="flex-1" />
                    <div className="grid grid-cols-2 gap-2">
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
                  <div className="border border-l-0 border-outline-variant/15 bg-surface-container-lowest/30 p-2 md:p-3 flex-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                      <VaultCell vault="201" className="w-full" />
                      <VaultCell vault="202" className="w-full" />
                      <div />
                      <VaultCell vault="203" className="w-full" />
                    </div>
                  </div>
                  {/* Horizontal wall ㄴ overlay: between 20x and 21x */}
                  <HWallButton value="ㄴ" />
                  {/* Room 21x */}
                  <div className="border border-l-0 border-t-0 border-outline-variant/15 bg-surface-container-lowest/30 p-2 md:p-3 flex-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
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
                  <div className="border border-l-0 border-outline-variant/15 bg-surface-container-lowest/30 p-2 md:p-3 flex-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                      <VaultCell vault="101" className="w-full" />
                      <VaultCell vault="102" className="w-full" />
                      <div />
                      <VaultCell vault="103" className="w-full" />
                    </div>
                  </div>
                  {/* Horizontal wall ㄷ overlay: between 10x and 11x */}
                  <HWallButton value="ㄷ" />
                  {/* Room 11x */}
                  <div className="border border-l-0 border-t-0 border-outline-variant/15 bg-surface-container-lowest/30 p-2 md:p-3 flex-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                      <VaultCell vault="111" className="w-full" />
                      <VaultCell vault="112" className="w-full" />
                      <div />
                      <VaultCell vault="113" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Entry points: right side of 1xx */}
                <div className="flex flex-col self-stretch ml-0.5">
                  <button
                    onClick={() => setStartPoint('A')}
                    aria-label="침투 지점 A 선택"
                    className="flex-1 flex items-center px-1 group transition-all"
                    title="침투 지점 A (10x 방)"
                  >
                    <span
                      className={`material-symbols-outlined text-base md:text-lg transition-all duration-300 ${
                        startPoint === 'A'
                          ? 'text-error drop-shadow-[0_0_8px_rgba(255,100,100,0.8)]'
                          : 'text-on-surface/15 group-hover:text-error/40'
                      }`}
                    >
                      chevron_left
                    </span>
                  </button>
                  <button
                    onClick={() => setStartPoint('B')}
                    aria-label="침투 지점 B 선택"
                    className="flex-1 flex items-center px-1 group transition-all"
                    title="침투 지점 B (11x 방)"
                  >
                    <span
                      className={`material-symbols-outlined text-base md:text-lg transition-all duration-300 ${
                        startPoint === 'B'
                          ? 'text-error drop-shadow-[0_0_8px_rgba(255,100,100,0.8)]'
                          : 'text-on-surface/15 group-hover:text-error/40'
                      }`}
                    >
                      chevron_left
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
              className="bg-surface-container-high text-[9px] font-black uppercase tracking-[0.2em] py-3 md:py-4 px-5 md:px-10 text-primary/60"
              style={{
                display: 'grid',
                gridTemplateColumns: `100px repeat(${MAX_CAPACITY}, 1fr)`,
              }}
            >
              <div className="serif-text">금고</div>
              {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                <div key={i} className="text-center serif-text">
                  {['I', 'II', 'III'][i]}
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
                  className="items-center py-3 md:py-4 px-5 md:px-10 hover:bg-surface-container-high group border-b border-outline-variant/10 last:border-0 transition-colors"
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
                      {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                        <div key={i} className="px-1.5 relative">
                          {i < VAULT_CONFIG[v] ? (
                            <>
                              <input
                                name={`${v}-v${i}`}
                                className={`w-full bg-surface-container-lowest border ${
                                  vaultValues[v][i] !== '' &&
                                  !isValidValue(vaultValues[v][i])
                                    ? 'border-error ring-1 ring-error/20'
                                    : 'border-outline-variant/10'
                                } text-center text-primary font-black rounded-sm py-2.5 md:py-3 outline-none text-base md:text-lg input-glow focus:ring-1 focus:ring-primary/20`}
                                placeholder="—"
                                inputMode="numeric"
                                type="number"
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
                                  <p className="absolute -bottom-4 left-0 w-full text-[0.5625rem] text-error font-black text-center animate-pulse">
                                    RANGE 1-100
                                  </p>
                                )}
                            </>
                          ) : (
                            <div className="w-full py-2.5 md:py-3 text-center text-on-surface/10 text-base">
                              —
                            </div>
                          )}
                        </div>
                      ))}
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
                <p className="text-[0.625rem] font-bold tracking-[0.4em] uppercase">
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
          <p className="mt-6 text-on-surface-variant text-[0.625rem] font-black tracking-[0.4em] opacity-30 uppercase">
            작전 PHASE 0{currentRound} / 07
          </p>
        </section>
      </main>

      <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-40">
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

export const Route = createFileRoute('/record' as any)({
  component: RecordScreen,
})
