import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';
export default function TopHeaderBar() {
    const today = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-brand-black text-white/90 py-1.5 text-xs font-medium">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left Side: Date */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        {today}
                    </div>
                </div>

                {/* Right Side: Social Icons */}
                <div className="flex items-center gap-2.5">
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-[#1877F2] hover:opacity-80 transition-opacity" title="Facebook">
                        <FaFacebook className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-[#E1306C] hover:opacity-80 transition-opacity" title="Instagram">
                        <FaInstagram className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-white hover:opacity-80 transition-opacity" title="X (Twitter)">
                        <FaXTwitter className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-[#0A66C2] hover:opacity-80 transition-opacity" title="LinkedIn">
                        <FaLinkedin className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-5 w-5 items-center justify-center text-[#FF0000] hover:opacity-80 transition-opacity" title="YouTube">
                        <FaYoutube className="h-4 w-4 text-[#FF0000]" />
                    </a>
                </div>
            </div>
        </div>
    );
}
