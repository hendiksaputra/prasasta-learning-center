'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Users, ArrowLeft, BookOpen, CheckCircle, Award, Briefcase, Gift, FileText, Calendar } from 'lucide-react';
import { Course } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EnrollmentModal from '@/components/modals/EnrollmentModal';

interface CourseDetailProps {
  slug: string;
}

export default function CourseDetail({ slug }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
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
          <p className="text-xl text-primary-100">{course.short_description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Deskripsi Kursus</h2>
              <div className="prose max-w-none whitespace-pre-wrap">{course.description}</div>
            </div>

            {course.what_you_will_learn && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Apa yang Akan Anda Pelajari</h2>
                <div className="prose max-w-none whitespace-pre-wrap">{course.what_you_will_learn}</div>
              </div>
            )}

            {course.learning_objectives && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Tujuan Pembelajaran</h2>
                <div className="prose max-w-none whitespace-pre-wrap">{course.learning_objectives}</div>
              </div>
            )}

            {course.prerequisites && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Prasyarat</h2>
                <div className="prose max-w-none whitespace-pre-wrap">{course.prerequisites}</div>
              </div>
            )}

            {/* Daftar Materi */}
            {course.course_materials && course.course_materials.length > 0 && (
              <Card className="p-6 mb-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-2xl font-bold">Daftar Materi</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.course_materials.map((materi, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{materi}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Persyaratan */}
            {course.requirements && course.requirements.length > 0 && (
              <Card className="p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-2xl font-bold">Persyaratan</h2>
                </div>
                <div className="space-y-3">
                  {course.requirements.map((syarat, index) => (
                    <div key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{syarat}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Informasi Magang */}
            {course.internship_opportunity && (
              <Card className="p-6 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <div className="flex items-start">
                  <Briefcase className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Kesempatan Magang di Perusahaan Rekanan
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{course.internship_opportunity}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Fasilitas & Inclusions */}
            {(course.facilities && course.facilities.length > 0) || course.training_method && (
              <Card className="p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Gift className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-2xl font-bold">Fasilitas & Yang Termasuk</h2>
                </div>
                {course.facilities && course.facilities.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {course.facilities.map((facility, index) => {
                      const iconMap: { [key: string]: any } = {
                        'Handbook': BookOpen,
                        'Seragam': Users,
                        'APD': Users,
                        'Fasilitas': Briefcase,
                        'Workshop': Briefcase,
                        'Snack': Gift,
                      };
                      const Icon = Object.keys(iconMap).find(key => facility.includes(key)) 
                        ? iconMap[Object.keys(iconMap).find(key => facility.includes(key))!] 
                        : Gift;
                      return (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Icon className="h-5 w-5 text-primary-600 mr-3" />
                          <span className="text-gray-700 font-medium">{facility}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {course.training_method && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-gray-700 font-medium">{course.training_method}</span>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Sertifikasi */}
            {course.certification_info && (
              <Card className="p-6 mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-yellow-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Sertifikasi</h2>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {course.certification_info}
                  </p>
                  {course.certification_price && (
                    <p className="text-3xl font-bold text-primary-600 mb-2">
                      Rp {course.certification_price.toLocaleString('id-ID')}
                    </p>
                  )}
                  {course.registration_deadline && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Pendaftaran sampai dengan {new Date(course.registration_deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                {course.certification_price ? (
                  <>
                    <div className="mb-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      {course.certification_info && (
                        <p className="text-xs font-semibold text-yellow-800 mb-1">{course.certification_info.toUpperCase()}</p>
                      )}
                      <div className="text-3xl font-bold text-primary-600">
                        Rp {course.certification_price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    {course.limited_quota && (
                      <div className="mb-4 text-xs text-red-600 font-semibold">
                        ⚠ LIMITED TIME ONLY - KUOTA TERBATAS
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    Rp {course.price.toLocaleString('id-ID')}
                  </div>
                )}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setShowEnrollmentModal(true)}
                >
                  Daftar Sekarang
                </Button>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold">Durasi</div>
                    <div className="text-gray-600">{course.duration_days} hari ({course.total_hours} jam)</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold">Level</div>
                    <div className="text-gray-600 capitalize">{course.level}</div>
                  </div>
                </div>

                {course.instructors && course.instructors.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="font-semibold mb-2">Instruktur</div>
                    {course.instructors.map((instructor) => (
                      <div key={instructor.id} className="text-gray-600">
                        {instructor.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Link Pendaftaran */}
                {course.registration_link && (
                  <div className="border-t pt-4 mt-4">
                    <div className="font-semibold mb-2">Link Pendaftaran</div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <a
                        href={course.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-all font-medium"
                      >
                        {course.registration_link}
                      </a>
                    </div>
                    {course.registration_deadline && (
                      <div className="mt-3 text-xs text-gray-600">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Pendaftaran sampai dengan {new Date(course.registration_deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {course && (
        <EnrollmentModal
          courseId={course.id}
          courseTitle={course.title}
          coursePrice={course.price}
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
        />
      )}
    </>
  );
}

