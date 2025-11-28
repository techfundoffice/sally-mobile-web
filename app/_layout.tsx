import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '../src/constants/theme';
import { useAuthStore } from '../src/store/useAuthStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isInitialized, initialize } = useAuthStore();

  // Initialize auth on app start
  useEffect(() => {
    initialize();
  }, []);

  // Handle navigation based on auth state
  // Disabled for web to avoid routing conflicts
  // useEffect(() => {
  //   if (!isInitialized) return;
  //   const inAuthGroup = segments[0] === 'login';
  //   if (!user && !inAuthGroup) {
  //     router.replace('/login');
  //   } else if (user && inAuthGroup) {
  //     router.replace('/(tabs)');
  //   }
  // }, [user, isInitialized, segments]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
