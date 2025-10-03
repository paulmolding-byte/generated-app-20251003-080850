import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import type { Track, Playlist } from '@shared/types';
interface UserState {
  likedTracks: Set<string>;
  userPlaylists: Playlist[];
}
interface UserActions {
  isLiked: (trackId: string) => boolean;
  toggleLike: (track: Track) => Promise<void>;
  fetchLikedTracks: () => Promise<void>;
  fetchUserPlaylists: () => Promise<void>;
  createPlaylist: (title: string) => Promise<Playlist | null>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<Playlist | null>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<Playlist | null>;
  fetchInitialData: () => Promise<void>;
}
export const useUserStore = create<UserState & UserActions>()(
  immer((set, get) => ({
    likedTracks: new Set(),
    userPlaylists: [],
    isLiked: (trackId) => get().likedTracks.has(trackId),
    fetchLikedTracks: async () => {
      try {
        const likedIds = await api<string[]>('/api/user/likes');
        set({ likedTracks: new Set(likedIds) });
      } catch (error) {
        console.error("Failed to fetch liked tracks:", error);
      }
    },
    fetchUserPlaylists: async () => {
      try {
        const playlists = await api<Playlist[]>('/api/playlists');
        set({ userPlaylists: playlists });
      } catch (error) {
        console.error("Failed to fetch user playlists:", error);
      }
    },
    fetchInitialData: async () => {
      await Promise.all([get().fetchLikedTracks(), get().fetchUserPlaylists()]);
    },
    createPlaylist: async (title: string) => {
      try {
        const newPlaylistData = {
          title,
          description: "A collection of vibes.",
          coverArtUrl: `https://source.unsplash.com/random/500x500/?abstract,${Date.now()}`
        };
        const newPlaylist = await api<Playlist>('/api/playlists', {
          method: 'POST',
          body: JSON.stringify(newPlaylistData),
        });
        set(state => {
          state.userPlaylists.push(newPlaylist);
        });
        return newPlaylist;
      } catch (error) {
        console.error("Failed to create playlist:", error);
        return null;
      }
    },
    addTrackToPlaylist: async (playlistId: string, track: Track) => {
      try {
        const updatedPlaylist = await api<Playlist>(`/api/playlists/${playlistId}/tracks`, {
          method: 'POST',
          body: JSON.stringify({ trackId: track.id }),
        });
        set(state => {
          const playlistIndex = state.userPlaylists.findIndex(p => p.id === playlistId);
          if (playlistIndex !== -1) {
            state.userPlaylists[playlistIndex] = updatedPlaylist;
          }
        });
        return updatedPlaylist;
      } catch (error) {
        console.error("Failed to add track to playlist:", error);
        return null;
      }
    },
    removeTrackFromPlaylist: async (playlistId: string, trackId: string) => {
      try {
        const updatedPlaylist = await api<Playlist>(`/api/playlists/${playlistId}/tracks/${trackId}`, {
          method: 'DELETE',
        });
        set(state => {
          const playlistIndex = state.userPlaylists.findIndex(p => p.id === playlistId);
          if (playlistIndex !== -1) {
            state.userPlaylists[playlistIndex] = updatedPlaylist;
          }
        });
        return updatedPlaylist;
      } catch (error) {
        console.error("Failed to remove track from playlist:", error);
        return null;
      }
    },
    toggleLike: async (track) => {
      const isCurrentlyLiked = get().isLiked(track.id);
      const originalLikedTracks = new Set(get().likedTracks);
      // Optimistic update
      set((state) => {
        if (isCurrentlyLiked) {
          state.likedTracks.delete(track.id);
        } else {
          state.likedTracks.add(track.id);
        }
      });
      try {
        if (isCurrentlyLiked) {
          await api(`/api/user/likes/${track.id}`, { method: 'DELETE' });
        } else {
          await api(`/api/user/likes/${track.id}`, { method: 'POST' });
        }
      } catch (error) {
        console.error("Failed to toggle like status:", error);
        set({ likedTracks: originalLikedTracks });
      }
    },
  }))
);