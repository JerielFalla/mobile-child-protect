import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Button, Input } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import Checkbox from "expo-checkbox";

const API_URL = "https://childguardbackend.vercel.app/";

export default function Auth() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [validId, setValidID] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.6,
        });

        if (!result.canceled) {
            setValidID(result.assets[0].uri);
        }
    };

    const removeImage = () => setValidID(null);


    const takeSelfie = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if (!result.canceled) {
            setSelfie(result.assets[0].uri);
        }
    };

    const removeSelfie = () => setSelfie(null);



    const handleSignup = async () => {
        if (!name || !email || !password || !validId || !selfie || !phone) {
            Alert.alert("Error", "Please fill in all fields and upload a valid ID");
            return;
        }

        if (!agreed) {
            Alert.alert("Terms Required", "Please agree to the Terms and Conditions before signing up.");
            return;
        }

        setLoading(true);
        try {
            const base64ID = await FileSystem.readAsStringAsync(validId, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const base64Selfie = await FileSystem.readAsStringAsync(selfie, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Navigate to OTP screen with all data
            router.push({
                pathname: "/otp",
                params: {
                    name,
                    email,
                    password,
                    phone,
                    validId: base64ID,
                    selfie: base64Selfie,
                },
            });
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Removed logo */}

                <Text style={styles.title}>Signup</Text>

                <View style={styles.form}>
                    <Input
                        label="Name"
                        leftIcon={{ type: "font-awesome", name: "user", size: 22 }}
                        onChangeText={setName}
                        value={name}
                        placeholder="Enter your full name"
                        autoCapitalize="none"
                        labelStyle={styles.label}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.inputText}
                    />
                    <Input
                        label="Email"
                        leftIcon={{ type: "font-awesome", name: "envelope", size: 22 }}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Enter your email"
                        autoCapitalize="none"
                        labelStyle={styles.label}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.inputText}
                    />
                    <Input
                        label="Password"
                        leftIcon={{ type: "font-awesome", name: "lock", size: 22 }}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                        placeholder="Enter your password"
                        autoCapitalize="none"
                        labelStyle={styles.label}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.inputText}
                    />
                    <Input
                        label="Phone Number"
                        leftIcon={{ type: "font-awesome", name: "phone", size: 22 }}
                        onChangeText={(text) => {
                            // Remove any non-digit characters and limit to 11 digits
                            const cleaned = text.replace(/[^0-9]/g, '').slice(0, 11);
                            setPhone(cleaned);
                        }}
                        value={phone}
                        placeholder="Enter your phone number"
                        autoCapitalize="none"
                        labelStyle={styles.label}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.inputText}
                    />

                    {/* Attachment-style valid ID picker */}
                    <TouchableOpacity
                        style={[styles.attachmentBox, validId && styles.attachmentBoxActive]}
                        onPress={validId ? undefined : pickImage}
                        activeOpacity={validId ? 1 : 0.7}
                    >
                        {validId ? (
                            <View style={styles.attachmentContent}>
                                <Text style={styles.attachmentText}>✅ Valid ID attached</Text>
                                <TouchableOpacity onPress={removeImage} style={styles.removeBtn}>
                                    <Text style={styles.removeBtnText}>✕ Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.attachmentPlaceholder}>📎 Attach Valid ID</Text>
                        )}
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[styles.attachmentBox, selfie && styles.attachmentBoxActive]}
                        onPress={selfie ? undefined : takeSelfie}
                        activeOpacity={selfie ? 1 : 0.7}
                    >
                        {selfie ? (
                            <View style={styles.attachmentContent}>
                                <Text style={styles.attachmentText}>📸 Take a Selfie with your valid ID</Text>
                                <TouchableOpacity onPress={removeSelfie} style={styles.removeBtn}>
                                    <Text style={styles.removeBtnText}>✕ Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.attachmentPlaceholder}>📷 Take a Selfie</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.termsContainer}>
                        <Checkbox
                            status={agreed ? 'checked' : 'unchecked'}
                            onPress={() => setAgreed(!agreed)}
                        />
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>
                                Terms and Conditions
                            </Text>
                        </Text>
                    </View>

                    {/* Removed Change Valid ID button */}

                    <Button
                        title="Sign up"
                        buttonStyle={styles.signUpButton}
                        onPress={handleSignup}
                        loading={loading}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.replace("/login")}>
                        <Text style={styles.footerLink}>Sign in here.</Text>
                    </TouchableOpacity>
                </View>
                {/* Terms Modal */}
                <Modal visible={showTerms} animationType="slide" onRequestClose={() => setShowTerms(false)}>
                    <View style={styles.modalContainer}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Terms and Conditions</Text>
                            <Text style={styles.modalText}>

                                1. Agreement to Terms
                                {"\n\n"}By using the ChildGuard mobile application, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this application.

                                {"\n\n"}2. User Responsibilities
                                {"\n"}- Provide accurate and truthful information, including valid IDs and selfies.
                                {"\n"}- Ensure that your account credentials are kept secure and confidential.
                                {"\n"}- Refrain from using the application for unlawful or unauthorized purposes.

                                {"\n\n"}3. Prohibited Activities
                                {"\n"}- Submitting false reports or abuse claims.
                                {"\n"}- Attempting to breach the security features of the application.
                                {"\n"}- Misusing the educational resources or sharing them without proper acknowledgment.

                                {"\n\n"}4. Suspension or Termination of Use
                                {"\n"}ChildGuard reserves the right to suspend or terminate user access to the application at any time if these Terms are violated.

                                {"\n\n"}5. Modifications to Terms
                                {"\n"}ChildGuard may revise these Terms periodically. Continued use of the app constitutes acceptance of the updated Terms.

                                {"\n\n"}Privacy Policy

                                {"\n\n"}1. Data Collection
                                {"\n"}We collect the following data for verification and functionality purposes:
                                - Personal details, including name, email, and phone number.
                                - Valid government-issued ID and selfie for user verification.
                                - Usage data to improve the application and provide personalized experiences.

                                {"\n\n"}2. Use of Information
                                {"\n"}Your data will be used to:
                                - Verify user identity to prevent fraudulent accounts.
                                - Process reports and ensure case management integrity.
                                - Improve user experience and develop new features.

                                {"\n\n"}3. Data Sharing
                                {"\n"}ChildGuard will not share your personal information with third parties except in the following cases:
                                - Legal requirements or court orders.
                                - Cases requiring law enforcement intervention.
                                - User authorization for specific sharing.

                                {"\n\n"}4. Data Security
                                {"\n"}ChildGuard implements strict security measures to protect your personal data, including encryption, secure storage, and regular audits.

                                {"\n\n"}5. Your Rights
                                {"\n"}Users have the right to:
                                - Access and review their data.
                                - Request data deletion or correction.
                                - Withdraw consent for data usage (note: this may limit app functionality).

                                {"\n\n"}6. Contact Information
                                {"\n"}If you have questions about our Privacy Policy, please contact us at support@childguard.com.

                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowTerms(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    // Removed logo style

    title: {
        fontSize: 36,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: 'center',
        marginLeft: 8,
        color: "#2e2e2e",
    },
    form: {
        width: "100%",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
        color: "#2e2e2e",
    },
    inputContainer: {
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    inputText: {
        fontSize: 16,
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    signUpButton: {
        backgroundColor: "#21285c",
        borderRadius: 10,
        paddingVertical: 12,
        marginTop: 16,
    },
    footer: {
        flexDirection: "row",
        marginTop: 16,
        justifyContent: "center",
    },
    footerText: {
        fontSize: 16,
        color: "#333",
    },
    footerLink: {
        fontSize: 16,
        color: "#2a5d9c",
        marginLeft: 6,
        fontWeight: "600",
    },
    attachmentBox: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderStyle: "dashed",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    attachmentBoxActive: {
        borderColor: "#3CB371",
        backgroundColor: "#e6f5ea",
    },
    attachmentPlaceholder: {
        fontSize: 15,
        color: "#888",
    },
    attachmentContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 8,
    },
    attachmentText: {
        fontSize: 15,
        color: "#3CB371",
        fontWeight: "600",
    },
    removeBtn: {
        padding: 6,
    },
    removeBtnText: {
        fontSize: 14,
        color: "#d9534f",
        fontWeight: "600",
    },
    termsContainer: { flexDirection: "row", alignItems: "center", marginVertical: 0 },
    termsText: { marginLeft: 8, fontSize: 14, color: "#333" },
    termsLink: { color: "#2a5d9c", fontWeight: "bold" },
    modalContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
    modalContent: { flex: 1 },
    modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
    modalText: { fontSize: 16, lineHeight: 22 },
    closeButton: { backgroundColor: "#21285c", padding: 14, borderRadius: 8, marginTop: 20 },
    closeButtonText: { color: "#fff", textAlign: "center", fontWeight: "600" }
});
