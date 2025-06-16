import { Slot, Stack } from "expo-router";


export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[token]" options={{ headerShown: false }} />

        </Stack>
    )
}
