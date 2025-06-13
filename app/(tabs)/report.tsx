import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, StyleSheet as RNStyleSheet, } from "react-native";
import { Checkbox } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
import { Portal, Modal, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";



const API_URL = "https://childguardbackend.vercel.app";

const abuseLawMap = {
    "Physical Abuse": [
        {
            title: "RA 7610",
            subtitle:
                "Special Protection of Children Against Abuse, Exploitation & Discrimination (covers physical abuse)",
        },
    ],
    "Verbal Abuse": [
        {
            title: "RA 10627",
            subtitle: "Anti‑Bullying Act (psychological / verbal violence)",
        },
    ],
    "Sexual Abuse": [
        {
            title: "RA 7610, §5",
            subtitle: "Child sexual exploitation & abuse",
        },
        {
            title: "RA 8353",
            subtitle: "Anti‑Rape Law of 1997",
        },
        {
            title: "RA 11648",
            subtitle: "Strengthened Protection Against Child Sexual Abuse",
        },
    ],
    "Psychological Abuse": [
        {
            title: "RA 9262",
            subtitle:
                "Anti‑Violence Against Women and Their Children Act (psychological violence)",
        },
    ],
    "Neglect": [
        {
            title: "RA 7610, §4‑b",
            subtitle: "Neglect provisions",
        },
    ],
    "Cyber Sexual Harassment": [
        {
            title: "RA 11930",
            subtitle: "Anti-Online Sexual Abuse and Exploitation of Children Law",
        },
        {
            title: "RA 9995",
            subtitle: "Anti-Photo and Video Voyeurism Act",
        },
    ],
};


/*──────────────────────────── Report Form ───────────────────────────*/
const ReportForm = () => {
    const [step, setStep] = useState(1);
    const [showConfirm, setShowConfirm] = useState(false); // NEW
    const [abuserAnonymous, setAbuserAnonymous] = useState(false);
    const [victimAnonymous, setVictimAnonymous] = useState(false);
    const [showAbuserAgePicker, setShowAbuserAgePicker] = useState(false);
    const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);
    const [showNatureOfAbusePicker, setShowNatureOfAbusePicker] = useState(false);
    const [showVictimAgePicker, setShowVictimAgePicker] = useState(false);
    const [reporterPhone, setReporterPhone] = useState("");
    const [reporterName, setReporterName] = useState(null);


    const [formData, setFormData] = useState({
        abuserName: "",
        abuserGender: "",
        abuserAge: "",
        relationship: "",
        natureOfAbuse: "",
        descriptionOfIncident: "",
        location: "",
        evidence: [],
        victimAge: "",
        victimGender: "",
        descriptionOfVictim: "",
        victimName: "",
        reporterPhone: "",

    });


    useEffect(() => {
        const getUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    const res = await fetch(`${API_URL}/api/users/${userId}`);
                    const user = await res.json();

                    setReporterName(user.name);
                    setReporterPhone(user.phoneNumber); // ✅ save to separate state
                    setFormData((prev) => ({                // ✅ auto-fill into formData
                        ...prev,
                        reporterPhone: user.phoneNumber,
                    }));
                }
            } catch (e) {
                console.error("Error fetching user data:", e);
            }
        };
        getUserData();
    }, []);




    /* ───── Auto‑fill current address (unchanged) ───── */
    useLayoutEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});
            const addrArr = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            if (addrArr?.length) {
                const { street, name, city, region, postalCode, country } = addrArr[0];
                const full = [name, street, city, region, postalCode, country]
                    .filter(Boolean)
                    .join(", ");
                setFormData((p) => ({ ...p, location: full }));
            }
        })();
    }, []);

    /* ───── helpers ───── */
    const handleInputChange = (key, value) =>
        setFormData((p) => ({ ...p, [key]: value }));

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!res.canceled && res.assets?.length) {
            const uri = res.assets[0].uri;
            setFormData((p) => ({ ...p, evidence: [...p.evidence, uri] }));
        }
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);


    /*───── real submit logic (unchanged) ─────*/
    const realSubmit = async () => {

        // Create a copy of formData to modify
        let submissionData = { ...formData };

        // If abuser is anonymous, set relevant fields to "Unknown"
        if (abuserAnonymous) {
            submissionData = {
                ...submissionData,
                abuserName: "Unknown",
                abuserGender: submissionData.abuserGender || "Unknown",
                abuserAge: submissionData.abuserAge || "Unknown",
            };
        }

        // If victim is anonymous, set relevant fields to "Unknown"
        if (victimAnonymous) {
            submissionData = {
                ...submissionData,
                victimName: "Unknown",
                victimGender: submissionData.victimGender || "Unknown",
                victimAge: submissionData.victimAge || "Unknown",
            };
        }

        const mustFill = [
            "abuserName",
            "abuserGender",
            "abuserAge",
            "relationship",
            "natureOfAbuse",
            "descriptionOfIncident",
            "location",
            "victimName",
            "victimGender",
            "descriptionOfVictim",
            "victimAge",
            "reporterPhone",

        ];
        // Check if required fields are filled
        if (mustFill.some((f) => !submissionData[f]?.trim())) {
            alert("Please fill out all required fields.");
            return;
        }

        // Check if reporter phone is filled
        if (!reporterPhone.trim()) {
            alert("Please enter your contact number.");
            return;
        }

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Location permission denied.");
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const evidenceArr = await Promise.all(
                submissionData.evidence.map(async (uri) => ({
                    filename: uri.split("/").pop(),
                    base64: await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    }),
                }))
            );


            const body = JSON.stringify({
                ...submissionData,
                reporterName,
                reporterPhone,
                abuserAnonymous,
                victimAnonymous,
                evidence: evidenceArr,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,

            });

            const response = await fetch(`${API_URL}/api/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            });
            console.log(body);
            const responseData = await response.json();
            console.log("Response:", responseData);

            alert("Report submitted! Thank you.");


            setFormData((p) => ({
                ...p,
                ...Object.keys(p).reduce((o, k) => ({ ...o, [k]: "" }), {}),
                evidence: [],
            }));

            // Reset reporter phone
            setReporterPhone("");

            // Reset checkbox states
            setAbuserAnonymous(false);
            setVictimAnonymous(false);

            setStep(1);
        } catch (e) {
            console.error(e);
            alert("Submission failed, please try again.");
        }
    };

    /* open confirm modal first */
    const submitForm = () => setShowConfirm(true);

    /*────────────────────────── UI ──────────────────────────*/
    return (
        <>
            <ScrollView style={styles.container}>
                {/* STEP 1  (unchanged except picker wrapper already full‑press) */}
                {step === 1 && (
                    <View>
                        <Text style={styles.title}>Alleged Perpetrator's Info</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name (if known)"
                            value={formData.abuserName}
                            onChangeText={(t) => handleInputChange("abuserName", t)}
                        />
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={abuserAnonymous ? 'checked' : 'unchecked'}
                                onPress={() => setAbuserAnonymous(!abuserAnonymous)}
                                color="#2a5d9c"
                            />
                            <Text style={styles.checkboxLabel}>Unknown Perpetrator</Text>
                        </View>



                        <Text style={styles.label}>Gender</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter gender"
                            value={formData.abuserGender}
                            onChangeText={(t) => handleInputChange("abuserGender", t)}
                        />



                        <Text style={styles.label}>Age / Estimated Age Range</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowAbuserAgePicker(true)}
                        >
                            <Text style={formData.abuserAge ? styles.inputText : styles.placeholderText}>
                                {formData.abuserAge || "Select age range..."}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Relationship to Victim</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowRelationshipPicker(true)}
                        >
                            <Text style={formData.relationship ? styles.inputText : styles.placeholderText}>
                                {formData.relationship || "Select relationship..."}
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.button} onPress={nextStep}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 2 (unchanged except picker wrapper) */}
                {step === 2 && (
                    <View>
                        <Text style={styles.title}>Incident Details</Text>

                        <Text style={styles.label}>Nature of Abuse</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowNatureOfAbusePicker(true)}
                        >
                            <Text style={formData.natureOfAbuse ? styles.inputText : styles.placeholderText}>
                                {formData.natureOfAbuse || "Select nature of abuse..."}
                            </Text>
                        </TouchableOpacity>


                        {/* NEW: Description of Incident */}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Describe the incident"
                            value={formData.descriptionOfIncident}
                            onChangeText={(t) => handleInputChange("descriptionOfIncident", t)}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={formData.location}
                            onChangeText={(t) => handleInputChange("location", t)}
                            multiline={false}
                            numberOfLines={1}
                            textAlignVertical="center"
                        />

                        {/* NEW IMPLEMENTATION: Reporter's Contact Number */}
                        <Text style={styles.label}>Reporter's Contact Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Phone Number"
                            value={formData.reporterPhone}
                            onChangeText={(text) => {
                                setReporterPhone(text);
                                handleInputChange("reporterPhone", text);
                            }}
                            keyboardType="phone-pad"
                            editable={false}
                        />

                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <Text style={styles.buttonText}>Upload Evidence</Text>
                        </TouchableOpacity>

                        <View style={styles.navigationButtons}>
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={prevStep}
                            >
                                <Text style={styles.backbuttonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={nextStep}
                            >
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* STEP 3 (unchanged except submitForm triggers modal) */}
                {step === 3 && (
                    <View>
                        <Text style={styles.title}>Victim's Info</Text>


                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name (if known)"
                            value={formData.victimName}
                            onChangeText={(t) => handleInputChange("victimName", t)}
                        />
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={victimAnonymous ? 'checked' : 'unchecked'}
                                onPress={() => setVictimAnonymous(!victimAnonymous)}
                                color="#2a5d9c"
                            />
                            <Text style={styles.checkboxLabel}>Unknown Victim</Text>
                        </View>



                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Describe the victim"
                            value={formData.descriptionOfVictim}
                            onChangeText={(t) => handleInputChange("descriptionOfVictim", t)}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />


                        <Text style={styles.label}>Gender</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter gender"
                            value={formData.victimGender}
                            onChangeText={(t) => handleInputChange("victimGender", t)}
                        />

                        <Text style={styles.label}>Estimated Age</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowVictimAgePicker(true)}
                        >
                            <Text style={formData.victimAge ? styles.inputText : styles.placeholderText}>
                                {formData.victimAge || "Select or enter age..."}
                            </Text>
                        </TouchableOpacity>



                        <View style={styles.navigationButtons}>
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={prevStep}
                            >
                                <Text style={styles.backbuttonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={submitForm}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>


            <Portal>
                {/* Abuser Age Picker Modal */}
                <Modal
                    visible={showAbuserAgePicker}
                    onDismiss={() => setShowAbuserAgePicker(false)}
                    contentContainerStyle={styles.pickerModal}
                >
                    <Text style={styles.modalHeader}>Select Age Range</Text>

                    <View style={styles.optionsGrid}>
                        {["Under 18", "18-25", "26-35", "36-45", "46-55", "56-65", "Over 65", "Unknown"].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionButton}
                                onPress={() => {
                                    handleInputChange("abuserAge", option);
                                    setShowAbuserAgePicker(false);
                                }}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button onPress={() => setShowAbuserAgePicker(false)}>Cancel</Button>
                </Modal>

                {/* Relationship Picker Modal */}
                <Modal
                    visible={showRelationshipPicker}
                    onDismiss={() => setShowRelationshipPicker(false)}
                    contentContainerStyle={styles.pickerModal}
                >
                    <Text style={styles.modalHeader}>Select Relationship</Text>

                    <View style={styles.optionsList}>
                        {["Parent", "Relative", "Teacher", "Stranger", "Unknown"].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.listOption}
                                onPress={() => {
                                    handleInputChange("relationship", option);
                                    setShowRelationshipPicker(false);
                                }}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button onPress={() => setShowRelationshipPicker(false)}>Cancel</Button>
                </Modal>

                {/* Nature of Abuse Picker Modal */}
                <Modal
                    visible={showNatureOfAbusePicker}
                    onDismiss={() => setShowNatureOfAbusePicker(false)}
                    contentContainerStyle={styles.pickerModal}
                >
                    <Text style={styles.modalHeader}>Select Nature of Abuse</Text>

                    <View style={styles.optionsList}>
                        {["Physical Abuse", "Verbal Abuse", "Sexual Abuse", "Psychological Abuse", "Neglect", "Cyber Sexual Harassment"].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.listOption}
                                onPress={() => {
                                    handleInputChange("natureOfAbuse", option);
                                    setShowNatureOfAbusePicker(false);
                                }}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button onPress={() => setShowNatureOfAbusePicker(false)}>Cancel</Button>
                </Modal>

                {/* Victim Age Picker Modal */}
                <Modal
                    visible={showVictimAgePicker}
                    onDismiss={() => setShowVictimAgePicker(false)}
                    contentContainerStyle={styles.pickerModal}
                >
                    <Text style={styles.modalHeader}>Select Age Range</Text>

                    <View style={styles.optionsGrid}>
                        {["0-5", "6-12", "13-17", "Unknown"].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionButton}
                                onPress={() => {
                                    handleInputChange("victimAge", option);
                                    setShowVictimAgePicker(false);
                                }}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.customInputContainer}>
                        <Text style={styles.customInputLabel}>Or enter specific age:</Text>
                        <TextInput
                            style={styles.customInput}
                            keyboardType="numeric"
                            value={formData.victimAge.match(/^\d+$/) ? formData.victimAge : ""}
                            onChangeText={(t) => handleInputChange("victimAge", t)}
                            placeholder="Enter age"
                        />
                    </View>

                    <Button onPress={() => setShowVictimAgePicker(false)}>Done</Button>
                </Modal>
            </Portal>




            {/*───────── Confirmation Modal ─────────*/}
            <Portal>
                <Modal
                    visible={showConfirm}
                    onDismiss={() => setShowConfirm(false)}
                    contentContainerStyle={styles.modalCard}
                >
                    {/* HEADER */}
                    <Text style={styles.modalHeader}>Confirm Report Submission</Text>

                    {/* INTRO */}
                    <Text style={styles.modalBody}>
                        You are about to submit a report of:{" "}
                        <Text style={styles.boldText}>
                            “{formData.natureOfAbuse || "N/A"}”
                        </Text>
                    </Text>

                    {/* LIST HEADER */}
                    <Text style={[styles.modalBody, { marginTop: 12 }]}>
                        This report involves actions that may be in violation of the
                        following laws:
                    </Text>

                    {/* BULLET LIST */}
                    {abuseLawMap[formData.natureOfAbuse] ? (
                        abuseLawMap[formData.natureOfAbuse].map(({ title, subtitle }) => (
                            <View key={title} style={styles.bulletRow}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.bulletText}>
                                    {title} – {subtitle}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.bulletRow}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                No specific laws found for this type of abuse.
                            </Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* NOTICE */}
                    <Text style={styles.noticeHeader}>
                        Important Notice to the Reporter:
                    </Text>
                    <Text style={styles.modalBody}>
                        By submitting this report, you acknowledge that:
                    </Text>
                    {[
                        "You are acting in good faith and to the best of your knowledge.",
                        "False or malicious reports can have legal consequences.",
                        "Your report can help protect a child and may trigger legal and welfare actions.",
                        "Your identity and details will be kept confidential, following child protection and data privacy laws.",
                    ].map((t, i) => (
                        <View key={i} style={styles.bulletRow}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>{t}</Text>
                        </View>
                    ))}

                    <Text style={styles.alertText}>
                        If you believe the child is in immediate danger, please contact your
                        local authorities or social services directly.
                    </Text>

                    {/* BUTTONS */}
                    <View style={styles.btnRow}>
                        <Button onPress={() => setShowConfirm(false)}>CANCEL</Button>
                        <Button
                            mode="contained"
                            onPress={() => {
                                setShowConfirm(false);
                                realSubmit();
                            }}
                            style={{ marginLeft: 8 }}
                        >
                            SUBMIT
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
    );
};

/*──────────── styles (existing + NEW modal styles) ───────────*/
const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: "#F5F7FA" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 25 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        paddingVertical: 12,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: "#fff",
        height: 50,
    },
    label: { fontSize: 14, marginBottom: 5, fontWeight: 500 },

    button: {
        backgroundColor: "#2a5d9c",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

    navigationButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 0,
    },
    backbuttonText: {
        color: "#2e2e2e",
        fontSize: 16,
        fontWeight: 500,
    },
    navigationButton: {
        color: "#2e2e2e",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#2e2e2e",
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

    /* ───── NEW modal styles ───── */
    modalCard: {
        backgroundColor: "#333",
        padding: 24,
        borderRadius: 4,
        marginHorizontal: 24,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 12,
    },
    modalBody: { color: "#d6d6d6", lineHeight: 20 },
    boldText: { fontWeight: "bold", color: "#fff" },

    bulletRow: { flexDirection: "row", marginTop: 6 },
    bulletDot: { color: "#d6d6d6", marginRight: 8 },
    bulletText: { color: "#d6d6d6", flex: 1, lineHeight: 20 },

    divider: { height: 1, backgroundColor: "#555", marginVertical: 16 },

    noticeHeader: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 4,
    },
    alertText: {
        color: "#ff5c5c",
        fontSize: 12,
        marginTop: 16,
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 24,
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        height: 120,  // Taller height for description
        textAlignVertical: "top",  // Text starts at the top
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: -20,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },

    inputText: {
        color: '#333',
        fontSize: 16,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },


    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    pickerModal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: '48%',
        alignItems: 'center',
    },
    optionsList: {
        marginBottom: 20,
    },
    listOption: {
        backgroundColor: '#f0f0f0',
        padding: 14,
        borderRadius: 8,
        marginBottom: 8,
        width: '100%',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    customInputContainer: {
        marginBottom: 20,
    },
    customInputLabel: {
        fontSize: 14,
        marginBottom: 8,
        color: '#555',
    },
    customInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },

});

export default ReportForm;
