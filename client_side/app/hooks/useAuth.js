import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    loginUser,
    registerUser,
    logoutUser,
    getUser
} from '../lib/auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export function useAuth() {
    const context = useContext(AuthContext);
    const queryClient = useQueryClient();
    const router = useRouter();

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, token, loading, login, logout, updateUser, isAuthenticated } = context;

    // Get user query
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: isAuthenticated,  // Only run if logged in
        retry: false,
        staleTime: 5 * 60 * 1000
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data.user, data.token);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: registerUser,
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            handleLogoutSuccess();
        },
        onError: () => {
            // Still logout locally even if API fails
            handleLogoutSuccess();
        }
    });

    const handleLogoutSuccess = async () => {
        // Clear local storage
        logout();

        // Clear React Query cache
        queryClient.clear();

        // Also sign out from NextAuth (for social logins)
        await signOut({ redirect: false });

        // Redirect to login
        router.push('/login');
    };

    return {
        user,
        token,
        loading,
        isAuthenticated,

        // Queries
        userQuery,

        // Mutations
        loginMutation,
        registerMutation,
        logoutMutation,
        login,
        updateUser,
        logout: handleLogoutSuccess
    };
}