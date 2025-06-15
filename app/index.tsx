import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { hasSeenOnboarding } from '../lib/storage';

import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            const onboarded = await hasSeenOnboarding();
            if (onboarded) {
                router.replace('/(auth)/login');
            } else {
                router.replace('/onboarding');
            }
            setLoading(false);
        };
        checkOnboarding();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#21285c" />
            </View>
        );
    }

    return null;
}
