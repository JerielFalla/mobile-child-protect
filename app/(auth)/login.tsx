import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Image, Text, Alert } from "react-native";
import { Button, Input } from "@rneui/themed";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = "http://192.168.18.16:5000"; // Replace with your backend URL

export default function Auth() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("LOGIN RESPONSE:", data);
            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Save userId and token to AsyncStorage
            // Save userId (and optionally token, name, email)
            await AsyncStorage.setItem('userId', data.userId.toString());
            await AsyncStorage.setItem('token', data.chatToken);
            await AsyncStorage.setItem('name', data.name);
            await AsyncStorage.setItem('email', data.email);
            await AsyncStorage.setItem('phone', data.phone);

            console.log("chatToken:", data.chatToken);

            Alert.alert("Success", "Login successful!");
            router.replace("/home");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.bgimage}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            resizeMode="contain"
                            source={require("../../assets/img/newlogo.png")}
                        />
                    </View>
                    <Text style={styles.loginTitle}>Login</Text>
                    <View style={styles.form}>
                        <Input
                            label="Email"
                            leftIcon={{ type: "font-awesome", name: "envelope", size: 22 }}
                            placeholder="email@address.com"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            labelStyle={styles.label}
                            placeholderTextColor="#333"
                            selectionColor="#333"
                        />
                        <Input
                            label="Password"
                            leftIcon={{ type: "font-awesome", name: "lock", size: 28 }}
                            secureTextEntry
                            placeholder="Password"
                            autoCapitalize="none"
                            value={password}
                            onChangeText={setPassword}
                            labelStyle={styles.label}
                            placeholderTextColor="#333"
                            selectionColor="#333"
                        />
                        <Button
                            title={loading ? "Signing in..." : "Sign in"}
                            buttonStyle={styles.signinButton}
                            titleStyle={styles.buttonTitle}
                            onPress={handleLogin}
                            disabled={loading}
                        />
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <Pressable onPress={() => router.replace('/signup')}>
                                <Text style={styles.signupLink}>Signup here.</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        paddingHorizontal: 20,
    },
    bgimage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 180,
        height: 180,
        marginTop: -50,
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#000000",
        alignSelf: "flex-start",
        marginLeft: 10,
    },
    form: {
        width: "100%",
    },
    label: {
        color: "#333",
    },
    signinButton: {
        backgroundColor: "#21285c",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
    },
    signupLink: {
        fontSize: 18,
        color: "#2a5d9c",
        fontWeight: "bold",
    },
});