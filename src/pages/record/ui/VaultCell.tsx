import { VAULT_CONFIG } from '@/shared/config'

interface VaultCellProps {
  vault: string
  className?: string
  style?: React.CSSProperties
  isSelected: boolean
  onToggle: (vault: string) => void
}

export function VaultCell({ vault, className, style, isSelected, onToggle }: VaultCellProps) {
  const capacity = VAULT_CONFIG[vault]
  return (
    <button
      onClick={() => onToggle(vault)}
      aria-pressed={isSelected}
      aria-label={`금고 ${vault} ${isSelected ? '선택 해제' : '선택'}`}
      className={`@container flex flex-col items-center justify-center gap-0.5 p-1 @sm:p-2 @md:p-3 border rounded-sm min-h-11 @md:min-h-16 btn-press ${
        isSelected
          ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary shadow-lg z-10 vault-selected'
          : 'bg-surface-container-lowest text-on-surface/50 border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container-low hover:shadow-md hover:shadow-primary/5'
      } ${className || ''}`}
      style={style}
    >
      <span className="serif-text text-[10px] @sm:text-xs @md:text-sm font-black">
        {vault}
      </span>
      <div className="flex gap-0.5">
        {Array.from({ length: capacity }, (_, i) => (
          <span
            key={i}
            className={`size-2 @md:size-3 rounded-sm border flex items-center justify-center text-label-xs font-black ${
              isSelected
                ? 'border-on-primary/40 text-on-primary/70'
                : 'border-on-surface/15 text-on-surface/20'
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </button>
  )
}
