import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Topbar } from '../components/Layout'
import { WallMiniMap } from '../components/WallMiniMap'

export const Route = createFileRoute('/summary' as any)({
  component: SummaryScreen,
})

const VAULT_CONFIG: Record<string, number> = {
  '101': 1, '102': 1, '103': 2,
  '111': 1, '112': 1, '113': 2,
  '201': 1, '202': 2, '203': 2,
  '211': 1, '212': 2, '213': 2,
  '301': 1, '302': 2,
  '303': 2, '304': 2,
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
      const roundSum = Object.values(r.vaultValues).reduce(
        (rSum: number, vals: string[]) => {
          return rSum + vals.reduce((s, v) => s + (parseInt(v) || 0), 0)
        },
        0,
      )
      return sum + roundSum
    }, 0)
  }

  const calculateRoundTotal = (r: RoundData) => {
    return Object.values(r.vaultValues).reduce(
      (sum: number, vals: string[]) => sum + vals.reduce((s, v) => s + (parseInt(v) || 0), 0),
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
                      터는 집:
                    </span>
                    <span className="text-xs font-bold">
                      {round.targetHouse}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WallMiniMap horizontalWall={round.horizontalWall} verticalWall={round.verticalWall} startPoint={round.startPoint} />
                  </div>
                </div>
              </div>

              {/* 모바일: 카드 그리드 */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-px bg-outline-variant/5">
                  {VAULT_NUMBERS.map((v) => {
                    const vals = round.vaultValues[v] || []
                    const hasValue = vals.some((val) => val !== '')
                    return (
                      <div
                        key={v}
                        className={`px-4 py-3 ${hasValue ? 'bg-surface-container' : 'bg-surface-container-low'}`}
                      >
                        <p className="text-[9px] font-bold uppercase text-primary/50 tracking-widest mb-1">
                          {v} VAULT
                        </p>
                        <div className="flex gap-3 items-baseline">
                          {Array.from({ length: VAULT_CONFIG[v] }, (_, i) => (
                            <span key={i} className="noto-serif font-black text-primary text-sm">
                              {vals[i] || '—'}
                            </span>
                          )).reduce((acc: React.ReactNode[], el, i) => {
                            if (i > 0) acc.push(<span key={`sep-${i}`} className="text-on-surface-variant/30 text-xs">/</span>)
                            acc.push(el)
                            return acc
                          }, [])}
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
                        금고 (Vault)
                      </th>
                      {VAULT_NUMBERS.map((v) => (
                        <th
                          key={v}
                          className="p-3 text-center border-r border-outline-variant/5 min-w-[60px]"
                        >
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {Array.from({ length: MAX_CAPACITY }, (_, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="p-4 text-[10px] font-bold uppercase text-on-surface-variant/40 border-r border-outline-variant/5 whitespace-nowrap">
                          은닉 가치 {['I', 'II', 'III'][rowIdx]}
                        </td>
                        {VAULT_NUMBERS.map((v) => {
                          const vals = round.vaultValues[v] || []
                          return (
                            <td
                              key={v}
                              className={`p-3 text-center text-sm font-black border-r border-outline-variant/5 ${rowIdx % 2 === 0 ? 'bg-on-surface/[0.02]' : ''}`}
                            >
                              {rowIdx < VAULT_CONFIG[v] ? (vals[rowIdx] || '-') : ''}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
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
            className="w-full sm:w-auto px-16 py-5 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-lg rounded-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">refresh</span> 새 작전 시작
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-10 py-5 border border-outline-variant/20 font-bold text-sm tracking-widest hover:bg-surface-container transition-colors rounded-sm flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">print</span> 장부 보관
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
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            새 작전 시작
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
