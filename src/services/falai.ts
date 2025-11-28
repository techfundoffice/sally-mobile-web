import { Video, VideoGenerationParams, VideoStatus } from '../types';

export interface FalAIConfig {
  apiKey: string;
}

export interface FalAIModel {
  id: string;
  name: string;
  endpoint: string;
  type: 'text-to-video' | 'image-to-video';
  maxDuration: number;
  supportedResolutions: string[];
  description: string;
}

export const FALAI_MODELS: FalAIModel[] = [
  {
    id: 'veo3-fast',
    name: 'Veo 3 Fast',
    endpoint: 'fal-ai/veo3/fast',
    type: 'text-to-video',
    maxDuration: 10,
    supportedResolutions: ['720p', '1080p'],
    description: 'Faster and more cost effective version of Google\'s Veo 3',
  },
  {
    id: 'veo3',
    name: 'Veo 3',
    endpoint: 'fal-ai/veo3',
    type: 'text-to-video',
    maxDuration: 10,
    supportedResolutions: ['720p', '1080p'],
    description: 'Google\'s most advanced AI video generation model with sound',
  },
  {
    id: 'kling-turbo',
    name: 'Kling 2.5 Turbo Pro',
    endpoint: 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    type: 'text-to-video',
    maxDuration: 10,
    supportedResolutions: ['720p', '1080p'],
    description: 'Top-tier text-to-video with cinematic visuals and exceptional prompt precision',
  },
  {
    id: 'kling-master',
    name: 'Kling 2.0 Master',
    endpoint: 'fal-ai/kling-video/v2/master/text-to-video',
    type: 'text-to-video',
    maxDuration: 10,
    supportedResolutions: ['720p', '1080p'],
    description: 'Generate high-quality video clips from prompts using Kling 2.0 Master',
  },
  {
    id: 'ltx-2-fast',
    name: 'LTX-2 Fast',
    endpoint: 'fal-ai/ltx-2/text-to-video/fast',
    type: 'text-to-video',
    maxDuration: 5,
    supportedResolutions: ['720p'],
    description: 'Create high-fidelity video with audio from text with LTX-2 Fast',
  },
  {
    id: 'ltx-2-pro',
    name: 'LTX-2 Pro',
    endpoint: 'fal-ai/ltx-2/text-to-video',
    type: 'text-to-video',
    maxDuration: 5,
    supportedResolutions: ['720p'],
    description: 'Create high-fidelity video with audio from text with LTX-2 Pro',
  },
  {
    id: 'wan-pro',
    name: 'Wan-2.1 Pro',
    endpoint: 'fal-ai/wan-pro/image-to-video',
    type: 'image-to-video',
    maxDuration: 5,
    supportedResolutions: ['720p'],
    description: 'Premium image-to-video model that generates high-quality videos',
  },
  {
    id: 'veo2-img',
    name: 'Veo 2 Image-to-Video',
    endpoint: 'fal-ai/veo2/image-to-video',
    type: 'image-to-video',
    maxDuration: 5,
    supportedResolutions: ['720p', '1080p'],
    description: 'Creates videos from images with realistic motion and very high quality',
  },
];

class FalAIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://queue.fal.run';

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  async generateVideo(params: VideoGenerationParams): Promise<Video> {
    if (!this.apiKey) {
      throw new Error('fal.ai API key not configured');
    }

    const model = FALAI_MODELS.find(m => m.id === params.model);
    if (!model) {
      throw new Error(`Model ${params.model} not found`);
    }

    try {
      // Submit generation request
      const requestId = await this.submitGeneration(model.endpoint, params);
      
      // Poll for completion
      const result = await this.pollGeneration(requestId);
      
      // Convert to Video format
      return this.convertToVideo(result, params);
    } catch (error: any) {
      console.error('fal.ai generation error:', error);
      throw new Error(error.message || 'Video generation failed');
    }
  }

  private async submitGeneration(endpoint: string, params: VideoGenerationParams): Promise<string> {
    const input: any = {
      prompt: params.prompt,
    };

    // Add duration if supported
    if (params.duration) {
      input.duration = params.duration;
    }

    // Add image if provided (for image-to-video)
    if (params.imageUrl) {
      input.image_url = params.imageUrl;
    }

    // Add aspect ratio if supported
    if (params.aspectRatio) {
      input.aspect_ratio = params.aspectRatio === '9:16' ? '9:16' : '16:9';
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.request_id;
  }

  private async pollGeneration(requestId: string, maxAttempts = 60): Promise<any> {
    const pollUrl = `${this.baseUrl}/requests/${requestId}`;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(pollUrl, {
        headers: {
          'Authorization': `Key ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to poll status: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'COMPLETED') {
        return data.output;
      }
      
      if (data.status === 'FAILED') {
        throw new Error(data.error || 'Generation failed');
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Generation timeout - please try again');
  }

  private convertToVideo(output: any, params: VideoGenerationParams): Video {
    const videoUrl = output.video?.url || output.url;
    
    if (!videoUrl) {
      throw new Error('No video URL in response');
    }

    return {
      id: `fal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt: params.prompt,
      url: videoUrl,
      thumbnail_url: output.thumbnail?.url || videoUrl,
      status: 'completed' as VideoStatus,
      created_at: Math.floor(Date.now() / 1000),
      duration: params.duration || 5,
      resolution: params.resolution || '720x1280',
      model: params.model,
      aspect_ratio: params.aspectRatio || '9:16',
    };
  }

  async getStatus(videoId: string): Promise<VideoStatus> {
    // fal.ai doesn't provide status checking for completed videos
    // This would only work during generation
    return 'completed';
  }

  getModels(type?: 'text-to-video' | 'image-to-video'): FalAIModel[] {
    if (type) {
      return FALAI_MODELS.filter(m => m.type === type);
    }
    return FALAI_MODELS;
  }

  getModel(id: string): FalAIModel | undefined {
    return FALAI_MODELS.find(m => m.id === id);
  }
}

export const falaiService = new FalAIService();
