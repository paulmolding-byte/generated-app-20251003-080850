import { Hono } from "hono";
import type { Env } from './core-utils';
import { TrackEntity, PlaylistEntity, UserLikes } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Track, Playlist, MediaType } from "@shared/types";
async function hydratePlaylist(env: Env, playlistState: Awaited<ReturnType<PlaylistEntity['getState']>>): Promise<Playlist> {
  const trackPromises = playlistState.trackIds.map(id => new TrackEntity(env, id).getState());
  const tracks = await Promise.all(trackPromises);
  return {
    id: playlistState.id,
    title: playlistState.title,
    description: playlistState.description,
    coverArtUrl: playlistState.coverArtUrl,
    tracks: tracks.filter(Boolean) as Track[],
  };
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure data is seeded on first load
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      TrackEntity.ensureSeed(c.env),
      PlaylistEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // TRACKS
  app.get('/api/tracks', async (c) => {
    const { items } = await TrackEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/tracks', async (c) => {
    const body = await c.req.json<{
      title: string;
      artist: string;
      album: string;
      duration: string;
      coverArtUrl: string;
      mediaUrl: string;
      mediaType: MediaType;
    }>();
    if (!body.title || !body.artist || !body.mediaUrl) {
      return bad(c, 'Missing required track fields');
    }
    const newTrack: Track = {
      id: crypto.randomUUID(),
      ...body,
    };
    await TrackEntity.create(c.env, newTrack);
    return ok(c, newTrack);
  });
  // PLAYLISTS
  app.get('/api/playlists', async (c) => {
    const { items: playlistStates } = await PlaylistEntity.list(c.env);
    const hydratedPlaylists = await Promise.all(playlistStates.map(p => hydratePlaylist(c.env, p)));
    return ok(c, hydratedPlaylists);
  });
  app.get('/api/playlists/:id', async (c) => {
    const { id } = c.req.param();
    const playlistEntity = new PlaylistEntity(c.env, id);
    if (!await playlistEntity.exists()) {
      return notFound(c, 'Playlist not found');
    }
    const playlistState = await playlistEntity.getState();
    const hydratedPlaylist = await hydratePlaylist(c.env, playlistState);
    return ok(c, hydratedPlaylist);
  });
  app.post('/api/playlists', async (c) => {
    const body = await c.req.json<{ title: string; description: string; coverArtUrl: string }>();
    if (!body.title) return bad(c, 'Title is required');
    const newPlaylistState = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || '',
      coverArtUrl: body.coverArtUrl || '',
      trackIds: [],
    };
    await PlaylistEntity.create(c.env, newPlaylistState);
    const hydratedPlaylist = await hydratePlaylist(c.env, newPlaylistState);
    return ok(c, hydratedPlaylist);
  });
  // PLAYLIST TRACK MANAGEMENT
  app.post('/api/playlists/:id/tracks', async (c) => {
    const playlistId = c.req.param('id');
    const { trackId } = await c.req.json<{ trackId: string }>();
    if (!isStr(trackId)) return bad(c, 'trackId is required');
    const playlistEntity = new PlaylistEntity(c.env, playlistId);
    if (!await playlistEntity.exists()) return notFound(c, 'Playlist not found');
    const updatedState = await playlistEntity.addTrack(trackId);
    const hydratedPlaylist = await hydratePlaylist(c.env, updatedState);
    return ok(c, hydratedPlaylist);
  });
  app.delete('/api/playlists/:id/tracks/:trackId', async (c) => {
    const { id: playlistId, trackId } = c.req.param();
    const playlistEntity = new PlaylistEntity(c.env, playlistId);
    if (!await playlistEntity.exists()) return notFound(c, 'Playlist not found');
    const updatedState = await playlistEntity.removeTrack(trackId);
    const hydratedPlaylist = await hydratePlaylist(c.env, updatedState);
    return ok(c, hydratedPlaylist);
  });
  // USER LIKES
  app.get('/api/user/likes', async (c) => {
    const likes = await UserLikes(c.env).list();
    return ok(c, likes);
  });
  app.post('/api/user/likes/:trackId', async (c) => {
    const { trackId } = c.req.param();
    await UserLikes(c.env).add(trackId);
    return ok(c, { id: trackId, liked: true });
  });
  app.delete('/api/user/likes/:trackId', async (c) => {
    const { trackId } = c.req.param();
    await UserLikes(c.env).remove(trackId);
    return ok(c, { id: trackId, liked: false });
  });
  // SEARCH
  app.get('/api/search', async (c) => {
    const q = c.req.query('q')?.toLowerCase();
    if (!q) return ok(c, { tracks: [], playlists: [] });
    const [{ items: allTracks }, { items: allPlaylists }] = await Promise.all([
      TrackEntity.list(c.env),
      PlaylistEntity.list(c.env),
    ]);
    const filteredTracks = allTracks.filter(t =>
      t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
    const filteredPlaylists = allPlaylists.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
    const hydratedPlaylists = await Promise.all(filteredPlaylists.map(p => hydratePlaylist(c.env, p)));
    return ok(c, { tracks: filteredTracks, playlists: hydratedPlaylists });
  });
}