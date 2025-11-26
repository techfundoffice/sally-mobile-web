export type VideoModel = 'sally-2' | 'sally-2-pro';
export type VideoResolution = '720x1280' | '1280x720' | '1024x1792' | '1792x1024';
export type VideoAspectRatio = 'portrait' | 'landscape' | 'square';
export type VideoDuration = 4 | 8 | 12 | 16 | 20;
export type VideoStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface VideoGenerationParams {
  prompt: string;
  model: VideoModel;
  size: VideoResolution;
  seconds: VideoDuration;
  input_reference?: string; // base64 image data or URL
}

export interface Video {
  id: string;
  prompt: string;
  model: VideoModel;
  size: VideoResolution;
  seconds: VideoDuration;
  status: VideoStatus;
  created_at: number;
  completed_at: number | null;
  download_url: string | null;
  thumbnail_url: string | null;
  remix_video_id: string | null;
  error?: string | null;
  progress?: number;
}

export interface RemixParams {
  video_id: string;
  prompt: string;
  model?: VideoModel;
  size?: VideoResolution;
  seconds?: VideoDuration;
}

export interface SocialVideo extends Video {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  created_at: number;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  videos_count: number;
  followers_count: number;
  following_count: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export const ASPECT_RATIO_MAP: Record<VideoAspectRatio, VideoResolution[]> = {
  portrait: ['720x1280', '1024x1792'],
  landscape: ['1280x720', '1792x1024'],
  square: ['1024x1792'], // Will be cropped to square
};

export const RESOLUTION_LABELS: Record<VideoResolution, string> = {
  '720x1280': 'HD Portrait (720x1280)',
  '1280x720': 'HD Landscape (1280x720)',
  '1024x1792': 'High Portrait (1024x1792)',
  '1792x1024': 'High Landscape (1792x1024)',
};
