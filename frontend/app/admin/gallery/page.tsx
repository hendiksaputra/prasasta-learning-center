'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { galleryApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Plus, Trash2, Search, Image as ImageIcon, Edit, Star } from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  is_featured: boolean;
  status: string;
  sort_order: number;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryApi.list();
      setImages(response.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus gambar "${title}"?`)) {
      return;
    }

    try {
      await galleryApi.delete(id);
      alert('Gambar berhasil dihapus');
      fetchGallery();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Gagal menghapus gambar');
    }
  };

  const filteredImages = images.filter((image) =>
    image.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1>
          <p className="text-gray-600 mt-1">Kelola foto galeri kegiatan</p>
        </div>
        <Link href="/admin/gallery/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Gambar
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari gambar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Tidak ada gambar ditemukan</p>
          <Link href="/admin/gallery/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Gambar Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {image.is_featured && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Featured
                    </span>
                  )}
                  {image.category && (
                    <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-white bg-opacity-90 rounded-full capitalize">
                      {image.category}
                    </span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => router.push(`/admin/gallery/${image.id}/edit`)}
                    className="opacity-0 group-hover:opacity-100 bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-all transform scale-0 group-hover:scale-100"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id, image.title)}
                    className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all transform scale-0 group-hover:scale-100"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
