import { Link } from 'react-router-dom';
import { Clock, Eye, User, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomePageData } from '@/hooks/useHomePageData';
import { formatRelativeTime, truncateText, cn } from '@/lib/utils';
import type { Story, StoryCategory } from '@/types';

// ── Category color mapping ──
const categoryColors: Record<StoryCategory, string> = {
    news: 'bg-brand-primary text-white',
    feature: 'bg-amber-600 text-white',
    opinion: 'bg-violet-600 text-white',
    explainer: 'bg-sky-600 text-white',
    investigative: 'bg-emerald-700 text-white',
    multimedia: 'bg-pink-600 text-white',
};

function CategoryBadge({ category }: { category: StoryCategory }) {
    return (
        <Badge className={cn('text-[10px] font-semibold uppercase tracking-wider border-0 rounded-sm', categoryColors[category])}>
            {category}
        </Badge>
    );
}

// ── Author line ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuthorLine({ story, className }: { story: Story; className?: string }) {
    // Supabase FK join returns author under `authors` alias
    const author = (story as any).authors ?? story.author;
    return (
        <div className={cn('flex items-center gap-2 text-xs', className)}>
            {(author as { avatar_url?: string })?.avatar_url ? (
                <img
                    src={(author as { avatar_url: string }).avatar_url}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                    <User className="h-3 w-3 text-muted-foreground" />
                </div>
            )}
            <span className="font-medium">{(author as { name?: string })?.name ?? 'Staff'}</span>
            {story.published_at && (
                <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{formatRelativeTime(story.published_at)}</span>
                </>
            )}
        </div>
    );
}

// ══════════════════════════════════════════
// SECTION 1: Breaking News Ticker
// ══════════════════════════════════════════

function BreakingNewsTicker({ stories }: { stories: Story[] }) {
    if (stories.length === 0) return null;
    return (
        <div className="overflow-hidden bg-brand-primary text-white">
            <div className="mx-auto flex max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8">
                <span className="mr-4 shrink-0 rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Breaking
                </span>
                <div className="overflow-hidden">
                    <div className="animate-marquee flex whitespace-nowrap">
                        {stories.concat(stories).map((story, i) => (
                            <Link
                                key={`${story.id}-${i}`}
                                to={`/story/${story.slug}`}
                                className="mr-8 inline-block text-sm font-medium hover:underline"
                            >
                                {story.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════
// SECTION 2: Hero Section
// ══════════════════════════════════════════

function HeroSection({ story }: { story: Story | null }) {
    if (!story) return null;
    return (
        <section className="relative">
            <Link to={`/story/${story.slug}`} className="group block">
                <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-black sm:aspect-[3/1]">
                    {story.cover_image_url ? (
                        <img
                            src={story.cover_image_url}
                            alt={story.cover_image_alt ?? story.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-brand-primary/20 to-brand-black" />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                        <div className="mx-auto max-w-7xl">
                            <CategoryBadge category={story.category} />
                            <h1 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                                {story.title}
                            </h1>
                            {story.excerpt && (
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                                    {truncateText(story.excerpt, 180)}
                                </p>
                            )}
                            <div className="mt-4 flex items-center gap-4">
                                <AuthorLine story={story} className="text-white/60" />
                                {story.reading_time_minutes && (
                                    <span className="flex items-center gap-1 text-xs text-white/50">
                                        <Clock className="h-3 w-3" />
                                        {story.reading_time_minutes} min read
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 3: Secondary Featured Row
// ══════════════════════════════════════════

function SecondaryFeaturedRow({ stories }: { stories: Story[] }) {
    if (stories.length === 0) return null;
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                    <Link
                        key={story.id}
                        to={`/story/${story.slug}`}
                        className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
                    >
                        <div className="aspect-video overflow-hidden bg-muted">
                            {story.cover_image_url ? (
                                <img
                                    src={story.cover_image_url}
                                    alt={story.cover_image_alt ?? story.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                    <span className="text-3xl font-bold text-muted-foreground/20 font-display">{story.category}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <CategoryBadge category={story.category} />
                            <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-brand-primary transition-colors">
                                {story.title}
                            </h3>
                            <AuthorLine story={story} className="mt-3 text-muted-foreground" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 4: Latest News Strip
// ══════════════════════════════════════════

function LatestNewsStrip({ stories }: { stories: Story[] }) {
    if (stories.length === 0) return null;
    return (
        <section className="border-y border-border bg-card py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold">Latest News</h2>
                    <Link to="/category/news" className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline">
                        All News <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {stories.map((story) => (
                        <Link
                            key={story.id}
                            to={`/story/${story.slug}`}
                            className="group flex shrink-0 w-64 gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                        >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                                {story.cover_image_url ? (
                                    <img
                                        src={story.cover_image_url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/10 to-muted">
                                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase">News</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                                    {story.title}
                                </h4>
                                {story.published_at && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatRelativeTime(story.published_at)}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 5: Features Section
// ══════════════════════════════════════════

function FeaturesSection({ stories }: { stories: Story[] }) {
    if (stories.length === 0) return null;
    const [mainStory, ...sideStories] = stories;
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Features</h2>
                <Link to="/category/feature" className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline">
                    All Features <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Main (large) card */}
                <Link
                    to={`/story/${mainStory.slug}`}
                    className="group row-span-2 overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
                >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {mainStory.cover_image_url ? (
                            <img
                                src={mainStory.cover_image_url}
                                alt={mainStory.cover_image_alt ?? mainStory.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-600/10 to-muted" />
                        )}
                    </div>
                    <div className="p-5">
                        <CategoryBadge category={mainStory.category} />
                        <h3 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-brand-primary transition-colors sm:text-2xl">
                            {mainStory.title}
                        </h3>
                        {mainStory.excerpt && (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {truncateText(mainStory.excerpt, 150)}
                            </p>
                        )}
                        <AuthorLine story={mainStory} className="mt-3 text-muted-foreground" />
                    </div>
                </Link>

                {/* Side stories */}
                <div className="flex flex-col gap-6">
                    {sideStories.map((story) => (
                        <Link
                            key={story.id}
                            to={`/story/${story.slug}`}
                            className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
                        >
                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                                {story.cover_image_url ? (
                                    <img src={story.cover_image_url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-600/10 to-muted" />
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <CategoryBadge category={story.category} />
                                <h4 className="mt-1.5 text-sm font-semibold leading-snug group-hover:text-brand-primary transition-colors">
                                    {story.title}
                                </h4>
                                <AuthorLine story={story} className="mt-2 text-muted-foreground" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 6: Opinions Section
// ══════════════════════════════════════════

function OpinionsSection({ stories }: { stories: Story[] }) {
    if (stories.length === 0) return null;
    return (
        <section className="border-y border-border bg-card py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold">Opinion</h2>
                    <Link to="/category/opinion" className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline">
                        All Opinions <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="mt-6 divide-y divide-border">
                    {stories.map((story) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const author = (story as any).authors ?? story.author;
                        return (
                            <Link
                                key={story.id}
                                to={`/story/${story.slug}`}
                                className="group flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                            >
                                {/* Author avatar (prominent) */}
                                {(author as { avatar_url?: string })?.avatar_url ? (
                                    <img
                                        src={(author as { avatar_url: string }).avatar_url}
                                        alt=""
                                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100">
                                        <User className="h-5 w-5 text-violet-600" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-display text-base font-semibold leading-snug group-hover:text-brand-primary transition-colors sm:text-lg">
                                        {story.title}
                                    </h4>
                                    {story.excerpt && (
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                            {story.excerpt}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                                        By {(author as { name?: string })?.name ?? 'Staff'}
                                        {story.published_at && ` · ${formatRelativeTime(story.published_at)}`}
                                    </p>
                                </div>
                                <span className="hidden shrink-0 text-sm font-medium text-brand-primary opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
                                    Read →
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 7: Most Read This Week
// ══════════════════════════════════════════

function MostReadSection({ stories }: { stories: Story[] }) {
    if (stories.length === 0) return null;
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold">Most Read This Week</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {stories.map((story, idx) => (
                    <Link
                        key={story.id}
                        to={`/story/${story.slug}`}
                        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                    >
                        <span className="shrink-0 font-display text-3xl font-bold text-brand-primary/20">
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                            <CategoryBadge category={story.category} />
                            <h4 className="mt-1 text-sm font-semibold leading-snug line-clamp-3 group-hover:text-brand-primary transition-colors">
                                {story.title}
                            </h4>
                            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Eye className="h-3 w-3" /> {story.view_count.toLocaleString()} views
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}


// ══════════════════════════════════════════
// LOADING SKELETON
// ══════════════════════════════════════════

function HomePageSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Hero skeleton */}
            <Skeleton className="aspect-[21/9] w-full rounded-none sm:aspect-[3/1]" />

            {/* Featured row skeleton */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="overflow-hidden rounded-lg border border-border">
                            <Skeleton className="aspect-video w-full" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News strip skeleton */}
            <div className="border-y border-border bg-card py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-7 w-40" />
                    <div className="mt-6 flex gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex w-64 shrink-0 gap-3">
                                <Skeleton className="h-20 w-20 rounded-md" />
                                <div className="flex-1 space-y-2 py-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════
// HOMEPAGE
// ══════════════════════════════════════════

export default function HomePage() {
    const {
        breakingStories,
        heroStory,
        featuredStories,
        latestNews,
        latestFeatures,
        latestOpinions,
        mostRead,
        isLoading,
    } = useHomePageData();

    if (isLoading) return <HomePageSkeleton />;



    return (
        <>
            <BreakingNewsTicker stories={breakingStories} />
            <HeroSection story={heroStory} />
            <SecondaryFeaturedRow stories={featuredStories} />
            <LatestNewsStrip stories={latestNews} />
            <FeaturesSection stories={latestFeatures} />
            <OpinionsSection stories={latestOpinions} />
            <MostReadSection stories={mostRead} />
        </>
    );
}
