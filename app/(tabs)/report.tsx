import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import React, { useState, useLayoutEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
    StyleSheet as RNStyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

/* ───────── NEW – react‑native‑paper for Modal/Portal ───────── */
import { Portal, Modal, Button } from "react-native-paper";

/*─────────────────────── HARD‑CODED LAWS ──────────────────────*/
const abuseLawMap = {
    Physical: [
        {
            title: "RA 7610",
            subtitle:
                "Special Protection of Children Against Abuse, Exploitation & Discrimination (covers physical abuse)",
        },
    ],
    Verbal: [
        {
            title: "RA 10627",
            subtitle: "Anti‑Bullying Act (psychological / verbal violence)",
        },
    ],
    Sexual: [
        {
            title: "RA 7610, §5",
            subtitle: "Child sexual exploitation & abuse",
        },
        {
            title: "RA 8353",
            subtitle: "Anti‑Rape Law of 1997",
        },
        {
            title: "RA 11648",
            subtitle: "Strengthened Protection Against Child Sexual Abuse",
        },
    ],
    Emotional: [
        {
            title: "RA 9262",
            subtitle:
                "Anti‑Violence Against Women and Their Children Act (psychological violence)",
        },
    ],
    Neglect: [
        {
            title: "RA 7610, §4‑b",
            subtitle: "Neglect provisions",
        },
    ],
};

/*──────────────── reusable full‑press Picker ────────────────*/
const FullPressPicker = ({ value, onChange, children, style }) => {
    const pickerRef = useRef(null);
    return (
        <View style={style}>
            <Picker
                ref={pickerRef}
                selectedValue={value}
                onValueChange={onChange}
                style={RNStyleSheet.absoluteFill}
            >
                {children}
            </Picker>
            <Pressable
                style={RNStyleSheet.absoluteFill}
                onPress={() => pickerRef.current?.focus()}
            />
        </View>
    );
};

/*──────────────────────────── Report Form ───────────────────────────*/
const ReportForm = () => {
    const [step, setStep] = useState(1);
    const [showConfirm, setShowConfirm] = useState(false); // NEW

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
        const mustFill = [
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
        if (mustFill.some((f) => !formData[f]?.trim())) {
            alert("Please fill out all required fields.");
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
                formData.evidence.map(async (uri) => ({
                    filename: uri.split("/").pop(),
                    base64: await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    }),
                }))
            );

            const body = JSON.stringify({
                ...formData,
                evidence: evidenceArr,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            await fetch("http://192.168.18.16:5000/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            });

            alert("Report submitted! Thank you.");
            setFormData((p) => ({
                ...p,
                ...Object.keys(p).reduce((o, k) => ({ ...o, [k]: "" }), {}),
                evidence: [],
            }));
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
                        <Text style={styles.title}>Abuser's Info</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name (if known)"
                            value={formData.abuserName}
                            onChangeText={(t) => handleInputChange("abuserName", t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Gender"
                            value={formData.abuserGender}
                            onChangeText={(t) => handleInputChange("abuserGender", t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Age / Estimated Age"
                            keyboardType="numeric"
                            value={formData.abuserAge}
                            onChangeText={(t) => handleInputChange("abuserAge", t)}
                        />

                        <Text style={styles.label}>Relationship to Victim</Text>
                        <FullPressPicker
                            value={formData.relationship}
                            onChange={(v) => handleInputChange("relationship", v)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select…" value="" enabled={false} />
                            <Picker.Item label="Parent" value="Parent" />
                            <Picker.Item label="Relative" value="Relative" />
                            <Picker.Item label="Teacher" value="Teacher" />
                            <Picker.Item label="Stranger" value="Stranger" />
                            <Picker.Item label="Unknown" value="Unknown" />
                        </FullPressPicker>

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
                        <FullPressPicker
                            value={formData.natureOfAbuse}
                            onChange={(v) => handleInputChange("natureOfAbuse", v)}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="Select nature of abuse…"
                                value=""
                                enabled={false}
                            />
                            <Picker.Item label="Physical" value="Physical" />
                            <Picker.Item label="Verbal" value="Verbal" />
                            <Picker.Item label="Sexual" value="Sexual" />
                            <Picker.Item label="Emotional" value="Emotional" />
                            <Picker.Item label="Neglect" value="Neglect" />
                        </FullPressPicker>

                        <TextInput
                            style={styles.input}
                            placeholder="History of Abuse (optional)"
                            value={formData.historyOfAbuse}
                            onChangeText={(t) => handleInputChange("historyOfAbuse", t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={formData.location}
                            onChangeText={(t) => handleInputChange("location", t)}
                        />

                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <Text style={styles.buttonText}>Upload Evidence</Text>
                        </TouchableOpacity>

                        <View style={styles.navigationButtons}>
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={prevStep}
                            >
                                <Text style={styles.buttonText}>Back</Text>
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

                        <TextInput
                            style={styles.input}
                            placeholder="Victim's Name"
                            value={formData.victimName}
                            onChangeText={(t) => handleInputChange("victimName", t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            keyboardType="numeric"
                            value={formData.victimAge}
                            onChangeText={(t) => handleInputChange("victimAge", t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Gender"
                            value={formData.victimGender}
                            onChangeText={(t) => handleInputChange("victimGender", t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Disability (if any)"
                            value={formData.victimDisability}
                            onChangeText={(t) =>
                                handleInputChange("victimDisability", t)
                            }
                        />

                        <View style={styles.navigationButtons}>
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={prevStep}
                            >
                                <Text style={styles.buttonText}>Back</Text>
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
                    {abuseLawMap[formData.natureOfAbuse]?.map(({ title, subtitle }) => (
                        <View key={title} style={styles.bulletRow}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                {title} – {subtitle}
                            </Text>
                        </View>
                    ))}

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
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    label: { fontSize: 16, marginBottom: 5 },
    picker: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
        height: 50,
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#2a5d9c",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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
});

export default ReportForm;
