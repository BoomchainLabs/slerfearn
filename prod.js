// Simple production mode runner for SlerfHub
import { execSync } from 'child_process';

console.log('🚀 Starting SlerfHub in production mode...');
execSync('NODE_ENV=production tsx server/index.ts', { stdio: 'inherit' });