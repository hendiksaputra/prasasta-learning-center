'use client';

import { useState, useEffect } from 'react';
import { facilitiesApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import Link from 'next/link';

interface Facility {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  sort_order: number;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilitiesApi.list();
      // Handle paginated response
      const facilitiesData = response.data?.data || response.data || [];
      setFacilities(Array.isArray(facilitiesData) ? facilitiesData : []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      alert('Gagal memuat data fasilitas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus fasilitas ini?')) return;

    try {
      await facilitiesApi.delete(id);
      alert('Fasilitas berhasil dihapus!');
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Gagal menghapus fasilitas');
    }
  };

  const toggleFeatured = async (facility: Facility) => {
    try {
      await facilitiesApi.update(facility.id, {
        ...facility,
        is_featured: !facility.is_featured,
      });
      fetchFacilities();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Gagal mengubah status featured');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fasilitas Pelatihan</h1>
          <p className="text-gray-600 mt-1">Kelola fasilitas yang ditampilkan di beranda</p>
        </div>
        <Link href="/admin/facilities/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Fasilitas
          </Button>
        </Link>
      </div>

      {/* Facilities Grid */}
      {facilities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Belum ada fasilitas</p>
          <Link href="/admin/facilities/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Fasilitas Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={facility.image_url}
                  alt={facility.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                  }}
                />
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {facility.is_featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                      ⭐ Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      facility.status === 'published'
                        ? 'bg-green-500 text-white'
                        : facility.status === 'draft'
                        ? 'bg-gray-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {facility.status === 'published' ? 'Published' : facility.status === 'draft' ? 'Draft' : 'Archived'}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Link href={`/admin/facilities/${facility.id}/edit`}>
                    <Button size="sm" variant="outline" className="bg-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white"
                    onClick={() => toggleFeatured(facility)}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        facility.is_featured ? 'fill-yellow-500 text-yellow-500' : ''
                      }`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(facility.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{facility.title}</h3>
                {facility.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{facility.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Sort: {facility.sort_order}</span>
                  <span>{new Date(facility.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
