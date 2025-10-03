import { IndexedEntity, Index, type Env } from "./core-utils";
import type { Track, Playlist } from "@shared/types";
import { MOCK_TRACKS, MOCK_PLAYLISTS } from "@shared/mock-data";
export class TrackEntity extends IndexedEntity<Track> {
  static readonly entityName = "track";
  static readonly indexName = "tracks";
  static readonly initialState: Track = {
    id: "",
    title: "",
    artist: "",
    album: "",
    duration: "0:00",
    coverArtUrl: "",
    mediaUrl: "",
    mediaType: "audio",
  };
  static seedData = MOCK_TRACKS;
}
export type PlaylistState = Omit<Playlist, 'tracks'> & { trackIds: string[] };
const SEED_PLAYLISTS: PlaylistState[] = MOCK_PLAYLISTS.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  coverArtUrl: p.coverArtUrl,
  trackIds: p.tracks?.map((t) => t.id) ?? [],
}));
export class PlaylistEntity extends IndexedEntity<PlaylistState> {
  static readonly entityName = "playlist";
  static readonly indexName = "playlists";
  static readonly initialState: PlaylistState = {
    id: "",
    title: "",
    description: "",
    coverArtUrl: "",
    trackIds: [],
  };
  static seedData = SEED_PLAYLISTS;
  async addTrack(trackId: string): Promise<PlaylistState> {
    return this.mutate((s) => {
      if (!s.trackIds.includes(trackId)) {
        return { ...s, trackIds: [...s.trackIds, trackId] };
      }
      return s;
    });
  }
  async removeTrack(trackId: string): Promise<PlaylistState> {
    return this.mutate((s) => ({
      ...s,
      trackIds: s.trackIds.filter((id) => id !== trackId),
    }));
  }
}
export const UserLikes = (env: Env, userId = 'default') => new Index<string>(env, `user-likes:${userId}`);