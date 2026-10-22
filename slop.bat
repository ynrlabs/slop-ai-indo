@echo off
if "%~1"=="" (
    echo [ERROR] Masukkan folder tujuan proyek.
    echo Contoh: slop.bat D:\project_yanuar\laravel_bengkel
    exit /b 1
)

set TARGET=%~1

if not exist "%TARGET%" (
    echo [ERROR] Folder "%TARGET%" tidak ditemukan.
    exit /b 1
)

echo Memasang Anti-Slop + DESIGN.md (Human-Crafted Standard) ke: %TARGET%
copy /Y "%~dp0DESIGN.md" "%TARGET%\" >nul
copy /Y "%~dp0AGENTS.md" "%TARGET%\" >nul
copy /Y "%~dp0antislop.md" "%TARGET%\" >nul

if not exist "%TARGET%\.agents" mkdir "%TARGET%\.agents"
xcopy /E /I /Y "%~dp0.agents" "%TARGET%\.agents" >nul

echo [SUKSES] Anti-Slop & DESIGN.md berhasil dipasang di %TARGET%!
echo AI agent kini otomatis menggunakan standar Human-Crafted (Siku tajam, kanvas bersih ala n8n).
