import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Hash, Play, Heart, Plus, X } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Playlist, Track } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlayerStore } from '@/stores/player-store';
import { useUserStore } from '@/stores/user-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
const PlaylistHeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
    <Skeleton className="w-48 h-48 md:w-64 md:h-64 bg-vapor-cyan/10" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-24 bg-vapor-cyan/10" />
      <Skeleton className="h-16 w-96 bg-vapor-cyan/10" />
      <Skeleton className="h-4 w-64 bg-vapor-cyan/10" />
    </div>
  </div>
);
export function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddTrackOpen, setAddTrackOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { setCurrentTrack } = usePlayerStore();
  const { isLiked, toggleLike, addTrackToPlaylist, removeTrackFromPlaylist } = useUserStore();
  useEffect(() => {
    if (!id) return;
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const data = await api<Playlist>(`/api/playlists/${id}`);
        setPlaylist(data);
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);
  useEffect(() => {
    if (isAddTrackOpen) {
      api<Track[]>('/api/tracks').then(setAllTracks);
    }
  }, [isAddTrackOpen]);
  const handlePlayTrack = (track: Track) => {
    if (playlist && playlist.tracks) {
      setCurrentTrack(track, playlist.tracks);
    }
  };
  const handleAddTrack = async (track: Track) => {
    if (!id) return;
    const updatedPlaylist = await addTrackToPlaylist(id, track);
    if (updatedPlaylist) {
      setPlaylist(updatedPlaylist);
      toast.success(`"${track.title}" added to "${updatedPlaylist.title}"`);
    } else {
      toast.error("Failed to add track.");
    }
  };
  const handleRemoveTrack = async (track: Track) => {
    if (!id) return;
    const updatedPlaylist = await removeTrackFromPlaylist(id, track.id);
    if (updatedPlaylist) {
      setPlaylist(updatedPlaylist);
      toast.success(`"${track.title}" removed from "${updatedPlaylist.title}"`);
    } else {
      toast.error("Failed to remove track.");
    }
  };
  const filteredTracks = useMemo(() => {
    const playlistTrackIds = new Set(playlist?.tracks?.map(t => t.id));
    return allTracks.filter(track =>
      !playlistTrackIds.has(track.id) &&
      track.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTracks, searchTerm, playlist]);
  if (loading) {
    return <PlaylistHeaderSkeleton />;
  }
  if (!playlist) {
    return <div className="text-center text-vapor-yellow">Playlist not found.</div>;
  }
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <img src={playlist.coverArtUrl} alt={playlist.title} className="w-48 h-48 md:w-64 md:h-64 object-cover shadow-glow-neon-magenta" />
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm font-bold">PLAYLIST</p>
            <h1 className="text-5xl md:text-7xl font-display text-vapor-magenta">{playlist.title}</h1>
            <p className="text-muted-foreground">{playlist.description}</p>
            <Button onClick={() => setAddTrackOpen(true)} className="mt-4 bg-vapor-cyan text-black hover:bg-vapor-yellow">
              <Plus className="mr-2 h-4 w-4" /> Add Tracks
            </Button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-[3rem,1fr,auto,5rem,3rem,3rem] gap-4 px-4 py-2 border-b border-vapor-cyan/20 text-muted-foreground text-sm">
            <div className="flex items-center justify-center"><Hash className="w-4 h-4" /></div>
            <div>Title</div>
            <div className="hidden md:block">Album</div>
            <div className="flex justify-end"><Clock className="w-4 h-4" /></div>
            <div></div>
            <div></div>
          </div>
          <div className="mt-4 space-y-1">
            {playlist.tracks && playlist.tracks.length > 0 ? (
              playlist.tracks.map((track, index) => (
                <div key={track.id} className="grid grid-cols-[3rem,1fr,auto,5rem,3rem,3rem] gap-4 items-center px-4 py-2 hover:bg-white/5 rounded-sm group">
                  <div className="text-muted-foreground flex items-center justify-center relative cursor-pointer" onClick={() => handlePlayTrack(track)}>
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
                  <div className="flex items-center justify-center">
                    <button onClick={() => handleRemoveTrack(track)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-5 h-5 text-muted-foreground hover:text-vapor-yellow" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">This playlist is empty. Add some tracks!</p>
            )}
          </div>
        </div>
      </motion.div>
      <Dialog open={isAddTrackOpen} onOpenChange={setAddTrackOpen}>
        <DialogContent className="bg-black border-vapor-magenta text-vapor-cyan max-w-2xl h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display text-vapor-magenta">Add Tracks to "{playlist.title}"</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Search for a track to add to your playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50"
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-4">
              {filteredTracks.map(track => (
                <div key={track.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-sm">
                  <div className="flex items-center gap-4">
                    <img src={track.coverArtUrl} alt={track.title} className="w-10 h-10 object-cover" />
                    <div>
                      <p className="font-bold text-vapor-yellow">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAddTrack(track)} className="bg-vapor-magenta text-black hover:bg-vapor-yellow">
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}