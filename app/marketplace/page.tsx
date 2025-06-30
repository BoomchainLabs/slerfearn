'use client'

import { useState, useEffect } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Search, Filter, Zap, Users, Star, ArrowUpDown } from 'lucide-react'

interface MemeToken {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  holders: number
  chain: string
  logoUrl: string
  trending: boolean
  verified: boolean
  launchDate: string
  description: string
  socialScore: number
  tags: string[]
}

const FEATURED_TOKENS: MemeToken[] = [
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
    logoUrl: '/images/slerf-logo.png',
    trending: true,
    verified: true,
    launchDate: '2024-03-15',
    description: 'The original sloth-themed meme token with gamified rewards',
    socialScore: 92,
    tags: ['Gaming', 'Rewards', 'Community']
  },
  {
    id: '2',
    symbol: 'PEPE',
    name: 'Pepe Token',
    price: 0.00001234,
    change24h: -8.2,
    volume24h: 2500000,
    marketCap: 890000000,
    holders: 125000,
    chain: 'Ethereum',
    logoUrl: '/images/pepe-logo.png',
    trending: true,
    verified: true,
    launchDate: '2023-04-20',
    description: 'The legendary frog meme token that started it all',
    socialScore: 98,
    tags: ['Legend', 'OG', 'Community']
  },
  {
    id: '3',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.08945,
    change24h: 3.4,
    volume24h: 890000000,
    marketCap: 12800000000,
    holders: 5200000,
    chain: 'Ethereum',
    logoUrl: '/images/doge-logo.png',
    trending: false,
    verified: true,
    launchDate: '2013-12-06',
    description: 'The original meme cryptocurrency beloved by millions',
    socialScore: 95,
    tags: ['OG', 'Payments', 'Community']
  },
  {
    id: '4',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.000008756,
    change24h: 12.1,
    volume24h: 450000000,
    marketCap: 5200000000,
    holders: 1300000,
    chain: 'Ethereum',
    logoUrl: '/images/shib-logo.png',
    trending: true,
    verified: true,
    launchDate: '2020-08-01',
    description: 'The Dogecoin killer with massive community support',
    socialScore: 88,
    tags: ['DeFi', 'NFTs', 'Community']
  },
  {
    id: '5',
    symbol: 'BONK',
    name: 'Bonk Token',
    price: 0.000012345,
    change24h: 28.7,
    volume24h: 67000000,
    marketCap: 780000000,
    holders: 890000,
    chain: 'Solana',
    logoUrl: '/images/bonk-logo.png',
    trending: true,
    verified: true,
    launchDate: '2022-12-25',
    description: 'Solana\'s first dog coin bringing joy to the ecosystem',
    socialScore: 85,
    tags: ['Solana', 'Gaming', 'Community']
  },
  {
    id: '6',
    symbol: 'WIF',
    name: 'dogwifhat',
    price: 2.145,
    change24h: -5.2,
    volume24h: 89000000,
    marketCap: 2100000000,
    holders: 245000,
    chain: 'Solana',
    logoUrl: '/images/wif-logo.png',
    trending: false,
    verified: true,
    launchDate: '2023-11-20',
    description: 'The dog with a hat that took Solana by storm',
    socialScore: 79,
    tags: ['Solana', 'Viral', 'Art']
  }
];

export default function MarketplacePage() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  
  const [tokens, setTokens] = useState<MemeToken[]>(FEATURED_TOKENS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChain, setSelectedChain] = useState('all')
  const [sortBy, setSortBy] = useState('marketCap')
  const [activeTab, setActiveTab] = useState('trending')

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(4)}`
    return `$${price.toFixed(8)}`
  }

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesChain = selectedChain === 'all' || token.chain.toLowerCase() === selectedChain.toLowerCase()
    return matchesSearch && matchesChain
  })

  const sortedTokens = [...filteredTokens].sort((a, b) => {
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

  const trendingTokens = sortedTokens.filter(token => token.trending)
  const newTokens = sortedTokens.filter(token => {
    const launchDate = new Date(token.launchDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - launchDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  })

  const renderTokenGrid = (tokenList: MemeToken[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokenList.map((token, index) => (
        <motion.div
          key={token.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden bg-black/40 backdrop-blur-md border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/20">
            {token.trending && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xl font-bold">
                    {token.symbol.charAt(0)}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    {token.name}
                    {token.verified && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-cyan-300">
                    ${token.symbol}
                    <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
                      {token.chain}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-white font-semibold">{formatPrice(token.price)}</p>
                </div>
                <div>
                  <p className="text-gray-400">24h Change</p>
                  <p className={`font-semibold flex items-center gap-1 ${
                    token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {token.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(token.change24h).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-white font-semibold">{formatNumber(token.marketCap)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Volume 24h</p>
                  <p className="text-white font-semibold">{formatNumber(token.volume24h)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Users className="w-4 h-4" />
                  {token.holders.toLocaleString()} holders
                </div>
                <div className="text-cyan-300">
                  Score: {token.socialScore}/100
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {token.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0">
                  <Zap className="w-4 h-4 mr-2" />
                  Trade
                </Button>
                <Button variant="outline" className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Cross-Chain Meme Marketplace
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Trade meme tokens across multiple blockchains with seamless Web3/Web4 integration
          </p>
          
          {!isConnected && (
            <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-md border-cyan-500/20">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300 mb-4">Connect your wallet to start trading</p>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/40 backdrop-blur-md border-cyan-500/20 text-white placeholder-gray-400"
            />
          </div>
          
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-48 bg-black/40 backdrop-blur-md border-cyan-500/20 text-white">
              <SelectValue placeholder="Select Chain" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-500/20">
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="bsc">BSC</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-black/40 backdrop-blur-md border-cyan-500/20 text-white">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-500/20">
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="volume24h">24h Volume</SelectItem>
              <SelectItem value="change24h">24h Change</SelectItem>
              <SelectItem value="holders">Holders</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Token Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-md border-cyan-500/20">
              <TabsTrigger value="trending" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                Trending
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                New Launches
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                All Tokens
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-6">
              {renderTokenGrid(trendingTokens)}
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              {renderTokenGrid(newTokens)}
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              {renderTokenGrid(sortedTokens)}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Connect your wallet to view favorite tokens</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}