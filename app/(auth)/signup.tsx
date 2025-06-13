import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { Button, Input } from "@rneui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

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
        marginBottom: 10,
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
});
