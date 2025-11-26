# Deployment Checklist - prasasta.co.id

Gunakan checklist ini untuk memastikan semua langkah deployment sudah dilakukan dengan benar.

## Pre-Deployment

- [ ] Backup database lokal (jika ada data penting)
- [ ] Backup file storage (images, uploads)
- [ ] Test semua fitur di localhost
- [ ] Pastikan tidak ada error di console
- [ ] Pastikan semua environment variables sudah disiapkan

## Backend Deployment

### File Upload
- [ ] Upload semua file backend ke `~/api.prasasta.co.id/`
- [ ] Pastikan file `.env` sudah dibuat (jangan upload `.env.local`)
- [ ] Pastikan folder `vendor/` sudah di-upload atau install via composer di server

### Environment Configuration
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_URL=https://api.prasasta.co.id`
- [ ] Set database credentials yang benar
- [ ] Set `SANCTUM_STATEFUL_DOMAINS=prasasta.co.id,www.prasasta.co.id`
- [ ] Set `SESSION_DOMAIN=.prasasta.co.id`

### Database Setup
- [ ] Database sudah dibuat di cPanel
- [ ] Database user sudah dibuat dan diberikan privileges
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan db:seed --class=AdminUserSeeder` (jika perlu)

### Laravel Setup
- [ ] Run `php artisan key:generate`
- [ ] Run `php artisan storage:link`
- [ ] Run `composer install --no-dev --optimize-autoloader`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`

### Permissions
- [ ] Set `chmod -R 755 storage bootstrap/cache`
- [ ] Set `chmod -R 775 storage`
- [ ] Pastikan folder `storage/app/public` dapat ditulis

### Folder Structure
- [ ] Folder `storage/app/public/categories` sudah dibuat
- [ ] Folder `storage/app/public/testimonials` sudah dibuat
- [ ] Folder `storage/app/public/gallery` sudah dibuat
- [ ] Folder `storage/app/public/facilities` sudah dibuat

## Frontend Deployment

### Build
- [ ] Update `NEXT_PUBLIC_API_URL` di `.env.production`
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Pastikan build berhasil tanpa error

### File Upload
- [ ] Upload folder `.next/` ke server
- [ ] Upload folder `public/` ke server
- [ ] Upload `package.json` dan `package-lock.json`
- [ ] Upload `next.config.js` (atau gunakan `next.config.production.js`)

### Environment
- [ ] File `.env.production` sudah di-upload
- [ ] Pastikan `NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1`

## Domain & SSL Configuration

### Subdomain Setup
- [ ] Subdomain `api.prasasta.co.id` sudah dibuat
- [ ] Document root subdomain mengarah ke `~/api.prasasta.co.id/public`
- [ ] Domain utama `prasasta.co.id` mengarah ke `~/public_html`

### SSL Certificate
- [ ] SSL certificate sudah di-install untuk `prasasta.co.id`
- [ ] SSL certificate sudah di-install untuk `api.prasasta.co.id`
- [ ] Test HTTPS: `https://prasasta.co.id`
- [ ] Test HTTPS: `https://api.prasasta.co.id`

## Testing

### API Testing
- [ ] Test: `https://api.prasasta.co.id/api/v1/courses`
- [ ] Test: `https://api.prasasta.co.id/api/v1/categories`
- [ ] Test: `https://api.prasasta.co.id/api/v1/testimonials`
- [ ] Test: `https://api.prasasta.co.id/api/v1/gallery`
- [ ] Test: `https://api.prasasta.co.id/api/v1/facilities`

### Frontend Testing
- [ ] Homepage dapat diakses: `https://prasasta.co.id`
- [ ] Halaman courses dapat diakses: `https://prasasta.co.id/courses`
- [ ] Detail course dapat diakses
- [ ] Images dapat ditampilkan dengan benar
- [ ] Admin login dapat diakses: `https://prasasta.co.id/admin/login`

### Admin Panel Testing
- [ ] Login admin berfungsi
- [ ] CRUD courses berfungsi
- [ ] CRUD categories berfungsi
- [ ] CRUD testimonials berfungsi
- [ ] CRUD gallery berfungsi
- [ ] CRUD facilities berfungsi
- [ ] File upload berfungsi

### Functionality Testing
- [ ] Form pendaftaran berfungsi
- [ ] Form kontak berfungsi
- [ ] Images dari storage dapat diakses
- [ ] API CORS tidak error
- [ ] Authentication berfungsi dengan benar

## Security Checklist

- [ ] `APP_DEBUG=false` di production
- [ ] File `.env` tidak dapat diakses dari browser
- [ ] Folder `storage` tidak dapat diakses langsung (kecuali public)
- [ ] SSL certificate aktif dan valid
- [ ] Admin password sudah diganti dari default
- [ ] Database credentials kuat
- [ ] CORS configuration benar
- [ ] File permissions sudah benar

## Performance Optimization

- [ ] Laravel cache sudah di-enable
- [ ] Route cache sudah di-generate
- [ ] Config cache sudah di-generate
- [ ] View cache sudah di-generate
- [ ] Next.js build sudah di-optimize
- [ ] Images sudah di-optimize (jika perlu)

## Monitoring & Maintenance

- [ ] Error logging aktif
- [ ] Backup database sudah di-setup (jika perlu)
- [ ] Monitoring tools sudah di-setup (jika perlu)
- [ ] Documentation sudah di-update

## Post-Deployment

- [ ] Test semua fitur utama
- [ ] Monitor error logs selama 24 jam pertama
- [ ] Backup database setelah deployment
- [ ] Update dokumentasi jika ada perubahan
- [ ] Informasikan tim tentang deployment

---

## Troubleshooting Quick Reference

### API tidak dapat diakses
1. Cek `.htaccess` di folder `public/`
2. Cek file permissions
3. Cek error log di cPanel

### Images tidak tampil
1. Cek `php artisan storage:link` sudah dijalankan
2. Cek permissions folder `storage/app/public`
3. Cek URL images di database

### CORS Error
1. Cek `config/cors.php`
2. Cek `SANCTUM_STATEFUL_DOMAINS` di `.env`
3. Cek `SESSION_DOMAIN` di `.env`

### Database Error
1. Cek credentials di `.env`
2. Cek database user privileges
3. Cek database host (biasanya `127.0.0.1`)

---

**Catatan**: Checklist ini harus diisi secara lengkap sebelum menganggap deployment selesai.

