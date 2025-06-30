# $LERF Rewards Hub - Replit Development Guide

## Overview

$LERF Rewards Hub is a comprehensive Web3 reward platform that gamifies blockchain interactions through an engaging ecosystem powered by $LERF tokens. The platform combines daily missions, weekly quests, multi-chain staking, micro-tasks, on-chain activity farming, cross-chain liquidity management, and social integrations into a unified rewards system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Styling**: Custom cyberpunk-inspired theme with CSS variables
- **Icons**: Remix Icons and Lucide React
- **Fonts**: Google Fonts (Audiowide, Orbitron, Chakra Petch, JetBrains Mono)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **API**: RESTful API design with OpenAPI 3.0 specification
- **Authentication**: Replit Auth integration
- **File Upload**: Built-in middleware for handling attachments

### Data Storage
- **Database**: PostgreSQL with connection pooling via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema covering users, missions, quests, staking, games, NFTs, marketplace, and social connections
- **Migrations**: Drizzle Kit for database migrations

### Web3 Integration
- **Ethereum**: ethers.js for smart contract interactions
- **Solana**: @solana/web3.js for Solana blockchain operations
- **Multi-Wallet**: Support for MetaMask, Phantom, and other wallet providers
- **Token Integration**: $LERF token contract interaction and management

## Key Components

### Authentication & User Management
- Wallet-based authentication system
- User profiles with referral codes and tier systems
- Social connections (Twitter, Discord, GitHub integration)
- Multi-wallet support across different blockchains

### Gamification System
- **Daily Missions**: Short-term tasks with immediate rewards
- **Weekly Quests**: Longer-term objectives with higher payouts
- **Progress Tracking**: Real-time progress monitoring and completion status
- **Reward Distribution**: Automated $LERF token distribution

### Staking & DeFi Features
- **Multi-Vault Staking**: Different staking pools with varying APY rates
- **Cross-Chain Support**: Ethereum, Solana, Base, and other networks
- **Auto-Compounding**: Smart contracts for automatic reward reinvestment
- **Liquidity Management**: Add and manage liquidity across multiple DEXs

### Gaming Platform
- **Mini-Games**: Browser-based games with token rewards
- **Leaderboards**: Competitive ranking systems
- **NFT Boosters**: Special NFTs that provide gameplay advantages
- **Score-to-Earn**: Convert game performance into token rewards

### Social & Community Features
- **Referral Program**: Multi-tier referral system with bonus rewards
- **GitHub Integration**: Rewards for open-source contributions
- **Social Sharing**: Integration with major social platforms
- **Community Challenges**: Group-based objectives and rewards

## Data Flow

### User Onboarding
1. User connects wallet via multi-wallet interface
2. System creates user profile with unique referral code
3. Initial missions and quests are automatically assigned
4. User tier is established based on activity and holdings

### Reward Distribution
1. User completes tasks/missions/games
2. Progress is validated and recorded in database
3. Smart contracts mint and distribute $LERF tokens
4. User balance is updated in real-time
5. Achievements and tier progression are calculated

### Cross-Chain Operations
1. User initiates cross-chain transaction
2. Source chain transaction is validated
3. Bridge protocols facilitate token transfer
4. Destination chain transaction is confirmed
5. User balance is updated across all platforms

## External Dependencies

### Blockchain Networks
- **Ethereum Mainnet**: Primary $LERF token deployment
- **Solana**: Secondary deployment and NFT operations
- **Base**: Layer 2 scaling solution integration
- **Arbitrum & Optimism**: Additional L2 support

### Third-Party Services
- **Neon Database**: PostgreSQL hosting and connection pooling
- **GitBook**: Documentation hosting and API integration
- **GoFundMe SDK**: Crowdfunding campaign integration
- **QuikNode**: Solana RPC provider
- **GitHub API**: Repository and contribution tracking

### Development Tools
- **Vite**: Fast development server and build tool
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling
- **TanStack Query**: Data fetching and caching
- **Framer Motion**: Animation library

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts development server with hot reload
- **Database Setup**: `npm run db:push` applies schema changes
- **TypeScript Checking**: `npm run check` validates types

### Production Deployment
- **Build Process**: `npm run build` creates optimized production bundle
- **Server Start**: `npm start` runs production server
- **Environment Variables**: DATABASE_URL, SOLANA_RPC_URL, and API keys
- **Static Assets**: Served from dist/public directory

### Scaling Considerations
- Connection pooling for database efficiency
- CDN integration for static asset delivery
- Horizontal scaling support through stateless architecture
- Caching strategies for frequently accessed data

## Changelog
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.