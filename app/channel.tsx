import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-expo';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';

const ChannelScreen = () => {
    const { id } = useLocalSearchParams(); // `id` from router param
    const { client } = useChatContext();
    const [channel, setChannel] = useState<any>(null); // fix type if needed

    useEffect(() => {
        if (typeof id === 'string') {
            const ch = client.channel('messaging', id);

            ch.watch().then(() => {
                client.activeChannel = ch; // 👈 add this
                setChannel(ch);
            });
        }
    }, [id]);

    if (!channel) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
        <Channel channel={channel}>
            <View style={{ flex: 1 }}>
                <MessageList />
                <MessageInput />
            </View>
        </Channel>
    );
};

export default ChannelScreen;
