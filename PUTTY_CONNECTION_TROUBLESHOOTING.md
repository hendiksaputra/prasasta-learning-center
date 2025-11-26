# Troubleshooting PuTTY Connection Timeout - prasasta.co.id

## 🚨 Error yang Terjadi

**Error**: `Network error: Connection timed out`

Ini berarti PuTTY tidak bisa terhubung ke server SSH. Berikut langkah troubleshooting:

---

## ✅ Langkah Troubleshooting

### 1. Cek Hostname dan Port

**Di PuTTY Configuration:**

1. **Host Name (or IP address)**: 
   - Coba gunakan **IP server** langsung, bukan domain
   - Untuk mendapatkan IP server:
     - Login ke cPanel
     - Buka **"Server Information"** atau **"Account Information"**
     - Lihat **"Shared IP Address"** atau **"Dedicated IP Address"**
   - Contoh: `123.456.789.0` (ganti dengan IP server Anda)

2. **Port**: 
   - Default SSH port adalah **22**
   - Jika port 22 tidak berfungsi, coba port alternatif:
     - **2222** (beberapa hosting menggunakan port ini)
     - **22000** (port alternatif lain)

3. **Connection type**: Pastikan pilih **SSH**

**Contoh Konfigurasi:**
```
Host Name: 123.456.789.0  (IP server, bukan domain)
Port: 22
Connection type: SSH
```

---

### 2. Cek Apakah SSH Access Diaktifkan

**Di cPanel:**

1. Login ke cPanel
2. Buka **"SSH Access"** (yang sudah Anda lihat)
3. Cari opsi **"Enable SSH Access"** atau **"SSH Access Status"**
4. Pastikan SSH Access sudah **di-enable**

**Jika tidak ada opsi enable:**
- Beberapa hosting provider mengaktifkan SSH secara default
- Beberapa hosting memerlukan request ke support untuk enable SSH
- Hubungi support hosting jika tidak yakin

---

### 3. Cek Firewall dan Port Blocking

**Kemungkinan penyebab:**

- **ISP memblokir port 22**: Beberapa ISP di Indonesia memblokir port 22
- **Firewall lokal**: Antivirus atau firewall di komputer Anda
- **Firewall server**: Firewall di server hosting

**Solusi:**

**A. Coba Port Alternatif:**
```
Port: 2222
atau
Port: 22000
```

**B. Cek dengan Telnet (test koneksi):**
```cmd
# Buka Command Prompt (Windows)
telnet prasasta.co.id 22
# atau
telnet [IP_SERVER] 22
```

Jika connection timeout juga terjadi di telnet, berarti port 22 memang diblokir.

**C. Gunakan VPN atau Mobile Hotspot:**
- Coba koneksi dari jaringan berbeda (mobile hotspot)
- Atau gunakan VPN untuk bypass blocking ISP

---

### 4. Cek Server Information di cPanel

**Langkah:**

1. Login ke cPanel
2. Buka **"Server Information"** atau **"Account Information"**
3. Catat informasi berikut:
   - **Shared IP Address** atau **Dedicated IP Address**
   - **Server Name**
   - **SSH Port** (jika disebutkan)

**Gunakan IP Address langsung di PuTTY**, bukan domain:
```
Host Name: [IP_ADDRESS_DARI_CPANEL]
Port: 22
```

---

### 5. Cek Apakah Hosting Provider Mengizinkan SSH

**Beberapa hosting provider:**
- ✅ Mengizinkan SSH untuk semua paket
- ⚠️ Hanya mengizinkan SSH untuk VPS/Dedicated Server
- ❌ Tidak mengizinkan SSH untuk shared hosting

**Cara cek:**
- Lihat dokumentasi hosting provider Anda
- Atau hubungi support hosting dan tanyakan:
  - "Apakah SSH access tersedia untuk paket saya?"
  - "Port SSH berapa yang digunakan?"
  - "Apakah ada IP whitelist yang perlu di-setup?"

---

### 6. Alternatif: Gunakan Terminal cPanel (Jika SSH Tidak Tersedia)

Jika SSH benar-benar tidak bisa diakses, gunakan **Terminal di cPanel**:

1. Login ke cPanel
2. Cari **"Terminal"** di search box
3. Klik **"Terminal"** atau **"Web Terminal"**
4. Terminal akan terbuka di browser (tidak perlu PuTTY)

**Keuntungan:**
- Tidak perlu setup SSH client
- Tidak perlu khawatir tentang port blocking
- Langsung bisa digunakan

---

### 7. Test Koneksi dengan Tools Lain

**A. Test dengan PowerShell:**
```powershell
# Test koneksi ke port 22
Test-NetConnection -ComputerName prasasta.co.id -Port 22

# Atau dengan IP server
Test-NetConnection -ComputerName [IP_SERVER] -Port 22
```

**B. Test dengan Online Tools:**
- Gunakan website seperti `https://www.yougetsignal.com/tools/open-ports/`
- Test apakah port 22 terbuka di server Anda

---

## 🔧 Konfigurasi PuTTY yang Disarankan

**Setting PuTTY:**

1. **Session:**
   - Host Name: `[IP_SERVER]` (gunakan IP, bukan domain)
   - Port: `22` (atau port alternatif jika 22 tidak berfungsi)
   - Connection type: `SSH`

2. **Connection > Data:**
   - Auto-login username: `[USERNAME_CPANEL]`

3. **Connection > SSH:**
   - Preferred SSH protocol version: `2`

4. **Connection > SSH > Auth:**
   - (Jika menggunakan SSH Key, browse untuk private key)

5. **Connection > SSH > Tunnels:**
   - (Biarkan default, tidak perlu diubah)

6. **Session:**
   - Saved Sessions: `prasasta-ssh`
   - Klik **Save** untuk menyimpan konfigurasi

---

## 📋 Checklist Troubleshooting

Coba langkah-langkah berikut secara berurutan:

- [ ] **Coba gunakan IP server** langsung (bukan domain)
- [ ] **Cek port SSH** di cPanel Server Information
- [ ] **Coba port alternatif** (2222, 22000)
- [ ] **Test dengan telnet** untuk cek apakah port terbuka
- [ ] **Cek apakah SSH Access di-enable** di cPanel
- [ ] **Coba dari jaringan berbeda** (mobile hotspot)
- [ ] **Hubungi support hosting** untuk konfirmasi SSH availability
- [ ] **Gunakan Terminal cPanel** sebagai alternatif

---

## 🎯 Solusi Cepat (Jika SSH Tidak Bisa)

**Jika SSH benar-benar tidak bisa diakses**, gunakan alternatif berikut:

### Opsi 1: Terminal cPanel (Paling Mudah)

1. Login ke cPanel
2. Cari **"Terminal"** di search box
3. Klik untuk membuka Terminal di browser
4. Langsung bisa digunakan untuk perintah Laravel

### Opsi 2: File Manager + Code Editor

Untuk deployment, Anda bisa:
1. Upload file via **File Manager**
2. Edit file via **Code Editor** di cPanel
3. Jalankan beberapa perintah via **Cron Jobs** (jika perlu)

### Opsi 3: FTP/SFTP Client

1. Gunakan **FileZilla** atau **WinSCP**
2. Upload file via FTP/SFTP
3. Edit file via Code Editor di cPanel

---

## 💡 Tips

1. **Gunakan IP server** langsung lebih reliable daripada domain
2. **Port 22 sering diblokir ISP**, coba port alternatif
3. **Terminal cPanel** adalah alternatif terbaik jika SSH tidak bisa
4. **Hubungi support hosting** jika masih tidak bisa - mereka bisa bantu enable SSH atau beri tahu port yang benar

---

## 🆘 Jika Masih Tidak Bisa

**Hubungi Support Hosting** dan tanyakan:

1. "Apakah SSH access tersedia untuk paket hosting saya?"
2. "Port SSH berapa yang digunakan?"
3. "Apakah ada IP whitelist yang perlu di-setup?"
4. "Bagaimana cara enable SSH access?"
5. "Apakah ada alternatif untuk menjalankan perintah Laravel?"

**Sementara itu**, gunakan **Terminal cPanel** untuk deployment. Terminal cPanel biasanya selalu tersedia dan tidak perlu setup SSH client.

---

## ✅ Kesimpulan

**Error "Connection timed out" biasanya disebabkan oleh:**
1. Port 22 diblokir oleh ISP
2. SSH Access belum di-enable di hosting
3. Menggunakan domain instead of IP server
4. Firewall memblokir koneksi

**Solusi tercepat:**
- Gunakan **Terminal cPanel** (tidak perlu PuTTY)
- Atau hubungi **support hosting** untuk enable SSH

**Untuk deployment Laravel**, Terminal cPanel sudah cukup untuk menjalankan semua perintah yang diperlukan! 🚀

