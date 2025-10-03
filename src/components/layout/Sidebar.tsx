import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Library, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Playlist } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/stores/user-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
export function Sidebar() {
  const { userPlaylists, fetchUserPlaylists, createPlaylist } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserPlaylists();
      setLoading(false);
    };
    fetchData();
  }, [fetchUserPlaylists]);
  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) {
      toast.error("Playlist title cannot be empty.");
      return;
    }
    const newPlaylist = await createPlaylist(newPlaylistTitle.trim());
    if (newPlaylist) {
      toast.success(`Playlist "${newPlaylist.title}" created!`);
      setNewPlaylistTitle('');
      setCreateOpen(false);
      navigate(`/playlist/${newPlaylist.id}`);
    } else {
      toast.error("Failed to create playlist.");
    }
  };
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-4 px-4 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'text-vapor-magenta'
        : 'text-vapor-cyan hover:text-vapor-yellow'
    );
  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-black/50 border-r border-vapor-magenta/20 p-4 space-y-6">
        <div className="text-2xl font-display text-vapor-magenta">
          VaporTrax
        </div>
        <nav className="space-y-2">
          <NavLink to="/" className={navLinkClass}>
            <Home className="h-5 w-5" />
            Discover
          </NavLink>
          <NavLink to="/library" className={navLinkClass}>
            <Library className="h-5 w-5" />
            Library
          </NavLink>
        </nav>
        <div className="space-y-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-vapor-cyan hover:text-vapor-yellow transition-colors w-full"
          >
            <div className="w-6 h-6 bg-vapor-cyan text-black flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            Create Playlist
          </button>
        </div>
        <Separator className="bg-vapor-magenta/20" />
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full bg-vapor-cyan/10" />
              ))
            ) : (
              userPlaylists.map((playlist) => (
                <NavLink
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-1.5 text-sm truncate transition-colors',
                      isActive
                        ? 'text-vapor-yellow'
                        : 'text-muted-foreground hover:text-vapor-cyan'
                    )
                  }
                >
                  {playlist.title}
                </NavLink>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-black border-vapor-magenta text-vapor-cyan">
          <DialogHeader>
            <DialogTitle className="font-display text-vapor-magenta">Create New Playlist</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Give your new playlist a name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="My Awesome Playlist"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              className="bg-black/50"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreatePlaylist} className="bg-vapor-magenta text-black hover:bg-vapor-yellow">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}