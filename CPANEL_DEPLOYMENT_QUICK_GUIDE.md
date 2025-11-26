# ⚡ Quick Reference: Deployment ke cPanel

Panduan cepat untuk deployment website PRASASTA Learning Center ke cPanel.

---

## 🎯 Langkah Cepat (Quick Steps)

### 1️⃣ Persiapan File

**Backend:**
```bash
cd backend
composer install --no-dev --optimize-autoloader
# Zip semua file kecuali: node_modules, .git, vendor, .env
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Zip: .next/, public/, package.json, next.config.js, dll
```

---

### 2️⃣ Setup di cPanel

#### Backend (API)
1. **Buat Subdomain:** `api.prasasta.co.id` → Document Root: `~/api.prasasta.co.id/public`
2. **Upload & Extract:** `backend.zip` ke `~/api.prasasta.co.id/`
3. **Buat Database:** MySQL Database + User + Privileges
4. **Buat `.env`:** Copy template, isi database credentials
5. **Terminal:**
   ```bash
   cd ~/api.prasasta.co.id
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   chmod -R 775 storage
   ```

#### Frontend
1. **Upload & Extract:** `frontend.zip` ke `~/public_html/`
2. **Buat `.env.production`:** `NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1`
3. **Setup Node.js App** (jika diperlukan):
   - Application root: `~/public_html`
   - Node version: 18+
   - Start app

---

### 3️⃣ SSL Certificate

1. **cPanel > SSL/TLS Status**
2. **Run AutoSSL** untuk:
   - `prasasta.co.id`
   - `api.prasasta.co.id`

---

### 4️⃣ Testing

**Backend:**
- ✅ `https://api.prasasta.co.id/api/v1/courses`
- ✅ `https://api.prasasta.co.id/api/v1/categories`

**Frontend:**
- ✅ `https://prasasta.co.id`
- ✅ `https://prasasta.co.id/admin/login`

---

## 🔧 Konfigurasi .env Backend

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.prasasta.co.id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=username_prasasta_db
DB_USERNAME=username_prasasta_user
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id
SESSION_DOMAIN=.prasasta.co.id
```

---

## 🔧 Konfigurasi .env.production Frontend

```env
NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1
```

---

## 🐛 Troubleshooting Cepat

| Problem | Solusi |
|---------|--------|
| 500 Error | Cek `.env`, permissions `storage`, error logs |
| DB Error | Cek credentials, user privileges, host `127.0.0.1` |
| Images tidak tampil | `php artisan storage:link`, cek permissions |
| CORS Error | Cek `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN` |
| Subdomain tidak bisa | Cek DNS propagation, Document Root, tunggu beberapa menit |

---

## 📋 Checklist Singkat

- [ ] Backend uploaded & extracted
- [ ] Database created & configured
- [ ] `.env` configured
- [ ] `composer install` & `php artisan` commands run
- [ ] Frontend uploaded & extracted
- [ ] `.env.production` configured
- [ ] SSL certificates installed
- [ ] API endpoints tested
- [ ] Frontend pages tested
- [ ] Admin login tested

---

**📖 Untuk panduan lengkap:** Lihat [CPANEL_DEPLOYMENT_STEPS.md](./CPANEL_DEPLOYMENT_STEPS.md)

