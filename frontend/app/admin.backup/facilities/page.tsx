'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { facilitiesApi } from '@/lib/api-admin';

export default function FacilitiesPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchFacilities();
  }, [search, statusFilter]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params: any = {
        per_page: 15,
      };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const data = await facilitiesApi.list(params);
      setFacilities(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching facilities:', error);
      alert('Gagal memuat data fasilitas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      return;
    }

    try {
      await facilitiesApi.delete(id);
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Gagal menghapus fasilitas');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fasilitas Pelatihan</h1>
          <p className="text-gray-600 mt-1">Kelola gambar fasilitas yang ditampilkan di halaman utama</p>
        </div>
        <Link href="/admin/facilities/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Fasilitas
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
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
        </div>
      </Card>

      {/* Facilities List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      ) : facilities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Belum ada fasilitas</p>
          <Link href="/admin/facilities/new">
            <Button>Tambah Fasilitas Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={facility.image_url}
                  alt={facility.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                {facility.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs">
                    <Star className="h-3 w-3" />
                    <span>Featured</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    facility.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : facility.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {facility.status === 'published' ? 'Published' : facility.status === 'draft' ? 'Draft' : 'Archived'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {facility.title}
                </h3>
                {facility.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {facility.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Urutan: {facility.sort_order}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/admin/facilities/${facility.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(facility.id)}
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

