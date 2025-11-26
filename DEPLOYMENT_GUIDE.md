# Panduan Deployment ke cPanel - prasasta.co.id

## Daftar Isi
1. [Persiapan](#persiapan)
2. [Struktur Folder di cPanel](#struktur-folder-di-cpanel)
3. [Deployment Backend (Laravel)](#deployment-backend-laravel)
4. [Deployment Frontend (Next.js)](#deployment-frontend-nextjs)
5. [Konfigurasi Database](#konfigurasi-database)
6. [Konfigurasi Domain & SSL](#konfigurasi-domain--ssl)
7. [Testing & Verifikasi](#testing--verifikasi)
8. [Troubleshooting](#troubleshooting)

---

## Persiapan

### 1. File yang Perlu Disiapkan
- ✅ Kode source code (frontend & backend)
- ✅ File `.env` untuk production
- ✅ Database backup (jika ada)
- ✅ Akses cPanel dengan domain prasasta.co.id

### 2. Informasi yang Diperlukan
- **Domain**: prasasta.co.id
- **Subdomain untuk API**: api.prasasta.co.id (disarankan)
- **Database**: Buat database baru di cPanel
- **PHP Version**: Minimal PHP 8.1 untuk Laravel
- **Node.js**: Minimal Node.js 18+ untuk Next.js

---

## Struktur Folder di cPanel

Rekomendasi struktur folder di cPanel:

```
/home/username/
├── public_html/              # Frontend (Next.js build)
│   ├── .next/
│   ├── public/
│   ├── package.json
│   └── server.js
│
├── api.prasasta.co.id/       # Backend (Laravel)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── storage/
│   ├── .env
│   └── ...
│
└── prasasta_backend/          # Alternatif: Backend di subfolder
    └── ...
```

**Atau struktur sederhana:**
```
/home/username/
├── public_html/              # Frontend
└── api/                      # Backend (subdomain atau subfolder)
```

---

## Deployment Backend (Laravel)

### Langkah 1: Upload File Backend

1. **Kompresi folder backend** (kecuali `node_modules`, `.git`, `.env`, `vendor`)

   **Windows (PowerShell):**
   ```powershell
   # Gunakan script yang sudah disediakan
   .\deploy-backend.ps1
   
   # Atau manual:
   cd backend
   Get-ChildItem -Path . -Recurse | 
       Where-Object {
           $_.FullName -notmatch "node_modules" -and
           $_.FullName -notmatch "\.git" -and
           $_.FullName -notmatch "\.env$" -and
           $_.FullName -notmatch "vendor"
       } | 
       Compress-Archive -DestinationPath "../backend.zip" -Force
   ```

   **Linux/Mac:**
   ```bash
   # Di local, buat zip file
   cd backend
   zip -r ../backend.zip . -x "node_modules/*" ".git/*" ".env" "vendor/*"
   ```
   
   **Catatan**: Lihat `DEPLOYMENT_WINDOWS.md` untuk panduan lengkap Windows.

2. **Upload ke cPanel**
   - Login ke cPanel
   - Buka **File Manager**
   - Buat folder baru: `api` atau `api.prasasta.co.id`
   - Upload dan extract `backend.zip` ke folder tersebut

### Langkah 2: Konfigurasi Environment

1. **Buat file `.env` di folder backend**
   ```env
   APP_NAME="PRASASTA Learning Center"
   APP_ENV=production
   APP_KEY=base64:YOUR_APP_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://api.prasasta.co.id

   LOG_CHANNEL=stack
   LOG_LEVEL=error

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=username_dbname
   DB_USERNAME=username_dbuser
   DB_PASSWORD=your_db_password

   BROADCAST_DRIVER=log
   CACHE_DRIVER=file
   FILESYSTEM_DISK=local
   QUEUE_CONNECTION=sync
   SESSION_DRIVER=file
   SESSION_LIFETIME=120

   MEMCACHED_HOST=127.0.0.1

   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379

   MAIL_MAILER=smtp
   MAIL_HOST=mailhog
   MAIL_PORT=2525
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   MAIL_FROM_ADDRESS="noreply@prasasta.co.id"
   MAIL_FROM_NAME="${APP_NAME}"

   SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
   SESSION_DOMAIN=.prasasta.co.id
   ```

2. **Generate APP_KEY**
   - Via SSH atau Terminal cPanel: 
   ```bash
   cd ~/api.prasasta.co.id
   php artisan key:generate
   ```

### Langkah 3: Setup Database

1. **Buat Database di cPanel**
   - Buka **MySQL Databases**
   - Buat database baru: `username_prasasta`
   - Buat user baru: `username_prasasta_user`
   - Berikan semua privileges ke user tersebut
   - Catat nama database dan user yang dibuat

2. **Import Database Schema**
   ```bash
   cd ~/api.prasasta.co.id
   php artisan migrate --force
   php artisan db:seed --class=AdminUserSeeder
   ```

### Langkah 4: Setup Storage & Permissions

1. **Buat symbolic link untuk storage**
   ```bash
   cd ~/api.prasasta.co.id
   php artisan storage:link
   ```

2. **Set permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chmod -R 775 storage
   ```

3. **Buat folder storage jika belum ada**
   ```bash
   mkdir -p storage/app/public/{categories,testimonials,gallery,facilities}
   chmod -R 775 storage/app/public
   ```

### Langkah 5: Install Dependencies

```bash
cd ~/api.prasasta.co.id
composer install --no-dev --optimize-autoloader
```

### Langkah 6: Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Langkah 7: Konfigurasi Public Folder

1. **Pindahkan isi `public/` ke folder yang diakses web**
   - Jika menggunakan subdomain `api.prasasta.co.id`:
     - Folder backend: `~/api.prasasta.co.id/`
     - Public folder: `~/api.prasasta.co.id/public/`
   - Atau gunakan `.htaccess` untuk redirect

2. **Buat file `.htaccess` di root backend** (jika perlu):
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteRule ^(.*)$ public/$1 [L]
   </IfModule>
   ```

---

## Deployment Frontend (Next.js)

### Opsi 1: Static Export (Recommended untuk cPanel)

1. **Update `next.config.js`**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     trailingSlash: true,
   };

   module.exports = nextConfig;
   ```

2. **Update `.env.production`**
   ```env
   NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1
   ```

3. **Build untuk production**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

4. **Upload folder `out/` ke public_html**
   - Upload semua isi folder `out/` ke `~/public_html/`

### Opsi 2: Next.js Standalone (Jika cPanel support Node.js)

1. **Update `next.config.js`**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
   };

   module.exports = nextConfig;
   ```

2. **Build dan upload**
   ```bash
   npm run build
   # Upload folder .next/ dan file lainnya ke server
   ```

3. **Setup Node.js App di cPanel**
   - Buka **Node.js App** di cPanel
   - Create new application
   - Set entry point: `server.js`
   - Set application root: `~/public_html`

---

## Konfigurasi Domain & SSL

### 1. Setup Subdomain untuk API

1. **Buat Subdomain di cPanel**
   - Buka **Subdomains**
   - Subdomain: `api`
   - Domain: `prasasta.co.id`
   - Document Root: `~/api.prasasta.co.id/public`

### 2. Setup SSL Certificate

1. **Install SSL via cPanel**
   - Buka **SSL/TLS Status**
   - Pilih domain dan subdomain
   - Install SSL certificate (Let's Encrypt gratis)

### 3. Update Environment Variables

**Backend `.env`:**
```env
APP_URL=https://api.prasasta.co.id
SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
SESSION_DOMAIN=.prasasta.co.id
```

**Frontend `.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1
```

---

## Testing & Verifikasi

### Checklist Deployment

- [ ] Backend API dapat diakses: `https://api.prasasta.co.id/api/v1/courses`
- [ ] Frontend dapat diakses: `https://prasasta.co.id`
- [ ] Database connection berhasil
- [ ] File upload berfungsi
- [ ] Admin login berfungsi
- [ ] SSL certificate aktif
- [ ] Images dapat diakses
- [ ] API CORS configuration benar

### Test Endpoints

```bash
# Test API
curl https://api.prasasta.co.id/api/v1/courses

# Test Frontend
curl https://prasasta.co.id
```

---

## Troubleshooting

### Masalah Umum

1. **500 Internal Server Error**
   - Cek file `.env` sudah benar
   - Cek permissions folder `storage` dan `bootstrap/cache`
   - Cek error log di cPanel

2. **Database Connection Error**
   - Pastikan credentials di `.env` benar
   - Pastikan database user memiliki privileges
   - Cek apakah database host benar (biasanya `127.0.0.1` atau `localhost`)

3. **Images Tidak Tampil**
   - Pastikan `php artisan storage:link` sudah dijalankan
   - Cek permissions folder `storage/app/public`
   - Pastikan URL image benar di database

4. **CORS Error**
   - Update `config/cors.php` di Laravel
   - Pastikan `SANCTUM_STATEFUL_DOMAINS` di `.env` benar

5. **Next.js Build Error**
   - Pastikan Node.js version sesuai
   - Hapus `.next` folder dan rebuild
   - Cek environment variables

### File Log

- **Laravel Log**: `~/api.prasasta.co.id/storage/logs/laravel.log`
- **cPanel Error Log**: cPanel > Metrics > Errors
- **Apache Error Log**: cPanel > Metrics > Errors

---

## Security Checklist

- [ ] `APP_DEBUG=false` di production
- [ ] `APP_ENV=production`
- [ ] SSL certificate aktif
- [ ] File `.env` tidak di-upload ke public
- [ ] Permissions folder sudah benar
- [ ] Database credentials kuat
- [ ] Admin password sudah diganti
- [ ] CORS configuration benar

---

## Maintenance

### Update Website

1. **Backup database** sebelum update
2. Upload file baru (jangan overwrite `.env`)
3. Run migrations: `php artisan migrate`
4. Clear cache: `php artisan cache:clear`
5. Rebuild frontend jika ada perubahan

### Backup Rutin

- Database: Export via phpMyAdmin atau command line
- Files: Backup folder `storage/app/public`
- Code: Backup via Git atau manual

---

## Kontak Support

Jika ada masalah saat deployment, pastikan:
1. Semua file sudah di-upload dengan benar
2. Environment variables sudah diset
3. Database sudah dibuat dan di-migrate
4. Permissions sudah benar
5. SSL sudah di-install

---

**Catatan**: Panduan ini dibuat untuk deployment umum di cPanel. Beberapa langkah mungkin berbeda tergantung konfigurasi hosting provider Anda.

