# Slop AI Indo Remote Installer (Windows PowerShell 5.1+)
# Penggunaan: irm https://raw.githubusercontent.com/yanuar1997/slop-ai-indo/master/install.ps1 | iex

$ErrorActionPreference = "Stop"
$target = (Get-Location).Path
$repoZipUrl = "https://github.com/yanuar1997/slop-ai-indo/archive/refs/heads/master.zip"
$tempZip = Join-Path $env:TEMP "slop-ai-indo-master-$([guid]::NewGuid().ToString().Substring(0,8)).zip"
$tempExtract = Join-Path $env:TEMP "slop-ai-indo-extract-$([guid]::NewGuid().ToString().Substring(0,8))"

Write-Host "`n=== Memasang Paket Lengkap Slop AI Indo (Human-Crafted Standard) ===" -ForegroundColor Cyan
Write-Host "Target folder: $target" -ForegroundColor Gray
Write-Host "Mengunduh dari GitHub (yanuar1997/slop-ai-indo)..." -ForegroundColor Yellow

try {
    # Download zip archive
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $repoZipUrl -OutFile $tempZip -UseBasicParsing

    if (Test-Path $tempExtract) { Remove-Item -Recurse -Force $tempExtract }
    Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

    $sourceDir = Join-Path $tempExtract "slop-ai-indo-master"
    if (-not (Test-Path $sourceDir)) {
        $sourceDir = (Get-ChildItem -Path $tempExtract -Directory | Select-Object -First 1).FullName
    }

    # Salin berkas utama
    Copy-Item -Force "$sourceDir\DESIGN.md" "$target\"
    Copy-Item -Force "$sourceDir\AGENTS.md" "$target\"
    Copy-Item -Force "$sourceDir\slop-ai-indo.md" "$target\"

    # Salin folder konfigurasi .agents
    $targetAgents = Join-Path $target ".agents"
    if (-not (Test-Path $targetAgents)) {
        New-Item -ItemType Directory -Path $targetAgents -Force | Out-Null
    }
    Copy-Item -Recurse -Force "$sourceDir\.agents\*" "$targetAgents\"

    Write-Host "`n[SUKSES] Paket lengkap Slop AI Indo & DESIGN.md berhasil dipasang!" -ForegroundColor Green
    Write-Host "Berkas terpasang:" -ForegroundColor Gray
    Write-Host "  - DESIGN.md (Standar estetika human-crafted)" -ForegroundColor White
    Write-Host "  - AGENTS.md (Inisialisasi aturan otomatis agen)" -ForegroundColor White
    Write-Host "  - slop-ai-indo.md (Filter inti 38 aturan)" -ForegroundColor White
    Write-Host "  - .agents/ (Seluruh skill & rules)" -ForegroundColor White
    Write-Host "`nAI Agent Anda kini otomatis aktif menggunakan standar Human-Crafted!`n" -ForegroundColor Cyan
}
catch {
    Write-Host "`n[ERROR] Gagal memasang Slop AI Indo: $_" -ForegroundColor Red
}
finally {
    # Bersihkan file temporary
    if (Test-Path $tempZip) { Remove-Item -Force $tempZip -ErrorAction SilentlyContinue }
    if (Test-Path $tempExtract) { Remove-Item -Recurse -Force $tempExtract -ErrorAction SilentlyContinue }
}
