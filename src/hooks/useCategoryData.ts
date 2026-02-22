import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Tag } from '@/types';

export type CategorySortOption = 'latest' | 'oldest' | 'popular';

export function useCategoryData(category: string | undefined, page: number = 1, sort: CategorySortOption = 'latest') {
    const [stories, setStories] = useState<Story[]>([]);
    const [mostRead, setMostRead] = useState<Story[]>([]);
    const [popularTags, setPopularTags] = useState<Tag[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        if (!category || !isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchData() {
            try {
                setIsLoading(true);

                // 1. Fetch Paginated Stories
                let query = supabase
                    .from('stories')
                    .select('*, authors:author_id(*)', { count: 'exact' })
                    .eq('category', category as string)
                    .eq('status', 'published');

                // Apply Sorting
                if (sort === 'latest') {
                    query = query.order('published_at', { ascending: false });
                } else if (sort === 'oldest') {
                    query = query.order('published_at', { ascending: true });
                } else if (sort === 'popular') {
                    query = query.order('view_count', { ascending: false });
                }

                // Apply Pagination
                const from = (page - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;
                query = query.range(from, to);

                const { data: storiesData, count, error: storiesError } = await query;
                if (storiesError) throw storiesError;

                // 2. Fetch "Most Read in Category" (sidebar)
                const { data: mostReadData } = await supabase
                    .from('stories')
                    .select('*, authors:author_id(*)')
                    .eq('category', category as string)
                    .eq('status', 'published')
                    .order('view_count', { ascending: false })
                    .limit(5);

                // 3. Fetch Site-wide popular tags (simplification for Tag Cloud)
                const { data: tagsData } = await supabase
                    .from('tags')
                    .select('*')
                    .limit(20);

                if (isMounted) {
                    setStories(storiesData as unknown as Story[]);
                    setTotalCount(count || 0);
                    setMostRead((mostReadData || []) as unknown as Story[]);
                    setPopularTags((tagsData || []) as Tag[]);
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
    }, [category, page, sort]);

    return {
        stories,
        mostRead,
        popularTags,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        isLoading,
        error
    };
}
