import { useState } from 'react';
import {
    FlatList,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    View,
    TextInput,
} from 'react-native';
import { Avatar, useChatContext } from 'stream-chat-expo';
import { useRouter } from 'expo-router';

export default function UserListScreen() {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const { client } = useChatContext();
    const router = useRouter();

    const fetchUsers = async (searchText: string) => {
        if (!client.user?.id) return;

        setLoading(true);
        try {
            const response = await client.queryUsers(
                {
                    id: { $ne: client.user.id },
                    name: { $autocomplete: searchText },
                },
                { id: 1 },
                { limit: 20 }
            );
            setUsers(response.users);
        } catch (e) {
            console.error('Error fetching users:', e);
        } finally {
            setLoading(false);
        }
    };

    const onSearchChange = (text: string) => {
        setSearch(text);
        if (text.trim().length > 0) {
            fetchUsers(text.trim());
        } else {
            setUsers([]); // Clear results
        }
    };

    const startChat = async (user: any) => {
        const members = [client.user!.id, user.id];
        const uniqueId = members.sort().join('-');

        const channel = client.channel('messaging', uniqueId, {
            members,
        });

        await channel.watch();

        // 👇 Use replace so back goes to /chats instead of /userlist
        router.replace({
            pathname: '/channel',
            params: { id: channel.id },
        });
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <TextInput
                placeholder="Search users by name..."
                value={search}
                onChangeText={onSearchChange}
                style={{
                    height: 40,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    marginBottom: 12,
                }}
            />

            {loading && (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            )}

            {!loading && search.trim().length === 0 && (
                <Text
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        marginTop: 250,
                        fontSize: 16,
                        color: '#888',
                    }}
                >
                    Search to start conversation
                </Text>
            )}

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => startChat(item)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                        }}
                    >
                        <Avatar
                            image={item.image}
                            name={item.name || item.id}
                            size={40}
                        />
                        <Text style={{ marginLeft: 12, fontSize: 16 }}>
                            {item.name || item.id}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading &&
                        search.trim().length > 0 &&
                        users.length === 0 ? (
                        <Text
                            style={{
                                textAlign: 'center',
                                marginTop: 20,
                                fontSize: 16,
                                color: '#888',
                            }}
                        >
                            No users found.
                        </Text>
                    ) : null
                }
            />
        </View>
    );
}
