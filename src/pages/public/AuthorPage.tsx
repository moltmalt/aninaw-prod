import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthorData } from '@/hooks/useAuthorData';
import type { CategorySortOption } from '@/hooks/useCategoryData';
import { formatRelativeTime } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Facebook, Twitter, Instagram, User } from 'lucide-react';

export default function AuthorPage() {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<CategorySortOption>('latest');

    const {
        authorProfile,
        stories,
        totalPages,
        isLoading,
        error
    } = useAuthorData(slug, page, sort);

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading author</h1>
                <p className="mt-2 text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Author Hero */}
            <header className="mb-16 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-8 rounded-2xl bg-muted/30 p-8 border border-border">
                <div className="shrink-0">
                    {isLoading ? (
                        <Skeleton className="h-32 w-32 rounded-full ring-4 ring-background" />
                    ) : authorProfile?.avatar_url ? (
                        <img
                            src={authorProfile.avatar_url}
                            alt={authorProfile.name}
                            className="h-32 w-32 rounded-full object-cover ring-4 ring-background shadow-md"
                        />
                    ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted ring-4 ring-background shadow-md">
                            <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-64 mx-auto sm:mx-0" />
                            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                            <Skeleton className="h-20 w-full max-w-2xl mx-auto sm:mx-0" />
                        </div>
                    ) : (
                        <>
                            <div>
                                <h1 className="font-display text-4xl font-bold">{authorProfile?.name}</h1>
                                {authorProfile?.role_title && (
                                    <p className="mt-1 text-lg font-medium text-brand-primary">{authorProfile.role_title}</p>
                                )}
                            </div>

                            {authorProfile?.bio && (
                                <p className="max-w-3xl text-muted-foreground leading-relaxed">
                                    {authorProfile.bio}
                                </p>
                            )}

                            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                                {authorProfile?.social_facebook && (
                                    <a href={authorProfile.social_facebook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted p-2 hover:bg-[#1877F2] hover:text-white transition-colors">
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                )}
                                {authorProfile?.social_twitter && (
                                    <a href={authorProfile.social_twitter} target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {authorProfile?.social_instagram && (
                                    <a href={authorProfile.social_instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted p-2 hover:bg-[#E1306C] hover:text-white transition-colors">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Stories Grid */}
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <h2 className="font-display text-2xl font-bold">Articles by {authorProfile?.name || slug}</h2>
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
                    <AuthorSkeleton />
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
                                            <span className="uppercase tracking-wider text-[10px] font-bold text-brand-primary">
                                                {story.category}
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
                        <p className="text-xl font-medium text-muted-foreground">This author hasn't published any stories yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function AuthorSkeleton() {
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
