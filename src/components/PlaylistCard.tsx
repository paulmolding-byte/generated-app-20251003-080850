import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import type { Playlist } from '@shared/types';
interface PlaylistCardProps {
  playlist: Playlist;
}
export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { setCurrentTrack } = usePlayerStore();
  const navigate = useNavigate();
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks && playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0], playlist.tracks);
    }
  };
  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };
  return (
    <div
      onClick={handleClick}
      className="group relative block p-4 bg-spotify-card rounded-md shadow-lg transition-all duration-300 hover:bg-neutral-800 cursor-pointer"
    >
      <div className="relative w-full aspect-square mb-4">
        <img src={playlist.coverArtUrl} alt={playlist.title} className="w-full h-full object-cover rounded-md shadow-md" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300">
          <button
            onClick={handlePlay}
            className="w-12 h-12 flex items-center justify-center bg-spotify-green text-black rounded-full shadow-lg hover:scale-105"
          >
            <Play className="w-6 h-6 ml-1" />
          </button>
        </div>
      </div>
      <div className="relative">
        <h3 className="font-bold text-sm text-white truncate">{playlist.title}</h3>
        <p className="text-xs text-neutral-400 truncate h-8">{playlist.description}</p>
      </div>
    </div>
  );
}