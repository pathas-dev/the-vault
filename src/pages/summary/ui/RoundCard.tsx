import { Fragment } from 'react'
import type { RoundData } from '@/entities/round'
import { VAULT_CONFIG, VAULT_NUMBERS, MAX_CAPACITY } from '@/shared/config'
import { calculateRoundTotal } from '@/entities/round'
import { WallMiniMap } from '@/components/WallMiniMap'

interface RoundCardProps {
  round: RoundData
  index: number
}

export function RoundCard({ round, index }: RoundCardProps) {
  const activeVaults = VAULT_NUMBERS.filter((v) => {
    const vals = round.vaultValues[v] || []
    return vals.some((val) => val !== '')
  })

  return (
    <section
      className="bg-surface-container-low rounded-sm overflow-hidden shadow-xl card-lift stagger-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 라운드 헤더 */}
      <div className="px-4 md:px-8 py-4 md:py-6 bg-surface-container-high/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="noto-serif text-xl md:text-2xl font-black tracking-tight text-primary flex items-center gap-3">
            <span className="text-xs opacity-40 font-bold uppercase tracking-widest">
              Op Phase
            </span>
            {String(index + 1).padStart(2, '0')}
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

      {activeVaults.length > 0 && (
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
                  <th className="p-4">금고</th>
                  {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                    <th key={i} className="p-3 text-center">
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
                      className={vIdx % 2 === 0 ? 'bg-on-surface/2' : ''}
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
      )}
    </section>
  )
}
