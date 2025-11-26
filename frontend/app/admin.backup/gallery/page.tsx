'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { galleryApi } from '@/lib/api-admin';

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchImages();
  }, [search, statusFilter, categoryFilter]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const params: any = {
        per_page: 15,
      };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const data = await galleryApi.list(params);
      setImages(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      alert('Gagal memuat data galeri');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      return;
    }

    try {
      await galleryApi.delete(id);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Gagal menghapus foto');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galeri Kegiatan Pelatihan</h1>
          <p className="text-gray-600 mt-1">Kelola foto-foto kegiatan pelatihan</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Foto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari judul atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Semua Kategori</option>
              <option value="training">Training</option>
              <option value="workshop">Workshop</option>
              <option value="classroom">Classroom</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      ) : images.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Belum ada foto di galeri</p>
          <Link href="/admin/gallery/new">
            <Button>Tambah Foto Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {image.is_featured && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {image.status === 'published' ? (
                    <Eye className="h-5 w-5 text-green-500 bg-white rounded p-0.5" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400 bg-white rounded p-0.5" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                )}
                {image.category && (
                  <span className="inline-block text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded mb-2">
                    {image.category}
                  </span>
                )}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">Urutan: {image.sort_order}</span>
                  <div className="flex space-x-2">
                    <Link href={`/admin/gallery/${image.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            disabled={pagination.current_page === 1}
            onClick={() => {
              // Handle pagination
            }}
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => {
              // Handle pagination
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

