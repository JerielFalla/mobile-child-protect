import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useRouter } from 'expo-router';

export default function UserListScreen() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { client } = useChatContext();
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!client.user?.id) return; // 💡 don't run unless user is ready

            try {
                const currentUserId = client.user.id;
                const response = await client.queryUsers(
                    { id: { $ne: currentUserId } },
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

        fetchUsers();
    }, [client.user?.id]); // ✅ wait for user to exist

    const startChat = async (user: any) => {
        const members = [client.user!.id, user.id];
        const uniqueId = members.sort().join('-');

        const channel = client.channel('messaging', uniqueId, {
            members,
        });

        await channel.watch();

        router.push({
            pathname: '/channel',
            params: { id: channel.id },
        });
    };

    if (!client.user?.id) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => startChat(item)}
                    style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}
                >
                    <Text>{item.name || item.id}</Text>
                </TouchableOpacity>
            )}
        />
    );
}
