'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { instructorsApi } from '@/lib/api-admin';

export default function EditInstructorPage() {
  const router = useRouter();
  const params = useParams();
  const instructorId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    years_experience: '',
    qualifications: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructor = await instructorsApi.get(instructorId);
        setFormData({
          name: instructor.name || '',
          email: instructor.email || '',
          phone: instructor.phone || '',
          bio: instructor.bio || '',
          specialization: instructor.specialization || '',
          years_experience: instructor.years_experience?.toString() || '',
          qualifications: instructor.qualifications || '',
        });
      } catch (error) {
        console.error('Error fetching instructor:', error);
        alert('Gagal memuat data instruktur');
        router.push('/admin/instructors');
      } finally {
        setLoading(false);
      }
    };

    if (instructorId) {
      fetchData();
    }
  }, [instructorId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
      };

      await instructorsApi.update(instructorId, submitData);
      router.push('/admin/instructors');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Gagal menyimpan instruktur');
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
          <Link href="/admin/instructors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Instruktur</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
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
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={errors.email?.[0]}
                />

                <Input
                  label="Nomor Telepon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone?.[0]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spesialisasi
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <Input
                  label="Pengalaman (Tahun)"
                  name="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={handleChange}
                  error={errors.years_experience?.[0]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografi
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kualifikasi
                  </label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                <Link href="/admin/instructors">
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

