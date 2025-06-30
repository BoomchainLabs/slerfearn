#!/usr/bin/env node

// Cloudflare deployment build script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building $LERF Rewards Hub for Cloudflare deployment...');

// Clean previous builds
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Build frontend
console.log('📦 Building frontend...');
execSync('npx vite build', { stdio: 'inherit' });

// Build backend for Cloudflare Workers
console.log('🔧 Building backend...');
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { stdio: 'inherit' });

// Create _functions directory for Cloudflare Pages
const functionsDir = path.join('dist', '_functions');
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
}

// Copy API routes to functions
const apiTemplate = `
export async function onRequest(context) {
  const { request, env } = context;
  
  // Import your server logic here
  // This is a template - you'll need to adapt your Express routes
  
  return new Response('API endpoint', {
    headers: { 'Content-Type': 'application/json' }
  });
}
`;

fs.writeFileSync(path.join(functionsDir, 'api.js'), apiTemplate);

console.log('✅ Build complete! Ready for Cloudflare deployment.');
console.log('📁 Files are in the dist/ directory');
console.log('📖 See cloudflare-deployment-guide.md for deployment instructions');