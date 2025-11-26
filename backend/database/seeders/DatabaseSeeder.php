<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Instructor;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Categories
        $mekanikCategory = CourseCategory::create([
            'name' => 'Mekanik Alat Berat',
            'slug' => 'mekanik-alat-berat',
            'description' => 'Pelatihan untuk menjadi mekanik alat berat profesional',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $operatorCategory = CourseCategory::create([
            'name' => 'Operator Alat Berat',
            'slug' => 'operator-alat-berat',
            'description' => 'Pelatihan untuk menjadi operator alat berat yang kompeten',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Create Instructors
        $instructor1 = Instructor::create([
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@prasasta.com',
            'phone' => '081234567890',
            'bio' => 'Instruktur berpengalaman dengan 15+ tahun di industri alat berat',
            'specialization' => 'Mekanik Excavator, Bulldozer, dan Wheel Loader',
            'years_experience' => 15,
            'qualifications' => ['Sertifikasi Kompetensi Mekanik', 'Sertifikasi Trainer'],
            'is_active' => true,
        ]);

        $instructor2 = Instructor::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@prasasta.com',
            'phone' => '081234567891',
            'bio' => 'Instruktur operator dengan pengalaman luas di berbagai proyek konstruksi',
            'specialization' => 'Operator Excavator, Crane, dan Forklift',
            'years_experience' => 12,
            'qualifications' => ['Sertifikasi Operator Excavator', 'Sertifikasi Operator Crane'],
            'is_active' => true,
        ]);

        // Create Courses
        $course1 = Course::create([
            'category_id' => $mekanikCategory->id,
            'title' => 'Pelatihan Mekanik Alat Berat Dasar',
            'slug' => 'pelatihan-mekanik-alat-berat-dasar',
            'description' => 'Pelatihan komprehensif untuk menjadi mekanik alat berat profesional. Mencakup teori dan praktik langsung.',
            'short_description' => 'Pelatihan dasar untuk menjadi mekanik alat berat profesional',
            'price' => 5000000,
            'duration_days' => 10,
            'total_hours' => 80,
            'max_students' => 20,
            'min_students' => 5,
            'level' => 'beginner',
            'status' => 'published',
            'is_featured' => true,
            'learning_objectives' => 'Memahami sistem kerja alat berat, mampu melakukan troubleshooting, dan melakukan perawatan rutin',
            'prerequisites' => 'Minimal SMA/SMK, memiliki minat di bidang teknik',
            'what_you_will_learn' => 'Sistem hidrolik, sistem engine, sistem transmisi, troubleshooting, dan perawatan preventif',
        ]);

        $course2 = Course::create([
            'category_id' => $operatorCategory->id,
            'title' => 'Pelatihan Operator Excavator',
            'slug' => 'pelatihan-operator-excavator',
            'description' => 'Pelatihan operator excavator dengan sertifikasi resmi. Materi mencakup teori dan praktik lapangan.',
            'short_description' => 'Pelatihan operator excavator dengan sertifikasi resmi',
            'price' => 3500000,
            'duration_days' => 7,
            'total_hours' => 56,
            'max_students' => 15,
            'min_students' => 5,
            'level' => 'intermediate',
            'status' => 'published',
            'is_featured' => true,
            'learning_objectives' => 'Mampu mengoperasikan excavator dengan aman dan efisien',
            'prerequisites' => 'Minimal SMA/SMK, memiliki SIM C',
            'what_you_will_learn' => 'Pengoperasian excavator, safety procedures, teknik penggalian, dan perawatan alat',
        ]);

        // Attach instructors to courses
        $course1->instructors()->attach($instructor1->id, ['is_primary' => true]);
        $course2->instructors()->attach($instructor2->id, ['is_primary' => true]);
    }
}

