'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { facilitiesApi, adminApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function EditFacilityPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    sort_order: 0,
    is_featured: true,
    status: 'published',
  });

  useEffect(() => {
    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      const response = await facilitiesApi.get(Number(facilityId));
      const facility = response.data || response;
      
      setFormData({
        title: facility.title || '',
        description: facility.description || '',
        image_url: facility.image_url || '',
        sort_order: facility.sort_order || 0,
        is_featured: Boolean(facility.is_featured),
        status: facility.status || 'published',
      });
      setImagePreview(facility.image_url || '');
    } catch (error: any) {
      console.error('Error fetching facility:', error);
      alert(error.response?.data?.message || 'Gagal memuat data fasilitas');
      router.push('/admin/facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'sort_order') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
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
      setUploadProgress(0);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'facilities');

      console.log('🚀 Uploading file:', file.name, 'Size:', file.size);
      
      const response = await adminApi.post('/admin/upload', formDataUpload, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            console.log(`⏳ Upload progress: ${percentCompleted}%`);
          }
        },
        timeout: 300000, // 5 minutes for large files and slow connections
      });

      console.log('✅ Upload response:', response.data);
      
      const imageUrl = response.data.url;
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      setImagePreview(imageUrl);
      alert('Gambar berhasil diganti!');
    } catch (error: any) {
      console.error('❌ Error uploading file:', error);
      
      let errorMsg = 'Gagal mengupload gambar';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMsg = 'Upload timeout. File terlalu besar atau koneksi lambat.';
      } else if (error.response?.status === 413) {
        errorMsg = 'File terlalu besar. Maksimal 10MB.';
      } else {
        errorMsg = error.response?.data?.message 
          || error.response?.data?.error
          || error.message 
          || errorMsg;
      }
      
      alert(`Upload gagal: ${errorMsg}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
      alert('Judul dan gambar wajib diisi!');
      return;
    }

    try {
      setSaving(true);
      await facilitiesApi.update(Number(facilityId), formData);
      alert('Fasilitas berhasil diupdate!');
      router.push('/admin/facilities');
    } catch (error: any) {
      console.error('Error updating facility:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate fasilitas');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/facilities">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Fasilitas</h1>
            <p className="text-gray-600 mt-1">Ubah informasi fasilitas pelatihan</p>
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
                Gambar Fasilitas
              </h2>
              
              {imagePreview ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
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
                  className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors mb-4 ${
                    dragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-12 h-12 mb-3 text-primary-600 animate-spin" />
                      <p className="text-sm text-gray-700 font-medium">Mengupload...</p>
                      {uploadProgress > 0 && (
                        <>
                          <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-primary-600 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Upload gambar baru
                      </p>
                      <p className="text-xs text-gray-500 mb-3">Drag & drop atau</p>
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
                        Max 2MB • JPG, PNG, GIF
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                💡 Upload gambar baru akan mengganti gambar lama
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Fasilitas
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Fasilitas <span className="text-red-500">*</span>
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
                    URL Gambar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleImageUrlChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                    readOnly={uploading}
                  />
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
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
                        Tampilkan di Beranda
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Fasilitas ini akan ditampilkan di halaman beranda
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Link href="/admin/facilities">
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
                    Update Fasilitas
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

