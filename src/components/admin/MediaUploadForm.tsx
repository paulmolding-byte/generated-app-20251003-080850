import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { MediaType } from '@shared/types';
const mediaUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().min(1, 'Album is required'),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in MM:SS format'),
  coverArtUrl: z.string().url('Must be a valid URL'),
  mediaUrl: z.string().url('Must be a valid URL'),
});
type MediaUploadFormData = z.infer<typeof mediaUploadSchema>;
interface MediaUploadFormProps {
  mediaType: MediaType;
}
export function MediaUploadForm({ mediaType }: MediaUploadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MediaUploadFormData>({
    resolver: zodResolver(mediaUploadSchema),
  });
  const onSubmit = async (data: MediaUploadFormData) => {
    const payload = { ...data, mediaType };
    try {
      await api('/api/tracks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success(`${mediaType === 'audio' ? 'Audio' : 'Video'} track created successfully!`);
      reset();
    } catch (error) {
      toast.error(`Failed to create ${mediaType} track.`);
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border border-vapor-cyan/20">
      <div className="space-y-2">
        <Label htmlFor={`${mediaType}-title`}>Title</Label>
        <Input id={`${mediaType}-title`} {...register('title')} className="bg-black/50" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mediaType}-artist`}>Artist</Label>
        <Input id={`${mediaType}-artist`} {...register('artist')} className="bg-black/50" />
        {errors.artist && <p className="text-sm text-red-500">{errors.artist.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mediaType}-album`}>Album</Label>
        <Input id={`${mediaType}-album`} {...register('album')} className="bg-black/50" />
        {errors.album && <p className="text-sm text-red-500">{errors.album.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mediaType}-duration`}>Duration (MM:SS)</Label>
        <Input id={`${mediaType}-duration`} {...register('duration')} className="bg-black/50" />
        {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mediaType}-coverArtUrl`}>Cover Art URL</Label>
        <Input id={`${mediaType}-coverArtUrl`} {...register('coverArtUrl')} className="bg-black/50" />
        {errors.coverArtUrl && <p className="text-sm text-red-500">{errors.coverArtUrl.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mediaType}-mediaUrl`}>Media File URL</Label>
        <Input id={`${mediaType}-mediaUrl`} {...register('mediaUrl')} className="bg-black/50" />
        {errors.mediaUrl && <p className="text-sm text-red-500">{errors.mediaUrl.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-vapor-magenta text-black hover:bg-vapor-yellow">
        {isSubmitting ? 'Uploading...' : `Upload ${mediaType === 'audio' ? 'Audio' : 'Video'}`}
      </Button>
    </form>
  );
}