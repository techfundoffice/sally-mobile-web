import { create } from 'zustand';
import { Video, VideoGenerationParams, RemixParams } from '../types';
import { apiService } from '../services/api';
import { falaiService } from '../services/falai';

export type VideoProvider = 'openai' | 'falai';

interface VideoStore {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  provider: VideoProvider;
  openaiApiKey: string | null;
  falaiApiKey: string | null;
  
  // Provider management
  setProvider: (provider: VideoProvider) => void;
  getProvider: () => VideoProvider;
  
  // API Key management
  setOpenAIApiKey: (key: string) => Promise<void>;
  setFalAIApiKey: (key: string) => Promise<void>;
  getOpenAIApiKey: () => Promise<string | null>;
  getFalAIApiKey: () => Promise<string | null>;
  clearOpenAIApiKey: () => Promise<void>;
  clearFalAIApiKey: () => Promise<void>;
  
  // Video operations
  generateVideo: (params: VideoGenerationParams) => Promise<Video>;
  getVideoStatus: (videoId: string) => Promise<Video>;
  listVideos: () => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  remixVideo: (params: RemixParams) => Promise<Video>;
  
  // Local state management
  addVideo: (video: Video) => void;
  updateVideo: (videoId: string, updates: Partial<Video>) => void;
  removeVideo: (videoId: string) => void;
  clearError: () => void;
  
  // Polling for video status
  startPolling: (videoId: string) => void;
  stopPolling: (videoId: string) => void;
}

const pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  isLoading: false,
  error: null,
  provider: 'openai',
  openaiApiKey: null,
  falaiApiKey: null,

  setProvider: (provider: VideoProvider) => {
    set({ provider });
  },

  getProvider: () => {
    return get().provider;
  },

  setOpenAIApiKey: async (key: string) => {
    try {
      await apiService.setApiKey(key);
      set({ openaiApiKey: key, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  setFalAIApiKey: async (key: string) => {
    try {
      falaiService.setApiKey(key);
      set({ falaiApiKey: key, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  getOpenAIApiKey: async () => {
    try {
      const key = await apiService.getApiKey();
      set({ openaiApiKey: key });
      return key;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  getFalAIApiKey: async () => {
    try {
      const key = falaiService.getApiKey();
      set({ falaiApiKey: key });
      return key;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  clearOpenAIApiKey: async () => {
    try {
      await apiService.clearApiKey();
      set({ openaiApiKey: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearFalAIApiKey: async () => {
    try {
      falaiService.setApiKey('');
      set({ falaiApiKey: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  generateVideo: async (params: VideoGenerationParams) => {
    set({ isLoading: true, error: null });
    try {
      const provider = get().provider;
      let video: Video;

      if (provider === 'falai') {
        video = await falaiService.generateVideo(params);
      } else {
        video = await apiService.generateVideo(params);
      }

      set((state) => ({
        videos: [video, ...state.videos],
        isLoading: false,
      }));
      
      // Start polling for this video (only for OpenAI)
      if (provider === 'openai') {
        get().startPolling(video.id);
      }
      
      return video;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  getVideoStatus: async (videoId: string) => {
    try {
      const provider = get().provider;
      let video: Video;

      if (provider === 'falai') {
        // fal.ai doesn't support status checking for completed videos
        const existingVideo = get().videos.find(v => v.id === videoId);
        if (!existingVideo) {
          throw new Error('Video not found');
        }
        video = existingVideo;
      } else {
        video = await apiService.getVideoStatus(videoId);
      }

      set((state) => ({
        videos: state.videos.map((v) => (v.id === videoId ? video : v)),
      }));
      
      // Stop polling if video is completed or failed
      if (video.status === 'completed' || video.status === 'failed') {
        get().stopPolling(videoId);
      }
      
      return video;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  listVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = get().provider;
      let videos: Video[];

      if (provider === 'falai') {
        // fal.ai doesn't have a list endpoint, use local videos
        videos = get().videos;
      } else {
        videos = await apiService.listVideos();
      }

      set({ videos, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteVideo: async (videoId: string) => {
    set({ isLoading: true, error: null });
    try {
      const provider = get().provider;

      if (provider === 'openai') {
        await apiService.deleteVideo(videoId);
      }
      // fal.ai doesn't have delete endpoint, just remove locally

      set((state) => ({
        videos: state.videos.filter((v) => v.id !== videoId),
        isLoading: false,
      }));
      get().stopPolling(videoId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  remixVideo: async (params: RemixParams) => {
    set({ isLoading: true, error: null });
    try {
      const provider = get().provider;
      
      if (provider === 'falai') {
        throw new Error('Remix is not supported by fal.ai provider');
      }

      const video = await apiService.remixVideo(params);
      set((state) => ({
        videos: [video, ...state.videos],
        isLoading: false,
      }));
      
      // Start polling for this video
      get().startPolling(video.id);
      
      return video;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addVideo: (video: Video) => {
    set((state) => ({
      videos: [video, ...state.videos],
    }));
  },

  updateVideo: (videoId: string, updates: Partial<Video>) => {
    set((state) => ({
      videos: state.videos.map((v) => (v.id === videoId ? { ...v, ...updates } : v)),
    }));
  },

  removeVideo: (videoId: string) => {
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== videoId),
    }));
    get().stopPolling(videoId);
  },

  clearError: () => {
    set({ error: null });
  },

  startPolling: (videoId: string) => {
    // Don't start if already polling
    if (pollingIntervals.has(videoId)) return;

    const interval = setInterval(async () => {
      try {
        await get().getVideoStatus(videoId);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    pollingIntervals.set(videoId, interval);
  },

  stopPolling: (videoId: string) => {
    const interval = pollingIntervals.get(videoId);
    if (interval) {
      clearInterval(interval);
      pollingIntervals.delete(videoId);
    }
  },
}));
