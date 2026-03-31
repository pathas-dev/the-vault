export const FloatingActions = ({
  actions,
}: {
  actions: { icon: string; label: string; onClick?: () => void }[]
}) => {
  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2">
      {actions.map((action) => (
        <button
          key={action.icon}
          onClick={action.onClick}
          aria-label={action.label}
          title={action.label}
          className="text-on-surface/40 hover:text-primary transition-colors duration-300 p-2 hover:bg-surface-container-high/80 backdrop-blur-sm rounded-sm active:scale-90 group relative"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            aria-hidden="true"
          >
            {action.icon}
          </span>
        </button>
      ))}
    </div>
  )
}
