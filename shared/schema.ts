import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  slerfBalance: integer("slerf_balance").default(0),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by").references(() => users.id),
  tier: text("tier").default("bronze")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const dailyMissions = pgTable("daily_missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  icon: text("icon").notNull(),
  requirements: jsonb("requirements").notNull(),
  active: boolean("active").default(true),
});

export const insertDailyMissionSchema = createInsertSchema(dailyMissions).pick({
  title: true,
  description: true,
  reward: true,
  icon: true,
  requirements: true,
  active: true,
});

export const userMissionProgress = pgTable("user_mission_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  missionId: integer("mission_id").references(() => dailyMissions.id).notNull(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  claimed: boolean("claimed").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserMissionProgressSchema = createInsertSchema(userMissionProgress).pick({
  userId: true,
  missionId: true,
  progress: true,
  completed: true,
  claimed: true,
});

export const weeklyQuests = pgTable("weekly_quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  icon: text("icon").notNull(),
  requirements: jsonb("requirements").notNull(),
  active: boolean("active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertWeeklyQuestSchema = createInsertSchema(weeklyQuests).pick({
  title: true,
  description: true,
  reward: true,
  icon: true,
  requirements: true,
  active: true,
  expiresAt: true,
});

export const userQuestProgress = pgTable("user_quest_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  questId: integer("quest_id").references(() => weeklyQuests.id).notNull(),
  progress: integer("progress").default(0),
  progressMax: integer("progress_max").notNull(),
  completed: boolean("completed").default(false),
  claimed: boolean("claimed").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserQuestProgressSchema = createInsertSchema(userQuestProgress).pick({
  userId: true,
  questId: true,
  progress: true,
  progressMax: true,
  completed: true,
  claimed: true,
});

export const stakingVaults = pgTable("staking_vaults", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  apr: integer("apr").notNull(),
  minStake: integer("min_stake").default(0),
  requirements: jsonb("requirements"),
});

export const insertStakingVaultSchema = createInsertSchema(stakingVaults).pick({
  name: true,
  description: true,
  apr: true,
  minStake: true,
  requirements: true,
});

export const userStakes = pgTable("user_stakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  vaultId: integer("vault_id").references(() => stakingVaults.id).notNull(),
  amount: integer("amount").notNull(),
  rewards: integer("rewards").default(0),
  stakedAt: timestamp("staked_at").defaultNow(),
  lastClaimed: timestamp("last_claimed").defaultNow(),
});

export const insertUserStakeSchema = createInsertSchema(userStakes).pick({
  userId: true,
  vaultId: true,
  amount: true,
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  imageUrl: text("image_url").notNull(),
  active: boolean("active").default(true),
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  description: true,
  reward: true,
  imageUrl: true,
  active: true,
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  score: integer("score").notNull(),
  playedAt: timestamp("played_at").defaultNow(),
});

export const insertGameScoreSchema = createInsertSchema(gameScores).pick({
  userId: true,
  gameId: true,
  score: true,
});

export const nftBoosters = pgTable("nft_boosters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  boost: integer("boost").notNull(),
  rarity: text("rarity").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertNftBoosterSchema = createInsertSchema(nftBoosters).pick({
  name: true,
  description: true,
  boost: true,
  rarity: true,
  price: true,
  imageUrl: true,
});

export const userNfts = pgTable("user_nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  nftId: integer("nft_id").references(() => nftBoosters.id).notNull(),
  mintedAt: timestamp("minted_at").defaultNow(),
});

export const insertUserNftSchema = createInsertSchema(userNfts).pick({
  userId: true,
  nftId: true,
});

export const marketplaceItems = pgTable("marketplace_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // Merchandise, Digital, Access
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").default(true),
});

export const insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).pick({
  name: true,
  description: true,
  type: true,
  price: true,
  imageUrl: true,
  available: true,
});

export const userPurchases = pgTable("user_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemId: integer("item_id").references(() => marketplaceItems.id).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const insertUserPurchaseSchema = createInsertSchema(userPurchases).pick({
  userId: true,
  itemId: true,
});

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  connected: boolean("connected").default(true),
  connectedAt: timestamp("connected_at").defaultNow(),
});

export const insertSocialConnectionSchema = createInsertSchema(socialConnections).pick({
  userId: true,
  platform: true,
  username: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DailyMission = typeof dailyMissions.$inferSelect;
export type InsertDailyMission = z.infer<typeof insertDailyMissionSchema>;

export type UserMissionProgress = typeof userMissionProgress.$inferSelect;
export type InsertUserMissionProgress = z.infer<typeof insertUserMissionProgressSchema>;

export type WeeklyQuest = typeof weeklyQuests.$inferSelect;
export type InsertWeeklyQuest = z.infer<typeof insertWeeklyQuestSchema>;

export type UserQuestProgress = typeof userQuestProgress.$inferSelect;
export type InsertUserQuestProgress = z.infer<typeof insertUserQuestProgressSchema>;

export type StakingVault = typeof stakingVaults.$inferSelect;
export type InsertStakingVault = z.infer<typeof insertStakingVaultSchema>;

export type UserStake = typeof userStakes.$inferSelect;
export type InsertUserStake = z.infer<typeof insertUserStakeSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;

export type NftBooster = typeof nftBoosters.$inferSelect;
export type InsertNftBooster = z.infer<typeof insertNftBoosterSchema>;

export type UserNft = typeof userNfts.$inferSelect;
export type InsertUserNft = z.infer<typeof insertUserNftSchema>;

export type MarketplaceItem = typeof marketplaceItems.$inferSelect;
export type InsertMarketplaceItem = z.infer<typeof insertMarketplaceItemSchema>;

export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertUserPurchase = z.infer<typeof insertUserPurchaseSchema>;

export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertSocialConnection = z.infer<typeof insertSocialConnectionSchema>;
