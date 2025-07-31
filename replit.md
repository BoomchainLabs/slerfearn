# SlerfHub - Web3 Rewards Platform

## Overview

SlerfHub is a comprehensive Web3 reward platform that transforms blockchain interactions into an engaging, gamified ecosystem powered by $SLERF tokens. The platform combines daily missions, weekly quests, staking, gaming, and social features to create a multi-faceted rewards system for users to earn $SLERF tokens through various activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: TailwindCSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **UI Components**: Radix UI primitives with custom theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling with Zod validation
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema**: Comprehensive schema covering users, missions, quests, staking, games, NFTs, marketplace, and social connections

## Key Components

### Authentication System
- Simple wallet-based authentication using simulated Web3 connections
- Local storage persistence for wallet state
- Mock wallet provider for development and testing

### Mission & Quest System
- **Daily Missions**: Short-term tasks with immediate rewards
- **Weekly Quests**: Longer challenges with higher rewards
- Progress tracking with completion states and reward claiming
- Dynamic mission generation and user progress synchronization

### Staking Infrastructure
- Multiple staking vaults with different APY rates
- Flexible staking/unstaking with reward calculations
- Real-time balance updates and earning projections

### Gaming Platform
- **Spin Game**: Cooldown-based reward wheel with probability-weighted prizes
- **Blockchain Games**: More complex games with scoring and leaderboards
- Game score tracking and competitive elements

### Social Features
- GitHub integration for developer rewards
- Social media connections (Twitter, Discord, Telegram)
- Referral system with tracking and leaderboards

### NFT & Marketplace System
- NFT boosters that enhance earning potential
- Marketplace for purchasing items with $SLERF tokens
- User inventory management and ownership tracking

## Data Flow

### User Registration & Authentication
1. User connects wallet (simulated in current implementation)
2. System generates or retrieves user profile
3. Wallet address becomes primary identifier
4. Session persistence through local storage

### Reward Distribution
1. User completes actions (missions, games, social connections)
2. Backend validates completion and calculates rewards
3. User's $SLERF balance updated in database
4. Frontend reflects changes through query invalidation
5. Real-time UI updates show new balance and progress

### Staking Flow
1. User selects staking vault and amount
2. Tokens locked in vault contract (simulated)
3. Reward accrual begins based on APY
4. Users can claim rewards or unstake anytime
5. Balance adjustments reflected immediately

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: UI component primitives
- **framer-motion**: Animation library
- **ethers**: Web3 interaction (placeholder for future Web3 integration)

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and developer experience
- **TailwindCSS**: Utility-first CSS framework
- **Drizzle Kit**: Database migration and management

### Third-Party Integrations
- **GitHub API**: For developer reward integration
- **Social Media APIs**: For account linking rewards
- **Wallet Providers**: MetaMask, WalletConnect, etc. (simulated)

## Deployment Strategy

### Development Environment
- Local development using Vite dev server
- Hot module replacement for rapid iteration
- Mock data and simulated Web3 connections
- PostgreSQL database (local or Neon cloud)

### Production Build
1. Frontend built using `vite build` to static assets
2. Backend compiled using `esbuild` for Node.js deployment
3. Static assets served from `/dist/public`
4. Environment variables for database and external service configuration

### Database Management
- Drizzle migrations for schema changes
- Connection pooling for production scalability
- Prepared statements for security and performance

### Scalability Considerations
- Query optimization through React Query caching
- Database indexing on frequently queried fields
- Stateless backend design for horizontal scaling
- CDN-ready static asset generation

The architecture prioritizes developer experience with TypeScript throughout, maintainable code through proper separation of concerns, and user experience through optimistic updates and smooth animations. The modular design allows for easy extension of features and integration of actual Web3 functionality when ready for production deployment.