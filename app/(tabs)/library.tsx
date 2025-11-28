import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoStore } from '../../src/store/useVideoStore';
import { VideoCard } from '../../src/components/VideoCard';
import { VideoPlayer } from '../../src/components/VideoPlayer';
import { Colors, Spacing, FontSizes, FontWeights } from '../../src/constants/theme';
import { Video } from '../../src/types';

export default function LibraryScreen() {
  const router = useRouter();
  const { videos, isLoading, error, listVideos, deleteVideo, clearError, getApiKey } = useVideoStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingApiKey, setCheckingApiKey] = useState(true);

  useEffect(() => {
    checkApiKeyAndLoad();
  }, []);

  const checkApiKeyAndLoad = async () => {
    setCheckingApiKey(true);
    try {
      const key = await getApiKey();
      setHasApiKey(!!key);
      if (key) {
        await loadVideos();
      }
    } catch (error) {
      console.error('Failed to check API key:', error);
    } finally {
      setCheckingApiKey(false);
    }
  };

  const loadVideos = async () => {
    try {
      clearError();
      await listVideos();
    } catch (error: any) {
      console.error('Failed to load videos:', error);
      Alert.alert('Error', error.message || 'Failed to load videos');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const handleVideoPress = (video: Video) => {
    if (video.status === 'completed' && video.download_url) {
      setSelectedVideo(video);
    } else if (video.status === 'failed') {
      Alert.alert(
        'Generation Failed',
        video.error || 'This video failed to generate. Please try again.',
        [
          { text: 'OK', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => handleDelete(video)
          }
        ]
      );
    } else if (video.status === 'processing' || video.status === 'queued') {
      Alert.alert(
        'Video Processing',
        `This video is still being generated. Progress: ${video.progress || 0}%`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDelete = async (video: Video) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVideo(video.id);
              Alert.alert('Success', 'Video deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const handleRemix = (video: Video) => {
    // TODO: Navigate to create screen with remix data
    router.push('/(tabs)/create');
    Alert.alert('Remix', 'Remix feature coming soon!');
  };

  // Show loading state while checking API key
  if (checkingApiKey) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show API key warning if not set
  if (!hasApiKey) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🔑</Text>
        <Text style={styles.emptyTitle}>API Key Required</Text>
        <Text style={styles.emptyText}>
          Add your OpenAI API key in the Profile tab to view and generate videos.
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.actionButtonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading state
  if (isLoading && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your videos...</Text>
      </View>
    );
  }

  // Show error state
  if (error && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Failed to Load Videos</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
          <Text style={styles.actionButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show empty state
  if (videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🎬</Text>
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptyText}>
          Create your first AI-generated video in the Create tab
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Text style={styles.actionButtonText}>Create Video</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate stats
  const completedCount = videos.filter(v => v.status === 'completed').length;
  const processingCount = videos.filter(v => v.status === 'processing' || v.status === 'queued').length;
  const failedCount = videos.filter(v => v.status === 'failed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Videos</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{videos.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.success }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          {processingCount > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.warning }]}>{processingCount}</Text>
              <Text style={styles.statLabel}>Processing</Text>
            </View>
          )}
          {failedCount > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.error }]}>{failedCount}</Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
          )}
        </View>
      </View>

      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => handleVideoPress(item)}
            onRemix={() => handleRemix(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />

      {selectedVideo && selectedVideo.download_url && (
        <VideoPlayer
          visible={!!selectedVideo}
          videoUrl={selectedVideo.download_url}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: Spacing.md,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 24,
  },
  actionButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
