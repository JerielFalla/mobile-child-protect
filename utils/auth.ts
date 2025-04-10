import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredUserInfo = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    const chatToken = await AsyncStorage.getItem("token"); // ✅ Must match what you save
    const name = await AsyncStorage.getItem("name");

    if (!userId || !chatToken) {
      return null;
    }

    return { userId, chatToken, name };
  } catch (err) {
    console.error("Error reading user info:", err);
    return null;
  }
};
