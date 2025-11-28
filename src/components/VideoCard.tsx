import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Video } from '../types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../constants/theme';
import { useVideoStore } from '../store/useVideoStore';

interface VideoCardProps {
  video: Video;
  onPress?: () => void;
  onRemix?: () => void;
  onDelete?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress, onRemix, onDelete }) => {
  const { deleteVideo } = useVideoStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'processing':
      case 'queued':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing...';
      case 'queued':
        return 'Queued';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVideo(video.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={video.status !== 'completed'}
    >
      <View style={styles.thumbnailContainer}>
        {video.thumbnail_url ? (
          <Image source={{ uri: video.thumbnail_url }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            {video.status === 'processing' || video.status === 'queued' ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text style={styles.placeholderText}>🎬</Text>
            )}
          </View>
        )}
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(video.status) }]}>
          <Text style={styles.statusText}>{getStatusText(video.status)}</Text>
        </View>

        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.seconds}s</Text>
        </View>

        {/* Progress Bar for processing videos */}
        {(video.status === 'processing' || video.status === 'queued') && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${video.progress || 0}%` }]} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.prompt} numberOfLines={2}>
          {video.prompt}
        </Text>
        
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            {video.model === 'sally-2-pro' ? '⚡ Pro' : '🚀 Fast'} • {video.size}
          </Text>
          <Text style={styles.metadataText}>
            {new Date(video.created_at * 1000).toLocaleDateString()}
          </Text>
        </View>

        {video.status === 'completed' && (
          <View style={styles.actions}>
            {onRemix && (
              <TouchableOpacity style={styles.actionButton} onPress={onRemix}>
                <Text style={styles.actionButtonText}>🔄 Remix</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={onDelete || handleDelete}>
              <Text style={[styles.actionButtonText, styles.deleteText]}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {video.status === 'failed' && video.error && (
          <Text style={styles.errorText} numberOfLines={2}>
            Error: {video.error}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  durationBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.overlay,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.surfaceLight,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    padding: Spacing.md,
  },
  prompt: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  metadataText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  deleteText: {
    color: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.sm,
  },
});
