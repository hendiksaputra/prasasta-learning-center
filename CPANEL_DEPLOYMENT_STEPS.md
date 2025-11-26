# 🚀 Panduan Lengkap Deployment ke cPanel - prasasta.co.id

Panduan step-by-step lengkap untuk deployment website **PRASASTA Learning Center** ke cPanel agar dapat diakses secara online.

---

## 📋 Daftar Isi

1. [Persiapan Sebelum Deployment](#persiapan-sebelum-deployment)
2. [Setup Backend (Laravel API)](#setup-backend-laravel-api)
3. [Setup Frontend (Next.js)](#setup-frontend-nextjs)
4. [Konfigurasi Domain & SSL](#konfigurasi-domain--ssl)
5. [Testing & Verifikasi](#testing--verifikasi)
6. [Troubleshooting](#troubleshooting)
7. [Update Website Setelah Deployment](#update-website-setelah-deployment)

---

## ⚠️ Catatan Penting

**Jika Terminal atau SSH tidak tersedia di hosting Anda**, gunakan panduan alternatif:
👉 **[DEPLOYMENT_TANPA_TERMINAL.md](./DEPLOYMENT_TANPA_TERMINAL.md)** - Panduan deployment tanpa Terminal/SSH

---

## 📦 Persiapan Sebelum Deployment

### 1.1 Persiapan File Backend

**Langkah-langkah:**

1. **Buka terminal/command prompt di komputer lokal**
2. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```

3. **Install dependencies (jika belum):**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

4. **Buat file ZIP untuk upload:**
   
   **Windows PowerShell:**
   ```powershell
   # Exclude folder yang tidak perlu di-upload
   Compress-Archive -Path * -DestinationPath ../backend.zip -Exclude node_modules,.git,vendor,.env,.env.local
   ```
   
   **Atau manual via File Explorer:**
   - Pilih semua file dan folder di `backend/`
   - Klik kanan > Send to > Compressed (zipped) folder
   - **JANGAN** include folder berikut:
     - `node_modules/` (jika ada)
     - `.git/`
     - `vendor/` (akan di-install di server)
     - `.env` atau `.env.local` (akan dibuat baru di server)
     - `storage/logs/*.log` (file log)

### 1.2 Persiapan File Frontend

**Langkah-langkah:**

1. **Masuk ke folder frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build untuk production:**
   ```bash
   npm run build
   ```
   
   **Catatan:** Setelah build selesai, folder `.next/` akan terbuat otomatis.

4. **Buat file ZIP untuk upload:**
   
   **Windows PowerShell:**
   ```powershell
   # Zip file yang diperlukan untuk production
   Compress-Archive -Path .next,public,package.json,package-lock.json,next.config.js,tsconfig.json,tailwind.config.ts,postcss.config.js -DestinationPath ../frontend.zip
   ```
   
   **Atau manual:**
   - Zip folder berikut:
     - `.next/` (hasil build)
     - `public/`
     - `package.json`
     - `package-lock.json`
     - `next.config.js` (atau `next.config.production.js`)
     - `tsconfig.json`
     - `tailwind.config.ts`
     - `postcss.config.js`
   - **JANGAN** include:
     - `node_modules/`
     - `.git/`
     - File `.env*` (akan dibuat di server)

---

## 🔧 Setup Backend (Laravel API)

### 2.1 Buat Subdomain untuk API

1. **Login ke cPanel**
2. **Buka menu "Subdomains"** (biasanya di section "Domains")
3. **Klik "Create a Subdomain"**
4. **Isi form:**
   - **Subdomain:** `api`
   - **Domain:** `prasasta.co.id`
   - **Document Root:** `~/api.prasasta.co.id/public` (otomatis terisi)
5. **Klik "Create"**
6. **Tunggu hingga subdomain aktif** (biasanya beberapa menit)

### 2.2 Upload File Backend

1. **Buka File Manager di cPanel**
2. **Buka folder root** (biasanya `/home/username/`)
3. **Buat folder baru** (jika belum ada): `api.prasasta.co.id`
4. **Upload file `backend.zip`** ke folder `api.prasasta.co.id/`
5. **Extract file ZIP:**
   - Klik kanan pada `backend.zip`
   - Pilih "Extract"
   - Pastikan file ter-extract di folder `api.prasasta.co.id/`
6. **Hapus file `backend.zip`** setelah extract selesai

### 2.3 Buat Database MySQL

1. **Buka "MySQL Databases" di cPanel**
2. **Buat Database Baru:**
   - Masukkan nama database: `prasasta_db` (atau nama lain)
   - **Catatan:** cPanel akan menambahkan prefix username, jadi nama lengkapnya akan menjadi `username_prasasta_db`
   - Klik "Create Database"
   - **SALIN nama database lengkap** (dengan prefix username)

3. **Buat Database User:**
   - Scroll ke bawah ke section "Add New User"
   - Masukkan username: `prasasta_user`
   - Masukkan password yang kuat (gunakan password generator)
   - Klik "Create User"
   - **SALIN username lengkap** (dengan prefix) dan password

4. **Berikan Privileges:**
   - Scroll ke section "Add User to Database"
   - Pilih user yang baru dibuat
   - Pilih database yang baru dibuat
   - Klik "Add"
   - Centang **"ALL PRIVILEGES"**
   - Klik "Make Changes"

### 2.4 Konfigurasi Environment (.env)

1. **Di File Manager, buka folder `api.prasasta.co.id/`**
2. **Buat file `.env`** (jika belum ada):
   - Klik "New File"
   - Nama file: `.env`
   - Klik "Create New File"

3. **Edit file `.env`** dengan klik kanan > "Edit" atau "Code Edit"

4. **Copy-paste konfigurasi berikut** (sesuaikan dengan data Anda):

```env
APP_NAME="PRASASTA Learning Center"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.prasasta.co.id
APP_TIMEZONE=Asia/Jakarta

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=username_prasasta_db
DB_USERNAME=username_prasasta_user
DB_PASSWORD=your_password_here

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.prasasta.co.id

SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
SANCTUM_GUARD=web

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@prasasta.co.id"
MAIL_FROM_NAME="${APP_NAME}"
```

**⚠️ PENTING:** Ganti nilai berikut dengan data Anda:
- `DB_DATABASE` → Nama database lengkap (dengan prefix username)
- `DB_USERNAME` → Username database lengkap (dengan prefix)
- `DB_PASSWORD` → Password database yang Anda buat
- `username` → Ganti dengan username cPanel Anda yang sebenarnya

5. **Save file** (Ctrl+S atau klik "Save Changes")

### 2.5 Install Dependencies & Setup Laravel

**Cara Membuka Terminal di cPanel:**

**Metode 1: Via Search Box (Paling Cepat) ✅**
1. Login ke cPanel
2. Klik **search box** di pojok kanan atas (icon magnifying glass 🔍)
3. Ketik: `terminal` atau `web terminal`
4. Klik hasil pencarian yang muncul
5. Terminal akan terbuka di browser!

**Metode 2: Via Section Advanced**
1. Login ke cPanel
2. Scroll ke bawah ke section **"Advanced"**
3. Klik **"Terminal"** atau **"Web Terminal"**

**Jika Terminal tidak tersedia:**
- Lihat panduan: **[CPANEL_TERMINAL_GUIDE.md](./CPANEL_TERMINAL_GUIDE.md)**
- Atau gunakan SSH client (PuTTY, PowerShell, Git Bash)
- Atau lihat: **[DEPLOYMENT_TANPA_TERMINAL.md](./DEPLOYMENT_TANPA_TERMINAL.md)**

**Setelah Terminal terbuka, cek dulu apakah Composer tersedia:**

```bash
# Cek apakah Composer tersedia
composer --version

# Atau cek di lokasi umum
which composer
```

**Jika muncul error "composer: command not found", ikuti solusi di bawah:**

### 🔧 Solusi: Composer Tidak Ditemukan

**Opsi 1: Install Composer Manual (Recommended) ✅**

```bash
# Masuk ke folder backend
cd ~/api.prasasta.co.id

# Download Composer installer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

# Install Composer
php composer-setup.php

# Hapus installer
php -r "unlink('composer-setup.php');"

# Sekarang gunakan Composer via PHP
php composer.phar install --no-dev --optimize-autoloader
```

**Opsi 2: Upload Vendor Folder dari Lokal (Paling Cepat) ⚡**

Jika Opsi 1 tidak berhasil atau terlalu lama, upload vendor folder dari komputer lokal:

1. **Di komputer lokal, masuk ke folder backend:**
   ```bash
   cd backend
   composer install --no-dev --optimize-autoloader
   ```

2. **Zip folder vendor:**
   ```bash
   # Windows PowerShell
   Compress-Archive -Path vendor -DestinationPath vendor.zip
   ```

3. **Upload `vendor.zip` ke server:**
   - Via File Manager, upload ke `~/api.prasasta.co.id/`
   - Extract file ZIP
   - Hapus file ZIP setelah extract

**Opsi 3: Gunakan Composer di Lokasi Lain**

Beberapa hosting menyimpan Composer di lokasi khusus:

```bash
# Cek lokasi Composer yang mungkin ada
/usr/local/bin/composer --version
~/bin/composer --version
/opt/cpanel/composer/bin/composer --version

# Jika ditemukan, gunakan path lengkap atau buat symlink
ln -s /usr/local/bin/composer ~/bin/composer
```

**Setelah Composer tersedia, verifikasi struktur folder terlebih dahulu:**

```bash
# Cek lokasi saat ini
pwd

# Masuk ke folder backend
cd ~/api.prasasta.co.id

# Verifikasi struktur folder (pastikan file artisan ada)
ls -la | grep artisan

# Atau list semua file untuk melihat struktur
ls -la

# Pastikan Anda melihat file-file berikut:
# - artisan (file Laravel)
# - composer.json
# - app/
# - bootstrap/
# - config/
# - database/
# - public/
# - routes/
# - storage/
```

**Jika file `artisan` tidak ditemukan:**

1. **Cek apakah folder backend sudah ter-upload dengan benar:**
   ```bash
   # List isi folder
   ls -la ~/api.prasasta.co.id/
   
   # Jika folder kosong atau tidak ada, berarti upload belum selesai
   # Kembali ke File Manager dan pastikan file sudah ter-extract
   ```

2. **Pastikan extract dilakukan di folder yang benar:**
   - File harus di-extract di `~/api.prasasta.co.id/`
   - Bukan di `~/api.prasasta.co.id/backend/` atau lokasi lain

3. **Jika struktur salah, perbaiki:**
   ```bash
   # Jika file ada di ~/api.prasasta.co.id/backend/
   cd ~/api.prasasta.co.id/backend
   # Pindahkan semua file ke parent folder
   mv * ../
   mv .* ../
   cd ..
   ```

**Setelah struktur folder benar, lanjutkan dengan perintah berikut:**

```bash
# Pastikan berada di folder yang benar (harus ada file artisan)
cd ~/api.prasasta.co.id
pwd  # Harus menampilkan: /home/username/api.prasasta.co.id
ls artisan  # Harus menampilkan: artisan

# Install Composer dependencies
# Gunakan salah satu perintah berikut sesuai opsi yang Anda pilih:
composer install --no-dev --optimize-autoloader
# ATAU jika menggunakan composer.phar:
php composer.phar install --no-dev --optimize-autoloader
# ATAU jika vendor sudah di-upload, skip langkah ini

# Generate application key (penting!)
# Pastikan file artisan ada sebelum menjalankan ini
php artisan key:generate

# Run database migrations
php artisan migrate --force

# Create storage symlink
php artisan storage:link

# Optimize Laravel untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions untuk storage dan cache
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage
```

**Catatan:** 
- Jika semua opsi tidak berhasil, hubungi support hosting untuk install Composer
- Jika ada error permission, coba tambahkan `sudo` di depan perintah (jika tersedia)

### 2.6 Setup Storage Folders

```bash
cd ~/api.prasasta.co.id

# Buat folder untuk upload images
mkdir -p storage/app/public/categories
mkdir -p storage/app/public/testimonials
mkdir -p storage/app/public/gallery
mkdir -p storage/app/public/facilities
mkdir -p storage/app/public/courses

# Set permissions
chmod -R 775 storage/app/public
```

### 2.7 Setup Admin User (Opsional)

Jika perlu membuat admin user pertama kali:

```bash
cd ~/api.prasasta.co.id
php artisan db:seed --class=AdminUserSeeder
```

**Catatan:** Pastikan seeder `AdminUserSeeder` sudah ada di `database/seeders/`

---

## 🌐 Setup Frontend (Next.js)

### 3.1 Upload File Frontend

1. **Buka File Manager di cPanel**
2. **Buka folder `public_html/`** (ini adalah root untuk domain utama)
3. **Hapus semua file default** (jika ada) seperti `index.html`, `cgi-bin`, dll
4. **Upload file `frontend.zip`** ke folder `public_html/`
5. **Extract file ZIP:**
   - Klik kanan pada `frontend.zip`
   - Pilih "Extract"
   - Pastikan file ter-extract di folder `public_html/`
6. **Hapus file `frontend.zip`** setelah extract selesai

**Struktur folder setelah extract:**
```
public_html/
├── .next/
├── public/
├── package.json
├── package-lock.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

### 3.2 Konfigurasi Environment Frontend

1. **Buka File Manager, masuk ke folder `public_html/`**
2. **Buat file `.env.production`** (jika belum ada):
   - Klik "New File"
   - Nama file: `.env.production`
   - Klik "Create New File"

3. **Edit file `.env.production`:**

```env
NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1
```

4. **Save file**

### 3.3 Setup Node.js App (Jika Diperlukan)

**Jika cPanel support Node.js App:**

1. **Buka "Node.js App" di cPanel**
2. **Klik "Create Application"**
3. **Isi form:**
   - **Node.js version:** 18 atau lebih tinggi (disarankan 18 LTS)
   - **Application root:** `~/public_html`
   - **Application URL:** `prasasta.co.id`
   - **Application startup file:** `server.js` (atau sesuai konfigurasi Next.js)
   - **Application mode:** Production
4. **Klik "Create"**

5. **Setelah aplikasi dibuat, install dependencies:**
   - Klik "Run NPM Install" atau jalankan via Terminal:
   ```bash
   cd ~/public_html
   npm install --production
   ```

6. **Start application:**
   - Klik "Start App" di Node.js App manager

**Alternatif: Static Export (Tidak Perlu Node.js)**

Jika menggunakan static export, tidak perlu Node.js App. Pastikan `next.config.js` sudah dikonfigurasi untuk static export.

---

## 🔒 Konfigurasi Domain & SSL

### 4.1 Verifikasi Subdomain

1. **Buka "Subdomains" di cPanel**
2. **Pastikan subdomain `api.prasasta.co.id` sudah dibuat**
3. **Pastikan Document Root mengarah ke:** `~/api.prasasta.co.id/public`

### 4.2 Install SSL Certificate

**Untuk Domain Utama (prasasta.co.id):**

1. **Buka "SSL/TLS Status" di cPanel**
2. **Cari domain `prasasta.co.id`**
3. **Klik "Run AutoSSL"** atau **"Install SSL Certificate"**
4. **Pilih "Let's Encrypt"** (gratis)
5. **Klik "Install"**
6. **Tunggu hingga SSL terinstall** (biasanya 1-5 menit)

**Untuk Subdomain API (api.prasasta.co.id):**

1. **Di halaman yang sama, cari `api.prasasta.co.id`**
2. **Klik "Run AutoSSL"** atau **"Install SSL Certificate"**
3. **Pilih "Let's Encrypt"**
4. **Klik "Install"**
5. **Tunggu hingga SSL terinstall**

**Verifikasi SSL:**
- Buka browser, akses: `https://prasasta.co.id` (harus ada icon 🔒)
- Buka browser, akses: `https://api.prasasta.co.id` (harus ada icon 🔒)

### 4.3 Setup .htaccess untuk Backend (Jika Perlu)

**File `.htaccess` di `api.prasasta.co.id/public/`** biasanya sudah ada dari Laravel. Jika tidak ada, buat file baru:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## ✅ Testing & Verifikasi

### 5.1 Test Backend API

**Buka browser dan test endpoint berikut:**

1. **Test API Base:**
   ```
   https://api.prasasta.co.id/api/v1/courses
   ```
   **Expected:** JSON response dengan data courses (atau array kosong jika belum ada data)

2. **Test Categories:**
   ```
   https://api.prasasta.co.id/api/v1/categories
   ```

3. **Test Testimonials:**
   ```
   https://api.prasasta.co.id/api/v1/testimonials
   ```

4. **Test Gallery:**
   ```
   https://api.prasasta.co.id/api/v1/gallery
   ```

5. **Test Facilities:**
   ```
   https://api.prasasta.co.id/api/v1/facilities
   ```

**Jika ada error:**
- Cek error log: cPanel > Metrics > Errors
- Cek file `.env` sudah benar
- Cek database connection

### 5.2 Test Frontend

**Buka browser dan test:**

1. **Homepage:**
   ```
   https://prasasta.co.id
   ```
   **Expected:** Website tampil dengan benar

2. **Halaman Courses:**
   ```
   https://prasasta.co.id/courses
   ```

3. **Halaman About:**
   ```
   https://prasasta.co.id/about
   ```

4. **Halaman Contact:**
   ```
   https://prasasta.co.id/contact
   ```

5. **Admin Login:**
   ```
   https://prasasta.co.id/admin/login
   ```

**Jika ada error:**
- Cek console browser (F12 > Console)
- Cek apakah API URL benar di `.env.production`
- Cek apakah build Next.js sudah benar

### 5.3 Test Admin Panel

1. **Login ke admin panel:**
   ```
   https://prasasta.co.id/admin/login
   ```

2. **Test CRUD Operations:**
   - Create course baru
   - Upload image
   - Edit course
   - Delete course (jika perlu)

3. **Test Upload Images:**
   - Upload image untuk course
   - Upload image untuk gallery
   - Upload image untuk testimonial
   - Pastikan images dapat diakses via URL

### 5.4 Test Images & Storage

1. **Test storage link:**
   ```
   https://api.prasasta.co.id/storage/categories/test.jpg
   ```
   (ganti dengan nama file yang ada)

2. **Pastikan images dapat diakses dari frontend**

---

## 🐛 Troubleshooting

### Problem: 500 Internal Server Error

**Solusi:**
1. **Cek file `.env` sudah benar:**
   - Pastikan `APP_KEY` sudah di-generate
   - Pastikan database credentials benar
   - Pastikan `APP_DEBUG=false` di production

2. **Cek error log:**
   - cPanel > Metrics > Errors
   - Atau: `api.prasasta.co.id/storage/logs/laravel.log`

3. **Cek permissions:**
   ```bash
   cd ~/api.prasasta.co.id
   chmod -R 755 storage bootstrap/cache
   chmod -R 775 storage
   ```

4. **Clear cache:**
   ```bash
   cd ~/api.prasasta.co.id
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan view:clear
   ```

### Problem: Database Connection Error

**Solusi:**
1. **Cek credentials di `.env`:**
   - Pastikan `DB_DATABASE` menggunakan nama lengkap dengan prefix username
   - Pastikan `DB_USERNAME` menggunakan username lengkap dengan prefix
   - Pastikan `DB_PASSWORD` benar
   - Pastikan `DB_HOST=127.0.0.1` (biasanya ini untuk cPanel)

2. **Cek database user privileges:**
   - cPanel > MySQL Databases
   - Pastikan user memiliki "ALL PRIVILEGES"

3. **Test connection via Terminal:**
   ```bash
   mysql -u username_prasasta_user -p username_prasasta_db
   ```

### Problem: Images Tidak Tampil

**Solusi:**
1. **Pastikan storage link sudah dibuat:**
   ```bash
   cd ~/api.prasasta.co.id
   php artisan storage:link
   ```

2. **Cek permissions folder storage:**
   ```bash
   chmod -R 775 storage/app/public
   ```

3. **Cek URL images di database:**
   - Pastikan URL menggunakan absolute path: `https://api.prasasta.co.id/storage/...`
   - Bukan relative path: `/storage/...`

4. **Cek file `.htaccess` di `public/storage/`** (jika ada)

### Problem: CORS Error

**Solusi:**
1. **Cek `config/cors.php` di Laravel:**
   - Pastikan `allowed_origins` include `https://prasasta.co.id`

2. **Cek `.env`:**
   ```env
   SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
   SESSION_DOMAIN=.prasasta.co.id
   ```

3. **Clear cache:**
   ```bash
   php artisan config:clear
   php artisan config:cache
   ```

### Problem: Next.js Build Error

**Solusi:**
1. **Pastikan Node.js version sesuai:**
   - Minimal Node.js 18
   - Cek: `node --version`

2. **Hapus folder `.next` dan rebuild:**
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```

3. **Cek environment variables:**
   - Pastikan `NEXT_PUBLIC_API_URL` sudah benar

### Problem: Subdomain Tidak Bisa Diakses

**Solusi:**
1. **Cek DNS propagation:**
   - Gunakan tool: https://dnschecker.org
   - Pastikan subdomain sudah ter-resolve ke IP server

2. **Cek Document Root:**
   - cPanel > Subdomains
   - Pastikan Document Root: `~/api.prasasta.co.id/public`

3. **Tunggu beberapa menit** setelah membuat subdomain (DNS propagation)

---

## 🔄 Update Website Setelah Deployment

### Update Backend:

1. **Upload file baru** (jangan overwrite `.env`)
2. **Via Terminal:**
   ```bash
   cd ~/api.prasasta.co.id
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Update Frontend:

1. **Build ulang di local:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload folder `.next/` yang baru** ke `public_html/`

3. **Restart Node.js app** (jika menggunakan Node.js App)

---

## 📝 Checklist Final

Gunakan checklist lengkap di **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** untuk memastikan semua langkah sudah dilakukan.

---

## 📚 Referensi Tambahan

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist lengkap deployment
- **[DEPLOYMENT_TANPA_TERMINAL.md](./DEPLOYMENT_TANPA_TERMINAL.md)** - Panduan tanpa Terminal/SSH
- **[CPANEL_TERMINAL_GUIDE.md](./CPANEL_TERMINAL_GUIDE.md)** - Panduan menggunakan Terminal cPanel
- **[PUTTY_CONNECTION_TROUBLESHOOTING.md](./PUTTY_CONNECTION_TROUBLESHOOTING.md)** - Troubleshooting koneksi SSH

---

## ⚠️ Catatan Penting

- **Selalu backup database** sebelum update
- **Test di staging environment** dulu (jika ada)
- **Monitor error logs** setelah deployment
- **Pastikan SSL certificate** masih valid
- **Jangan set `APP_DEBUG=true`** di production
- **Jangan commit file `.env`** ke repository

---

**Selamat! Website Anda sudah siap diakses di https://prasasta.co.id 🎉**
