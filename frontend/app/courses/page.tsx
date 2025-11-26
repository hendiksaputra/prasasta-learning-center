import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CoursesList from "./CoursesList";

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Semua Kursus</h2>
          <p className="text-xl text-primary-100">
            Pilih kursus yang sesuai dengan kebutuhan Anda
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <CoursesList />
      </div>
      
      <Footer />
    </div>
  );
}

