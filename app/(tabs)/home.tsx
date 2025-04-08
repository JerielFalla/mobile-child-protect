import React from "react";
import { ScrollView, Text, View, StyleSheet, Image, } from "react-native";

const Home = () => {
    return (
        <View style={styles.mainContainer}>
            {/* Logo in the background */}
            <Image
                source={require("../../assets/img/newlogo.png")} // Replace with the correct path to your logo
                style={styles.logo}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Welcome Home</Text>
                    <Text style={styles.subtitle}>Your daily overview</Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Highlights</Text>
                    <Text style={styles.sectionContent}>Stay updated with the latest activities.</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        position: 'relative', // Required for absolute positioning of logo
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2a5d9c",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
    },
    sectionContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    sectionContent: {
        fontSize: 16,
        color: "#666",
    },
    logo: {
        position: 'absolute',
        top: '50%', // Center it vertically
        left: '50%', // Center it horizontally
        transform: [{ translateX: -100 }, { translateY: -100 }], // Adjust size of the logo and position
        opacity: 0.3, // Low opacity for background effect
        width: 200, // Adjust width as needed
        height: 200, // Adjust height as needed
    },
});
