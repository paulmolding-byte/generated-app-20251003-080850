import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, VolumeX, Volume1, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/stores/player-store';
import { cn } from '@/lib/utils';
const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};
export function PlayerBar() {
  const playerRef = useRef<ReactPlayer | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    isShuffling,
    repeatMode,
    playPause,
    setVolume,
    setProgress,
    setDuration,
    nextTrack,
    prevTrack,
    toggleShuffle,
    cycleRepeatMode,
  } = usePlayerStore();
  useEffect(() => {
    if (isPlaying) {
      playerRef.current?.getInternalPlayer()?.play?.();
    } else {
      playerRef.current?.getInternalPlayer()?.pause?.();
    }
  }, [isPlaying, currentTrack]);
  const handleSeek = (value: number[]) => {
    const newProgress = value[0] / 100;
    setProgress(newProgress);
    playerRef.current?.seekTo(newProgress, 'fraction');
  };
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };
  if (!currentTrack) {
    return null; // Don't render the player if no track is loaded
  }
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-sm border-t border-vapor-magenta/30 text-vapor-cyan p-4 flex items-center justify-between z-50">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <img src={currentTrack.coverArtUrl} alt="Album Art" className="w-14 h-14 object-cover" />
          <div className="truncate">
            <p className="font-bold text-sm text-vapor-yellow truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>
        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 w-1/2">
          <div className="flex items-center gap-6">
            <button onClick={toggleShuffle} className={cn("text-muted-foreground hover:text-vapor-yellow transition-colors", isShuffling && "text-vapor-magenta")}>
              <Shuffle className="w-5 h-5" />
            </button>
            <button onClick={prevTrack} className="text-muted-foreground hover:text-vapor-yellow transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={playPause} className="w-10 h-10 flex items-center justify-center bg-vapor-cyan text-black hover:bg-vapor-yellow transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={nextTrack} className="text-muted-foreground hover:text-vapor-yellow transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
            <button onClick={cycleRepeatMode} className={cn("text-muted-foreground hover:text-vapor-yellow transition-colors", repeatMode !== 'none' && "text-vapor-magenta")}>
              <RepeatIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(progress * duration)}</span>
            <Slider
              value={[progress * 100]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-vapor-magenta [&>span:first-child]:bg-vapor-cyan/20"
            />
            <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(duration)}</span>
          </div>
        </div>
        {/* Volume & Other Controls */}
        <div className="flex items-center justify-end gap-4 w-1/4">
          <VolumeIcon className="w-5 h-5 text-muted-foreground hover:text-vapor-yellow transition-colors cursor-pointer" />
          <div className="w-24">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-vapor-cyan [&>span:first-child]:bg-vapor-cyan/20"
            />
          </div>
          <Maximize2 className="w-5 h-5 text-muted-foreground hover:text-vapor-yellow transition-colors cursor-pointer" />
        </div>
      </div>
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={currentTrack.mediaUrl}
          playing={isPlaying}
          volume={volume}
          onProgress={(p: { played: number }) => setProgress(p.played)}
          onDuration={setDuration}
          onEnded={nextTrack}
          width="0"
          height="0"
        />
      </div>
    </>
  );
}