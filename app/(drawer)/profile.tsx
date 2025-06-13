import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const API_URL = "https://childguardbackend.vercel.app";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [avatar, setAvatar] = useState('');

    const getProfile = async () => {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        setUser(res.data);
        setAvatar(res.data.avatar);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
            setAvatar(base64Img);
            const userId = await AsyncStorage.getItem('userId');
            await axios.post(`${API_URL}/api/users/${userId}/avatar`, { avatar: base64Img });
        }
    };

    const handleGoBack = () => {
        router.replace('/home');
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="arrow-back-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Avatar Card */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={avatar ? { uri: avatar } : require('../../assets/img/defaultavatar.png')}
                        style={styles.avatar}
                    />

                </View>
                <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                    <Feather name="edit-3" size={18} color="#fff" />
                </TouchableOpacity>

                {/* Info Cards */}
                <View style={styles.infoCard}>
                    <Feather name="user" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.infoText}>{user?.name}</Text>
                </View>

                <View style={styles.infoCard}>
                    <MaterialIcons name="email" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.infoText}>{user?.email}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Feather name="phone" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.infoText}>{user?.phone}</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: '#EEE',
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    content: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 16,
        justifyContent: 'center', // Center the avatar
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        borderColor: '#2a5d9c',
        borderWidth: 3,
    },
    editIcon: {
        position: 'absolute',
        right: 140,
        top: 110,
        backgroundColor: '#2a5d9c', // Your brand color
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 5, // Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: '#EEE',
        marginBottom: 10, // Adjusted margin for spacing
    },
    icon: {
        marginRight: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
});
