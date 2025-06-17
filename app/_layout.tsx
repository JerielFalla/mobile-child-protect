import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import ChatProvider from "../context/ChatProvider";

export default function RootLayout() {
    useEffect(() => {
        const checkInitialUrl = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                console.log("🔗 App opened from deep link:", initialUrl);
            }
        };
        checkInitialUrl();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ChatProvider>
                    <PaperProvider theme={DefaultTheme}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(drawer)" />
                            <Stack.Screen name="(onboarding)" />
                        </Stack>
                    </PaperProvider>
                </ChatProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
