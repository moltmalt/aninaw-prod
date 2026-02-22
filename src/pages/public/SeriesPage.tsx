import { useParams, Link } from 'react-router-dom';
import { useSeriesData } from '@/hooks/useSeriesData';
import { formatRelativeTime } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function SeriesPage() {
    const { slug } = useParams<{ slug: string }>();
    const { seriesInfo, stories, isLoading, error } = useSeriesData(slug);

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading series</h1>
                <p className="mt-2 text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="pb-16">
            {/* Series Hero (Full width or large) */}
            <header className="relative mb-12 bg-brand-black text-white">
                {isLoading ? (
                    <div className="absolute inset-0 bg-muted/20 animate-pulse" />
                ) : seriesInfo?.cover_image_url && (
                    <div className="absolute inset-0">
                        <img
                            src={seriesInfo.cover_image_url}
                            alt={seriesInfo.title}
                            className="h-full w-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent" />
                    </div>
                )}

                <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center pt-24 pb-20">
                    <Badge variant="secondary" className="mb-6 uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-primary border-none">
                        Special Series
                    </Badge>

                    {isLoading ? (
                        <>
                            <Skeleton className="h-12 w-3/4 mx-auto mb-4 bg-muted/40" />
                            <Skeleton className="h-6 w-1/2 mx-auto bg-muted/40" />
                        </>
                    ) : (
                        <>
                            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                                {seriesInfo?.title}
                            </h1>
                            {seriesInfo?.description && (
                                <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-300">
                                    {seriesInfo.description}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </header>

            {/* Stories List (Numbered cards) */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="font-display text-xl font-bold">Current Episodes / Parts</h2>
                </div>

                {isLoading ? (
                    <SeriesSkeleton />
                ) : stories.length > 0 ? (
                    <div className="space-y-6">
                        {stories.map((story, index) => (
                            <Link
                                key={story.id}
                                to={`/story/${story.slug}`}
                                className="group flex flex-col sm:flex-row gap-6 overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-brand-primary/40"
                            >
                                {/* Number Badge */}
                                <div className="flex shrink-0 items-center justify-center sm:w-24">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold font-display text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                            {story.category}
                                        </Badge>
                                        {story.published_at && (
                                            <time className="text-xs text-muted-foreground">
                                                {formatRelativeTime(story.published_at)}
                                            </time>
                                        )}
                                    </div>
                                    <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-brand-primary">
                                        {story.title}
                                    </h3>
                                    {story.excerpt && (
                                        <p className="mt-2 text-muted-foreground line-clamp-2">
                                            {story.excerpt}
                                        </p>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                {story.cover_image_url && (
                                    <div className="sm:h-32 sm:w-48 shrink-0 overflow-hidden rounded-lg bg-muted hidden sm:block">
                                        <img
                                            src={story.cover_image_url}
                                            alt={story.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-xl font-medium text-muted-foreground">No stories have been published in this series yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SeriesSkeleton() {
    return (
        <div className="space-y-6">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex gap-6 rounded-xl border border-border p-4">
                    <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3 py-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-32 w-48 rounded-lg shrink-0 hidden sm:block" />
                </div>
            ))}
        </div>
    );
}
