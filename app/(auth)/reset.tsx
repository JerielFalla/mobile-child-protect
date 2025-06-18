import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_URL = "https://childguardbackend.vercel.app";

export default function ResetScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!code || !password || !confirm)
            return Alert.alert("All fields are required");

        if (password !== confirm)
            return Alert.alert("Passwords do not match");

        if (password.length < 6)
            return Alert.alert("Password must be at least 6 characters");

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/verify-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Reset failed");

            Alert.alert("Success", "Password reset successful");
            router.replace("/login");
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Your Password</Text>
            <TextInput
                placeholder="6-digit code"
                keyboardType="numeric"
                maxLength={6}
                style={styles.input}
                value={code}
                onChangeText={setCode}
            />
            <TextInput
                placeholder="New Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
            />
            <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Resetting..." : "Reset Password"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
    button: { backgroundColor: "#21285c", padding: 15, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
});
