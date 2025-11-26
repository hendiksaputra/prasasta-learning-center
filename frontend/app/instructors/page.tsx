'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import { User, Mail, Phone, Award, Briefcase } from 'lucide-react';

interface Instructor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  photo?: string;
  years_experience?: number;
  qualifications?: string[];
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/instructors`);
        const data = await response.json();
        setInstructors(data || []);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Instruktur Kami</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Tim instruktur berpengalaman yang siap membimbing Anda menuju kesuksesan
          </p>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="container mx-auto px-4 py-12 flex-1">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Memuat data instruktur...</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Belum ada instruktur tersedia.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} hover className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {instructor.photo ? (
                      <img
                        src={instructor.photo}
                        alt={instructor.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                  {instructor.specialization && (
                    <p className="text-primary-600 font-medium">{instructor.specialization}</p>
                  )}
                </div>

                {instructor.bio && (
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{instructor.bio}</p>
                )}

                <div className="space-y-2 border-t pt-4">
                  {instructor.years_experience && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2 text-primary-600" />
                      {instructor.years_experience} tahun pengalaman
                    </div>
                  )}
                  {instructor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-primary-600" />
                      {instructor.email}
                    </div>
                  )}
                  {instructor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-primary-600" />
                      {instructor.phone}
                    </div>
                  )}
                </div>

                {instructor.qualifications && instructor.qualifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <Award className="h-4 w-4 mr-2 text-primary-600" />
                      <span className="text-sm font-semibold text-gray-700">Kualifikasi</span>
                    </div>
                    <ul className="space-y-1">
                      {instructor.qualifications.map((qual, idx) => (
                        <li key={idx} className="text-sm text-gray-600">• {qual}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

