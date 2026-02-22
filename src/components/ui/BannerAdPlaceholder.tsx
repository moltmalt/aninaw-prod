import { cn } from '@/lib/utils';

interface BannerAdPlaceholderProps {
    className?: string;
    text?: string;
}

export function BannerAdPlaceholder({ className, text = "Advertisement" }: BannerAdPlaceholderProps) {
    return (
        <div className={cn("w-full bg-muted/50 border border-border/60 flex flex-col items-center justify-center p-4 rounded-sm text-muted-foreground", className)}>
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-50 mb-1">
                {text}
            </span>
            <div className="hidden sm:block text-sm opacity-40">
                Put your AdSense code here
            </div>
        </div>
    );
}
