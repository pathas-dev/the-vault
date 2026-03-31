interface HWallButtonProps {
  value: string
  className?: string
  isSelected: boolean
  onToggle: (value: string) => void
}

export function HWallButton({ value, className, isSelected, onToggle }: HWallButtonProps) {
  return (
    <div className={`relative h-0 z-10 ${className || ''}`}>
      <button
        onClick={() => onToggle(isSelected ? '__clear__' : value)}
        aria-pressed={isSelected}
        aria-label={`가로벽 ${value} ${isSelected ? '해제' : '설치'}`}
        className="absolute inset-x-0 -top-2.5 h-5 flex items-center justify-center cursor-pointer group"
        title={`가로벽 ${value}`}
      >
        <div
          className={`h-5 flex-1 flex items-center justify-center rounded-sm border transition-all duration-300 mx-1 ${
            isSelected
              ? 'bg-tertiary/20 border-tertiary shadow-[0_0_12px_rgba(241,201,125,0.4)]'
              : 'bg-transparent border-dashed border-tertiary/30 group-hover:border-tertiary/50 group-hover:bg-tertiary/5'
          }`}
        >
          <span
            className={`serif-text text-[10px] font-black select-none transition-all duration-300 ${
              isSelected
                ? 'text-tertiary'
                : 'text-tertiary/30 group-hover:text-tertiary/50'
            }`}
          >
            {value}
          </span>
        </div>
      </button>
    </div>
  )
}

interface VWallButtonProps {
  value: string
  className?: string
  isSelected: boolean
  onToggle: (value: string) => void
}

export function VWallButton({ value, className, isSelected, onToggle }: VWallButtonProps) {
  return (
    <div className={`relative w-0 z-10 ${className || ''}`}>
      <button
        onClick={() => onToggle(isSelected ? '__clear__' : value)}
        aria-pressed={isSelected}
        aria-label={`세로벽 ${value} ${isSelected ? '해제' : '설치'}`}
        className="absolute inset-y-0 -left-2.5 w-5 flex flex-col items-center justify-center cursor-pointer group"
        title={`세로벽 ${value}`}
      >
        <div
          className={`w-5 flex-1 flex items-center justify-center rounded-sm border transition-all duration-300 my-1 ${
            isSelected
              ? 'bg-tertiary/20 border-tertiary shadow-[0_0_12px_rgba(241,201,125,0.4)]'
              : 'bg-transparent border-dashed border-tertiary/30 group-hover:border-tertiary/50 group-hover:bg-tertiary/5'
          }`}
        >
          <span
            className={`text-xs font-black select-none transition-all duration-300 ${
              isSelected
                ? 'text-tertiary'
                : 'text-tertiary/30 group-hover:text-tertiary/50'
            }`}
          >
            {value}
          </span>
        </div>
      </button>
    </div>
  )
}
