import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { Colors, FontSizes } from '../src/constants/theme';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      if (typeof window === 'undefined') return;

      // Get the hash fragment from URL
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        try {
          // Fetch user info from Google
          const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userInfo = await response.json();
            
            // Save user data
            const user = {
              id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
              provider: 'google' as const,
            };

            // Store in localStorage
            localStorage.setItem('sally_auth_user', JSON.stringify(user));
            localStorage.setItem('sally_auth_token', JSON.stringify({
              accessToken,
              expiresAt: Date.now() + 3600000,
            }));

            // Navigate to home
            router.replace('/(tabs)');
          } else {
            console.error('Failed to fetch user info');
            router.replace('/login');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          router.replace('/login');
        }
      } else {
        // No token, redirect to login
        router.replace('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginTop: 16,
  },
});
