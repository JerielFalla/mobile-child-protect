// app/_layout.tsx
import { Slot, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatProvider from '../context/ChatProvider';
import { Provider as PaperProvider, Portal, DefaultTheme } from 'react-native-paper';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ChatProvider>
                    <PaperProvider theme={DefaultTheme}>
                        <Stack>
                            <Stack.Screen name="(auth)" options={{ headerShown: false, }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
                            <Stack.Screen name="(drawer)" options={{ headerShown: false, }} />
                            <Slot />
                        </Stack>

                    </PaperProvider>
                </ChatProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
