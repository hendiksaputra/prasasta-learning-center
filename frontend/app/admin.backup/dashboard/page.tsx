'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, Users, FileText, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import { coursesApi, enrollmentsApi, instructorsApi } from '@/lib/api-admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    courses: 0,
    instructors: 0,
    enrollments: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, enrollmentsRes, instructorsRes] = await Promise.all([
          coursesApi.list({ per_page: 1 }),
          enrollmentsApi.list({ per_page: 1 }),
          instructorsApi.list({ per_page: 1 }),
        ]);

        setStats({
          courses: coursesRes.total || 0,
          instructors: instructorsRes.total || 0,
          enrollments: enrollmentsRes.total || 0,
          students: enrollmentsRes.total || 0, // Approximate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Kursus',
      value: stats.courses,
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Instruktur',
      value: stats.instructors,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Pendaftaran',
      value: stats.enrollments,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Siswa',
      value: stats.students,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/courses/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-center"
          >
            <GraduationCap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Tambah Kursus Baru</p>
          </a>
          <a
            href="/admin/instructors/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-center"
          >
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Tambah Instruktur</p>
          </a>
          <a
            href="/admin/enrollments"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-center"
          >
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Lihat Pendaftaran</p>
          </a>
        </div>
      </Card>
    </div>
  );
}

