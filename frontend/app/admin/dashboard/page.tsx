'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api-admin';
import Button from '@/components/ui/Button';
import { LogOut, BookOpen, Users, FileText, Image, Building, MessageSquare, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Kursus',
      description: 'Kelola semua kursus',
      icon: BookOpen,
      href: '/admin/courses',
      color: 'bg-blue-500',
    },
    {
      title: 'Kategori',
      description: 'Kelola kategori kursus',
      icon: FileText,
      href: '/admin/categories',
      color: 'bg-green-500',
    },
    {
      title: 'Instruktur',
      description: 'Kelola data instruktur',
      icon: Users,
      href: '/admin/instructors',
      color: 'bg-purple-500',
    },
    {
      title: 'Testimoni',
      description: 'Kelola testimoni',
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'bg-yellow-500',
    },
    {
      title: 'Galeri',
      description: 'Kelola galeri foto',
      icon: Image,
      href: '/admin/gallery',
      color: 'bg-pink-500',
    },
    {
      title: 'Fasilitas',
      description: 'Kelola fasilitas',
      icon: Building,
      href: '/admin/facilities',
      color: 'bg-indigo-500',
    },
    {
      title: 'Pendaftaran',
      description: 'Kelola pendaftaran kursus',
      icon: ClipboardList,
      href: '/admin/enrollments',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Selamat datang, {user?.name || 'Admin'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Menu Admin
          </h2>
          <p className="text-gray-600">
            Pilih menu untuk mengelola konten website
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Informasi
          </h3>
          <p className="text-sm text-blue-800">
            Gunakan menu di atas untuk mengelola konten website. Pastikan untuk logout setelah selesai mengelola website.
          </p>
        </div>
      </main>
    </div>
  );
}

