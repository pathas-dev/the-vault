import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Topbar } from '../components/Layout'

export const Route = createFileRoute('/summary')({
  component: SummaryScreen,
})

function SummaryScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full">
      <Topbar />
      <main className="flex-1 px-6 md:px-12 py-10 md:py-20 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
          <div className="lg:col-span-8">
            <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              Operation: Extraction Complete
            </span>
            <h2 className="noto-serif text-5xl md:text-7xl font-black gold-text-gradient leading-tight mb-8">
              전리품 결산
            </h2>
            <p className="text-on-surface-variant max-w-lg leading-relaxed border-l border-outline-variant/30 pl-6">
              작전이 성공적으로 종료되었습니다. 수집된 모든 자산과 전리품이
              안전 가옥으로 이송되었으며, 최종 기여도에 따른 결산 결과가
              생성되었습니다.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <div className="relative w-full aspect-square max-w-[280px] group">
              <div className="absolute inset-0 gold-gradient rounded-sm opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
              <img
                alt="The Vault Key"
                className="w-full h-full object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgP5CZI58R2xp7GTH5c3Ys1BEYM0OAsdureVTBodlFTcGgzY9r__bTEFe_1bWTqAK7Pe6VQrHRkeBNjovDU-vptUtkzoJM_KvojbGZz5CXkTyuRveI0e9CraR9nqyQ95lDpjqZer9Si4rDcc1VoTRCeFfciaANPhYGFxuAwKF7s8dzQAvlYV11kBxsUyg6mnnOZEw9WyXaJKFppUiSi5PBrFcXLwhHn1P07eo-ibstQIVyoU5qGarhFnP8IYe2g1wiNDEsJcDrnBbr"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface-container-low p-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-9xl">
                military_tech
              </span>
            </div>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mb-4">
              최고 득점
            </p>
            <div className="flex items-baseline gap-2">
              <span className="noto-serif text-4xl font-bold">142</span>
              <span className="text-on-surface-variant text-sm uppercase">
                pts
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-9xl">
                analytics
              </span>
            </div>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mb-4">
              평균 획득
            </p>
            <div className="flex items-baseline gap-2">
              <span className="noto-serif text-4xl font-bold">20.3</span>
              <span className="text-on-surface-variant text-sm uppercase">
                pts
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-9xl">
                task_alt
              </span>
            </div>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mb-4">
              완료 단계
            </p>
            <div className="flex items-baseline gap-2">
              <span className="noto-serif text-4xl font-bold">07</span>
              <span className="text-on-surface-variant text-sm uppercase">
                / 07
              </span>
            </div>
          </div>
        </section>

        <section className="bg-surface-container rounded-sm overflow-hidden mb-16">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
            <h3 className="noto-serif text-lg font-bold tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                grid_view
              </span>
              상세 스코어 리포트
            </h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-highest/30">
                  <th className="p-4 text-[10px] font-bold text-primary tracking-[0.2em] uppercase border-r border-outline-variant/10">
                    Metric
                  </th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase text-center">
                    R1
                  </th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase text-center">
                    R2
                  </th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase text-center">
                    R3
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="p-4 font-medium text-sm border-r border-outline-variant/10">
                    House 01
                  </td>
                  <td className="p-4 text-center noto-serif font-bold text-on-surface">
                    12
                  </td>
                  <td className="p-4 text-center noto-serif font-bold text-on-surface">
                    15
                  </td>
                  <td className="p-4 text-center noto-serif font-bold text-on-surface">
                    08
                  </td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="p-4 font-black text-sm border-r border-outline-variant/10 text-primary uppercase tracking-widest">
                    Grand Total
                  </td>
                  <td
                    className="p-4 text-right noto-serif text-3xl font-black gold-text-gradient pr-8"
                    colSpan={3}
                  >
                    142 PTS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="w-full sm:w-auto px-12 py-4 gold-gradient text-on-primary font-bold text-sm rounded-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10"
          >
            새로운 작전 (New Heist)
          </button>
        </footer>
      </main>
    </div>
  )
}
