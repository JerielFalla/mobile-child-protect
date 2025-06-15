import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getHasSeenOnboarding } from '../lib/storage';
import { resetOnboarding } from '../lib/storage';

export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reset = async () => {
            await resetOnboarding();
            console.log("Onboarding reset");
        };
        reset();
    }, []);

    useEffect(() => {
        const checkOnboarding = async () => {
            const hasSeen = await getHasSeenOnboarding();
            if (hasSeen) {
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
