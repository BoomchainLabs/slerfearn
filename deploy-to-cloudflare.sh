#!/bin/bash

# $LERF Rewards Hub - Cloudflare Deployment Script
echo "🚀 Deploying $LERF Rewards Hub to boomchainlab.com..."

# Step 1: Install Wrangler CLI (if not already installed)
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Step 2: Build the application
echo "Building application..."
npm run build

# Step 3: Deploy to Cloudflare Workers
echo "Deploying to Cloudflare..."
wrangler deploy

# Step 4: Set up custom domain (if not already configured)
echo "Setting up custom domain: boomchainlab.com"
wrangler domains add boomchainlab.com

echo "✅ Deployment complete!"
echo "🌐 Your $LERF Rewards Hub is now live at: https://boomchainlab.com"
echo ""
echo "Next steps:"
echo "1. Configure your DATABASE_URL in Cloudflare Dashboard"
echo "2. Set up any additional environment variables"
echo "3. Test the deployment at https://boomchainlab.com"