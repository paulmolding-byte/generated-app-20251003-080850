import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Track } from '@shared/types';
interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isShuffling: boolean;
  repeatMode: 'none' | 'one' | 'all';
}
interface PlayerActions {
  play: () => void;
  pause: () => void;
  playPause: () => void;
  setCurrentTrack: (track: Track, playlist?: Track[]) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
}
export const usePlayerStore = create<PlayerState & PlayerActions>()(
  immer((set, get) => ({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 0.8,
    progress: 0,
    duration: 0,
    isShuffling: false,
    repeatMode: 'none',
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    playPause: () => set((state) => { state.isPlaying = !state.isPlaying }),
    setCurrentTrack: (track, playlist) => {
      set((state) => {
        state.currentTrack = track;
        state.isPlaying = true;
        state.progress = 0;
        if (playlist) {
          state.queue = playlist;
        } else {
          state.queue = [track];
        }
      });
    },
    setVolume: (volume) => set({ volume }),
    setProgress: (progress) => set({ progress }),
    setDuration: (duration) => set({ duration }),
    nextTrack: () => {
      const { currentTrack, queue, repeatMode, isShuffling } = get();
      if (!currentTrack) return;
      if (repeatMode === 'one') {
        set({ progress: 0, isPlaying: true }); // Replay current track
        return;
      }
      if (isShuffling) {
        const randomIndex = Math.floor(Math.random() * queue.length);
        set({ currentTrack: queue[randomIndex], progress: 0, isPlaying: true });
        return;
      }
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex !== -1) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < queue.length) {
          set({ currentTrack: queue[nextIndex], progress: 0, isPlaying: true });
        } else if (repeatMode === 'all') {
          set({ currentTrack: queue[0], progress: 0, isPlaying: true }); // Loop back to start
        } else {
          set({ isPlaying: false }); // End of queue
        }
      }
    },
    prevTrack: () => {
      const { currentTrack, queue, progress } = get();
      if (!currentTrack) return;
      if (progress > 3) { // If more than 3 seconds in, restart track
        set({ progress: 0, isPlaying: true });
        return;
      }
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex > 0) {
        set({ currentTrack: queue[currentIndex - 1], progress: 0, isPlaying: true });
      }
    },
    toggleShuffle: () => set(state => { state.isShuffling = !state.isShuffling }),
    cycleRepeatMode: () => set(state => {
      if (state.repeatMode === 'none') state.repeatMode = 'all';
      else if (state.repeatMode === 'all') state.repeatMode = 'one';
      else state.repeatMode = 'none';
    }),
  }))
);