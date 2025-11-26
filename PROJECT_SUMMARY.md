# PRASASTA Learning Center - Project Summary

## Overview

Website training center untuk pelatihan mekanik alat berat dan operator dengan arsitektur modern menggunakan kombinasi Laravel (Backend) dan Next.js (Frontend).

## Tech Stack

### Backend
- **Laravel 11** - PHP Framework untuk API & CMS
- **MySQL** - Database
- **Laravel Sanctum** - Authentication (ready untuk implementasi)

### Frontend
- **Next.js 14** - React Framework dengan App Router
- **TypeScript** - Type Safety
- **Tailwind CSS** - Utility-first CSS Framework
- **Axios** - HTTP Client untuk API calls

## Fitur yang Sudah Diimplementasi

### ✅ Backend (Laravel)

1. **Database Schema**
   - Course Categories
   - Courses (dengan soft deletes)
   - Instructors
   - Students
   - Enrollments
   - Lessons
   - Materials
   - Certificates

2. **Public API Endpoints**
   - Course listing dengan filter (category, level, search, featured)
   - Course detail by slug
   - Category listing
   - Instructor listing
   - Enrollment registration

3. **Admin CMS API Endpoints**
   - CRUD Courses
   - CRUD Instructors
   - Enrollment management
   - (Ready untuk authentication)

4. **Models & Relationships**
   - Eloquent models dengan relationships lengkap
   - Scopes untuk filtering (published, featured)
   - Soft deletes untuk courses

5. **Database Seeder**
   - Sample data untuk testing
   - Categories, Instructors, Courses dengan relationships

### ✅ Frontend (Next.js)

1. **Pages**
   - Homepage dengan hero section dan features
   - Course listing page
   - Course detail page (dynamic route)
   - Responsive design

2. **Components & Layout**
   - Header dengan navigation
   - Footer
   - Course cards
   - Responsive grid layouts

3. **API Integration**
   - API client setup (axios)
   - TypeScript interfaces untuk type safety
   - Ready untuk integration dengan backend

4. **Styling**
   - Tailwind CSS configuration
   - Custom color scheme (primary colors)
   - Responsive utilities

## Struktur Project

```
prasasta/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── Api/       # Public API Controllers
│   │   │       └── Admin/    # CMS Admin Controllers
│   │   └── Models/           # Eloquent Models
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/          # Database seeders
│   └── routes/
│       └── api.php           # API routes
│
├── frontend/                  # Next.js Frontend
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx         # Homepage
│   │   ├── courses/         # Course pages
│   │   └── layout.tsx        # Root layout
│   └── lib/
│       └── api.ts           # API client
│
└── docs/                     # Documentation
    ├── architecture.md      # Architecture documentation
    ├── decisions.md         # Architecture decisions
    ├── todo.md             # Task tracking
    └── backlog.md          # Future features
```

## Fitur yang Masih Perlu Dikembangkan

### 🔄 Priority High

1. **Authentication System**
   - Laravel Sanctum setup
   - Login/Register untuk students
   - Admin authentication
   - Protected routes

2. **CMS Admin Dashboard**
   - Admin UI dengan Next.js
   - Course management interface
   - Instructor management
   - Enrollment management
   - Dashboard analytics

3. **File Upload**
   - Course images
   - Instructor photos
   - Course materials
   - Certificate templates

4. **Email Notifications**
   - Enrollment confirmation
   - Course reminders
   - Certificate issuance

### 🔄 Priority Medium

5. **Student Dashboard**
   - My enrollments
   - Course progress
   - Certificate downloads
   - Profile management

6. **Course Content**
   - Lesson pages
   - Material downloads
   - Video integration
   - Progress tracking

7. **Payment Integration**
   - Payment gateway (Midtrans/Stripe)
   - Payment status tracking
   - Invoice generation

### 🔄 Priority Low

8. **Advanced Features**
   - Quiz/Assessment system
   - Discussion forum
   - Live chat support
   - Multi-language support
   - Mobile app

## Cara Menjalankan

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Lihat `SETUP.md` untuk panduan lengkap.

## API Documentation

### Public Endpoints

**Get Courses**
```
GET /api/v1/courses?category_id=1&level=beginner&search=excavator&featured=true
```

**Get Course Detail**
```
GET /api/v1/courses/pelatihan-mekanik-alat-berat-dasar
```

**Create Enrollment**
```
POST /api/v1/enrollments
{
  "course_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jakarta"
}
```

### Admin Endpoints (Requires Auth)

**Create Course**
```
POST /api/v1/admin/courses
Authorization: Bearer {token}
{
  "category_id": 1,
  "title": "New Course",
  "description": "...",
  "price": 5000000,
  ...
}
```

## Database Schema Highlights

- **Courses**: Support untuk draft/published status, featured courses, multiple instructors
- **Enrollments**: Track status (pending, confirmed, in_progress, completed)
- **Lessons**: Support untuk preview lessons, video URLs, materials
- **Certificates**: Unique certificate numbers, expiry dates, file storage

## Next Steps

1. Setup authentication (Sanctum)
2. Build CMS Admin Dashboard UI
3. Implement file upload functionality
4. Add email notifications
5. Create student dashboard
6. Deploy to production

## Notes

- Backend API sudah siap digunakan
- Frontend sudah terintegrasi dengan API client
- Database schema sudah lengkap dengan relationships
- CMS endpoints sudah tersedia, tinggal perlu UI
- Authentication system perlu diimplementasi untuk admin access

