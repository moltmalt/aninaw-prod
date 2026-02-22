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
                    ? 'border-border/60 bg-white shadow-sm py-1'
                    : 'border-transparent bg-white py-2'
            )}
        >
            <div className="mx-auto grid h-16 max-w-7xl grid-cols-2 lg:grid-cols-3 items-center px-4 sm:px-6 lg:px-8">
                {/* 1. Left: Logo */}
                <div className="flex justify-start">
                    <Link to="/" className="flex items-center gap-1.5 shrink-0">
                        <span className="font-display text-2xl font-extrabold tracking-tighter text-brand-black uppercase">
                            ANINAW
                        </span>
                        <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:inline mt-1">
                            Productions
                        </span>
                    </Link>
                </div>

                {/* 2. Center: Desktop Nav */}
                <div className="hidden lg:flex justify-center">
                    <nav className="flex items-center gap-6">
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
                                        'text-[13px] font-bold uppercase tracking-widest transition-colors',
                                        isActive
                                            ? 'text-brand-primary'
                                            : 'text-brand-black/70 hover:text-brand-primary'
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 3. Right side: Search + Mobile Menu */}
                <div className="flex items-center justify-end gap-2">
                    {/* Search */}
                    <div className="relative flex items-center justify-end">
                        {searchOpen && (
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search stories..."
                                className="mr-2 w-48 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 sm:w-64"
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
                            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-black transition-colors hover:bg-muted"
                            aria-label={searchOpen ? 'Close search' : 'Open search'}
                        >
                            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-brand-black transition-colors hover:bg-muted lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
