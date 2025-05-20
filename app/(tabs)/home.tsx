import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_URL = "https://childguardbackend.vercel.app";

const HomeScreen = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedArticleId, setExpandedArticleId] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/articles`);
            // Sort articles by createdAt descending (latest first)
            const sortedArticles = response.data.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setArticles(sortedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardPress = (id) => {
        setExpandedArticleId(expandedArticleId === id ? null : id);
    };

    const renderArticleItem = ({ item, index }) => {
        const isFeatured = index === 0;
        return (
            <TouchableOpacity onPress={() => handleCardPress(item._id)}>
                <View style={isFeatured ? styles.featuredCard : styles.articleItem}>
                    <Image
                        source={{ uri: item.thumbnail }}
                        style={isFeatured ? styles.featuredImage : styles.articleThumbnail}
                    />
                    <View style={isFeatured ? {} : styles.articleContent}>
                        <Text style={isFeatured ? styles.featuredTitle : styles.articleTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <View style={isFeatured ? styles.featuredMeta : styles.metaInfo}>
                            <Text style={isFeatured ? styles.featuredAuthor : styles.metaDate}>Admin</Text>
                            <Text style={isFeatured ? styles.featuredDate : styles.metaDot}>•</Text>
                            <Text style={isFeatured ? styles.featuredDate : styles.metaRead}>
                                {new Date(item.createdAt).toDateString()}
                            </Text>
                        </View>
                        {expandedArticleId === item._id && (
                            <Text style={isFeatured ? styles.articleDescription : styles.articleDescription}>
                                {item.description}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerDate}>{new Date().toDateString()}</Text>
            <Text style={styles.breakingNews}>Latest Article</Text>

            <FlatList
                data={articles}
                keyExtractor={(item) => item._id}
                renderItem={renderArticleItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articleList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8fc',
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    headerDate: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    breakingNews: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
    },
    featuredCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    featuredImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredAuthor: {
        fontSize: 14,
        color: '#555',
        marginRight: 8,
    },
    featuredDate: {
        fontSize: 12,
        color: '#888',
    },
    articleList: {
        paddingBottom: 16,
    },
    articleItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    articleThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    articleContent: {
        flex: 1,
        justifyContent: 'center',
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaDate: {
        fontSize: 12,
        color: '#888',
    },
    metaDot: {
        fontSize: 12,
        marginHorizontal: 4,
        color: '#888',
    },
    metaRead: {
        fontSize: 12,
        color: '#888',
    },
    articleDescription: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
