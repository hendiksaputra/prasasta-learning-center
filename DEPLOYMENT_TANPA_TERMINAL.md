# Panduan Deployment Tanpa Terminal/SSH - prasasta.co.id

Jika Terminal atau SSH tidak tersedia di hosting Anda, berikut cara deployment Laravel tanpa perlu Terminal/SSH.

---

## ✅ Yang Bisa Dilakukan Tanpa Terminal/SSH

1. ✅ **Upload file** via File Manager
2. ✅ **Edit file** via Code Editor di cPanel
3. ✅ **Setup database** via phpMyAdmin
4. ✅ **Jalankan beberapa perintah** via PHP Script atau Cron Jobs
5. ✅ **Setup environment** via File Manager

---

## 📋 Langkah-Langkah Deployment Tanpa Terminal

### Langkah 1: Upload File Backend

1. **Buka File Manager** di cPanel
2. **Buat folder** `api.prasasta.co.id` di root (bukan di public_html)
3. **Upload file backend**:
   - Upload semua file dari folder `backend/` (kecuali `vendor/`, `node_modules/`, `.git/`, `.env`)
   - Atau upload file `backend.zip` dan extract di server

**Catatan**: Folder `vendor/` tidak perlu di-upload, akan diinstall via Composer di server (jika tersedia) atau bisa di-upload manual.

---

### Langkah 2: Buat File .env

1. **Di File Manager**, buka folder `api.prasasta.co.id`
2. **Enable "Show Hidden Files"** di Settings File Manager
3. **Buat file baru** bernama `.env`
4. **Klik kanan** file `.env` > **Edit** atau **Code Edit**
5. **Paste isi** file `.env` berikut:

```env
APP_NAME="PRASASTA Learning Center"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.prasasta.co.id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prasastaco_prasasta
DB_USERNAME=prasastaco_prasasta_user
DB_PASSWORD=your_password_here

SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
SESSION_DOMAIN=.prasasta.co.id
```

**Ganti**:
- `DB_DATABASE`: Nama database yang sudah dibuat
- `DB_USERNAME`: Username database
- `DB_PASSWORD`: Password database

---

### Langkah 3: Generate APP_KEY Tanpa Terminal

**Metode 1: Via PHP Script (Recommended)**

1. **Buat file PHP** di folder `api.prasasta.co.id/public/` dengan nama `generate-key.php`:

```php
<?php
// generate-key.php
// Akses via browser: https://api.prasasta.co.id/generate-key.php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Generate key
Artisan::call('key:generate', ['--force' => true]);

echo "Application key generated successfully!";
echo "<br>Key: " . config('app.key');
echo "<br><br><strong>HAPUS FILE INI SETELAH KEY DI-GENERATE!</strong>";
```

2. **Akses via browser**: `https://api.prasasta.co.id/generate-key.php`
3. **Copy APP_KEY** yang muncul
4. **Edit file `.env`** dan paste APP_KEY
5. **Hapus file** `generate-key.php` setelah selesai

**Metode 2: Generate Manual**

Jika metode 1 tidak berfungsi, generate key secara manual:

1. **Buka**: https://generate-random.org/api-key-generator
2. **Generate** random key
3. **Format**: `base64:YOUR_RANDOM_KEY_HERE`
4. **Paste** ke file `.env` di `APP_KEY=`

---

### Langkah 4: Install Composer Dependencies

**Jika Composer tersedia di cPanel:**

1. **Buka "Terminal"** atau **"SSH Access"** (jika tersedia)
2. **Jalankan**: `composer install --no-dev --optimize-autoloader`

**Jika Composer TIDAK tersedia:**

**Opsi A: Upload vendor folder dari lokal**
1. **Di komputer lokal**, jalankan: `composer install --no-dev`
2. **Upload folder** `vendor/` ke server via File Manager
3. **Pastikan permissions** folder vendor benar

**Opsi B: Gunakan Composer via Browser**
1. **Download** Composer PHAR: https://getcomposer.org/download/
2. **Upload** `composer.phar` ke folder `api.prasasta.co.id/`
3. **Buat file PHP** `install-composer.php`:

```php
<?php
// install-composer.php
// Akses via browser: https://api.prasasta.co.id/install-composer.php

chdir(__DIR__);
exec('php composer.phar install --no-dev --optimize-autoloader 2>&1', $output);
echo implode("\n", $output);
echo "<br><br><strong>HAPUS FILE INI SETELAH SELESAI!</strong>";
```

4. **Akses via browser** untuk install dependencies
5. **Hapus file** setelah selesai

---

### Langkah 5: Setup Database

1. **Buka phpMyAdmin** di cPanel
2. **Buat database** baru (jika belum)
3. **Import schema** via phpMyAdmin:
   - Buka database yang sudah dibuat
   - Klik tab **"Import"**
   - Upload file SQL (jika ada) atau buat tabel manual

**Atau jalankan migrations via PHP Script:**

1. **Buat file** `run-migrations.php` di folder `api.prasasta.co.id/public/`:

```php
<?php
// run-migrations.php
// Akses via browser: https://api.prasasta.co.id/run-migrations.php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

try {
    Artisan::call('migrate', ['--force' => true]);
    echo "Migrations completed successfully!";
    echo "<br>Output: <pre>" . Artisan::output() . "</pre>";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

echo "<br><br><strong>HAPUS FILE INI SETELAH MIGRATIONS SELESAI!</strong>";
```

2. **Akses via browser**: `https://api.prasasta.co.id/run-migrations.php`
3. **Hapus file** setelah migrations selesai

---

### Langkah 6: Create Storage Link

**Buat file** `create-storage-link.php` di folder `api.prasasta.co.id/public/`:

```php
<?php
// create-storage-link.php
// Akses via browser: https://api.prasasta.co.id/create-storage-link.php

$target = __DIR__ . '/../storage/app/public';
$link = __DIR__ . '/storage';

if (file_exists($link)) {
    echo "Storage link already exists!";
} else {
    if (symlink($target, $link)) {
        echo "Storage link created successfully!";
    } else {
        echo "Failed to create storage link. You may need to create it manually via File Manager.";
        echo "<br>Create symbolic link from: <code>$target</code> to: <code>$link</code>";
    }
}

echo "<br><br><strong>HAPUS FILE INI SETELAH SELESAI!</strong>";
```

**Atau buat manual via File Manager:**

1. **Buka File Manager**
2. **Masuk ke folder** `api.prasasta.co.id/public/`
3. **Buat folder** `storage` (jika belum ada)
4. **Atau buat symbolic link** dari `storage/app/public` ke `public/storage`

---

### Langkah 7: Set Permissions

**Via File Manager:**

1. **Buka File Manager**
2. **Masuk ke folder** `api.prasasta.co.id/storage/`
3. **Klik kanan** folder `storage/` > **Change Permissions**
4. **Set permissions**: `775` atau `755`
5. **Apply** ke semua subfolder

**Atau buat file PHP** `set-permissions.php`:

```php
<?php
// set-permissions.php
chmod(__DIR__ . '/../storage', 0775);
chmod(__DIR__ . '/../bootstrap/cache', 0755);
echo "Permissions set successfully!";
echo "<br><br><strong>HAPUS FILE INI SETELAH SELESAI!</strong>";
```

---

### Langkah 8: Optimize Laravel

**Buat file** `optimize.php` di folder `api.prasasta.co.id/public/`:

```php
<?php
// optimize.php
// Akses via browser: https://api.prasasta.co.id/optimize.php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

try {
    Artisan::call('config:cache');
    Artisan::call('route:cache');
    Artisan::call('view:cache');
    
    echo "Laravel optimized successfully!";
    echo "<br>Config cached";
    echo "<br>Routes cached";
    echo "<br>Views cached";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

echo "<br><br><strong>HAPUS FILE INI SETELAH SELESAI!</strong>";
```

---

## 🔒 Security: Hapus File Helper Setelah Selesai

**PENTING**: Setelah deployment selesai, **HAPUS semua file helper PHP** yang dibuat:

- ❌ `generate-key.php`
- ❌ `run-migrations.php`
- ❌ `create-storage-link.php`
- ❌ `set-permissions.php`
- ❌ `optimize.php`
- ❌ `install-composer.php`

File-file ini berbahaya jika dibiarkan di production!

---

## 📋 Checklist Deployment Tanpa Terminal

- [ ] File backend sudah di-upload ke `api.prasasta.co.id/`
- [ ] File `.env` sudah dibuat dan dikonfigurasi
- [ ] APP_KEY sudah di-generate
- [ ] Composer dependencies sudah di-install (vendor folder)
- [ ] Database sudah dibuat dan migrations sudah dijalankan
- [ ] Storage link sudah dibuat
- [ ] Permissions sudah di-set
- [ ] Laravel sudah di-optimize (cache)
- [ ] File helper PHP sudah dihapus
- [ ] Test API endpoint: `https://api.prasasta.co.id/api/v1/courses`

---

## 🎯 Alternatif: Gunakan File Manager + Code Editor

Untuk deployment tanpa Terminal, Anda bisa:

1. **Upload file** via File Manager
2. **Edit file** via Code Editor di cPanel
3. **Jalankan perintah** via PHP Script (seperti contoh di atas)
4. **Setup database** via phpMyAdmin

**Keuntungan**:
- ✅ Tidak perlu Terminal/SSH
- ✅ Semua bisa dilakukan via browser
- ✅ Mudah dan aman

**Kekurangan**:
- ⚠️ Perlu membuat file helper PHP sementara
- ⚠️ Harus hapus file helper setelah selesai
- ⚠️ Beberapa perintah mungkin lebih kompleks

---

## 💡 Tips

1. **Backup file** sebelum melakukan perubahan besar
2. **Test di lokal** dulu sebelum deploy ke production
3. **Hapus file helper** setelah selesai untuk keamanan
4. **Monitor error logs** di cPanel setelah deployment
5. **Test semua endpoint** setelah deployment selesai

---

## 🆘 Jika Masih Ada Masalah

Jika ada masalah saat deployment tanpa Terminal:

1. **Cek error logs** di cPanel > Metrics > Errors
2. **Cek file permissions** sudah benar
3. **Cek database connection** di file `.env`
4. **Hubungi support hosting** untuk bantuan lebih lanjut

---

**Kesimpulan**: Meskipun Terminal/SSH tidak tersedia, Anda tetap bisa melakukan deployment Laravel dengan menggunakan File Manager, Code Editor, dan PHP Script helper! 🚀

