import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseDetail from "./CourseDetail";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CourseDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <CourseDetail slug={params.slug} />
      <Footer />
    </div>
  );
}

