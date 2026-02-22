import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story } from '@/types';

interface HomePageData {
    breakingStories: Story[];
    heroStory: Story | null;
    featuredStories: Story[];
    latestNews: Story[];
    latestFeatures: Story[];
    latestOpinions: Story[];
    mostRead: Story[];
    isLoading: boolean;
}

export function useHomePageData(): HomePageData {
    const [data, setData] = useState<HomePageData>({
        breakingStories: [],
        heroStory: null,
        featuredStories: [],
        latestNews: [],
        latestFeatures: [],
        latestOpinions: [],
        mostRead: [],
        isLoading: true,
    });

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setData((d) => ({ ...d, isLoading: false }));
            return;
        }

        async function fetchData() {
            try {
                const [
                    breakingRes,
                    heroRes,
                    featuredRes,
                    newsRes,
                    featuresRes,
                    opinionsRes,
                    mostReadRes,
                ] = await Promise.all([
                    // Breaking stories
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('is_breaking', true)
                        .eq('status', 'published')
                        .order('published_at', { ascending: false })
                        .limit(10),

                    // Hero: featured story with highest view_count
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('is_featured', true)
                        .eq('status', 'published')
                        .order('view_count', { ascending: false })
                        .limit(1)
                        .single(),

                    // Secondary featured (next 3 after hero)
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('is_featured', true)
                        .eq('status', 'published')
                        .order('view_count', { ascending: false })
                        .range(1, 3),

                    // Latest news
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('category', 'news')
                        .eq('status', 'published')
                        .order('published_at', { ascending: false })
                        .limit(6),

                    // Latest features
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('category', 'feature')
                        .eq('status', 'published')
                        .order('published_at', { ascending: false })
                        .limit(4),

                    // Latest opinions
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('category', 'opinion')
                        .eq('status', 'published')
                        .order('published_at', { ascending: false })
                        .limit(4),

                    // Most read this week
                    supabase
                        .from('stories')
                        .select('*, authors:author_id(*)')
                        .eq('status', 'published')
                        .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
                        .order('view_count', { ascending: false })
                        .limit(5),
                ]);

                setData({
                    breakingStories: (breakingRes.data as unknown as Story[]) ?? [],
                    heroStory: (heroRes.data as unknown as Story) ?? null,
                    featuredStories: (featuredRes.data as unknown as Story[]) ?? [],
                    latestNews: (newsRes.data as unknown as Story[]) ?? [],
                    latestFeatures: (featuresRes.data as unknown as Story[]) ?? [],
                    latestOpinions: (opinionsRes.data as unknown as Story[]) ?? [],
                    mostRead: (mostReadRes.data as unknown as Story[]) ?? [],
                    isLoading: false,
                });
            } catch (err) {
                console.error('Failed to fetch homepage data:', err);
                setData((d) => ({ ...d, isLoading: false }));
            }
        }

        fetchData();
    }, []);

    return data;
}
