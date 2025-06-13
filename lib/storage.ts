// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hasSeenOnboarding = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem("hasSeenOnboarding");
  return value === "true";
};

export const setHasSeenOnboarding = async () => {
  await AsyncStorage.setItem("hasSeenOnboarding", "true");
};
