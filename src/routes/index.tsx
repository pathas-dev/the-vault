import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Topbar } from '../components/Layout'

export const Route = createFileRoute('/' as any)({
  component: HomeScreen,
})

function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden blueprint-bg w-full">
      <Topbar />
      <main className="flex-1 flex flex-col items-start justify-center px-5 md:px-24 py-10 md:py-20 relative z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-20 hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-primary/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary/30 rounded-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary/40 text-8xl"
              style={{ fontVariationSettings: "'wght' 100" }}
            >
              lock_open
            </span>
          </div>
        </div>

        <div className="max-w-2xl w-full">
          <h1 className="font-headline font-black text-5xl sm:text-6xl md:text-8xl text-primary leading-tight mb-4 md:mb-6 tracking-tighter">
            대도의 <br />
            비밀 장부
          </h1>
          <p className="text-on-surface-variant text-base md:text-xl leading-relaxed mb-8 md:mb-12 max-w-lg border-l-2 border-primary/40 pl-4 md:pl-6 italic">
            조용히 침입하여 최고의 보물을 선점하십시오. 모든 기록은 비밀이며,
            결과는 오직 명성으로 증명됩니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-10 md:mb-24">
            <button
              onClick={() => navigate({ to: '/record' })}
              className="gold-gradient text-on-primary px-8 py-4 md:px-10 md:py-5 rounded-sm font-bold flex items-center justify-center gap-3 text-base md:text-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
              작전 시작
            </button>
            <button className="border border-outline-variant bg-surface-container-low/40 backdrop-blur-md text-primary px-8 py-4 md:px-10 md:py-5 rounded-sm font-bold flex items-center justify-center gap-3 text-base md:text-lg hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined">menu_book</span>
              기밀 문서
            </button>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mt-auto">
          <div className="bg-surface-container-low p-5 md:p-8 rounded-sm relative overflow-hidden group hover:bg-surface-container-high transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl md:text-6xl">
                visibility_off
              </span>
            </div>
            <p className="text-primary text-xs font-bold tracking-[0.2em] mb-1 md:mb-2 uppercase">
              Protocol
            </p>
            <h3 className="font-headline text-lg md:text-2xl text-on-surface">
              프로토콜: 완전 은폐
            </h3>
          </div>
          <div className="bg-surface-container-low p-5 md:p-8 rounded-sm relative overflow-hidden group hover:bg-surface-container-high transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl md:text-6xl">sensors</span>
            </div>
            <p className="text-tertiary text-xs font-bold tracking-[0.2em] mb-1 md:mb-2 uppercase">
              Status
            </p>
            <h3 className="font-headline text-lg md:text-2xl text-on-surface">
              상태: 미탐지
            </h3>
          </div>
          <div className="bg-surface-container-low p-5 md:p-8 rounded-sm relative overflow-hidden group hover:bg-surface-container-high transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl md:text-6xl">
                account_balance_wallet
              </span>
            </div>
            <p className="text-primary-fixed-dim text-xs font-bold tracking-[0.2em] mb-1 md:mb-2 uppercase">
              Assets
            </p>
            <h3 className="font-headline text-lg md:text-2xl text-on-surface">
              자산: 99.8% 회수율
            </h3>
          </div>
        </div>
      </main>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <img
          alt="abstract geometry background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHWEPZEfqgDNU0CqKRlARyDhMqA6qoLNFHlxyHkbtLwjQTPMhY5qNFg8LVtQMqorQ_BlOnMUTjUmpm0IBujdkGcQ6gBHeH646oJBPggC0-hMwGIROF7Ei4BVfnpOMdmEKOVbMMQa-3Jbb7ZFYOKAlBrNm3oOu6DcqIB1ScyFGFpfbITt5fal-D-IrrhgpF48Sh2jnFat3iHIg4ZHqL9e9c6-4WAwOjNooVSq5wF3kriG5C_9t3wMxk2DgjZ_5yrRichHM0O2RYf1n8"
        />
      </div>
    </div>
  )
}
