'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  duration_days: number;
  total_hours: number;
  level: string;
  status: string;
  is_featured: boolean;
  category: {
    id: number;
    name: string;
  };
  image?: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await coursesApi.list(params);
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kursus "${title}"?`)) {
      return;
    }

    try {
      await coursesApi.delete(id);
      alert('Kursus berhasil dihapus');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Gagal menghapus kursus');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kursus</h1>
          <p className="text-gray-600 mt-1">Kelola semua kursus dan materinya</p>
        </div>
        <Link href="/admin/courses/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kursus
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kursus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada kursus ditemukan</p>
            <Link href="/admin/courses/create" className="inline-block mt-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kursus Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kursus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durasi (Hari/Jam)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {course.image && (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                            {course.is_featured && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{course.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {course.category?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatPrice(course.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.duration_days} hari
                        {course.total_hours > 0 && ` / ${course.total_hours} jam`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          course.status
                        )}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900"
                          title="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
