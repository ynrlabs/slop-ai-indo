param (
    [Parameter(Mandatory=$false)]
    [string]$TargetFolder
)

if (-not $TargetFolder) {
    Write-Host "[ERROR] Masukkan folder tujuan proyek." -ForegroundColor Red
    Write-Host "Contoh: .\pasang-ke-project.ps1 D:\project_yanuar\laravel_bengkel" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $TargetFolder)) {
    Write-Host "[ERROR] Folder '$TargetFolder' tidak ditemukan." -ForegroundColor Red
    exit 1
}

$source = $PSScriptRoot

Write-Host "Memasang Anti-Slop + DESIGN.md (Human-Crafted Standard) ke: $TargetFolder" -ForegroundColor Cyan

Copy-Item -Force "$source\DESIGN.md" "$TargetFolder\"
Copy-Item -Force "$source\AGENTS.md" "$TargetFolder\"
Copy-Item -Force "$source\antislop.md" "$TargetFolder\"

$targetAgents = Join-Path $TargetFolder ".agents"
if (-not (Test-Path $targetAgents)) {
    New-Item -ItemType Directory -Path $targetAgents -Force | Out-Null
}

Copy-Item -Recurse -Force "$source\.agents\*" "$targetAgents\"

Write-Host "[SUKSES] Anti-Slop & DESIGN.md berhasil dipasang di $TargetFolder!" -ForegroundColor Green
Write-Host "AI agent kini otomatis menggunakan standar Human-Crafted (Siku tajam, kanvas bersih ala n8n)." -ForegroundColor White
