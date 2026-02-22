import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AuditLogEntry {
    id: string;
    entity_id: string;
    entity_type: string;
    action: string;
    description: string | null;
    user_id: string | null;
    created_at: string;
    // Joined user details
    user?: { name: string; email: string };
}

export function useAuditLogs(limit: number = 10) {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchLogs() {
            try {
                const { data, error } = await supabase
                    .from('audit_log')
                    .select('*, user:user_id(name, email)')
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (error) throw error;

                if (isMounted) {
                    setLogs((data || []) as unknown as AuditLogEntry[]);
                }
            } catch (err) {
                console.error("Error fetching audit logs:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchLogs();

        return () => { isMounted = false; };
    }, [limit]);

    return { logs, isLoading };
}

export function usePendingReviews() {
    const [stories, setStories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function fetchReviews() {
            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select('id, title, excerpt, authors:author_id(name)')
                    .eq('status', 'review')
                    .order('updated_at', { ascending: false })
                    .limit(5);

                if (error) throw error;

                if (isMounted) {
                    setStories(data || []);
                }
            } catch (err) {
                console.error("Error fetching pending reviews:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchReviews();

        return () => { isMounted = false; };
    }, []);

    return { stories, isLoading };
}
