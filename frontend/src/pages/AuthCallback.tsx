import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/services/supabase';

/**
 * OAuth callback handler page.
 * Processes the auth callback and redirects to dashboard.
 */
export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            // Get the hash params (Supabase returns tokens in the URL hash)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken && refreshToken) {
                // Set the session manually
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (error) {
                    console.error('Auth callback error:', error);
                    navigate('/login');
                    return;
                }
            }

            // Redirect to dashboard
            navigate('/dashboard');
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-gray-400">Completing sign in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
