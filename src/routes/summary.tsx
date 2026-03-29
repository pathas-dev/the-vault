import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Topbar } from '../components/Layout'

export const Route = createFileRoute('/summary' as any)({
  component: SummaryScreen,
})

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

function SummaryScreen() {
  const navigate = useNavigate()
  const [rounds, setRounds] = useState<RoundData[]>([])

  useEffect(() => {
    const saved = sessionStorage.getItem('vault_rounds')
    if (saved) {
      setRounds(JSON.parse(saved))
    }
  }, [])

  const handleReset = () => {
    sessionStorage.removeItem('vault_rounds')
    navigate({ to: '/' })
  }

  const calculateTotal = () => {
    return rounds.reduce((sum: number, r: RoundData) => {
      const roundSum = Object.values(r.houseValues).reduce(
        (rSum: number, hv: HouseValue) => {
          return rSum + (parseInt(hv.v1) || 0) + (parseInt(hv.v2) || 0)
        },
        0,
      )
      return sum + roundSum
    }, 0)
  }

  const calculateRoundTotal = (r: RoundData) => {
    return Object.values(r.houseValues).reduce(
      (sum: number, hv: HouseValue) => sum + (parseInt(hv.v1) || 0) + (parseInt(hv.v2) || 0),
      0,
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full pt-16 md:pt-20">
      <Topbar />
      <main className="flex-1 px-4 md:px-12 py-8 md:py-20 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        {/* 헤더 섹션 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 mb-10 md:mb-20 items-end">
          <div className="lg:col-span-8">
            <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-3 md:mb-4 block">
              Operation: Loot Extraction Complete
            </span>
            <h2 className="noto-serif text-4xl md:text-7xl font-black gold-text-gradient leading-tight mb-4 md:mb-8">
              대도(大盜)의 비밀 장부
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base max-w-lg leading-relaxed border-l border-outline-variant/30 pl-4 md:pl-6">
              총 07단계의 보물 약탈 작전이 성료되었습니다. 아래 목록은 각 단계별
              잠입 경로와 확보한 전리품 가치에 대한 최종 기록입니다. 본 문서는
              자동 파기되지 않으므로 보안에 각별히 유의하십시오.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <div className="bg-surface-container-high/50 border border-outline-variant/20 p-5 md:p-8 rounded-sm w-full lg:max-w-[320px]">
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">
                Total Extraction Value
              </p>
              <p className="noto-serif text-4xl md:text-5xl font-black gold-text-gradient">
                {calculateTotal().toLocaleString()}{' '}
                <span className="text-sm">V</span>
              </p>
            </div>
          </div>
        </section>

        {/* 라운드 카드 목록 */}
        <div className="space-y-6 md:space-y-12">
          {rounds.map((round, idx) => (
            <section
              key={idx}
              className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 shadow-xl"
            >
              {/* 라운드 헤더 */}
              <div className="px-4 md:px-8 py-4 md:py-6 border-b border-outline-variant/10 bg-surface-container-high/50">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="noto-serif text-xl md:text-2xl font-black tracking-tight text-primary flex items-center gap-3">
                    <span className="text-xs opacity-40 font-bold uppercase tracking-widest">
                      Op Phase
                    </span>
                    0{idx + 1}
                  </h3>
                  <span className="noto-serif text-base font-black text-tertiary">
                    {calculateRoundTotal(round).toLocaleString()} V
                  </span>
                </div>
                <div className="flex gap-x-5 gap-y-1.5 flex-wrap mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      Target Site:
                    </span>
                    <span className="text-xs font-bold">
                      {round.targetHouse}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      Infiltration:
                    </span>
                    <span className="text-xs font-bold">
                      {round.startPoint}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      Walls:
                    </span>
                    <span className="text-xs font-bold">
                      {round.horizontalWall || '-'}/{round.verticalWall || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 모바일: 카드 그리드 / 데스크탑: 가로 테이블 */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-px bg-outline-variant/5">
                  {HOUSE_NUMBERS.map((h) => {
                    const v1 = round.houseValues[h]?.v1
                    const v2 = round.houseValues[h]?.v2
                    const hasValue = v1 || v2
                    return (
                      <div
                        key={h}
                        className={`px-4 py-3 ${hasValue ? 'bg-surface-container' : 'bg-surface-container-low'}`}
                      >
                        <p className="text-[9px] font-bold uppercase text-primary/50 tracking-widest mb-1">
                          {h} SITE
                        </p>
                        <div className="flex gap-3 items-baseline">
                          <span className="noto-serif font-black text-primary text-sm">
                            {v1 || '—'}
                          </span>
                          <span className="text-on-surface-variant/30 text-xs">/</span>
                          <span className="noto-serif font-black text-primary text-sm">
                            {v2 || '—'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 데스크탑: 가로 테이블 */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-highest/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      <th className="p-4 border-r border-outline-variant/5">
                        단위 구역 (Unit)
                      </th>
                      {HOUSE_NUMBERS.map((h) => (
                        <th
                          key={h}
                          className="p-3 text-center border-r border-outline-variant/5 min-w-[60px]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    <tr>
                      <td className="p-4 text-[10px] font-bold uppercase text-on-surface-variant/40 border-r border-outline-variant/5 whitespace-nowrap">
                        은닉 가치 I
                      </td>
                      {HOUSE_NUMBERS.map((h) => (
                        <td
                          key={h}
                          className="p-3 text-center text-sm font-black border-r border-outline-variant/5 bg-on-surface/[0.02]"
                        >
                          {round.houseValues[h].v1 || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-[10px] font-bold uppercase text-on-surface-variant/40 border-r border-outline-variant/5 whitespace-nowrap">
                        은닉 가치 II
                      </td>
                      {HOUSE_NUMBERS.map((h) => (
                        <td
                          key={h}
                          className="p-3 text-center text-sm font-black border-r border-outline-variant/5"
                        >
                          {round.houseValues[h].v2 || '-'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        {/* 데스크탑 액션 버튼 */}
        <footer className="mt-20 hidden md:flex flex-col sm:flex-row gap-6 items-center justify-center">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-16 py-5 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-lg rounded-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
          >
            새로운 털이 계획
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-10 py-5 border border-outline-variant/20 font-bold text-sm tracking-widest uppercase hover:bg-surface-container transition-colors rounded-sm"
          >
            장부 보관 (Print)
          </button>
        </footer>
      </main>

      {/* 모바일 전용 고정 액션 버튼 */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-40">
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-sm rounded-sm active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>refresh</span>
            새로운 털이 계획
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-4 border border-outline-variant/30 bg-surface-container-low/80 backdrop-blur-sm font-bold text-xs tracking-widest uppercase hover:bg-surface-container transition-colors rounded-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface/60">print</span>
          </button>
        </div>
      </div>
    </div>
  )
}
