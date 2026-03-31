interface MobileNumpadProps {
  target: { vault: string; index: number }
  currentValue: string
  error: boolean
  onDigit: (digit: string) => void
  onBackspace: () => void
  onConfirm: () => void
  onClose: () => void
}

export function MobileNumpad({
  target,
  currentValue,
  error,
  onDigit,
  onBackspace,
  onConfirm,
  onClose,
}: MobileNumpadProps) {
  return (
    <>
      <div className="fixed inset-0 bg-transparent" onClick={onClose} />
      <div className="@container relative bg-surface-container-high shadow-[0_-4px_24px_rgba(0,0,0,0.4)] pb-6 pt-3 px-4">
        {/* 현재 편집 슬롯 표시 */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="serif-text text-sm font-black text-primary">{target.vault}</span>
            <span className="text-label-xs text-on-surface-variant/40 uppercase tracking-widest">
              슬롯 {target.index + 1}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface/40 p-1"
            aria-label="넘버패드 닫기"
          >
            <span className="material-symbols-outlined text-lg">keyboard_hide</span>
          </button>
        </div>
        {/* 현재 값 */}
        <div className={`bg-surface-container-lowest rounded-sm py-3 mb-3 text-center transition-colors duration-150 ${error ? 'bg-error/10 animate-shake' : ''}`}>
          <span className={`serif-text text-2xl font-black tabular-nums ${error ? 'text-error' : 'text-primary'}`}>
            {currentValue || '—'}
          </span>
        </div>
        {/* 키패드 그리드 */}
        <div className="grid grid-cols-3 gap-1.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => onDigit(d)}
              className="py-3 @sm:py-4 @md:py-5 bg-surface-container rounded-sm text-base @sm:text-lg @md:text-xl font-black text-on-surface btn-press active:bg-surface-container-highest"
            >
              {d}
            </button>
          ))}
          <button
            onClick={onBackspace}
            className="py-3 @sm:py-4 @md:py-5 bg-surface-container rounded-sm font-black text-on-surface/60 btn-press active:bg-surface-container-highest flex items-center justify-center"
            aria-label="지우기"
          >
            <span className="material-symbols-outlined text-xl @md:text-2xl">backspace</span>
          </button>
          <button
            onClick={() => onDigit('0')}
            className="py-3 @sm:py-4 @md:py-5 bg-surface-container rounded-sm text-base @sm:text-lg @md:text-xl font-black text-on-surface btn-press active:bg-surface-container-highest"
          >
            0
          </button>
          <button
            onClick={onConfirm}
            className="py-3 @sm:py-4 @md:py-5 gold-gradient rounded-sm text-base @sm:text-lg @md:text-xl font-black text-on-primary btn-press"
            aria-label="다음"
          >
            <span className="material-symbols-outlined text-xl @md:text-2xl">check</span>
          </button>
        </div>
      </div>
    </>
  )
}
