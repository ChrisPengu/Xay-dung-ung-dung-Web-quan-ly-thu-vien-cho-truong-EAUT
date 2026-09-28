@echo off
cd /d %~dp0
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 24 is required. Install it from https://nodejs.org/en/download
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js 24.
  pause
  exit /b 1
)
node --version | findstr /B v24. >nul
if errorlevel 1 (
  echo This project requires Node.js 24. Current version:
  node --version
  pause
  exit /b 1
)
if not exist node_modules\.bin\vite.cmd (
  echo Installing project dependencies...
  call npm.cmd ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Starting EAUT Library. Keep this window open while using the website.
call npm.cmd run dev -- --host 127.0.0.1 --open
if errorlevel 1 pause
