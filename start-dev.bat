@echo off
title Minibee Dev Environment

echo.
echo   ^>^> Minibee Dev Environment
echo   ─────────────────────────────────────
echo   [Vite]  React App   -^>  http://localhost:3000
echo   [PHP]   Admin API   -^>  http://localhost:8080
echo   ─────────────────────────────────────
echo.

:: Check PHP
where php >nul 2>&1
if %errorlevel% neq 0 (
    echo   [WARN] PHP not found in PATH.
    echo   Please install PHP or add it to PATH, then retry.
    echo.
    pause
    exit /b 1
)

:: Start PHP backend in a new window
echo   Starting PHP backend on port 8080...
start "Minibee PHP Backend" cmd /k "php -S localhost:8080 -t admin-backend"
echo   [OK] PHP server started in a new window.

:: Small delay to let PHP bind
timeout /t 1 /nobreak >nul

:: Start Vite in current window
echo   Starting Vite dev server on port 3000...
echo.
npm run dev
