import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import React, { useState, useLayoutEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";


const ReportForm = ({ onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        abuserName: "",
        abuserGender: "",
        abuserAge: "",
        relationship: "",
        natureOfAbuse: "",
        historyOfAbuse: "",
        location: "",
        evidence: [],
        victimAge: "",
        victimGender: "",
        victimDisability: "",
        victimName: "",
    });

    // Function to reset form data to initial state
    const resetForm = () => {
        setFormData({
            abuserName: "",
            abuserGender: "",
            abuserAge: "",
            relationship: "",
            natureOfAbuse: "",
            historyOfAbuse: "",
            location: "",
            evidence: [],
            victimAge: "",
            victimGender: "",
            victimDisability: "",
            victimName: "",
        });
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            base64: false, // we handle this manually later
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedUri = result.assets[0].uri;
            setFormData((prev) => ({
                ...prev,
                evidence: [...prev.evidence, selectedUri],
            }));
        }
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const submitForm = async () => {
        // Prevent submission if required fields are empty
        const requiredFields = [
            "abuserName",
            "abuserGender",
            "abuserAge",
            "relationship",
            "natureOfAbuse",
            "location",
            "victimName",
            "victimAge",
            "victimGender",
        ];

        const hasEmptyField = requiredFields.some(field => !formData[field].trim());

        if (hasEmptyField) {
            alert("Please fill out all required fields before submitting the form.");
            return;
        }

        try {
            // Request location permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied.");
                return;
            }

            // Get current location
            const location = await Location.getCurrentPositionAsync({});
            const latitude = location.coords.latitude;
            const longitude = location.coords.longitude;

            const evidenceBase64Array = await Promise.all(
                formData.evidence.map(async (uri) => {
                    const base64 = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    return {
                        filename: uri.split("/").pop(),
                        base64,
                    };
                })
            );

            const formToSend = {
                ...formData,
                evidence: evidenceBase64Array,
                latitude,
                longitude,
            };

            const response = await fetch("http://192.168.18.16:5000/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formToSend),
            });

            const data = await response.json();
            console.log("Server response:", data);
            alert("Report submitted successfully!");
            resetForm();
            setStep(1);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };


    return (
        <ScrollView style={styles.container}>
            {step === 1 && (
                <View>
                    <Text style={styles.title}>Abuser's Info</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name (if known)"
                        value={formData.abuserName}
                        onChangeText={(text) => handleInputChange("abuserName", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Gender"
                        value={formData.abuserGender}
                        onChangeText={(text) => handleInputChange("abuserGender", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Age/Estimated Age"
                        keyboardType="numeric"
                        value={formData.abuserAge}
                        onChangeText={(text) => handleInputChange("abuserAge", text)}
                    />
                    <Text style={styles.label}>Relationship to Victim</Text>
                    <Picker
                        selectedValue={formData.relationship}
                        onValueChange={(itemValue) => handleInputChange("relationship", itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Parent" value="Parent" />
                        <Picker.Item label="Relative" value="Relative" />
                        <Picker.Item label="Teacher" value="Teacher" />
                        <Picker.Item label="Stranger" value="Stranger" />
                        <Picker.Item label="Unknown" value="Unknown" />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={nextStep}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 2 && (
                <View>
                    <Text style={styles.title}>Incident Details</Text>
                    <Text style={styles.label}>Nature of Abuse</Text>
                    <Picker
                        selectedValue={formData.natureOfAbuse}
                        onValueChange={(itemValue) => handleInputChange("natureOfAbuse", itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Physical" value="Physical" />
                        <Picker.Item label="Verbal" value="Verbal" />
                        <Picker.Item label="Sexual" value="Sexual" />
                        <Picker.Item label="Emotional" value="Emotional" />
                        <Picker.Item label="Neglect" value="Neglect" />
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder="History of Abuse (if applicable)"
                        value={formData.historyOfAbuse}
                        onChangeText={(text) => handleInputChange("historyOfAbuse", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={formData.location}
                        onChangeText={(text) => handleInputChange("location", text)}
                    />
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>Upload Evidence</Text>
                    </TouchableOpacity>
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity style={styles.navigationButton} onPress={prevStep}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButton} onPress={nextStep}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {step === 3 && (
                <View>
                    <Text style={styles.title}>Victim's Info</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Victim's Name"
                        value={formData.victimName}
                        onChangeText={(text) => handleInputChange("victimName", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        keyboardType="numeric"
                        value={formData.victimAge}
                        onChangeText={(text) => handleInputChange("victimAge", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Gender"
                        value={formData.victimGender}
                        onChangeText={(text) => handleInputChange("victimGender", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Disability (if any)"
                        value={formData.victimDisability}
                        onChangeText={(text) => handleInputChange("victimDisability", text)}
                    />
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity style={styles.navigationButton} onPress={prevStep}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2a5d9c",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    navigationButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    navigationButton: {
        backgroundColor: "#8e8e8e",
        padding: 12,
        borderRadius: 8,
        width: "48%",
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "#2a5d9c",
        padding: 12,
        borderRadius: 8,
        width: "48%",
        alignItems: "center",
    },
});

export default ReportForm;
