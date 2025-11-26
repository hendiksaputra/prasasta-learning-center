'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/testimonials`);
        const data = await response.json();
        // Get all published testimonials (prioritize featured)
        const allTestimonials = data.data || [];
        const featured = allTestimonials.filter((t: any) => t.is_featured);
        const others = allTestimonials.filter((t: any) => !t.is_featured);
        const sorted = [...featured, ...others];
        
        // Ensure photo URLs are absolute
        const testimonialsWithAbsoluteUrls = sorted.map((t: any) => ({
          ...t,
          photo: t.photo && !t.photo.startsWith('http') 
            ? `http://localhost:8000${t.photo.startsWith('/') ? '' : '/'}${t.photo}`
            : t.photo
        }));
        setTestimonials(testimonialsWithAbsoluteUrls);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Set items per view based on screen size
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, testimonials.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, itemsPerView]);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(maxIndex, Math.max(0, index)));
  };

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);
  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Testimoni Alumni
          </h2>
          <p className="text-xl text-gray-600">
            Apa kata mereka tentang pelatihan di PRASASTA Learning Center
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  goToPrevious();
                }}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                  currentIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary-50 hover:scale-110'
                }`}
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-6 w-6 text-primary-600" />
              </button>
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  goToNext();
                }}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                  currentIndex >= maxIndex
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary-50 hover:scale-110'
                }`}
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-6 w-6 text-primary-600" />
              </button>
            </>
          )}

          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    minWidth: `${100 / itemsPerView}%`,
                  }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-center mb-4">
                      {testimonial.photo ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gray-200">
                          <img
                            src={testimonial.photo}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            style={{ minWidth: '64px', minHeight: '64px' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-initial')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full bg-primary-100 flex items-center justify-center fallback-initial';
                                fallback.innerHTML = `<span class="text-primary-600 font-semibold text-xl">${testimonial.name.charAt(0).toUpperCase()}</span>`;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-primary-600 font-semibold text-xl">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.position || 'Alumni'}
                          {testimonial.course_name && ` • ${testimonial.course_name}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic mb-4">
                      "{testimonial.testimonial}"
                    </p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {testimonials.length > itemsPerView && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => {
                const slideStart = index * itemsPerView;
                const isActive = currentIndex >= slideStart && currentIndex < slideStart + itemsPerView;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      goToSlide(slideStart);
                    }}
                    className={`transition-all rounded-full ${
                      isActive
                        ? 'w-8 h-2 bg-primary-600'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                );
              })}
            </div>
          )}

          {/* Slide Counter */}
          {testimonials.length > itemsPerView && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Menampilkan {Math.min(currentIndex + itemsPerView, testimonials.length)} dari {testimonials.length} testimoni
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

