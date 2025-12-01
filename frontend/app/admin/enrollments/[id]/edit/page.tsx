'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { enrollmentsApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, Calendar, DollarSign, FileText, User, BookOpen } from 'lucide-react';
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

export default function EditEnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = parseInt(params.id as string);

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    status: 'pending' as Enrollment['status'],
    start_date: '',
    completion_date: '',
    amount_paid: 0,
    payment_status: 'pending' as Enrollment['payment_status'],
    notes: '',
  });

  useEffect(() => {
    fetchEnrollment();
  }, [enrollmentId]);

  const fetchEnrollment = async () => {
    try {
      setLoading(true);
      const foundEnrollment = await enrollmentsApi.get(enrollmentId);

      if (foundEnrollment) {
        setEnrollment(foundEnrollment);
        setFormData({
          status: foundEnrollment.status,
          start_date: foundEnrollment.start_date || '',
          completion_date: foundEnrollment.completion_date || '',
          amount_paid: foundEnrollment.amount_paid || 0,
          payment_status: foundEnrollment.payment_status,
          notes: foundEnrollment.notes || '',
        });
      } else {
        alert('Pendaftaran tidak ditemukan');
        router.push('/admin/enrollments');
      }
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      alert('Gagal memuat data pendaftaran');
      router.push('/admin/enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const updateData: any = {
        status: formData.status,
        payment_status: formData.payment_status,
        amount_paid: parseFloat(formData.amount_paid.toString()),
        notes: formData.notes,
      };

      if (formData.start_date) {
        updateData.start_date = formData.start_date;
      }

      if (formData.completion_date) {
        updateData.completion_date = formData.completion_date;
      }

      await enrollmentsApi.update(enrollmentId, updateData);
      alert('Pendaftaran berhasil diperbarui!');
      router.push('/admin/enrollments');
    } catch (error: any) {
      console.error('Error updating enrollment:', error);
      alert(error.response?.data?.message || 'Gagal memperbarui pendaftaran');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Memuat...</div>
      </div>
    );
  }

  if (!enrollment) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/enrollments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Pendaftaran</h1>
            <p className="text-gray-600 mt-1">ID: #{enrollment.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pendaftaran
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Enrollment['status'] })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="pending">Menunggu</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="in_progress">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pembayaran
              </label>
              <select
                value={formData.payment_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_status: e.target.value as Enrollment['payment_status'],
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="pending">Belum Bayar</option>
                <option value="partial">Sebagian</option>
                <option value="paid">Lunas</option>
                <option value="refunded">Dikembalikan</option>
              </select>
            </div>

            {/* Amount Paid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah yang Dibayar
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount_paid}
                  onChange={(e) =>
                    setFormData({ ...formData, amount_paid: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formatPrice(formData.amount_paid)}
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) =>
                    setFormData({ ...formData, completion_date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tambahkan catatan tentang pendaftaran ini..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Link href="/admin/enrollments">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Student Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informasi Siswa
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="text-sm font-medium text-gray-900">
                  {enrollment.student?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{enrollment.student?.email || '-'}</p>
              </div>
              {enrollment.student?.phone && (
                <div>
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="text-sm text-gray-900">{enrollment.student.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Informasi Kursus
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Kursus</p>
                <p className="text-sm font-medium text-gray-900">
                  {enrollment.course?.title || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Pendaftaran</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Tanggal Pendaftaran</p>
                <p className="text-sm text-gray-900">{formatDate(enrollment.enrollment_date)}</p>
              </div>
              {enrollment.start_date && (
                <div>
                  <p className="text-xs text-gray-500">Tanggal Mulai</p>
                  <p className="text-sm text-gray-900">{formatDate(enrollment.start_date)}</p>
                </div>
              )}
              {enrollment.completion_date && (
                <div>
                  <p className="text-xs text-gray-500">Tanggal Selesai</p>
                  <p className="text-sm text-gray-900">{formatDate(enrollment.completion_date)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Dibuat</p>
                <p className="text-sm text-gray-900">{formatDate(enrollment.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

