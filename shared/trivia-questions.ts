// Daily Trivia Questions for $LERF Token Distribution
export const TRIVIA_CATEGORIES = {
  CRYPTO: "crypto",
  DEFI: "defi",
  BLOCKCHAIN: "blockchain",
  LERF: "lerf",
  GENERAL: "general"
} as const;

export type TriviaCategory = typeof TRIVIA_CATEGORIES[keyof typeof TRIVIA_CATEGORIES];

export interface TriviaQuestion {
  id: string;
  category: TriviaCategory;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  reward: number; // $LERF tokens
  explanation?: string;
}

export const DAILY_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // $LERF Token Specific Questions
  {
    id: "lerf_001",
    category: "lerf",
    question: "What is the total supply of $LERF tokens?",
    options: ["50 Billion", "100 Billion", "150 Billion", "200 Billion"],
    correctAnswer: 1,
    difficulty: "easy",
    reward: 500000,
    explanation: "$LERF has a total supply of 100 billion tokens on Base network."
  },
  {
    id: "lerf_002",
    category: "lerf",
    question: "On which blockchain network is $LERF deployed?",
    options: ["Ethereum", "Base", "Solana", "Polygon"],
    correctAnswer: 1,
    difficulty: "easy",
    reward: 500000,
    explanation: "$LERF is deployed on Base, Coinbase's Layer 2 solution."
  },
  {
    id: "lerf_003",
    category: "lerf",
    question: "What are the buy/sell taxes for $LERF?",
    options: ["5%/5%", "3%/3%", "0%/0%", "1%/1%"],
    correctAnswer: 2,
    difficulty: "medium",
    reward: 1000000,
    explanation: "$LERF has 0% buy and sell taxes, making it frictionless to trade."
  },

  // DeFi Questions
  {
    id: "defi_001",
    category: "defi",
    question: "What does DEX stand for?",
    options: ["Digital Exchange", "Decentralized Exchange", "Direct Exchange", "Dynamic Exchange"],
    correctAnswer: 1,
    difficulty: "easy",
    reward: 500000,
    explanation: "DEX stands for Decentralized Exchange, allowing peer-to-peer trading."
  },
  {
    id: "defi_002",
    category: "defi",
    question: "What is liquidity in DeFi?",
    options: ["Token price", "Available funds for trading", "Transaction speed", "Gas fees"],
    correctAnswer: 1,
    difficulty: "medium",
    reward: 1000000,
    explanation: "Liquidity refers to available funds that enable smooth trading with minimal slippage."
  },

  // Blockchain Questions
  {
    id: "blockchain_001",
    category: "blockchain",
    question: "What is a smart contract?",
    options: ["Legal document", "Self-executing code", "Trading algorithm", "Wallet software"],
    correctAnswer: 1,
    difficulty: "medium",
    reward: 1000000,
    explanation: "Smart contracts are self-executing programs that run on blockchain networks."
  },
  {
    id: "blockchain_002",
    category: "blockchain",
    question: "What consensus mechanism does Ethereum 2.0 use?",
    options: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Delegated Proof of Stake"],
    correctAnswer: 1,
    difficulty: "hard",
    reward: 2000000,
    explanation: "Ethereum 2.0 uses Proof of Stake, which is more energy efficient than Proof of Work."
  },

  // Crypto General Questions
  {
    id: "crypto_001",
    category: "crypto",
    question: "What does HODL mean?",
    options: ["Hold On for Dear Life", "High Order Digital Ledger", "Hash of Digital License", "Hybrid Online Data Link"],
    correctAnswer: 0,
    difficulty: "easy",
    reward: 500000,
    explanation: "HODL originated from a misspelling of 'hold' and means to keep your crypto long-term."
  },
  {
    id: "crypto_002",
    category: "crypto",
    question: "What is the maximum supply of Bitcoin?",
    options: ["18 million", "19 million", "21 million", "25 million"],
    correctAnswer: 2,
    difficulty: "medium",
    reward: 1000000,
    explanation: "Bitcoin has a maximum supply of 21 million coins, making it deflationary."
  }
];

export const WEEKLY_TRIVIA_CHALLENGES: TriviaQuestion[] = [
  {
    id: "weekly_001",
    category: "lerf",
    question: "What is the current market cap of $LERF approximately?",
    options: ["$12K", "$24K", "$48K", "$96K"],
    correctAnswer: 1,
    difficulty: "medium",
    reward: 2000000,
    explanation: "Based on current data, $LERF has a market cap of approximately $24.43K."
  },
  {
    id: "weekly_002",
    category: "defi",
    question: "Which DEX is $LERF primarily traded on?",
    options: ["SushiSwap", "Uniswap V3", "PancakeSwap", "Curve"],
    correctAnswer: 1,
    difficulty: "medium",
    reward: 2000000,
    explanation: "$LERF is primarily traded on Uniswap V3 on the Base network."
  }
];

export function getRandomDailyTrivia(count: number = 3): TriviaQuestion[] {
  const shuffled = [...DAILY_TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getWeeklyTrivia(): TriviaQuestion[] {
  return WEEKLY_TRIVIA_CHALLENGES;
}

export function calculateTriviaReward(correctAnswers: number, totalQuestions: number): number {
  const baseReward = 500000; // 500K $LERF base
  const perfectBonus = 2000000; // 2M $LERF perfect score bonus
  const accuracy = correctAnswers / totalQuestions;
  
  if (accuracy === 1.0) {
    return baseReward * totalQuestions + perfectBonus;
  }
  
  return baseReward * correctAnswers;
}