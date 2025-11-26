import Link from 'next/link';
import { BookOpen, Mail, Phone, Instagram, Youtube, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">PRASASTA Learning Center</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Training center profesional untuk pelatihan mekanik alat berat dan operator dengan instruktur berpengalaman.
            </p>
            <div className="space-y-3">
              <a href="https://www.youtube.com/@PrasastaLearningCentre" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-400 hover:text-white transition">
                <Youtube className="h-5 w-5" />
                <span>Prasasta Learning Centre</span>
              </a>
              <a href="https://www.instagram.com/prasasta_learning" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
                <span>prasasta_learning</span>
              </a>
              <a href="mailto:Prasastaaptatara@gmail.com" className="flex items-center space-x-3 text-gray-400 hover:text-white transition">
                <Mail className="h-5 w-5" />
                <span>Prasastaaptatara@gmail.com</span>
              </a>
              <a href="https://wa.me/628115995577" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-400 hover:text-white transition">
                <Phone className="h-5 w-5" />
                <span>0811-5995-577</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-white transition">
                  Semua Kursus
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-gray-400 hover:text-white transition">
                  Instruktur
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kategori Kursus</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses?category=mekanik" className="text-gray-400 hover:text-white transition">
                  Mekanik Alat Berat
                </Link>
              </li>
              <li>
                <Link href="/courses?category=operator" className="text-gray-400 hover:text-white transition">
                  Operator Alat Berat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Jl. MT Haryono Ruko Haryono Palace No.25<br />
                  Gn. Bahagia, Kecamatan Balikpapan Selatan<br />
                  Kota Balikpapan, Kalimantan Timur 76125
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a href="https://wa.me/628115995577" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  0811-5995-577
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:Prasastaaptatara@gmail.com" className="text-gray-400 hover:text-white transition">
                  Prasastaaptatara@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Youtube className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a href="https://www.youtube.com/@PrasastaLearningCentre" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  Prasasta Learning Centre
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Instagram className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a href="https://www.instagram.com/prasasta_learning" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  prasasta_learning
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PRASASTA Learning Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

