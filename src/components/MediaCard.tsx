import React from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import type { Track, Playlist } from '@shared/types';
interface MediaCardProps {
  item: (Track & { description?: undefined }) | (Playlist & { artist?: undefined });
  playlistContext?: Track[];
  className?: string;
}
export function MediaCard({ item, playlistContext, className }: MediaCardProps) {
  const { setCurrentTrack } = usePlayerStore();
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('mediaUrl' in item) { // It's a Track
      setCurrentTrack(item, playlistContext);
    } else if ('tracks' in item && item.tracks.length > 0) { // It's a Playlist
      setCurrentTrack(item.tracks[0], item.tracks);
    }
  };
  return (
    <div className={cn("group relative block p-4 bg-black/30 transition-all duration-300 hover:bg-black/60 cursor-pointer", className)}>
      <div className="relative w-full aspect-square mb-4">
        <img src={item.coverArtUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={handlePlay}
            className="w-12 h-12 flex items-center justify-center bg-vapor-magenta text-black scale-75 group-hover:scale-100 transition-transform duration-300"
          >
            <Play className="w-8 h-8" />
          </button>
        </div>
      </div>
      <div className="relative">
        <h3 className="font-bold text-sm text-vapor-yellow truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{item.artist || item.description}</p>
      </div>
      <div className="absolute inset-0 border border-vapor-cyan/20 group-hover:border-vapor-magenta transition-colors duration-300 pointer-events-none" />
    </div>
  );
}