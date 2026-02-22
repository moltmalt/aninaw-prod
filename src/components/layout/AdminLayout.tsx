import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Image,
    Settings,
    LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const sidebarLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/stories', label: 'Stories', icon: FileText },
    { to: '/admin/media', label: 'Media', icon: Image },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
    const location = useLocation();
    const signOut = useAuthStore((s) => s.signOut);

    return (
        <div className="dark flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="flex w-60 flex-col border-r border-border bg-card">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link to="/admin" className="flex items-center gap-2">
                        <span className="font-display text-xl font-bold text-brand-primary">
                            Aninaw
                        </span>
                        <span className="rounded bg-brand-primary/10 px-1.5 py-0.5 text-xs font-semibold text-brand-primary">
                            Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex flex-1 flex-col gap-1 p-4">
                    {sidebarLinks.map(({ to, label, icon: Icon }) => {
                        const isActive =
                            to === '/admin'
                                ? location.pathname === '/admin'
                                : location.pathname.startsWith(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-border p-4">
                    <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col">
                <header className="flex h-16 items-center border-b border-border px-6">
                    <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
