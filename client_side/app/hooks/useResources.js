'use client';

import { useCallback, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
    cvGuides: [],
    coverLetterTips: [],
    interviewPrep: [],
    careerAdvice: [],
    faqs: [],
};

export default function useResources() {
    const [data, setData] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(`${API_URL}/resources`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
            });

            let result = {};
            try {
                result = await res.json();
            } catch {
                result = {};
            }

            if (!res.ok) {
                throw new Error(result?.message || `Failed to load resources (${res.status})`);
            }

            setData({
                cvGuides: result?.data?.cvGuides || [],
                coverLetterTips: result?.data?.coverLetterTips || [],
                interviewPrep: result?.data?.interviewPrep || [],
                careerAdvice: result?.data?.careerAdvice || [],
                faqs: result?.data?.faqs || [],
            });
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    return {
        ...data,
        loading,
        error,
        refetch: fetchResources,
    };
}
