// app/(auth)/otp.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Button, Icon } from "@rneui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";

import { firebaseConfig } from "../../lib/firebaseConfig";
import { useRef } from "react";


const API_URL = "https://childguardbackend.vercel.app/";

export default function OTP() {
    const router = useRouter();
    const { name, email, password, phone, validId, selfie } = useLocalSearchParams<{
        name: string;
        email: string;
        password: string;
        phone: string;
        validId: string;
        selfie: string;
    }>();

    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingOTP, setSendingOTP] = useState(false);



    useEffect(() => {
        if (phone) sendVerificationCode();
    }, []);

    const sendVerificationCode = async () => {
        if (!phone) {
            Alert.alert("Invalid Phone", "Please enter your phone number.");
            return;
        }

        // 🔁 Auto-convert 09... to +639...
        let formattedPhone = phone.trim();
        if (formattedPhone.startsWith("0")) {
            formattedPhone = "+63" + formattedPhone.slice(1); // "0..." → "+63..."
        } else if (!formattedPhone.startsWith("+")) {
            Alert.alert("Invalid Phone", "Phone number must start with 09 or +63");
            return;
        }

        try {
            setSendingOTP(true);
            const provider = new PhoneAuthProvider(auth);

            console.log("Sending OTP to:", formattedPhone);

            const verificationId = await provider.verifyPhoneNumber(
                formattedPhone,

            );
            setVerificationId(verificationId);

            Alert.alert("OTP Sent", "We sent a code to " + formattedPhone);
        } catch (error: any) {
            console.error("OTP error:", error);
            Alert.alert("Error sending OTP", error.message);
        } finally {
            setSendingOTP(false);
        }
    };
    const handleVerifyCode = async () => {
        if (!verificationId || code.length !== 6) return;

        setLoading(true);
        try {
            const credential = PhoneAuthProvider.credential(verificationId, code);
            await signInWithCredential(auth, credential);

            // ✅ Phone verified – send data to backend
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone, validId, selfie }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Signup failed");

            Alert.alert("Success", "Signup complete!");
            router.replace("/login");
        } catch (err: any) {
            Alert.alert("Verification Failed", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : undefined}
        >

            {/* Back button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Icon name="chevron-left" type="feather" size={28} />
            </TouchableOpacity>

            <Text style={styles.title}>Phone Verification</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to {phone}</Text>

            {sendingOTP ? (
                <ActivityIndicator size="large" color="#21285c" />
            ) : (
                <>
                    <TextInput
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder="Enter OTP"
                        style={styles.input}
                    />

                    <Button
                        title="Verify & Continue"
                        onPress={handleVerifyCode}
                        buttonStyle={styles.button}
                        disabled={loading || code.length < 6}
                        loading={loading}
                    />

                    <TouchableOpacity onPress={sendVerificationCode}>
                        <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                </>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f8f9fb" },
    title: { fontSize: 28, fontWeight: "600", marginBottom: 8, textAlign: "center" },
    subtitle: { fontSize: 16, color: "#444", marginBottom: 24, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        fontSize: 18,
        textAlign: "center",
        letterSpacing: 8,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#21285c",
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 16,
    },
    resendText: {
        color: "#21285c",
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 16,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 1,
    },
});
