'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { galleryApi } from '@/lib/api-admin';

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const imageId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    is_featured: false,
    sort_order: 0,
    status: 'draft',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const image = await galleryApi.get(imageId);
        setFormData({
          title: image.title || '',
          description: image.description || '',
          image_url: image.image_url || '',
          category: image.category || '',
          is_featured: image.is_featured || false,
          sort_order: image.sort_order || 0,
          status: image.status || 'draft',
        });
        setPreview(image.image_url || '');
      } catch (error) {
        console.error('Error fetching image:', error);
        alert('Gagal memuat data foto');
        router.push('/admin/gallery');
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      fetchImage();
    }
  }, [imageId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
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
      // Update preview when image URL changes
      if (name === 'image_url') {
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

    // Validate file size (max 5MB for gallery)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'gallery');

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
        image_url: data.url,
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
      image_url: '',
    });
    setPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      await galleryApi.update(imageId, formData);
      router.push('/admin/gallery');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Gagal menyimpan perubahan');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/gallery">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Foto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Foto</h2>
              
              {/* Preview */}
              {preview && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-300"
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
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
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
                          PNG, JPG, GIF maksimal 5MB
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
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </Card>

            {/* Image Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Foto</h2>
              <div className="space-y-4">
                <Input
                  label="Judul Foto"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  error={errors.title?.[0]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="training">Training</option>
                    <option value="workshop">Workshop</option>
                    <option value="classroom">Classroom</option>
                    <option value="certificate">Certificate</option>
                    <option value="other">Lainnya</option>
                  </select>
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
                    Tampilkan sebagai Foto Unggulan
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
                <Link href="/admin/gallery">
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

