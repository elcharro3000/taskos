#!/bin/bash

echo "🚀 Setting up TaskOS database..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migration
echo "🗄️ Running database migration..."
npx prisma db push

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Database setup complete!"
echo "🎉 You can now run 'npm run dev' to start the development server"
