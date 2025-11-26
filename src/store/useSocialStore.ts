import { create } from 'zustand';
import { SocialVideo, Comment } from '../types';

interface SocialStore {
  feedVideos: SocialVideo[];
  isLoading: boolean;
  hasMore: boolean;
  
  loadFeed: () => Promise<void>;
  loadMore: () => Promise<void>;
  toggleLike: (videoId: string) => void;
  addComment: (videoId: string, text: string) => Promise<void>;
  shareVideo: (videoId: string) => Promise<void>;
}

// Mock data generator for social feed
const generateMockSocialVideos = (count: number, offset: number = 0): SocialVideo[] => {
  const prompts = [
    'A sweeping drone shot over neon-drenched Tokyo at night',
    'Golden hour waves crashing on a pristine beach',
    'Time-lapse of northern lights dancing over snowy mountains',
    'Cyberpunk city street with holographic advertisements',
    'Underwater coral reef teeming with colorful fish',
    'Vintage film of a steam train through autumn forest',
    'Abstract liquid gold flowing in slow motion',
    'Futuristic spacecraft landing on alien planet',
  ];

  const users = [
    { id: '1', name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Marcus Lee', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const index = (offset + i) % prompts.length;
    const userIndex = (offset + i) % users.length;
    
    return {
      id: `social_${offset + i}`,
      prompt: prompts[index],
      model: Math.random() > 0.5 ? 'sally-2-pro' : 'sally-2',
      size: '720x1280',
      seconds: 8,
      status: 'completed',
      created_at: Date.now() / 1000 - (offset + i) * 3600,
      completed_at: Date.now() / 1000 - (offset + i) * 3600 + 300,
      download_url: `https://example.com/video_${offset + i}.mp4`,
      thumbnail_url: `https://picsum.photos/720/1280?random=${offset + i}`,
      remix_video_id: null,
      user: users[userIndex],
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 200),
      isLiked: false,
    };
  });
};

export const useSocialStore = create<SocialStore>((set, get) => ({
  feedVideos: [],
  isLoading: false,
  hasMore: true,

  loadFeed: async () => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const videos = generateMockSocialVideos(10, 0);
    set({ feedVideos: videos, isLoading: false, hasMore: true });
  },

  loadMore: async () => {
    const { feedVideos, hasMore } = get();
    
    if (!hasMore) return;
    
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newVideos = generateMockSocialVideos(10, feedVideos.length);
    
    set({
      feedVideos: [...feedVideos, ...newVideos],
      isLoading: false,
      hasMore: feedVideos.length < 50, // Limit to 50 videos for demo
    });
  },

  toggleLike: (videoId: string) => {
    set((state) => ({
      feedVideos: state.feedVideos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video
      ),
    }));
  },

  addComment: async (videoId: string, text: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set((state) => ({
      feedVideos: state.feedVideos.map((video) =>
        video.id === videoId
          ? { ...video, comments: video.comments + 1 }
          : video
      ),
    }));
  },

  shareVideo: async (videoId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    set((state) => ({
      feedVideos: state.feedVideos.map((video) =>
        video.id === videoId
          ? { ...video, shares: video.shares + 1 }
          : video
      ),
    }));
  },
}));
