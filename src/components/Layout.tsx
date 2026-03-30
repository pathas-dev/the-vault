import { Link, useLocation } from '@tanstack/react-router'

export const Sidebar = () => {
  const location = useLocation()

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path
    const baseClass =
      'flex items-center gap-3 px-6 py-3 font-medium text-sm transition-all duration-200'
    if (isActive) {
      return `${baseClass} text-primary border-l-2 border-primary bg-gradient-to-r from-primary/10 to-transparent translate-x-1`
    }
    return `${baseClass} text-on-surface/40 hover:text-on-surface/80 hover:bg-surface-container-low`
  }

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 py-8 bg-background sticky top-0 shrink-0 z-40">
      <div className="px-6 mb-12">
        <h2 className="text-primary font-headline text-lg font-black uppercase tracking-widest">
          The Vault
        </h2>
        <p className="text-on-surface/40 text-xs mt-1">Stealth Mode Active</p>
      </div>
      <nav className="flex-1 space-y-2">
        <Link className={getLinkClass('/')} to="/" aria-label="작전 개요">
          <span className="material-symbols-outlined mr-3">description</span>
          작전 개요
        </Link>
        <Link
          className={getLinkClass('/record')}
          to="/record"
          aria-label="전리품 기록"
        >
          <span className="material-symbols-outlined mr-3">inventory_2</span>
          전리품 기록
        </Link>
        <Link
          className={getLinkClass('/summary')}
          to="/summary"
          aria-label="최종 결산"
        >
          <span className="material-symbols-outlined mr-3">payments</span>
          최종 결산
        </Link>
      </nav>
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-sm">
          <div className="w-8 h-8 rounded-sm overflow-hidden flex justify-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-sm">
              person
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase">Master Thief</p>
            <p className="text-label-sm text-on-surface-variant">
              Rank: S-Class
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

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
