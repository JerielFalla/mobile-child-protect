// utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredUserInfo = async () => {
  const userId = await AsyncStorage.getItem("userId");
  const name = await AsyncStorage.getItem("name");
  const token = await AsyncStorage.getItem("chatToken");
  return { userId, name, token };
};
