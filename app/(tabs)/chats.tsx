// app/(tabs)/chats.tsx
import { useLayoutEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChannelList, useChatContext } from 'stream-chat-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { streamClient } from '../../lib/streamClient';

export default function ChatsScreen() {
    const { client } = useChatContext();
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chats',
            headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/userlist')} style={{ marginRight: 16 }}>
                    <Ionicons name="person-add" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleChannelPress = (channel: any) => {
        router.push({
            pathname: '/channel',
            params: { id: channel.id },
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <ChannelList
                filters={{ type: 'messaging', members: { $in: [client.user?.id || ''] } }}
                sort={{ last_message_at: -1 }}
                onSelect={handleChannelPress}

            />
        </View>
    );
}
