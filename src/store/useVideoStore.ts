import { create } from 'zustand';
import { Video, VideoGenerationParams, RemixParams } from '../types';
import { apiService } from '../services/api';

interface VideoStore {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  apiKey: string | null;
  
  // API Key management
  setApiKey: (key: string) => Promise<void>;
  getApiKey: () => Promise<string | null>;
  clearApiKey: () => Promise<void>;
  
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
  apiKey: null,

  setApiKey: async (key: string) => {
    try {
      await apiService.setApiKey(key);
      set({ apiKey: key, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  getApiKey: async () => {
    try {
      const key = await apiService.getApiKey();
      set({ apiKey: key });
      return key;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  clearApiKey: async () => {
    try {
      await apiService.clearApiKey();
      set({ apiKey: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  generateVideo: async (params: VideoGenerationParams) => {
    set({ isLoading: true, error: null });
    try {
      const video = await apiService.generateVideo(params);
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

  getVideoStatus: async (videoId: string) => {
    try {
      const video = await apiService.getVideoStatus(videoId);
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
      const videos = await apiService.listVideos();
      set({ videos, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteVideo: async (videoId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteVideo(videoId);
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
