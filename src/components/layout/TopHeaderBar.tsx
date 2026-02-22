import { Facebook, Instagram, Twitter, Linkedin, Youtube, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopHeaderBar() {
    const today = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-brand-black text-white/90 py-1.5 text-xs font-medium">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left Side: Date and Utility Links */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-white/60">📅</span>
                        {today}
                    </div>
                    <div className="hidden sm:flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
                        <Link to="/about" className="hover:text-white transition-colors">Advertisement</Link>
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>

                {/* Right Side: Social Icons */}
                <div className="flex items-center gap-2.5">
                    <a href="#" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity" title="Facebook">
                        <Facebook className="h-3 w-3" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white hover:opacity-80 transition-opacity" title="Instagram">
                        <Instagram className="h-3 w-3" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity" title="Twitter">
                        <Twitter className="h-3 w-3" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity" title="LinkedIn">
                        <Linkedin className="h-3 w-3" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF0000] text-white hover:opacity-80 transition-opacity" title="YouTube">
                        <Youtube className="h-3 w-3" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E60023] text-white hover:opacity-80 transition-opacity" title="RSS">
                        <Rss className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}
