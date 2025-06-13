import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    TextInput,
    Linking,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const resources = [
    {
        id: '0',
        title: 'RA 11930',
        subtitle: 'Anti-Online Sexual Abuse Law',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e35',
        link: 'https://lawphil.net/statutes/repacts/ra2022/ra_11930_2022.html',
    },
    {
        id: '1',
        title: 'RA 9262',
        subtitle: 'Anti-Violence Against Women and Their Children',
        image: 'https://images.unsplash.com/photo-1600412601874-46aa4c7a2890',
        link: 'https://lawphil.net/statutes/repacts/ra2004/ra_9262_2004.html',
    },
    {
        id: '2',
        title: 'RA 9231',
        subtitle: 'Child Labor Law',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        link: 'https://www.officialgazette.gov.ph/2003/12/19/republic-act-no-9231/',
    },
    {
        id: '3',
        title: 'RA 7610',
        subtitle: 'Protection Against Child Abuse & Exploitation',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        link: 'https://lawphil.net/statutes/repacts/ra1992/ra_7610_1992.html',
    },
    {
        id: '4',
        title: 'RA 9344',
        subtitle: 'Juvenile Justice & Welfare Act of 2006',
        image: 'https://images.unsplash.com/photo-1603311670642-aaa0c41c79e0',
        link: 'https://lawphil.net/statutes/repacts/ra2006/ra_9344_2006.html',
    },
    {
        id: '5',
        title: 'RA 9775',
        subtitle: 'Anti-Child Pornography Act of 2009',
        image: 'https://images.unsplash.com/photo-1606761567598-a4c7f99c897d',
        link: 'https://lawphil.net/statutes/repacts/ra2009/ra_9775_2009.html',
    },
    {
        id: '6',
        title: 'RA 9208',
        subtitle: 'Anti-Trafficking in Persons Act of 2003',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        link: 'https://lawphil.net/statutes/repacts/ra2003/ra_9208_2003.html',
    },
    {
        id: '7',
        title: 'RA 9858',
        subtitle: 'Legitimation of Children Born to Parents Below Marrying Age',
        image: 'https://images.unsplash.com/photo-1533197950181-46e6b43b0c3e',
        link: 'https://lawphil.net/statutes/repacts/ra2009/ra_9858_2009.html',
    },
    {
        id: '8',
        title: 'RA 10165',
        subtitle: 'Foster Care Act of 2012',
        image: 'https://images.unsplash.com/photo-1496309732348-3627f3f040ee',
        link: 'https://lawphil.net/statutes/repacts/ra2012/ra_10165_2012.html',
    },
    {
        id: '9',
        title: 'RA 10066',
        subtitle: 'National Cultural Heritage Act of 2009',
        image: 'https://images.unsplash.com/photo-1574961446849-179e227f3bd4',
        link: 'https://lawphil.net/statutes/repacts/ra2010/ra_10066_2010.html',
    },
    {
        id: '10',
        title: 'RA 11188',
        subtitle: 'Special Protection of Children in Situations of Armed Conflict',
        image: 'https://images.unsplash.com/photo-1543700152-0f2b37f7fb32',
        link: 'https://www.lawphil.net/statutes/repacts/ra2019/ra_11188_2019.html',
    },
    {
        id: '11',
        title: 'RA 11648',
        subtitle: 'Raising the Age of Sexual Consent from 12 to 16',
        image: 'https://images.unsplash.com/photo-1504306673933-4b5290f0ec14',
        link: 'https://lawphil.net/statutes/repacts/ra2022/ra_11648_2022.html',
    },
];

export default function ResourcesScreen() {
    const [searchText, setSearchText] = useState('');

    const filteredResources = resources.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderCard = ({ item }: { item: typeof resources[0] }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => item.link && Linking.openURL(item.link)}
        >
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
    );

    return (

        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search laws..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Title & Subtitle */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Child Protection Laws of the Philippines</Text>
                <Text style={styles.subtitle}>
                    Explore official Republic Acts that defend children from abuse, exploitation, and neglect.
                </Text>
            </View>

            {/* Resource List Section */}
            <View style={styles.resourcesContainer}>
                <Image
                    source={require('../../assets/img/newlogo.png')}
                    style={styles.logoBackground}
                    resizeMode="contain"
                />

                <Text style={styles.sectionTitle}>📚 Resources</Text>

                <FlatList
                    data={filteredResources}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCard}
                    contentContainerStyle={styles.cardList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>No results found.</Text>
                    )}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    logoBackground: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.7,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },

    container: {
        flex: 1,
        backgroundColor: '#F2F5F9',
        paddingTop: Platform.OS === 'android' ? 30 : 20,
    },
    searchContainer: {
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingVertical: 4,
    },
    titleContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E2A38',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 18,
    },
    resourcesContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 8,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1E2A38',
    },
    cardList: {
        paddingBottom: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    cardImage: {
        width: 52,
        height: 52,
        borderRadius: 10,
        marginRight: 14,
        backgroundColor: '#eee',
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#6C7A89',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        marginTop: 30,
    },
});
