import { WallMiniMap } from '@/shared/ui'

interface RoundHeaderProps {
  currentRound: number
  totalRounds: number
  targetHouse: 'A' | 'B' | 'C' | 'D'
  viewMode: 'input' | 'summary'
  horizontalWall: 'ㄴ' | 'ㄷ' | null
  verticalWall: 'a' | 'b' | 'c' | 'd' | null
  startPoint: 'A' | 'B'
  onTargetHouseChange: (house: 'A' | 'B' | 'C' | 'D') => void
}

export function RoundHeader({
  currentRound,
  totalRounds,
  targetHouse,
  viewMode,
  horizontalWall,
  verticalWall,
  startPoint,
  onTargetHouseChange,
}: RoundHeaderProps) {
  return (
    <section className="mb-6 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
        <div className="max-w-4xl w-full">
          <span className={`text-label-sm font-bold tracking-[0.4em] uppercase mb-2 md:mb-3 block transition-colors duration-300 ${viewMode === 'input' ? 'text-primary/60' : 'text-tertiary/80'}`}>
            {viewMode === 'input'
              ? '현장 상황 보고 (Field Recon)'
              : '획득물 결산 (Loot Accounting)'}
          </span>
          <h1 className="serif-text text-2xl md:text-5xl font-black text-primary tracking-tight leading-tight mb-3 md:mb-4">
            작전 PHASE {currentRound.toString().padStart(2, '0')} / 07
          </h1>

          {/* 라운드 진행률 표시기 */}
          <div className="flex items-center gap-1.5 mb-4 md:mb-6">
            {Array.from({ length: totalRounds }, (_, i) => {
              const round = i + 1
              const isCompleted = round < currentRound
              const isCurrent = round === currentRound
              return (
                <div key={round} className="flex items-center gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isCurrent && viewMode === 'summary'
                        ? 'w-8 md:w-12 bg-tertiary shadow-[0_0_8px_rgba(241,201,125,0.3)]'
                        : isCurrent
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
                {(['A', 'B', 'C', 'D'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => onTargetHouseChange(h)}
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
  )
}
