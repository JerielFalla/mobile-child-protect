import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import { Button, Input } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { Icon } from 'react-native-elements';

const API_URL = "https://childguardbackend.vercel.app"; // REMOVE extra slash!

export default function Auth() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [validId, setValidID] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [agreedPrivacy, setAgreedPrivacy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

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
        if (!name || !email || !password || !validId || !selfie || !phone || !age || !gender) {
            Alert.alert("Error", "Please fill in all fields and upload a valid ID");
            return;
        }

        if (!agreedTerms) {
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

            const payload = {
                name,
                email,
                password,
                phone,
                age,
                gender,
                validId: base64ID,
                selfie: base64Selfie,
            };

            const res = await axios.post(`${API_URL}/signup`, payload);

            if (res.status === 201) {
                Alert.alert("Success", "Signup successful! Your account is pending approval.");
                router.replace("/login");
            }
        } catch (error: any) {
            console.log("Signup error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.error || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Text style={styles.title}>Signup</Text>
                    <View style={styles.form}>
                        <Input label="Name" leftIcon={{ type: "font-awesome", name: "user", size: 22 }}
                            onChangeText={setName} value={name} placeholder="Enter your full name"
                            autoCapitalize="none" labelStyle={styles.label}
                            inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} />
                        <Input label="Email" leftIcon={{ type: "font-awesome", name: "envelope", size: 22 }}
                            onChangeText={setEmail} value={email} placeholder="Enter your email"
                            autoCapitalize="none" labelStyle={styles.label}
                            inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} />
                        <Input
                            label="Password"
                            leftIcon={{ type: "font-awesome", name: "lock", size: 22 }}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Icon
                                        type="font-awesome"
                                        name={!showPassword ? "eye-slash" : "eye"}
                                        size={20}
                                        color="#555"
                                    />
                                </TouchableOpacity>
                            }
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={!showPassword}
                            placeholder="Enter your password"
                            autoCapitalize="none"
                            labelStyle={styles.label}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={styles.inputText}
                        />

                        <Input label="Phone Number" leftIcon={{ type: "font-awesome", name: "phone", size: 22 }}
                            onChangeText={(text) => {
                                const cleaned = text.replace(/[^0-9]/g, '').slice(0, 11);
                                setPhone(cleaned);
                            }}
                            value={phone} placeholder="Enter your phone number"
                            autoCapitalize="none" labelStyle={styles.label}
                            inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} />

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Age"
                                    leftIcon={{ type: "font-awesome", name: "calendar", size: 20 }}
                                    onChangeText={setAge}
                                    value={age}
                                    placeholder="Age"
                                    keyboardType="numeric"
                                    labelStyle={styles.label}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={styles.inputText}
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Gender"
                                    leftIcon={{ type: "font-awesome", name: "venus-mars", size: 20 }}
                                    onChangeText={setGender}
                                    value={gender}
                                    placeholder="Gender"
                                    labelStyle={styles.label}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={styles.inputText}
                                />
                            </View>
                        </View>

                        {/* Valid ID Picker */}
                        <TouchableOpacity style={[styles.attachmentBox, validId && styles.attachmentBoxActive]}
                            onPress={validId ? undefined : pickImage} activeOpacity={validId ? 1 : 0.7}>
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

                        {/* Selfie Picker */}
                        <TouchableOpacity style={[styles.attachmentBox, selfie && styles.attachmentBoxActive]}
                            onPress={selfie ? undefined : takeSelfie} activeOpacity={selfie ? 1 : 0.7}>
                            {selfie ? (
                                <View style={styles.attachmentContent}>
                                    <Text style={styles.attachmentText}>📸 Selfie attached</Text>
                                    <TouchableOpacity onPress={removeSelfie} style={styles.removeBtn}>
                                        <Text style={styles.removeBtnText}>✕ Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.attachmentPlaceholder}>📷 Take a Selfie</Text>
                            )}
                        </TouchableOpacity>

                        {/* Terms and Conditions */}
                        <View style={styles.termsContainer}>
                            <Checkbox value={agreedTerms} onValueChange={setAgreedTerms} />
                            <TouchableOpacity onPress={() => setShowTerms(true)}>
                                <Text style={[styles.termsText, styles.termsLink]}>
                                    I agree to the Terms and Conditions
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Privacy Policy */}
                        <View style={styles.termsContainer}>
                            <Checkbox value={agreedPrivacy} onValueChange={setAgreedPrivacy} />
                            <TouchableOpacity onPress={() => setShowPrivacy(true)}>
                                <Text style={[styles.termsText, styles.termsLink]}>
                                    I agree to the Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button title="Sign up" buttonStyle={styles.signUpButton} onPress={handleSignup} loading={loading} disabled={!agreedTerms || !agreedPrivacy} />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace("/login")}>
                            <Text style={styles.footerLink}>Sign in here.</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Terms and Condition Modal */}
                <Modal visible={showTerms} animationType="slide" transparent={true}>
                    <TouchableWithoutFeedback onPress={() => setShowTerms(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <View style={styles.modalWrapper}>
                                    <ScrollView
                                        style={{ maxHeight: '100%' }}
                                        contentContainerStyle={[styles.modalContent]}
                                        showsVerticalScrollIndicator={true}
                                        bounces={false}
                                        persistentScrollbar={true}>

                                        <Text style={styles.modalTitle}>Terms and Conditions</Text>

                                        <Text style={styles.modalSectionTitle}>1. Agreement to Terms</Text>
                                        <Text style={styles.modalText}>By using the ChildGuard mobile application, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this application.</Text>

                                        <Text style={styles.modalSectionTitle}>2. User Responsibilities</Text>
                                        <Text style={styles.modalText}>- Provide accurate and truthful information, including valid IDs and selfies.</Text>
                                        <Text style={styles.modalText}>- Ensure that your account credentials are kept secure and confidential.</Text>
                                        <Text style={styles.modalText}>- Refrain from using the application for unlawful or unauthorized purposes.</Text>

                                        <Text style={styles.modalSectionTitle}>3. Prohibited Activities</Text>
                                        <Text style={styles.modalText}>- Submitting false reports or abuse claims.</Text>
                                        <Text style={styles.modalText}>- Attempting to breach the security features of the application.</Text>
                                        <Text style={styles.modalText}>- Misusing the educational resources or sharing them without proper acknowledgment.</Text>

                                        <Text style={styles.modalSectionTitle}>4. Suspension or Termination of Use</Text>
                                        <Text style={styles.modalText}>ChildGuard reserves the right to suspend or terminate user access to the application at any time if these Terms are violated.</Text>

                                        <Text style={styles.modalSectionTitle}>5. Modifications to Terms</Text>
                                        <Text style={styles.modalText}>ChildGuard may revise these Terms periodically. Continued use of the app constitutes acceptance of the updated Terms.</Text>

                                        <Text style={styles.modalTitle}>Privacy Policy</Text>

                                        <Text style={styles.modalSectionTitle}>1. Data Collection</Text>
                                        <Text style={styles.modalText}>We collect personal details, ID, selfie, and usage data for verification and functionality purposes.</Text>

                                        <Text style={styles.modalSectionTitle}>2. Use of Information</Text>
                                        <Text style={styles.modalText}>Your data will be used to verify identity, process reports, and improve user experience.</Text>

                                        <Text style={styles.modalSectionTitle}>3. Data Sharing</Text>
                                        <Text style={styles.modalText}>Data will only be shared for legal, law enforcement, or user-authorized reasons.</Text>

                                        <Text style={styles.modalSectionTitle}>4. Data Security</Text>
                                        <Text style={styles.modalText}>We implement strict security measures like encryption, secure storage, and audits.</Text>

                                        <Text style={styles.modalSectionTitle}>5. Your Rights</Text>
                                        <Text style={styles.modalText}>Users may access, correct, delete data, or withdraw consent (may affect functionality).</Text>

                                        <Text style={styles.modalSectionTitle}>6. Contact Information</Text>
                                        <Text style={styles.modalText}>For questions, contact support@childguard.com.</Text>

                                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowTerms(false)}>
                                            <Text style={styles.closeButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>

                </Modal>

                {/* Privacy Policy Modal */}
                <Modal visible={showPrivacy} animationType="slide" transparent={true}>
                    <TouchableWithoutFeedback onPress={() => setShowPrivacy(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <View style={styles.modalWrapper}>
                                    <ScrollView
                                        contentContainerStyle={styles.modalContent}
                                        showsVerticalScrollIndicator={true}
                                        bounces={false}
                                        persistentScrollbar={true}>
                                        <Text style={styles.modalTitle}>Privacy Policy</Text>

                                        <Text style={styles.modalSectionTitle}>1. Data Collection</Text>
                                        <Text style={styles.modalText}>
                                            We collect your name, contact details, ID images, and usage behavior for verification and safety purposes.
                                        </Text>

                                        <Text style={styles.modalSectionTitle}>2. Use of Data</Text>
                                        <Text style={styles.modalText}>
                                            Your data will only be used to verify identity, process reports, and improve the ChildGuard app’s features.
                                        </Text>

                                        <Text style={styles.modalSectionTitle}>3. Data Sharing</Text>
                                        <Text style={styles.modalText}>
                                            We will never sell your data. It will only be shared with authorities when legally required.
                                        </Text>

                                        <Text style={styles.modalSectionTitle}>4. Security Measures</Text>
                                        <Text style={styles.modalText}>
                                            We implement encryption, access restrictions, and secure storage practices to protect your data.
                                        </Text>

                                        <Text style={styles.modalSectionTitle}>5. Your Rights</Text>
                                        <Text style={styles.modalText}>
                                            You can request access, corrections, or deletion of your data by emailing support@childguard.com.
                                        </Text>

                                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowPrivacy(false)}>
                                            <Text style={styles.closeButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ScrollView>

        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 20,
        backgroundColor: "#F5F7FA",
    },
    container: {
        flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FA", paddingHorizontal: 24, paddingVertical: 16,
    },
    title: {
        fontSize: 36, fontWeight: "600", marginBottom: 16, textAlign: 'center', marginLeft: 8, color: "#2e2e2e"
    },
    form: {
        width: "100%"
    },
    label: {
        fontSize: 16, fontWeight: "600",// marginBottom: 2,color: "#2e2e2e"
    },
    inputContainer: {
        paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: -5,
    },
    inputText: {
        fontSize: 16,// paddingVertical: 4,paddingHorizontal: 4
    },
    signUpButton: {
        backgroundColor: "#21285c", borderRadius: 10, paddingVertical: 12, marginTop: 16
    },
    footer: {
        flexDirection: "row", marginTop: 16, justifyContent: "center"
    },
    footerText: {
        fontSize: 16, color: "#333"
    },
    footerLink: {
        fontSize: 16, color: "#2a5d9c", marginLeft: 6, fontWeight: "600"
    },
    attachmentBox: {
        borderWidth: 1, borderColor: "#aaa", borderStyle: "dashed", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 12, justifyContent: "center", alignItems: "center"
    },
    attachmentBoxActive: {
        borderColor: "#3CB371", backgroundColor: "#e6f5ea"
    },
    attachmentPlaceholder: {
        fontSize: 15, color: "#888"
    },
    attachmentContent: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 8
    },
    attachmentText: {
        fontSize: 15, color: "#3CB371", fontWeight: "600"
    },
    removeBtn: {
        padding: 6
    },
    removeBtnText: {
        fontSize: 14, color: "#d9534f", fontWeight: "600"
    },
    termsContainer: {
        flexDirection: "row", alignItems: "center", marginVertical: 5
    },
    termsText: {
        marginLeft: 8, fontSize: 14, color: "#333"
    },
    termsLink: {
        color: "#2a5d9c", fontWeight: "bold"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        paddingHorizontal: 8,
    },
    modalWrapper: {
        width: "90%",
        maxHeight: "80%",     // ✅ Allows modal to take up only part of screen
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexShrink: 1,         // ✅ Ensures no overflow breakage
        overflow: 'hidden',    // ✅ Prevent weird clipping on Android
    },
    modalContent: {
        flexGrow: 1,
        paddingBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    modalTitle: {
        fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#21285c"
    },
    modalSectionTitle: {
        fontSize: 17, fontWeight: "bold", marginTop: 16, marginBottom: 4, color: "#21285c"
    },
    modalText: {
        fontSize: 15, color: "#333", lineHeight: 22
    },
    closeButton: {
        backgroundColor: "#21285c", padding: 14, borderRadius: 8, marginTop: 20
    },
    closeButtonText: {
        color: "#fff", textAlign: "center", fontWeight: "600"
    },
    rowInputs: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInput: {
        flex: 1,
        marginRight: 8,
    },
});



