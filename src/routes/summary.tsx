import { createFileRoute, useBlocker, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, Fragment } from 'react'
import { FloatingActions } from '../components/Layout'
import { WallMiniMap } from '../components/WallMiniMap'
import { type RoundData } from '../lib/schemas'
import { clearSavedRounds, getSavedRounds } from '../lib/storage'

export const Route = createFileRoute('/summary' as any)({
  component: SummaryScreen,
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

function SummaryScreen() {
  const navigate = useNavigate()
  const [rounds, setRounds] = useState<RoundData[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // 뒤로가기 차단
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: ({ action }) => action === 'BACK',
    withResolver: true,
    enableBeforeUnload: false,
  })

  useEffect(() => {
    setRounds(getSavedRounds())
  }, [])

  const handleReset = () => setShowResetConfirm(true)

  const confirmReset = () => {
    clearSavedRounds()
    navigate({ to: '/', search: { round: 1 }, replace: true })
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
      (sum: number, vals: string[]) =>
        sum + vals.reduce((s, v) => s + (parseInt(v) || 0), 0),
      0,
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full">
      <FloatingActions actions={[{ icon: 'settings', label: '설정' }]} />
      <main className="flex-1 px-4 md:px-12 py-8 md:py-20 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        {/* 헤더 섹션 */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-8 md:mb-16">
          <div>
            <span className="text-primary/60 text-label-sm font-bold tracking-[0.4em] uppercase mb-2 block">
              Operation Complete
            </span>
            <h2 className="noto-serif text-3xl md:text-5xl font-black text-primary leading-tight tracking-tight">
              최종 결산
            </h2>
          </div>
          <div className="bg-surface-container-high/50 px-5 py-4 md:px-8 md:py-6 rounded-sm">
            <p className="text-label-sm font-bold text-primary/40 uppercase tracking-widest mb-1">
              Total Value
            </p>
            <p className="noto-serif text-3xl md:text-4xl font-black text-primary tabular-nums">
              {calculateTotal().toLocaleString()}{' '}
              <span className="text-sm tracking-widest">V</span>
            </p>
          </div>
        </section>

        {/* 라운드 카드 목록 */}
        <div className="space-y-6 md:space-y-12">
          {rounds.map((round, idx) => (
            <section
              key={idx}
              className="bg-surface-container-low rounded-sm overflow-hidden shadow-xl card-lift stagger-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* 라운드 헤더 */}
              <div className="px-4 md:px-8 py-4 md:py-6 bg-surface-container-high/50">
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
                    <span className="text-label-xs uppercase font-bold text-on-surface-variant/40 tracking-widest">
                      터는 집:
                    </span>
                    <span className="text-xs font-bold">
                      {round.targetHouse}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WallMiniMap
                      horizontalWall={round.horizontalWall}
                      verticalWall={round.verticalWall}
                      startPoint={round.startPoint}
                    />
                  </div>
                </div>
              </div>

              {(() => {
                const activeVaults = VAULT_NUMBERS.filter((v) => {
                  const vals = round.vaultValues[v] || []
                  return vals.some((val) => val !== '')
                })
                if (activeVaults.length === 0) return null
                return (
                  <>
                    {/* 모바일: 카드 그리드 */}
                    <div className="block md:hidden">
                      <div className="grid grid-cols-2 gap-px bg-outline-variant/5">
                        {activeVaults.map((v) => {
                          const vals = round.vaultValues[v] || []
                          return (
                            <div
                              key={v}
                              className="px-4 py-3 bg-surface-container"
                            >
                              <p className="text-label-xs font-bold uppercase text-primary/50 tracking-widest mb-1">
                                {v} VAULT
                              </p>
                              <div className="flex gap-3 items-baseline">
                                {Array.from(
                                  { length: VAULT_CONFIG[v] },
                                  (_, i) => (
                                    <Fragment key={i}>
                                      {i > 0 && (
                                        <span className="text-on-surface-variant/30 text-xs">
                                          /
                                        </span>
                                      )}
                                      <span className="noto-serif font-black text-primary text-sm">
                                        {vals[i] || '—'}
                                      </span>
                                    </Fragment>
                                  ),
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* 데스크탑: 테이블 (금고=행, 은닉가치=열) */}
                    <div className="hidden md:block">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-highest/20 text-label-sm font-bold text-primary uppercase tracking-widest">
                            <th className="p-4">
                              금고
                            </th>
                            {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                              <th
                                key={i}
                                className="p-3 text-center"
                              >
                                {['I', 'II', 'III'][i]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeVaults.map((v, vIdx) => {
                            const vals = round.vaultValues[v] || []
                            return (
                              <tr
                                key={v}
                                className={
                                  vIdx % 2 === 0 ? 'bg-on-surface/2' : ''
                                }
                              >
                                <td className="p-4 text-label-xs font-bold uppercase text-primary/60 tracking-widest whitespace-nowrap">
                                  {v}
                                </td>
                                {Array.from(
                                  { length: MAX_CAPACITY },
                                  (_, i) => (
                                    <td
                                      key={i}
                                      className="p-3 text-center text-sm font-black"
                                    >
                                      {i < VAULT_CONFIG[v]
                                        ? vals[i] || '-'
                                        : ''}
                                    </td>
                                  ),
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              })()}
            </section>
          ))}
        </div>

        {/* 데스크탑 액션 버튼 */}
        <footer className="mt-16 hidden md:flex justify-center">
          <button
            onClick={handleReset}
            aria-label="새 작전 시작"
            className="px-12 py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-base rounded-sm btn-press shadow-2xl hover:shadow-primary/20 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>{' '}
            새 작전 시작
          </button>
        </footer>
      </main>

      {/* 모바일 전용 고정 액션 버튼 */}
      <div className="md:hidden fixed inset-x-0 bottom-6 px-4 z-40">
        <button
          onClick={handleReset}
          className="w-full py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-sm rounded-sm btn-press shadow-2xl flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>새
          작전 시작
        </button>
      </div>

      {/* 뒤로가기 차단 다이얼로그 */}
      {status === 'blocked' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={reset} />
          <div className="relative bg-surface-container-high rounded-sm p-6 md:p-8 shadow-2xl max-w-sm mx-4 space-y-4">
            <h3 className="serif-text text-lg font-black text-primary">작전 이탈 확인</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              결산 페이지를 벗어납니다.
              <br />
              이전 화면으로 돌아가시겠습니까?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-3 bg-surface-container-low text-on-surface/60 font-bold text-sm rounded-sm btn-press hover:bg-surface-container"
              >
                결산 유지
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

      {/* 새 작전 시작 확인 다이얼로그 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <div className="relative bg-surface-container-high rounded-sm p-6 md:p-8 shadow-2xl max-w-sm mx-4 space-y-4">
            <h3 className="serif-text text-lg font-black text-primary">새 작전 시작</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              모든 작전 기록이 삭제됩니다.
              <br />
              새 작전을 시작하시겠습니까?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-surface-container-low text-on-surface/60 font-bold text-sm rounded-sm btn-press hover:bg-surface-container"
              >
                취소
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-3 gold-gradient text-on-primary font-bold text-sm rounded-sm btn-press"
              >
                새 작전 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
