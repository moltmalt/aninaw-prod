import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSearchData } from '@/hooks/useSearchData';
import type { SearchFilters } from '@/hooks/useSearchData';
import { formatRelativeTime } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { StoryCategory } from '@/types';

// Constants for categories
const CATEGORIES: StoryCategory[] = ['news', 'feature', 'opinion', 'explainer', 'investigative', 'multimedia'];

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Internal state for snappy typing
    const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
    const [page, setPage] = useState(1);

    // Debounced query and filters that trigger fetch
    const [filters, setFilters] = useState<SearchFilters>({
        query: searchParams.get('q') || '',
        categories: searchParams.getAll('category'),
        authorIds: searchParams.getAll('author_id')
    });

    // Handle debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.query !== queryInput) {
                setFilters(prev => ({ ...prev, query: queryInput }));
                setPage(1); // Reset page on new query

                // Update URL params
                const params = new URLSearchParams(searchParams);
                if (queryInput) {
                    params.set('q', queryInput);
                } else {
                    params.delete('q');
                }
                setSearchParams(params, { replace: true });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [queryInput, filters.query, searchParams, setSearchParams]);

    const {
        stories,
        authors,
        totalCount,
        totalPages,
        isLoading,
        error
    } = useSearchData(filters, page);

    const toggleCategory = (cat: string) => {
        const current = new Set(filters.categories);
        if (current.has(cat)) current.delete(cat);
        else current.add(cat);

        const newArray = Array.from(current);
        setFilters(prev => ({ ...prev, categories: newArray }));
        setPage(1);

        // Update URL
        const params = new URLSearchParams(searchParams);
        params.delete('category');
        newArray.forEach(c => params.append('category', c));
        setSearchParams(params, { replace: true });
    };

    const toggleAuthor = (authorId: string) => {
        const current = new Set(filters.authorIds);
        if (current.has(authorId)) current.delete(authorId);
        else current.add(authorId);

        const newArray = Array.from(current);
        setFilters(prev => ({ ...prev, authorIds: newArray }));
        setPage(1);

        // Update URL
        const params = new URLSearchParams(searchParams);
        params.delete('author_id');
        newArray.forEach(a => params.append('author_id', a));
        setSearchParams(params, { replace: true });
    };

    const clearFilters = () => {
        setFilters({ query: queryInput, categories: [], authorIds: [] });
        const params = new URLSearchParams();
        if (queryInput) params.set('q', queryInput);
        setSearchParams(params, { replace: true });
    };

    const activeFilterCount = filters.categories.length + filters.authorIds.length;

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 w-full max-w-2xl">
                <h1 className="font-display text-4xl font-bold sm:text-5xl">Search</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Discover stories, features, and opinions.
                </p>
                <div className="relative mt-8">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for keywords, topics, or headlines..."
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        className="pl-12 py-6 text-lg rounded-full border-border bg-card shadow-sm"
                        autoFocus
                    />
                </div>
            </header>

            <div className="flex flex-col gap-10 lg:flex-row">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                            <SlidersHorizontal className="h-5 w-5" /> Filters
                        </h2>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-brand-primary hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div>
                        <h3 className="mb-3 font-semibold">Categories</h3>
                        <div className="space-y-2">
                            {CATEGORIES.map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`flex h-5 w-5 items-center justify-center rounded border ${filters.categories.includes(cat) ? 'bg-brand-primary border-brand-primary' : 'border-input group-hover:border-brand-primary/50'}`}>
                                        {filters.categories.includes(cat) && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={filters.categories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                        />
                                    </div>
                                    <span className="capitalize">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Author Filter */}
                    {authors.length > 0 && (
                        <div>
                            <h3 className="mb-3 font-semibold">Authors</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                {authors.map(author => (
                                    <label key={author.id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`flex h-5 w-5 items-center justify-center rounded border ${filters.authorIds.includes(author.id) ? 'bg-brand-primary border-brand-primary' : 'border-input group-hover:border-brand-primary/50'}`}>
                                            {filters.authorIds.includes(author.id) && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={filters.authorIds.includes(author.id)}
                                                onChange={() => toggleAuthor(author.id)}
                                            />
                                        </div>
                                        <span>{author.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Results Area */}
                <main className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {isLoading ? (
                                <Skeleton className="h-4 w-32" />
                            ) : (
                                <span>Found <strong className="text-foreground">{totalCount}</strong> result{totalCount !== 1 && 's'}</span>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-red-500 mb-6">
                            Error: {error.message}
                        </div>
                    )}

                    {isLoading ? (
                        <SearchSkeleton />
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
                                            <Badge variant="secondary" className="mb-3 text-[10px] uppercase tracking-wider">
                                                {story.category}
                                            </Badge>
                                            <h3 className="font-display text-lg font-bold leading-tight group-hover:text-brand-primary line-clamp-3">
                                                {story.title}
                                            </h3>
                                            <div className="mt-3 flex items-center text-xs text-muted-foreground">
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
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="mx-4 text-sm font-medium">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
                            <div className="mb-4 rounded-full bg-muted p-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-display text-2xl font-bold">No results found</h3>
                            <p className="mt-2 text-muted-foreground max-w-sm">
                                We couldn't find any stories matching your search. Try different keywords or check your filters.
                            </p>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={clearFilters}
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function SearchSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}
