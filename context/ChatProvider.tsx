// context/ChatProvider.tsx
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { OverlayProvider, Chat } from 'stream-chat-expo';
import { streamClient } from '../lib/streamClient';
import { getStoredUserInfo } from '../utils/auth';
import { ActivityIndicator, View } from 'react-native';

type Props = {
    children: React.ReactNode;
};

export default function ChatProvider({ children }: Props) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const setupChat = async () => {
            try {
                const userInfo = await getStoredUserInfo();
                if (!userInfo?.userId || !userInfo?.token) {
                    throw new Error('User info or token not found.');
                }

                // Disconnect any existing user
                if (streamClient.userID) {
                    await streamClient.disconnectUser();
                }

                await streamClient.connectUser(
                    {
                        id: userInfo.userId,
                        name: userInfo.name || userInfo.userId,
                    },
                    userInfo.token
                );
            } catch (err) {
                console.error('Stream connection failed:', err);
                Alert.alert('Chat Error', 'Could not connect to chat. Try logging out and back in.');
            } finally {
                setIsReady(true);
            }
        };

        setupChat();

        return () => {
            streamClient.disconnectUser();
        };
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <OverlayProvider>
            <Chat client={streamClient}>{children}</Chat>
        </OverlayProvider>
    );
}
