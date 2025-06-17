// app/reset-password.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";

const API_URL = "https://childguardbackend.vercel.app";

const ResetPasswordScreen = () => {
    const { token } = useLocalSearchParams(); // from the ?token=abcdef123
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Invalid reset link.</Text>
            </View>
        );
    }


    const handleResetPassword = async () => {
        if (!password || password.length < 6) {
            Alert.alert("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/reset-password/${token}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Reset failed");
            }

            Alert.alert("Password reset successful!", "You can now log in.");
            router.replace("/login"); // or wherever your login screen is
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

            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Resetting..." : "Reset Password"}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ResetPasswordScreen;

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
});
