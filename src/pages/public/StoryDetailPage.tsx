import { useParams, Link } from 'react-router-dom';
import { useStoryData } from '@/hooks/useStoryData';
import { formatRelativeTime, calculateReadingTime, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Clock, Facebook, Twitter, Link as LinkIcon, User } from 'lucide-react';
import DOMPurify from 'dompurify';
import MediaEmbedBlock from '@/components/stories/MediaEmbedBlock';

export default function StoryDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { story, isLoading, error } = useStoryData(slug);

    if (isLoading) return <StorySkeleton />;
    if (error || !story) return <StoryNotFound />;

    const {
        title,
        excerpt,
        body,
        cover_image_url,
        cover_image_caption,
        category,
        published_at,
        is_breaking,
        is_featured,
        author_profile,
        tags_list,
        correction_notice,
        series_profile,
    } = story;

    // Sanitize body HTML
    const cleanHtml = DOMPurify.sanitize(body, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'],
    });

    const readTime = calculateReadingTime(body);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // Could add a toast here
    };

    return (
        <article className="pb-16 pt-8 sm:pt-12">
            {/* Header / Hero */}
            <header className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="bg-brand-primary uppercase tracking-wider text-xs">
                        {category}
                    </Badge>
                    {is_breaking && (
                        <Badge variant="destructive" className="animate-pulse uppercase tracking-wider text-xs">
                            Breaking News
                        </Badge>
                    )}
                    {is_featured && (
                        <Badge variant="secondary" className="uppercase tracking-wider text-xs bg-brand-secondary text-white hover:bg-brand-secondary">
                            Featured
                        </Badge>
                    )}
                </div>

                <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    {title}
                </h1>

                {excerpt && (
                    <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
                        {excerpt}
                    </p>
                )}

                {/* Author Row */}
                <div className="mt-8 flex flex-col justify-between gap-4 border-y border-border py-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <Link to={`/author/${author_profile?.slug}`} className="shrink-0">
                            {author_profile?.avatar_url ? (
                                <img
                                    src={author_profile.avatar_url}
                                    alt={author_profile.name}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/author/${author_profile?.slug}`}
                                    className="font-bold hover:underline"
                                >
                                    {author_profile?.name || 'Staff'}
                                </Link>
                                {author_profile?.role_title && (
                                    <span className="text-sm text-muted-foreground">
                                        — {author_profile.role_title}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                {published_at && (
                                    <time dateTime={published_at}>
                                        {formatRelativeTime(published_at)}
                                    </time>
                                )}
                                <span className="mx-2">·</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> {readTime} min read
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Simple Share buttons */}
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-[#1877F2] hover:text-white"
                            aria-label="Share on Facebook"
                        >
                            <Facebook className="h-4 w-4" />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            aria-label="Share on X (Twitter)"
                        >
                            <Twitter className="h-4 w-4" />
                        </a>
                        <button
                            onClick={handleCopyLink}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-colors hover:bg-foreground hover:text-background"
                            aria-label="Copy link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            {cover_image_url && (
                <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
                    <figure className="overflow-hidden rounded-xl bg-muted">
                        <img
                            src={cover_image_url}
                            alt={story.cover_image_alt || title}
                            className="aspect-video w-full object-cover sm:aspect-[21/9]"
                            style={{
                                objectPosition: `${story.cover_focal_point?.x * 100}% ${story.cover_focal_point?.y * 100}%`,
                            }}
                        />
                        {cover_image_caption && (
                            <figcaption className="bg-muted py-3 px-4 text-sm text-muted-foreground">
                                {cover_image_caption}
                            </figcaption>
                        )}
                    </figure>
                </div>
            )}

            {/* Series Banner */}
            {series_profile && (
                <div className="mx-auto mt-10 max-w-3xl px-4">
                    <div className="rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
                                    Part of a Series
                                </h3>
                                <p className="mt-1 font-display text-lg font-bold text-foreground">
                                    {series_profile.title}
                                </p>
                            </div>
                            <Link
                                to={`/series/${series_profile.slug}`}
                                className="shrink-0 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
                            >
                                View Series
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Correction Notice */}
            {correction_notice && (
                <div className="mx-auto mt-8 max-w-3xl px-4">
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
                        <span className="font-bold uppercase tracking-wider text-sm">Correction: </span>
                        {correction_notice}
                    </div>
                </div>
            )}

            {/* Story Body */}
            <div className="mx-auto mt-10 max-w-3xl px-4">
                <div
                    className={cn(
                        "prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-display prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline",
                        "prose-img:rounded-xl prose-img:shadow-sm"
                    )}
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />

                {/* Media Embeds (rendered below body for now if we don't do inline replacement) */}
                {story.media_embeds_list && story.media_embeds_list.length > 0 && (
                    <div className="mt-8 space-y-6">
                        {story.media_embeds_list.map((embed) => (
                            <MediaEmbedBlock key={embed.id} embed={embed} />
                        ))}
                    </div>
                )}
            </div>

            {/* Tags Row */}
            {tags_list && tags_list.length > 0 && (
                <div className="mx-auto mt-12 max-w-3xl px-4">
                    <div className="flex flex-wrap gap-2">
                        {tags_list.map(tag => (
                            <Link key={tag.id} to={`/tag/${tag.slug}`}>
                                <Badge variant="outline" className="hover:bg-muted py-1.5 text-sm font-normal">
                                    #{tag.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Stories */}
            {story.related_stories_list && story.related_stories_list.length > 0 && (
                <div className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h3 className="mb-6 font-display text-2xl font-bold">Related Stories</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {story.related_stories_list.map((rs) => (
                            <Link key={rs.id} to={`/story/${rs.slug}`} className="group block overflow-hidden rounded-xl border border-border transition-colors hover:border-brand-primary/50">
                                {rs.cover_image_url ? (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={rs.cover_image_url}
                                            alt={rs.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full bg-muted/50" />
                                )}
                                <div className="p-4">
                                    <Badge variant="secondary" className="mb-3 text-[10px] uppercase tracking-wider">
                                        {rs.category}
                                    </Badge>
                                    <h4 className="font-display text-lg font-bold leading-tight group-hover:text-brand-primary">
                                        {rs.title}
                                    </h4>
                                    {rs.published_at && (
                                        <time className="mt-2 block text-xs text-muted-foreground">
                                            {formatRelativeTime(rs.published_at)}
                                        </time>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Facebook Comments */}
            <div className="mx-auto mt-16 max-w-3xl px-4">
                <h3 className="mb-6 font-display text-2xl font-bold">Comments</h3>
                <div className="rounded-xl border border-border bg-card p-4">
                    <div
                        className="fb-comments"
                        data-href={window.location.href}
                        data-width="100%"
                        data-numposts="5"
                    ></div>
                </div>
            </div>
        </article>
    );
}

function StorySkeleton() {
    return (
        <div className="pb-16 pt-8 sm:pt-12 animate-pulse">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-6 w-24 mb-6" />
                <Skeleton className="h-14 w-full mb-3" />
                <Skeleton className="h-14 w-3/4 mb-6" />
                <Skeleton className="h-24 w-full mb-8" />
                <div className="border-y border-border py-6 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
                <Skeleton className="aspect-video w-full rounded-xl sm:aspect-[21/9]" />
            </div>
            <div className="mx-auto mt-10 max-w-3xl px-4 space-y-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
            </div>
        </div>
    );
}

function StoryNotFound() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="font-display text-4xl font-bold">Story Not Found</h1>
            <p className="mt-4 text-muted-foreground">The story you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="mt-8 rounded-md bg-brand-primary px-6 py-3 font-semibold text-white">
                Back to Homepage
            </Link>
        </div>
    );
}
