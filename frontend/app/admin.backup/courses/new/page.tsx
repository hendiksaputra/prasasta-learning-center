'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { coursesApi, categoriesApi } from '@/lib/api-admin';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    short_description: '',
    price: '',
    duration_days: '',
    total_hours: '',
    level: 'beginner',
    status: 'draft',
    max_students: '',
    min_students: '1',
    learning_objectives: '',
    prerequisites: '',
    what_you_will_learn: '',
    course_materials: [] as string[],
    requirements: [] as string[],
    facilities: [] as string[],
    internship_opportunity: '',
    certification_info: '',
    certification_price: '',
    registration_link: '',
    registration_deadline: '',
    limited_quota: false,
    training_method: '',
    is_featured: false,
    instructor_ids: [] as number[],
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes] = await Promise.all([
          categoriesApi.list(),
        ]);
        setCategories(categoriesRes.data || []);
        // TODO: Fetch instructors when API is ready
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleArrayChange = (field: 'course_materials' | 'requirements' | 'facilities', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addArrayItem = (field: 'course_materials' | 'requirements' | 'facilities') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayItem = (field: 'course_materials' | 'requirements' | 'facilities', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days),
        total_hours: parseInt(formData.total_hours),
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        min_students: parseInt(formData.min_students),
        certification_price: formData.certification_price ? parseFloat(formData.certification_price) : null,
        course_materials: formData.course_materials.filter(item => item.trim() !== ''),
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        facilities: formData.facilities.filter(item => item.trim() !== ''),
        instructor_ids: formData.instructor_ids,
      };

      await coursesApi.create(submitData);
      router.push('/admin/courses');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Gagal menyimpan kursus');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Kursus Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Dasar</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.category_id[0]}</p>
                  )}
                </div>

                <Input
                  label="Judul Kursus"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  error={errors.title?.[0]}
                  placeholder="Contoh: Pelatihan Mekanik Alat Berat Dasar"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Deskripsi singkat yang akan ditampilkan di halaman listing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Deskripsi lengkap tentang kursus"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Course Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detail Kursus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Harga (Rp)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  error={errors.price?.[0]}
                  placeholder="5000000"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <Input
                  label="Durasi (Hari)"
                  name="duration_days"
                  type="number"
                  value={formData.duration_days}
                  onChange={handleChange}
                  required
                  error={errors.duration_days?.[0]}
                  placeholder="10"
                />

                <Input
                  label="Total Jam"
                  name="total_hours"
                  type="number"
                  value={formData.total_hours}
                  onChange={handleChange}
                  required
                  error={errors.total_hours?.[0]}
                  placeholder="80"
                />

                <Input
                  label="Maksimal Siswa"
                  name="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={handleChange}
                  placeholder="20"
                />

                <Input
                  label="Minimal Siswa"
                  name="min_students"
                  type="number"
                  value={formData.min_students}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Tambahan</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apa yang Akan Dipelajari
                  </label>
                  <textarea
                    name="what_you_will_learn"
                    value={formData.what_you_will_learn}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="List hal-hal yang akan dipelajari dalam kursus ini"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tujuan Pembelajaran
                  </label>
                  <textarea
                    name="learning_objectives"
                    value={formData.learning_objectives}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tujuan pembelajaran dari kursus ini"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prasyarat
                  </label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Prasyarat yang harus dipenuhi sebelum mengikuti kursus"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pengaturan</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Tampilkan sebagai Kursus Unggulan
                  </label>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Menyimpan...' : 'Simpan Kursus'}
                </Button>
                <Link href="/admin/courses">
                  <Button variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

