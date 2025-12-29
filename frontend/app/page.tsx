'use client';

import Link from "next/link";
import Image from "next/image";
import { Users, Award, CheckCircle, ArrowRight, TrendingUp, Clock, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import GallerySection from "@/components/sections/GallerySection";
import FacilitiesSection from "@/components/sections/FacilitiesSection";
import HeroSlider from "@/components/sections/HeroSlider";

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/courses?featured=true&per_page=3`);
        const data = await response.json();
        setFeaturedCourses(data.data || []);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section with Slider */}
      <section className="relative text-white py-24 overflow-hidden min-h-[600px] flex items-center">
        {/* Slider Background */}
        <div className="absolute inset-0">
          <HeroSlider />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg">
              Pelatihan Mekanik Alat Berat & Operator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed drop-shadow-md">
              Tingkatkan keterampilan Anda dengan pelatihan profesional dari instruktur berpengalaman di industri alat berat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="shadow-lg">
                  Lihat Kursus
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 shadow-lg backdrop-blur-sm">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <GallerySection />

      {/* Testimonial Section with Photos */}
      <TestimonialsSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Mengapa Memilih PRASASTA Learning Center?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan pelatihan berkualitas tinggi dengan metode pembelajaran yang efektif
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Instruktur Berpengalaman</h4>
              <p className="text-gray-600">
                Belajar dari instruktur yang telah berpengalaman di industri alat berat
              </p>
            </Card>
            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Kurikulum Terstruktur</h4>
              <p className="text-gray-600">
                Materi pelatihan yang disusun secara sistematis dan mudah dipahami
              </p>
            </Card>
            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Sertifikat Resmi</h4>
              <p className="text-gray-600">
                Dapatkan sertifikat resmi setelah menyelesaikan pelatihan
              </p>
            </Card>
            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Garansi Kualitas</h4>
              <p className="text-gray-600">
                Komitmen kami untuk memberikan pelatihan berkualitas terbaik
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {!loading && featuredCourses.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Kursus Unggulan
              </h2>
              <p className="text-xl text-gray-600">
                Pilih kursus yang sesuai dengan kebutuhan Anda
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {featuredCourses.map((course) => (
                <Card key={course.id} hover className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-75" />
                      <p className="text-sm font-medium">{course.duration_days} Hari</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {course.category?.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {course.short_description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {typeof course.price === 'number' 
                          ? `Rp ${course.price.toLocaleString('id-ID')}` 
                          : `Rp ${parseFloat(course.price || '0').toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    <Link href={`/courses/${course.slug}`} className="block">
                      <Button className="w-full">
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4 inline" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  Lihat Semua Kursus
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Facility Showcase */}
      <FacilitiesSection />

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Siswa Terlatih</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Instruktur Profesional</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-primary-100">Program Kursus</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Siap Memulai Perjalanan Pelatihan Anda?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Daftar sekarang dan dapatkan pelatihan berkualitas tinggi dengan instruktur berpengalaman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Lihat Semua Kursus
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

