import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewToken,
  RefreshControl,
} from 'react-native';
import { useSocialStore } from '../../src/store/useSocialStore';
import { SocialVideoCard } from '../../src/components/SocialVideoCard';
import { Colors } from '../../src/constants/theme';

export default function HomeScreen() {
  const { feedVideos, isLoading, hasMore, loadFeed, loadMore } = useSocialStore();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
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

  return (
    <View style={styles.container}>
      <FlatList
        data={feedVideos}
        renderItem={({ item, index }) => (
          <SocialVideoCard video={item} isActive={index === activeVideoIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
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
});
