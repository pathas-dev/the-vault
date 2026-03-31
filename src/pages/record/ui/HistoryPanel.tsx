import { WallMiniMap } from '@/shared/ui'
import type { RoundData } from '@/entities/round'

interface HistoryPanelProps {
  isOpen: boolean
  rounds: RoundData[]
  onClose: () => void
}

export function HistoryPanel({ isOpen, rounds, onClose }: HistoryPanelProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`absolute inset-y-0 right-0 size-full max-w-md bg-surface-container-high/90 backdrop-blur-[20px] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
              onClick={onClose}
              aria-label="작전 이력 닫기"
              className="p-2 hover:bg-white/5 rounded-sm transition-colors group"
            >
              <span className="material-symbols-outlined text-on-surface/40 group-hover:text-primary">
                close
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
            {rounds.length === 0 ? (
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
                {rounds.map((round, idx) => (
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
  )
}
