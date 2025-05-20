import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { streamClient } from '../../lib/streamClient';

interface DrawerProps {
    isVisible: boolean;
    onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isVisible, onClose }) => {
    const router = useRouter();
    const translateX = useSharedValue(-400); // Use Reanimated's shared value

    // Animate the drawer when `isVisible` changes
    useEffect(() => {
        translateX.value = isVisible ? 0 : -400;
    }, [isVisible]);

    // Reanimated animated style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(translateX.value, { duration: 300 }) }],
    }));

    return isVisible ? (
        <Pressable style={styles.overlay} onPress={onClose}>
            <Animated.View style={[styles.drawerContainer, animatedStyle]}>
                <View style={styles.drawerContent}>
                    <View style={styles.FTHLogoContainer}>
                        <Image
                            style={styles.FTHarmonyLogo}
                            resizeMode="contain"
                            source={require("../../assets/img/newlogo.png")}
                        />
                    </View>

                    {/* Drawer Items */}
                    <TouchableOpacity
                        style={[styles.drawerItem, styles.activeItem]}
                        onPress={() => router.replace('/(drawer)/profile')}
                    >
                        <MaterialIcons name="person" size={24} color="black" />
                        <Text style={styles.drawerItemText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="folder-open" size={24} color="black" />
                        <Text style={styles.drawerItemText}>Directories</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="star" size={24} color="black" />
                        <Text style={styles.drawerItemText}>Premium</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={async () => {
                            try {
                                // Disconnect Stream client
                                await streamClient.disconnectUser();

                                // Clear stored user info
                                await AsyncStorage.multiRemove(['chatToken', 'userId', 'name', 'email', 'phone']);

                                // Navigate to login screen
                                router.replace('/login');
                            } catch (error) {
                                console.error("Error logging out:", error);
                            }
                        }}
                    >
                        <FontAwesome name="sign-out" size={24} color="black" />
                        <Text style={styles.drawerItemText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Pressable>
    ) : null;
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    drawerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '65%',
        height: '100%',
        backgroundColor: 'white',
        paddingTop: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    drawerContent: {
        marginTop: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    drawerItemText: {
        fontSize: 18,
        marginLeft: 10,
    },
    activeItem: {
        backgroundColor: '#f0f0f0',
    },
    FTHLogoContainer: {
        width: "100%",
        height: "25%",
        justifyContent: "center",
        marginTop: -18,
    },
    FTHarmonyLogo: {
        marginBottom: 20,
        height: 140,
        width: 150,
        position: "relative",
        alignSelf: "center",
    },
});

export default Drawer;
