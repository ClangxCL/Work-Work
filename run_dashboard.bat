@echo off
chcp 65001 > nul
title Aging Analytics Dashboard (ระบบแดชบอร์ดสุขภาพผู้สูงอายุไทย)

echo ==========================================================
echo    🏥 Thailand Aging Health & Clinical Analytics Dashboard
echo    กรมการแพทย์ กระทรวงสาธารณสุข
echo ==========================================================
echo.
echo กำลังเริ่มต้นระบบแดชบอร์ด...
echo.

cd /d "%~dp0aging-analytics-dashboard"

:: ตรวจสอบ node_modules
if not exist "node_modules" (
    echo กำลังติดตั้ง Dependencies ครั้งแรก (โปรดรอสักครู่)...
    call npm install
)

:: เปิดเบราว์เซอร์อัตโนมัติหลังจากรอเซิร์ฟเวอร์เริ่ม 2 วินาที
start "" cmd /c "timeout /t 2 /nobreak > nul && start http://localhost:5173/"

:: รัน Vite dev server
call npm run dev

pause
