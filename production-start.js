// Production startup script for SlerfHub
console.log('Starting SlerfHub in production mode...');

const { execSync } = require('child_process');

try {
  // First build the application for production
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Then start in production mode
  console.log('Starting server in production mode...');
  execSync('NODE_ENV=production node dist/index.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting production server:', error.message);
  process.exit(1);
}