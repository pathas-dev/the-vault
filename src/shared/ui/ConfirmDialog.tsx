export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: 'danger' | 'default'
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="dialog-overlay fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="dialog-content relative bg-surface-container-high rounded-sm p-6 md:p-8 shadow-2xl max-w-sm mx-4 space-y-4">
        <h3 className="serif-text text-lg font-black text-primary">{title}</h3>
        <p
          className="text-sm text-on-surface-variant leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br />') }}
        />
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-surface-container-low text-on-surface/60 font-bold text-sm rounded-sm btn-press hover:bg-surface-container"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 font-bold text-sm rounded-sm btn-press ${
              variant === 'danger'
                ? 'bg-error-container text-on-error-container'
                : 'gold-gradient text-on-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
