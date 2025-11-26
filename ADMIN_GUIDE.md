# Panduan Admin PRASASTA Learning Center

## Cara Mengelola Website Melalui Backend

### 1. Login ke Admin Panel

1. Buka browser dan akses: `http://localhost:3000/admin/login`
2. Login dengan kredensial:
   - **Email**: `admin@prasasta.com`
   - **Password**: `admin123`

### 2. Menu Admin Panel

Setelah login, Anda akan melihat dashboard dengan menu:

- **Dashboard** - Ringkasan statistik website
- **Kursus** - Kelola semua kursus (tambah, edit, hapus)
- **Instruktur** - Kelola data instruktur
- **Pendaftaran** - Lihat dan kelola pendaftaran siswa

### 3. Mengelola Kursus

#### Menambah Kursus Baru

1. Klik menu **Kursus** di sidebar
2. Klik tombol **Tambah Kursus**
3. Isi form:
   - Kategori kursus
   - Judul kursus
   - Deskripsi lengkap
   - Deskripsi singkat
   - Harga
   - Durasi (hari dan jam)
   - Level (Beginner/Intermediate/Advanced)
   - Status (Draft/Published/Archived)
   - Instruktur yang mengajar
4. Klik **Simpan**

#### Mengedit Kursus

1. Di halaman **Kursus**, klik ikon **Edit** pada kursus yang ingin diedit
2. Ubah data yang diperlukan
3. Klik **Simpan**

#### Menghapus Kursus

1. Di halaman **Kursus**, klik ikon **Hapus** (trash)
2. Konfirmasi penghapusan

#### Filter & Pencarian

- Gunakan kotak pencarian untuk mencari kursus berdasarkan judul
- Gunakan filter status untuk melihat kursus berdasarkan status (Published/Draft/Archived)

### 4. API Endpoints yang Tersedia

#### Authentication
- `POST /api/v1/auth/login` - Login admin
- `POST /api/v1/auth/logout` - Logout admin
- `GET /api/v1/auth/me` - Get user info

#### Courses Management
- `GET /api/v1/admin/courses` - List semua kursus
- `POST /api/v1/admin/courses` - Tambah kursus baru
- `GET /api/v1/admin/courses/{id}` - Detail kursus
- `PUT /api/v1/admin/courses/{id}` - Update kursus
- `DELETE /api/v1/admin/courses/{id}` - Hapus kursus

#### Instructors Management
- `GET /api/v1/admin/instructors` - List semua instruktur
- `POST /api/v1/admin/instructors` - Tambah instruktur baru
- `GET /api/v1/admin/instructors/{id}` - Detail instruktur
- `PUT /api/v1/admin/instructors/{id}` - Update instruktur
- `DELETE /api/v1/admin/instructors/{id}` - Hapus instruktur

#### Enrollments Management
- `GET /api/v1/admin/enrollments` - List semua pendaftaran
- `PUT /api/v1/admin/enrollments/{id}` - Update status pendaftaran

### 5. Membuat Admin User Baru

Jalankan command berikut di terminal:

```bash
cd backend
php artisan tinker
```

Kemudian di tinker:

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Nama Admin',
    'email' => 'email@prasasta.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
]);
```

### 6. Keamanan

- Semua endpoint admin memerlukan authentication token
- Token disimpan di localStorage browser
- Token akan otomatis expired jika logout
- Pastikan untuk logout setelah selesai mengelola website

### 7. Tips

- Gunakan status **Draft** untuk kursus yang masih dalam proses
- Set status ke **Published** untuk menampilkan kursus di website publik
- Gunakan **Archived** untuk menyembunyikan kursus lama tanpa menghapusnya
- Pastikan semua informasi kursus lengkap sebelum publish

## Struktur File Admin Panel

```
frontend/
├── app/
│   └── admin/
│       ├── login/
│       │   └── page.tsx          # Halaman login
│       ├── layout.tsx             # Layout admin dengan sidebar
│       ├── dashboard/
│       │   └── page.tsx           # Dashboard utama
│       ├── courses/
│       │   ├── page.tsx           # List kursus
│       │   ├── new/
│       │   │   └── page.tsx        # Form tambah kursus
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx   # Form edit kursus
│       ├── instructors/
│       │   └── page.tsx           # List instruktur
│       └── enrollments/
│           └── page.tsx           # List pendaftaran
└── lib/
    └── api-admin.ts               # API client untuk admin
```

## Next Steps

1. ✅ Authentication system sudah dibuat
2. ✅ Dashboard admin sudah dibuat
3. ✅ Halaman manage courses sudah dibuat
4. ⏳ Form create/edit course perlu dibuat
5. ⏳ Halaman manage instructors perlu dibuat
6. ⏳ Halaman manage enrollments perlu dibuat
7. ⏳ File upload untuk course images perlu ditambahkan

