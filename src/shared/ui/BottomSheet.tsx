interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  return (
    <>
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
          <div className="bottom-sheet absolute bottom-0 left-0 right-0 max-h-[85vh] bg-surface-container-high/95 backdrop-blur-[20px] rounded-t-xl shadow-2xl overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-on-surface/20" />
            </div>
            {title && (
              <div className="px-4 pb-3">
                <h3 className="serif-text text-sm font-bold text-primary">{title}</h3>
              </div>
            )}
            <div className="px-4 pb-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
