import { Link, useLocation, useRouter } from '@tanstack/react-router';

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
        <header className="flex justify-between items-center w-full px-6 py-4 max-w-none bg-background shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-50 sticky top-0">
            <div className="text-primary font-headline text-xl font-black uppercase tracking-widest">
                대도의 비밀 장부
            </div>
            <div className="flex items-center gap-6">
                <button className="text-on-surface/60 hover:text-primary transition-colors duration-300">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    );
};

export const MobileNav = () => {
    const location = useLocation();
    
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface/40'}`;
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background flex justify-around items-center py-4 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <Link className={getLinkClass("/")} to="/">
                <span className="material-symbols-outlined">description</span>
                <span className="text-[10px] font-medium">개요</span>
            </Link>
            <Link className={getLinkClass("/record")} to="/record">
                <span className="material-symbols-outlined">inventory_2</span>
                <span className="text-[10px] font-medium">기록</span>
            </Link>
            <div className="relative -top-6">
                <Link to="/record" className="gold-gradient w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-primary/40 border-4 border-background">
                    <span className="material-symbols-outlined text-on-primary text-3xl">add</span>
                </Link>
            </div>
            <Link className={getLinkClass("/summary")} to="/summary">
                <span className="material-symbols-outlined">payments</span>
                <span className="text-[10px] font-medium">결산</span>
            </Link>
        </nav>
    );
};
