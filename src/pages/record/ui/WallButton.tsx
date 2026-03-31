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
        className="absolute inset-x-0 -top-4 h-8 flex items-center cursor-pointer group"
        title={`가로벽 ${value}`}
      >
        <div className="h-0.5 flex-1 bg-outline-variant/25" />
        <div
          className={`h-1 w-8 mx-0.5 rounded-full transition-all duration-300 ${
            isSelected
              ? 'bg-tertiary shadow-[0_0_12px_rgba(241,201,125,0.9)]'
              : 'bg-tertiary/15 shadow-[0_0_6px_rgba(241,201,125,0.1)] group-hover:bg-tertiary/30 group-hover:shadow-[0_0_8px_rgba(241,201,125,0.2)]'
          }`}
        />
        <div className="h-0.5 flex-1 bg-outline-variant/25" />
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
        className="absolute inset-y-0 -left-4 w-8 flex flex-col items-center cursor-pointer group"
        title={`세로벽 ${value}`}
      >
        <div className="w-0.5 flex-1 bg-outline-variant/25" />
        <div
          className={`w-1 h-8 my-0.5 rounded-full transition-all duration-300 ${
            isSelected
              ? 'bg-tertiary shadow-[0_0_12px_rgba(241,201,125,0.9)]'
              : 'bg-tertiary/15 shadow-[0_0_6px_rgba(241,201,125,0.1)] group-hover:bg-tertiary/30 group-hover:shadow-[0_0_8px_rgba(241,201,125,0.2)]'
          }`}
        />
        <div className="w-0.5 flex-1 bg-outline-variant/25" />
      </button>
    </div>
  )
}
