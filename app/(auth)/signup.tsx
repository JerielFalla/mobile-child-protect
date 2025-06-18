import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { Icon } from "react-native-elements";

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
                <View style={styles.innerContainer}>
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

                        <Button title="Sign up" buttonStyle={styles.signUpButton}
                            onPress={handleSignup} loading={loading}
                            disabled={!agreedTerms || !agreedPrivacy} />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace("/login")}>
                            <Text style={styles.footerLink}>Sign in here.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modals (unchanged) */}
            {/* Keep your existing Modal code for terms and privacy */}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 24,
        backgroundColor: "#F5F7FA",
    },
    innerContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 36,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: "center",
        marginLeft: 8,
        color: "#2e2e2e",
    },
    form: {
        width: "100%",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
    },
    inputContainer: {
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: -5,
    },
    inputText: {
        fontSize: 16,
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
    termsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    termsText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
    },
    termsLink: {
        color: "#2a5d9c",
        fontWeight: "bold",
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
