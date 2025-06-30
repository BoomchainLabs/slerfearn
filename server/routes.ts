import express, { Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { handleGitBookRequest } from "./gitbook";
import { 
  insertUserSchema,
  insertUserMissionProgressSchema,
  insertUserQuestProgressSchema,
  insertUserStakeSchema,
  insertGameScoreSchema,
  insertUserNftSchema,
  insertUserPurchaseSchema,
  insertSocialConnectionSchema
} from "@shared/schema";

function formatZodError(error: ZodError) {
  return error.errors.map(e => ({
    path: e.path.join('.'),
    message: e.message
  }));
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: formatZodError(err)
      });
    }
    next(err);
  });

  // User routes
  router.post('/users', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      throw error;
    }
  });

  router.get('/users/wallet/:address', async (req: Request, res: Response) => {
    const { address } = req.params;
    const user = await storage.getUserByWalletAddress(address);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password
    const { password, ...userData } = user;
    res.json(userData);
  });

  router.get('/users/referral/:code', async (req: Request, res: Response) => {
    const { code } = req.params;
    const user = await storage.getUserByReferralCode(code);
    
    if (!user) {
      return res.status(404).json({ message: "Referral code not found" });
    }
    
    res.json({ 
      id: user.id,
      username: user.username,
      referralCode: user.referralCode
    });
  });

  // Daily Missions routes
  router.get('/missions', async (req: Request, res: Response) => {
    const missions = await storage.getDailyMissions();
    res.json(missions);
  });

  router.get('/missions/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const mission = await storage.getDailyMission(parseInt(id));
    
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    
    res.json(mission);
  });

  router.get('/users/:userId/missions', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const progress = await storage.getUserMissionProgress(parseInt(userId));
    res.json(progress);
  });

  router.post('/users/:userId/missions/:missionId/progress', async (req: Request, res: Response) => {
    try {
      const { userId, missionId } = req.params;
      const data = insertUserMissionProgressSchema.parse({
        userId: parseInt(userId),
        missionId: parseInt(missionId),
        progress: 0,
        completed: false,
        claimed: false
      });
      
      const mission = await storage.getDailyMission(data.missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      const progress = await storage.initUserMissionProgress(data);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      throw error;
    }
  });

  router.put('/users/:userId/missions/progress/:progressId', async (req: Request, res: Response) => {
    try {
      const { userId, progressId } = req.params;
      const { progress, completed } = req.body;
      
      const updated = await storage.updateMissionProgress(
        parseInt(progressId),
        progress,
        completed
      );
      
      res.json(updated);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  router.post('/users/:userId/missions/progress/:progressId/claim', async (req: Request, res: Response) => {
    try {
      const { userId, progressId } = req.params;
      const result = await storage.claimMissionReward(
        parseInt(progressId),
        parseInt(userId)
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  // Weekly Quests routes
  router.get('/quests', async (req: Request, res: Response) => {
    const quests = await storage.getWeeklyQuests();
    res.json(quests);
  });

  router.get('/quests/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const quest = await storage.getWeeklyQuest(parseInt(id));
    
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }
    
    res.json(quest);
  });

  router.get('/users/:userId/quests', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const progress = await storage.getUserQuestProgress(parseInt(userId));
    res.json(progress);
  });

  router.post('/users/:userId/quests/:questId/progress', async (req: Request, res: Response) => {
    try {
      const { userId, questId } = req.params;
      const { progressMax } = req.body;
      
      if (!progressMax) {
        return res.status(400).json({ message: "progressMax is required" });
      }
      
      const data = insertUserQuestProgressSchema.parse({
        userId: parseInt(userId),
        questId: parseInt(questId),
        progress: 0,
        progressMax: progressMax,
        completed: false,
        claimed: false
      });
      
      const quest = await storage.getWeeklyQuest(data.questId);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      
      const progress = await storage.initUserQuestProgress(data);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      throw error;
    }
  });

  router.put('/users/:userId/quests/progress/:progressId', async (req: Request, res: Response) => {
    try {
      const { userId, progressId } = req.params;
      const { progress, completed } = req.body;
      
      const updated = await storage.updateQuestProgress(
        parseInt(progressId),
        progress,
        completed
      );
      
      res.json(updated);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  router.post('/users/:userId/quests/progress/:progressId/claim', async (req: Request, res: Response) => {
    try {
      const { userId, progressId } = req.params;
      const result = await storage.claimQuestReward(
        parseInt(progressId),
        parseInt(userId)
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  // Staking Vaults routes
  router.get('/vaults', async (req: Request, res: Response) => {
    const vaults = await storage.getStakingVaults();
    res.json(vaults);
  });

  router.get('/vaults/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const vault = await storage.getStakingVault(parseInt(id));
    
    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }
    
    res.json(vault);
  });

  router.get('/users/:userId/stakes', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const stakes = await storage.getUserStakes(parseInt(userId));
    res.json(stakes);
  });

  router.post('/users/:userId/stakes', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const data = insertUserStakeSchema.parse({
        ...req.body,
        userId: parseInt(userId)
      });
      
      const stake = await storage.stakeTokens(data);
      res.status(201).json(stake);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  router.post('/users/:userId/stakes/:stakeId/unstake', async (req: Request, res: Response) => {
    try {
      const { userId, stakeId } = req.params;
      const result = await storage.unstakeTokens(
        parseInt(stakeId),
        parseInt(userId)
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  router.post('/users/:userId/stakes/:stakeId/claim', async (req: Request, res: Response) => {
    try {
      const { userId, stakeId } = req.params;
      const result = await storage.claimStakingRewards(
        parseInt(stakeId),
        parseInt(userId)
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  // Games routes
  router.get('/games', async (req: Request, res: Response) => {
    const games = await storage.getGames();
    res.json(games);
  });

  router.get('/games/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const game = await storage.getGame(parseInt(id));
    
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    res.json(game);
  });

  router.get('/games/:id/leaderboard', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { limit } = req.query;
    
    const leaderboard = await storage.getGameLeaderboard(
      parseInt(id),
      limit ? parseInt(limit as string) : 10
    );
    
    res.json(leaderboard);
  });

  router.get('/users/:userId/games/scores', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const scores = await storage.getUserGameScores(parseInt(userId));
    res.json(scores);
  });

  router.post('/users/:userId/games/:gameId/scores', async (req: Request, res: Response) => {
    try {
      const { userId, gameId } = req.params;
      const { score } = req.body;
      
      const data = insertGameScoreSchema.parse({
        userId: parseInt(userId),
        gameId: parseInt(gameId),
        score
      });
      
      const game = await storage.getGame(data.gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const result = await storage.submitGameScore(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      throw error;
    }
  });

  // NFT Boosters routes
  router.get('/nfts', async (req: Request, res: Response) => {
    const nfts = await storage.getNftBoosters();
    res.json(nfts);
  });

  router.get('/nfts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const nft = await storage.getNftBooster(parseInt(id));
    
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }
    
    res.json(nft);
  });

  router.get('/users/:userId/nfts', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userNfts = await storage.getUserNfts(parseInt(userId));
    res.json(userNfts);
  });

  router.post('/users/:userId/nfts', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const data = insertUserNftSchema.parse({
        ...req.body,
        userId: parseInt(userId)
      });
      
      const nft = await storage.getNftBooster(data.nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      const result = await storage.mintNft(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  // Marketplace routes
  router.get('/marketplace', async (req: Request, res: Response) => {
    const items = await storage.getMarketplaceItems();
    res.json(items);
  });

  router.get('/marketplace/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await storage.getMarketplaceItem(parseInt(id));
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  });

  router.get('/users/:userId/purchases', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const purchases = await storage.getUserPurchases(parseInt(userId));
    res.json(purchases);
  });

  router.post('/users/:userId/purchases', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const data = insertUserPurchaseSchema.parse({
        ...req.body,
        userId: parseInt(userId)
      });
      
      const result = await storage.purchaseItem(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  // Social Integration routes
  router.get('/users/:userId/social', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const connections = await storage.getSocialConnections(parseInt(userId));
    res.json(connections);
  });

  router.post('/users/:userId/social', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const data = insertSocialConnectionSchema.parse({
        ...req.body,
        userId: parseInt(userId)
      });
      
      const result = await storage.connectSocial(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: formatZodError(error)
        });
      }
      throw error;
    }
  });

  router.delete('/users/:userId/social/:connectionId', async (req: Request, res: Response) => {
    try {
      const { userId, connectionId } = req.params;
      const result = await storage.disconnectSocial(
        parseInt(connectionId),
        parseInt(userId)
      );
      
      res.json({ success: result });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  // Stats routes
  router.get('/stats', async (req: Request, res: Response) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // GitBook Documentation API
  router.get('/gitbook', handleGitBookRequest);

  // Referral routes
  router.get('/referrals/leaderboard', async (req: Request, res: Response) => {
    const { limit } = req.query;
    const leaderboard = await storage.getReferralLeaderboard(
      limit ? parseInt(limit as string) : 5
    );
    
    res.json(leaderboard);
  });

  router.get('/users/:userId/referrals', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const referrals = await storage.getReferrals(parseInt(userId));
    res.json(referrals);
  });

  // GitBook Documentation routes
  router.get('/gitbook', handleGitBookRequest);
  router.get('/gitbook/docs/:page', handleGitBookRequest);
  
  // $LERF Token Distribution Routes
  router.get('/user/stats', async (req: Request, res: Response) => {
    try {
      // Mock user stats for development - replace with real user data
      const userStats = {
        lerfBalance: 2500000, // 2.5M $LERF
        totalEarned: 5000000, // 5M $LERF total earned
        dailyMissionsCompleted: 12,
        triviaCorrect: 45,
        triviaTotal: 60,
        walletsConnected: 2,
        socialConnections: 3
      };
      res.json(userStats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  router.post('/wallet/connect', async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.body;
      // Implement wallet connection logic and reward distribution
      const reward = 1000000; // 1M $LERF for first wallet connection
      
      res.json({ 
        success: true, 
        walletAddress,
        reward,
        message: `Wallet connected! Earned ${reward.toLocaleString()} $LERF tokens`
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  router.post('/trivia/daily/start', async (req: Request, res: Response) => {
    try {
      const sessionId = `trivia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.json({ 
        sessionId,
        questionsCount: 3,
        timeLimit: 300 // 5 minutes
      });
    } catch (error) {
      console.error("Error starting trivia:", error);
      res.status(500).json({ message: "Failed to start trivia session" });
    }
  });

  router.post('/trivia/answer', async (req: Request, res: Response) => {
    try {
      const { sessionId, questionId, answer } = req.body;
      // Validate answer and track progress
      res.json({ 
        correct: true, // This would be validated against the correct answer
        sessionId,
        questionId
      });
    } catch (error) {
      console.error("Error submitting trivia answer:", error);
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });

  router.post('/trivia/complete', async (req: Request, res: Response) => {
    try {
      const { sessionId, answers, score } = req.body;
      const baseReward = 500000; // 500K $LERF per correct answer
      const perfectBonus = 2000000; // 2M $LERF perfect score bonus
      
      // Calculate final reward based on performance
      const correctAnswers = answers.length; // This would be calculated properly
      let totalReward = baseReward * correctAnswers;
      
      if (correctAnswers === 3) { // Perfect score
        totalReward += perfectBonus;
      }
      
      res.json({ 
        sessionCompleted: true,
        correctAnswers,
        totalQuestions: 3,
        totalReward,
        perfectScore: correctAnswers === 3
      });
    } catch (error) {
      console.error("Error completing trivia:", error);
      res.status(500).json({ message: "Failed to complete trivia" });
    }
  });

  router.get('/trivia/stats', async (req: Request, res: Response) => {
    try {
      const triviaStats = {
        totalCorrect: 45,
        totalQuestions: 60,
        totalEarned: 22500000, // 22.5M $LERF from trivia
        perfectScores: 8,
        currentStreak: 5
      };
      res.json(triviaStats);
    } catch (error) {
      console.error("Error fetching trivia stats:", error);
      res.status(500).json({ message: "Failed to fetch trivia stats" });
    }
  });

  router.post('/social/connect', async (req: Request, res: Response) => {
    try {
      const { platform, username } = req.body;
      let reward = 100000; // Default 100K $LERF
      
      if (platform === 'github') reward = 200000; // 200K for GitHub
      if (platform === 'twitter') reward = 100000; // 100K for Twitter
      if (platform === 'discord') reward = 100000; // 100K for Discord
      
      res.json({
        success: true,
        platform,
        username,
        reward,
        message: `Connected to ${platform}! Earned ${reward.toLocaleString()} $LERF tokens`
      });
    } catch (error) {
      console.error("Error connecting social account:", error);
      res.status(500).json({ message: "Failed to connect social account" });
    }
  });

  router.post('/referral/claim', async (req: Request, res: Response) => {
    try {
      const { referralCode } = req.body;
      const reward = 1000000; // 1M $LERF for referral
      
      res.json({
        success: true,
        reward,
        message: `Referral bonus claimed! Earned ${reward.toLocaleString()} $LERF tokens`
      });
    } catch (error) {
      console.error("Error claiming referral:", error);
      res.status(500).json({ message: "Failed to claim referral bonus" });
    }
  });

  router.get('/token/distribution', async (req: Request, res: Response) => {
    try {
      const distributionStats = {
        totalSupply: 100000000000, // 100B $LERF
        totalDistributed: 15000000000, // 15B distributed so far
        remainingPools: {
          community: 25000000000, // 25B remaining for community
          trivia: 18000000000, // 18B remaining for trivia
          wallet: 9000000000, // 9B remaining for wallet rewards
          market: 30000000000 // 30B for market/liquidity
        },
        dailyDistribution: 500000000, // 500M $LERF distributed daily
        activeUsers: 1250
      };
      res.json(distributionStats);
    } catch (error) {
      console.error("Error fetching distribution stats:", error);
      res.status(500).json({ message: "Failed to fetch distribution stats" });
    }
  });

  router.post('/gitbook/publish-openapi', async (req: Request, res: Response) => {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      // Verify GitBook token exists
      if (!process.env.GITBOOK_TOKEN) {
        return res.status(401).json({ 
          message: "GitBook token not found. Please set the GITBOOK_TOKEN environment variable."
        });
      }
      
      console.log('Publishing OpenAPI spec to GitBook...');
      
      const result = await execAsync(
        'node scripts/publish-openapi-to-gitbook.js ' + 
        '--spec boomchainlab-organization-api ' + 
        '--organization 3wJ7o4ruv7ICq5Y1wxga ' + 
        '--file ./openapi/openapi.json'
      );
      
      console.log('OpenAPI spec successfully published to GitBook');
      
      res.status(200).json({ 
        message: "OpenAPI specification successfully published to GitBook",
        details: result.stdout 
      });
    } catch (error) {
      console.error('Error publishing OpenAPI spec to GitBook:', error);
      res.status(500).json({ 
        message: "Failed to publish OpenAPI specification to GitBook",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Mount all routes with /api prefix
  app.use('/api', router);

  const httpServer = createServer(app);
  return httpServer;
}
