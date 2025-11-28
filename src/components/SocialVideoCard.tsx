import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { SocialVideo } from '../types';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { useSocialStore } from '../store/useSocialStore';

interface SocialVideoCardProps {
  video: SocialVideo;
  isActive: boolean;
}

const { width, height } = Dimensions.get('window');

export const SocialVideoCard: React.FC<SocialVideoCardProps> = ({ video, isActive }) => {
  const videoRef = useRef<Video>(null);
  const { toggleLike, shareVideo } = useSocialStore();
  const [showComments, setShowComments] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Auto-play when card becomes active
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.playAsync().catch((error) => {
        console.error('Play error:', error);
        setHasError(true);
      });
    } else if (!isActive && videoRef.current) {
      videoRef.current.pauseAsync().catch((error) => {
        console.error('Pause error:', error);
      });
    }
  }, [isActive]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setIsMuted(status.isMuted);
      
      // Loop video when it ends
      if (status.didJustFinish && !status.isLooping) {
        videoRef.current?.replayAsync();
      }
    } else if (status.error) {
      setIsLoading(false);
      setHasError(true);
      console.error('Video error:', status.error);
    }
  };

  const handleLike = () => {
    toggleLike(video.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this AI-generated video: ${video.prompt}`,
      });
      await shareVideo(video.id);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* Video Player or Thumbnail */}
      {video.download_url && !hasError ? (
        <>
          <Video
            ref={videoRef}
            source={{ uri: video.download_url }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isActive}
            isLooping
            isMuted={isMuted}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
          
          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}

          {/* Tap to Play/Pause */}
          <TouchableOpacity 
            style={styles.tapOverlay} 
            onPress={togglePlayPause}
            activeOpacity={1}
          >
            {!isPlaying && !isLoading && (
              <View style={styles.pausedIcon}>
                <Text style={styles.pausedText}>▶</Text>
              </View>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <Image 
          source={{ uri: video.thumbnail_url || 'https://via.placeholder.com/400x800/1a1a1a/8B5CF6?text=No+Video' }} 
          style={styles.video} 
        />
      )}

      {/* Error State */}
      {hasError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>⚠️</Text>
          <Text style={styles.errorMessage}>Video unavailable</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Right Side Actions */}
      <View style={styles.rightActions}>
        {/* User Avatar */}
        <TouchableOpacity style={styles.avatarContainer}>
          <Image source={{ uri: video.user.avatar }} style={styles.avatar} />
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={styles.actionIcon}>{video.isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionCount}>{formatCount(video.likes)}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{formatCount(video.comments)}</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionCount}>{formatCount(video.shares)}</Text>
        </TouchableOpacity>

        {/* Mute/Unmute Button */}
        {video.download_url && !hasError && (
          <TouchableOpacity style={styles.actionButton} onPress={toggleMute}>
            <Text style={styles.actionIcon}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        )}

        {/* Model Badge */}
        <View style={styles.modelBadge}>
          <Text style={styles.modelText}>
            {video.model === 'sally-2-pro' ? '⚡' : '🚀'}
          </Text>
        </View>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <TouchableOpacity>
          <Text style={styles.username}>@{video.user.name.toLowerCase().replace(' ', '')}</Text>
        </TouchableOpacity>
        <Text style={styles.prompt} numberOfLines={3}>
          {video.prompt}
        </Text>
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            {video.seconds}s • {video.size}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: Colors.background,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  errorText: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorMessage: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'transparent',
  },
  rightActions: {
    position: 'absolute',
    right: Spacing.md,
    bottom: height * 0.15,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatarContainer: {
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.text,
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionCount: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  modelBadge: {
    marginTop: Spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelText: {
    fontSize: 24,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: height * 0.12,
    left: Spacing.md,
    right: 80,
  },
  username: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  prompt: {
    color: Colors.text,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metadataText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
  },
  pausedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedText: {
    color: Colors.text,
    fontSize: 32,
    marginLeft: 5,
  },
});
