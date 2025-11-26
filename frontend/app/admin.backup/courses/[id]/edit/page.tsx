'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { coursesApi, categoriesApi } from '@/lib/api-admin';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
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
        const [courseRes, categoriesRes] = await Promise.all([
          coursesApi.get(courseId),
          categoriesApi.list(),
        ]);

        const course = courseRes;
        // Handle both direct array and wrapped response
        const categoriesData = Array.isArray(categoriesRes) 
          ? categoriesRes 
          : (categoriesRes.data || categoriesRes || []);
        setCategories(categoriesData);
        
        // Format date for input
        const formatDate = (date: string | null) => {
          if (!date) return '';
          const d = new Date(date);
          return d.toISOString().split('T')[0];
        };

        setFormData({
          category_id: course.category_id?.toString() || '',
          title: course.title || '',
          description: course.description || '',
          short_description: course.short_description || '',
          price: course.price?.toString() || '',
          duration_days: course.duration_days?.toString() || '',
          total_hours: course.total_hours?.toString() || '',
          level: course.level || 'beginner',
          status: course.status || 'draft',
          max_students: course.max_students?.toString() || '',
          min_students: course.min_students?.toString() || '1',
          learning_objectives: course.learning_objectives || '',
          prerequisites: course.prerequisites || '',
          what_you_will_learn: course.what_you_will_learn || '',
          course_materials: Array.isArray(course.course_materials) ? course.course_materials : [],
          requirements: Array.isArray(course.requirements) ? course.requirements : [],
          facilities: Array.isArray(course.facilities) ? course.facilities : [],
          internship_opportunity: course.internship_opportunity || '',
          certification_info: course.certification_info || '',
          certification_price: course.certification_price?.toString() || '',
          registration_link: course.registration_link || '',
          registration_deadline: formatDate(course.registration_deadline),
          limited_quota: course.limited_quota || false,
          training_method: course.training_method || '',
          is_featured: course.is_featured || false,
          instructor_ids: course.instructors?.map((i: any) => i.id) || [],
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        alert('Gagal memuat data kursus');
        router.push('/admin/courses');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId, router]);

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
    setSaving(true);
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

      await coursesApi.update(courseId, submitData);
      router.push('/admin/courses');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Gagal menyimpan kursus');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Kursus</h1>
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
                />

                <Input
                  label="Total Jam"
                  name="total_hours"
                  type="number"
                  value={formData.total_hours}
                  onChange={handleChange}
                  required
                  error={errors.total_hours?.[0]}
                />

                <Input
                  label="Maksimal Siswa"
                  name="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={handleChange}
                />

                <Input
                  label="Minimal Siswa"
                  name="min_students"
                  type="number"
                  value={formData.min_students}
                  onChange={handleChange}
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
                  />
                </div>
              </div>
            </Card>

            {/* Daftar Materi */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Daftar Materi</h2>
                <Button type="button" size="sm" onClick={() => addArrayItem('course_materials')}>
                  + Tambah Materi
                </Button>
              </div>
              <div className="space-y-2">
                {formData.course_materials.map((materi, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={materi}
                      onChange={(e) => handleArrayChange('course_materials', index, e.target.value)}
                      placeholder={`Materi ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('course_materials', index)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                {formData.course_materials.length === 0 && (
                  <p className="text-sm text-gray-500">Belum ada materi. Klik "Tambah Materi" untuk menambahkan.</p>
                )}
              </div>
            </Card>

            {/* Persyaratan */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Persyaratan</h2>
                <Button type="button" size="sm" onClick={() => addArrayItem('requirements')}>
                  + Tambah Persyaratan
                </Button>
              </div>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <Input
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder={`Persyaratan ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('requirements', index)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                {formData.requirements.length === 0 && (
                  <p className="text-sm text-gray-500">Belum ada persyaratan. Klik "Tambah Persyaratan" untuk menambahkan.</p>
                )}
              </div>
            </Card>

            {/* Fasilitas */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Fasilitas & Yang Termasuk</h2>
                <Button type="button" size="sm" onClick={() => addArrayItem('facilities')}>
                  + Tambah Fasilitas
                </Button>
              </div>
              <div className="space-y-2">
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={facility}
                      onChange={(e) => handleArrayChange('facilities', index, e.target.value)}
                      placeholder={`Fasilitas ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('facilities', index)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                {formData.facilities.length === 0 && (
                  <p className="text-sm text-gray-500">Belum ada fasilitas. Klik "Tambah Fasilitas" untuk menambahkan.</p>
                )}
              </div>
            </Card>

            {/* Informasi Magang & Sertifikasi */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Magang & Sertifikasi</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Informasi Kesempatan Magang
                  </label>
                  <textarea
                    name="internship_opportunity"
                    value={formData.internship_opportunity}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contoh: Bagi peserta yang memenuhi persyaratan & kriteria, berkesempatan untuk magang di perusahaan rekanan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Informasi Sertifikasi
                  </label>
                  <textarea
                    name="certification_info"
                    value={formData.certification_info}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contoh: Biaya dengan SERTIFIKASI BNSP"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Harga Sertifikasi (Rp)"
                    name="certification_price"
                    type="number"
                    value={formData.certification_price}
                    onChange={handleChange}
                    placeholder="8800000"
                  />
                  <Input
                    label="Link Pendaftaran"
                    name="registration_link"
                    type="url"
                    value={formData.registration_link}
                    onChange={handleChange}
                    placeholder="https://bit.ly/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Deadline Pendaftaran"
                    name="registration_deadline"
                    type="date"
                    value={formData.registration_deadline}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pelatihan
                    </label>
                    <input
                      type="text"
                      name="training_method"
                      value={formData.training_method}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Contoh: Pelatihan Berbasis Kelas Teori Dan Praktik"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="limited_quota"
                    checked={formData.limited_quota}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Tampilkan "Limited Quota" / "Kuota Terbatas"
                  </label>
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
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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

