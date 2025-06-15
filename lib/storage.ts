import AsyncStorage from "@react-native-async-storage/async-storage";

export const getHasSeenOnboarding = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem("hasSeenOnboarding");
  return value === "true";
};

export const setHasSeenOnboarding = async (): Promise<void> => {
  await AsyncStorage.setItem("hasSeenOnboarding", "true");
};

export const resetOnboarding = async (): Promise<void> => {
  await AsyncStorage.removeItem("hasSeenOnboarding");
};
