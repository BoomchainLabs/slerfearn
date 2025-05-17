// Direct production runner for SlerfHub (no build step)
// This script starts the server in production mode while using the development assets

import { execSync } from 'child_process';

console.log('🚀 Starting SlerfHub in production-like mode...');
// Set NODE_ENV to production and run the server directly
try {
  execSync('NODE_ENV=production tsx server/index.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
} catch (error) {
  console.error('❌ Error starting server:', error.message);
  process.exit(1);
}