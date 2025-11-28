import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ViewToken,
  RefreshControl,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useSocialStore } from '../../src/store/useSocialStore';
import { SocialVideoCard } from '../../src/components/SocialVideoCard';
import { LoadingAnimation } from '../../src/components/LoadingAnimation';
import { Colors, Spacing, FontSizes, FontWeights } from '../../src/constants/theme';

const { height } = Dimensions.get('window');

type FeedType = 'for-you' | 'following' | 'top' | 'latest';

export default function HomeScreen() {
  const { feedVideos, isLoading, hasMore, loadFeed, loadMore } = useSocialStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [feedType, setFeedType] = useState<FeedType>('for-you');

  useEffect(() => {
    if (feedVideos.length === 0) {
      loadFeed();
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  };

  const handleFeedTypeChange = async (type: FeedType) => {
    setFeedType(type);
    // In a real app, this would load different feed data
    await loadFeed();
  };

  if (isLoading && feedVideos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingAnimation message="Loading feed..." size="large" />
      </View>
    );
  }

  if (feedVideos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎬</Text>
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptyText}>
          Be the first to create and share AI-generated videos!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Feed Type Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, feedType === 'for-you' && styles.tabActive]}
          onPress={() => handleFeedTypeChange('for-you')}
        >
          <Text style={[styles.tabText, feedType === 'for-you' && styles.tabTextActive]}>
            For You
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, feedType === 'following' && styles.tabActive]}
          onPress={() => handleFeedTypeChange('following')}
        >
          <Text style={[styles.tabText, feedType === 'following' && styles.tabTextActive]}>
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, feedType === 'top' && styles.tabActive]}
          onPress={() => handleFeedTypeChange('top')}
        >
          <Text style={[styles.tabText, feedType === 'top' && styles.tabTextActive]}>
            Top
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, feedType === 'latest' && styles.tabActive]}
          onPress={() => handleFeedTypeChange('latest')}
        >
          <Text style={[styles.tabText, feedType === 'latest' && styles.tabTextActive]}>
            Latest
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video Feed */}
      <FlatList
        data={feedVideos}
        renderItem={({ item, index }) => (
          <SocialVideoCard video={item} isActive={index === activeIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        ListFooterComponent={
          isLoading && hasMore ? (
            <View style={styles.footerLoader}>
              <LoadingAnimation message="Loading more..." size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
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
    lineHeight: 22,
  },
  tabsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  tab: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: FontWeights.bold,
  },
  footerLoader: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
