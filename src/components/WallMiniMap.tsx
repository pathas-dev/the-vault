type WallMiniMapProps = {
  horizontalWall: string | null
  verticalWall: string | null
}

export function WallMiniMap({ horizontalWall, verticalWall }: WallMiniMapProps) {
  const wallActive = 'bg-tertiary shadow-[0_0_4px_rgba(241,201,125,0.9)]'
  const wallInactive = 'bg-transparent'

  return (
    <div className="flex items-stretch" style={{ width: '108px', height: '56px' }}>
      {/* 401 */}
      <div className="border border-outline-variant/30 bg-surface-container-lowest/30 self-center w-3 h-7 rounded-[1px]" />

      {/* 3xx */}
      <div className="border border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-[1px]" />

      {/* Walls a/b: 3xx ↔ 20x/21x */}
      <div className="flex flex-col w-0 z-10">
        <div className={`flex-1 w-[3px] -ml-[1px] rounded-full ${verticalWall === 'a' ? wallActive : wallInactive}`} />
        <div className={`flex-1 w-[3px] -ml-[1px] rounded-full ${verticalWall === 'b' ? wallActive : wallInactive}`} />
      </div>

      {/* 2xx column */}
      <div className="flex flex-col flex-1">
        <div className="border border-l-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-[1px]" />
        <div className="h-0 relative">
          <div className={`absolute left-0 right-0 -top-[1px] h-[3px] rounded-full ${horizontalWall === 'ㄴ' ? wallActive : wallInactive}`} />
        </div>
        <div className="border border-l-0 border-t-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-[1px]" />
      </div>

      {/* Walls c/d: 2xx ↔ 1xx */}
      <div className="flex flex-col w-0 z-10">
        <div className={`flex-1 w-[3px] -ml-[1px] rounded-full ${verticalWall === 'c' ? wallActive : wallInactive}`} />
        <div className={`flex-1 w-[3px] -ml-[1px] rounded-full ${verticalWall === 'd' ? wallActive : wallInactive}`} />
      </div>

      {/* 1xx column */}
      <div className="flex flex-col flex-1">
        <div className="border border-l-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-[1px]" />
        <div className="h-0 relative">
          <div className={`absolute left-0 right-0 -top-[1px] h-[3px] rounded-full ${horizontalWall === 'ㄷ' ? wallActive : wallInactive}`} />
        </div>
        <div className="border border-l-0 border-t-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-[1px]" />
      </div>
    </div>
  )
}
