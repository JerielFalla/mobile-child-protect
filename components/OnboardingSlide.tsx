import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SlideProps {
    title: string;
    description: string;
    image: any;
}

const OnboardingSlide: React.FC<SlideProps> = ({ title, description, image }) => {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

export default OnboardingSlide;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width,
        padding: 20,
    },
    image: {
        width: width * 0.9,    // make the image a bit wider
        height: height * 0.50, // make the image taller
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});
