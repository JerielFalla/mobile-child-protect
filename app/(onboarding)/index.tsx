import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import OnboardingSlide from '../../components/OnboardingSlide';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to ChildGuard',
        description: 'Together, we protect and empower.\n\nChildGuard is your partner in ensuring child safety and well-being.',
        image: require('../../assets/cardassets/Slide 1.png'),
        backgroundColor: '#FFEBEE',
    },
    {
        id: '2',
        title: 'Why Choose ChildGuard?',
        description: 'Because every child deserves safety.\n\nReport abuse confidentially. Access educational resources. Collaborate with organizations.',
        image: require('../../assets/img/newlogo.png'),
        backgroundColor: '#E8F5E9',
    },
    {
        id: '3',
        title: 'How It Works',
        description: 'Simple, secure, effective.\n\nReport abuse, learn safety tools, and collaborate with communities.',
        image: require('../../assets/cardassets/Slide 3.png'),
        backgroundColor: '#E8F5E9',
    },
    {
        id: '4',
        title: 'Let’s Get Started',
        description: 'Be a part of the change!\n\nCreate your account now and protect children.',
        image: require('../../assets/cardassets/Slide 4.png'),
        backgroundColor: '#FFF3E0',
    },
];

const OnboardingScreen = () => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: slides[currentIndex].backgroundColor }]}>
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item }) => (
                    <OnboardingSlide
                        title={item.title}
                        description={item.description}
                        image={item.image}
                    />
                )}
            />

            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentIndex === index && styles.activeIndicator,
                            ]}
                        />
                    ))}
                </View>

                {currentIndex === slides.length - 1 ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            await AsyncStorage.setItem('onboardingCompleted', 'true');
                            router.push('/signup');
                        }}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={nextSlide}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        padding: 20,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#ccc',
    },
    activeIndicator: {
        backgroundColor: '#333',
        width: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});
