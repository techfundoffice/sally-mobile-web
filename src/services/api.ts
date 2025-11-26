import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Video, VideoGenerationParams, RemixParams, ApiError } from '../types';

const OPENAI_API_BASE = 'https://api.openai.com/v1';
const API_KEY_STORAGE_KEY = 'openai_api_key';

class SallyApiService {
  private client: AxiosInstance;
  private apiKey: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: OPENAI_API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add API key
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.apiKey) {
          this.apiKey = await this.getApiKey();
        }
        if (this.apiKey) {
          config.headers.Authorization = `Bearer ${this.apiKey}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.error?.message || error.message || 'An error occurred',
          status: error.response?.status,
        };
        return Promise.reject(apiError);
      }
    );
  }

  async setApiKey(key: string): Promise<void> {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
    this.apiKey = key;
  }

  async getApiKey(): Promise<string | null> {
    if (this.apiKey) return this.apiKey;
    try {
      const key = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
      this.apiKey = key;
      return key;
    } catch {
      return null;
    }
  }

  async clearApiKey(): Promise<void> {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
    this.apiKey = null;
  }

  async generateVideo(params: VideoGenerationParams): Promise<Video> {
    try {
      const formData = new FormData();
      formData.append('prompt', params.prompt);
      formData.append('model', params.model);
      formData.append('size', params.size);
      formData.append('seconds', params.seconds.toString());

      if (params.input_reference) {
        // If it's a base64 image, convert to blob
        if (params.input_reference.startsWith('data:')) {
          const response = await fetch(params.input_reference);
          const blob = await response.blob();
          formData.append('input_reference', blob, 'reference.jpg');
        }
      }

      const response = await this.client.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return this.normalizeVideoResponse(response.data, params);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getVideoStatus(videoId: string): Promise<Video> {
    try {
      const response = await this.client.get(`/videos/${videoId}`);
      return this.normalizeVideoResponse(response.data);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async listVideos(): Promise<Video[]> {
    try {
      const response = await this.client.get('/videos');
      const videos = response.data.data || [];
      return videos.map((video: any) => this.normalizeVideoResponse(video));
    } catch (error) {
      throw error as ApiError;
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    try {
      await this.client.delete(`/videos/${videoId}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async remixVideo(params: RemixParams): Promise<Video> {
    try {
      const response = await this.client.post(`/videos/${params.video_id}/remix`, {
        prompt: params.prompt,
        model: params.model,
        size: params.size,
        seconds: params.seconds,
      });

      return this.normalizeVideoResponse(response.data);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async downloadVideo(videoId: string): Promise<string> {
    try {
      const response = await this.client.get(`/videos/${videoId}/content`, {
        responseType: 'blob',
      });
      
      // Return the blob URL for download
      return URL.createObjectURL(response.data);
    } catch (error) {
      throw error as ApiError;
    }
  }

  private normalizeVideoResponse(data: any, params?: VideoGenerationParams): Video {
    const now = Math.floor(Date.now() / 1000);
    
    return {
      id: data.id || data.video_id || `video_${now}`,
      prompt: params?.prompt || data.prompt || '',
      model: params?.model || data.model || 'sally-2',
      size: params?.size || data.size || '1280x720',
      seconds: params?.seconds || data.seconds || 4,
      status: data.status || data.state || 'queued',
      created_at: data.created_at || now,
      completed_at: data.completed_at || null,
      download_url: data.download_url || data.content_url || null,
      thumbnail_url: data.thumbnail_url || null,
      remix_video_id: data.remix_video_id || data.remix_of || null,
      error: data.error?.message || null,
      progress: data.progress || 0,
    };
  }
}

export const apiService = new SallyApiService();
