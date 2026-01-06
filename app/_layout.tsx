import { Stack } from "expo-router";
import AppInitializer from "../app/components/AppInitializer";

export default function RootLayout() {
  return (
    <AppInitializer>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppInitializer>
  );
}