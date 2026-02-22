import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTagData } from '@/hooks/useTagData';
import type { CategorySortOption } from '@/hooks/useCategoryData';
import { formatRelativeTime } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function TagPage() {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<CategorySortOption>('latest');

    const {
        tagInfo,
        stories,
        totalPages,
        isLoading,
        error
    } = useTagData(slug, page, sort);

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading tag</h1>
                <p className="mt-2 text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 text-center">
                <h1 className="font-display text-4xl font-bold sm:text-5xl">
                    #{tagInfo?.name || slug}
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Stories tagged with {tagInfo?.name || slug}
                </p>
            </header>

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold">All Stories</h2>
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value as CategorySortOption);
                            setPage(1);
                        }}
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background cursor-pointer"
                    >
                        <option value="latest">Latest</option>
                        <option value="popular">Most Read</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                {isLoading ? (
                    <TagSkeleton />
                ) : stories.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {stories.map((story) => (
                                <Link key={story.id} to={`/story/${story.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        {story.cover_image_url ? (
                                            <img
                                                src={story.cover_image_url}
                                                alt={story.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-muted/50" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-display text-lg font-bold leading-tight group-hover:text-brand-primary line-clamp-3">
                                            {story.title}
                                        </h3>
                                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="truncate max-w-[120px]">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {(story as any).authors?.name || 'Staff'}
                                            </span>
                                            {story.published_at && (
                                                <time>{formatRelativeTime(story.published_at)}</time>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-xl font-medium text-muted-foreground">No stories found with this tag.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TagSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-4/5" />
                        <div className="flex justify-between mt-4">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
