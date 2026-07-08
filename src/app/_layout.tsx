import "@/global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { requestNotificationPermission } from "../services/NotificationService";

export const unstable_settings = {
  initialRouteName: "Login",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" />
        <Stack.Screen name="index" />
        <Stack.Screen name="todo" />
      </Stack>
    </ThemeProvider>
  );
}
