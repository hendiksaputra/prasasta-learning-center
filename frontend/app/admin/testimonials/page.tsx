'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { testimonialsApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company?: string;
  testimonial: string;
  course_name?: string;
  rating: number;
  photo?: string;
  is_featured: boolean;
  status: string;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsApi.list();
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name}"?`)) {
      return;
    }

    try {
      await testimonialsApi.delete(id);
      alert('Testimoni berhasil dihapus');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Gagal menghapus testimoni');
    }
  };

  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      await testimonialsApi.update(id, { is_featured: !currentStatus });
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Gagal mengubah status featured');
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Testimoni</h1>
          <p className="text-gray-600 mt-1">Kelola testimoni dari peserta</p>
        </div>
        <Link href="/admin/testimonials/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Testimoni
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari testimoni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTestimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">Tidak ada testimoni ditemukan</p>
            <Link href="/admin/testimonials/create">
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Testimoni Pertama
              </Button>
            </Link>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 hover:shadow-md transition-shadow ${
                testimonial.is_featured ? 'border-yellow-400' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {testimonial.photo ? (
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-500">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonial.position}
                      {testimonial.company && ` - ${testimonial.company}`}
                    </p>
                    {testimonial.course_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        Kursus: {testimonial.course_name}
                      </p>
                    )}
                    <div className="mt-1">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
                {testimonial.is_featured && (
                  <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                "{testimonial.testimonial}"
              </p>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() =>
                    toggleFeatured(testimonial.id, testimonial.is_featured)
                  }
                  className={`text-sm ${
                    testimonial.is_featured
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  {testimonial.is_featured ? 'Unfeature' : 'Set as Featured'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/testimonials/${testimonial.id}/edit`)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(testimonial.id, testimonial.name)
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
