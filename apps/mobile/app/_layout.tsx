import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="bookings/index" />
        <Stack.Screen name="studio/[id]" />
        <Stack.Screen name="booking/[studioId]" />
        <Stack.Screen name="booking/complete" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="biz/dashboard" />
        <Stack.Screen name="biz/bookings/index" />
        <Stack.Screen name="biz/bookings/[id]" />
        <Stack.Screen name="biz/studios/index" />
        <Stack.Screen name="biz/studios/edit" />
        <Stack.Screen name="biz/studios/[id]" />
      </Stack>
    </SafeAreaProvider>
  );
}
