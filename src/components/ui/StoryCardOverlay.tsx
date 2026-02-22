import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Story } from '@/types';
import { cn } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';
import { AuthorLine } from './AuthorLine';

interface StoryCardOverlayProps {
    story: Story;
    className?: string;
}

export function StoryCardOverlay({ story, className }: StoryCardOverlayProps) {
    return (
        <Link
            to={`/story/${story.slug}`}
            className={cn("group relative block overflow-hidden rounded-xl bg-brand-black", className)}
        >
            <div className="absolute inset-0 z-0">
                {story.cover_image_url ? (
                    <img
                        src={story.cover_image_url}
                        alt={story.cover_image_alt ?? story.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-brand-primary/20 to-brand-black" />
                )}
            </div>

            {/* Gradient Darkening Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 flex flex-col justify-end">
                <CategoryBadge category={story.category} className="w-fit mb-3" />

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white mb-4 group-hover:text-brand-primary hover:underline decoration-2 underline-offset-4 transition-all">
                    {story.title}
                </h2>

                <div className="flex items-center gap-4 text-white/80">
                    <AuthorLine story={story} className="text-white/80" />
                    {story.reading_time_minutes && (
                        <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
                            <Clock className="h-3.5 w-3.5 opacity-70" />
                            {story.reading_time_minutes} min read
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
