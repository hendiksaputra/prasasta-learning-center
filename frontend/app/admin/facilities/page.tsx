'use client';

import { useState, useEffect } from 'react';
import { facilitiesApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilitiesApi.list();
      setFacilities(response.data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFacility) {
        await facilitiesApi.update(editingFacility.id, formData);
        alert('Fasilitas berhasil diupdate');
      } else {
        await facilitiesApi.create(formData);
        alert('Fasilitas berhasil ditambahkan');
      }
      setShowModal(false);
      setEditingFacility(null);
      setFormData({ name: '', description: '', icon: '' });
      fetchFacilities();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Gagal menyimpan fasilitas');
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      description: facility.description,
      icon: facility.icon,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus fasilitas "${name}"?`)) {
      return;
    }

    try {
      await facilitiesApi.delete(id);
      alert('Fasilitas berhasil dihapus');
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Gagal menghapus fasilitas');
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Common icons for facilities
  const iconOptions = [
    '📚', '💻', '🎓', '🏫', '📖', '✏️', '🖥️', '📱', '🎯', '🏆',
    '⚡', '🌟', '🔬', '🎨', '🎭', '🎪', '🎬', '📷', '🎵', '🎸'
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Fasilitas</h1>
          <p className="text-gray-600 mt-1">Kelola fasilitas yang tersedia</p>
        </div>
        <Button
          onClick={() => {
            setEditingFacility(null);
            setFormData({ name: '', description: '', icon: '' });
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Fasilitas
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      {filteredFacilities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">Tidak ada fasilitas ditemukan</p>
          <Button
            onClick={() => {
              setEditingFacility(null);
              setFormData({ name: '', description: '', icon: '' });
              setShowModal(true);
            }}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Fasilitas Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{facility.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {facility.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(facility)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(facility.id, facility.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Fasilitas *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji) *
                </label>
                <div className="grid grid-cols-10 gap-2 mb-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded hover:bg-gray-100 ${
                        formData.icon === icon ? 'bg-primary-100' : ''
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  required
                  placeholder="Atau ketik emoji manual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingFacility(null);
                    setFormData({ name: '', description: '', icon: '' });
                  }}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingFacility ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
