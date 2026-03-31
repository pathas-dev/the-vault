import { VaultCell } from './VaultCell'
import { HWallButton, VWallButton } from './WallButton'

interface FloorPlanProps {
  selectedVaults: string[]
  horizontalWall: 'ㄱ' | 'ㄴ' | null
  verticalWall: 'a' | 'b' | 'c' | 'd' | null
  startPoint: 'A' | 'B'
  onVaultToggle: (vault: string) => void
  onHWallToggle: (value: string) => void
  onVWallToggle: (value: string) => void
  onStartPointChange: (value: 'A' | 'B') => void
}

export function FloorPlan({
  selectedVaults,
  horizontalWall,
  verticalWall,
  startPoint,
  onVaultToggle,
  onHWallToggle,
  onVWallToggle,
  onStartPointChange,
}: FloorPlanProps) {
  const isVaultSelected = (vault: string) => selectedVaults.includes(vault)

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-center gap-2.5 mb-2 md:mb-3">
        <div className="h-px w-6 bg-primary/40"></div>
        <label className="text-label-xs font-bold tracking-[0.4em] uppercase text-primary/60">
          은닉 금고
        </label>
      </div>
      <p className="text-label-sm text-on-surface-variant/50 mb-4 md:mb-6">
        금고를 탭하여 선택 · 벽과 침투 지점(A/B)을 설정 · 하단 숫자는 수용량
      </p>

      <div className="bg-surface-container-low p-1.5 md:p-6 rounded-sm border border-outline-variant/10 overflow-x-auto">
        <div
          className="flex w-full mx-auto"
          style={{ maxWidth: '740px' }}
        >
          {/* Room 401 */}
          <div className="self-center border border-r-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3">
            <VaultCell
              vault="401"
              className="w-full min-w-10 md:min-w-15 min-h-11 md:min-h-18"
              isSelected={isVaultSelected('401')}
              onToggle={onVaultToggle}
            />
          </div>

          {/* Room 3xx - 4 corners */}
          <div
            className="border border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3"
            style={{ flex: '0.7' }}
          >
            <div className="flex flex-col gap-1 h-full">
              <div className="grid grid-cols-2 gap-1">
                <VaultCell vault="301" className="w-full" isSelected={isVaultSelected('301')} onToggle={onVaultToggle} />
                <VaultCell vault="302" className="w-full" isSelected={isVaultSelected('302')} onToggle={onVaultToggle} />
              </div>
              <div className="flex-1" />
              <div className="grid grid-cols-2 gap-1">
                <VaultCell vault="303" className="w-full" isSelected={isVaultSelected('303')} onToggle={onVaultToggle} />
                <VaultCell vault="304" className="w-full" isSelected={isVaultSelected('304')} onToggle={onVaultToggle} />
              </div>
            </div>
          </div>

          {/* Vertical walls a/b overlay: between 3xx and 20x/21x */}
          <div className="flex flex-col self-stretch w-0 z-10">
            <VWallButton value="a" className="flex-1" isSelected={verticalWall === 'a'} onToggle={onVWallToggle} />
            <VWallButton value="b" className="flex-1" isSelected={verticalWall === 'b'} onToggle={onVWallToggle} />
          </div>

          {/* 2xx column */}
          <div className="flex flex-col flex-1">
            {/* Room 20x */}
            <div className="border border-l-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1">
              <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                <VaultCell vault="201" className="w-full" isSelected={isVaultSelected('201')} onToggle={onVaultToggle} />
                <VaultCell vault="202" className="w-full" isSelected={isVaultSelected('202')} onToggle={onVaultToggle} />
                <div />
                <VaultCell vault="203" className="w-full" isSelected={isVaultSelected('203')} onToggle={onVaultToggle} />
              </div>
            </div>
            {/* Horizontal wall ㄱ overlay: between 20x and 21x */}
            <HWallButton value="ㄱ" isSelected={horizontalWall === 'ㄱ'} onToggle={onHWallToggle} />
            {/* Room 21x */}
            <div className="border border-l-0 border-t-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1">
              <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                <VaultCell vault="211" className="w-full" isSelected={isVaultSelected('211')} onToggle={onVaultToggle} />
                <VaultCell vault="212" className="w-full" isSelected={isVaultSelected('212')} onToggle={onVaultToggle} />
                <div />
                <VaultCell vault="213" className="w-full" isSelected={isVaultSelected('213')} onToggle={onVaultToggle} />
              </div>
            </div>
          </div>

          {/* Vertical walls c/d overlay: between 20x↔10x and 21x↔11x */}
          <div className="flex flex-col self-stretch w-0 z-10">
            <VWallButton value="c" className="flex-1" isSelected={verticalWall === 'c'} onToggle={onVWallToggle} />
            <VWallButton value="d" className="flex-1" isSelected={verticalWall === 'd'} onToggle={onVWallToggle} />
          </div>

          {/* 1xx column */}
          <div className="flex flex-col flex-1">
            {/* Room 10x */}
            <div className="border border-l-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1 relative overflow-hidden">
              <div
                className={`absolute right-0 inset-y-0 w-0.5 transition-all duration-500 ${startPoint === 'A' ? 'bg-intrusion shadow-[0_0_12px_rgba(255,45,85,0.8)]' : 'bg-transparent'}`}
              />
              <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                <VaultCell vault="101" className="w-full" isSelected={isVaultSelected('101')} onToggle={onVaultToggle} />
                <VaultCell vault="102" className="w-full" isSelected={isVaultSelected('102')} onToggle={onVaultToggle} />
                <div />
                <VaultCell vault="103" className="w-full" isSelected={isVaultSelected('103')} onToggle={onVaultToggle} />
              </div>
            </div>
            {/* Horizontal wall ㄴ overlay: between 10x and 11x */}
            <HWallButton value="ㄴ" isSelected={horizontalWall === 'ㄴ'} onToggle={onHWallToggle} />
            {/* Room 11x */}
            <div className="border border-l-0 border-t-0 border-outline-variant/15 bg-surface-container-lowest/30 p-1 md:p-3 flex-1 relative overflow-hidden">
              <div
                className={`absolute right-0 inset-y-0 w-0.5 transition-all duration-500 ${startPoint === 'B' ? 'bg-intrusion shadow-[0_0_12px_rgba(255,45,85,0.8)]' : 'bg-transparent'}`}
              />
              <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                <VaultCell vault="111" className="w-full" isSelected={isVaultSelected('111')} onToggle={onVaultToggle} />
                <VaultCell vault="112" className="w-full" isSelected={isVaultSelected('112')} onToggle={onVaultToggle} />
                <div />
                <VaultCell vault="113" className="w-full" isSelected={isVaultSelected('113')} onToggle={onVaultToggle} />
              </div>
            </div>
          </div>

          {/* Entry points: right side of 1xx */}
          <div className="flex flex-col self-stretch gap-1 ml-1.5 md:ml-2">
            {(['A', 'B'] as const).map((point) => {
              const isActive = startPoint === point
              return (
                <button
                  key={point}
                  onClick={() => onStartPointChange(point)}
                  aria-label={`침투 지점 ${point} 선택`}
                  aria-pressed={isActive}
                  className={`flex-1 flex flex-col items-center justify-center px-1 md:px-2 rounded-sm transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? 'bg-intrusion/10 border border-intrusion/40 shadow-[0_0_16px_rgba(255,45,85,0.15)]'
                      : 'border border-dashed border-on-surface/10 hover:border-intrusion/30 hover:bg-intrusion/5'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xs md:text-sm transition-all duration-300 rotate-180 ${
                      isActive ? 'text-intrusion' : 'text-on-surface/20 group-hover:text-intrusion/40'
                    }`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    arrow_forward
                  </span>
                  <span
                    className={`serif-text text-[10px] md:text-xs font-black transition-all duration-300 ${
                      isActive
                        ? 'text-intrusion drop-shadow-[0_0_6px_rgba(255,45,85,0.5)]'
                        : 'text-on-surface/20 group-hover:text-intrusion/40'
                    }`}
                  >
                    {point}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
