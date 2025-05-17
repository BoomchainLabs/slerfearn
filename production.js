// Set production environment and start the application
process.env.NODE_ENV = 'production';

// Use child_process to run the same command as in package.json but with production env
import { spawn } from 'child_process';
const child = spawn('tsx', ['server/index.ts'], {
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});