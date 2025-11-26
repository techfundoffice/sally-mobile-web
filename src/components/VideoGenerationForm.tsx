import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';
import { VideoModel, VideoDuration, VideoResolution, VideoAspectRatio } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { useVideoStore } from '../store/useVideoStore';

export const VideoGenerationForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<VideoModel>('sally-2');
  const [duration, setDuration] = useState<VideoDuration>(8);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('portrait');
  const [resolution, setResolution] = useState<VideoResolution>('720x1280');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { generateVideo } = useVideoStore();

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
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      await generateVideo({
        prompt: prompt.trim(),
        model,
        size: resolution,
        seconds: duration,
        input_reference: referenceImage || undefined,
      });

      Alert.alert('Success', 'Video generation started! Check the Library tab to monitor progress.');
      
      // Reset form
      setPrompt('');
      setReferenceImage(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const resolutionOptions: VideoResolution[] =
    aspectRatio === 'portrait'
      ? ['720x1280', '1024x1792']
      : ['1280x720', '1792x1024'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create Video</Text>

      <Input
        label="Prompt"
        placeholder="Describe the video you want to generate..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={4}
        style={styles.promptInput}
      />

      {/* Model Selection */}
      <Text style={styles.sectionLabel}>Model</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionButton, model === 'sally-2' && styles.optionButtonActive]}
          onPress={() => setModel('sally-2')}
        >
          <Text style={[styles.optionText, model === 'sally-2' && styles.optionTextActive]}>
            Sally 2 (Fast)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, model === 'sally-2-pro' && styles.optionButtonActive]}
          onPress={() => setModel('sally-2-pro')}
        >
          <Text style={[styles.optionText, model === 'sally-2-pro' && styles.optionTextActive]}>
            Sally 2 Pro
          </Text>
        </TouchableOpacity>
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
            Portrait (9:16)
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
            Landscape (16:9)
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
          <Text style={styles.uploadButtonText}>+ Upload Image</Text>
        </TouchableOpacity>
      )}

      <Button
        title="Generate Video"
        onPress={handleGenerate}
        loading={isGenerating}
        fullWidth
        style={styles.generateButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  promptInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
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
    marginBottom: Spacing.xl,
  },
});
