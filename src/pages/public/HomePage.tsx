import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomePageData } from '@/hooks/useHomePageData';
import type { Story } from '@/types';

// New abstractions
import { StoryCardOverlay } from '@/components/ui/StoryCardOverlay';
import { StoryCardHorizontal } from '@/components/ui/StoryCardHorizontal';
import { StoryCardVertical } from '@/components/ui/StoryCardVertical';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

// ══════════════════════════════════════════
// SECTION 1: Breaking News Ticker (Keep as is, fits top bar)
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
                                className="mr-8 inline-block text-sm font-medium hover:underline tracking-wide"
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
// SECTION 2: Block 1 - Recent News
// ══════════════════════════════════════════
function RecentNewsBlock({ heroStory, latestNews }: { heroStory: Story | null, latestNews: Story[] }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-b-2 border-brand-black pb-2 mb-6">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Recent News</h2>
                <div className="flex gap-2">
                    <Link to="/category/news" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-brand-primary transition-colors border px-3 py-1.5 rounded-sm hover:border-brand-primary">
                        All Recent News
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Huge Overlay */}
                <div className="lg:col-span-8">
                    {heroStory ? (
                        <StoryCardOverlay story={heroStory} className="h-[400px] sm:h-[500px]" />
                    ) : (
                        <Skeleton className="h-[400px] sm:h-[500px] w-full rounded-xl" />
                    )}
                </div>

                {/* Right: Stack of Horizontals */}
                <div className="lg:col-span-4 flex flex-col gap-5 divide-y divide-border/50">
                    {latestNews.slice(0, 4).map((story, i) => (
                        <StoryCardHorizontal
                            key={story.id}
                            story={story}
                            className={i > 0 ? 'pt-5' : ''}
                            imageClassName="w-24 sm:w-28"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 3: Block 2 - Top News (Dark Theme)
// ══════════════════════════════════════════
function TopNewsDarkBlock({ featuredStories }: { featuredStories: Story[] }) {
    if (featuredStories.length < 3) return null; // Need enough stories to fill the block gracefully

    const primaryFeature = featuredStories[0];
    const secondaryFeatures = featuredStories.slice(1, 5); // Will try to grab 4, but 2 is fine too

    return (
        <section className="bg-brand-black py-12 text-white mt-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between border-b/20 border-white pb-3 mb-8">
                    <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide">In-Depth Features</h2>
                    <Link to="/category/feature" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors border border-white/20 px-3 py-1.5 rounded-sm hover:border-white">
                        All Features
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Large Overlay Feature */}
                    <div>
                        <StoryCardOverlay story={primaryFeature} className="h-[450px]" />
                    </div>

                    {/* Right: 2x2 Grid of smaller features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        {secondaryFeatures.map(story => (
                            <StoryCardVertical
                                key={story.id}
                                story={story}
                                className="text-white group [&_h3]:text-white group-hover:[&_h3]:text-brand-primary [&_span.text-muted-foreground]:text-white/60"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 4: Block 3 - Top News (Light Theme Feed)
// ══════════════════════════════════════════
function TopNewsLightFeed({ opinions, latest, mostRead }: { opinions: Story[], latest: Story[], mostRead: Story[] }) {
    // Combine some feed data for the left column
    const feedStories = [...opinions.slice(0, 3), ...latest.slice(0, 3)];

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Main Feed Column */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between border-b-2 border-brand-black pb-2 mb-6">
                        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Analysis & Opinion</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        {feedStories.map(story => (
                            <StoryCardVertical key={story.id} story={story} showExcerpt={true} />
                        ))}
                    </div>
                </div>

                {/* Right Sidebar (Most Read) */}
                <div className="lg:col-span-4 space-y-8">
                    <div>
                        <div className="flex items-center justify-between border-b-2 border-brand-black pb-2 mb-6">
                            <h2 className="font-display text-xl font-bold uppercase tracking-wide">Most Read</h2>
                        </div>
                        <div className="flex flex-col gap-5 divide-y divide-border/50">
                            {mostRead.slice(0, 5).map((story, i) => (
                                <div key={story.id} className={cn("flex flex-col gap-2", i > 0 ? "pt-5" : "")}>
                                    <div className="flex items-start gap-4">
                                        <span className="text-4xl font-display font-bold text-brand-primary/20 leading-none mt-1">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <CategoryBadge category={story.category} className="mb-1 w-fit" />
                                            <Link to={`/story/${story.slug}`} className="group block">
                                                <h4 className="font-display text-sm font-bold leading-snug group-hover:text-brand-primary transition-colors">
                                                    {story.title}
                                                </h4>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

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
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8"><Skeleton className="h-[500px] w-full rounded-xl" /></div>
                    <div className="lg:col-span-4 space-y-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
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
        <div className="bg-background">
            <BreakingNewsTicker stories={breakingStories} />

            <RecentNewsBlock heroStory={heroStory} latestNews={latestNews} />

            <TopNewsDarkBlock featuredStories={featuredStories} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-4 border-b border-border"></div>

            <TopNewsLightFeed opinions={latestOpinions} latest={latestFeatures} mostRead={mostRead} />
        </div>
    );
}
