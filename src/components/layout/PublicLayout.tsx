import { Outlet, Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="border-b border-border bg-card">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <span className="font-display text-2xl font-bold text-brand-primary">
                        Aninaw
                    </span>
                    <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
                        Productions
                    </span>
                </Link>
                <nav className="hidden items-center gap-6 md:flex">
                    <Link to="/stories" className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary">
                        Stories
                    </Link>
                    <Link to="/about" className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary">
                        About
                    </Link>
                    <Link to="/contact" className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary">
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Aninaw Productions. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Cebu-based alternative media &amp; journalism
                    </p>
                </div>
            </div>
        </footer>
    );
}

export function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
