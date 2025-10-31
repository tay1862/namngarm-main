'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  Search,
  Trash2,
  Eye,
  Copy,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUploader from '@/components/admin/forms/ImageUploader';
import { LoadingPage } from '@/components/shared/Loading';
import toast from 'react-hot-toast';

interface Media {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMedia();
    }
  }, [status]);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/upload');
      const result = await response.json();
      if (result.success) {
        setMedia(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/upload/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Image deleted successfully');
        fetchMedia();
        if (selectedMedia?.id === id) {
          setSelectedMedia(null);
        }
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (status === 'loading' || isLoading) {
    return <LoadingPage />;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Media Library</h1>
          <p className="text-gray-600">
            Manage your images and media files
          </p>
        </div>
        <Button onClick={() => setShowUploader(!showUploader)}>
          <Upload size={20} />
          Upload Image
        </Button>
      </div>

      {showUploader && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upload New Image</CardTitle>
              <button
                onClick={() => setShowUploader(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <ImageUploader
              folder="general"
              onUploadComplete={handleUploadComplete}
            />
          </CardContent>
        </Card>
      )}

      {media.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ImageIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p className="text-gray-600 mb-4">
              Upload your first image to get started
            </p>
            <Button onClick={() => setShowUploader(true)}>
              <Upload size={20} />
              Upload Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedMedia?.id === item.id
                      ? 'border-pink-500 ring-2 ring-pink-200'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                  onClick={() => setSelectedMedia(item)}
                >
                  <Image
                    src={item.url}
                    alt={item.originalName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye size={24} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedMedia ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Image Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={selectedMedia.url}
                      alt={selectedMedia.originalName}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Filename</p>
                      <p className="text-sm font-medium truncate">
                        {selectedMedia.originalName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Size</p>
                      <p className="text-sm font-medium">
                        {formatFileSize(selectedMedia.size)}
                      </p>
                    </div>

                    {selectedMedia.width && selectedMedia.height && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                        <p className="text-sm font-medium">
                          {selectedMedia.width} × {selectedMedia.height}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500 mb-1">URL</p>
                      <div className="flex gap-2">
                        <Input
                          value={selectedMedia.url}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleCopyUrl(selectedMedia.url, selectedMedia.id)
                          }
                        >
                          {copiedId === selectedMedia.id ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="danger"
                      className="w-full"
                      onClick={() => handleDelete(selectedMedia.id)}
                    >
                      <Trash2 size={18} />
                      Delete Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="text-center py-12">
                  <ImageIcon size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">
                    Select an image to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
