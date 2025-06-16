import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { setItem } from '../utils/asyncStorage';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Welcome to ChildGuard',
        text: 'Together, we protect and empower.\n\nChildGuard is your partner in ensuring child safety and well-being.',
        image: require('../assets/cardassets/Slide 1.png'),
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

export default function Onboarding() {
    const router = useRouter();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSignup = async () => {
        await setItem('onboarded', '1');
        router.replace('/(auth)/signup');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const renderItem = ({ item, index }: any) => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, -50],
            extrapolate: 'clamp',
        });

        return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                <Animated.Image
                    source={item.image}
                    style={[styles.image, { opacity, transform: [{ translateY }] }]}
                    resizeMode="contain"
                />
                <Animated.Text style={[styles.title, { opacity, transform: [{ translateY }] }]}>
                    {item.title}
                </Animated.Text>
                <Animated.Text style={[styles.text, { opacity, transform: [{ translateY }] }]}>
                    {item.text}
                </Animated.Text>

                {/* Pagination */}
                <View style={styles.paginationContainer}>
                    <View style={styles.pagination}>
                        {slides.map((_, i) => {
                            const scale = scrollX.interpolate({
                                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                                outputRange: [0.8, 1.4, 0.8],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        { transform: [{ scale }], backgroundColor: currentIndex === i ? '#21285c' : '#ccc' },
                                    ]}
                                />
                            );
                        })}
                    </View>

                    {currentIndex === slides.length - 1 && (
                        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.key}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                ref={flatListRef}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    slide: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: { width: width * 0.8, height: height * 0.4 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    text: { fontSize: 16, textAlign: 'center', marginVertical: 10 },

    paginationContainer: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pagination: { flexDirection: 'row', marginBottom: 20 },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    signupButton: {
        backgroundColor: '#21285c',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});