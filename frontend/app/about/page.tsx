import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import { Target, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            PRASASTA Learning Center - Komitmen kami untuk memberikan pelatihan berkualitas tinggi
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Visi Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              Menjadi lembaga pelatihan yang professional dan berkualitas guna terwujudnya sumber daya manusia kompeten untuk kemajuan bangsa dan negara.
            </p>
          </Card>

          <Card className="p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Misi Kami</h2>
            <ul className="text-gray-600 space-y-2 leading-relaxed">
              <li>• Menyediakan kurikulum pelatihan yang komprehensif dan terstruktur</li>
              <li>• Menghadirkan instruktur berpengalaman di industri</li>
              <li>• Menyediakan fasilitas praktik yang memadai</li>
              <li>• Memberikan sertifikat kompetensi yang diakui industri</li>
              <li>• Membangun jaringan dengan perusahaan untuk penempatan kerja</li>
            </ul>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Nilai-Nilai Kami</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kualitas</h3>
              <p className="text-gray-600 text-sm">
                Kami berkomitmen memberikan pelatihan dengan standar kualitas tertinggi
              </p>
            </Card>

            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integritas</h3>
              <p className="text-gray-600 text-sm">
                Transparansi dan kejujuran dalam setiap proses pembelajaran
              </p>
            </Card>

            <Card hover className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inovasi</h3>
              <p className="text-gray-600 text-sm">
                Terus mengembangkan metode pembelajaran yang efektif dan modern
              </p>
            </Card>
          </div>
        </div>

        {/* History */}
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Sejarah Kami</h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed">
            <p className="mb-4">
              PRASASTA Learning Center didirikan dengan visi untuk meningkatkan kualitas tenaga kerja 
              di bidang mekanik alat berat dan operator di Indonesia. Sejak awal, kami fokus pada 
              penyediaan pelatihan yang tidak hanya mengajarkan teori, tetapi juga memberikan pengalaman 
              praktik langsung dengan peralatan yang digunakan di industri.
            </p>
            <p className="mb-4">
              Dengan dukungan instruktur berpengalaman dan fasilitas yang terus diperbarui, kami telah 
              melatih ratusan siswa yang kini bekerja di berbagai perusahaan konstruksi dan pertambangan 
              terkemuka di Indonesia.
            </p>
            <p>
              Komitmen kami adalah terus berkembang dan beradaptasi dengan kebutuhan industri, 
              memastikan setiap lulusan kami siap menghadapi tantangan di dunia kerja.
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

