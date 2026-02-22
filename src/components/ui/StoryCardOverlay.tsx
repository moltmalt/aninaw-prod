import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Story } from '@/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface StoryCardOverlayProps {
    story: Story;
    className?: string;
}

export function StoryCardOverlay({ story, className }: StoryCardOverlayProps) {
    return (
        <Link
            to={`/story/${story.slug}`}
            className={cn("group relative block overflow-hidden rounded-3xl bg-brand-black", className)}
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
            <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-brand-primary text-brand-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {story.category}
                    </span>
                    {story.published_at && (
                        <span className="flex items-center gap-1.5 text-white/90 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            {formatRelativeTime(story.published_at)}
                        </span>
                    )}
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white group-hover:text-brand-primary hover:underline decoration-2 underline-offset-4 transition-all max-w-4xl">
                    {story.title}
                </h2>
            </div>
        </Link>
    );
}
