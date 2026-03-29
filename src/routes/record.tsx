import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Topbar } from '../components/Layout'

const HOUSE_NUMBERS = [
  '101', '102', '103', '111', '112', '113', 
  '201', '202', '203', '211', '212', '213', 
  '301', '302', '303', '304', '401'
]

export const Route = createFileRoute('/record')({
  component: RecordScreen,
})

function RecordScreen() {
  const navigate = useNavigate()
  const [targetHouse, setTargetHouse] = useState('A')
  const [startPoint, setStartPoint] = useState('A')
  const [horizontalWall, setHorizontalWall] = useState<string | null>(null)
  const [verticalWall, setVerticalWall] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <Topbar />
      <main className="flex-1 px-6 md:px-12 py-12 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-4xl w-full">
              <h1 className="serif-text text-5xl md:text-6xl font-black text-primary tracking-tight leading-tight mb-8">
                제 01라운드 / 07
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-on-surface-variant">
                {/* 터는 집 셀렉트 */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    터는 집 (Target)
                  </label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map(house => (
                      <button
                        key={house}
                        onClick={() => setTargetHouse(house)}
                        className={`flex-1 py-2 text-sm font-bold transition-all rounded-sm border ${
                          targetHouse === house 
                            ? 'bg-primary text-on-primary border-primary' 
                            : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'
                        }`}
                      >
                        {house}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 시작 위치 셀렉트 */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">login</span>
                    시작 위치 (Start)
                  </label>
                  <div className="flex gap-2">
                    {['A', 'B'].map(point => (
                      <button
                        key={point}
                        onClick={() => setStartPoint(point)}
                        className={`flex-1 py-2 text-sm font-bold transition-all rounded-sm border ${
                          startPoint === point 
                            ? 'bg-linear-to-br from-primary to-primary-container text-on-primary border-primary' 
                            : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/40'
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 벽 위치 중첩 셀렉트 */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">encrypted</span>
                    벽 위치 (Security)
                  </label>
                  <div className="grid grid-cols-2 gap-4 content-stretch">
                    {/* 가로 벽 (ㄱ, ㄴ, ㄷ) - 가로로 길게, 전체 높이는 세로 블록에 맞춤 */}
                    <div className="flex flex-col gap-1 justify-stretch">
                      {['ㄱ', 'ㄴ', 'ㄷ'].map(w => (
                        <button
                          key={w}
                          onClick={() => setHorizontalWall(horizontalWall === w ? null : w)}
                          className={`flex-1 w-full min-h-[32px] text-xs font-bold transition-all rounded-sm border ${
                            horizontalWall === w 
                              ? 'bg-tertiary text-on-tertiary border-tertiary shadow-[0_0_15px_rgba(241,201,125,0.3)]' 
                              : 'bg-surface-container-low text-on-surface/40 border-outline-variant/10 hover:border-primary/20'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-3">
                             <div className={`h-0.5 w-8 ${horizontalWall === w ? 'bg-on-tertiary' : 'bg-on-surface/20'}`}></div>
                             {w}
                          </div>
                        </button>
                      ))}
                    </div>
                    {/* 세로 벽 (a, b) - 위아래로 긴 블록 */}
                    <div className="flex gap-1 items-stretch">
                      {['a', 'b'].map(w => (
                        <button
                          key={w}
                          onClick={() => setVerticalWall(verticalWall === w ? null : w)}
                          className={`flex-1 py-10 text-xs font-bold transition-all rounded-sm border border-dashed ${
                            verticalWall === w 
                              ? 'bg-tertiary text-on-tertiary border-tertiary shadow-[0_0_15px_rgba(241,201,125,0.3)] border-solid' 
                              : 'bg-surface-container-low text-on-surface/40 border-outline-variant/20 hover:border-primary/20'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                             <div className={`w-0.5 h-8 ${verticalWall === w ? 'bg-on-tertiary' : 'bg-on-surface/20'}`}></div>
                             {w}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 shadow-2xl">
          <div className="grid grid-cols-4 md:grid-cols-5 border-b border-outline-variant/15 bg-surface-container-high text-[10px] font-bold uppercase tracking-widest py-4 px-6 text-primary">
            <div className="serif-text">가옥 호수</div>
            <div className="text-center serif-text">가치 01 (20~100)</div>
            <div className="text-center serif-text">가치 02 (20~100)</div>
            <div className="hidden md:block text-right md:col-span-2 serif-text">기록</div>
          </div>
          <div className="divide-y divide-outline-variant/5 max-h-150 overflow-y-auto custom-scrollbar">
            {HOUSE_NUMBERS.map(house => (
              <div key={house} className="grid grid-cols-4 md:grid-cols-5 items-center py-4 px-6 hover:bg-surface-container-high transition-colors group">
                <div className="serif-text text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {house}
                </div>
                <div className="px-2">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2 outline-none transition-all placeholder:text-on-surface/10"
                    placeholder="None"
                    type="number"
                    min="20"
                    max="100"
                  />
                </div>
                <div className="px-2">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2 outline-none transition-all placeholder:text-on-surface/10"
                    placeholder="None"
                    type="number"
                    min="20"
                    max="100"
                  />
                </div>
                <div className="hidden md:flex md:col-span-2 justify-end gap-2">
                  <span className="material-symbols-outlined text-on-surface/20 cursor-pointer hover:text-primary transition-colors">
                    radio_button_unchecked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-container rounded blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={() => navigate({ to: '/summary' })}
              className="relative flex items-center gap-4 px-12 py-6 bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-black rounded-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="serif-text">
                단계 결과 확보 (Secure Phase Results)
              </span>
              <span className="material-symbols-outlined font-bold">
                lock_open
              </span>
            </button>
          </div>
          <p className="mt-6 text-on-surface-variant text-sm font-medium tracking-widest opacity-60">
            MISSION PHASE 01 OF 07
          </p>
        </section>
      </main>
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBahMjspscmOlRydFeZiCVATXkfw6pEATu-kblpB4U_8PQEydTQeB7dqX-cofBN8Rj1D8nGIP-tDvL1Bzbv6cFxQYognCmXh74BugeJs97eBtH25zbnPZY3x6hf1VbkImgJ68Uw0RG9YP2o7mWGrFtXPMWBntot6cYMJaFv1jPE_A1BveuEzGHoSZqbR-0DCc9_BDp26do3lzs4mYICAdE7PIunrll4h4At9pxGYAoLyB8kWVnmcihNFo80yPv_Vf_3kPRHg0l3ZfBZ')",
        }}
      ></div>
    </div>
  )
}
