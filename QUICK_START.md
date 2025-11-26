# Quick Start Guide - PRASASTA Learning Center

## ⚠️ PENTING: Jalankan perintah dari folder yang benar!

### Backend (Laravel)
Semua perintah Laravel harus dijalankan dari folder `backend/`

### Frontend (Next.js)  
Semua perintah Next.js harus dijalankan dari folder `frontend/`

---

## Setup Backend (Laravel)

### 1. Masuk ke folder backend
```powershell
cd backend
```

### 2. Install dependencies (jika belum)
```powershell
composer install
```

### 3. Setup environment
```powershell
# Copy file .env.example ke .env
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Konfigurasi database di file .env
Edit file `backend/.env` dan sesuaikan:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prasasta_learning
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Buat database MySQL
```sql
CREATE DATABASE prasasta_learning;
```

### 6. Jalankan migrations dan seeder
```powershell
# Masih di folder backend/
php artisan migrate
php artisan db:seed
```

### 7. Jalankan server
```powershell
# Masih di folder backend/
php artisan serve
```

Backend akan berjalan di: `http://localhost:8000`

---

## Setup Frontend (Next.js)

### 1. Buka terminal baru, masuk ke folder frontend
```powershell
cd frontend
```

### 2. Install dependencies
```powershell
npm install
```

### 3. Setup environment
```powershell
# Copy file .env.example ke .env.local
copy .env.example .env.local
```

File `.env.local` sudah benar, tidak perlu diubah jika backend berjalan di port 8000.

### 4. Jalankan development server
```powershell
npm run dev
```

Frontend akan berjalan di: `http://localhost:3000`

---

## Troubleshooting

### Error: "Could not open input file: artisan"
**Solusi**: Pastikan Anda berada di folder `backend/` sebelum menjalankan perintah `php artisan`

```powershell
# Salah ❌
PS D:\prasasta\prasasta> php artisan key:generate

# Benar ✅
PS D:\prasasta\prasasta\backend> php artisan key:generate
```

### Error: "File .env not found"
**Solusi**: Copy file `.env.example` ke `.env` terlebih dahulu

```powershell
cd backend
copy .env.example .env
```

### Error: Database connection failed
**Solusi**: 
1. Pastikan MySQL service berjalan
2. Pastikan database sudah dibuat
3. Periksa kredensial di file `.env`

---

## Testing

Setelah kedua server berjalan:

1. **Backend API**: http://localhost:8000/api/v1/courses
2. **Frontend**: http://localhost:3000

