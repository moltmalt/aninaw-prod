import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Series } from '@/types';

export function useSeriesData(seriesSlug: string | undefined) {
    const [seriesInfo, setSeriesInfo] = useState<Series | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!seriesSlug || !isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchData() {
            try {
                setIsLoading(true);

                // 1. Fetch Series Info
                const { data: seriesData, error: seriesError } = await supabase
                    .from('series')
                    .select('*')
                    .eq('slug', seriesSlug as string)
                    .single();

                const seriesDataAny = seriesData as any;

                if (seriesError) throw seriesError;

                // 2. Fetch all stories in series ordered by published_at (oldest first usually implies progression)
                const { data: storiesData, error: storiesError } = await supabase
                    .from('stories')
                    .select('*, authors:author_id(*)')
                    .eq('status', 'published')
                    .eq('series_id', seriesDataAny.id)
                    .order('published_at', { ascending: true });

                if (storiesError) throw storiesError;

                if (isMounted) {
                    setSeriesInfo(seriesData as Series);
                    setStories((storiesData || []) as unknown as Story[]);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [seriesSlug]);

    return {
        seriesInfo,
        stories,
        isLoading,
        error
    };
}
