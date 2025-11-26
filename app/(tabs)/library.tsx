import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useVideoStore } from '../../src/store/useVideoStore';
import { VideoCard } from '../../src/components/VideoCard';
import { VideoPlayer } from '../../src/components/VideoPlayer';
import { Colors, Spacing, FontSizes, FontWeights } from '../../src/constants/theme';
import { Video } from '../../src/types';

export default function LibraryScreen() {
  const { videos, isLoading, listVideos } = useVideoStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      await listVideos();
    } catch (error) {
      console.error('Failed to load videos:', error);
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
    }
  };

  const handleRemix = (video: Video) => {
    // TODO: Navigate to create screen with remix data
    console.log('Remix video:', video.id);
  };

  if (isLoading && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your videos...</Text>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🎬</Text>
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptyText}>
          Create your first AI-generated video in the Create tab
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Videos</Text>
        <Text style={styles.count}>{videos.length} videos</Text>
      </View>

      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => handleVideoPress(item)}
            onRemix={() => handleRemix(item)}
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
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
  },
});
