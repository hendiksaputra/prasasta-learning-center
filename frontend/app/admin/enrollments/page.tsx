'use client';

import { useState, useEffect } from 'react';
import { enrollmentsApi, coursesApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Edit, Search, Filter, Calendar, DollarSign, User, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Course {
  id: number;
  title: string;
  slug: string;
}

interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  enrollment_date: string;
  start_date?: string;
  completion_date?: string;
  amount_paid: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  student: Student;
  course: Course;
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(15);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [statusFilter, courseFilter, currentPage]);

  const fetchCourses = async () => {
    try {
      const response = await coursesApi.list({ per_page: 100 });
      const coursesData = response.data?.data || response.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        per_page: perPage,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (courseFilter !== 'all') {
        params.course_id = parseInt(courseFilter);
      }

      const response = await enrollmentsApi.list(params);
      const enrollmentsData = response.data?.data || response.data || [];
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);

      // Handle pagination
      if (response.data?.last_page) {
        setTotalPages(response.data.last_page);
      } else if (response.data?.total) {
        setTotalPages(Math.ceil(response.data.total / perPage));
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      alert('Gagal memuat data pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'in_progress':
        return 'Berlangsung';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Belum Bayar';
      case 'partial':
        return 'Sebagian';
      case 'paid':
        return 'Lunas';
      case 'refunded':
        return 'Dikembalikan';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filter enrollments by search query
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = (enrollment.student?.name || '').toLowerCase();
    const studentEmail = (enrollment.student?.email || '').toLowerCase();
    const courseTitle = (enrollment.course?.title || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();
    return (
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      courseTitle.includes(query)
    );
  });

  if (loading && enrollments.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Kursus</h1>
          <p className="text-gray-600 mt-1">Kelola semua pendaftaran kursus</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama, email, atau kursus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="in_progress">Berlangsung</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Semua Kursus</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCourseFilter('all');
              setCurrentPage(1);
            }}
            className="w-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Enrollments Table */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Tidak ada pendaftaran ditemukan</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kursus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.student?.name || '-'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.student?.email || '-'}
                            </div>
                            {enrollment.student?.phone && (
                              <div className="text-xs text-gray-400">
                                {enrollment.student.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {enrollment.course?.title || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            enrollment.status
                          )}`}
                        >
                          {getStatusLabel(enrollment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                              enrollment.payment_status
                            )}`}
                          >
                            {getPaymentStatusLabel(enrollment.payment_status)}
                          </span>
                          <div className="text-xs text-gray-500">
                            {formatPrice(enrollment.amount_paid)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Daftar: {formatDate(enrollment.enrollment_date)}</span>
                          </div>
                          {enrollment.start_date && (
                            <div className="text-xs">
                              Mulai: {formatDate(enrollment.start_date)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/enrollments/${enrollment.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
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

