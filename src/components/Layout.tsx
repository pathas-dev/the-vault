import { Link, useLocation } from '@tanstack/react-router';

export const Sidebar = () => {
    const location = useLocation();
    
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        const baseClass = "flex items-center gap-3 px-6 py-3 font-medium text-sm transition-all duration-200";
        if (isActive) {
            return `${baseClass} text-primary border-l-2 border-primary bg-gradient-to-r from-primary/10 to-transparent translate-x-1`;
        }
        return `${baseClass} text-on-surface/40 hover:text-on-surface/80 hover:bg-surface-container-low`;
    };

    return (
        <aside className="hidden md:flex flex-col h-screen w-64 py-8 bg-background sticky top-0 shrink-0 z-40">
            <div className="px-6 mb-12">
                <h2 className="text-primary font-headline text-lg font-black uppercase tracking-widest">The Vault</h2>
                <p className="text-on-surface/40 text-xs mt-1">Stealth Mode Active</p>
            </div>
            <nav className="flex-1 space-y-2">
                <Link className={getLinkClass("/")} to="/">
                    <span className="material-symbols-outlined mr-3">description</span>
                    작전 개요
                </Link>
                <Link className={getLinkClass("/record")} to="/record">
                    <span className="material-symbols-outlined mr-3">inventory_2</span>
                    전리품 기록
                </Link>
                <Link className={getLinkClass("/summary")} to="/summary">
                    <span className="material-symbols-outlined mr-3">payments</span>
                    최종 결산
                </Link>
            </nav>
            <div className="px-6 mt-auto">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                    <div className="w-8 h-8 rounded-sm overflow-hidden bg-primary-container/20 flex items-center justify-center border border-outline-variant/20">
                        <span className="material-symbols-outlined text-primary text-sm">person</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface uppercase">Master Thief</p>
                        <p className="text-[10px] text-on-surface-variant">Rank: S-Class</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export const Topbar = () => {
    return (
        <header className="flex justify-between items-center w-full px-4 md:px-6 py-3 md:py-4 max-w-none bg-background/95 backdrop-blur-sm shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-50 sticky top-0">
            <div className="text-primary font-headline text-base md:text-xl font-black uppercase tracking-widest leading-none">
                대도의 비밀 장부
            </div>
            <div className="flex items-center gap-4">
                <button className="text-on-surface/60 hover:text-primary transition-colors duration-300 p-1 -mr-1">
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                </button>
            </div>
        </header>
    );
};


