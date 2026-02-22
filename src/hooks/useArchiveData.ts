import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story } from '@/types';

export interface ArchiveNavigation {
    year: number;
    months: { month: number; name: string; count: number }[];
}

export function useArchiveData(selectedYear?: number, selectedMonth?: number, page: number = 1) {
    const [navigation, setNavigation] = useState<ArchiveNavigation[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStories, setIsLoadingStories] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const ITEMS_PER_PAGE = 12;

    // 1. Fetch entire navigation tree (all published_at dates)
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchNavigation() {
            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select('published_at')
                    .eq('status', 'published')
                    .not('published_at', 'is', null);

                if (error) throw error;

                if (isMounted && data) {
                    // Group by year and month
                    const navMap = new Map<number, Map<number, number>>();

                    data.forEach((row) => {
                        const r = row as any;
                        if (!r.published_at) return;
                        const date = new Date(r.published_at);
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1; // 1-12

                        if (!navMap.has(year)) navMap.set(year, new Map());
                        const mt = navMap.get(year)!;
                        mt.set(month, (mt.get(month) || 0) + 1);
                    });

                    const navArray: ArchiveNavigation[] = [];
                    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                    // Convert map to sorted array
                    const sortedYears = Array.from(navMap.keys()).sort((a, b) => b - a);
                    for (const year of sortedYears) {
                        const monthsMap = navMap.get(year)!;
                        const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) => b - a);

                        navArray.push({
                            year,
                            months: sortedMonths.map(m => ({
                                month: m,
                                name: monthNames[m],
                                count: monthsMap.get(m)!
                            }))
                        });
                    }

                    setNavigation(navArray);
                }
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchNavigation();

        return () => { isMounted = false; };
    }, []);

    // 2. Fetch specific stories for selected Year & Month
    useEffect(() => {
        if (!selectedYear || !selectedMonth || !isSupabaseConfigured) {
            setIsLoadingStories(false);
            setStories([]);
            setTotalCount(0);
            return;
        }

        let isMounted = true;

        async function fetchStories() {
            try {
                setIsLoadingStories(true);

                // Create date range for the selected month
                const startDate = new Date(selectedYear!, selectedMonth! - 1, 1).toISOString();
                const endDate = new Date(selectedYear!, selectedMonth!, 0, 23, 59, 59, 999).toISOString();

                let query = supabase
                    .from('stories')
                    .select('*, authors:author_id(*)', { count: 'exact' })
                    .eq('status', 'published')
                    .gte('published_at', startDate)
                    .lte('published_at', endDate)
                    .order('published_at', { ascending: false });

                const from = (page - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;
                query = query.range(from, to);

                const { data, count, error } = await query;
                if (error) throw error;

                if (isMounted) {
                    setStories((data || []) as unknown as Story[]);
                    setTotalCount(count || 0);
                }
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                if (isMounted) setIsLoadingStories(false);
            }
        }

        fetchStories();

        return () => { isMounted = false; };
    }, [selectedYear, selectedMonth, page]);

    return {
        navigation,
        stories,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        isLoadingOverview: isLoading,
        isLoadingStories,
        error
    };
}
