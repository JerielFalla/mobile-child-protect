import React, { useState } from "react";
import { StyleSheet, View, Image, Text, Alert } from "react-native";
import { Button, Input } from "@rneui/themed";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";


const API_URL = "http://192.168.18.16:5000";

export default function Auth() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/signup`, {  // Fix: Use backticks here
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Signup failed");
            }

            Alert.alert("Success", "Signup successful!", [
                { text: "OK", onPress: () => router.replace("/login") }
            ]);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require("../../assets/img/familytimelogo.png")}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Signup</Text>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        leftIcon={{ type: "font-awesome", name: "envelope", size: 22 }}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Enter your email"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Password"
                        leftIcon={{ type: "font-awesome", name: "lock", size: 28 }}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                        placeholder="Enter your password"
                        autoCapitalize="none"
                    />
                    <Button title="Sign up" buttonStyle={styles.signUpButton} onPress={handleSignup} loading={loading} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.replace('/login')}>
                        <Text style={styles.footerLink}>Sign in here.</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FA",
        paddingHorizontal: 20,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: -20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: "flex-start",
        marginLeft: 10,
    },
    form: {
        width: "100%",
    },
    signUpButton: {
        backgroundColor: "#2a5d9c",
        borderRadius: 10,
        paddingVertical: 12,
    },
    footer: {
        flexDirection: "row",
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
    },
    footerLink: {
        fontSize: 16,
        color: "#2a5d9c",
        marginLeft: 5,
        fontWeight: "bold",
    },
});