'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { instructorsApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Search, Mail, Phone } from 'lucide-react';

interface Instructor {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  photo_url?: string;
  courses_count?: number;
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await instructorsApi.list();
      setInstructors(response.data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus instruktur "${name}"?`)) {
      return;
    }

    try {
      await instructorsApi.delete(id);
      alert('Instruktur berhasil dihapus');
      fetchInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
      alert('Gagal menghapus instruktur');
    }
  };

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Instruktur</h1>
          <p className="text-gray-600 mt-1">Kelola data instruktur</p>
        </div>
        <Link href="/admin/instructors/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Instruktur
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari instruktur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">Tidak ada instruktur ditemukan</p>
            <Link href="/admin/instructors/create">
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Instruktur Pertama
              </Button>
            </Link>
          </div>
        ) : (
          filteredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {instructor.photo_url ? (
                    <img
                      src={instructor.photo_url}
                      alt={instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {instructor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {instructor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{instructor.title}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {instructor.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{instructor.email}</span>
                  </div>
                )}
                {instructor.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{instructor.phone}</span>
                  </div>
                )}
              </div>

              {instructor.bio && (
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {instructor.bio}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {instructor.courses_count || 0} kursus
                </span>
                <div className="flex space-x-2">
                  <Link href={`/admin/instructors/${instructor.id}/edit`}>
                    <button
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(instructor.id, instructor.name)}
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
