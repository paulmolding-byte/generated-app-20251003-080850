import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { MediaUploadForm } from '@/components/admin/MediaUploadForm';
const playlistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  coverArtUrl: z.string().url('Must be a valid URL'),
});
type PlaylistFormData = z.infer<typeof playlistSchema>;
export function AdminUploadPage() {
  const {
    register: registerPlaylist,
    handleSubmit: handlePlaylistSubmit,
    formState: { errors: playlistErrors, isSubmitting: isSubmittingPlaylist },
    reset: resetPlaylistForm,
  } = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistSchema),
  });
  const onPlaylistSubmit = async (data: PlaylistFormData) => {
    try {
      await api('/api/playlists', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Playlist created successfully!');
      resetPlaylistForm();
    } catch (error) {
      toast.error('Failed to create playlist.');
      console.error(error);
    }
  };
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-display text-vapor-magenta">Admin Upload</h1>
      <Tabs defaultValue="audio" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-vapor-cyan/20">
          <TabsTrigger value="audio">Upload Audio</TabsTrigger>
          <TabsTrigger value="video">Upload Video</TabsTrigger>
          <TabsTrigger value="playlist">Create Playlist</TabsTrigger>
        </TabsList>
        <TabsContent value="audio">
          <MediaUploadForm mediaType="audio" />
        </TabsContent>
        <TabsContent value="video">
          <MediaUploadForm mediaType="video" />
        </TabsContent>
        <TabsContent value="playlist">
          <form onSubmit={handlePlaylistSubmit(onPlaylistSubmit)} className="space-y-6 p-6 border border-vapor-cyan/20">
            <div className="space-y-2">
              <Label htmlFor="playlist-title">Title</Label>
              <Input id="playlist-title" {...registerPlaylist('title')} className="bg-black/50" />
              {playlistErrors.title && <p className="text-sm text-red-500">{playlistErrors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist-description">Description</Label>
              <Textarea id="playlist-description" {...registerPlaylist('description')} className="bg-black/50" />
              {playlistErrors.description && <p className="text-sm text-red-500">{playlistErrors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist-coverArtUrl">Cover Art URL</Label>
              <Input id="playlist-coverArtUrl" {...registerPlaylist('coverArtUrl')} className="bg-black/50" />
              {playlistErrors.coverArtUrl && <p className="text-sm text-red-500">{playlistErrors.coverArtUrl.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmittingPlaylist} className="w-full bg-vapor-magenta text-black hover:bg-vapor-yellow">
              {isSubmittingPlaylist ? 'Creating...' : 'Create Playlist'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}