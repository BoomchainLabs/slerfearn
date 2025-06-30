// Web4 and Cross-Chain Configuration
export const WEB4_CONFIG = {
  // Web4 Integration - Decentralized Identity and Data
  web4: {
    enabled: true,
    protocols: {
      ipfs: {
        gateway: 'https://ipfs.io/ipfs/',
        pinata: {
          enabled: true,
          apiKey: process.env.PINATA_API_KEY,
          secretKey: process.env.PINATA_SECRET_KEY
        }
      },
      arweave: {
        enabled: true,
        gateway: 'https://arweave.net/',
        wallet: process.env.ARWEAVE_WALLET_KEY
      },
      ens: {
        enabled: true,
        resolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
      }
    }
  },

  // Cross-Chain Marketplace Configuration
  crossChain: {
    networks: {
      ethereum: {
        chainId: 1,
        name: 'Ethereum',
        rpcUrl: process.env.ETHEREUM_RPC_URL,
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://etherscan.io'
      },
      base: {
        chainId: 8453,
        name: 'Base',
        rpcUrl: process.env.BASE_RPC_URL,
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://basescan.org'
      },
      polygon: {
        chainId: 137,
        name: 'Polygon',
        rpcUrl: process.env.POLYGON_RPC_URL,
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        blockExplorer: 'https://polygonscan.com'
      },
      bsc: {
        chainId: 56,
        name: 'BNB Smart Chain',
        rpcUrl: process.env.BSC_RPC_URL,
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        blockExplorer: 'https://bscscan.com'
      },
      solana: {
        chainId: 101,
        name: 'Solana',
        rpcUrl: process.env.SOLANA_RPC_URL,
        nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
        blockExplorer: 'https://solscan.io'
      }
    },
    bridges: {
      wormhole: {
        enabled: true,
        contractAddress: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
      },
      layerZero: {
        enabled: true,
        endpoint: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675'
      },
      portal: {
        enabled: true,
        bridgeAddress: '0x0290FB167208Af455bB137780163b7B7a9a10C16'
      }
    }
  },

  // Meme Token Marketplace Features
  marketplace: {
    categories: [
      'Popular Memes',
      'New Launches',
      'Gaming Tokens',
      'Community Coins',
      'Utility Tokens',
      'Art & Collectibles'
    ],
    features: {
      launchpad: true,
      staking: true,
      governance: true,
      nftIntegration: true,
      socialTrading: true,
      crossChainSwap: true
    },
    trading: {
      supportedDEXs: [
        'Uniswap V3',
        'PancakeSwap',
        'SushiSwap',
        'QuickSwap',
        'Jupiter (Solana)',
        'Raydium (Solana)'
      ],
      slippageTolerance: 0.5,
      maxSlippage: 5.0,
      gasOptimization: true
    }
  },

  // Web3/Web4 Onboarding Flow
  onboarding: {
    steps: [
      {
        id: 'wallet-connect',
        title: 'Connect Your Wallet',
        description: 'Choose from 50+ supported wallets',
        required: true
      },
      {
        id: 'web4-identity',
        title: 'Create Web4 Identity',
        description: 'Decentralized profile with ENS/Unstoppable domains',
        required: false
      },
      {
        id: 'cross-chain-setup',
        title: 'Multi-Chain Setup',
        description: 'Enable trading across 5+ blockchains',
        required: false
      },
      {
        id: 'social-verification',
        title: 'Social Verification',
        description: 'Link Twitter, Discord, Telegram for rewards',
        required: false
      },
      {
        id: 'trading-preferences',
        title: 'Trading Preferences',
        description: 'Set risk tolerance and favorite token categories',
        required: false
      }
    ],
    rewards: {
      walletConnect: 500000, // 500K $LERF
      web4Identity: 1000000, // 1M $LERF
      crossChainSetup: 750000, // 750K $LERF
      socialVerification: 250000, // 250K $LERF per platform
      tradingSetup: 500000 // 500K $LERF
    }
  }
};

// Supported Wallets Configuration
export const SUPPORTED_WALLETS = {
  evm: [
    'MetaMask',
    'WalletConnect',
    'Coinbase Wallet',
    'Trust Wallet',
    'Rainbow',
    'Brave Wallet',
    'Frame',
    'Rabby',
    'Zerion',
    'Safe'
  ],
  solana: [
    'Phantom',
    'Solflare',
    'Backpack',
    'Glow',
    'Slope',
    'Sollet'
  ],
  mobile: [
    'Trust Wallet',
    'MetaMask Mobile',
    'Coinbase Wallet',
    'Rainbow',
    'imToken',
    'TokenPocket'
  ]
};

// Meme Token Categories and Metadata
export const MEME_TOKEN_CATEGORIES = {
  trending: {
    name: 'Trending Now',
    description: 'Hot meme tokens with high social activity',
    sortBy: 'volume24h',
    filters: ['newLaunches', 'highVolume', 'socialBuzz']
  },
  community: {
    name: 'Community Favorites',
    description: 'Tokens with strong community backing',
    sortBy: 'communityScore',
    filters: ['activeGovernance', 'highHolders', 'socialEngagement']
  },
  gaming: {
    name: 'Gaming & Metaverse',
    description: 'Meme tokens in gaming ecosystems',
    sortBy: 'gameIntegration',
    filters: ['playToEarn', 'metaverse', 'nftUtility']
  },
  defi: {
    name: 'DeFi Memes',
    description: 'Meme tokens with DeFi utility',
    sortBy: 'tvl',
    filters: ['staking', 'yield', 'liquidityMining']
  }
};

export default WEB4_CONFIG;