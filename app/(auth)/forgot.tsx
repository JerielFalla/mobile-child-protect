import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";

const API_URL = "https://childguardbackend.vercel.app";

export default function ForgotScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRequestReset = async () => {
        if (!email) return Alert.alert("Please enter your email");

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/request-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send code");

            Alert.alert("Code Sent", "Check your email for the reset code");
            router.push({ pathname: "/reset", params: { email } });
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handleRequestReset} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Code"}</Text>
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
