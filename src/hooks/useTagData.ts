import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Tag } from '@/types';
import type { CategorySortOption } from './useCategoryData'; // reuse sort options

export function useTagData(tagSlug: string | undefined, page: number = 1, sort: CategorySortOption = 'latest') {
    const [tagInfo, setTagInfo] = useState<Tag | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        if (!tagSlug || !isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchData() {
            try {
                setIsLoading(true);

                // 1. Fetch Tag Info
                const { data: tagData, error: tagError } = await supabase
                    .from('tags')
                    .select('*')
                    .eq('slug', tagSlug as string)
                    .single();

                const tagDataAny = tagData as any;

                if (tagError) throw tagError;

                // 2. Fetch Paginated Stories using inner join
                // Note: requires Supabase postgrest to filter by joined table columns
                let query = supabase
                    .from('stories')
                    .select('*, authors:author_id(*), story_tags!inner(tag_id)', { count: 'exact' })
                    .eq('status', 'published')
                    .eq('story_tags.tag_id', tagDataAny.id);

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

                if (isMounted) {
                    setTagInfo(tagData as Tag);
                    setStories(storiesData as unknown as Story[]);
                    setTotalCount(count || 0);
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
    }, [tagSlug, page, sort]);

    return {
        tagInfo,
        stories,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        isLoading,
        error
    };
}
