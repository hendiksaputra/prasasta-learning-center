'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Users, ArrowRight, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Course {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  price: number;
  duration_days: number;
  total_hours: number;
  category: {
    name: string;
  };
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/courses`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCourses(data.data || []);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Gagal memuat data kursus');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Memuat kursus...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Belum ada kursus tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <Card key={course.id} hover className="overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-white opacity-50" />
          </div>
          <div className="p-6">
            <div className="mb-2">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                {course.category.name}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
              {course.short_description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration_days} hari
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.total_hours} jam
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary-600">
                Rp {course.price.toLocaleString('id-ID')}
              </span>
              <Link href={`/courses/${course.slug}`}>
                <Button size="sm">
                  Detail
                  <ArrowRight className="h-4 w-4 ml-2 inline" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

