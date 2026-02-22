import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
    LayoutDashboard,
    FileText,
    UploadCloud,
    Users,
    Tags,
    Settings,
    Activity,
    LogOut,
    Menu,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
    const { user, signOut } = useAuthStore();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Stories', path: '/admin/stories', icon: FileText },
        { name: 'Import', path: '/admin/import', icon: UploadCloud },
        { name: 'Authors', path: '/admin/authors', icon: Users },
        { name: 'Taxonomy', path: '/admin/taxonomy', icon: Tags },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
        { name: 'Audit Log', path: '/admin/audit', icon: Activity },
    ];

    // Helper to get a generic page title from path
    const getPageTitle = () => {
        const currentPath = location.pathname;
        if (currentPath === '/admin') return 'Dashboard';
        const match = navItems.find(item => currentPath.startsWith(item.path) && item.path !== '/admin');
        if (match) return match.name;
        if (currentPath.includes('/admin/stories/new')) return 'New Story';
        return 'Admin Portal';
    };

    return (
        <div className="flex min-h-screen bg-muted/10 dark:bg-background">
            {/* Sidebar */}
            <aside
                className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-[72px]'
                    }`}
            >
                <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mr-2"
                        title="Toggle Sidebar"
                    >
                        <Menu className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    {isSidebarOpen && (
                        <a href="/admin" className="font-display text-xl font-bold italic tracking-tighter">
                            Aninaw.
                        </a>
                    )}
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin'} // strict match only for dashboard root
                            className={({ isActive }) => `
                                flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                                ${isActive
                                    ? 'bg-brand-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }
                            `}
                            title={!isSidebarOpen ? item.name : undefined}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {isSidebarOpen && <span>{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-border p-3">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary font-bold uppercase shrink-0">
                                {user?.email?.[0] || 'A'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-medium leading-none text-foreground">
                                    {(user?.user_metadata?.first_name || user?.email?.split('@')[0]) || 'Admin'}
                                </p>
                                <p className="truncate text-xs text-muted-foreground mt-1">
                                    {user?.email}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out" className="shrink-0 h-8 w-8">
                                <LogOut className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-full flex justify-center py-2"
                            onClick={() => signOut()}
                            title="Sign out"
                        >
                            <LogOut className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-8 shadow-sm z-10">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold font-display">{getPageTitle()}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-primary ring-2 ring-card" />
                        </Button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
