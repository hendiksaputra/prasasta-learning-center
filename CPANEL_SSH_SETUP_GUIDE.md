# Panduan Setup SSH Access di cPanel

Berdasarkan screenshot SSH Access Anda, berikut yang perlu di-setup:

## ✅ Status Saat Ini

Dari screenshot, terlihat:
- ✅ Halaman **SSH Access** sudah bisa diakses
- ❌ Belum ada **Public Keys** yang terinstall
- ❌ Belum ada **Private Keys** yang terinstall

---

## 🎯 Yang Perlu Di-Setup

### Opsi 1: Menggunakan Password Authentication (Cepat & Mudah)

**Untuk deployment pertama kali, Anda TIDAK perlu setup SSH Keys!**

Anda bisa langsung menggunakan **password authentication**:

1. **Buka Terminal/SSH Client** (PuTTY, PowerShell, Git Bash)
2. **Login dengan password**:
   ```bash
   ssh username@prasasta.co.id
   ```
3. **Masukkan password cPanel** Anda
4. **Selesai!** Anda sudah bisa menggunakan Terminal

**Catatan**: Password authentication sudah aktif secara default, jadi tidak perlu setup tambahan.

---

### Opsi 2: Setup SSH Keys (Lebih Aman - Opsional)

SSH Keys lebih aman daripada password, tapi **tidak wajib** untuk deployment.

#### Langkah Setup SSH Keys:

**A. Generate SSH Key di cPanel:**

1. Di halaman **SSH Access** yang Anda lihat
2. Klik tombol **"+ Generate a New Key"**
3. Isi form:
   - **Key Name**: `my-key` (atau nama lain)
   - **Key Type**: `RSA` (default, sudah cukup)
   - **Key Size**: `2048` atau `4096` (lebih besar = lebih aman)
4. Klik **Generate Key**
5. **Download Private Key** yang di-generate (penting!)

**B. Authorize Public Key:**

1. Setelah key di-generate, akan muncul di tabel **"Public Keys"**
2. Klik **"Authorize"** pada key yang baru dibuat
3. Key sekarang sudah aktif untuk login

**C. Download & Import ke SSH Client:**

1. Klik **"View/Download"** pada Private Key
2. Download file `.ppk` (untuk PuTTY) atau `.pem` (untuk lainnya)
3. Import ke SSH client Anda:
   - **PuTTY**: Load `.ppk` file di Connection > SSH > Auth > Credentials
   - **PowerShell/Git Bash**: Gunakan file `.pem` dengan perintah:
     ```bash
     ssh -i path/to/key.pem username@prasasta.co.id
     ```

---

## 🚀 Untuk Deployment Laravel (Yang Penting)

### Yang WAJIB Di-Setup:

1. ✅ **SSH Access sudah aktif** (terlihat dari halaman yang bisa diakses)
2. ✅ **Password authentication sudah aktif** (default)

### Yang TIDAK WAJIB (Opsional):

- ❌ SSH Keys (bisa pakai password saja)
- ❌ Import keys dari PuTTY (jika pakai password)

---

## 📋 Checklist untuk Deployment

Sebelum mulai deployment, pastikan:

- [ ] ✅ SSH Access sudah bisa diakses (sudah ✓)
- [ ] ✅ Anda tahu **username** dan **password** cPanel
- [ ] ✅ Anda tahu **hostname** (prasasta.co.id atau IP server)
- [ ] ✅ SSH client sudah terinstall (PuTTY/PowerShell/Git Bash)
- [ ] ⚪ SSH Keys sudah di-setup (opsional, bisa skip)

---

## 🔧 Test SSH Connection

Setelah setup, test koneksi SSH:

### Via PuTTY (Windows):

1. Buka PuTTY
2. Masukkan:
   - **Host Name**: `prasasta.co.id`
   - **Port**: `22`
   - **Connection Type**: SSH
3. Klik **Open**
4. Login dengan username dan password

### Via PowerShell/Git Bash:

```bash
ssh username@prasasta.co.id
# Masukkan password saat diminta
```

### Via Terminal cPanel (jika tersedia):

1. Cari **"Terminal"** di cPanel
2. Klik untuk membuka Terminal di browser
3. Langsung bisa digunakan

---

## ✅ Verifikasi Setup Berhasil

Setelah login via SSH, jalankan perintah:

```bash
# Cek lokasi saat ini
pwd
# Expected: /home/username

# List file dan folder
ls -la

# Masuk ke folder backend (jika sudah di-upload)
cd ~/api.prasasta.co.id

# Test perintah Laravel
php artisan --version
```

Jika perintah di atas berhasil, berarti setup sudah benar! ✅

---

## 🎯 Kesimpulan

**Untuk deployment pertama kali:**

1. ✅ **TIDAK perlu setup SSH Keys** - gunakan password saja
2. ✅ **Langsung login** dengan username dan password cPanel
3. ✅ **Mulai deployment** Laravel

**SSH Keys hanya diperlukan jika:**
- Ingin keamanan lebih tinggi
- Ingin login tanpa password setiap kali
- Ingin disable password authentication

---

## 💡 Tips

1. **Untuk pertama kali**: Gunakan password authentication (lebih mudah)
2. **Setelah deployment selesai**: Bisa setup SSH Keys untuk keamanan jangka panjang
3. **Backup Private Key**: Jika membuat SSH Key, simpan dengan aman
4. **Jangan share credentials**: Username, password, atau SSH keys

---

## 🐛 Troubleshooting

### Problem: Tidak bisa login dengan password

**Solusi**:
- Pastikan username dan password benar
- Cek apakah hosting provider mengizinkan password authentication
- Coba reset password di cPanel

### Problem: Ingin setup SSH Keys tapi bingung

**Solusi**:
- **Skip dulu** - gunakan password authentication untuk deployment
- Setup SSH Keys nanti setelah deployment selesai
- Atau ikuti panduan di `CPANEL_TERMINAL_GUIDE.md`

---

**Kesimpulan**: Dari screenshot Anda, **tidak ada yang perlu di-setup sekarang**. Anda bisa langsung menggunakan password authentication untuk login via SSH dan mulai deployment! 🚀

