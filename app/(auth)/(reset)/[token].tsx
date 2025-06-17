import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

const API_URL = "https://childguardbackend.vercel.app";

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!password || password.length < 6) {
            return Alert.alert("Password must be at least 6 characters");
        }

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
            <Text style={styles.title}>Reset Your Password</Text>
            <TextInput
                placeholder="Enter new password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleReset}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        height: 50,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#2979ff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});
