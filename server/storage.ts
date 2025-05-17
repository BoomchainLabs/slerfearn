import {
  users, User, InsertUser,
  dailyMissions, DailyMission, InsertDailyMission,
  userMissionProgress, UserMissionProgress, InsertUserMissionProgress,
  weeklyQuests, WeeklyQuest, InsertWeeklyQuest,
  userQuestProgress, UserQuestProgress, InsertUserQuestProgress,
  stakingVaults, StakingVault, InsertStakingVault,
  userStakes, UserStake, InsertUserStake,
  games, Game, InsertGame,
  gameScores, GameScore, InsertGameScore,
  nftBoosters, NftBooster, InsertNftBooster,
  userNfts, UserNft, InsertUserNft,
  marketplaceItems, MarketplaceItem, InsertMarketplaceItem,
  userPurchases, UserPurchase, InsertUserPurchase,
  socialConnections, SocialConnection, InsertSocialConnection
} from "@shared/schema";

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSlerfBalance(id: number, amount: number): Promise<User>;

  // Daily Missions
  getDailyMissions(): Promise<DailyMission[]>;
  getDailyMission(id: number): Promise<DailyMission | undefined>;
  createDailyMission(mission: InsertDailyMission): Promise<DailyMission>;
  getUserMissionProgress(userId: number): Promise<(UserMissionProgress & { mission: DailyMission })[]>;
  updateMissionProgress(progressId: number, progress: number, completed: boolean): Promise<UserMissionProgress>;
  claimMissionReward(progressId: number, userId: number): Promise<{ updated: UserMissionProgress; reward: number }>;
  initUserMissionProgress(progress: InsertUserMissionProgress): Promise<UserMissionProgress>;

  // Weekly Quests
  getWeeklyQuests(): Promise<WeeklyQuest[]>;
  getWeeklyQuest(id: number): Promise<WeeklyQuest | undefined>;
  createWeeklyQuest(quest: InsertWeeklyQuest): Promise<WeeklyQuest>;
  getUserQuestProgress(userId: number): Promise<(UserQuestProgress & { quest: WeeklyQuest })[]>;
  updateQuestProgress(progressId: number, progress: number, completed: boolean): Promise<UserQuestProgress>;
  claimQuestReward(progressId: number, userId: number): Promise<{ updated: UserQuestProgress; reward: number }>;
  initUserQuestProgress(progress: InsertUserQuestProgress): Promise<UserQuestProgress>;

  // Staking Vaults
  getStakingVaults(): Promise<StakingVault[]>;
  getStakingVault(id: number): Promise<StakingVault | undefined>;
  createStakingVault(vault: InsertStakingVault): Promise<StakingVault>;
  getUserStakes(userId: number): Promise<(UserStake & { vault: StakingVault })[]>;
  stakeTokens(stake: InsertUserStake): Promise<UserStake>;
  unstakeTokens(stakeId: number, userId: number): Promise<{ amount: number }>;
  claimStakingRewards(stakeId: number, userId: number): Promise<{ rewards: number }>;

  // Games
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  getGameLeaderboard(gameId: number, limit?: number): Promise<(GameScore & { user: { username: string; id: number } })[]>;
  getUserGameScores(userId: number): Promise<(GameScore & { game: Game })[]>;
  submitGameScore(score: InsertGameScore): Promise<GameScore>;

  // NFT Boosters
  getNftBoosters(): Promise<NftBooster[]>;
  getNftBooster(id: number): Promise<NftBooster | undefined>;
  createNftBooster(nft: InsertNftBooster): Promise<NftBooster>;
  getUserNfts(userId: number): Promise<(UserNft & { nft: NftBooster })[]>;
  mintNft(userNft: InsertUserNft): Promise<UserNft>;

  // Marketplace
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;
  getUserPurchases(userId: number): Promise<(UserPurchase & { item: MarketplaceItem })[]>;
  purchaseItem(purchase: InsertUserPurchase): Promise<UserPurchase>;

  // Social Connections
  getSocialConnections(userId: number): Promise<SocialConnection[]>;
  connectSocial(connection: InsertSocialConnection): Promise<SocialConnection>;
  disconnectSocial(connectionId: number, userId: number): Promise<boolean>;

  // Statistics
  getStats(): Promise<{ 
    totalUsers: number; 
    slerfDistributed: number; 
    activeQuests: number; 
    averageApr: number; 
  }>;
  
  // Referrals
  getReferralLeaderboard(limit?: number): Promise<{ 
    id: number; 
    username: string; 
    referrals: number; 
    earned: number; 
  }[]>;
  getReferrals(userId: number): Promise<{ 
    referrals: number; 
    earned: number; 
    tier: string; 
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dailyMissions: Map<number, DailyMission>;
  private userMissionProgress: Map<number, UserMissionProgress>;
  private weeklyQuests: Map<number, WeeklyQuest>;
  private userQuestProgress: Map<number, UserQuestProgress>;
  private stakingVaults: Map<number, StakingVault>;
  private userStakes: Map<number, UserStake>;
  private games: Map<number, Game>;
  private gameScores: Map<number, GameScore>;
  private nftBoosters: Map<number, NftBooster>;
  private userNfts: Map<number, UserNft>;
  private marketplaceItems: Map<number, MarketplaceItem>;
  private userPurchases: Map<number, UserPurchase>;
  private socialConnections: Map<number, SocialConnection>;
  
  private userId: number = 1;
  private missionId: number = 1;
  private progressId: number = 1;
  private questId: number = 1;
  private questProgressId: number = 1;
  private vaultId: number = 1;
  private stakeId: number = 1;
  private gameId: number = 1;
  private scoreId: number = 1;
  private nftId: number = 1;
  private userNftId: number = 1;
  private itemId: number = 1;
  private purchaseId: number = 1;
  private connectionId: number = 1;

  constructor() {
    this.users = new Map();
    this.dailyMissions = new Map();
    this.userMissionProgress = new Map();
    this.weeklyQuests = new Map();
    this.userQuestProgress = new Map();
    this.stakingVaults = new Map();
    this.userStakes = new Map();
    this.games = new Map();
    this.gameScores = new Map();
    this.nftBoosters = new Map();
    this.userNfts = new Map();
    this.marketplaceItems = new Map();
    this.userPurchases = new Map();
    this.socialConnections = new Map();
    
    // Initialize sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Initialize sample daily missions
    this.createDailyMission({
      title: "Daily Check-in",
      description: "Visit SlerfHub daily to earn rewards",
      reward: 50,
      icon: "ri-calendar-check-line",
      requirements: { type: "visit", count: 1 },
      active: true
    });

    this.createDailyMission({
      title: "Share on Twitter",
      description: "Post about SlerfHub with the hashtag #SlerfHub",
      reward: 100,
      icon: "ri-twitter-x-line",
      requirements: { type: "social", platform: "twitter", action: "post" },
      active: true
    });

    this.createDailyMission({
      title: "Join Discord",
      description: "Join our Discord community and say hi",
      reward: 75,
      icon: "ri-discord-line",
      requirements: { type: "social", platform: "discord", action: "join" },
      active: true
    });

    // Initialize weekly quests
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    this.createWeeklyQuest({
      title: "Stake 1000 $SLERF",
      description: "Stake $SLERF in our vaults for 7 days to complete this quest",
      reward: 500,
      icon: "ri-vip-diamond-line",
      requirements: { type: "stake", amount: 1000 },
      active: true,
      expiresAt: oneWeekFromNow
    });

    this.createWeeklyQuest({
      title: "Refer 3 Friends",
      description: "Invite friends to join SlerfHub using your referral link",
      reward: 250,
      icon: "ri-team-line",
      requirements: { type: "referral", count: 3 },
      active: true,
      expiresAt: oneWeekFromNow
    });

    this.createWeeklyQuest({
      title: "Win 5 Mini-Games",
      description: "Play and win our on-chain mini-games",
      reward: 350,
      icon: "ri-gamepad-line",
      requirements: { type: "game", wins: 5 },
      active: true,
      expiresAt: oneWeekFromNow
    });

    this.createWeeklyQuest({
      title: "Mint a Slerf Booster NFT",
      description: "Mint your first NFT to boost your earnings",
      reward: 400,
      icon: "ri-nft-line",
      requirements: { type: "mint", count: 1 },
      active: true,
      expiresAt: oneWeekFromNow
    });

    // Initialize staking vaults
    this.createStakingVault({
      name: "Basic Vault",
      description: "Stake your $SLERF and earn rewards with the base APR.",
      apr: 18,
      minStake: 100,
      requirements: null
    });

    this.createStakingVault({
      name: "Enhanced Vault",
      description: "Higher APR when you hold a Slerf Booster NFT.",
      apr: 25,
      minStake: 500,
      requirements: { nft: true, level: "any" }
    });

    this.createStakingVault({
      name: "Premium Vault",
      description: "Maximum APR when you hold partner tokens and NFTs.",
      apr: 40,
      minStake: 1000,
      requirements: { nft: true, level: "legendary", partnerTokens: true, amount: 500 }
    });

    // Initialize games
    this.createGame({
      title: "Slerf Runner",
      description: "Endless runner: collect coins, avoid obstacles, set high scores",
      reward: 25,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      active: true
    });

    this.createGame({
      title: "Slerf Puzzle",
      description: "Match 3 or more tokens to clear the board and earn points",
      reward: 40,
      imageUrl: "https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      active: true
    });

    this.createGame({
      title: "Crypto Trivia",
      description: "Test your crypto knowledge with timed trivia questions",
      reward: 30,
      imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      active: true
    });

    // Initialize NFT boosters
    this.createNftBooster({
      name: "Slerf Rookie",
      description: "Common NFT that provides a basic earnings boost",
      boost: 5,
      rarity: "Common",
      price: 5000, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
    });

    this.createNftBooster({
      name: "Slerf Veteran",
      description: "Uncommon NFT with improved earnings boost",
      boost: 10,
      rarity: "Uncommon",
      price: 15000, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
    });

    this.createNftBooster({
      name: "Slerf Master",
      description: "Rare NFT with significant earnings boost",
      boost: 15,
      rarity: "Rare",
      price: 35000, // in $SLERF
      imageUrl: "https://pixabay.com/get/g1c0d80731dc1ceb737920b63be81cfad3b4094868600a4aa0c2f126e8d68263f3d7ae5eb75e62228675691c91f7595fcffdc04627f7edfe72ae2b3818c1b61db_1280.jpg"
    });

    this.createNftBooster({
      name: "Slerf Legend",
      description: "Legendary NFT with the maximum earnings boost",
      boost: 25,
      rarity: "Legendary",
      price: 75000, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
    });

    // Initialize marketplace items
    this.createMarketplaceItem({
      name: "Limited Edition Slerf T-Shirt",
      description: "Physical Item",
      type: "Merchandise",
      price: 5000, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      available: true
    });

    this.createMarketplaceItem({
      name: "SlerfHub Summit VIP Pass",
      description: "Digital + Physical Access",
      type: "Access Pass",
      price: 15000, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      available: true
    });

    this.createMarketplaceItem({
      name: "Exclusive Profile Frame",
      description: "Digital Collectible",
      type: "Digital Item",
      price: 2500, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      available: true
    });

    this.createMarketplaceItem({
      name: "Slerf Wallpaper Pack",
      description: "Digital Downloads",
      type: "Digital Item",
      price: 1000, // in $SLERF
      imageUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      available: true
    });

    // Create sample users with referrals, game scores, stakes, etc. for the leaderboards
    const sampleUsers = [
      { username: "cryptowhiz", password: "password123", walletAddress: "0x1234...5678" },
      { username: "blockchainbob", password: "password123", walletAddress: "0x2345...6789" },
      { username: "tokenmaster", password: "password123", walletAddress: "0x3456...7890" },
      { username: "ethdev", password: "password123", walletAddress: "0x4567...8901" },
      { username: "slerftrader", password: "password123", walletAddress: "0x5678...9012" }
    ];

    sampleUsers.forEach((userInfo, index) => {
      const user = this.createUser(userInfo);
      
      // Update balances
      this.updateUserSlerfBalance(user.id, (5 - index) * 10000);
      
      // Add game scores
      const game1 = this.games.get(1)!;
      const game2 = this.games.get(2)!;
      const game3 = this.games.get(3)!;
      
      this.submitGameScore({ userId: user.id, gameId: game1.id, score: 12891 - (index * 2500) });
      this.submitGameScore({ userId: user.id, gameId: game2.id, score: 8742 - (index * 1500) });
      this.submitGameScore({ userId: user.id, gameId: game3.id, score: 950 - (index * 100) });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === address);
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.referralCode === code);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const referralCode = generateReferralCode();
    const newUser: User = { 
      ...user, 
      id, 
      referralCode,
      slerfBalance: 0,
      tier: "bronze"
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUserSlerfBalance(id: number, amount: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      // Create a default user if not found (for demo purposes)
      const defaultUser: User = {
        id,
        username: `user_${id}`,
        password: "password",
        walletAddress: `0x${id}...${id}`,
        slerfBalance: amount,
        referralCode: generateReferralCode(),
        tier: "bronze"
      };
      this.users.set(id, defaultUser);
      return defaultUser;
    }
    
    user.slerfBalance = (user.slerfBalance || 0) + amount;
    this.users.set(id, user);
    return user;
  }

  // Daily Missions
  async getDailyMissions(): Promise<DailyMission[]> {
    return Array.from(this.dailyMissions.values());
  }

  async getDailyMission(id: number): Promise<DailyMission | undefined> {
    return this.dailyMissions.get(id);
  }

  async createDailyMission(mission: InsertDailyMission): Promise<DailyMission> {
    const id = this.missionId++;
    const newMission: DailyMission = { ...mission, id };
    this.dailyMissions.set(id, newMission);
    return newMission;
  }

  async getUserMissionProgress(userId: number): Promise<(UserMissionProgress & { mission: DailyMission })[]> {
    const progress = Array.from(this.userMissionProgress.values()).filter(p => p.userId === userId);
    return progress.map(p => {
      const mission = this.dailyMissions.get(p.missionId)!;
      return { ...p, mission };
    });
  }

  async updateMissionProgress(progressId: number, progress: number, completed: boolean): Promise<UserMissionProgress> {
    const progressEntry = this.userMissionProgress.get(progressId);
    if (!progressEntry) {
      throw new Error("Progress not found");
    }

    const updated = { 
      ...progressEntry, 
      progress, 
      completed,
      lastUpdated: new Date()
    };
    this.userMissionProgress.set(progressId, updated);
    return updated;
  }

  async claimMissionReward(progressId: number, userId: number): Promise<{ updated: UserMissionProgress; reward: number }> {
    const progress = this.userMissionProgress.get(progressId);
    if (!progress) {
      throw new Error("Progress not found");
    }

    if (progress.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (!progress.completed || progress.claimed) {
      throw new Error("Cannot claim reward");
    }

    const mission = this.dailyMissions.get(progress.missionId);
    if (!mission) {
      throw new Error("Mission not found");
    }

    // Update progress to claimed
    const updated = { ...progress, claimed: true, lastUpdated: new Date() };
    this.userMissionProgress.set(progressId, updated);

    // Add reward to user balance
    await this.updateUserSlerfBalance(userId, mission.reward);

    return { updated, reward: mission.reward };
  }

  async initUserMissionProgress(progress: InsertUserMissionProgress): Promise<UserMissionProgress> {
    const id = this.progressId++;
    const newProgress: UserMissionProgress = { 
      ...progress, 
      id, 
      lastUpdated: new Date() 
    };
    this.userMissionProgress.set(id, newProgress);
    return newProgress;
  }

  // Weekly Quests
  async getWeeklyQuests(): Promise<WeeklyQuest[]> {
    return Array.from(this.weeklyQuests.values());
  }

  async getWeeklyQuest(id: number): Promise<WeeklyQuest | undefined> {
    return this.weeklyQuests.get(id);
  }

  async createWeeklyQuest(quest: InsertWeeklyQuest): Promise<WeeklyQuest> {
    const id = this.questId++;
    const newQuest: WeeklyQuest = { ...quest, id };
    this.weeklyQuests.set(id, newQuest);
    return newQuest;
  }

  async getUserQuestProgress(userId: number): Promise<(UserQuestProgress & { quest: WeeklyQuest })[]> {
    const progress = Array.from(this.userQuestProgress.values()).filter(p => p.userId === userId);
    return progress.map(p => {
      const quest = this.weeklyQuests.get(p.questId)!;
      return { ...p, quest };
    });
  }

  async updateQuestProgress(progressId: number, progress: number, completed: boolean): Promise<UserQuestProgress> {
    const progressEntry = this.userQuestProgress.get(progressId);
    if (!progressEntry) {
      throw new Error("Progress not found");
    }

    const updated = { 
      ...progressEntry, 
      progress, 
      completed,
      lastUpdated: new Date()
    };
    this.userQuestProgress.set(progressId, updated);
    return updated;
  }

  async claimQuestReward(progressId: number, userId: number): Promise<{ updated: UserQuestProgress; reward: number }> {
    const progress = this.userQuestProgress.get(progressId);
    if (!progress) {
      throw new Error("Progress not found");
    }

    if (progress.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (!progress.completed || progress.claimed) {
      throw new Error("Cannot claim reward");
    }

    const quest = this.weeklyQuests.get(progress.questId);
    if (!quest) {
      throw new Error("Quest not found");
    }

    // Update progress to claimed
    const updated = { ...progress, claimed: true, lastUpdated: new Date() };
    this.userQuestProgress.set(progressId, updated);

    // Add reward to user balance
    await this.updateUserSlerfBalance(userId, quest.reward);

    return { updated, reward: quest.reward };
  }

  async initUserQuestProgress(progress: InsertUserQuestProgress): Promise<UserQuestProgress> {
    const id = this.questProgressId++;
    const newProgress: UserQuestProgress = { 
      ...progress, 
      id, 
      lastUpdated: new Date() 
    };
    this.userQuestProgress.set(id, newProgress);
    return newProgress;
  }

  // Staking Vaults
  async getStakingVaults(): Promise<StakingVault[]> {
    return Array.from(this.stakingVaults.values());
  }

  async getStakingVault(id: number): Promise<StakingVault | undefined> {
    return this.stakingVaults.get(id);
  }

  async createStakingVault(vault: InsertStakingVault): Promise<StakingVault> {
    const id = this.vaultId++;
    const newVault: StakingVault = { ...vault, id };
    this.stakingVaults.set(id, newVault);
    return newVault;
  }

  async getUserStakes(userId: number): Promise<(UserStake & { vault: StakingVault })[]> {
    const stakes = Array.from(this.userStakes.values()).filter(s => s.userId === userId);
    return stakes.map(stake => {
      const vault = this.stakingVaults.get(stake.vaultId)!;
      return { ...stake, vault };
    });
  }

  async stakeTokens(stake: InsertUserStake): Promise<UserStake> {
    const { userId, vaultId, amount } = stake;
    
    // Check if user has enough balance
    const user = await this.getUser(userId);
    if (!user || (user.slerfBalance || 0) < amount) {
      throw new Error("Insufficient balance");
    }
    
    // Check if vault exists
    const vault = await this.getStakingVault(vaultId);
    if (!vault) {
      throw new Error("Vault not found");
    }
    
    // Check minimum stake
    if (amount < vault.minStake) {
      throw new Error(`Minimum stake is ${vault.minStake} $SLERF`);
    }
    
    // Deduct from user balance
    await this.updateUserSlerfBalance(userId, -amount);
    
    // Create stake
    const id = this.stakeId++;
    const now = new Date();
    const newStake: UserStake = {
      ...stake,
      id,
      rewards: 0,
      stakedAt: now,
      lastClaimed: now
    };
    
    this.userStakes.set(id, newStake);
    return newStake;
  }

  async unstakeTokens(stakeId: number, userId: number): Promise<{ amount: number }> {
    const stake = this.userStakes.get(stakeId);
    if (!stake) {
      throw new Error("Stake not found");
    }
    
    if (stake.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    const amount = stake.amount;
    
    // Return staked tokens to user
    await this.updateUserSlerfBalance(userId, amount);
    
    // Calculate and add rewards
    const now = new Date();
    const daysSinceLastClaim = Math.max(0, (now.getTime() - stake.lastClaimed.getTime()) / (1000 * 60 * 60 * 24));
    const vault = await this.getStakingVault(stake.vaultId);
    if (vault) {
      const dailyReward = (stake.amount * vault.apr / 36500); // Daily APR
      const pendingRewards = Math.floor(dailyReward * daysSinceLastClaim);
      
      if (pendingRewards > 0) {
        await this.updateUserSlerfBalance(userId, pendingRewards);
      }
    }
    
    // Remove stake
    this.userStakes.delete(stakeId);
    
    return { amount };
  }

  async claimStakingRewards(stakeId: number, userId: number): Promise<{ rewards: number }> {
    const stake = this.userStakes.get(stakeId);
    if (!stake) {
      throw new Error("Stake not found");
    }
    
    if (stake.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    // Calculate rewards
    const now = new Date();
    const daysSinceLastClaim = Math.max(0, (now.getTime() - stake.lastClaimed.getTime()) / (1000 * 60 * 60 * 24));
    const vault = await this.getStakingVault(stake.vaultId);
    
    if (!vault) {
      throw new Error("Vault not found");
    }
    
    const dailyReward = (stake.amount * vault.apr / 36500); // Daily APR
    const pendingRewards = Math.floor(dailyReward * daysSinceLastClaim);
    
    if (pendingRewards <= 0) {
      throw new Error("No rewards to claim");
    }
    
    // Update user balance
    await this.updateUserSlerfBalance(userId, pendingRewards);
    
    // Update stake
    const updatedStake = {
      ...stake,
      lastClaimed: now,
      rewards: stake.rewards + pendingRewards
    };
    
    this.userStakes.set(stakeId, updatedStake);
    
    return { rewards: pendingRewards };
  }

  // Games
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const newGame: Game = { ...game, id };
    this.games.set(id, newGame);
    return newGame;
  }

  async getGameLeaderboard(gameId: number, limit: number = 10): Promise<(GameScore & { user: { username: string; id: number } })[]> {
    const gameScores = Array.from(this.gameScores.values())
      .filter(score => score.gameId === gameId)
      .sort((a, b) => b.score - a.score);
    
    // Group by user, keep highest score
    const userHighScores = new Map<number, GameScore>();
    gameScores.forEach(score => {
      if (!userHighScores.has(score.userId) || userHighScores.get(score.userId)!.score < score.score) {
        userHighScores.set(score.userId, score);
      }
    });
    
    // Convert to array, sort by score
    const leaderboard = Array.from(userHighScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Add user info
    return leaderboard.map(score => {
      const user = this.users.get(score.userId)!;
      return {
        ...score,
        user: {
          id: user.id,
          username: user.username
        }
      };
    });
  }

  async getUserGameScores(userId: number): Promise<(GameScore & { game: Game })[]> {
    const scores = Array.from(this.gameScores.values())
      .filter(score => score.userId === userId);
    
    // Group by game, keep highest score
    const highScores = new Map<number, GameScore>();
    scores.forEach(score => {
      if (!highScores.has(score.gameId) || highScores.get(score.gameId)!.score < score.score) {
        highScores.set(score.gameId, score);
      }
    });
    
    // Add game info
    return Array.from(highScores.values()).map(score => {
      const game = this.games.get(score.gameId)!;
      return { ...score, game };
    });
  }

  async submitGameScore(score: InsertGameScore): Promise<GameScore> {
    const id = this.scoreId++;
    const newScore: GameScore = { 
      ...score, 
      id, 
      playedAt: new Date() 
    };
    this.gameScores.set(id, newScore);
    
    // Check if it's a winning score and give rewards
    const game = await this.getGame(score.gameId);
    if (game && game.reward) {
      // Get user's previous high score
      const userScores = Array.from(this.gameScores.values())
        .filter(s => s.userId === score.userId && s.gameId === score.gameId && s.id !== id);
      
      const highestPreviousScore = userScores.length > 0 
        ? Math.max(...userScores.map(s => s.score))
        : 0;
      
      // If this is a new high score, give reward
      if (score.score > highestPreviousScore) {
        await this.updateUserSlerfBalance(score.userId, game.reward);
      }
    }
    
    return newScore;
  }

  // NFT Boosters
  async getNftBoosters(): Promise<NftBooster[]> {
    return Array.from(this.nftBoosters.values());
  }

  async getNftBooster(id: number): Promise<NftBooster | undefined> {
    return this.nftBoosters.get(id);
  }

  async createNftBooster(nft: InsertNftBooster): Promise<NftBooster> {
    const id = this.nftId++;
    const newNft: NftBooster = { ...nft, id };
    this.nftBoosters.set(id, newNft);
    return newNft;
  }

  async getUserNfts(userId: number): Promise<(UserNft & { nft: NftBooster })[]> {
    const userNfts = Array.from(this.userNfts.values())
      .filter(userNft => userNft.userId === userId);
      
    return userNfts.map(userNft => {
      const nft = this.nftBoosters.get(userNft.nftId)!;
      return { ...userNft, nft };
    });
  }

  async mintNft(userNft: InsertUserNft): Promise<UserNft> {
    const { userId, nftId } = userNft;
    
    // Check if NFT exists
    const nft = await this.getNftBooster(nftId);
    if (!nft) {
      throw new Error("NFT not found");
    }
    
    // Check if user has enough $SLERF
    const user = await this.getUser(userId);
    if (!user || (user.slerfBalance || 0) < nft.price) {
      throw new Error("Insufficient balance");
    }
    
    // Deduct price from user balance
    await this.updateUserSlerfBalance(userId, -nft.price);
    
    // Create user NFT
    const id = this.userNftId++;
    const newUserNft: UserNft = {
      ...userNft,
      id,
      mintedAt: new Date()
    };
    
    this.userNfts.set(id, newUserNft);
    return newUserNft;
  }

  // Marketplace
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values());
  }

  async getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined> {
    return this.marketplaceItems.get(id);
  }

  async createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const id = this.itemId++;
    const newItem: MarketplaceItem = { ...item, id };
    this.marketplaceItems.set(id, newItem);
    return newItem;
  }

  async getUserPurchases(userId: number): Promise<(UserPurchase & { item: MarketplaceItem })[]> {
    const purchases = Array.from(this.userPurchases.values())
      .filter(purchase => purchase.userId === userId);
      
    return purchases.map(purchase => {
      const item = this.marketplaceItems.get(purchase.itemId)!;
      return { ...purchase, item };
    });
  }

  async purchaseItem(purchase: InsertUserPurchase): Promise<UserPurchase> {
    const { userId, itemId } = purchase;
    
    // Check if item exists
    const item = await this.getMarketplaceItem(itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    
    // Check if item is available
    if (!item.available) {
      throw new Error("Item is not available");
    }
    
    // Check if user has enough $SLERF
    const user = await this.getUser(userId);
    if (!user || (user.slerfBalance || 0) < item.price) {
      throw new Error("Insufficient balance");
    }
    
    // Deduct price from user balance
    await this.updateUserSlerfBalance(userId, -item.price);
    
    // Create purchase
    const id = this.purchaseId++;
    const newPurchase: UserPurchase = {
      ...purchase,
      id,
      purchasedAt: new Date()
    };
    
    this.userPurchases.set(id, newPurchase);
    return newPurchase;
  }

  // Social Connections
  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    return Array.from(this.socialConnections.values())
      .filter(connection => connection.userId === userId);
  }

  async connectSocial(connection: InsertSocialConnection): Promise<SocialConnection> {
    const id = this.connectionId++;
    const newConnection: SocialConnection = {
      ...connection,
      id,
      connected: true,
      connectedAt: new Date()
    };
    
    this.socialConnections.set(id, newConnection);
    return newConnection;
  }

  async disconnectSocial(connectionId: number, userId: number): Promise<boolean> {
    const connection = this.socialConnections.get(connectionId);
    
    if (!connection) {
      throw new Error("Connection not found");
    }
    
    if (connection.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    this.socialConnections.delete(connectionId);
    return true;
  }

  // Statistics
  async getStats(): Promise<{ totalUsers: number; slerfDistributed: number; activeQuests: number; averageApr: number; }> {
    const totalUsers = this.users.size;
    
    // Calculate SLERF distributed (based on user balances)
    const slerfDistributed = Array.from(this.users.values())
      .reduce((total, user) => total + (user.slerfBalance || 0), 0);
    
    // Count active quests
    const activeQuests = Array.from(this.weeklyQuests.values())
      .filter(quest => quest.active && quest.expiresAt > new Date())
      .length;
    
    // Calculate average APR
    const vaults = Array.from(this.stakingVaults.values());
    const averageApr = vaults.length 
      ? vaults.reduce((total, vault) => total + vault.apr, 0) / vaults.length 
      : 0;
    
    return {
      totalUsers,
      slerfDistributed,
      activeQuests,
      averageApr
    };
  }

  // Referrals
  async getReferralLeaderboard(limit: number = 5): Promise<{ id: number; username: string; referrals: number; earned: number; }[]> {
    // Find referrers
    const users = Array.from(this.users.values());
    
    // Count referrals for each user
    const referralCounts = users.reduce((counts, user) => {
      if (user.referredBy) {
        const referrerId = user.referredBy;
        counts[referrerId] = (counts[referrerId] || 0) + 1;
      }
      return counts;
    }, {} as Record<number, number>);
    
    // Sort users by referral count
    const topReferrers = users
      .map(user => {
        const referrals = referralCounts[user.id] || 0;
        // Estimate earnings (10% of referred users' balances)
        const referredUsers = users.filter(u => u.referredBy === user.id);
        const earned = referredUsers.reduce((total, u) => total + ((u.slerfBalance || 0) * 0.1), 0);
        
        return {
          id: user.id,
          username: user.username,
          referrals,
          earned: Math.floor(earned)
        };
      })
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, limit);
    
    // For demo purposes, ensure we have some data
    if (topReferrers.length === 0) {
      return [
        { id: 1, username: "cryptowhiz", referrals: 127, earned: 24890 },
        { id: 2, username: "blockchainbob", referrals: 83, earned: 15422 },
        { id: 3, username: "tokenmaster", referrals: 67, earned: 12753 },
        { id: 4, username: "ethdev", referrals: 45, earned: 8521 },
        { id: 5, username: "slerftrader", referrals: 32, earned: 6102 }
      ].slice(0, limit);
    }
    
    return topReferrers;
  }

  async getReferrals(userId: number): Promise<{ referrals: number; earned: number; tier: string; }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Count referrals
    const referrals = Array.from(this.users.values())
      .filter(u => u.referredBy === userId)
      .length;
    
    // Calculate earnings (10% of referred users' balances)
    const referredUsers = Array.from(this.users.values())
      .filter(u => u.referredBy === userId);
    
    const earned = referredUsers.reduce((total, u) => total + ((u.slerfBalance || 0) * 0.1), 0);
    
    // Determine tier
    let tier = user.tier || "bronze";
    
    if (referrals >= 50) {
      tier = "diamond";
    } else if (referrals >= 20) {
      tier = "gold";
    } else if (referrals >= 5) {
      tier = "silver";
    }
    
    return {
      referrals,
      earned: Math.floor(earned),
      tier
    };
  }
}

import { db } from "./db";
import { eq, and, desc, sql, asc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, address));
    return user;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const referralCode = generateReferralCode();
    const [newUser] = await db
      .insert(users)
      .values({ ...user, referralCode })
      .returning();
    return newUser;
  }

  async updateUserSlerfBalance(id: number, amount: number): Promise<User> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ slerfBalance: user.slerfBalance + amount })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  // Daily Missions
  async getDailyMissions(): Promise<DailyMission[]> {
    return db.select().from(dailyMissions).where(eq(dailyMissions.active, true));
  }

  async getDailyMission(id: number): Promise<DailyMission | undefined> {
    const [mission] = await db.select().from(dailyMissions).where(eq(dailyMissions.id, id));
    return mission;
  }

  async createDailyMission(mission: InsertDailyMission): Promise<DailyMission> {
    const [newMission] = await db
      .insert(dailyMissions)
      .values(mission)
      .returning();
    return newMission;
  }

  async getUserMissionProgress(userId: number): Promise<(UserMissionProgress & { mission: DailyMission })[]> {
    const result = await db
      .select({
        progress: userMissionProgress,
        mission: dailyMissions
      })
      .from(userMissionProgress)
      .innerJoin(dailyMissions, eq(userMissionProgress.missionId, dailyMissions.id))
      .where(eq(userMissionProgress.userId, userId));

    return result.map(item => ({
      ...item.progress,
      mission: item.mission
    }));
  }

  async updateMissionProgress(progressId: number, progress: number, completed: boolean): Promise<UserMissionProgress> {
    const [updatedProgress] = await db
      .update(userMissionProgress)
      .set({ progress, completed, lastUpdated: new Date() })
      .where(eq(userMissionProgress.id, progressId))
      .returning();
    
    return updatedProgress;
  }

  async claimMissionReward(progressId: number, userId: number): Promise<{ updated: UserMissionProgress; reward: number }> {
    // First get the progress record and mission details
    const [progressRecord] = await db
      .select({
        progress: userMissionProgress,
        mission: dailyMissions
      })
      .from(userMissionProgress)
      .innerJoin(dailyMissions, eq(userMissionProgress.missionId, dailyMissions.id))
      .where(
        and(
          eq(userMissionProgress.id, progressId),
          eq(userMissionProgress.userId, userId),
          eq(userMissionProgress.completed, true),
          eq(userMissionProgress.claimed, false)
        )
      );

    if (!progressRecord) {
      throw new Error("Mission progress not found or not eligible for claiming");
    }

    // Update the progress to claimed
    const [updated] = await db
      .update(userMissionProgress)
      .set({ claimed: true })
      .where(eq(userMissionProgress.id, progressId))
      .returning();

    // Update user's SLERF balance
    await this.updateUserSlerfBalance(userId, progressRecord.mission.reward);

    return { updated, reward: progressRecord.mission.reward };
  }

  async initUserMissionProgress(progress: InsertUserMissionProgress): Promise<UserMissionProgress> {
    const [newProgress] = await db
      .insert(userMissionProgress)
      .values(progress)
      .returning();
    
    return newProgress;
  }

  // Weekly Quests
  async getWeeklyQuests(): Promise<WeeklyQuest[]> {
    return db
      .select()
      .from(weeklyQuests)
      .where(
        and(
          eq(weeklyQuests.active, true),
          sql`${weeklyQuests.expiresAt} > NOW()`
        )
      );
  }

  async getWeeklyQuest(id: number): Promise<WeeklyQuest | undefined> {
    const [quest] = await db.select().from(weeklyQuests).where(eq(weeklyQuests.id, id));
    return quest;
  }

  async createWeeklyQuest(quest: InsertWeeklyQuest): Promise<WeeklyQuest> {
    const [newQuest] = await db
      .insert(weeklyQuests)
      .values(quest)
      .returning();
    return newQuest;
  }

  async getUserQuestProgress(userId: number): Promise<(UserQuestProgress & { quest: WeeklyQuest })[]> {
    const result = await db
      .select({
        progress: userQuestProgress,
        quest: weeklyQuests
      })
      .from(userQuestProgress)
      .innerJoin(weeklyQuests, eq(userQuestProgress.questId, weeklyQuests.id))
      .where(eq(userQuestProgress.userId, userId));

    return result.map(item => ({
      ...item.progress,
      quest: item.quest
    }));
  }

  async updateQuestProgress(progressId: number, progress: number, completed: boolean): Promise<UserQuestProgress> {
    const [updatedProgress] = await db
      .update(userQuestProgress)
      .set({ progress, completed, lastUpdated: new Date() })
      .where(eq(userQuestProgress.id, progressId))
      .returning();
    
    return updatedProgress;
  }

  async claimQuestReward(progressId: number, userId: number): Promise<{ updated: UserQuestProgress; reward: number }> {
    // First get the progress record and quest details
    const [progressRecord] = await db
      .select({
        progress: userQuestProgress,
        quest: weeklyQuests
      })
      .from(userQuestProgress)
      .innerJoin(weeklyQuests, eq(userQuestProgress.questId, weeklyQuests.id))
      .where(
        and(
          eq(userQuestProgress.id, progressId),
          eq(userQuestProgress.userId, userId),
          eq(userQuestProgress.completed, true),
          eq(userQuestProgress.claimed, false)
        )
      );

    if (!progressRecord) {
      throw new Error("Quest progress not found or not eligible for claiming");
    }

    // Update the progress to claimed
    const [updated] = await db
      .update(userQuestProgress)
      .set({ claimed: true })
      .where(eq(userQuestProgress.id, progressId))
      .returning();

    // Update user's SLERF balance
    await this.updateUserSlerfBalance(userId, progressRecord.quest.reward);

    return { updated, reward: progressRecord.quest.reward };
  }

  async initUserQuestProgress(progress: InsertUserQuestProgress): Promise<UserQuestProgress> {
    const [newProgress] = await db
      .insert(userQuestProgress)
      .values(progress)
      .returning();
    
    return newProgress;
  }

  // Staking Vaults
  async getStakingVaults(): Promise<StakingVault[]> {
    return db.select().from(stakingVaults);
  }

  async getStakingVault(id: number): Promise<StakingVault | undefined> {
    const [vault] = await db.select().from(stakingVaults).where(eq(stakingVaults.id, id));
    return vault;
  }

  async createStakingVault(vault: InsertStakingVault): Promise<StakingVault> {
    const [newVault] = await db
      .insert(stakingVaults)
      .values(vault)
      .returning();
    return newVault;
  }

  async getUserStakes(userId: number): Promise<(UserStake & { vault: StakingVault })[]> {
    const result = await db
      .select({
        stake: userStakes,
        vault: stakingVaults
      })
      .from(userStakes)
      .innerJoin(stakingVaults, eq(userStakes.vaultId, stakingVaults.id))
      .where(eq(userStakes.userId, userId));

    return result.map(item => ({
      ...item.stake,
      vault: item.vault
    }));
  }

  async stakeTokens(stake: InsertUserStake): Promise<UserStake> {
    // Check if the user has enough SLERF balance
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, stake.userId));
    
    if (!user || user.slerfBalance < stake.amount) {
      throw new Error("Insufficient SLERF balance for staking");
    }

    // Get vault to check minimum stake amount
    const [vault] = await db
      .select()
      .from(stakingVaults)
      .where(eq(stakingVaults.id, stake.vaultId));
    
    if (!vault) {
      throw new Error("Staking vault not found");
    }

    if (vault.minStake !== null && stake.amount < vault.minStake) {
      throw new Error(`Stake amount must be at least ${vault.minStake} SLERF`);
    }

    // Update user balance
    await db
      .update(users)
      .set({ slerfBalance: user.slerfBalance - stake.amount })
      .where(eq(users.id, stake.userId));

    // Create stake
    const [newStake] = await db
      .insert(userStakes)
      .values({
        ...stake,
        stakedAt: new Date(),
        lastClaimed: new Date()
      })
      .returning();
    
    return newStake;
  }

  async unstakeTokens(stakeId: number, userId: number): Promise<{ amount: number }> {
    // Get the stake
    const [stake] = await db
      .select()
      .from(userStakes)
      .where(
        and(
          eq(userStakes.id, stakeId),
          eq(userStakes.userId, userId)
        )
      );
    
    if (!stake) {
      throw new Error("Stake not found");
    }

    // Calculate accrued rewards
    const now = new Date();
    const lastClaimed = stake.lastClaimed || stake.stakedAt;
    const hoursSinceLastClaimed = Math.max(0, (now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60));

    // Get vault details for APR
    const [vault] = await db
      .select()
      .from(stakingVaults)
      .where(eq(stakingVaults.id, stake.vaultId));
    
    if (!vault) {
      throw new Error("Staking vault not found");
    }

    // Calculate rewards based on APR, amount, and time (in hours)
    // APR is stored as percentage * 100, so 7.5% is stored as 750
    const yearlyRate = (vault.apr / 10000); // Convert to decimal
    const hourlyRate = yearlyRate / 8760; // Hours in a year
    const rewards = Math.floor(stake.amount * hourlyRate * hoursSinceLastClaimed);

    // Update user balance with stake amount + rewards
    await this.updateUserSlerfBalance(userId, stake.amount + rewards);

    // Delete the stake
    await db
      .delete(userStakes)
      .where(eq(userStakes.id, stakeId));

    return { amount: stake.amount + rewards };
  }

  async claimStakingRewards(stakeId: number, userId: number): Promise<{ rewards: number }> {
    // Get the stake
    const [stake] = await db
      .select()
      .from(userStakes)
      .where(
        and(
          eq(userStakes.id, stakeId),
          eq(userStakes.userId, userId)
        )
      );
    
    if (!stake) {
      throw new Error("Stake not found");
    }

    // Calculate accrued rewards
    const now = new Date();
    const lastClaimed = stake.lastClaimed || stake.stakedAt;
    const hoursSinceLastClaimed = Math.max(0, (now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60));

    // Get vault details for APR
    const [vault] = await db
      .select()
      .from(stakingVaults)
      .where(eq(stakingVaults.id, stake.vaultId));
    
    if (!vault) {
      throw new Error("Staking vault not found");
    }

    // Calculate rewards based on APR, amount, and time (in hours)
    // APR is stored as percentage * 100, so 7.5% is stored as 750
    const yearlyRate = (vault.apr / 10000); // Convert to decimal
    const hourlyRate = yearlyRate / 8760; // Hours in a year
    const rewards = Math.floor(stake.amount * hourlyRate * hoursSinceLastClaimed);

    if (rewards <= 0) {
      throw new Error("No rewards available to claim yet");
    }

    // Update user balance with rewards
    await this.updateUserSlerfBalance(userId, rewards);

    // Update stake's lastClaimed time
    await db
      .update(userStakes)
      .set({ 
        lastClaimed: now,
        rewards: (stake.rewards || 0) + rewards 
      })
      .where(eq(userStakes.id, stakeId));

    return { rewards };
  }

  // Games
  async getGames(): Promise<Game[]> {
    return db
      .select()
      .from(games)
      .where(eq(games.active, true));
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db
      .insert(games)
      .values(game)
      .returning();
    return newGame;
  }

  async getGameLeaderboard(gameId: number, limit: number = 10): Promise<(GameScore & { user: { username: string; id: number } })[]> {
    const result = await db
      .select({
        score: gameScores,
        user: {
          username: users.username,
          id: users.id
        }
      })
      .from(gameScores)
      .innerJoin(users, eq(gameScores.userId, users.id))
      .where(eq(gameScores.gameId, gameId))
      .orderBy(desc(gameScores.score))
      .limit(limit);

    return result.map(item => ({
      ...item.score,
      user: item.user
    }));
  }

  async getUserGameScores(userId: number): Promise<(GameScore & { game: Game })[]> {
    const result = await db
      .select({
        score: gameScores,
        game: games
      })
      .from(gameScores)
      .innerJoin(games, eq(gameScores.gameId, games.id))
      .where(eq(gameScores.userId, userId))
      .orderBy([asc(gameScores.gameId), desc(gameScores.score)]);

    return result.map(item => ({
      ...item.score,
      game: item.game
    }));
  }

  async submitGameScore(score: InsertGameScore): Promise<GameScore> {
    // Check if the game exists and is active
    const [game] = await db
      .select()
      .from(games)
      .where(
        and(
          eq(games.id, score.gameId),
          eq(games.active, true)
        )
      );
    
    if (!game) {
      throw new Error("Game not found or inactive");
    }

    // Create the score entry
    const [newScore] = await db
      .insert(gameScores)
      .values({
        ...score,
        playedAt: new Date()
      })
      .returning();
    
    // Check if this is a new high score, and reward tokens if it is
    const [highScore] = await db
      .select()
      .from(gameScores)
      .where(
        and(
          eq(gameScores.userId, score.userId),
          eq(gameScores.gameId, score.gameId)
        )
      )
      .orderBy(desc(gameScores.score))
      .limit(1);

    if (highScore && highScore.id === newScore.id) {
      // This is a new high score, reward the user
      await this.updateUserSlerfBalance(score.userId, game.reward);
    }
    
    return newScore;
  }

  // NFT Boosters
  async getNftBoosters(): Promise<NftBooster[]> {
    return db.select().from(nftBoosters);
  }

  async getNftBooster(id: number): Promise<NftBooster | undefined> {
    const [nft] = await db.select().from(nftBoosters).where(eq(nftBoosters.id, id));
    return nft;
  }

  async createNftBooster(nft: InsertNftBooster): Promise<NftBooster> {
    const [newNft] = await db
      .insert(nftBoosters)
      .values(nft)
      .returning();
    return newNft;
  }

  async getUserNfts(userId: number): Promise<(UserNft & { nft: NftBooster })[]> {
    const result = await db
      .select({
        userNft: userNfts,
        nft: nftBoosters
      })
      .from(userNfts)
      .innerJoin(nftBoosters, eq(userNfts.nftId, nftBoosters.id))
      .where(eq(userNfts.userId, userId));

    return result.map(item => ({
      ...item.userNft,
      nft: item.nft
    }));
  }

  async mintNft(userNft: InsertUserNft): Promise<UserNft> {
    // Get NFT details to check the price
    const [nft] = await db
      .select()
      .from(nftBoosters)
      .where(eq(nftBoosters.id, userNft.nftId));
    
    if (!nft) {
      throw new Error("NFT not found");
    }

    // Check if the user has enough SLERF balance
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userNft.userId));
    
    if (!user || user.slerfBalance < nft.price) {
      throw new Error("Insufficient SLERF balance to mint NFT");
    }

    // Update user balance
    await db
      .update(users)
      .set({ slerfBalance: user.slerfBalance - nft.price })
      .where(eq(users.id, userNft.userId));

    // Create the user NFT
    const [newUserNft] = await db
      .insert(userNfts)
      .values({
        ...userNft,
        mintedAt: new Date()
      })
      .returning();
    
    return newUserNft;
  }

  // Marketplace
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return db
      .select()
      .from(marketplaceItems)
      .where(eq(marketplaceItems.available, true));
  }

  async getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined> {
    const [item] = await db
      .select()
      .from(marketplaceItems)
      .where(eq(marketplaceItems.id, id));
    return item;
  }

  async createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const [newItem] = await db
      .insert(marketplaceItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getUserPurchases(userId: number): Promise<(UserPurchase & { item: MarketplaceItem })[]> {
    const result = await db
      .select({
        purchase: userPurchases,
        item: marketplaceItems
      })
      .from(userPurchases)
      .innerJoin(marketplaceItems, eq(userPurchases.itemId, marketplaceItems.id))
      .where(eq(userPurchases.userId, userId));

    return result.map(item => ({
      ...item.purchase,
      item: item.item
    }));
  }

  async purchaseItem(purchase: InsertUserPurchase): Promise<UserPurchase> {
    // Get item details to check the price
    const [item] = await db
      .select()
      .from(marketplaceItems)
      .where(
        and(
          eq(marketplaceItems.id, purchase.itemId),
          eq(marketplaceItems.available, true)
        )
      );
    
    if (!item) {
      throw new Error("Item not found or not available");
    }

    // Check if the user has enough SLERF balance
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, purchase.userId));
    
    if (!user || user.slerfBalance < item.price) {
      throw new Error("Insufficient SLERF balance to purchase item");
    }

    // Update user balance
    await db
      .update(users)
      .set({ slerfBalance: user.slerfBalance - item.price })
      .where(eq(users.id, purchase.userId));

    // Create the purchase
    const [newPurchase] = await db
      .insert(userPurchases)
      .values({
        ...purchase,
        purchasedAt: new Date()
      })
      .returning();
    
    return newPurchase;
  }

  // Social Connections
  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    return db
      .select()
      .from(socialConnections)
      .where(eq(socialConnections.userId, userId));
  }

  async connectSocial(connection: InsertSocialConnection): Promise<SocialConnection> {
    // Check if a connection for this platform already exists
    const existingConnections = await db
      .select()
      .from(socialConnections)
      .where(
        and(
          eq(socialConnections.userId, connection.userId),
          eq(socialConnections.platform, connection.platform)
        )
      );
    
    if (existingConnections.length > 0) {
      // Update existing connection
      const [updatedConnection] = await db
        .update(socialConnections)
        .set({ 
          username: connection.username,
          connected: true,
          connectedAt: new Date()
        })
        .where(eq(socialConnections.id, existingConnections[0].id))
        .returning();
      
      return updatedConnection;
    }

    // Create new connection
    const [newConnection] = await db
      .insert(socialConnections)
      .values({
        ...connection,
        connected: true,
        connectedAt: new Date()
      })
      .returning();
    
    return newConnection;
  }

  async disconnectSocial(connectionId: number, userId: number): Promise<boolean> {
    const result = await db
      .update(socialConnections)
      .set({ connected: false })
      .where(
        and(
          eq(socialConnections.id, connectionId),
          eq(socialConnections.userId, userId)
        )
      );
    
    return result.rowCount > 0;
  }

  // Statistics
  async getStats(): Promise<{ totalUsers: number; slerfDistributed: number; activeQuests: number; averageApr: number; }> {
    // Total users
    const [usersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    
    // Total SLERF distributed (sum of all user balances)
    const [slerfTotal] = await db
      .select({ 
        sum: sql<number>`COALESCE(sum(slerf_balance), 0)` 
      })
      .from(users);
    
    // Active quests/missions
    const [questsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(weeklyQuests)
      .where(
        and(
          eq(weeklyQuests.active, true),
          sql`${weeklyQuests.expiresAt} > NOW()`
        )
      );
    
    // Average APR
    const [aprAvg] = await db
      .select({ 
        avg: sql<number>`COALESCE(avg(apr), 0)` 
      })
      .from(stakingVaults);
    
    return {
      totalUsers: usersCount.count || 0,
      slerfDistributed: slerfTotal.sum || 0,
      activeQuests: questsCount.count || 0,
      averageApr: Math.round((aprAvg.avg || 0) / 100) / 10, // Convert to percentage with 1 decimal
    };
  }
  
  // Referrals
  async getReferralLeaderboard(limit: number = 5): Promise<{ id: number; username: string; referrals: number; earned: number; }[]> {
    // For each referrer, count how many users have them as referredBy
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        referrals: sql<number>`COUNT(r.id)`,
        // Approximate earnings based on referred users' balances and a 5% commission
        earned: sql<number>`COALESCE(FLOOR(SUM(r.slerf_balance) * 0.05), 0)`,
      })
      .from(users)
      .leftJoin(users, eq(users.id, users.as("r").referredBy))
      .groupBy(users.id, users.username)
      .orderBy(desc(sql<number>`COUNT(r.id)`))
      .limit(limit);
    
    return result;
  }

  async getReferrals(userId: number): Promise<{ referrals: number; earned: number; tier: string; }> {
    // Count referrals
    const [referralsCount] = await db
      .select({
        count: sql<number>`count(*)`,
        // Approximate earnings based on referred users' balances and commissions ranging from 5-15%
        earned: sql<number>`COALESCE(FLOOR(SUM(slerf_balance) * 
          CASE 
            WHEN COUNT(*) >= 50 THEN 0.15 
            WHEN COUNT(*) >= 20 THEN 0.10 
            WHEN COUNT(*) >= 5 THEN 0.075 
            ELSE 0.05 
          END), 0)`,
      })
      .from(users)
      .where(eq(users.referredBy, userId));
    
    const count = referralsCount.count || 0;
    let tier = "Bronze";
    
    if (count >= 50) {
      tier = "Diamond";
    } else if (count >= 20) {
      tier = "Gold";
    } else if (count >= 5) {
      tier = "Silver";
    }
    
    return {
      referrals: count,
      earned: referralsCount.earned || 0,
      tier
    };
  }
}

// Use the DatabaseStorage for persistence
export const storage = new DatabaseStorage();
