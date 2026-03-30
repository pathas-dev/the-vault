type WallMiniMapProps = {
  horizontalWall: string | null
  verticalWall: string | null
  startPoint?: string
}

export function WallMiniMap({
  horizontalWall,
  verticalWall,
  startPoint,
}: WallMiniMapProps) {
  const wallActive = 'bg-tertiary shadow-[0_0_4px_rgba(241,201,125,0.9)]'
  const wallInactive = 'bg-transparent'
  const entryActive = 'bg-intrusion shadow-[0_0_8px_rgba(255,45,85,0.6)]'

  return (
    <div
      className="flex items-stretch"
      style={{ width: '130px', height: '56px' }}
    >
      {/* 401 */}
      <div className="border border-outline-variant/30 bg-surface-container-lowest/30 self-center w-3 h-7 rounded-sm" />

      {/* 3xx */}
      <div className="border border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-sm" />

      {/* Walls a/b: 3xx ↔ 20x/21x */}
      <div className="flex flex-col w-0 z-10">
        <div
          className={`flex-1 w-0.75 -ml-px rounded-full ${verticalWall === 'a' ? wallActive : wallInactive}`}
        />
        <div
          className={`flex-1 w-0.75 -ml-px rounded-full ${verticalWall === 'b' ? wallActive : wallInactive}`}
        />
      </div>

      {/* 2xx column */}
      <div className="flex flex-col flex-1">
        <div className="border border-l-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-sm" />
        <div className="h-0 relative">
          <div
            className={`absolute inset-x-0 -top-px h-0.75 rounded-full ${horizontalWall === 'ㄴ' ? wallActive : wallInactive}`}
          />
        </div>
        <div className="border border-l-0 border-t-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-sm" />
      </div>

      {/* Walls c/d: 2xx ↔ 1xx */}
      <div className="flex flex-col w-0 z-10">
        <div
          className={`flex-1 w-0.75 -ml-px rounded-full ${verticalWall === 'c' ? wallActive : wallInactive}`}
        />
        <div
          className={`flex-1 w-0.75 -ml-px rounded-full ${verticalWall === 'd' ? wallActive : wallInactive}`}
        />
      </div>

      {/* 1xx column */}
      <div className="flex flex-col flex-1">
        <div
          className={`border border-l-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-sm ${startPoint === 'A' ? 'border-r-intrusion/60' : ''}`}
        />
        <div className="h-0 relative">
          <div
            className={`absolute inset-x-0 -top-px h-0.75 rounded-full ${horizontalWall === 'ㄷ' ? wallActive : wallInactive}`}
          />
        </div>
        <div
          className={`border border-l-0 border-t-0 border-outline-variant/30 bg-surface-container-lowest/30 flex-1 rounded-sm ${startPoint === 'B' ? 'border-r-intrusion/60' : ''}`}
        />
      </div>

      {/* Entry point indicators */}
      <div className="flex flex-col self-stretch w-4 ml-1">
        <div
          className={`flex-1 flex items-center gap-1.5 transition-opacity duration-300 ${startPoint === 'A' ? 'opacity-100' : 'opacity-10'}`}
        >
          <div className={`w-0.75 h-3 rounded-full ${startPoint === 'A' ? entryActive : 'bg-on-surface/30'}`} />
          <span className={`serif-text text-label-sm font-black ${startPoint === 'A' ? 'text-intrusion' : 'text-on-surface/30'}`}>A</span>
        </div>
        <div
          className={`flex-1 flex items-center gap-1.5 transition-opacity duration-300 ${startPoint === 'B' ? 'opacity-100' : 'opacity-10'}`}
        >
          <div className={`w-0.75 h-3 rounded-full ${startPoint === 'B' ? entryActive : 'bg-on-surface/30'}`} />
          <span className={`serif-text text-label-sm font-black ${startPoint === 'B' ? 'text-intrusion' : 'text-on-surface/30'}`}>B</span>
        </div>
      </div>
    </div>
  )
}
