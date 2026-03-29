import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Topbar } from '../components/Layout'

const HOUSE_NUMBERS = [
  '101',
  '102',
  '103',
  '111',
  '112',
  '113',
  '201',
  '202',
  '203',
  '211',
  '212',
  '213',
  '301',
  '302',
  '303',
  '304',
  '401',
]

type HouseValue = {
  v1: string
  v2: string
}

type RoundData = {
  targetHouse: string
  startPoint: string
  horizontalWall: string | null
  verticalWall: string | null
  houseValues: Record<string, HouseValue>
}

function RecordScreen() {
  const navigate = useNavigate()
  const [currentRound, setCurrentRound] = useState(1)
  const [viewMode, setViewMode] = useState<'input' | 'summary'>('input')

  const [targetHouse, setTargetHouse] = useState('A')
  const [startPoint, setStartPoint] = useState('A')
  const [horizontalWall, setHorizontalWall] = useState<string | null>(null)
  const [verticalWall, setVerticalWall] = useState<string | null>(null)
  const [selectedHouses, setSelectedHouses] = useState<string[]>([])
  const [houseValues, setHouseValues] = useState<Record<string, HouseValue>>(
    HOUSE_NUMBERS.reduce(
      (acc, h) => ({ ...acc, [h]: { v1: '', v2: '' } }),
      {} as Record<string, HouseValue>,
    ),
  )

  // Load existing progress if any (using sessionStorage as requested)
  useEffect(() => {
    const saved = sessionStorage.getItem('vault_rounds')
    if (saved) {
      const data = JSON.parse(saved)
      if (Array.isArray(data)) {
        setCurrentRound(data.length + 1)
      }
    }
  }, [])

  const handleHouseValueChange = (
    house: string,
    key: 'v1' | 'v2',
    val: string,
  ) => {
    setHouseValues((prev) => ({
      ...prev,
      [house]: { ...prev[house], [key]: val },
    }))
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    house: string,
    key: 'v1' | 'v2',
    visibleHouses: string[],
  ) => {
    const currentIndex = visibleHouses.indexOf(house)

    if (e.key === 'Enter') {
      e.preventDefault()
      if (key === 'v1') {
        const nextInput = document.querySelector(
          `input[name="${house}-v2"]`,
        ) as HTMLInputElement
        nextInput?.focus()
      } else {
        const nextHouse = visibleHouses[currentIndex + 1]
        if (nextHouse) {
          const nextInput = document.querySelector(
            `input[name="${nextHouse}-v1"]`,
          ) as HTMLInputElement
          nextInput?.focus()
        }
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextHouse = visibleHouses[currentIndex + 1]
      if (nextHouse) {
        const nextInput = document.querySelector(
          `input[name="${nextHouse}-${key}"]`,
        ) as HTMLInputElement
        nextInput?.focus()
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevHouse = visibleHouses[currentIndex - 1]
      if (prevHouse) {
        const prevInput = document.querySelector(
          `input[name="${prevHouse}-${key}"]`,
        ) as HTMLInputElement
        prevInput?.focus()
      }
    }

    if (e.key === 'ArrowRight' && key === 'v1') {
      const nextInput = document.querySelector(
        `input[name="${house}-v2"]`,
      ) as HTMLInputElement
      nextInput?.focus()
    }

    if (e.key === 'ArrowLeft' && key === 'v2') {
      const prevInput = document.querySelector(
        `input[name="${house}-v1"]`,
      ) as HTMLInputElement
      prevInput?.focus()
    }
  }

  const handlePhaseSubmit = () => {
    setViewMode('summary')
  }

  const handleNextRound = () => {
    const currentData: RoundData = {
      targetHouse,
      startPoint,
      horizontalWall,
      verticalWall,
      houseValues,
    }

    const saved = sessionStorage.getItem('vault_rounds')
    const allRounds = saved ? JSON.parse(saved) : []
    allRounds.push(currentData)
    sessionStorage.setItem('vault_rounds', JSON.stringify(allRounds))

    if (currentRound < 7) {
      setCurrentRound((prev) => prev + 1)
      setViewMode('input')
      // Reset for next round
      setTargetHouse('A')
      setStartPoint('A')
      setHorizontalWall(null)
      setVerticalWall(null)
      setSelectedHouses([])
      setHouseValues(
        HOUSE_NUMBERS.reduce(
          (acc, h) => ({ ...acc, [h]: { v1: '', v2: '' } }),
          {} as Record<string, HouseValue>,
        ),
      )
      window.scrollTo(0, 0)
    } else {
      navigate({ to: '/summary' })
    }
  }

  const isFinalRound = currentRound === 7

  const isValidValue = (val: string) => {
    if (val === '') return true
    const num = Number(val)
    return num >= 20 && num <= 100
  }

  const isFormValid =
    selectedHouses.length > 0 &&
    selectedHouses.every(
      (h) => isValidValue(houseValues[h].v1) && isValidValue(houseValues[h].v2),
    )

  // 가옥번호 층별 그룹화
  const groupedHouses = HOUSE_NUMBERS.reduce(
    (acc, house) => {
      const floor = house[0] // '1', '2', '3', '4'
      if (!acc[floor]) acc[floor] = []
      acc[floor].push(house)
      return acc
    },
    {} as Record<string, string[]>,
  )

  const toggleHouse = (house: string) => {
    setSelectedHouses((prev) =>
      prev.includes(house) ? prev.filter((h) => h !== house) : [...prev, house],
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 pt-16 md:pt-20">
      <Topbar />
      <main className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        {/* 라운드 헤더 섹션 */}
        <section className="mb-8 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
            <div className="max-w-4xl w-full">
              <span className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-2 md:mb-4 block opacity-60">
                {viewMode === 'input'
                  ? 'Mission Briefing'
                  : 'Secure Phase Results'}
              </span>
              <h1 className="serif-text text-4xl md:text-6xl font-black text-primary tracking-tight leading-tight mb-5 md:mb-8">
                제 0{currentRound}라운드 / 07
              </h1>

              {viewMode === 'input' ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8 text-on-surface-variant">
                  {/* 터는 집 */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      터는 집 (Target)
                    </label>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((house) => (
                        <button
                          key={house}
                          onClick={() => setTargetHouse(house)}
                          className={`flex-1 py-3 md:py-2 text-sm font-bold transition-all rounded-sm border ${
                            targetHouse === house
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'
                          }`}
                        >
                          {house}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 시작 위치 */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        login
                      </span>
                      시작 위치 (Start)
                    </label>
                    <div className="flex gap-2">
                      {['A', 'B'].map((point) => (
                        <button
                          key={point}
                          onClick={() => setStartPoint(point)}
                          className={`flex-1 py-3 md:py-2 text-sm font-bold transition-all rounded-sm border ${
                            startPoint === point
                              ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary'
                              : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'
                          }`}
                        >
                          {point}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 벽 위치 */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        encrypted
                      </span>
                      벽 위치 (Security)
                    </label>
                    <div className="grid grid-cols-2 gap-3 content-stretch">
                      <div className="flex flex-col gap-2 justify-stretch">
                        {['ㄱ', 'ㄴ', 'ㄷ'].map((w) => (
                          <button
                            key={w}
                            onClick={() =>
                              setHorizontalWall(horizontalWall === w ? null : w)
                            }
                            className={`flex-1 w-full min-h-10 text-xs font-bold transition-all rounded-sm border ${
                              horizontalWall === w
                                ? 'bg-tertiary text-on-tertiary border-tertiary shadow-[0_0_15px_rgba(241,201,125,0.3)]'
                                : 'bg-surface-container-low text-on-surface/40 border-outline-variant/10 hover:border-primary/20'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className={`h-0.5 w-4 ${horizontalWall === w ? 'bg-on-tertiary' : 'bg-on-surface/20'}`}
                              ></div>
                              {w}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 items-stretch">
                        {['a', 'b', 'c'].map((w) => (
                          <button
                            key={w}
                            onClick={() =>
                              setVerticalWall(verticalWall === w ? null : w)
                            }
                            className={`flex-1 py-4 md:py-6 text-xs font-bold transition-all rounded-sm border border-dashed ${
                              verticalWall === w
                                ? 'bg-tertiary text-on-tertiary border-tertiary shadow-[0_0_15px_rgba(241,201,125,0.3)] border-solid'
                                : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/20'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <div
                                className={`w-0.5 h-4 ${verticalWall === w ? 'bg-on-tertiary' : 'bg-on-surface/20'}`}
                              ></div>
                              {w}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-5 md:gap-8 py-4 px-5 md:py-6 md:px-8 bg-surface-container-low border-l-4 border-primary rounded-r-lg">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                      Target House
                    </p>
                    <p className="serif-text text-xl font-black">
                      {targetHouse}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                      Start Point
                    </p>
                    <p className="serif-text text-xl font-black">
                      {startPoint}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                      Security Settings
                    </p>
                    <p className="serif-text text-xl font-black">
                      {horizontalWall || '-'} / {verticalWall || '-'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 가옥 선택 섹션 (New) */}
        {viewMode === 'input' && (
          <section className="mb-8 md:mb-12">
            <label className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary/60 mb-4 block">
              가옥 선택 (Target Houses)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {Object.entries(groupedHouses).map(([floor, houses]) => (
                <div
                  key={floor}
                  className="bg-surface-container-low/40 p-4 rounded-sm border border-outline-variant/5"
                >
                  <p className="text-[10px] font-bold text-primary/30 mb-3 tracking-widest">
                    {floor}F SECTOR
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {houses.map((house) => (
                      <button
                        key={house}
                        onClick={() => toggleHouse(house)}
                        className={`py-2 text-xs font-bold transition-all rounded-sm border ${
                          selectedHouses.includes(house)
                            ? 'bg-primary text-on-primary border-primary shadow-[0_4px_12px_rgba(255,198,55,0.2)]'
                            : 'bg-surface-container-lowest text-on-surface/30 border-outline-variant/10 hover:border-primary/30'
                        }`}
                      >
                        {house}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 가옥 입력 테이블 */}
        {(viewMode === 'summary' || selectedHouses.length > 0) && (
          <section className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 border-b border-outline-variant/15 bg-surface-container-high text-[10px] font-bold uppercase tracking-widest py-3 md:py-4 px-4 md:px-6 text-primary">
              <div className="serif-text">가옥 번호</div>
              <div className="text-center serif-text">가치 01</div>
              <div className="text-center serif-text">가치 02</div>
            </div>
            <div className="divide-y divide-outline-variant/5 max-h-[55vh] md:max-h-150 overflow-y-auto custom-scrollbar">
              {(viewMode === 'input'
                ? HOUSE_NUMBERS.filter((h) => selectedHouses.includes(h))
                : HOUSE_NUMBERS.filter(
                    (h) =>
                      houseValues[h].v1 !== '' || houseValues[h].v2 !== '',
                  )
              ).map((house) => (
              <div
                key={house}
                className="grid grid-cols-3 items-center py-3 md:py-4 px-4 md:px-6 hover:bg-surface-container-high transition-colors group"
              >
                <div className="serif-text text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {house}
                </div>
                {viewMode === 'input' ? (
                  <>
                    <div className="px-1.5 md:px-2">
                      <input
                        name={`${house}-v1`}
                        className={`w-full bg-surface-container-lowest border ${
                          !isValidValue(houseValues[house].v1)
                            ? 'border-error ring-1 ring-error/20'
                            : 'border-outline-variant/10'
                        } text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2.5 md:py-2 outline-none transition-all placeholder:text-on-surface/10 text-sm`}
                        placeholder="—"
                        inputMode="numeric"
                        type="number"
                        min="20"
                        max="100"
                        value={houseValues[house].v1}
                        onChange={(e) =>
                          handleHouseValueChange(house, 'v1', e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            house,
                            'v1',
                            HOUSE_NUMBERS.filter((h) =>
                              selectedHouses.includes(h),
                            ),
                          )
                        }
                      />
                      {!isValidValue(houseValues[house].v1) && (
                        <p className="text-[9px] text-error mt-1 font-bold animate-pulse text-center">
                          20-100
                        </p>
                      )}
                    </div>
                    <div className="px-1.5 md:px-2">
                      <input
                        name={`${house}-v2`}
                        className={`w-full bg-surface-container-lowest border ${
                          !isValidValue(houseValues[house].v2)
                            ? 'border-error ring-1 ring-error/20'
                            : 'border-outline-variant/10'
                        } text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2.5 md:py-2 outline-none transition-all placeholder:text-on-surface/10 text-sm`}
                        placeholder="—"
                        inputMode="numeric"
                        type="number"
                        min="20"
                        max="100"
                        value={houseValues[house].v2}
                        onChange={(e) =>
                          handleHouseValueChange(house, 'v2', e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            house,
                            'v2',
                            HOUSE_NUMBERS.filter((h) =>
                              selectedHouses.includes(h),
                            ),
                          )
                        }
                      />
                      {!isValidValue(houseValues[house].v2) && (
                        <p className="text-[9px] text-error mt-1 font-bold animate-pulse text-center">
                          20-100
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center noto-serif font-black text-primary">
                      {houseValues[house].v1 || '-'}
                    </div>
                    <div className="text-center noto-serif font-black text-primary">
                      {houseValues[house].v2 || '-'}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {viewMode === 'input' && selectedHouses.length === 0 && (
            <div className="py-20 text-center text-on-surface/20">
              <span className="material-symbols-outlined text-4xl mb-3 block opacity-20">
                apartment
              </span>
              <p className="text-sm font-medium tracking-widest uppercase">
                Select target houses to record values
              </p>
            </div>
          )}
        </section>
      )}

        {/* 데스크톱용 제출 버튼 */}
        <section className="mt-12 md:mt-20 hidden md:flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-container rounded blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            {viewMode === 'input' ? (
              <button
                onClick={handlePhaseSubmit}
                disabled={!isFormValid}
                className={`relative flex items-center gap-4 px-12 py-6 ${
                  isFormValid
                    ? 'bg-linear-to-br from-primary to-primary-container text-on-primary hover:scale-[1.02] active:scale-95 shadow-2xl'
                    : 'bg-surface-container-highest text-on-surface/20 cursor-not-allowed opacity-50'
                } text-xl font-black rounded-sm transition-all`}
              >
                  결과 제출
                <span className="material-symbols-outlined font-bold">
                  {isFormValid ? 'send' : 'block'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="relative flex items-center gap-4 px-12 py-6 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary text-xl font-black rounded-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                  {isFinalRound ? '결과 확인' : '다음 라운드'}
                <span className="material-symbols-outlined font-bold">
                  {isFinalRound ? 'analytics' : 'arrow_forward'}
                </span>
              </button>
            )}
          </div>
          <p className="mt-6 text-on-surface-variant text-sm font-medium tracking-widest opacity-60 uppercase">
            MISSION PHASE 0{currentRound} OF 07
          </p>
        </section>
      </main>

      {/* 모바일 전용 고정 제출 버튼 */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          {viewMode === 'input' ? (
            <button
              onClick={handlePhaseSubmit}
              disabled={!isFormValid}
              className={`w-full flex items-center justify-center gap-3 py-4 font-black text-base rounded-sm transition-all shadow-2xl ${
                isFormValid
                  ? 'bg-linear-to-br from-primary to-primary-container text-on-primary active:scale-95'
                  : 'bg-surface-container-highest text-on-surface/20 cursor-not-allowed opacity-50'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isFormValid ? 'send' : 'block'}
              </span>
              결과 제출
              <span className="text-xs opacity-60 font-medium ml-1">PHASE 0{currentRound}/07</span>
            </button>
          ) : (
            <button
              onClick={handleNextRound}
              className="w-full flex items-center justify-center gap-3 py-4 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary font-black text-base rounded-sm shadow-2xl active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isFinalRound ? 'analytics' : 'arrow_forward'}
              </span>
              {isFinalRound ? '결과 확인' : '다음 라운드'}
            </button>
          )}
        </div>
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
