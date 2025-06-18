import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                    <Ionicons name="arrow-back" size={24} color="#21285c" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Forgot Password</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.instruction}>Enter your email to receive a code</Text>

                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRequestReset}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Sending..." : "Send Code"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/login")}
                >
                    <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#2e2e2e",
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    instruction: {
        fontSize: 16,
        color: "#555",
        marginBottom: 12,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#21285c",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    backButton: {
        marginTop: 20,
        alignItems: "center",
    },
    backButtonText: {
        color: "#2e2e2e",
        fontWeight: "bold",
    },
});
