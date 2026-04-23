import { VAULT_CONFIG, VAULT_NUMBERS, MAX_CAPACITY } from '@/shared/config'
import { isValidValue } from '@/shared/lib/validation'

interface VaultValueTableProps {
  viewMode: 'input' | 'summary'
  selectedVaults: string[]
  vaultValues: Record<string, string[]>
  isMobile: boolean
  numpadTarget: { vault: string; index: number } | null
  onValueChange: (vault: string, index: number, value: string) => void
  onNumpadOpen: (vault: string, index: number) => void
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    vault: string,
    index: number,
    visibleVaults: string[],
  ) => void
  isMasked?: boolean
  onMaskToggle?: () => void
}

export function VaultValueTable({
  viewMode,
  selectedVaults,
  vaultValues,
  isMobile,
  numpadTarget,
  onValueChange,
  onNumpadOpen,
  onKeyDown,
  isMasked,
  onMaskToggle,
}: VaultValueTableProps) {
  const visibleVaults = VAULT_NUMBERS.filter((v) => selectedVaults.includes(v))

  const displayVaults =
    viewMode === 'input'
      ? VAULT_NUMBERS.filter((v) => selectedVaults.includes(v))
      : VAULT_NUMBERS.filter((v) => vaultValues[v].some((val) => val !== ''))

  const isEmpty =
    (viewMode === 'input' && selectedVaults.length === 0) ||
    (viewMode === 'summary' &&
      !VAULT_NUMBERS.some((v) => vaultValues[v].some((val) => val !== '')))

  return (
    <section
      className={`bg-surface-container-low rounded-sm overflow-hidden shadow-xl flex flex-col ${viewMode === 'summary' ? 'flex-1' : ''}`}
    >
      <div
        className="bg-surface-container-high text-label-xs font-black uppercase tracking-widest py-3 md:py-4 px-5 md:px-10 text-primary/60 flex items-center shrink-0"
        style={{
          display: 'grid',
          gridTemplateColumns: `100px repeat(${MAX_CAPACITY}, 1fr)`,
        }}
      >
        <div className="serif-text flex items-center gap-2">
          금고
          {onMaskToggle && (
            <button
              onClick={onMaskToggle}
              className={`p-1 rounded-sm transition-colors hover:bg-surface-container-highest ${isMasked ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}
              title={isMasked ? '금고 내용 표시' : '금고 내용 숨기기'}
            >
              <span className="material-symbols-outlined text-sm leading-none">
                {isMasked ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
        </div>
        {Array.from({ length: MAX_CAPACITY }, (_, i) => (
          <div key={i} className="text-center serif-text">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
        {isMasked ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low/50 transition-all p-8 md:p-12">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 shadow-inner border border-primary/5">
              <span className="material-symbols-outlined text-4xl text-primary/60 animate-pulse">
                lock
              </span>
            </div>
            <p className="noto-serif text-lg font-black text-primary/70 tracking-tight">
              데이터 보호 중
            </p>
            <p className="text-label-xs font-bold uppercase tracking-ultra opacity-20 mt-2">
              Encrypted
            </p>
          </div>
        ) : (
          displayVaults.map((v) => (
            <div
              key={v}
              className="items-center py-3 md:py-4 px-5 md:px-10 hover:bg-surface-container-high group even:bg-surface-container-low/30 transition-colors"
              style={{
                display: 'grid',
                gridTemplateColumns: `100px repeat(${MAX_CAPACITY}, 1fr)`,
              }}
            >
              <div className="serif-text text-base md:text-lg font-black text-on-surface/70 group-hover:text-primary transition-colors flex items-center gap-3">
                <span className="w-0.5 h-4 bg-on-surface/10 group-hover:bg-primary transition-colors"></span>
                {v}
              </div>
              {viewMode === 'input' ? (
                <>
                  {Array.from({ length: MAX_CAPACITY }, (_, i) => {
                    const isSlotAvailable = i < VAULT_CONFIG[v]
                    const isUnlocked =
                      i === 0 ||
                      (vaultValues[v][i - 1] !== '' &&
                        isValidValue(vaultValues[v][i - 1]))
                    const isEnabled = isSlotAvailable && isUnlocked
                    const isTrap = vaultValues[v][i] === '0'
                    const isInvalid = vaultValues[v][i] !== '' && !isValidValue(vaultValues[v][i])
                    return (
                      <div key={i} className="px-1.5 relative">
                        {isSlotAvailable ? (
                          <div className="relative">
                            <input
                              name={`${v}-v${i}`}
                              aria-label={`${v} 금고 슬롯 ${i + 1}`}
                              className={`w-full border text-center font-black rounded-sm py-2.5 md:py-3 outline-none text-base md:text-lg transition-all ${
                                numpadTarget?.vault === v &&
                                numpadTarget?.index === i
                                  ? isTrap
                                    ? 'bg-error/5 border-error/60 ring-2 ring-error/20 text-transparent'
                                    : 'bg-surface-container-lowest border-primary ring-2 ring-primary/30 text-primary'
                                  : !isEnabled
                                    ? 'bg-surface-container-low border-outline-variant/5 text-on-surface/15 cursor-not-allowed'
                                    : isTrap
                                      ? 'bg-error/5 border-error/40 text-transparent trap-glow'
                                      : isInvalid
                                        ? 'bg-surface-container-lowest border-error ring-1 ring-error/20 text-primary'
                                        : 'bg-surface-container-lowest border-outline-variant/10 text-primary input-glow focus:ring-1 focus:ring-primary/20'
                              }`}
                              placeholder={isEnabled ? '—' : ''}
                              inputMode={isMobile ? 'none' : 'numeric'}
                              type="number"
                              readOnly={isMobile}
                              disabled={!isEnabled}
                              value={vaultValues[v][i]}
                              onClick={() => {
                                if (isMobile && isEnabled) {
                                  onNumpadOpen(v, i)
                                }
                              }}
                              onChange={(e) =>
                                onValueChange(v, i, e.target.value)
                              }
                              onKeyDown={(e) =>
                                onKeyDown(e, v, i, visibleVaults)
                              }
                            />
                            {/* 함정 아이콘 오버레이 */}
                            {isTrap && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span
                                  className="material-symbols-outlined text-error/70 text-lg md:text-xl"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  skull
                                </span>
                              </div>
                            )}
                            {/* 유효성 에러 */}
                            {isInvalid && !isTrap && (
                              <p className="absolute -bottom-4 inset-x-0 text-label-xs text-error font-black text-center">
                                0-100
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full py-2.5 md:py-3 text-center text-on-surface/10 text-base">
                            —
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              ) : (
                <>
                  {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                    <div
                      key={i}
                      className="text-center serif-text font-black text-lg md:text-xl text-primary"
                    >
                      {i < VAULT_CONFIG[v]
                        ? vaultValues[v][i] === '0'
                          ? <span className="inline-flex items-center gap-1 text-error/80 text-sm">
                              <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >skull</span>
                              함정
                            </span>
                          : vaultValues[v][i] || '—'
                        : '—'}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
