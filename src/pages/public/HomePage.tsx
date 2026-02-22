import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomePageData } from '@/hooks/useHomePageData';
import type { Story } from '@/types';

// New abstractions
import { StoryCardOverlay } from '@/components/ui/StoryCardOverlay';
import { StoryCardHorizontal } from '@/components/ui/StoryCardHorizontal';
import { StoryCardVertical } from '@/components/ui/StoryCardVertical';

// ══════════════════════════════════════════
// ══════════════════════════════════════════
// SECTION 1: Block 1 - Recent News
// ══════════════════════════════════════════
function RecentNewsBlock({ heroStory, latestNews }: { heroStory: Story | null, latestNews: Story[] }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Huge Overlay */}
                <div className="lg:col-span-8">
                    {heroStory ? (
                        <StoryCardOverlay story={heroStory} className="h-[400px] sm:h-[500px]" />
                    ) : (
                        <Skeleton className="h-[400px] sm:h-[500px] w-full rounded-3xl" />
                    )}
                </div>

                {/* Right: Stack of Horizontals */}
                <div className="lg:col-span-4 flex flex-col">
                    <div className="flex gap-6 border-b border-border/50 text-sm font-bold mb-6">
                        <div className="pb-2 border-b-2 border-brand-primary -mb-[1px]">Recent News</div>
                        <div className="pb-2 text-muted-foreground/50 transition-colors hover:text-brand-black cursor-pointer">Top Story</div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {latestNews.slice(0, 4).map((story) => (
                            <StoryCardHorizontal
                                key={story.id}
                                story={story}
                                imageClassName="w-20 sm:w-28"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 2: Block 2 - Trendy News
// ══════════════════════════════════════════
function TrendyNewsBlock({ stories }: { stories: Story[] }) {
    if (stories.length < 4) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Trendy News</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stories.slice(0, 4).map(story => (
                    <StoryCardVertical key={story.id} story={story} />
                ))}
            </div>
        </section>
    );
}

// ══════════════════════════════════════════
// SECTION 3: Block 3 - Featured News & Analytics
// ══════════════════════════════════════════
function FeaturedNewsBlock({ featured, mostRead }: { featured: Story[], mostRead: Story[] }) {
    const mainFeature = featured[0];
    const subFeatures = featured.slice(1, 4);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl font-bold">Featured News</h2>
                        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                            <span className="text-brand-black font-bold border-b border-brand-black pb-0.5">All</span>
                            <span className="hover:text-brand-black cursor-pointer">News</span>
                            <span className="hover:text-brand-black cursor-pointer">Feature</span>
                            <span className="hover:text-brand-black cursor-pointer">Opinion</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Large Feature */}
                        <div className="md:col-span-7">
                            {mainFeature && <StoryCardVertical story={mainFeature} showExcerpt={true} />}
                        </div>
                        {/* Stacked Sub-features */}
                        <div className="md:col-span-5 flex flex-col gap-5">
                            {subFeatures.map(story => (
                                <StoryCardHorizontal
                                    key={story.id}
                                    story={story}
                                    className="bg-muted/10 p-2 rounded-2xl hover:bg-muted/30"
                                    imageClassName="w-20 sm:w-24 shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Most Read) wrapper mimicking the reference "Live Match" box */}
                <div className="lg:col-span-4">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-brand-primary">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                        </div>
                        <h2 className="font-display text-2xl font-bold tracking-tight">Analytics</h2>
                    </div>
                    <div className="bg-muted/30 rounded-3xl p-6 sm:p-8">
                        <div className="text-xs font-bold text-muted-foreground mb-6 tracking-widest uppercase">
                            Most Read Stories
                        </div>
                        <div className="flex flex-col gap-5 divide-y divide-border/40">
                            {mostRead.slice(0, 4).map((story, i) => (
                                <Link key={story.id} to={`/story/${story.slug}`} className={cn("group flex flex-col gap-1", i > 0 ? "pt-5" : "")}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {/* Simulate avatar / team icon circle */}
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs ring-1 ring-brand-primary/20">
                                                {story.category.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-display text-sm font-bold leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                                    {story.title}
                                                </h4>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase mt-1.5 block">
                                                    {story.category}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-lg font-display font-bold text-muted-foreground/30 leading-none">
                                            0{i + 1}
                                        </span>
                                    </div>
                                </Link>
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
                    <div className="lg:col-span-8"><Skeleton className="h-[500px] w-full rounded-3xl" /></div>
                    <div className="lg:col-span-4 space-y-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
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
        heroStory,
        featuredStories,
        latestNews,
        latestFeatures,
        mostRead,
        isLoading,
    } = useHomePageData();

    if (isLoading) return <HomePageSkeleton />;

    // Create a trendy block out of a mix of latest things to show the grid.
    const trendyStories = [...latestFeatures, ...latestNews].filter(s => s.id !== heroStory?.id);

    return (
        <div className="bg-white pb-16">
            <RecentNewsBlock heroStory={heroStory} latestNews={latestNews} />
            <TrendyNewsBlock stories={trendyStories} />
            <FeaturedNewsBlock featured={featuredStories} mostRead={mostRead} />
        </div>
    );
}
