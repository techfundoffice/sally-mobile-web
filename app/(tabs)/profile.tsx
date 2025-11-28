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
import { useVideoStore, VideoProvider } from '../../src/store/useVideoStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../../src/constants/theme';

export default function ProfileScreen() {
  const {
    provider,
    setProvider,
    openaiApiKey,
    falaiApiKey,
    setOpenAIApiKey,
    setFalAIApiKey,
    clearOpenAIApiKey,
    clearFalAIApiKey,
    getOpenAIApiKey,
    getFalAIApiKey,
    videos,
  } = useVideoStore();
  const { user, signOut } = useAuthStore();
  
  const [openaiKeyInput, setOpenaiKeyInput] = useState('');
  const [falaiKeyInput, setFalaiKeyInput] = useState('');
  const [isEditingOpenAI, setIsEditingOpenAI] = useState(false);
  const [isEditingFalAI, setIsEditingFalAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    const openaiKey = await getOpenAIApiKey();
    const falaiKey = await getFalAIApiKey();
    
    if (openaiKey) {
      setOpenaiKeyInput(maskApiKey(openaiKey));
    } else {
      setIsEditingOpenAI(true);
    }
    
    if (falaiKey) {
      setFalaiKeyInput(maskApiKey(falaiKey));
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 7) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  const handleSaveOpenAIKey = async () => {
    if (!openaiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter your OpenAI API key');
      return;
    }

    setIsSaving(true);
    try {
      await setOpenAIApiKey(openaiKeyInput.trim());
      setIsEditingOpenAI(false);
      Alert.alert('Success', 'OpenAI API key saved successfully');
      setOpenaiKeyInput(maskApiKey(openaiKeyInput.trim()));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFalAIKey = async () => {
    if (!falaiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter your fal.ai API key');
      return;
    }

    setIsSaving(true);
    try {
      await setFalAIApiKey(falaiKeyInput.trim());
      setIsEditingFalAI(false);
      Alert.alert('Success', 'fal.ai API key saved successfully');
      setFalaiKeyInput(maskApiKey(falaiKeyInput.trim()));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearOpenAIKey = () => {
    Alert.alert(
      'Clear OpenAI API Key',
      'Are you sure you want to remove your OpenAI API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearOpenAIApiKey();
            setOpenaiKeyInput('');
            setIsEditingOpenAI(true);
          },
        },
      ]
    );
  };

  const handleClearFalAIKey = () => {
    Alert.alert(
      'Clear fal.ai API Key',
      'Are you sure you want to remove your fal.ai API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearFalAIApiKey();
            setFalaiKeyInput('');
            setIsEditingFalAI(true);
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

      {/* Provider Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video Provider</Text>
        <Text style={styles.sectionDescription}>
          Choose which AI service to use for video generation
        </Text>
        <View style={styles.providerButtons}>
          <TouchableOpacity
            style={[styles.providerButton, provider === 'openai' && styles.providerButtonActive]}
            onPress={() => setProvider('openai')}
          >
            <Text style={[styles.providerButtonText, provider === 'openai' && styles.providerButtonTextActive]}>
              OpenAI Sally
            </Text>
            {provider === 'openai' && <Text style={styles.providerBadge}>Active</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.providerButton, provider === 'falai' && styles.providerButtonActive]}
            onPress={() => setProvider('falai')}
          >
            <Text style={[styles.providerButtonText, provider === 'falai' && styles.providerButtonTextActive]}>
              fal.ai
            </Text>
            {provider === 'falai' && <Text style={styles.providerBadge}>Active</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* OpenAI API Key Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OpenAI API Key</Text>
        <Text style={styles.sectionDescription}>
          Required for OpenAI Sally video generation. Get your key at platform.openai.com
        </Text>

        {isEditingOpenAI ? (
          <>
            <Input
              placeholder="sk-proj-..."
              value={openaiKeyInput}
              onChangeText={setOpenaiKeyInput}
              secureTextEntry={false}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.buttonRow}>
              <Button
                title="Save"
                onPress={handleSaveOpenAIKey}
                loading={isSaving}
                style={styles.button}
              />
              {openaiApiKey && (
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditingOpenAI(false);
                    setOpenaiKeyInput(maskApiKey(openaiApiKey));
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
              <Text style={styles.apiKeyText}>{openaiKeyInput || 'Not set'}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                onPress={() => {
                  setOpenaiKeyInput('');
                  setIsEditingOpenAI(true);
                }}
                variant="outline"
                style={styles.button}
              />
              {openaiApiKey && (
                <Button
                  title="Clear"
                  onPress={handleClearOpenAIKey}
                  variant="outline"
                  style={styles.button}
                />
              )}
            </View>
          </>
        )}
      </View>

      {/* fal.ai API Key Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>fal.ai API Key</Text>
        <Text style={styles.sectionDescription}>
          Required for fal.ai video generation. Get your key at fal.ai/dashboard/keys
        </Text>

        {isEditingFalAI ? (
          <>
            <Input
              placeholder="FAL_KEY_ID:FAL_KEY_SECRET"
              value={falaiKeyInput}
              onChangeText={setFalaiKeyInput}
              secureTextEntry={false}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.buttonRow}>
              <Button
                title="Save"
                onPress={handleSaveFalAIKey}
                loading={isSaving}
                style={styles.button}
              />
              {falaiApiKey && (
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditingFalAI(false);
                    setFalaiKeyInput(maskApiKey(falaiApiKey));
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
              <Text style={styles.apiKeyText}>{falaiKeyInput || 'Not set'}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                onPress={() => {
                  setFalaiKeyInput('');
                  setIsEditingFalAI(true);
                }}
                variant="outline"
                style={styles.button}
              />
              {falaiApiKey && (
                <Button
                  title="Clear"
                  onPress={handleClearFalAIKey}
                  variant="outline"
                  style={styles.button}
                />
              )}
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
          <Text style={styles.infoLabel}>Active Provider</Text>
          <Text style={styles.infoValue}>{provider === 'openai' ? 'OpenAI Sally' : 'fal.ai'}</Text>
        </View>
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
  providerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  providerButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  providerButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  providerButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  providerButtonTextActive: {
    color: Colors.primary,
  },
  providerBadge: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.bold,
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
  signOutContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
