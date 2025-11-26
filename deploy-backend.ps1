# PowerShell Script untuk Membuat Zip Backend untuk Deployment
# Windows PowerShell Script

Write-Host "📦 Membuat zip file untuk backend deployment..." -ForegroundColor Green

# Navigate ke folder backend
Set-Location -Path "backend"

# Hapus zip lama jika ada
if (Test-Path "../backend.zip") {
    Remove-Item "../backend.zip" -Force
    Write-Host "✓ Menghapus zip lama" -ForegroundColor Yellow
}

# Buat zip file dengan exclude folder tertentu
Write-Host "📦 Mengompres file backend..." -ForegroundColor Cyan

# Gunakan Compress-Archive dengan exclude pattern
Get-ChildItem -Path . -Recurse | 
    Where-Object {
        $_.FullName -notmatch "node_modules" -and
        $_.FullName -notmatch "\.git" -and
        $_.FullName -notmatch "\.env$" -and
        $_.FullName -notmatch "vendor" -and
        $_.FullName -notmatch "\.env\.backup" -and
        $_.FullName -notmatch "storage/logs" -and
        $_.FullName -notmatch "storage/framework/cache" -and
        $_.FullName -notmatch "storage/framework/sessions" -and
        $_.FullName -notmatch "storage/framework/views"
    } | 
    Compress-Archive -DestinationPath "../backend.zip" -CompressionLevel Optimal -Force

Write-Host "✅ Zip file berhasil dibuat: ../backend.zip" -ForegroundColor Green
Write-Host ""
Write-Host "📋 File yang di-exclude:" -ForegroundColor Yellow
Write-Host "   - node_modules/" -ForegroundColor Gray
Write-Host "   - .git/" -ForegroundColor Gray
Write-Host "   - .env" -ForegroundColor Gray
Write-Host "   - vendor/" -ForegroundColor Gray
Write-Host "   - storage/logs/" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Catatan: Install vendor di server dengan: composer install --no-dev" -ForegroundColor Cyan

Set-Location -Path ".."

