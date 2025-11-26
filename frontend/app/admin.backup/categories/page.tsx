'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { categoriesApi } from '@/lib/api-admin';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchCategories();
  }, [search, activeFilter]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params: any = {
        per_page: 15,
      };
      if (search) params.search = search;
      if (activeFilter !== 'all') {
        params.is_active = activeFilter === 'active';
      }

      const data = await categoriesApi.adminList(params);
      setCategories(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }

    try {
      await categoriesApi.delete(id);
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const message = error.response?.data?.message || 'Gagal menghapus kategori';
      alert(message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategori Kursus</h1>
          <p className="text-gray-600 mt-1">Kelola kategori kursus</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari nama atau deskripsi kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Belum ada kategori</p>
          <Link href="/admin/categories/new">
            <Button>Tambah Kategori Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {category.is_active ? (
                    <Eye className="h-5 w-5 text-green-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {category.image && (
                <div className="mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Urutan: {category.sort_order}
                  {category.courses_count !== undefined && (
                    <span className="ml-2">• {category.courses_count} kursus</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

