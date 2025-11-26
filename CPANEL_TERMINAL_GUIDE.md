# Panduan Mengakses Terminal di cPanel

## 🔍 Cara Membuka Terminal di cPanel

### Metode 1: Via cPanel Interface (Jika Tersedia)

1. **Login ke cPanel**
2. **Cari "Terminal"** di search box atau di bagian **Advanced**
3. **Klik "Terminal"** atau **"Web Terminal"**
4. Terminal akan terbuka di browser

**Catatan**: Tidak semua hosting provider menyediakan Terminal di cPanel. Jika tidak ada, gunakan metode alternatif di bawah.

---

## 🔧 Metode Alternatif: SSH Access

Jika Terminal tidak tersedia di cPanel, gunakan SSH client:

### Opsi 1: Menggunakan PuTTY (Windows)

1. **Download PuTTY**: https://www.putty.org/
2. **Install PuTTY**
3. **Buka PuTTY**
4. **Masukkan informasi**:
   - **Host Name**: `prasasta.co.id` atau `your-server-ip`
   - **Port**: `22` (default SSH)
   - **Connection Type**: SSH
5. **Klik Open**
6. **Login** dengan username dan password cPanel Anda

### Opsi 2: Menggunakan Windows Terminal / PowerShell (Windows 10/11)

1. **Buka PowerShell** atau **Windows Terminal**
2. **Jalankan perintah**:
   ```powershell
   ssh username@prasasta.co.id
   # atau
   ssh username@your-server-ip
   ```
3. **Masukkan password** saat diminta

### Opsi 3: Menggunakan Git Bash (Windows)

1. **Buka Git Bash**
2. **Jalankan perintah**:
   ```bash
   ssh username@prasasta.co.id
   ```
3. **Masukkan password** saat diminta

### Opsi 4: Menggunakan Terminal Mac/Linux

1. **Buka Terminal**
2. **Jalankan perintah**:
   ```bash
   ssh username@prasasta.co.id
   ```
3. **Masukkan password** saat diminta

---

## 📋 Informasi yang Diperlukan untuk SSH

Sebelum menggunakan SSH, Anda perlu:

1. **SSH Username**: Biasanya sama dengan username cPanel Anda
2. **SSH Password**: Password cPanel Anda (atau password SSH khusus jika sudah di-set)
3. **Server Hostname**: 
   - Domain: `prasasta.co.id`
   - Atau IP server (bisa dilihat di cPanel > Server Information)
4. **Port**: Default `22` untuk SSH

---

## 🔐 Enable SSH Access di cPanel

Jika SSH belum diaktifkan:

1. **Login ke cPanel**
2. Buka **"SSH Access"** atau **"Manage SSH Keys"**
3. **Enable SSH Access** (jika tersedia)
4. **Generate SSH Key** (opsional, untuk key-based authentication)

**Catatan**: 
- Beberapa hosting provider tidak mengizinkan SSH access untuk shared hosting. Hubungi support hosting jika SSH tidak tersedia.
- **SSH Keys TIDAK WAJIB** untuk deployment pertama kali. Anda bisa langsung menggunakan password authentication tanpa setup SSH Keys terlebih dahulu.
- Lihat `CPANEL_SSH_SETUP_GUIDE.md` untuk panduan lengkap tentang SSH Access.

---

## ✅ Verifikasi SSH Access

Setelah berhasil login via SSH, test dengan perintah:

```bash
# Cek lokasi saat ini
pwd

# List file dan folder
ls -la

# Masuk ke folder backend
cd ~/api.prasasta.co.id

# Cek apakah file .env ada
ls -la | grep .env
```

---

## 🛠️ Perintah Berguna untuk Deployment

Setelah berhasil login via Terminal/SSH, gunakan perintah berikut:

### Navigasi Folder

```bash
# Masuk ke folder backend
cd ~/api.prasasta.co.id

# Masuk ke folder frontend
cd ~/public_html

# Kembali ke home directory
cd ~
```

### File Management

```bash
# List semua file (termasuk tersembunyi)
ls -la

# Buat file baru
touch .env

# Edit file dengan nano
nano .env

# Edit file dengan vi
vi .env

# Lihat isi file
cat .env

# Copy file
cp .env.example .env
```

### Laravel Commands

```bash
# Masuk ke folder backend
cd ~/api.prasasta.co.id

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cache untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Composer Commands

```bash
cd ~/api.prasasta.co.id

# Install dependencies
composer install --no-dev --optimize-autoloader

# Update dependencies
composer update --no-dev
```

### Permissions

```bash
# Set permissions untuk storage
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage

# Set permissions untuk .env
chmod 600 .env
```

---

## 🐛 Troubleshooting

### Problem: "Terminal" tidak ada di cPanel

**Solusi**: 
- Gunakan SSH client (PuTTY, PowerShell, dll)
- Atau hubungi support hosting untuk enable SSH access

### Problem: "Permission denied" saat SSH

**Solusi**:
1. Pastikan username dan password benar
2. Pastikan SSH access sudah di-enable di cPanel
3. Cek apakah hosting provider mengizinkan SSH untuk paket Anda

### Problem: "Connection refused" atau "Connection timeout"

**Solusi**:
1. Cek apakah port 22 terbuka
2. Cek firewall settings
3. Coba gunakan IP server langsung (bukan domain)
4. Hubungi support hosting

### Problem: Tidak bisa edit file dengan nano/vi

**Solusi**:
- Gunakan Code Editor di cPanel File Manager sebagai alternatif
- Atau upload file via FTP/SFTP, edit di lokal, lalu upload kembali

---

## 💡 Tips

1. **Gunakan SSH Key** untuk authentication yang lebih aman (tidak perlu password setiap kali)
2. **Backup file** sebelum melakukan perubahan besar
3. **Gunakan screen atau tmux** untuk session yang persistent
4. **Document perintah** yang sering digunakan untuk referensi cepat

---

## 📝 Contoh Workflow Deployment via Terminal

```bash
# 1. Login via SSH
ssh username@prasasta.co.id

# 2. Masuk ke folder backend
cd ~/api.prasasta.co.id

# 3. Pull update atau upload file baru (jika menggunakan Git)
git pull origin main
# atau upload file via FTP/SFTP

# 4. Install dependencies
composer install --no-dev --optimize-autoloader

# 5. Run migrations
php artisan migrate --force

# 6. Clear dan cache config
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Set permissions
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage

# 8. Test
curl https://api.prasasta.co.id/api/v1/courses
```

---

## 🔒 Security Best Practices

1. **Jangan share** credentials SSH Anda
2. **Gunakan SSH Key** daripada password jika memungkinkan
3. **Disable password authentication** jika sudah menggunakan SSH Key
4. **Gunakan strong password** untuk SSH
5. **Logout** setelah selesai menggunakan Terminal

---

**Catatan**: Jika Terminal tidak tersedia di cPanel dan SSH juga tidak bisa diakses, Anda masih bisa melakukan deployment via File Manager dan FTP/SFTP. Terminal/SSH hanya memudahkan untuk menjalankan perintah Laravel secara langsung.

