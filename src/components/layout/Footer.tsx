import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert({ email: email.trim(), is_active: true } as never);

            if (error) {
                if (error.code === '23505') {
                    setMessage('You\'re already subscribed!');
                    setStatus('success');
                } else {
                    throw error;
                }
            } else {
                setMessage('Thanks for subscribing!');
                setStatus('success');
                setEmail('');
            }
        } catch {
            setMessage('Something went wrong. Try again.');
            setStatus('error');
        }

        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 4000);
    };

    return (
        <footer className="border-t border-border bg-foreground text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
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

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                            Stay Updated
                        </h4>
                        <p className="mt-3 text-sm text-white/60">
                            Get the latest stories delivered to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-primary text-white transition-colors hover:bg-brand-primary-light disabled:opacity-50"
                                aria-label="Subscribe"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                        {message && (
                            <p
                                className={`mt-2 text-xs ${status === 'error' ? 'text-red-400' : 'text-green-400'
                                    }`}
                            >
                                {message}
                            </p>
                        )}
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
