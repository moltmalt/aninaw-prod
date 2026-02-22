import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/category/news', label: 'News' },
    { to: '/category/feature', label: 'Features' },
    { to: '/category/opinion', label: 'Opinion' },
    { to: '/about', label: 'About' },
];

export default function Header() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 20);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full border-b transition-all duration-300',
                scrolled
                    ? 'border-border/60 bg-white/95 shadow-sm backdrop-blur-md py-0'
                    : 'border-transparent bg-white py-1'
            )}
        >
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1.5 shrink-0">
                    <span className="font-display text-xl font-extrabold tracking-tight text-brand-primary">
                        ANINAW
                    </span>
                    <span className="hidden text-[11px] font-medium uppercase tracking-widest text-muted-foreground sm:inline">
                        Productions
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map(({ to, label }) => {
                        const isActive =
                            to === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-brand-primary'
                                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side: Search + Mobile Menu */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative flex items-center">
                        {searchOpen && (
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search stories..."
                                className="mr-1 w-48 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 sm:w-64"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setSearchOpen(false);
                                        setSearchQuery('');
                                    }
                                }}
                            />
                        )}
                        <button
                            onClick={() => {
                                setSearchOpen(!searchOpen);
                                if (searchOpen) setSearchQuery('');
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={searchOpen ? 'Close search' : 'Open search'}
                        >
                            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-muted hover:text-foreground md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile nav dropdown */}
            {mobileMenuOpen && (
                <div className="border-t border-border bg-white px-4 py-3 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map(({ to, label }) => {
                            const isActive =
                                to === '/'
                                    ? location.pathname === '/'
                                    : location.pathname.startsWith(to);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={cn(
                                        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-brand-primary/5 text-brand-primary'
                                            : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
