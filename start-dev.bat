@echo off
REM Refresh PATH and start dev server
set PATH=%PATH%;C:\Program Files\nodejs

cd /d "%~dp0"

echo Starting development server...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev

