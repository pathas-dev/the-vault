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
    const saved = localStorage.getItem('vault_rounds')
    if (saved) {
      setRounds(JSON.parse(saved))
    }
  }, [])

  const handleReset = () => {
    localStorage.removeItem('vault_rounds')
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

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full">
      <Topbar />
      <main className="flex-1 px-6 md:px-12 py-10 md:py-20 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
          <div className="lg:col-span-8">
            <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              Operation: Extraction Complete
            </span>
            <h2 className="noto-serif text-5xl md:text-7xl font-black gold-text-gradient leading-tight mb-8">
              최종 작전 보고서
            </h2>
            <p className="text-on-surface-variant max-w-lg leading-relaxed border-l border-outline-variant/30 pl-6">
              총 07단계의 보안 침투 작전이 종료되었습니다. 아래 목록은 각 단계별
              침투 경로와 확보한 자산의 가치에 대한 최종 기록입니다. 본 문서는
              자동 파기되지 않으므로 보안에 유의하십시오.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <div className="bg-surface-container-high/50 border border-outline-variant/20 p-8 rounded-sm w-full max-w-[320px]">
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">
                Total Combined Value
              </p>
              <p className="noto-serif text-5xl font-black gold-text-gradient">
                {calculateTotal().toLocaleString()}{' '}
                <span className="text-sm">V</span>
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          {rounds.map((round, idx) => (
            <section
              key={idx}
              className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 shadow-xl"
            >
              <div className="px-8 py-6 border-b border-outline-variant/10 bg-surface-container-high/50 flex flex-wrap gap-8 items-center justify-between">
                <h3 className="noto-serif text-2xl font-black tracking-tight text-primary flex items-center gap-4">
                  <span className="text-sm opacity-40 font-bold uppercase tracking-widest">
                    Phase
                  </span>
                  0{idx + 1}
                </h3>
                <div className="flex gap-x-8 gap-y-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      Target:
                    </span>
                    <span className="text-sm font-bold">
                      {round.targetHouse}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      Entry:
                    </span>
                    <span className="text-sm font-bold">
                      {round.startPoint}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      Walls:
                    </span>
                    <span className="text-sm font-bold">
                      {round.horizontalWall || '-'}/{round.verticalWall || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-highest/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      <th className="p-4 border-r border-outline-variant/5">
                        가옥 호수
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
                        Value 01
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
                        Value 02
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

        <footer className="mt-20 flex flex-col sm:flex-row gap-6 items-center justify-center">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-16 py-5 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-lg rounded-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
          >
            새로운 작전 시작 (Initiate New Heist)
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-10 py-5 border border-outline-variant/20 font-bold text-sm tracking-widest uppercase hover:bg-surface-container transition-colors"
          >
            기록 출력 (Print Ledger)
          </button>
        </footer>
      </main>
    </div>
  )
}
