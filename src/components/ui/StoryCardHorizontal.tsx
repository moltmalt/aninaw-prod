import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Story } from '@/types';
import { cn } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';
import { AuthorLine } from './AuthorLine';

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
            <div className={cn("relative aspect-[4/3] w-28 sm:w-36 shrink-0 overflow-hidden bg-muted rounded-md", imageClassName)}>
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

            <div className="flex flex-col justify-center flex-1 h-full py-1">
                <CategoryBadge category={story.category} className="mb-1.5 w-fit" />
                <h3 className="font-display text-sm sm:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors mb-2">
                    {story.title}
                </h3>
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                    <AuthorLine story={story} showAvatar={false} />
                    {story.reading_time_minutes && (
                        <span className="hidden sm:flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {story.reading_time_minutes}m
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
