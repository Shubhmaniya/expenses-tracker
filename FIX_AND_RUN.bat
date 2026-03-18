@echo off
echo ============================================
echo  Expense Tracker - Fix Path and Start App
echo ============================================
echo.

:: Create junction so VS Code workspace path works
if not exist "D:\projects\expence-tracker" (
    echo Creating directory junction...
    mklink /J "D:\projects\expence-tracker" "D:\projects\expence_tracker"
    if errorlevel 1 (
        echo [ERROR] Failed to create junction. Try running as Administrator.
        pause
        exit /b 1
    )
    echo Junction created successfully!
) else (
    echo Junction already exists.
)

echo.
echo Installing dependencies (if needed)...
cd /d D:\projects\expence_tracker
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Pushing database schema...
call npx prisma db push

echo.
echo Seeding database with categories...
call npx prisma db seed

echo.
echo ============================================
echo  Starting app at http://localhost:3000
echo ============================================
call npm run dev
