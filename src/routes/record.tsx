import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Topbar } from '../components/Layout'

export const Route = createFileRoute('/record')({
  component: RecordScreen,
})

function RecordScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <Topbar />
      <main className="flex-1 px-6 md:px-12 py-12 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="serif-text text-5xl md:text-6xl font-black text-primary tracking-tight leading-tight mb-4">
                제 01라운드 / 07
              </h1>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-on-surface-variant font-medium text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary/60 text-lg">
                    location_on
                  </span>
                  <span>
                    목표 장소: <span className="text-on-surface">가옥 A</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary/60 text-lg">
                    login
                  </span>
                  <span>
                    침투 지점: <span className="text-on-surface">입구 B</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary/60 text-lg">
                    encrypted
                  </span>
                  <span>
                    보안 설정:{' '}
                    <span className="text-on-surface">
                      [ㄱ, ㄴ, ㄷ] / [a, b]
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/15">
          <div className="grid grid-cols-4 md:grid-cols-6 border-b border-outline-variant/15 bg-surface-container text-xs font-bold uppercase tracking-widest py-4 px-6 text-on-surface-variant">
            <div className="col-span-1 serif-text text-primary">가옥 호수</div>
            <div className="col-span-1 text-center serif-text text-primary">
              보물 01
            </div>
            <div className="col-span-1 text-center serif-text text-primary">
              보물 02
            </div>
            <div className="col-span-1 md:col-span-3 text-right serif-text text-primary">
              상태
            </div>
          </div>
          <div className="divide-y divide-outline-variant/5">
            <div className="grid grid-cols-4 md:grid-cols-6 items-center py-4 px-6 hover:bg-surface-container-high transition-colors">
              <div className="col-span-1 serif-text text-lg font-bold text-on-surface">
                101
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2"
                  placeholder="0"
                  type="number"
                  defaultValue="5"
                />
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2"
                  placeholder="0"
                  type="number"
                  defaultValue="7"
                />
              </div>
              <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                <span className="hidden md:inline-block px-3 py-1 bg-surface-container text-[10px] font-bold text-tertiary rounded uppercase">
                  Secured
                </span>
                <span className="material-symbols-outlined text-tertiary cursor-pointer hover:scale-110 transition-transform">
                  check_circle
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 items-center py-4 px-6 hover:bg-surface-container-high transition-colors">
              <div className="col-span-1 serif-text text-lg font-bold text-on-surface">
                102
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                <span className="material-symbols-outlined text-outline-variant cursor-pointer hover:text-primary transition-colors">
                  radio_button_unchecked
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 items-center py-4 px-6 hover:bg-surface-container-high transition-colors">
              <div className="col-span-1 serif-text text-lg font-bold text-on-surface text-error">
                103
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-error font-bold rounded-sm focus:ring-1 focus:ring-error/40 py-2"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-error font-bold rounded-sm focus:ring-1 focus:ring-error/40 py-2"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                <span className="hidden md:inline-block px-3 py-1 bg-error-container/20 text-[10px] font-bold text-error rounded uppercase">
                  Breached
                </span>
                <span className="material-symbols-outlined text-error cursor-pointer">
                  report_problem
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 items-center py-4 px-6 hover:bg-surface-container-high transition-colors">
              <div className="col-span-1 serif-text text-lg font-bold text-on-surface">
                111
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="col-span-1 px-2">
                <input
                  className="w-full bg-surface-container-lowest border-0 text-center text-primary font-bold rounded-sm focus:ring-1 focus:ring-primary/40 py-2"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                <span className="material-symbols-outlined text-outline-variant cursor-pointer">
                  radio_button_unchecked
                </span>
              </div>
            </div>
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
