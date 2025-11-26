'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Star, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { testimonialsApi } from '@/lib/api-admin';

export default function NewTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    testimonial: '',
    photo: '',
    rating: 5,
    course_name: '',
    is_featured: false,
    sort_order: 0,
    status: 'draft',
  });
  const [errors, setErrors] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === 'rating') {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    } else if (name === 'sort_order') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      // Update preview when photo URL changes
      if (name === 'photo') {
        setPreview(value);
      }
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'testimonials');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const token = localStorage.getItem('admin_token');

      const response = await fetch(`${apiUrl}/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload gagal');
      }

      setFormData({
        ...formData,
        photo: data.url,
      });
      setPreview(data.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Gagal mengupload foto');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setFormData({
      ...formData,
      photo: '',
    });
    setPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await testimonialsApi.create(formData);
      router.push('/admin/testimonials');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Gagal menyimpan testimoni');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/testimonials">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Testimoni Baru</h1>
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
                <Input
                  label="Nama Lengkap"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={errors.name?.[0]}
                  placeholder="Contoh: Ahmad Rizki"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Posisi / Jabatan"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Contoh: Alumni Mekanik Alat Berat"
                  />
                  <Input
                    label="Perusahaan"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Contoh: PT. Konstruksi Jaya"
                  />
                </div>

                <Input
                  label="Nama Kursus"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="Contoh: Pelatihan Mekanik Alat Berat Dasar"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Testimoni
                  </label>
                  
                  {/* Preview */}
                  {preview && (
                    <div className="mb-4 relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                            <p className="text-sm text-gray-600">Mengupload...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF maksimal 2MB
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* URL Input (Alternative) */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Atau masukkan URL foto:</p>
                    <Input
                      name="photo"
                      type="url"
                      value={formData.photo}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Testimonial Content */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Isi Testimoni</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimoni <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="testimonial"
                    value={formData.testimonial}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Tulis testimoni dari alumni..."
                  />
                  {errors.testimonial && (
                    <p className="mt-1 text-sm text-red-600">{errors.testimonial[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className={`p-2 rounded-lg transition ${
                          formData.rating >= rating
                            ? 'text-yellow-400 bg-yellow-50'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            formData.rating >= rating ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">{formData.rating} / 5</span>
                  </div>
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

                <Input
                  label="Urutan Tampil"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order.toString()}
                  onChange={handleChange}
                  placeholder="0"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Tampilkan sebagai Testimoni Unggulan
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
                  {loading ? 'Menyimpan...' : 'Simpan Testimoni'}
                </Button>
                <Link href="/admin/testimonials">
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

