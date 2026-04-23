import { WallMiniMap } from '@/shared/ui'

interface RoundHeaderProps {
  currentRound: number
  totalRounds: number
  viewMode: 'input' | 'summary'
  horizontalWall: 'ㄱ' | 'ㄴ' | null
  verticalWall: 'a' | 'b' | 'c' | 'd' | null
  startPoint: 'A' | 'B'
}

export function RoundHeader({
  currentRound,
  totalRounds,
  viewMode,
  horizontalWall,
  verticalWall,
  startPoint,
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

          {viewMode === 'summary' && (
            <div className="py-6 px-5 md:px-10 bg-surface-container-low rounded-sm relative overflow-hidden shadow-xl border border-outline-variant/5">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary to-primary/40"></div>
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
