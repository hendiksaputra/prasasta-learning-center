# Setup Guide - PRASASTA Learning Center

Panduan lengkap untuk setup dan menjalankan aplikasi PRASASTA Learning Center.

## Prerequisites

- PHP 8.2 atau lebih tinggi
- Composer
- Node.js 18+ dan npm
- MySQL 8.0+
- Git

## Backend Setup (Laravel)

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Environment Configuration

```bash
cp .env.example .env

```

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prasasta_learning
DB_USERNAME=root
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### 3. Database Setup

```bash
# Buat database
mysql -u root -p
CREATE DATABASE prasasta_learning;

# Jalankan migrations
php artisan migrate

# Seed database dengan data contoh
php artisan db:seed
```

### 4. Storage Link

```bash
php artisan storage:link
```

### 5. Run Development Server

```bash
php artisan serve
```

Backend API akan berjalan di `http://localhost:8000`

## Frontend Setup (Next.js)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Edit file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Testing API

### Public Endpoints

```bash
# Get all courses
curl http://localhost:8000/api/v1/courses

# Get course by slug
curl http://localhost:8000/api/v1/courses/pelatihan-mekanik-alat-berat-dasar

# Get categories
curl http://localhost:8000/api/v1/categories

# Get instructors
curl http://localhost:8000/api/v1/instructors
```

## CMS Admin Panel

CMS Admin Panel dapat diakses melalui API endpoints yang memerlukan authentication. Untuk implementasi lengkap, perlu dibuat:

1. Admin authentication system
2. Admin dashboard UI (Next.js)
3. CRUD interfaces untuk:
   - Courses
   - Instructors
   - Students
   - Enrollments
   - Categories

## Struktur Folder

```
prasasta/
├── backend/              # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/        # Public API Controllers
│   │   │   │   └── Admin/      # Admin CMS Controllers
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── frontend/            # Next.js Frontend
│   ├── app/            # Next.js App Router
│   ├── components/     # React Components
│   └── lib/           # Utilities & API Client
└── docs/              # Documentation
```

## Troubleshooting

### CORS Issues

Pastikan konfigurasi CORS di `backend/config/cors.php` sudah benar dan `FRONTEND_URL` di `.env` sesuai.

### Database Connection Error

Pastikan:
- MySQL service berjalan
- Database sudah dibuat
- Kredensial di `.env` benar

### API Not Found

Pastikan route sudah terdaftar di `backend/routes/api.php` dan server Laravel berjalan.

## Next Steps

1. Implementasi authentication (Sanctum)
2. Build CMS Admin Dashboard
3. Implementasi file upload untuk course images
4. Setup email notifications
5. Implementasi certificate generation
6. Deploy ke production

