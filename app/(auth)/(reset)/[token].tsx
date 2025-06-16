// app/reset/[token].tsx
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const API_URL = "https://childguardbackend.vercel.app";

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        if (!password || password.length < 6)
            return Alert.alert("Password must be at least 6 characters");

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");

            Alert.alert("Success", "Your password has been reset");
            router.replace("/login");
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set New Password</Text>
            <TextInput
                placeholder="Enter new password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            <Button title={loading ? "Resetting..." : "Reset Password"} onPress={handleReset} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 20 },
});
