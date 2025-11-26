#!/bin/bash

# Script Deployment untuk PRASASTA Learning Center
# Domain: prasasta.co.id

echo "🚀 Starting Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Error: backend/.env not found!${NC}"
    echo "Please create backend/.env from backend/.env.production.example"
    exit 1
fi

if [ ! -f "frontend/.env.production" ]; then
    echo -e "${YELLOW}⚠️  Warning: frontend/.env.production not found!${NC}"
    echo "Creating from template..."
    cp frontend/.env.production.example frontend/.env.production
fi

# Backend Deployment Steps
echo -e "\n${GREEN}📦 Backend Deployment${NC}"
cd backend

echo "1. Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo "2. Generating application key..."
php artisan key:generate --force

echo "3. Running migrations..."
php artisan migrate --force

echo "4. Creating storage link..."
php artisan storage:link

echo "5. Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "6. Setting permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage

cd ..

# Frontend Deployment Steps
echo -e "\n${GREEN}📦 Frontend Deployment${NC}"
cd frontend

echo "1. Installing npm dependencies..."
npm install

echo "2. Building for production..."
npm run build

cd ..

echo -e "\n${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Upload backend folder to: ~/api.prasasta.co.id/"
echo "2. Upload frontend/.next folder to: ~/public_html/"
echo "3. Upload frontend/public folder to: ~/public_html/public/"
echo "4. Ensure .env files are configured correctly"
echo "5. Test the website: https://prasasta.co.id"
echo "6. Test the API: https://api.prasasta.co.id/api/v1/courses"

