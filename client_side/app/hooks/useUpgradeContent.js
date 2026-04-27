'use client';

import { useCallback, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
    plans: {},
    faqs: [],
};

export default function useUpgradeContent() {
    const [data, setData] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUpgradeContent = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');

            const res = await fetch(`${API_URL}/upgrade-content`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            let result = {};
            try {
                result = await res.json();
            } catch {
                result = {};
            }

            if (!res.ok) {
                throw new Error(result?.message || `Failed to load upgrade content (${res.status})`);
            }

            setData({
                plans: result?.data?.plans || {},
                faqs: result?.data?.faqs || [],
            });
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUpgradeContent();
    }, [fetchUpgradeContent]);

    return {
        plans: data.plans,
        faqs: data.faqs,
        loading,
        error,
        refetch: fetchUpgradeContent,
    };
}