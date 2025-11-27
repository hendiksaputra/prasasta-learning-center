'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { galleryApi } from '@/lib/api-admin';
import { apiAdmin } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'training',
    is_featured: true,
    status: 'published',
  });

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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image_url: url }));
    setImagePreview(url);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'gallery');

      const response = await apiAdmin.post('/admin/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      setImagePreview(imageUrl);
      alert('Gambar berhasil diupload!');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Gagal mengupload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url) {
      alert('Judul dan URL gambar wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      await galleryApi.create(formData);
      alert('Gambar galeri berhasil ditambahkan!');
      router.push('/admin/gallery');
    } catch (error: any) {
      console.error('Error creating gallery:', error);
      alert(error.response?.data?.message || 'Gagal menambahkan gambar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/gallery">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Foto Galeri</h1>
            <p className="text-gray-600 mt-1">Upload foto kegiatan pelatihan</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Preview Gambar
              </h2>
              
              {imagePreview ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImagePreview('');
                      alert('Gagal memuat gambar. Periksa URL.');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData((prev) => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                    dragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-12 h-12 mb-3 text-primary-600 animate-spin" />
                      <p className="text-sm text-gray-600">Mengupload...</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Drag & drop gambar di sini
                      </p>
                      <p className="text-xs text-gray-500 mb-3">atau</p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={uploading}
                        />
                        <span className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors inline-block">
                          Pilih File
                        </span>
                      </label>
                      <p className="text-xs text-gray-400 mt-3">
                        Max 2MB • JPG, PNG, GIF, WebP
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>2 Cara Upload:</strong>
                  <br />1. Drag & drop atau klik "Pilih File"
                  <br />2. Paste URL gambar dari hosting
                  <br /><br />
                  <strong>Spesifikasi:</strong>
                  <br />• Resolusi minimal 800x600px
                  <br />• Format: JPG, PNG, GIF, WebP
                  <br />• Ukuran maksimal: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Gambar
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Foto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Contoh: Praktik Mekanik Alat Berat 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Gambar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleImageUrlChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                    placeholder="Auto-terisi setelah upload file (atau paste URL manual)"
                    readOnly={uploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📤 Upload file otomatis mengisi field ini, atau paste URL manual dari hosting eksternal
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Deskripsi singkat tentang foto ini..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="training">Training/Pelatihan</option>
                    <option value="workshop">Workshop</option>
                    <option value="classroom">Classroom</option>
                    <option value="facility">Fasilitas</option>
                    <option value="certification">Sertifikasi</option>
                    <option value="others">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pengaturan
              </h2>
              <div className="space-y-4">
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        Tampilkan di Galeri Beranda
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Foto ini akan ditampilkan di section Galeri Kegiatan di halaman beranda
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Link href="/admin/gallery">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Foto
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

