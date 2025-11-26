# PowerShell Script untuk Build Frontend untuk Deployment
# Windows PowerShell Script

Write-Host "🚀 Building Frontend untuk Production..." -ForegroundColor Green

# Navigate ke folder frontend
Set-Location -Path "frontend"

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  File .env.production tidak ditemukan!" -ForegroundColor Yellow
    Write-Host "📝 Membuat dari template..." -ForegroundColor Cyan
    
    if (Test-Path ".env.production.example") {
        Copy-Item ".env.production.example" ".env.production"
        Write-Host "✅ File .env.production dibuat dari template" -ForegroundColor Green
        Write-Host "⚠️  Jangan lupa edit .env.production dan set NEXT_PUBLIC_API_URL!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Template .env.production.example tidak ditemukan!" -ForegroundColor Red
        Write-Host "📝 Membuat file .env.production baru..." -ForegroundColor Cyan
        @"
NEXT_PUBLIC_API_URL=https://api.prasasta.co.id/api/v1
"@ | Out-File -FilePath ".env.production" -Encoding utf8
        Write-Host "✅ File .env.production dibuat" -ForegroundColor Green
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Build untuk production
Write-Host "🔨 Building untuk production..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build berhasil!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 File yang perlu di-upload ke server:" -ForegroundColor Yellow
    Write-Host "   - .next/ (folder)" -ForegroundColor Gray
    Write-Host "   - public/ (folder)" -ForegroundColor Gray
    Write-Host "   - package.json" -ForegroundColor Gray
    Write-Host "   - package-lock.json" -ForegroundColor Gray
    Write-Host "   - next.config.js" -ForegroundColor Gray
    Write-Host "   - .env.production" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Upload folder .next/ dan public/ ke ~/public_html/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build gagal! Cek error di atas." -ForegroundColor Red
    exit 1
}

Set-Location -Path ".."

