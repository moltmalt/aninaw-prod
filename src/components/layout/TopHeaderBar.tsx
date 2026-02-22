import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';
export default function TopHeaderBar() {
    const today = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-white text-muted-foreground py-2 text-xs font-medium border-b border-border/40">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left Side: Social Icons */}
                <div className="flex items-center gap-3">
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-[#1877F2] transition-colors" title="Facebook">
                        <FaFacebook className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-[#E1306C] transition-colors" title="Instagram">
                        <FaInstagram className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-brand-black transition-colors" title="X (Twitter)">
                        <FaXTwitter className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-[#0A66C2] transition-colors" title="LinkedIn">
                        <FaLinkedin className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-[#FF0000] transition-colors" title="YouTube">
                        <FaYoutube className="h-4 w-4" />
                    </a>
                </div>

                {/* Right Side: Date & Contact */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-4 pr-4 border-r border-border/40">
                        <span className="hover:text-brand-black transition-colors cursor-pointer">About</span>
                        <span className="hover:text-brand-black transition-colors cursor-pointer">Contact</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {today}
                    </div>
                </div>
            </div>
        </div>
    );
}
