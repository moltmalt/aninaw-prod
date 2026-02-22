import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url');

if (!isConfigured) {
    console.warn(
        '[Aninaw] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
}

// Use a placeholder URL when not configured to prevent createClient from throwing
export const supabase: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl && supabaseUrl !== 'your-supabase-url' ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseAnonKey && supabaseAnonKey !== 'your-supabase-anon-key' ? supabaseAnonKey : 'placeholder-key'
);

export { isConfigured as isSupabaseConfigured };
