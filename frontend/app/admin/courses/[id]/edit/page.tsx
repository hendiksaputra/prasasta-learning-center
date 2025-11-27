'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { coursesApi, categoriesApi, instructorsApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    price: '',
    duration_days: '',
    total_hours: '',
    max_students: '',
    min_students: '1',
    level: 'beginner',
    status: 'draft',
    is_featured: false,
    limited_quota: false,
    learning_objectives: '',
    prerequisites: '',
    what_you_will_learn: '',
    training_method: '',
    internship_opportunity: '',
    certification_info: '',
    certification_price: '',
    registration_link: '',
    registration_deadline: '',
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchCategories();
      fetchInstructors();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await coursesApi.get(Number(courseId));
      console.log('Course response:', response); // Debug log
      const course = response;
      
      setFormData({
        title: course.title || '',
        description: course.description || '',
        short_description: course.short_description || '',
        category_id: course.category_id?.toString() || (course.category?.id?.toString()) || '',
        price: course.price?.toString() || '0',
        duration_days: course.duration_days?.toString() || '0',
        total_hours: course.total_hours?.toString() || '0',
        max_students: course.max_students?.toString() || '',
        min_students: course.min_students?.toString() || '1',
        level: course.level || 'beginner',
        status: course.status || 'draft',
        is_featured: Boolean(course.is_featured),
        limited_quota: Boolean(course.limited_quota),
        learning_objectives: course.learning_objectives || '',
        prerequisites: course.prerequisites || '',
        what_you_will_learn: course.what_you_will_learn || '',
        training_method: course.training_method || '',
        internship_opportunity: course.internship_opportunity || '',
        certification_info: course.certification_info || '',
        certification_price: course.certification_price?.toString() || '',
        registration_link: course.registration_link || '',
        registration_deadline: course.registration_deadline ? course.registration_deadline.split('T')[0] : '',
      });

      // Set selected instructors if available
      if (course.instructors && Array.isArray(course.instructors)) {
        setSelectedInstructors(course.instructors.map((i: any) => i.id));
      }
    } catch (error: any) {
      console.error('Error fetching course:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Gagal memuat data kursus';
      alert(`Error: ${errorMessage}`);
      // Don't redirect immediately, let user see the error
      // router.push('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.list();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await instructorsApi.list();
      setInstructors(response.data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInstructorToggle = (instructorId: number) => {
    setSelectedInstructors((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category_id) {
      alert('Judul dan kategori wajib diisi!');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price) || 0,
        duration_days: parseInt(formData.duration_days) || 0,
        total_hours: parseInt(formData.total_hours) || 0,
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        min_students: parseInt(formData.min_students) || 1,
        certification_price: formData.certification_price ? parseFloat(formData.certification_price) : null,
        instructor_ids: selectedInstructors,
      };

      await coursesApi.update(Number(courseId), payload);
      alert('Kursus berhasil diupdate!');
      router.push('/admin/courses');
    } catch (error: any) {
      console.error('Error updating course:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate kursus');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data kursus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Kursus</h1>
            <p className="text-gray-600 mt-1">Update informasi kursus</p>
          </div>
        </div>
      </div>

      {/* Form - Same as Create */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informasi Dasar
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Kursus <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (IDR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi (Hari)
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Jam
                </label>
                <input
                  type="number"
                  name="total_hours"
                  value={formData.total_hours}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center space-x-6 pt-7">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Kursus Unggulan</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="limited_quota"
                    checked={formData.limited_quota}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Kuota Terbatas</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Kapasitas Peserta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimal Peserta
              </label>
              <input
                type="number"
                name="min_students"
                value={formData.min_students}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maksimal Peserta
              </label>
              <input
                type="number"
                name="max_students"
                value={formData.max_students}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Learning Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detail Pembelajaran
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tujuan Pembelajaran
              </label>
              <textarea
                name="learning_objectives"
                value={formData.learning_objectives}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prasyarat
              </label>
              <textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apa yang Akan Dipelajari
              </label>
              <textarea
                name="what_you_will_learn"
                value={formData.what_you_will_learn}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metode Pelatihan
              </label>
              <textarea
                name="training_method"
                value={formData.training_method}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Certification & Registration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sertifikasi & Pendaftaran
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Informasi Sertifikasi
              </label>
              <textarea
                name="certification_info"
                value={formData.certification_info}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Sertifikasi (IDR)
              </label>
              <input
                type="number"
                name="certification_price"
                value={formData.certification_price}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Pendaftaran
              </label>
              <input
                type="url"
                name="registration_link"
                value={formData.registration_link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batas Waktu Pendaftaran
              </label>
              <input
                type="date"
                name="registration_deadline"
                value={formData.registration_deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kesempatan Magang
              </label>
              <textarea
                name="internship_opportunity"
                value={formData.internship_opportunity}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Instructors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Instruktur
          </h2>
          {instructors.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Tidak ada instruktur tersedia.
            </p>
          ) : (
            <div className="space-y-2">
              {instructors.map((instructor) => (
                <label
                  key={instructor.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(instructor.id)}
                    onChange={() => handleInstructorToggle(instructor.id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{instructor.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link href="/admin/courses">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Kursus
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
