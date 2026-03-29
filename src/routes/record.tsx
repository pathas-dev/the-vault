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

  useEffect(() => {
    const saved = sessionStorage.getItem('vault_rounds')
    if (saved) {
      const data = JSON.parse(saved)
      if (Array.isArray(data)) {
        setCurrentRound(data.length + 1)
      }
    }
  }, [])

  const handleHouseValueChange = (house: string, key: 'v1' | 'v2', val: string) => {
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
        const nextInput = document.querySelector(`input[name="${house}-v2"]`) as HTMLInputElement
        nextInput?.focus()
      } else {
        const nextHouse = visibleHouses[currentIndex + 1]
        if (nextHouse) {
          const nextInput = document.querySelector(`input[name="${nextHouse}-v1"]`) as HTMLInputElement
          nextInput?.focus()
        }
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextHouse = visibleHouses[currentIndex + 1]
      if (nextHouse) {
        const nextInput = document.querySelector(`input[name="${nextHouse}-${key}"]`) as HTMLInputElement
        nextInput?.focus()
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevHouse = visibleHouses[currentIndex - 1]
      if (prevHouse) {
        const prevInput = document.querySelector(`input[name="${prevHouse}-${key}"]`) as HTMLInputElement
        prevInput?.focus()
      }
    }
    if (e.key === 'ArrowRight' && key === 'v1') {
      const nextInput = document.querySelector(`input[name="${house}-v2"]`) as HTMLInputElement
      nextInput?.focus()
    }
    if (e.key === 'ArrowLeft' && key === 'v2') {
      const prevInput = document.querySelector(`input[name="${house}-v1"]`) as HTMLInputElement
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
      houseValues,
    }
    const saved = sessionStorage.getItem('vault_rounds')
    const allRounds = saved ? JSON.parse(saved) : []
    allRounds.push(currentData)
    sessionStorage.setItem('vault_rounds', JSON.stringify(allRounds))

    if (currentRound < 7) {
      setCurrentRound((prev) => prev + 1)
      setViewMode('input')
      setTargetHouse('A')
      setStartPoint('A')
      setHorizontalWall(null)
      setVerticalWall(null)
      setSelectedHouses([])
      setHouseValues(HOUSE_NUMBERS.reduce((acc, h) => ({ ...acc, [h]: { v1: '', v2: '' } }), {} as Record<string, HouseValue>))
      window.scrollTo(0, 0)
    } else {
      navigate({ to: '/summary' })
    }
  }

  const isFinalRound = currentRound === 7
  const isValidValue = (val: string) => val === '' || (Number(val) >= 20 && Number(val) <= 100)
  const isFormValid = selectedHouses.every((h) => {
    const v1 = houseValues[h].v1
    const v2 = houseValues[h].v2
    return (v1 !== '' || v2 !== '') && isValidValue(v1) && isValidValue(v2)
  })

  const groupedHouses = HOUSE_NUMBERS.reduce((acc, house) => {
    const floor = house[0]
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(house)
    return acc
  }, {} as Record<string, string[]>)

  const toggleHouse = (house: string) => {
    setSelectedHouses((prev) => prev.includes(house) ? prev.filter((h) => h !== house) : [...prev, house])
  }

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 pt-16 md:pt-20">
      <Topbar />
      <main className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full pb-24 md:pb-12 text-on-surface">
        <section className="mb-6 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
            <div className="max-w-4xl w-full">
              <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-2 md:mb-3 block opacity-60">
                {viewMode === 'input' ? 'Mission Briefing' : 'Secure Phase Results'}
              </span>
              <h1 className="serif-text text-3xl md:text-5xl font-black text-primary tracking-tight leading-tight mb-4 md:mb-6">
                제 {currentRound.toString().padStart(2, '0')}라운드 / 07
              </h1>

              {viewMode === 'input' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                  {/* 터는 집 */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">location_on</span> 터는 집 (Target)
                    </label>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((h) => (
                        <button key={h} onClick={() => setTargetHouse(h)} className={`flex-1 py-2 text-xs font-bold transition-all rounded-sm border ${targetHouse === h ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'}`}>{h}</button>
                      ))}
                    </div>
                  </div>

                  {/* 시작 위치 */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">login</span> 시작 위치 (Start)
                    </label>
                    <div className="flex gap-2">
                      {['A', 'B'].map((p) => (
                        <button key={p} onClick={() => setStartPoint(p)} className={`flex-1 py-2 text-xs font-bold transition-all rounded-sm border ${startPoint === p ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary shadow-[0_4px_12px_rgba(255,198,55,0.1)]' : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'}`}>{p}</button>
                      ))}
                    </div>
                  </div>

                  {/* 벽 위치 (Tactical Panel) */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">shield_with_heart</span> 보안 상태 (Security Nodes)
                    </label>
                    <div className="grid grid-cols-2 gap-3 content-stretch">
                      {/* Horizontal Walls - Stretched H-Barrier */}
                      <div className="flex flex-col gap-1.5">
                        <div className="px-1"><span className="text-[7px] font-black text-on-surface/20 uppercase tracking-widest leading-none">H-Barrier</span></div>
                        {['ㄱ', 'ㄴ', 'ㄷ'].map((w) => (
                          <button 
                            key={w} 
                            onClick={() => setHorizontalWall(horizontalWall === w ? null : w)} 
                            className={`group flex items-center gap-4 px-3 py-2.5 transition-all rounded-sm border ${horizontalWall === w ? 'bg-tertiary/10 text-tertiary border-tertiary shadow-[0_0_15px_rgba(241,201,125,0.15)]' : 'bg-surface-container-low text-on-surface/30 border-outline-variant/10 hover:border-primary/20'}`}
                          >
                            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${horizontalWall === w ? 'bg-tertiary shadow-[0_0_10px_rgba(241,201,125,0.9)] scale-x-105' : 'bg-on-surface/10 group-hover:bg-on-surface/30'}`}></div>
                            <span className="serif-text text-[11px] font-black">{w}</span>
                          </button>
                        ))}
                      </div>
                      {/* Vertical Walls - Stretched V-Pillar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="px-1"><span className="text-[7px] font-black text-on-surface/20 uppercase tracking-widest leading-none">V-Pillar</span></div>
                        <div className="flex gap-1.5 items-stretch h-full min-h-[100px]">
                          {['a', 'b', 'c'].map((w) => (
                            <button key={w} onClick={() => setVerticalWall(verticalWall === w ? null : w)} className={`group flex-1 flex flex-col items-center justify-between py-3 px-1 transition-all rounded-sm border border-dashed ${verticalWall === w ? 'bg-tertiary/10 text-tertiary border-tertiary shadow-[0_0_15px_rgba(241,201,125,0.15)] border-solid' : 'bg-surface-container-low text-on-surface/30 border-outline-variant/10 hover:border-primary/20'}`}>
                              <span className={`serif-text text-[11px] font-black ${verticalWall === w ? 'text-tertiary' : 'group-hover:text-primary/60'}`}>{w}</span>
                              <div className={`w-1 flex-1 my-1 rounded-full transition-all duration-300 ${verticalWall === w ? 'bg-tertiary shadow-[0_0_10px_rgba(241,201,125,0.9)] scale-y-105' : 'bg-on-surface/10 group-hover:bg-on-surface/30'}`}></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 py-6 px-5 md:px-10 bg-surface-container-low rounded-sm relative overflow-hidden shadow-xl border border-outline-variant/5">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-primary/40 via-primary to-primary/40"></div>
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-surface-container-lowest rounded-sm border border-outline-variant/10 relative">
                    <div className="absolute top-1 left-2 text-[7px] font-black text-primary/30 uppercase tracking-widest leading-none">Target</div>
                    <span className="serif-text text-3xl md:text-4xl font-black text-primary leading-none mt-1">{targetHouse}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-surface-container-lowest rounded-sm border border-outline-variant/10 relative">
                    <div className="absolute top-1 left-2 text-[7px] font-black text-primary/30 uppercase tracking-widest leading-none">Entry</div>
                    <span className="serif-text text-3xl md:text-4xl font-black text-primary leading-none mt-1">{startPoint}</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest p-2 md:p-3 rounded-sm border border-outline-variant/10 items-center justify-center space-y-2">
                    <div className="text-[7px] font-black text-on-surface/30 uppercase tracking-widest self-start px-1 leading-none">Security H</div>
                    <div className="flex flex-col gap-1.5 w-full px-2">
                      {['ㄱ', 'ㄴ', 'ㄷ'].map((w) => (
                        <div key={w} className="flex items-center gap-2 w-full">
                          <div className={`h-1 flex-1 rounded-full ${horizontalWall === w ? 'bg-tertiary shadow-[0_0_6px_rgba(241,201,125,0.6)]' : 'bg-on-surface/5'}`}></div>
                          <span className={`serif-text text-[9px] font-bold leading-none w-2 text-center ${horizontalWall === w ? 'text-tertiary' : 'text-on-surface/10'}`}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest p-2 md:p-3 rounded-sm border border-outline-variant/10 items-center justify-center space-y-2">
                    <div className="text-[7px] font-black text-on-surface/30 uppercase tracking-widest self-start px-1 leading-none">Security V</div>
                    <div className="flex items-center justify-between w-full h-8 md:h-10 px-3 pt-0.5">
                      {['a', 'b', 'c'].map((w) => (
                        <div key={w} className="flex flex-col items-center gap-1.5 h-full">
                          <div className={`w-1 flex-1 rounded-full ${verticalWall === w ? 'bg-tertiary shadow-[0_0_6px_rgba(241,201,125,0.6)]' : 'bg-on-surface/5'}`}></div>
                          <span className={`serif-text text-[9px] font-bold leading-none ${verticalWall === w ? 'text-tertiary' : 'text-on-surface/10'}`}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {viewMode === 'input' && (
          <section className="mb-8 md:mb-12">
            <div className="flex items-center gap-2.5 mb-4 md:mb-6">
              <div className="h-px w-6 bg-primary/40"></div>
              <label className="text-[9px] font-bold tracking-[0.4em] uppercase text-primary/60 tracking-widest">가옥 선택 (Target Houses)</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
              {Object.entries(groupedHouses).map(([floor, houses]) => (
                <div key={floor} className="bg-surface-container-low p-4 md:p-5 rounded-sm border border-outline-variant/5 group hover:border-primary/10 transition-colors">
                  <p className="text-[9px] font-black text-primary/30 mb-3 md:mb-4 tracking-[0.2em] flex items-center gap-2"><span className="material-symbols-outlined text-[10px]">layers</span> {floor}F SECTOR</p>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {houses.map((h) => (
                      <button key={h} onClick={() => toggleHouse(h)} className={`py-2 text-[10px] font-black transition-all rounded-sm border ${selectedHouses.includes(h) ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary shadow-lg' : 'bg-surface-container-lowest text-on-surface/30 border-outline-variant/10 hover:border-primary/30'}`}>{h}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(viewMode === 'summary' || selectedHouses.length > 0) && (
          <section className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 shadow-xl">
            <div className="grid grid-cols-3 border-b border-outline-variant/15 bg-surface-container-high text-[9px] font-black uppercase tracking-[0.2em] py-3 md:py-4 px-5 md:px-10 text-primary/60">
              <div className="serif-text">ID Number</div><div className="text-center serif-text">Value 01</div><div className="text-center serif-text">Value 02</div>
            </div>
            <div className="divide-y divide-outline-variant/5 max-h-[45vh] md:max-h-140 overflow-y-auto custom-scrollbar">
              {(viewMode === 'input' ? HOUSE_NUMBERS.filter((h) => selectedHouses.includes(h)) : HOUSE_NUMBERS.filter((h) => houseValues[h].v1 !== '' || houseValues[h].v2 !== '')).map((h) => (
                <div key={h} className="grid grid-cols-3 items-center py-3 md:py-4 px-5 md:px-10 hover:bg-surface-container-high group transition-colors">
                  <div className="serif-text text-base md:text-lg font-black text-on-surface/70 group-hover:text-primary transition-colors flex items-center gap-3">
                    <span className="w-0.5 h-4 bg-on-surface/10 group-hover:bg-primary transition-colors"></span>{h}
                  </div>
                  {viewMode === 'input' ? (
                    <>
                      <div className="px-1.5 relative">
                        <input name={`${h}-v1`} className={`w-full bg-surface-container-lowest border ${houseValues[h].v1 !== '' && !isValidValue(houseValues[h].v1) ? 'border-error ring-1 ring-error/20' : 'border-outline-variant/10'} text-center text-primary font-black rounded-sm py-2.5 md:py-3 outline-none text-base md:text-lg focus:ring-1 focus:ring-primary/20 transition-all`} placeholder="—" inputMode="numeric" type="number" value={houseValues[h].v1} onChange={(e) => handleHouseValueChange(h, 'v1', e.target.value)} onKeyDown={(e) => handleKeyDown(e, h, 'v1', HOUSE_NUMBERS.filter((hh) => selectedHouses.includes(hh)))} />
                        {houseValues[h].v1 !== '' && !isValidValue(houseValues[h].v1) && <p className="absolute -bottom-4 left-0 w-full text-[8px] text-error font-black text-center animate-pulse">RANGE 20-100</p>}
                      </div>
                      <div className="px-1.5 relative">
                        <input name={`${h}-v2`} className={`w-full bg-surface-container-lowest border ${houseValues[h].v2 !== '' && !isValidValue(houseValues[h].v2) ? 'border-error ring-1 ring-error/20' : 'border-outline-variant/10'} text-center text-primary font-black rounded-sm py-2.5 md:py-3 outline-none text-base md:text-lg focus:ring-1 focus:ring-primary/20 transition-all`} placeholder="—" inputMode="numeric" type="number" value={houseValues[h].v2} onChange={(e) => handleHouseValueChange(h, 'v2', e.target.value)} onKeyDown={(e) => handleKeyDown(e, h, 'v2', HOUSE_NUMBERS.filter((hh) => selectedHouses.includes(hh)))} />
                        {houseValues[h].v2 !== '' && !isValidValue(houseValues[h].v2) && <p className="absolute -bottom-4 left-0 w-full text-[8px] text-error font-black text-center animate-pulse">RANGE 20-100</p>}
                      </div>
                    </>
                  ) : (
                    <><div className="text-center serif-text font-black text-lg md:text-xl text-primary">{houseValues[h].v1 || '—'}</div><div className="text-center serif-text font-black text-lg md:text-xl text-primary">{houseValues[h].v2 || '—'}</div></>
                  )}
                </div>
              ))}
            </div>
            {((viewMode === 'input' && selectedHouses.length === 0) || 
              (viewMode === 'summary' && !HOUSE_NUMBERS.some(h => houseValues[h].v1 !== '' || houseValues[h].v2 !== ''))) && (
              <div className="py-20 text-center opacity-10 space-y-3">
                <span className="material-symbols-outlined text-4xl block">database</span>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase">
                  {viewMode === 'input' ? 'Data Stream Empty' : 'No Activity Recorded'}
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
                className={`relative flex items-center gap-4 px-12 py-5 ${isFormValid ? 'bg-linear-to-br from-primary to-primary-container text-on-primary hover:scale-[1.02] shadow-xl' : 'bg-surface-container-highest text-on-surface/10 cursor-not-allowed opacity-40'} text-lg font-black rounded-sm tracking-widest transition-all`}
              >
                SECURE PHASE SUBMIT <span className="material-symbols-outlined text-2xl">{isFormValid ? 'verified_user' : 'lock'}</span>
              </button>
            ) : (
              <button 
                onClick={handleNextRound} 
                className="relative flex items-center gap-4 px-12 py-5 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary text-lg font-black rounded-sm shadow-xl hover:scale-[1.02] transition-all tracking-widest"
              >
                {isFinalRound ? 'GENERATE SUMMARY' : 'NEXT MISSION PHASE'} <span className="material-symbols-outlined text-2xl">{isFinalRound ? 'analytics' : 'near_me'}</span>
              </button>
            )}
          </div>
          <p className="mt-6 text-on-surface-variant text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">STAGE 0{currentRound} / 07</p>
        </section>
      </main>

      <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-40">
        {viewMode === 'input' ? (
          <button 
            onClick={handlePhaseSubmit} 
            disabled={!isFormValid} 
            className={`w-full flex items-center justify-center gap-3 py-4 font-black text-base rounded-sm transition-all shadow-xl ${isFormValid ? 'bg-linear-to-br from-primary to-primary-container text-on-primary' : 'bg-surface-container-highest text-on-surface/20 opacity-50'}`}
          >
            데이터 확정
          </button>
        ) : (
          <button 
            onClick={handleNextRound} 
            className="w-full flex items-center justify-center gap-3 py-4 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary font-black text-base rounded-sm shadow-xl"
          >
            {isFinalRound ? '최종 결과 확인' : '다음 단계'}
          </button>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBahMjspscmOlRydFeZiCVATXkfw6pEATu-kblpB4U_8PQEydTQeB7dqX-cofBN8Rj1D8nGIP-tDvL1Bzbv6cFxQYognCmXh74BugeJs97eBtH25zbnPZY3x6hf1VbkImgJ68Uw0RG9YP2o7mWGrFtXPMWBntot6cYMJaFv1jPE_A1BveuEzGHoSZqbR-0DCc9_BDp26do3lzs4mYICAdE7PIunrll4h4At9pxGYAoLyB8kWVnmcihNFo80yPv_Vf_3kPRHg0l3ZfBZ')" }}></div>
    </div>
  )
}

export const Route = createFileRoute('/record' as any)({
  component: RecordScreen,
})
