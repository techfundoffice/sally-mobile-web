import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';
import { VideoModel, VideoDuration, VideoResolution, VideoAspectRatio } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { useVideoStore } from '../store/useVideoStore';
import { FALAI_MODELS } from '../services/falai';

export const VideoGenerationForm: React.FC = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<string>('sally-2');
  const [duration, setDuration] = useState<VideoDuration>(8);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('portrait');
  const [resolution, setResolution] = useState<VideoResolution>('720x1280');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingApiKey, setCheckingApiKey] = useState(true);

  const {
    generateVideo,
    provider,
    getOpenAIApiKey,
    getFalAIApiKey,
    openaiApiKey,
    falaiApiKey,
  } = useVideoStore();

  // Check for API key on mount and when provider changes
  useEffect(() => {
    checkApiKey();
  }, [provider]);

  const checkApiKey = async () => {
    setCheckingApiKey(true);
    try {
      if (provider === 'openai') {
        const key = await getOpenAIApiKey();
        setHasApiKey(!!key);
      } else {
        const key = await getFalAIApiKey();
        setHasApiKey(!!key);
      }
    } catch (error) {
      setHasApiKey(false);
    } finally {
      setCheckingApiKey(false);
    }
  };

  // Get available models based on provider
  const getAvailableModels = () => {
    if (provider === 'openai') {
      return [
        { id: 'sally-2', name: 'Sally 2 (Fast)', description: '~30s generation' },
        { id: 'sally-2-pro', name: 'Sally 2 Pro', description: 'Higher quality' },
      ];
    } else {
      // Filter fal.ai models based on whether we have a reference image
      const modelType = referenceImage ? 'image-to-video' : 'text-to-video';
      return FALAI_MODELS
        .filter(m => m.type === modelType)
        .map(m => ({
          id: m.id,
          name: m.name,
          description: m.description.substring(0, 50) + '...',
        }));
    }
  };

  const availableModels = getAvailableModels();

  // Reset model when provider or reference image changes
  useEffect(() => {
    if (availableModels.length > 0 && !availableModels.find(m => m.id === model)) {
      setModel(availableModels[0].id);
    }
  }, [provider, referenceImage]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to upload reference images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio === 'portrait' ? [9, 16] : aspectRatio === 'landscape' ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setReferenceImage(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    // Check API key first
    if (!hasApiKey) {
      const providerName = provider === 'openai' ? 'OpenAI' : 'fal.ai';
      Alert.alert(
        'API Key Required',
        `Please add your ${providerName} API key in the Profile tab to generate videos.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Go to Profile', 
            onPress: () => router.push('/(tabs)/profile')
          }
        ]
      );
      return;
    }

    if (!prompt.trim()) {
      Alert.alert('Prompt Required', 'Please enter a description for your video.');
      return;
    }

    if (prompt.trim().length < 10) {
      Alert.alert('Prompt Too Short', 'Please provide a more detailed description (at least 10 characters).');
      return;
    }

    setIsGenerating(true);
    try {
      const video = await generateVideo({
        prompt: prompt.trim(),
        model,
        duration,
        resolution,
        aspectRatio,
        imageUrl: referenceImage || undefined,
      });

      Alert.alert(
        'Video Generation Started!',
        `Your video is being generated with ${provider === 'openai' ? 'OpenAI Sally' : 'fal.ai'}. Check the Library tab to monitor progress.\n\nVideo ID: ${video.id}`,
        [
          { text: 'Stay Here', style: 'cancel' },
          { 
            text: 'Go to Library', 
            onPress: () => router.push('/(tabs)/library')
          }
        ]
      );
      
      // Reset form
      setPrompt('');
      setReferenceImage(null);
    } catch (error: any) {
      console.error('Generation error:', error);
      
      let errorMessage = 'Failed to generate video. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.message?.includes('401') || error.message?.includes('Invalid')) {
        errorMessage = `Invalid API key. Please check your ${provider === 'openai' ? 'OpenAI' : 'fal.ai'} API key in the Profile tab.`;
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message?.includes('500') || error.message?.includes('server')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      Alert.alert('Generation Failed', errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const resolutionOptions: VideoResolution[] =
    aspectRatio === 'portrait'
      ? ['720x1280', '1024x1792']
      : ['1280x720', '1792x1024'];

  // Show loading state while checking API key
  if (checkingApiKey) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show API key warning if not set
  if (!hasApiKey) {
    const providerName = provider === 'openai' ? 'OpenAI' : 'fal.ai';
    return (
      <View style={styles.warningContainer}>
        <Text style={styles.warningIcon}>🔑</Text>
        <Text style={styles.warningTitle}>API Key Required</Text>
        <Text style={styles.warningMessage}>
          You need to add your {providerName} API key to generate videos.
        </Text>
        <Button
          title="Go to Profile"
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.warningButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Video</Text>
        <View style={styles.providerBadge}>
          <Text style={styles.providerBadgeText}>
            {provider === 'openai' ? '🤖 OpenAI' : '⚡ fal.ai'}
          </Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Describe your video in detail for best results
      </Text>

      <Input
        label="Prompt"
        placeholder="Describe the video you want to generate..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={4}
        style={styles.promptInput}
      />
      <Text style={styles.characterCount}>
        {prompt.length} characters
      </Text>

      {/* Model Selection */}
      <Text style={styles.sectionLabel}>Model</Text>
      <View style={styles.modelGrid}>
        {availableModels.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.modelButton, model === m.id && styles.modelButtonActive]}
            onPress={() => setModel(m.id)}
          >
            <Text style={[styles.modelText, model === m.id && styles.modelTextActive]}>
              {m.name}
            </Text>
            <Text style={styles.modelSubtext}>{m.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Duration Selection */}
      <Text style={styles.sectionLabel}>Duration</Text>
      <View style={styles.optionRow}>
        {([4, 8, 12, 16, 20] as VideoDuration[]).map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.durationButton, duration === d && styles.optionButtonActive]}
            onPress={() => setDuration(d)}
          >
            <Text style={[styles.optionText, duration === d && styles.optionTextActive]}>
              {d}s
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Aspect Ratio Selection */}
      <Text style={styles.sectionLabel}>Aspect Ratio</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionButton, aspectRatio === 'portrait' && styles.optionButtonActive]}
          onPress={() => {
            setAspectRatio('portrait');
            setResolution('720x1280');
          }}
        >
          <Text style={[styles.optionText, aspectRatio === 'portrait' && styles.optionTextActive]}>
            📱 Portrait (9:16)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, aspectRatio === 'landscape' && styles.optionButtonActive]}
          onPress={() => {
            setAspectRatio('landscape');
            setResolution('1280x720');
          }}
        >
          <Text style={[styles.optionText, aspectRatio === 'landscape' && styles.optionTextActive]}>
            🖥️ Landscape (16:9)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resolution Selection */}
      <Text style={styles.sectionLabel}>Resolution</Text>
      <View style={styles.optionRow}>
        {resolutionOptions.map((res) => (
          <TouchableOpacity
            key={res}
            style={[styles.optionButton, resolution === res && styles.optionButtonActive]}
            onPress={() => setResolution(res)}
          >
            <Text style={[styles.optionText, resolution === res && styles.optionTextActive]}>
              {res}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reference Image */}
      <Text style={styles.sectionLabel}>Reference Image (Optional)</Text>
      <Text style={styles.helperText}>
        Upload an image to animate or use as style reference
      </Text>
      {referenceImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: referenceImage }} style={styles.referenceImage} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setReferenceImage(null)}
          >
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadIcon}>📷</Text>
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>
      )}

      <Button
        title={isGenerating ? 'Generating...' : 'Generate Video'}
        onPress={handleGenerate}
        loading={isGenerating}
        disabled={isGenerating || !prompt.trim()}
        fullWidth
        style={styles.generateButton}
      />

      <Text style={styles.disclaimer}>
        💡 Tip: Be specific about camera angles, lighting, and motion for best results
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  providerBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  providerBadgeText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  warningIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  warningTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  warningMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  warningButton: {
    minWidth: 200,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  promptInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  helperText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  modelGrid: {
    gap: Spacing.sm,
  },
  modelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modelButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modelText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  modelTextActive: {
    color: Colors.text,
  },
  modelSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationButton: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md + 4,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  uploadButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  uploadIcon: {
    fontSize: 24,
  },
  uploadButtonText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  referenceImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.error,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  generateButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  disclaimer: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
});
