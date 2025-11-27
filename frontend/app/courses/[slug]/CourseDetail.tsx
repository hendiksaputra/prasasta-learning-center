'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Users, ArrowLeft, BookOpen, CheckCircle, Award, Briefcase, Gift, FileText, Calendar, User, Heart, Shield, Camera, AlertCircle } from 'lucide-react';
import { Course } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';


interface CourseDetailProps {
  slug: string;
}

export default function CourseDetail({ slug }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/courses/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Kursus tidak ditemukan');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Gagal memuat data kursus');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data kursus...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Kursus tidak ditemukan'}</h2>
          <Link href="/courses" className="text-primary-600 hover:underline">
            Kembali ke daftar kursus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Beranda
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/courses" className="text-gray-500 hover:text-primary-600">
              Kursus
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/courses" className="inline-flex items-center text-primary-100 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Kursus
          </Link>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          {course.short_description && (
            <p className="text-xl text-primary-100">{course.short_description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Deskripsi */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Deskripsi Kursus</h2>
              <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                {course.description}
              </div>
            </Card>

            {/* Daftar Materi */}
            {course.course_materials && course.course_materials.length > 0 && (
              <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 p-3 rounded-lg mr-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">DAFTAR MATERI</h2>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.course_materials.map((materi, index) => (
                      <div key={index} className="flex items-start group">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{materi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Apa yang Akan Dipelajari */}
            {course.what_you_will_learn && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                  Apa yang Akan Anda Pelajari
                </h2>
                <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                  {course.what_you_will_learn}
                </div>
              </Card>
            )}

            {/* Tujuan Pembelajaran */}
            {course.learning_objectives && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Tujuan Pembelajaran
                </h2>
                <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                  {course.learning_objectives}
                </div>
              </Card>
            )}

            {/* Persyaratan */}
            {course.requirements && course.requirements.length > 0 && (
              <Card className="p-6 mb-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-600 p-3 rounded-lg mr-3">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">PERSYARATAN</h2>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    {course.requirements.map((syarat, index) => (
                      <div key={index} className="flex items-start group">
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-4 shadow-md">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 pt-1 text-lg group-hover:text-primary-600 transition-colors">{syarat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Dokumen Tambahan yang Diperlukan */}
            {course.prerequisites && (
              <Card className="p-6 mb-6 border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Dokumen & Persyaratan Tambahan
                    </h3>
                    <div className="space-y-2">
                      {course.prerequisites.split('\n').map((item, idx) => (
                        item.trim() && (
                          <div key={idx} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            <span>{item.trim()}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Fasilitas & Yang Didapatkan */}
            {course.facilities && course.facilities.length > 0 && (
              <Card className="p-6 mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex items-center mb-6">
                  <div className="bg-green-600 p-3 rounded-lg mr-3">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">BERKESEMPATAN MAGANG</h2>
                    <p className="text-gray-600 font-semibold">di Perusahaan Rekanan</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Informasi Magang */}
            {course.internship_opportunity && (
              <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                <div className="flex items-start">
                  <Briefcase className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Kesempatan Magang
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{course.internship_opportunity}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Metode Pelatihan */}
            {course.training_method && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                  Metode Pelatihan
                </h2>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-gray-700 text-lg">{course.training_method}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 border-2 border-yellow-300">
              {/* Biaya dengan Badge */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 transform rotate-12 translate-x-2 -translate-y-1">
                  KUOTA TERBATAS
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-semibold mb-2">Biaya dengan</p>
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-6 w-6 text-white mr-2" />
                    <span className="text-white font-bold text-lg">SERTIFIKASI BNSP</span>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {formatPrice(course.price)}
                  </p>
                  {course.certification_price && course.certification_price !== course.price && (
                    <p className="text-sm text-white/90">
                      (Sudah termasuk sertifikasi)
                    </p>
                  )}
                </div>
              </div>

              {/* Course Details */}
              <div className="space-y-4 mb-6">
                {course.duration_days > 0 && (
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">{course.duration_days} Hari</span>
                      {course.total_hours > 0 && (
                        <span className="text-gray-600"> ({course.total_hours} Jam)</span>
                      )}
                    </div>
                  </div>
                )}

                {course.max_students && (
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                    <span>
                      <span className="font-semibold">Maksimal {course.max_students} Peserta</span>
                    </span>
                  </div>
                )}

                {course.category && (
                  <div className="flex items-center text-gray-700">
                    <BookOpen className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="font-semibold">{course.category.name}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-700">
                  <Award className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                  <span className="font-semibold capitalize">{course.level}</span>
                </div>
              </div>

              {/* Sertifikasi Info */}
              {course.certification_info && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 mb-6 border-2 border-yellow-300">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Sertifikasi</p>
                      <p className="text-sm text-gray-700">{course.certification_info}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Deadline */}
              {course.registration_deadline && (
                <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Pendaftaran Sampai Dengan</p>
                      <p className="text-lg font-bold text-red-600">
                        {new Date(course.registration_deadline).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {course.registration_link ? (
                <a 
                  href={course.registration_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                    LINK PENDAFTARAN
                  </Button>
                </a>
              ) : (
                <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 text-lg">
                  Daftar Sekarang
                </Button>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-2">Ada pertanyaan?</p>
                <a 
                  href="https://wa.me/6281159955577" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Hubungi Kami: 0811-5995-577
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
