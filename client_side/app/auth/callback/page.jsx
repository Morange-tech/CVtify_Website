'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthCallback() {
    const { data: session, status } = useSession();
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const handleSocialLogin = async () => {
            // Prevent double processing
            if (processing) return;
            
            // If already authenticated, go to dashboard
            if (isAuthenticated) {
                router.push('/dashboard');
                return;
            }

            // Wait for NextAuth to load
            if (status === 'loading') return;

            // If not authenticated with NextAuth, go to login
            if (status === 'unauthenticated') {
                router.push('/login');
                return;
            }

            // If authenticated with NextAuth, call Laravel API
            if (status === 'authenticated' && session) {
                setProcessing(true);

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            provider: session.provider || 'google',
                            provider_id: session.providerAccountId || session.user?.email,
                            name: session.user?.name,
                            email: session.user?.email,
                            avatar: session.user?.image,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || 'Login failed');
                    }

                    // Save token to localStorage
                    login(data.user, data.token);

                    // Sign out from NextAuth (we use stateless tokens)
                    await signOut({ redirect: false });

                    // Redirect to dashboard
                    router.push('/dashboard');

                } catch (err) {
                    console.error('Social login error:', err);
                    setError(err.message);
                    
                    // Sign out from NextAuth on error
                    await signOut({ redirect: false });
                    
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            }
        };

        handleSocialLogin();
    }, [session, status, login, router, isAuthenticated, processing]);

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    bgcolor: '#f8fafc',
                }}
            >
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                    Redirecting to login...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                bgcolor: '#f8fafc',
            }}
        >
            <CircularProgress size={48} sx={{ color: '#667eea' }} />
            <Typography variant="h6" color="#64748b">
                Completing login...
            </Typography>
            <Typography variant="body2" color="#94a3b8">
                Please wait while we set up your account
            </Typography>
        </Box>
    );
}