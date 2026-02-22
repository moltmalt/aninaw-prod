import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story } from '@/types';

export interface AdminStoriesFilters {
    query: string;
    status: string;
    category: string;
    authorId: string;
}

export function useAdminStoriesData(filters: AdminStoriesFilters, page: number = 1) {
    const [stories, setStories] = useState<Story[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchStories() {
            try {
                setIsLoading(true);

                let dbQuery = supabase
                    .from('stories')
                    .select('*, authors:author_id(name)', { count: 'exact' })
                    .order('created_at', { ascending: false });

                // Apply Filters
                if (filters.query && filters.query.trim() !== '') {
                    const q = `%${filters.query.trim()}%`;
                    dbQuery = dbQuery.or(`title.ilike.${q},slug.ilike.${q}`);
                }

                if (filters.status && filters.status !== 'all') {
                    dbQuery = dbQuery.eq('status', filters.status);
                }

                if (filters.category && filters.category !== 'all') {
                    dbQuery = dbQuery.eq('category', filters.category);
                }

                if (filters.authorId && filters.authorId !== 'all') {
                    dbQuery = dbQuery.eq('author_id', filters.authorId);
                }

                const from = (page - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;
                dbQuery = dbQuery.range(from, to);

                const { data, count, error: fetchError } = await dbQuery;

                if (fetchError) throw fetchError;

                if (isMounted) {
                    setStories((data || []) as unknown as Story[]);
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

        fetchStories();

        return () => { isMounted = false; };
    }, [filters, page]);

    return {
        stories,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        isLoading,
        error
    };
}
