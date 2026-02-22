import { Link } from 'react-router-dom';

import type { Story } from '@/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface StoryCardHorizontalProps {
    story: Story;
    className?: string;
    imageClassName?: string;
}

export function StoryCardHorizontal({ story, className, imageClassName }: StoryCardHorizontalProps) {
    return (
        <Link
            to={`/story/${story.slug}`}
            className={cn("group flex items-start gap-4 transition-all hover:bg-muted/30 rounded-lg p-2 -mx-2", className)}
        >
            <div className={cn("relative aspect-[4/3] w-28 sm:w-36 shrink-0 overflow-hidden bg-muted rounded-xl", imageClassName)}>
                {story.cover_image_url ? (
                    <img
                        src={story.cover_image_url}
                        alt={story.cover_image_alt ?? story.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <span className="text-xs font-bold text-muted-foreground/30 font-display uppercase tracking-widest">{story.category.slice(0, 3)}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 h-full py-0 sm:py-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    <span>{story.category}</span>
                    {story.published_at && (
                        <>
                            <span className="text-[10px] opacity-60">•</span>
                            <time>{formatRelativeTime(story.published_at)}</time>
                        </>
                    )}
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold leading-snug line-clamp-2 sm:line-clamp-3 group-hover:text-brand-primary transition-colors">
                    {story.title}
                </h3>
            </div>
        </Link>
    );
}
