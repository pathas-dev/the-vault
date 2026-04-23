import { useState, useEffect } from 'react'
import { FloatingActions } from '@/shared/layout'
import { TOTAL_ROUNDS } from '@/shared/config'
import { isFormValid } from '@/shared/lib/validation'
import { useConfetti } from '@/shared/lib'
import { ConfirmDialog } from '@/shared/ui'
import { FloorPlan } from './FloorPlan'
import { VaultValueTable } from './VaultValueTable'
import { MobileNumpad } from './MobileNumpad'
import { HistoryPanel } from './HistoryPanel'
import { RoundHeader } from './RoundHeader'
import { useRoundState } from '../model/round-state'
import { useKeyboardNavigation } from '../model/keyboard-nav'

export function RecordScreen() {
  const state = useRoundState()
  const { handleKeyDown } = useKeyboardNavigation()
  const { fire: fireConfetti } = useConfetti()
  const [roundFlash, setRoundFlash] = useState(false)
  const [isVaultMasked, setIsVaultMasked] = useState(false)

  const formValid = isFormValid(state.selectedVaults, state.vaultValues)

  // 진입 시 매번 마스킹 상태로 초기화
  useEffect(() => {
    if (state.viewMode === 'summary') {
      setIsVaultMasked(true)
    } else {
      setIsVaultMasked(false)
    }
  }, [state.viewMode, state.currentRound])

  const handleNextRound = () => {
    if (state.isFinalRound) {
      void fireConfetti()
    } else {
      setRoundFlash(true)
      setTimeout(() => setRoundFlash(false), 600)
    }
    state.handleNextRound()
  }

  const handleHWallToggle = (value: string) => {
    state.setHorizontalWall(value === '__clear__' ? null : value as 'ㄱ' | 'ㄴ')
  }

  const handleVWallToggle = (value: string) => {
    state.setVerticalWall(value === '__clear__' ? null : value as 'a' | 'b' | 'c' | 'd')
  }

  return (
    <div className={`flex-1 flex flex-col w-full min-w-0 ${roundFlash ? 'round-flash' : ''}`}>
      <FloatingActions
        actions={[
          { icon: 'history', label: '작전 이력 보기', onClick: state.toggleHistory },
        ]}
      />

      <HistoryPanel
        isOpen={state.isHistoryOpen}
        rounds={state.historyRounds}
        onClose={state.closeHistory}
      />

      <main className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full pb-24 md:pb-12 text-on-surface">
        <RoundHeader
          currentRound={state.currentRound}
          totalRounds={TOTAL_ROUNDS}
          viewMode={state.viewMode}
          horizontalWall={state.horizontalWall}
          verticalWall={state.verticalWall}
          startPoint={state.startPoint}
        />

        {/* 금고 배치도 (Vault Floor Plan) */}
        {state.viewMode === 'input' && (
          <FloorPlan
            selectedVaults={state.selectedVaults}
            horizontalWall={state.horizontalWall}
            verticalWall={state.verticalWall}
            startPoint={state.startPoint}
            onVaultToggle={state.toggleVault}
            onHWallToggle={handleHWallToggle}
            onVWallToggle={handleVWallToggle}
            onStartPointChange={state.setStartPoint}
          />
        )}

        {/* 은닉 가치 입력 / 결산 */}
        {(state.viewMode === 'summary' || state.selectedVaults.length > 0) && (
          <VaultValueTable
            viewMode={state.viewMode}
            selectedVaults={state.selectedVaults}
            vaultValues={state.vaultValues}
            isMobile={state.isMobile}
            numpadTarget={state.numpadTarget}
            onValueChange={state.handleVaultValueChange}
            onNumpadOpen={(vault, index) =>
              state.setNumpadTarget({ vault, index })
            }
            onKeyDown={handleKeyDown}
            isMasked={isVaultMasked}
            onMaskToggle={state.viewMode === 'summary' ? () => setIsVaultMasked(!isVaultMasked) : undefined}
          />
        )}

        <section className="mt-12 md:mt-16 hidden md:flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-container rounded blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            {state.viewMode === 'input' ? (
              <button
                onClick={state.handlePhaseSubmit}
                disabled={!formValid}
                className={`relative flex items-center gap-4 px-12 py-5 ${formValid ? 'bg-linear-to-br from-primary to-primary-container text-on-primary shadow-xl hover:shadow-2xl hover:shadow-primary/20 btn-press' : 'bg-surface-container-highest text-on-surface/10 cursor-not-allowed opacity-40'} text-lg font-black rounded-sm tracking-widest`}
              >
                <span className="material-symbols-outlined text-xl">
                  {formValid ? 'verified_user' : 'lock'}
                </span>{' '}
                작전 기록 확정
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className={`relative flex items-center gap-4 px-12 py-5 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary text-lg font-black rounded-sm shadow-xl hover:shadow-2xl btn-press tracking-widest transition-all duration-700 ${
                  isVaultMasked
                    ? 'shadow-[0_0_25px_rgba(255,198,55,0.45)] blur-[0.6px] brightness-110'
                    : ''
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {state.isFinalRound ? 'analytics' : 'near_me'}
                </span>{' '}
                {state.isFinalRound ? '최종 장부 정리' : '다음 작전'}
              </button>
            )}
          </div>
        </section>
      </main>

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40">
        {state.numpadTarget && state.viewMode === 'input' ? (
          <MobileNumpad
            target={state.numpadTarget}
            currentValue={state.vaultValues[state.numpadTarget.vault][state.numpadTarget.index]}
            error={state.numpadError}
            onDigit={state.handleNumpadDigit}
            onBackspace={state.handleNumpadBackspace}
            onConfirm={state.handleNumpadConfirm}
            onClose={() => state.setNumpadTarget(null)}
          />
        ) : (
          <div className="px-4 pb-6">
            {state.viewMode === 'input' ? (
              <button
                onClick={state.handlePhaseSubmit}
                disabled={!formValid}
                className={`w-full flex items-center justify-center gap-3 py-4 font-black text-base rounded-sm shadow-xl ${formValid ? 'bg-linear-to-br from-primary to-primary-container text-on-primary btn-press' : 'bg-surface-container-highest text-on-surface/20 opacity-50'}`}
              >
                <span className="material-symbols-outlined text-lg">
                  {formValid ? 'verified_user' : 'lock'}
                </span>{' '}
                작전 기록 확정
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className={`w-full flex items-center justify-center gap-3 py-4 bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary font-black text-base rounded-sm shadow-xl btn-press transition-all duration-700 ${
                  isVaultMasked
                    ? 'shadow-[0_0_20px_rgba(255,198,55,0.4)] blur-[0.5px]'
                    : ''
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {state.isFinalRound ? 'analytics' : 'near_me'}
                </span>{' '}
                {state.isFinalRound ? '최종 장부 정리' : '다음 작전'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 내비게이션 차단 확인 다이얼로그 */}
      <ConfirmDialog
        open={state.blockerStatus === 'blocked'}
        title="작전 이탈 확인"
        message="입력 중인 데이터가 사라집니다.\n정말 이탈하시겠습니까?"
        confirmLabel="이탈"
        cancelLabel="계속 작전"
        onConfirm={() => state.blockerProceed?.()}
        onCancel={() => state.blockerReset?.()}
        variant="danger"
      />



      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] blueprint-bg"
      ></div>
    </div>
  )
}
