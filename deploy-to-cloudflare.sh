#!/bin/bash

echo "🚀 Preparing $LERF Rewards Hub for Cloudflare deployment..."

# Install wrangler if not present
if ! command -v wrangler &> /dev/null; then
    echo "Installing Cloudflare Wrangler CLI..."
    npm install -g wrangler
fi

# Build the application
echo "📦 Building application..."
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deployment-package
cp -r dist/* deployment-package/
cp package.json deployment-package/
cp package-lock.json deployment-package/
cp wrangler.toml deployment-package/
cp cloudflare-deployment-guide.md deployment-package/

echo "✅ Deployment package ready in ./deployment-package/"
echo ""
echo "Next steps for boomchainlab.com deployment:"
echo "1. cd deployment-package"
echo "2. Set up your environment variables in Cloudflare dashboard"
echo "3. Configure your domain DNS to point to Cloudflare"
echo "4. Deploy using: wrangler pages deploy"
echo ""
echo "See cloudflare-deployment-guide.md for detailed instructions"