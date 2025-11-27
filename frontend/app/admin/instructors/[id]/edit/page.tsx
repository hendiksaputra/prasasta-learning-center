'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { instructorsApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function EditInstructorPage() {
  const router = useRouter();
  const params = useParams();
  const instructorId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Dynamic array for qualifications
  const [qualifications, setQualifications] = useState<string[]>(['']);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    years_experience: '',
    is_active: true,
  });

  useEffect(() => {
    if (instructorId) {
      fetchInstructor();
    }
  }, [instructorId]);

  const fetchInstructor = async () => {
    try {
      setLoading(true);
      const response = await instructorsApi.get(Number(instructorId));
      const instructor = response.data || response;
      
      setFormData({
        name: instructor.name || '',
        email: instructor.email || '',
        phone: instructor.phone || '',
        bio: instructor.bio || '',
        specialization: instructor.specialization || '',
        years_experience: instructor.years_experience?.toString() || '',
        is_active: Boolean(instructor.is_active),
      });

      // Set qualifications
      if (instructor.qualifications && Array.isArray(instructor.qualifications) && instructor.qualifications.length > 0) {
        setQualifications(instructor.qualifications);
      }
    } catch (error: any) {
      console.error('Error fetching instructor:', error);
      alert(error.response?.data?.message || 'Gagal memuat data instruktur');
      router.push('/admin/instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Dynamic Array Handlers
  const handleQualificationChange = (index: number, value: string) => {
    setQualifications((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addQualification = () => {
    setQualifications((prev) => [...prev, '']);
  };

  const removeQualification = (index: number) => {
    setQualifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Nama dan email wajib diisi!');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        qualifications: qualifications.filter(item => item.trim() !== ''),
      };

      await instructorsApi.update(Number(instructorId), payload);
      alert('Instruktur berhasil diupdate!');
      router.push('/admin/instructors');
    } catch (error: any) {
      console.error('Error updating instructor:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate instruktur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data instruktur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/instructors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Instruktur</h1>
            <p className="text-gray-600 mt-1">Update informasi instruktur</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informasi Dasar
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spesialisasi
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Contoh: Mekanik Alat Berat, Hydraulic System"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pengalaman (Tahun)
              </label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio/Deskripsi
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Jelaskan latar belakang dan pengalaman instruktur..."
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Kualifikasi & Sertifikat
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQualification}
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah Kualifikasi
            </Button>
          </div>
          <div className="space-y-2">
            {qualifications.map((qualification, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => handleQualificationChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={`Kualifikasi ${index + 1}`}
                />
                {qualifications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQualification(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Tambahkan sertifikat, gelar, atau kualifikasi profesional lainnya
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link href="/admin/instructors">
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
                Update Instruktur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

