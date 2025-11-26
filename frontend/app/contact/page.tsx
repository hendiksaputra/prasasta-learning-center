'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, Phone, MapPin, Send, CheckCircle, Youtube, Instagram } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Ada pertanyaan? Kami siap membantu Anda
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                  <p className="text-gray-600 text-sm">
                    Jl. MT Haryono Ruko Haryono Palace No.25<br />
                    Gn. Bahagia, Kecamatan Balikpapan Selatan<br />
                    Kota Balikpapan, Kalimantan Timur 76125
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telepon / WhatsApp</h3>
                  <a href="https://wa.me/628115995577" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-primary-600">
                    0811-5995-577
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:Prasastaaptatara@gmail.com" className="text-gray-600 text-sm hover:text-primary-600">
                    Prasastaaptatara@gmail.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Youtube className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">YouTube</h3>
                  <a href="https://www.youtube.com/@PrasastaLearningCentre" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-primary-600">
                    Prasasta Learning Centre
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instagram</h3>
                  <a href="https://www.instagram.com/prasasta_learning" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-primary-600">
                    prasasta_learning
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary-50">
              <h3 className="font-semibold text-gray-900 mb-2">Jam Operasional</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Senin - Jumat: 08:00 - 17:00 WIB</p>
                <p>Sabtu: 08:00 - 12:00 WIB</p>
                <p>Minggu: Tutup</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Kirim Pesan</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Pesan Terkirim!</h3>
                  <p className="text-gray-600 mb-4">
                    Terima kasih atas pesan Anda. Kami akan segera menghubungi Anda.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Lengkap"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama Anda"
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="nama@email.com"
                    />
                  </div>

                  <Input
                    label="Nomor Telepon"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 812 3456 7890"
                  />

                  <Input
                    label="Subjek"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subjek pesan Anda"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pesan
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      'Mengirim...'
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5 inline" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

