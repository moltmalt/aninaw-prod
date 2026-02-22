import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DashboardStats {
    totalStories: number;
    monthStories: number;
    pendingDrafts: number;
    monthViews: number;
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStories: 0,
        monthStories: 0,
        pendingDrafts: 0,
        monthViews: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchStats() {
            try {
                // Total Published Stories
                const { count: totalCount } = await supabase
                    .from('stories')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'published');

                // Published This Month
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const { count: monthCount } = await supabase
                    .from('stories')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'published')
                    .gte('published_at', startOfMonth.toISOString());

                // Drafts Pending Review
                const { count: pendingCount } = await supabase
                    .from('stories')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'review');

                // Total Views This Month (Simplification: sum over all stories vs actual TS logging)
                // For a real app, this would be an aggregate query over an analytics table.
                // We'll approximate by pulling a sum from an RPC or just summing local rows.
                // Since this is a simple setup, we'll try a fast fetch of published views 
                // and just sum them (or we can define an RPC `get_total_views`).
                let monthViews = 0;
                const { data: viewsData } = await supabase
                    .from('stories')
                    .select('view_count')
                    .eq('status', 'published');

                if (viewsData) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    monthViews = viewsData.reduce((acc: number, row: any) => acc + (row.view_count || 0), 0);
                }

                if (isMounted) {
                    setStats({
                        totalStories: totalCount || 0,
                        monthStories: monthCount || 0,
                        pendingDrafts: pendingCount || 0,
                        monthViews: monthViews
                    });
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchStats();

        return () => { isMounted = false; };
    }, []);

    return { stats, isLoading };
}
