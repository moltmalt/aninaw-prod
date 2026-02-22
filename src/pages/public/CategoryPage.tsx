import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategoryData } from '@/hooks/useCategoryData';
import type { CategorySortOption } from '@/hooks/useCategoryData';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<CategorySortOption>('latest');

    const {
        stories,
        mostRead,
        popularTags,
        totalPages,
        isLoading,
        error
    } = useCategoryData(category, page, sort);

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading category</h1>
                <p className="mt-2 text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 text-center">
                <h1 className="font-display text-4xl font-bold capitalize sm:text-5xl">{category}</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Latest news and stories from the {category} desk.
                </p>
            </header>

            <div className="grid gap-12 lg:grid-cols-4">
                {/* Main Content: Story Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                        <h2 className="font-display text-2xl font-bold">All Stories</h2>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value as CategorySortOption);
                                setPage(1); // Reset page on sort change
                            }}
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background cursor-pointer"
                        >
                            <option value="latest">Latest</option>
                            <option value="popular">Most Read</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <CategorySkeleton />
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
                            <p className="text-xl font-medium text-muted-foreground">No stories found in this category.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-10 border-l border-border pl-0 lg:pl-8 lg:border-t-0 border-t pt-8 lg:pt-0">
                    {/* Most Read in Category */}
                    <div>
                        <h3 className="mb-4 font-display text-xl font-bold">Most Read</h3>
                        <div className="space-y-6">
                            {isLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))
                            ) : mostRead.map((story, i) => (
                                <Link key={story.id} to={`/story/${story.slug}`} className="group flex items-start gap-4">
                                    <span className="shrink-0 font-display text-2xl font-bold text-brand-primary/20">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h4 className="font-bold leading-tight group-hover:text-brand-primary line-clamp-2">
                                            {story.title}
                                        </h4>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {story.view_count} views
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Popular Tags Cloud */}
                    <div>
                        <h3 className="mb-4 font-display text-xl font-bold">Popular Tags</h3>
                        {isLoading ? (
                            <div className="flex flex-wrap gap-2">
                                {Array(8).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                                ))}
                            </div>
                        ) : popularTags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map(tag => (
                                    <Link key={tag.id} to={`/tag/${tag.slug}`}>
                                        <Badge variant="outline" className="hover:bg-muted py-1 cursor-pointer font-normal rounded-full">
                                            #{tag.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No tags found.</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function CategorySkeleton() {
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
