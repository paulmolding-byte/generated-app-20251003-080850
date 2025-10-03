import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MediaCard } from '@/components/MediaCard';
import { api } from '@/lib/api-client';
import type { Playlist, Track } from '@shared/types';
import { useUserStore } from '@/stores/user-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Hash, Play, Heart } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
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
const TrackListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-2">
        <Skeleton className="w-10 h-10 bg-vapor-cyan/10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-vapor-cyan/10" />
          <Skeleton className="h-3 w-1/2 bg-vapor-cyan/10" />
        </div>
      </div>
    ))}
  </div>
);
export function LibraryPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedTracksDetails, setLikedTracksDetails] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const likedTrackIds = useUserStore((state) => state.likedTracks);
  const { setCurrentTrack } = usePlayerStore();
  const { toggleLike, isLiked } = useUserStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [playlistsData, allTracksData] = await Promise.all([
          api<Playlist[]>('/api/playlists'),
          api<Track[]>('/api/tracks'),
        ]);
        setPlaylists(playlistsData);
        const likedDetails = allTracksData.filter(track => likedTrackIds.has(track.id));
        setLikedTracksDetails(likedDetails);
      } catch (error) {
        console.error("Failed to fetch library data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [likedTrackIds]);
  const handlePlayTrack = (track: Track, context: Track[]) => {
    setCurrentTrack(track, context);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      <section>
        <h1 className="text-4xl font-display text-vapor-magenta mb-8">My Playlists</h1>
        {loading ? <MediaGridSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
              <MediaCard key={playlist.id} item={playlist} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h1 className="text-4xl font-display text-vapor-magenta mb-8">Liked Songs</h1>
        {loading ? <TrackListSkeleton /> : likedTracksDetails.length > 0 ? (
          <div>
            <div className="grid grid-cols-[3rem,1fr,auto,5rem,3rem] gap-4 px-4 py-2 border-b border-vapor-cyan/20 text-muted-foreground text-sm">
              <div className="flex items-center justify-center"><Hash className="w-4 h-4" /></div>
              <div>Title</div>
              <div className="hidden md:block">Album</div>
              <div className="flex justify-end"><Clock className="w-4 h-4" /></div>
              <div></div>
            </div>
            <div className="mt-4 space-y-1">
              {likedTracksDetails.map((track, index) => (
                <div key={track.id} className="grid grid-cols-[3rem,1fr,auto,5rem,3rem] gap-4 items-center px-4 py-2 hover:bg-white/5 rounded-sm group">
                  <div
                    className="text-muted-foreground flex items-center justify-center relative cursor-pointer"
                    onClick={() => handlePlayTrack(track, likedTracksDetails)}
                  >
                    <span className="group-hover:opacity-0">{index + 1}</span>
                    <Play className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 text-vapor-yellow" />
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={track.coverArtUrl} alt={track.title} className="w-10 h-10 object-cover" />
                    <div>
                      <p className="font-bold text-vapor-yellow group-hover:text-vapor-magenta">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="hidden md:block text-muted-foreground truncate">{track.album}</div>
                  <div className="text-muted-foreground text-right">{track.duration}</div>
                  <div className="flex items-center justify-center">
                    <button onClick={() => toggleLike(track)}>
                      <Heart className={`w-5 h-5 transition-colors ${isLiked(track.id) ? 'text-vapor-magenta fill-current' : 'text-muted-foreground hover:text-vapor-yellow'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't liked any songs yet.</p>
        )}
      </section>
    </motion.div>
  );
}