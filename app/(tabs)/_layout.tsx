import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Drawer from '../(drawer)/index'; // Adjust the path as needed

export default function TabsLayout() {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false); // this is for the drawer

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarStyle: { backgroundColor: "#F5F7FA", height: 60 },
                    tabBarActiveTintColor: "#2a5d9c",
                    tabBarInactiveTintColor: "#8a8a8a",
                    tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
                    headerShown: true,
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="home" size={size} color={color} />
                        ),
                        headerLeft: () => (
                            <TouchableOpacity
                                style={styles.headerLeftStyle}
                                onPress={toggleDrawer}
                            >
                                <Ionicons name="menu" size={28} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="report"
                    options={{
                        tabBarLabel: "Report",
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="file-alt" size={size} color={color} />
                        ),
                        headerLeft: () => (
                            <TouchableOpacity
                                style={styles.headerLeftStyle}
                                onPress={toggleDrawer}
                            >
                                <Ionicons name="menu" size={28} />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Tabs>
            {isDrawerVisible && (
                <Drawer isVisible={isDrawerVisible} onClose={closeDrawer} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    focusedTab: {
        backgroundColor: '#39afea',
    },
    headerLeftStyle: {
        marginLeft: 15,
        marginRight: 10,
    },
});