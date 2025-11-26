'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function FacilitiesSection() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/facilities`);
        const data = await response.json();
        
        // Get published facilities
        const publishedFacilities = data.data || [];
        
        // Ensure image URLs are absolute
        const facilitiesWithAbsoluteUrls = publishedFacilities.map((facility: any) => ({
          ...facility,
          image_url: facility.image_url && !facility.image_url.startsWith('http') 
            ? `http://localhost:8000${facility.image_url.startsWith('/') ? '' : '/'}${facility.image_url}`
            : facility.image_url
        }));
        
        setFacilities(facilitiesWithAbsoluteUrls);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        // Fallback to empty array if API fails
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Fallback facilities jika belum ada data dari database
  const fallbackFacilities = [
    {
      id: 1,
      title: 'Workshop Modern',
      description: 'Workshop dengan peralatan lengkap dan terkini untuk praktik langsung',
      image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    },
    {
      id: 2,
      title: 'Ruang Kelas Nyaman',
      description: 'Ruang kelas ber-AC dengan fasilitas multimedia untuk pembelajaran teori',
      image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    },
  ];

  // Use facilities from API if available, otherwise use fallback
  const displayFacilities = facilities.length > 0 ? facilities : fallbackFacilities;

  if (loading && facilities.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Fasilitas Pelatihan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fasilitas lengkap untuk mendukung proses pembelajaran yang optimal
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Memuat fasilitas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Fasilitas Pelatihan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fasilitas lengkap untuk mendukung proses pembelajaran yang optimal
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {displayFacilities.slice(0, 6).map((facility) => (
            <div key={facility.id} className="relative group overflow-hidden rounded-lg shadow-lg h-96">
              <Image
                src={facility.image_url}
                alt={facility.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{facility.title}</h3>
                  {facility.description && (
                    <p className="text-white/90">
                      {facility.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

