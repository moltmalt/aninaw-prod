import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Author } from '@/types';

export interface SearchFilters {
    query: string;
    categories: string[];
    authorIds: string[];
    // dateRange: { from?: Date; to?: Date }; // Simplified for now
}

export function useSearchData(filters: SearchFilters, page: number = 1) {
    const [stories, setStories] = useState<Story[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const ITEMS_PER_PAGE = 12;

    // Load available authors for the filter once
    useEffect(() => {
        if (!isSupabaseConfigured) return;
        supabase.from('authors').select('id, name, slug').then(({ data }) => {
            if (data) setAuthors(data as Author[]);
        });
    }, []);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchResults() {
            try {
                setIsLoading(true);

                let dbQuery = supabase
                    .from('stories')
                    .select('*, authors:author_id(*)', { count: 'exact' })
                    .eq('status', 'published')
                    .order('published_at', { ascending: false });

                // Text search (ilike fallback for multiple columns)
                if (filters.query && filters.query.trim() !== '') {
                    const q = `%${filters.query.trim()}%`;
                    dbQuery = dbQuery.or(`title.ilike.${q},excerpt.ilike.${q},body.ilike.${q}`);
                }

                if (filters.categories && filters.categories.length > 0) {
                    dbQuery = dbQuery.in('category', filters.categories);
                }

                if (filters.authorIds && filters.authorIds.length > 0) {
                    dbQuery = dbQuery.in('author_id', filters.authorIds);
                }

                const from = (page - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;
                dbQuery = dbQuery.range(from, to);

                const { data, count, error: searchError } = await dbQuery;

                if (searchError) throw searchError;

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

        // We could implement an internal debounce here, but we'll do it in the UI component 
        // using a separate state so the input feels snappy while the fetch waits 300ms.
        fetchResults();

        return () => {
            isMounted = false;
        };
    }, [filters, page]);

    return {
        stories,
        authors,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        isLoading,
        error
    };
}
