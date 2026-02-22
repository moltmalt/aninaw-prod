import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { UserRole } from '@/types';

interface AuthState {
    user: User | null;
    role: UserRole | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    session: null,
    isLoading: true,

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        set({
            user: data.user,
            session: data.session,
            role: (data.user?.user_metadata?.role as UserRole) ?? 'contributor',
        });
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, role: null, session: null });
    },

    initialize: () => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({
                user: session?.user ?? null,
                session,
                role: (session?.user?.user_metadata?.role as UserRole) ?? null,
                isLoading: false,
            });
        }).catch(() => {
            set({ isLoading: false });
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            set({
                user: session?.user ?? null,
                session,
                role: (session?.user?.user_metadata?.role as UserRole) ?? null,
                isLoading: false,
            });
        });

        // Return unsubscribe function for cleanup
        return () => {
            subscription.unsubscribe();
        };
    },
}));
