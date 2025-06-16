import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                // // 🔧 TEMPORARY: Clear storage to reset onboarding
                // await AsyncStorage.clear();
                // console.log('AsyncStorage cleared');

                const value = await AsyncStorage.getItem('onboardingCompleted');
                setIsOnboardingCompleted(value === 'true');
            } catch (e) {
                console.log('Error reading onboarding status', e);
            } finally {
                setIsLoading(false);
            }
        };

        checkOnboardingStatus();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isOnboardingCompleted) {
        return <Redirect href="/login" />;  // 👈 Or your actual home/login screen
    } else {
        return <Redirect href="/(onboarding)" />;  // 👈 Your onboarding screen
    }
}
