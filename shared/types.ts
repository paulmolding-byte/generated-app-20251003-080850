export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type MediaType = 'audio' | 'video';
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // e.g., "3:45"
  coverArtUrl: string;
  mediaUrl: string;
  mediaType: MediaType;
}
export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverArtUrl: string;
  tracks?: Track[];
}