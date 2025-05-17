// Full production deployment script for SlerfHub
import { execSync } from 'child_process';

try {
  // Step 1: Build the frontend and server
  console.log('🏗️  Building SlerfHub for production...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Run the app in production mode
  console.log('🚀 Starting SlerfHub in production mode...');
  execSync('NODE_ENV=production node dist/index.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error during production deployment:', error.message);
  process.exit(1);
}