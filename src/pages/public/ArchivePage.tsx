import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useArchiveData } from '@/hooks/useArchiveData';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, ChevronRight } from 'lucide-react';

export default function ArchivePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read from URL or default to current year/month
    const initialYear = searchParams.has('year') ? parseInt(searchParams.get('year')!, 10) : new Date().getFullYear();
    const initialMonth = searchParams.has('month') ? parseInt(searchParams.get('month')!, 10) : new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState<number | undefined>(initialYear);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(initialMonth);
    const [page, setPage] = useState(1);

    const {
        navigation,
        stories,
        totalCount,
        totalPages,
        isLoadingOverview,
        isLoadingStories,
        error
    } = useArchiveData(selectedYear, selectedMonth, page);

    // Sync state to URL without full reload
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (selectedYear) params.set('year', selectedYear.toString());
        if (selectedMonth) params.set('month', selectedMonth.toString());
        setSearchParams(params, { replace: true });
    }, [selectedYear, selectedMonth, setSearchParams, searchParams]);

    // Handle initial navigation load to auto-select latest if URL was empty
    useEffect(() => {
        if (!searchParams.has('year') && navigation.length > 0 && !selectedYear) {
            setSelectedYear(navigation[0].year);
            if (navigation[0].months.length > 0) {
                setSelectedMonth(navigation[0].months[0].month);
            }
        }
    }, [navigation, searchParams, selectedYear]);

    const handleSelectMonth = (year: number, month: number) => {
        setSelectedYear(year);
        setSelectedMonth(month);
        setPage(1);
    };

    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading archive</h1>
                <p className="mt-2 text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 w-full max-w-2xl">
                <h1 className="font-display text-4xl font-bold sm:text-5xl">Archive</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Browse our past stories by month and year.
                </p>
            </header>

            <div className="flex flex-col gap-10 lg:flex-row">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8 border-r border-border pr-6 rounded-lg lg:bg-transparent lg:p-0 bg-card p-6">
                    <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                        <CalendarDays className="h-5 w-5" /> Browse By Date
                    </h2>

                    {isLoadingOverview ? (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-32 ml-4" />
                            <Skeleton className="h-4 w-32 ml-4" />
                            <Skeleton className="h-6 w-24 mt-4" />
                        </div>
                    ) : navigation.length > 0 ? (
                        <nav className="space-y-6">
                            {navigation.map((navYear) => (
                                <div key={navYear.year}>
                                    <h3 className="font-bold text-lg mb-2">{navYear.year}</h3>
                                    <ul className="space-y-1 border-l-2 border-border ml-2">
                                        {navYear.months.map((m) => {
                                            const isSelected = selectedYear === navYear.year && selectedMonth === m.month;
                                            return (
                                                <li key={m.month}>
                                                    <button
                                                        onClick={() => handleSelectMonth(navYear.year, m.month)}
                                                        className={`flex w-full items-center justify-between border-l-2 -ml-[2px] px-4 py-2 text-sm transition-colors hover:bg-muted ${isSelected
                                                                ? 'border-brand-primary font-bold text-brand-primary bg-brand-primary/5'
                                                                : 'border-transparent text-muted-foreground'
                                                            }`}
                                                    >
                                                        <span>{m.name}</span>
                                                        <Badge variant="secondary" className="text-[10px] font-normal">
                                                            {m.count}
                                                        </Badge>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    ) : (
                        <p className="text-sm text-muted-foreground">No archive data available.</p>
                    )}
                </aside>

                {/* Main Content: Stories Grid */}
                <main className="flex-1">
                    {selectedYear && selectedMonth && (
                        <div className="mb-8 flex items-center gap-2 text-muted-foreground">
                            <span>Archive</span>
                            <ChevronRight className="h-4 w-4" />
                            <span>{selectedYear}</span>
                            <ChevronRight className="h-4 w-4" />
                            <strong className="text-foreground">{monthNames[selectedMonth]}</strong>
                            <span className="ml-auto text-sm">
                                {isLoadingStories ? 'Loading...' : `${totalCount} stories`}
                            </span>
                        </div>
                    )}

                    {isLoadingStories ? (
                        <ArchiveSkeleton />
                    ) : stories.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                        <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
                            {selectedYear ? (
                                <p>No stories published in {monthNames[selectedMonth || 0]} {selectedYear}.</p>
                            ) : (
                                <p>Select a month from the sidebar to view archived stories.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function ArchiveSkeleton() {
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
