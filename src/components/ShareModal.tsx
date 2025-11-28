import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share as RNShare,
  Alert,
  Clipboard,
} from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface ShareModalProps {
  visible: boolean;
  videoId: string;
  videoUrl?: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  videoId,
  videoUrl,
  onClose,
}) => {
  const shareUrl = videoUrl || `https://techfundoffice.github.io/video/${videoId}`;

  const handleShare = async (platform: string) => {
    try {
      await RNShare.share({
        message: `Check out this AI-generated video!\n\n${shareUrl}`,
        url: shareUrl,
      });
      onClose();
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopyLink = () => {
    Clipboard.setString(shareUrl);
    Alert.alert('Link Copied', 'Video link copied to clipboard');
    onClose();
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Download feature coming soon!');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Share Video</Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('general')}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>📤</Text>
              </View>
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleCopyLink}>
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>🔗</Text>
              </View>
              <Text style={styles.optionText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleDownload}>
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>⬇️</Text>
              </View>
              <Text style={styles.optionText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('twitter')}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>🐦</Text>
              </View>
              <Text style={styles.optionText}>Twitter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('facebook')}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>📘</Text>
              </View>
              <Text style={styles.optionText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('whatsapp')}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>💬</Text>
              </View>
              <Text style={styles.optionText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  option: {
    width: '30%',
    alignItems: 'center',
    padding: Spacing.md,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    textAlign: 'center',
  },
  cancelButton: {
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
