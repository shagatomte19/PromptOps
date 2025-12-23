/**
 * Authentication context using Supabase Auth.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';

interface AuthContextType {
    user: SupabaseUser | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signInWithGitHub: () => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    }, []);

    const signUpWithEmail = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error };
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    }, []);

    const signInWithGitHub = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    }, []);

    const value: AuthContextType = {
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
