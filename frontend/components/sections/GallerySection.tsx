'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function GallerySection() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/gallery`);
        const data = await response.json();
        
        // Get up to 6 images (or all if less than 6)
        const galleryImages = data.data || [];
        
        // Ensure image URLs are absolute
        const imagesWithAbsoluteUrls = galleryImages.map((img: any) => ({
          ...img,
          image_url: img.image_url && !img.image_url.startsWith('http') 
            ? `http://localhost:8000${img.image_url.startsWith('/') ? '' : '/'}${img.image_url}`
            : img.image_url
        }));
        
        setImages(imagesWithAbsoluteUrls);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        // Fallback to empty array if API fails
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Fallback images jika belum ada data dari database
  const fallbackImages = [
    {
      id: 1,
      title: 'Pelatihan Praktik Lapangan',
      description: 'Siswa belajar langsung dengan peralatan nyata',
      image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    },
    {
      id: 2,
      title: 'Pelatihan Operator',
      description: 'Mengoperasikan excavator dengan teknik yang benar',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    },
    {
      id: 3,
      title: 'Sesi Teori',
      description: 'Pembelajaran teori dengan instruktur berpengalaman',
      image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    },
    {
      id: 4,
      title: 'Perawatan Alat Berat',
      description: 'Belajar teknik perawatan dan troubleshooting',
      image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    },
    {
      id: 5,
      title: 'Sertifikat Kompetensi',
      description: 'Penyerahan sertifikat setelah menyelesaikan pelatihan',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    },
    {
      id: 6,
      title: 'Pelatihan Kelompok',
      description: 'Belajar bersama dalam kelompok kecil',
      image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    },
  ];

  const displayImages = images.length > 0 ? images.slice(0, 6) : fallbackImages;

  if (loading) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Galeri Kegiatan Pelatihan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lihat momen-momen pelatihan dan aktivitas di PRASASTA Learning Center
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {displayImages.map((image) => (
            <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg h-64">
              <img
                src={image.image_url}
                alt={image.title || 'Gallery Image'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-lg">{image.title || 'Galeri Foto'}</h3>
                  {image.description && (
                    <p className="text-sm text-white/90">{image.description}</p>
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

