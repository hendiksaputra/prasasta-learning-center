# PRASASTA Learning Center

Website training center untuk pelatihan mekanik alat berat dan operator.

## Tech Stack

### Backend
- **Laravel 11** (PHP) - API & CMS
- **MySQL** - Database
- **Sanctum** - Authentication

### Frontend
- **Next.js 14** (React) - User Interface
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI Components

## Project Structure

```
prasasta/
├── backend/          # Laravel API & CMS
├── frontend/         # Next.js Frontend
├── docs/            # Documentation
└── .cursorrules     # Cursor AI Rules
```

## Features

### Public Features
- Course listing & detail
- Instructor profiles
- Registration & enrollment
- Contact & inquiry

### CMS Features (Admin)
- Course management
- Instructor management
- Student management
- Enrollment management
- Content management
- Analytics dashboard

## Getting Started

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Documentation

- [Architecture](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Decisions](./docs/decisions.md)

