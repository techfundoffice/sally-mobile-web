import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useVideoStore } from '../../src/store/useVideoStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../../src/constants/theme';

export default function ProfileScreen() {
  const { apiKey, setApiKey, clearApiKey, getApiKey, videos } = useVideoStore();
  const { user, signOut } = useAuthStore();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    const key = await getApiKey();
    if (key) {
      setApiKeyInput(maskApiKey(key));
    } else {
      setIsEditing(true);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 7) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter your OpenAI API key');
      return;
    }

    setIsSaving(true);
    try {
      await setApiKey(apiKeyInput.trim());
      setIsEditing(false);
      Alert.alert('Success', 'API key saved successfully');
      setApiKeyInput(maskApiKey(apiKeyInput.trim()));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearApiKey = () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure you want to remove your API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearApiKey();
            setApiKeyInput('');
            setIsEditing(true);
          },
        },
      ]
    );
  };

  const completedVideos = videos.filter((v) => v.status === 'completed').length;
  const processingVideos = videos.filter((v) => v.status === 'processing' || v.status === 'queued').length;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.picture || 'https://i.pravatar.cc/150?img=50' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.name || 'Sally User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{videos.length}</Text>
          <Text style={styles.statLabel}>Total Videos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedVideos}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{processingVideos}</Text>
          <Text style={styles.statLabel}>Processing</Text>
        </View>
      </View>

      {/* API Key Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OpenAI API Key</Text>
        <Text style={styles.sectionDescription}>
          Your API key is stored securely on your device and is required to generate videos.
        </Text>

        {isEditing ? (
          <>
            <Input
              placeholder="sk-..."
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry={!isEditing}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.buttonRow}>
              <Button
                title="Save"
                onPress={handleSaveApiKey}
                loading={isSaving}
                style={styles.button}
              />
              {apiKey && (
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    setApiKeyInput(maskApiKey(apiKey));
                  }}
                  variant="outline"
                  style={styles.button}
                />
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.apiKeyDisplay}>
              <Text style={styles.apiKeyText}>{apiKeyInput || 'Not set'}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                onPress={() => {
                  setApiKeyInput('');
                  setIsEditing(true);
                }}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Clear"
                onPress={handleClearApiKey}
                variant="outline"
                style={styles.button}
              />
            </View>
          </>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Powered by</Text>
          <Text style={styles.infoValue}>OpenAI Sally</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Get your API key at{' '}
          <Text style={styles.link}>platform.openai.com</Text>
        </Text>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  name: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  apiKeyDisplay: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  apiKeyText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  footer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  link: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  signOutContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
