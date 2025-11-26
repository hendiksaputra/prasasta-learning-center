'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { testimonialsApi } from '@/lib/api-admin';

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchTestimonials();
  }, [search, statusFilter]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const params: any = {
        per_page: 15,
      };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const data = await testimonialsApi.list(params);
      setTestimonials(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      alert('Gagal memuat data testimoni');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      return;
    }

    try {
      await testimonialsApi.delete(id);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Gagal menghapus testimoni');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimoni Alumni</h1>
          <p className="text-gray-600 mt-1">Kelola testimoni dari alumni pelatihan</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Testimoni
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari nama, testimoni, atau perusahaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Belum ada testimoni</p>
          <Link href="/admin/testimonials/new">
            <Button>Tambah Testimoni Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {testimonial.photo ? (
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-xl">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      {testimonial.is_featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {testimonial.status === 'published' ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    {(testimonial.position || testimonial.company) && (
                      <p className="text-sm text-gray-600 mb-2">
                        {testimonial.position}
                        {testimonial.position && testimonial.company && ' • '}
                        {testimonial.company}
                      </p>
                    )}
                    {testimonial.course_name && (
                      <p className="text-xs text-primary-600 mb-2">{testimonial.course_name}</p>
                    )}
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 line-clamp-2">{testimonial.testimonial}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            disabled={pagination.current_page === 1}
            onClick={() => {
              // Handle pagination
            }}
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => {
              // Handle pagination
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

