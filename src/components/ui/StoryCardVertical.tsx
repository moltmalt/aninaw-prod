import { Link } from 'react-router-dom';

import type { Story } from '@/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface StoryCardVerticalProps {
    story: Story;
    className?: string;
    showExcerpt?: boolean;
}

export function StoryCardVertical({ story, className, showExcerpt = false }: StoryCardVerticalProps) {
    return (
        <Link
            to={`/story/${story.slug}`}
            className={cn("group flex flex-col overflow-hidden transition-all", className)}
        >
            <div className="relative aspect-video w-full overflow-hidden bg-muted mb-3 rounded-2xl">
                {story.cover_image_url ? (
                    <img
                        src={story.cover_image_url}
                        alt={story.cover_image_alt ?? story.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <span className="text-3xl font-bold text-muted-foreground/20 font-display uppercase tracking-widest">{story.category}</span>
                    </div>
                )}
                {/* Optional floating badge could go here if requested */}
            </div>

            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    <span>{story.category}</span>
                    {story.published_at && (
                        <>
                            <span className="text-[10px] opacity-60">•</span>
                            <time>{formatRelativeTime(story.published_at)}</time>
                        </>
                    )}
                </div>
                <h3 className="font-display text-lg font-bold leading-snug group-hover:text-brand-primary transition-colors mb-2">
                    {story.title}
                </h3>
                {showExcerpt && story.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {story.excerpt}
                    </p>
                )}
            </div>
        </Link>
    );
}
