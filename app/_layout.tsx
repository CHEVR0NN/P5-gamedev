import { Stack } from "expo-router";
import AppLoading from "expo-app-loading";
import { useFonts, PixelifySans_400Regular } from "@expo-google-fonts/pixelify-sans";
import React from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PixelifySans: PixelifySans_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboards" options={{ headerShown: false }} />
    </Stack>
  );
}