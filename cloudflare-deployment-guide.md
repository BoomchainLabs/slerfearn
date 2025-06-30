# Cloudflare Deployment Guide for $LERF Rewards Hub

## Prerequisites
- Cloudflare account with your domain `boomchainlab.com`
- Database URL (from Neon Database or similar PostgreSQL provider)
- Environment variables configured

## Deployment Options

### Option A: Cloudflare Pages (Static + Functions)
Best for frontend with serverless backend functions.

### Option B: Cloudflare Workers (Full Stack)
Best for complete Node.js application deployment.

## Steps for Cloudflare Pages Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Upload to Cloudflare Pages
- Go to Cloudflare Dashboard → Pages
- Create new project
- Upload the `dist` folder contents
- Configure build settings:
  - Build command: `npm run build`
  - Build output directory: `dist`

### 3. Environment Variables
Set these in Cloudflare Pages settings:
```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
```

### 4. Custom Domain Setup
- In Pages project settings → Custom domains
- Add `boomchainlab.com`
- Configure DNS records as shown

## Database Migration
Before deployment, ensure your database is set up:
```bash
npm run db:push
```

## File Structure for Deployment
```
dist/
├── index.html          # Frontend entry
├── assets/            # Static assets
├── index.js           # Backend server (if using Workers)
└── _functions/        # Serverless functions (if using Pages)
```

## Domain Configuration
1. In Cloudflare DNS, set:
   - Type: CNAME
   - Name: @ (or boomchainlab.com)
   - Target: your-project-name.pages.dev

2. Enable SSL/TLS (Full mode recommended)

## Verification
After deployment:
- Test API endpoints: `https://boomchainlab.com/api/users`
- Check frontend: `https://boomchainlab.com`
- Verify database connectivity

## Troubleshooting
- Check Cloudflare Functions logs for backend errors
- Ensure all environment variables are set
- Verify database connection string format