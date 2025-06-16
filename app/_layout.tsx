import { Slot, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatProvider from '../context/ChatProvider';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { useEffect, useState } from 'react';


export default function RootLayout() {


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ChatProvider>
                    <PaperProvider theme={DefaultTheme}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                            <Slot />
                        </Stack>
                    </PaperProvider>
                </ChatProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}