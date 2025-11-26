# Tips cPanel File Manager - Menampilkan File Tersembunyi

## Masalah: File `.env` Tidak Terlihat di cPanel File Manager

File yang dimulai dengan titik (`.env`, `.htaccess`, dll) biasanya **tersembunyi** di cPanel File Manager secara default.

---

## ✅ Solusi: Tampilkan File Tersembunyi

### Metode 1: Via File Manager Settings (Recommended)

1. **Buka File Manager** di cPanel
2. **Klik Settings** (ikon gear di pojok kanan atas)
3. **Centang checkbox**: **"Show Hidden Files (dotfiles)"**
4. **Klik Save**
5. File `.env` sekarang akan terlihat!

### Metode 2: Via Terminal/SSH

Jika Anda memiliki akses SSH:

```bash
# Masuk ke folder backend
cd ~/api.prasasta.co.id

# List semua file termasuk yang tersembunyi
ls -la

# Edit file .env
nano .env
# atau
vi .env
```

### Metode 3: Via Code Editor di cPanel

1. Buka **File Manager**
2. **Enable "Show Hidden Files"** di Settings
3. Klik kanan pada file `.env`
4. Pilih **"Code Edit"** atau **"Edit"**
5. File akan terbuka di editor

---

## 🔍 Verifikasi File `.env` Ada

### Via Terminal/SSH:

```bash
cd ~/api.prasasta.co.id
ls -la | grep .env
```

**Expected output:**
```
-rw-r--r-- 1 username username 1234 Nov 24 12:00 .env
```

### Via File Manager:

Setelah enable "Show Hidden Files", file `.env` akan muncul dengan nama:
```
.env
```

---

## 📝 Cara Membuat File `.env` di cPanel

### Metode 1: Via File Manager

1. **Enable "Show Hidden Files"** di Settings
2. Klik **"+ File"** di toolbar
3. **Nama file**: `.env` (pastikan dimulai dengan titik)
4. Klik **Create New File**
5. Klik kanan file `.env` > **Edit**
6. Paste isi file `.env` yang sudah disiapkan
7. **Save**

### Metode 2: Via Terminal/SSH

```bash
cd ~/api.prasasta.co.id

# Buat file .env
touch .env

# Edit file .env
nano .env
# atau upload via FTP/SFTP
```

### Metode 3: Upload via FTP/SFTP

1. Buat file `.env` di komputer lokal
2. Upload ke folder `~/api.prasasta.co.id/` via FileZilla/WinSCP
3. Pastikan file ter-upload dengan benar

---

## ⚠️ Catatan Penting

### 1. File `.env` Harus Ada di Root Backend

Struktur yang benar:
```
~/api.prasasta.co.id/
├── .env              ← File ini harus ada di sini
├── app/
├── bootstrap/
├── config/
├── public/
└── ...
```

### 2. Permissions File `.env`

File `.env` harus memiliki permissions yang benar:

```bash
chmod 600 .env    # Read/write untuk owner saja (recommended)
# atau
chmod 644 .env    # Read untuk semua, write untuk owner
```

**Jangan set permissions terlalu terbuka** (misalnya 777) karena file `.env` berisi informasi sensitif!

### 3. File `.env` Tidak Boleh Di-upload ke Public

Pastikan file `.env` **tidak** berada di folder `public/` atau folder yang bisa diakses langsung dari browser.

---

## 🔒 Security Checklist untuk File `.env`

- [ ] File `.env` tidak terlihat di browser (test: `https://api.prasasta.co.id/.env`)
- [ ] Permissions file `.env` adalah 600 atau 644
- [ ] File `.env` tidak di-commit ke Git (sudah ada di `.gitignore`)
- [ ] Database password di `.env` kuat
- [ ] `APP_DEBUG=false` di production
- [ ] `APP_KEY` sudah di-generate

---

## 🐛 Troubleshooting

### Problem: File `.env` masih tidak terlihat setelah enable "Show Hidden Files"

**Solusi:**
1. Refresh halaman File Manager (F5)
2. Pastikan Anda berada di folder yang benar (`~/api.prasasta.co.id/`)
3. Coba via Terminal/SSH untuk memastikan file ada

### Problem: Tidak bisa edit file `.env`

**Solusi:**
1. Pastikan permissions file benar: `chmod 644 .env`
2. Gunakan Code Editor di cPanel (bukan Text Editor biasa)
3. Atau edit via Terminal/SSH

### Problem: File `.env` bisa diakses dari browser

**Solusi:**
1. Pastikan file `.env` **tidak** di folder `public/`
2. Cek file `.htaccess` di folder `public/` untuk block access
3. Test: `https://api.prasasta.co.id/.env` harus return 403 atau 404

---

## 📋 Template File `.env` untuk Production

Pastikan file `.env` Anda berisi:

```env
APP_NAME="PRASASTA Learning Center"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.prasasta.co.id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=username_prasasta
DB_USERNAME=username_prasasta_user
DB_PASSWORD=your_strong_password

SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
SESSION_DOMAIN=.prasasta.co.id
```

**Jangan lupa generate APP_KEY:**
```bash
php artisan key:generate
```

---

## 💡 Tips

1. **Selalu backup** file `.env` sebelum melakukan perubahan
2. **Gunakan Code Editor** di cPanel untuk edit file `.env` (lebih aman)
3. **Test** bahwa file tidak bisa diakses dari browser setelah setup
4. **Document** credentials di tempat yang aman (password manager)

---

**Catatan**: File `.env` adalah file konfigurasi penting yang berisi informasi sensitif. Pastikan file ini tidak bisa diakses dari browser dan memiliki permissions yang tepat!

