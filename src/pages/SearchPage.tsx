import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { Track, Playlist } from '@shared/types';
import { MediaCard } from '@/components/MediaCard';
import { Skeleton } from '@/components/ui/skeleton';
interface SearchResults {
  tracks: Track[];
  playlists: Playlist[];
}
const MediaGridSkeleton = () => (
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
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!query) {
      setResults({ tracks: [], playlists: [] });
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await api<SearchResults>(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults({ tracks: [], playlists: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      <h1 className="text-4xl font-display text-vapor-magenta">
        Results for "{query}"
      </h1>
      <section>
        <h2 className="text-2xl font-display text-vapor-yellow mb-6">Tracks</h2>
        {loading ? <MediaGridSkeleton /> : (
          results && results.tracks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.tracks.map((track) => (
                <MediaCard key={track.id} item={track} playlistContext={results.tracks} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tracks found.</p>
          )
        )}
      </section>
      <section>
        <h2 className="text-2xl font-display text-vapor-yellow mb-6">Playlists</h2>
        {loading ? <MediaGridSkeleton /> : (
          results && results.playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.playlists.map((playlist) => (
                <MediaCard key={playlist.id} item={playlist} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No playlists found.</p>
          )
        )}
      </section>
    </motion.div>
  );
}