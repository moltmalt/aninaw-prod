import { cn } from '@/lib/utils';
import type { StoryCategory } from '@/types';

export function CategoryBadge({ category, className }: { category: StoryCategory; className?: string }) {
    return (
        <span
            className={cn(
                'text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-primary',
                className
            )}
        >
            {category}
        </span>
    );
}
