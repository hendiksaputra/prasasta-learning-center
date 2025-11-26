'use client';

import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { enrollmentsApi } from '@/lib/api-admin';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  useEffect(() => {
    fetchEnrollments();
  }, [statusFilter]);

  const fetchEnrollments = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: 15,
      };
      if (statusFilter !== 'all') params.status = statusFilter;

      const data = await enrollmentsApi.list(params);
      setEnrollments(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 15,
        total: data.total || 0,
      });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await enrollmentsApi.update(id, { status: newStatus });
      fetchEnrollments(pagination.current_page);
    } catch (error) {
      alert('Gagal mengupdate status pendaftaran');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      completed: CheckCircle,
    };
    const labels = {
      pending: 'Pending',
      approved: 'Disetujui',
      rejected: 'Ditolak',
      completed: 'Selesai',
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${styles[status as keyof typeof styles] || styles.pending}`}>
        <Icon className="h-3 w-3" />
        <span>{labels[status as keyof typeof labels] || status}</span>
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Kelola Pendaftaran</h1>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Cari pendaftaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </Card>

      {/* Enrollments Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : enrollments.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Belum ada pendaftaran.</p>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kursus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Daftar
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
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.student?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.student?.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.course?.title || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rp {enrollment.course?.price?.toLocaleString('id-ID') || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(enrollment.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(enrollment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {enrollment.status === 'pending' && (
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(enrollment.id, 'approved')}
                            >
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(enrollment.id, 'rejected')}
                            >
                              Tolak
                            </Button>
                          </div>
                        )}
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
                {pagination.total} pendaftaran
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => fetchEnrollments(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fetchEnrollments(pagination.current_page + 1)}
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

