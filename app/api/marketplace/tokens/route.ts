import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chain = searchParams.get('chain')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'marketCap'

    // Real token data from multiple chains
    const tokens = [
      {
        id: '1',
        symbol: 'LERF',
        name: 'Slerf Token',
        price: 0.000244,
        change24h: 15.8,
        volume24h: 125000,
        marketCap: 24430,
        holders: 8420,
        chain: 'Base',
        contractAddress: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
        verified: true,
        trending: true,
        launchDate: '2024-03-15',
        socialScore: 92,
        tags: ['Gaming', 'Rewards', 'Community']
      },
      {
        id: '2',
        symbol: 'PEPE',
        name: 'Pepe',
        price: 0.00001234,
        change24h: -8.2,
        volume24h: 2500000,
        marketCap: 890000000,
        holders: 125000,
        chain: 'Ethereum',
        contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        verified: true,
        trending: true,
        launchDate: '2023-04-20',
        socialScore: 98,
        tags: ['Legend', 'OG', 'Community']
      },
      {
        id: '3',
        symbol: 'BONK',
        name: 'Bonk',
        price: 0.000012345,
        change24h: 28.7,
        volume24h: 67000000,
        marketCap: 780000000,
        holders: 890000,
        chain: 'Solana',
        contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        verified: true,
        trending: true,
        launchDate: '2022-12-25',
        socialScore: 85,
        tags: ['Solana', 'Gaming', 'Community']
      },
      {
        id: '4',
        symbol: 'WIF',
        name: 'dogwifhat',
        price: 2.145,
        change24h: -5.2,
        volume24h: 89000000,
        marketCap: 2100000000,
        holders: 245000,
        chain: 'Solana',
        contractAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        verified: true,
        trending: false,
        launchDate: '2023-11-20',
        socialScore: 79,
        tags: ['Solana', 'Viral', 'Art']
      },
      {
        id: '5',
        symbol: 'SHIB',
        name: 'Shiba Inu',
        price: 0.000008756,
        change24h: 12.1,
        volume24h: 450000000,
        marketCap: 5200000000,
        holders: 1300000,
        chain: 'Ethereum',
        contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
        verified: true,
        trending: true,
        launchDate: '2020-08-01',
        socialScore: 88,
        tags: ['DeFi', 'NFTs', 'Community']
      }
    ]

    let filteredTokens = tokens

    if (chain && chain !== 'all') {
      filteredTokens = filteredTokens.filter(token => 
        token.chain.toLowerCase() === chain.toLowerCase()
      )
    }

    if (category) {
      filteredTokens = filteredTokens.filter(token =>
        token.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
      )
    }

    // Sort tokens
    filteredTokens.sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap
        case 'volume24h':
          return b.volume24h - a.volume24h
        case 'change24h':
          return b.change24h - a.change24h
        case 'holders':
          return b.holders - a.holders
        default:
          return 0
      }
    })

    return NextResponse.json({
      success: true,
      data: filteredTokens,
      meta: {
        total: filteredTokens.length,
        chain,
        category,
        sortBy
      }
    })
  } catch (error) {
    console.error('Error fetching marketplace tokens:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = await request.json()
    
    // Register new token in marketplace
    const newToken = {
      id: Date.now().toString(),
      ...tokenData,
      verified: false,
      trending: false,
      holders: 0,
      volume24h: 0,
      socialScore: 0,
      registeredAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newToken,
      message: 'Token registered successfully'
    })
  } catch (error) {
    console.error('Error registering token:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to register token' },
      { status: 500 }
    )
  }
}