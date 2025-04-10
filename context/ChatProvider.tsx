import React, { useEffect, useState } from 'react';
import { OverlayProvider, Chat } from 'stream-chat-expo';
import { streamClient } from '../lib/streamClient';
import { getStoredUserInfo } from '../utils/auth';
import { ActivityIndicator, View } from 'react-native';

type Props = { children: React.ReactNode };

export default function ChatProvider({ children }: Props) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const setupChat = async () => {
            const userInfo = await getStoredUserInfo();
            console.log("📦 Stored user info:", userInfo);
            if (!userInfo) {
                console.log("🔌 No Stream user info, skipping connection");
                setIsReady(true); // Still let app load
                return;
            }

            try {
                if (streamClient.userID) {
                    await streamClient.disconnectUser();
                }

                // Use the correct chatToken
                await streamClient.connectUser(
                    { id: userInfo.userId, name: userInfo.name || userInfo.userId },
                    userInfo.chatToken // Updated to chatToken
                );
                console.log("✅ Stream connected:", userInfo.userId);
                console.log("⚡ Connecting to Stream with:", {
                    id: userInfo.userId,
                    name: userInfo.name,
                    token: userInfo.chatToken, // Updated to chatToken
                });

            } catch (err) {
                console.error("Stream connection failed:", err);
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
