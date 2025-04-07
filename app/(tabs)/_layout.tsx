import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { backgroundColor: "#F5F7FA", height: 60 },
                tabBarActiveTintColor: "#2a5d9c",
                tabBarInactiveTintColor: "#8a8a8a",
                tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="home" size={size} color={color} />
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
                }}
            />
        </Tabs>
    );
}
