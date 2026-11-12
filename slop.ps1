param (
    [Parameter(Mandatory=$false)]
    [string]$TargetFolder = "."
)

if ($TargetFolder -eq ".") {
    $TargetFolder = (Get-Location).Path
}

if (-not (Test-Path $TargetFolder)) {
    Write-Host "[ERROR] Folder '$TargetFolder' tidak ditemukan." -ForegroundColor Red
    exit 1
}

$source = $PSScriptRoot

Write-Host "Memasang Slop AI Indo + DESIGN.md (Human-Crafted Standard) ke: $TargetFolder" -ForegroundColor Cyan

Copy-Item -Force "$source\DESIGN.md" "$TargetFolder\"
Copy-Item -Force "$source\AGENTS.md" "$TargetFolder\"
Copy-Item -Force "$source\slop-ai-indo.md" "$TargetFolder\"

$targetAgents = Join-Path $TargetFolder ".agents"
if (-not (Test-Path $targetAgents)) {
    New-Item -ItemType Directory -Path $targetAgents -Force | Out-Null
}

Copy-Item -Recurse -Force "$source\.agents\*" "$targetAgents\"

# Render PROJECT_MAP.json otomatis di target
$ignoreFolders = @('node_modules', 'vendor', '.git', '.svn', '.hg', '.next', '.nuxt', 'dist', 'build', 'out', 'coverage', '.turbo', 'venv', '.venv', '__pycache__', 'target', '.cache', 'tmp', 'temp', 'system')
$scannedFiles = @()
Get-ChildItem -Path $TargetFolder -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Name -ne "PROJECT_MAP.json") {
        $rel = $_.FullName.Substring($TargetFolder.Length).TrimStart('\', '/') -replace '\\', '/'
        $parts = $rel.Split('/')
        $isIgnored = $false
        if ($parts.Length -gt 1) {
            foreach ($p in $parts[0..($parts.Length - 2)]) {
                if ($ignoreFolders -contains $p) {
                    $isIgnored = $true
                    break
                }
            }
        }
        if (-not $isIgnored) {
            $scannedFiles += $rel
        }
    }
}
$mapObj = [PSCustomObject]@{
    generated_at = (Get-Date).ToString("o")
    project_name = (Split-Path $TargetFolder -Leaf)
    stats = [PSCustomObject]@{
        total_files = $scannedFiles.Count
    }
    files = ($scannedFiles | Sort-Object)
}
$mapObj | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $TargetFolder "PROJECT_MAP.json") -Encoding UTF8

Write-Host "[SUKSES] Slop AI Indo & DESIGN.md berhasil dipasang di $TargetFolder!" -ForegroundColor Green
Write-Host "Peta direktori instan PROJECT_MAP.json ($($scannedFiles.Count) berkas) berhasil dibuat." -ForegroundColor Yellow
Write-Host "AI agent kini otomatis menggunakan standar Human-Crafted (Siku tajam, kanvas bersih ala n8n)." -ForegroundColor White
