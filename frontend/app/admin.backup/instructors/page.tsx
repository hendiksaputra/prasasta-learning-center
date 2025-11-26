'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { instructorsApi } from '@/lib/api-admin';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  useEffect(() => {
    fetchInstructors();
  }, [search]);

  const fetchInstructors = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: 15,
      };
      if (search) params.search = search;

      const data = await instructorsApi.list(params);
      setInstructors(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 15,
        total: data.total || 0,
      });
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus instruktur ini?')) {
      return;
    }

    try {
      await instructorsApi.delete(id);
      fetchInstructors(pagination.current_page);
    } catch (error) {
      alert('Gagal menghapus instruktur');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Instruktur</h1>
        <Link href="/admin/instructors/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Instruktur
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <Input
          placeholder="Cari instruktur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </Card>

      {/* Instructors Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : instructors.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Belum ada instruktur. Tambah instruktur baru untuk memulai.</p>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instruktur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spesialisasi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructors.map((instructor) => (
                    <tr key={instructor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                        {instructor.bio && (
                          <div className="text-sm text-gray-500 line-clamp-1">{instructor.bio}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{instructor.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{instructor.phone || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{instructor.specialization || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/instructors/${instructor.id}/edit`}>
                            <button className="text-primary-600 hover:text-primary-900 p-1">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(instructor.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} sampai{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari{' '}
                {pagination.total} instruktur
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => fetchInstructors(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fetchInstructors(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

