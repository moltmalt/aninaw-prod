import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Author, Series, Tag, MediaEmbed } from '@/types';

type StoryWithRelations = Story & {
    author_profile: Author;
    series_profile?: Series | null;
    tags_list: Tag[];
    media_embeds_list: MediaEmbed[];
    related_stories_list?: Story[];
};

export function useStoryData(slug: string | undefined) {
    const [data, setData] = useState<StoryWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchStory() {
            try {
                setIsLoading(true);

                // Fetch main story and its direct foreign keys
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: rawData, error: storyError } = await supabase
                    .from('stories')
                    .select(`
            *,
            authors:author_id (*),
            series:series_id (*)
          `)
                    .eq('slug', slug as string)
                    .eq('status', 'published')
                    .single();

                const storyRaw = rawData as any;

                if (storyError) throw storyError;
                if (!storyRaw) throw new Error('Story not found');

                // Fetch tags (Story -> Story Tag -> Tag)
                // Since Supabase joins through many-to-many can be slightly complex via string select,
                // we do it explicitly:
                const { data: storyTagsData } = await supabase
                    .from('story_tags')
                    .select('tags (*)')
                    .eq('story_id', storyRaw.id);

                const tags = ((storyTagsData as any[]) || [])
                    .map((st) => st.tags)
                    .filter(Boolean) as unknown as Tag[];

                // Fetch media embeds ordered by position
                const { data: embedsData } = await supabase
                    .from('media_embeds')
                    .select('*')
                    .eq('story_id', storyRaw.id)
                    .order('position', { ascending: true });

                // Fetch related stories (Story -> Story Related -> Story)
                const { data: relatedData } = await supabase
                    .from('story_related')
                    .select('related_story_id, stories!story_related_related_story_id_fkey (*)')
                    .eq('story_id', storyRaw.id)
                    .limit(3);

                const relatedStories = ((relatedData as any[]) || [])
                    .map((r) => r.stories)
                    .filter(Boolean) as unknown as Story[];

                // Compile complete object
                const completeStory: StoryWithRelations = {
                    ...storyRaw,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    author_profile: (storyRaw as any).authors as Author,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    series_profile: (storyRaw as any).series as Series | null,
                    tags_list: tags,
                    media_embeds_list: (embedsData as unknown as MediaEmbed[]) || [],
                    related_stories_list: relatedStories,
                };

                if (isMounted) {
                    setData(completeStory);

                    // Increment view count via RPC anonymously
                    // Use 'increment_view_count' RPC defined in the schema
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    supabase.rpc('increment_view_count', { p_story_id: storyRaw.id } as any)
                        .then(({ error: rpcErr }) => {
                            if (rpcErr) console.error('Failed to increment view count:', rpcErr);
                        });
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchStory();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    return { story: data, isLoading, error };
}
