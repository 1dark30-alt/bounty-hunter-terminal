@echo off
cd /d "%~dp0"
echo Starting Bounty Hunter Local Server on port 8080...
:: Open the browser after a short delay to allow the server to boot up
start /b cmd /c "timeout /t 2 >nul && start http://localhost:8080/"
node server.js
