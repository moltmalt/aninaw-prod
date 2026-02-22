import type { MediaEmbed } from '@/types';

export default function MediaEmbedBlock({ embed }: { embed: MediaEmbed }) {
    if (!embed) return null;

    switch (embed.type as string) {
        case 'youtube':
            return (
                <div className="my-8 overflow-hidden rounded-xl border border-border shadow-sm">
                    <div className="aspect-video w-full bg-muted">
                        <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${embed.embed_id}`}
                            title={embed.caption || 'YouTube video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                    {embed.caption && (
                        <p className="bg-muted/30 p-3 text-sm text-muted-foreground">
                            {embed.caption}
                        </p>
                    )}
                </div>
            );

        case 'facebook_video':
        case 'facebook_post':
        case 'facebook_reel':
            return (
                <div className="my-8 flex w-full justify-center overflow-hidden rounded-xl bg-muted/20 py-4 shadow-sm">
                    <div
                        className={embed.type === 'facebook_post' ? "fb-post" : "fb-video"}
                        data-href={embed.embed_url}
                        data-show-text="true"
                        data-width="auto"
                    />
                </div>
            );

        case 'gallery':
            // Very simple gallery placeholder
            return (
                <div className="my-8 rounded-xl border border-border p-4 shadow-sm">
                    <p className="font-semibold text-muted-foreground">[Image Gallery Placeholder: {embed.caption}]</p>
                </div>
            );

        case 'pullquote':
            // Overloading type locally or just checking caption
            return (
                <blockquote className="my-10 border-l-4 border-brand-primary pl-6 font-display text-2xl font-bold italic leading-relaxed text-foreground/90">
                    "{embed.caption}"
                </blockquote>
            );

        default:
            return (
                <div className="my-8 italic text-muted-foreground border-l-4 border-muted pl-4">
                    [Unsupported media embed type: {embed.type}]
                </div>
            );
    }
}
