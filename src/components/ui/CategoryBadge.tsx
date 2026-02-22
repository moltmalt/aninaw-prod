import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { StoryCategory } from '@/types';

const categoryColors: Record<StoryCategory, string> = {
    news: 'bg-brand-primary text-white hover:bg-brand-primary/90',
    feature: 'bg-amber-600 text-white hover:bg-amber-700',
    opinion: 'bg-violet-600 text-white hover:bg-violet-700',
    explainer: 'bg-sky-600 text-white hover:bg-sky-700',
    investigative: 'bg-emerald-700 text-white hover:bg-emerald-800',
    multimedia: 'bg-pink-600 text-white hover:bg-pink-700',
};

export function CategoryBadge({ category, className }: { category: StoryCategory; className?: string }) {
    return (
        <Badge
            className={cn(
                'text-[10px] sm:text-xs font-bold uppercase tracking-widest border-0 rounded-sm py-0.5 px-2',
                categoryColors[category],
                className
            )}
        >
            {category}
        </Badge>
    );
}
