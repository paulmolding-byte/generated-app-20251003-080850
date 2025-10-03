import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MediaCard } from '@/components/MediaCard';
import { PlaylistCard } from '@/components/PlaylistCard';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Playlist, Track } from '@shared/types';
const MediaGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="w-full aspect-square bg-vapor-cyan/10" />
        <Skeleton className="h-4 w-3/4 bg-vapor-cyan/10" />
        <Skeleton className="h-3 w-1/2 bg-vapor-cyan/10" />
      </div>
    ))}
  </div>
);
const TrackGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="w-full aspect-square bg-vapor-cyan/10" />
        <Skeleton className="h-4 w-3/4 bg-vapor-cyan/10" />
        <Skeleton className="h-3 w-1/2 bg-vapor-cyan/10" />
      </div>
    ))}
  </div>
);
export function HomePage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [playlistsData, tracksData] = await Promise.all([
          api<Playlist[]>('/api/playlists'),
          api<Track[]>('/api/tracks'),
        ]);
        setPlaylists(playlistsData);
        setTracks(tracksData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      <section>
        <h1 className="text-4xl font-display text-vapor-magenta mb-8">Featured Playlists</h1>
        {loading ? (
          <MediaGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h1 className="text-4xl font-display text-vapor-magenta mb-8">New Tracks</h1>
        {loading ? (
          <TrackGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {tracks.map((track) => (
              <MediaCard key={track.id} item={track} playlistContext={tracks} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}