@echo off
cd /d "%~dp0"
call npx tsx --watch src/index.ts
pause
