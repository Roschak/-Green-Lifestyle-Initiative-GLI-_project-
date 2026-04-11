#!/bin/bash
# Script untuk remove file sensitif dari git history

echo "🔒 Removing sensitive files from git cache..."

# Remove .env files
git rm --cached backend/.env 2>/dev/null || echo "✓ backend/.env not in cache"
git rm --cached frontend/.env.local 2>/dev/null || echo "✓ frontend/.env.local not in cache"
git rm --cached frontend/.env.production 2>/dev/null || echo "✓ frontend/.env.production not in cache"

# Remove other potential sensitive files
git rm --cached serviceAccountKey.json 2>/dev/null || echo "✓ serviceAccountKey.json not in cache"
git rm --cached firebase-key.json 2>/dev/null || echo "✓ firebase-key.json not in cache"

echo ""
echo "📝 Updated .gitignore:"
echo "✅ Added backend/.env*"
echo "✅ Added frontend/.env*"
echo "✅ Added serviceAccountKey.json"
echo "✅ Added firebase-key.json"
echo "✅ Added .vercel/"
echo "✅ Added IDE configs"
echo "✅ Added logs"
echo ""
echo "🚀 Next steps:"
echo "1. git add .gitignore"
echo "2. git commit -m 'security: add sensitive files to gitignore'"
echo "3. For complete security, also run: git filter-branch -f --index-filter 'git rm --cached --ignore-unmatch backend/.env frontend/.env.local' HEAD"
echo ""
echo "⚠️  IMPORTANT: Rotate all API keys since they were committed!"
