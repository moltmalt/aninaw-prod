import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Author } from '@/types';
import type { CategorySortOption } from './useCategoryData';

export function useAuthorData(authorSlug: string | undefined, page: number = 1, sort: CategorySortOption = 'latest') {
    const [authorProfile, setAuthorProfile] = useState<Author | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        if (!authorSlug || !isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchData() {
            try {
                setIsLoading(true);

                // 1. Fetch Author Profile
                const { data: authorData, error: authorError } = await supabase
                    .from('authors')
                    .select('*')
                    .eq('slug', authorSlug as string)
                    .single();

                const authorDataAny = authorData as any;

                if (authorError) throw authorError;

                // 2. Fetch Paginated Stories by this author
                let query = supabase
                    .from('stories')
                    .select('*, authors:author_id(*)', { count: 'exact' })
                    .eq('status', 'published')
                    .eq('author_id', authorDataAny.id);

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
                    setAuthorProfile(authorData as Author);
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
    }, [authorSlug, page, sort]);

    return {
        authorProfile,
        stories,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        isLoading,
        error
    };
}
