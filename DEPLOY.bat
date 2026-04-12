@echo off
REM GLI Platform Deployment Script (Windows)
REM Run this script to deploy to GitHub, Vercel, and Firebase

echo =========================================
echo         GLI Platform Deployment
echo =========================================
echo.

REM Step 1: GitHub Push
echo [1/3] Pushing code to GitHub...
cd /d d:\sertifikat\GLI-Project-Web

git add .
git commit -m "feat: Article management system - production ready

- ArticleController with full CRUD operations
- AdminArticle.jsx admin interface
- Article routing and navigation
- README updated with article features
- Database schema documented
- All API endpoints implemented and tested

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

git push origin main

if %errorlevel% neq 0 (
    echo ❌ GitHub push failed
    pause
    exit /b 1
)

echo ✅ Code pushed to GitHub
echo.

REM Step 2: Backend Deploy to Vercel
echo [2/3] Deploying backend to Vercel...
echo.
echo IMPORTANT: Make sure you have:
echo   - Vercel CLI installed (npm install -g vercel)
echo   - .env file configured with all variables
echo   - Firebase & Cloudinary credentials ready
echo.
pause

cd /d d:\sertifikat\GLI-Project-Web\backend

echo Deploying backend...
call vercel deploy --prod --confirm

if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed
    pause
    exit /b 1
)

echo ✅ Backend deployed to Vercel
echo.

REM Step 3: Frontend Deploy to Firebase
echo [3/3] Deploying frontend to Firebase...
echo.
echo IMPORTANT: Make sure you have:
echo   - Firebase CLI installed (npm install -g firebase-tools)
echo   - .env.local file configured with API URL
echo   - Firebase credentials ready
echo.
pause

cd /d d:\sertifikat\GLI-Project-Web\frontend

call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo Deploying to Firebase...
call firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo ❌ Firebase deployment failed
    pause
    exit /b 1
)

echo ✅ Frontend deployed to Firebase
echo.

REM Final Summary
echo =========================================
echo         ✅ Deployment Complete!
echo =========================================
echo.
echo 🌐 Access URLs:
echo   Backend:  https://gli-project-backend.vercel.app
echo   Frontend: https://gli-project-web.web.app
echo.
echo 📊 Verify:
echo   1. Open https://gli-project-web.web.app in browser
echo   2. Check landing page loads
echo   3. Test login flow
echo   4. Navigate to admin/artikel
echo.
echo 🔗 GitHub: https://github.com/yourusername/GLI-Project-Web
echo.
pause
