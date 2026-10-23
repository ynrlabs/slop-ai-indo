@echo off
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%CD%"
if "%TARGET%"=="." set "TARGET=%CD%"

if not exist "%TARGET%" (
    echo [ERROR] Folder "%TARGET%" tidak ditemukan.
    exit /b 1
)

echo Memasang Slop AI Indo + DESIGN.md (Human-Crafted Standard) ke: %TARGET%
copy /Y "%~dp0DESIGN.md" "%TARGET%\" >nul
copy /Y "%~dp0AGENTS.md" "%TARGET%\" >nul
copy /Y "%~dp0slop-ai-indo.md" "%TARGET%\" >nul

if not exist "%TARGET%\.agents" mkdir "%TARGET%\.agents"
xcopy /E /I /Y "%~dp0.agents" "%TARGET%\.agents" >nul

echo [SUKSES] Slop AI Indo & DESIGN.md berhasil dipasang di %TARGET%!
echo AI agent kini otomatis menggunakan standar Human-Crafted (Siku tajam, kanvas bersih ala n8n).
