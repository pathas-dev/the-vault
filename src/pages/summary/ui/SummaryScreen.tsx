import { useState, useEffect } from 'react'
import { useNavigate, useBlocker } from '@tanstack/react-router'
import type { RoundData } from '@/entities/round'
import { calculateGrandTotal } from '@/entities/round'
import { TOTAL_ROUNDS } from '@/shared/config'
import { ConfirmDialog } from '@/shared/ui'
import { getSavedRounds, clearSavedRounds } from '@/shared/api/storage'
import { RoundCard } from './RoundCard'
import { RoundChart } from './RoundChart'
import { CountUpTotal } from './CountUpTotal'

export function SummaryScreen() {
  const navigate = useNavigate()
  const [rounds, setRounds] = useState<RoundData[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [ceremonyDone, setCeremonyDone] = useState(false)

  // 뒤로가기 차단
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: ({ action }) => action === 'BACK',
    withResolver: true,
    enableBeforeUnload: false,
  })

  useEffect(() => {
    const data = getSavedRounds()
    setRounds(data)

    const total = calculateGrandTotal(data)
    if (total === 0) {
      setCeremonyDone(true)
      return
    }

    // 카운트업 완료 후 ceremonyDone 설정
    const duration = 1200
    const timer = setTimeout(() => {
      setCeremonyDone(true)
    }, duration)
    return () => clearTimeout(timer)
  }, [])

  const handleReset = () => setShowResetConfirm(true)

  const confirmReset = () => {
    clearSavedRounds()
    navigate({ to: '/', search: { round: 1 }, replace: true })
  }

  const grandTotal = calculateGrandTotal(rounds)

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full">
      <main className="flex-1 px-4 md:px-12 py-8 md:py-20 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        {/* 헤더 섹션 */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-8 md:mb-16">
          <div>
            <span className={`text-label-sm font-bold tracking-[0.4em] uppercase mb-2 block transition-colors duration-700 ${ceremonyDone ? 'text-tertiary/80' : 'text-primary/60'}`}>
              {ceremonyDone ? 'Mission Accomplished' : 'Operation Complete'}
            </span>
            <h2 className="noto-serif text-3xl md:text-5xl font-black text-primary leading-tight tracking-tight">
              최종 결산
            </h2>
            {/* 완료 progress bar */}
            <div className="flex items-center gap-1.5 mt-3">
              {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-4 md:w-6 rounded-full bg-tertiary/60 stagger-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="bg-surface-container-high/50 px-5 py-4 md:px-8 md:py-6 rounded-sm">
            <p className="text-label-sm font-bold text-primary/40 uppercase tracking-widest mb-1">
              Total Value
            </p>
            <p className="noto-serif text-3xl md:text-4xl font-black text-primary tabular-nums">
              <CountUpTotal total={grandTotal} />{' '}
              <span className="text-sm tracking-widest">V</span>
            </p>
          </div>
        </section>

        {/* 라운드 트렌드 차트 */}
        {rounds.length > 0 && <RoundChart rounds={rounds} />}

        {/* 라운드 카드 목록 */}
        <div className="space-y-6 md:space-y-12">
          {rounds.map((round, idx) => (
            <RoundCard key={idx} round={round} index={idx} />
          ))}
        </div>

        {/* 데스크탑 액션 버튼 */}
        <footer className="mt-16 hidden md:flex justify-center">
          <button
            onClick={handleReset}
            aria-label="새 작전 시작"
            className="px-12 py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-base rounded-sm btn-press shadow-2xl hover:shadow-primary/20 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>{' '}
            새 작전 시작
          </button>
        </footer>
      </main>

      {/* 모바일 전용 고정 액션 버튼 */}
      <div className="md:hidden fixed inset-x-0 bottom-6 px-4 z-40">
        <button
          onClick={handleReset}
          className="w-full py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-sm rounded-sm btn-press shadow-2xl flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>새
          작전 시작
        </button>
      </div>

      {/* 뒤로가기 차단 다이얼로그 */}
      <ConfirmDialog
        open={status === 'blocked'}
        title="작전 이탈 확인"
        message={"결산 페이지를 벗어납니다.\n이전 화면으로 돌아가시겠습니까?"}
        confirmLabel="이탈"
        cancelLabel="결산 유지"
        onConfirm={() => proceed?.()}
        onCancel={() => reset?.()}
        variant="danger"
      />

      {/* 새 작전 시작 확인 다이얼로그 */}
      <ConfirmDialog
        open={showResetConfirm}
        title="새 작전 시작"
        message={"모든 작전 기록이 삭제됩니다.\n새 작전을 시작하시겠습니까?"}
        confirmLabel="확인"
        cancelLabel="취소"
        onConfirm={confirmReset}
        onCancel={() => setShowResetConfirm(false)}
        variant="default"
      />
    </div>
  )
}
