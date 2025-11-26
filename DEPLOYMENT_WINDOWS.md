# Panduan Deployment untuk Windows

Panduan khusus untuk membuat file deployment di Windows (PowerShell).

## 🪟 Membuat Zip Backend (Windows)

### Opsi 1: Menggunakan PowerShell Script (Recommended)

1. **Buka PowerShell** di folder root project (`D:\prasasta\prasasta\`)
2. **Jalankan script**:
   ```powershell
   .\deploy-backend.ps1
   ```
3. File `backend.zip` akan dibuat di folder root

### Opsi 2: Menggunakan PowerShell Manual

```powershell
# Masuk ke folder backend
cd backend

# Buat zip file (exclude folder tertentu)
Get-ChildItem -Path . -Recurse | 
    Where-Object {
        $_.FullName -notmatch "node_modules" -and
        $_.FullName -notmatch "\.git" -and
        $_.FullName -notmatch "\.env$" -and
        $_.FullName -notmatch "vendor"
    } | 
    Compress-Archive -DestinationPath "../backend.zip" -Force

cd ..
```

### Opsi 3: Menggunakan 7-Zip (jika terinstall)

```bash
# Install 7-Zip dulu jika belum ada: https://www.7-zip.org/
cd backend
"C:\Program Files\7-Zip\7z.exe" a -tzip ..\backend.zip * -xr!node_modules -xr!.git -xr!.env -xr!vendor
cd ..
```

### Opsi 4: Manual via Windows Explorer

1. Buka folder `backend` di Windows Explorer
2. **Pilih semua file dan folder** (Ctrl+A)
3. **Exclude manual**:
   - Hapus selection untuk folder: `node_modules`, `.git`, `vendor`
   - Hapus file: `.env`
4. **Klik kanan** > **Send to** > **Compressed (zipped) folder**
5. **Rename** menjadi `backend.zip`
6. **Pindahkan** ke folder root project

---

## 🚀 Build Frontend (Windows)

### Opsi 1: Menggunakan PowerShell Script (Recommended)

1. **Buka PowerShell** di folder root project
2. **Jalankan script**:
   ```powershell
   .\deploy-frontend.ps1
   ```
3. Script akan:
   - Install dependencies
   - Build untuk production
   - Memberikan instruksi file yang perlu di-upload

### Opsi 2: Manual

```powershell
# Masuk ke folder frontend
cd frontend

# Buat file .env.production jika belum ada
if (-not (Test-Path ".env.production")) {
    Copy-Item ".env.production.example" ".env.production"
    # Edit file .env.production dan set NEXT_PUBLIC_API_URL
}

# Install dependencies
npm install

# Build untuk production
npm run build

cd ..
```

---

## 📦 File yang Perlu Di-upload

### Backend (Laravel)

**File yang di-upload:**
- ✅ Semua file dan folder kecuali:
  - ❌ `node_modules/`
  - ❌ `.git/`
  - ❌ `.env` (buat baru di server)
  - ❌ `vendor/` (install di server dengan `composer install`)

**Setelah upload ke server:**
```bash
cd ~/api.prasasta.co.id
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

### Frontend (Next.js)

**File yang di-upload:**
- ✅ Folder `.next/` (hasil build)
- ✅ Folder `public/`
- ✅ File `package.json`
- ✅ File `package-lock.json`
- ✅ File `next.config.js`
- ✅ File `.env.production`

**Setelah upload ke server:**
```bash
cd ~/public_html
npm install --production
# Jika menggunakan Node.js app di cPanel, restart aplikasi
```

---

## 🔧 Troubleshooting Windows

### Problem: "zip: command not found" di Git Bash

**Solusi**: Gunakan PowerShell script atau manual via Windows Explorer

### Problem: PowerShell Execution Policy Error

Jika mendapat error: "cannot be loaded because running scripts is disabled"

**Solusi**:
```powershell
# Buka PowerShell sebagai Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem: Compress-Archive terlalu lambat

**Solusi**: 
- Gunakan 7-Zip untuk kompresi lebih cepat
- Atau exclude lebih banyak folder yang tidak diperlukan

---

## 📝 Checklist Deployment Windows

- [ ] File `backend.zip` sudah dibuat
- [ ] Frontend sudah di-build (`npm run build`)
- [ ] File `.env.production` sudah dibuat dan dikonfigurasi
- [ ] File siap untuk di-upload ke cPanel
- [ ] Backup database lokal (jika ada data penting)

---

## 💡 Tips untuk Windows

1. **Gunakan PowerShell** untuk script automation
2. **Gunakan FileZilla** atau **WinSCP** untuk upload file ke cPanel
3. **Gunakan 7-Zip** untuk kompresi yang lebih efisien
4. **Test build lokal** sebelum upload ke server
5. **Backup file** sebelum melakukan perubahan besar

---

**Catatan**: Script PowerShell (`deploy-backend.ps1` dan `deploy-frontend.ps1`) sudah tersedia di root project untuk memudahkan proses deployment di Windows.

