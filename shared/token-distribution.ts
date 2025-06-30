import { LERF_TOKEN_CONFIG, TOKEN_DISTRIBUTION, REWARD_RATES } from "./token-config";

export interface TokenTransaction {
  id: string;
  userId: number;
  type: "reward" | "penalty" | "transfer" | "stake" | "unstake";
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  txHash?: string;
}

export interface RewardEvent {
  type: "daily_mission" | "weekly_quest" | "trivia" | "wallet_connection" | "social_engagement" | "referral";
  subType?: string;
  userId: number;
  amount: number;
  metadata?: Record<string, any>;
}

export class TokenDistributor {
  private static instance: TokenDistributor;
  private transactions: TokenTransaction[] = [];

  static getInstance(): TokenDistributor {
    if (!TokenDistributor.instance) {
      TokenDistributor.instance = new TokenDistributor();
    }
    return TokenDistributor.instance;
  }

  // Daily Mission Rewards
  async distributeMissionReward(userId: number, missionType: "simple" | "medium" | "hard"): Promise<TokenTransaction> {
    const amount = REWARD_RATES[`${missionType}Mission`];
    return this.createReward({
      type: "daily_mission",
      subType: missionType,
      userId,
      amount,
      metadata: { missionType }
    });
  }

  // Weekly Quest Rewards
  async distributeQuestReward(userId: number, questType: "weekly" | "special"): Promise<TokenTransaction> {
    const amount = REWARD_RATES[`${questType}Quest`];
    return this.createReward({
      type: "weekly_quest",
      subType: questType,
      userId,
      amount,
      metadata: { questType }
    });
  }

  // Trivia Rewards
  async distributeTriviaReward(userId: number, triviaType: "daily" | "weekly", correctAnswers: number, totalQuestions: number): Promise<TokenTransaction> {
    const baseAmount = REWARD_RATES[`${triviaType}Trivia`];
    const accuracy = correctAnswers / totalQuestions;
    let amount = baseAmount * correctAnswers;
    
    // Perfect score bonus
    if (accuracy === 1.0) {
      amount += REWARD_RATES.perfectScore;
    }

    return this.createReward({
      type: "trivia",
      subType: triviaType,
      userId,
      amount,
      metadata: { correctAnswers, totalQuestions, accuracy, perfectScore: accuracy === 1.0 }
    });
  }

  // Wallet Connection Rewards
  async distributeWalletReward(userId: number, walletType: "first" | "second" | "crossChain"): Promise<TokenTransaction> {
    let amount: number;
    
    switch (walletType) {
      case "first":
        amount = REWARD_RATES.firstWallet;
        break;
      case "second":
        amount = REWARD_RATES.secondWallet;
        break;
      case "crossChain":
        amount = REWARD_RATES.crossChain;
        break;
      default:
        amount = REWARD_RATES.firstWallet;
    }

    return this.createReward({
      type: "wallet_connection",
      subType: walletType,
      userId,
      amount,
      metadata: { walletType }
    });
  }

  // Social Engagement Rewards
  async distributeSocialReward(userId: number, platform: "twitter" | "discord" | "github"): Promise<TokenTransaction> {
    let amount: number;
    
    switch (platform) {
      case "twitter":
        amount = REWARD_RATES.twitterFollow;
        break;
      case "discord":
        amount = REWARD_RATES.discordJoin;
        break;
      case "github":
        amount = REWARD_RATES.githubStar;
        break;
      default:
        amount = REWARD_RATES.twitterFollow;
    }

    return this.createReward({
      type: "social_engagement",
      subType: platform,
      userId,
      amount,
      metadata: { platform }
    });
  }

  // Referral Rewards
  async distributeReferralReward(referrerId: number, refereeId: number): Promise<TokenTransaction[]> {
    const amount = REWARD_RATES.referralBonus;
    
    // Reward both referrer and referee
    const referrerReward = this.createReward({
      type: "referral",
      subType: "referrer",
      userId: referrerId,
      amount,
      metadata: { refereeId, role: "referrer" }
    });

    const refereeReward = this.createReward({
      type: "referral",
      subType: "referee",
      userId: refereeId,
      amount: amount / 2, // Referee gets half
      metadata: { referrerId, role: "referee" }
    });

    return [await referrerReward, await refereeReward];
  }

  private async createReward(event: RewardEvent): Promise<TokenTransaction> {
    const transaction: TokenTransaction = {
      id: this.generateTransactionId(),
      userId: event.userId,
      type: "reward",
      amount: event.amount,
      reason: `${event.type}_${event.subType || 'reward'}`,
      metadata: event.metadata,
      timestamp: new Date()
    };

    this.transactions.push(transaction);
    return transaction;
  }

  private generateTransactionId(): string {
    return `lerf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get user's total rewards
  getUserRewards(userId: number): TokenTransaction[] {
    return this.transactions.filter(tx => tx.userId === userId && tx.type === "reward");
  }

  // Get total distributed tokens
  getTotalDistributed(): number {
    return this.transactions
      .filter(tx => tx.type === "reward")
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  // Get distribution stats
  getDistributionStats(): {
    totalDistributed: number;
    totalTransactions: number;
    distributionByType: Record<string, number>;
    remainingPool: Record<string, number>;
  } {
    const totalDistributed = this.getTotalDistributed();
    const totalTransactions = this.transactions.length;
    
    const distributionByType: Record<string, number> = {};
    this.transactions.forEach(tx => {
      if (tx.type === "reward") {
        const key = tx.reason;
        distributionByType[key] = (distributionByType[key] || 0) + tx.amount;
      }
    });

    // Calculate remaining tokens in each pool
    const remainingPool = {
      community: parseInt(TOKEN_DISTRIBUTION.communityPool.amount) - 
        Object.entries(distributionByType)
          .filter(([key]) => key.includes('mission') || key.includes('quest') || key.includes('social') || key.includes('referral'))
          .reduce((sum, [, amount]) => sum + amount, 0),
      
      trivia: parseInt(TOKEN_DISTRIBUTION.triviaPool.amount) - 
        Object.entries(distributionByType)
          .filter(([key]) => key.includes('trivia'))
          .reduce((sum, [, amount]) => sum + amount, 0),
      
      wallet: parseInt(TOKEN_DISTRIBUTION.walletRewards.amount) - 
        Object.entries(distributionByType)
          .filter(([key]) => key.includes('wallet'))
          .reduce((sum, [, amount]) => sum + amount, 0)
    };

    return {
      totalDistributed,
      totalTransactions,
      distributionByType,
      remainingPool
    };
  }
}

export const tokenDistributor = TokenDistributor.getInstance();