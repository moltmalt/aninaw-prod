import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const categoryLinks = [
    { to: '/category/news', label: 'News' },
    { to: '/category/feature', label: 'Features' },
    { to: '/category/opinion', label: 'Opinion' },
    { to: '/category/explainer', label: 'Explainers' },
    { to: '/category/investigative', label: 'Investigative' },
];

const companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
];

const socialLinks = [
    { href: 'https://facebook.com/aninawproductions', icon: Facebook, label: 'Facebook' },
    { href: 'https://instagram.com/aninawproductions', icon: Instagram, label: 'Instagram' },
    { href: 'https://youtube.com/@aninawproductions', icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-foreground text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="inline-block">
                            <span className="font-display text-xl font-extrabold tracking-tight text-brand-primary-light">
                                ANINAW
                            </span>
                            <span className="ml-1.5 text-[11px] font-medium uppercase tracking-widest text-white/50">
                                Productions
                            </span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-white/60">
                            Cebu-based alternative media and journalism. Independent storytelling
                            that centers community voices.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            {socialLinks.map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-brand-primary hover:text-white"
                                    aria-label={label}
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                            Categories
                        </h4>
                        <ul className="mt-3 space-y-2">
                            {categoryLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-white/60 transition-colors hover:text-white"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                            Company
                        </h4>
                        <ul className="mt-3 space-y-2">
                            {companyLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-white/60 transition-colors hover:text-white"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} Aninaw Productions. All rights reserved.
                    </p>
                    <p className="hidden text-xs text-white/40 sm:block">
                        Independent journalism from Cebu, Philippines
                    </p>
                </div>
            </div>
        </footer>
    );
}
