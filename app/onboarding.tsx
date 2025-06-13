import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Welcome to ChildGuard',
        text: 'Together, we protect and empower.\n\nChildGuard is your partner in ensuring child safety and well-being.',
        image: require('../assets/cardassets/Slide 1.png'), // replace with your actual image path
        backgroundColor: '#FFEBEE',
    },
    {
        key: '2',
        title: 'Why Choose ChildGuard?',
        text: 'Because every child deserves safety.\n\nReport abuse confidentially. Access educational resources. Collaborate with organizations.',
        image: require('../assets/img/newlogo.png'),
        backgroundColor: '#E8F5E9',
    },
    {
        key: '3',
        title: 'How It Works',
        text: 'Simple, secure, effective.\n\nReport abuse, learn safety tools, and collaborate with communities.',
        image: require('../assets/cardassets/Slide 3.png'),
        backgroundColor: '#E3F2FD',
    },
    {
        key: '4',
        title: 'Let’s Get Started',
        text: 'Be a part of the change!\n\nCreate your account now and protect children.',
        image: require('../assets/cardassets/Slide 4.png'),
        backgroundColor: '#FFF3E0',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();

    const renderItem = ({ item }: any) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.text}>{item.text}</Text>
            {item.key === '4' && (
                <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/signup')}>
                    <Text style={styles.buttonText}>Sign Up Now</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <FlatList
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
        />
    );
}

const styles = StyleSheet.create({
    slide: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
    },
    button: {
        marginTop: 40,
        backgroundColor: '#21285c',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
