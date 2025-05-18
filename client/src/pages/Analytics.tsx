import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

// Sample data for charts
const tokenData = [
  { date: 'May 1', price: 0.12, volume: 125000 },
  { date: 'May 2', price: 0.14, volume: 150000 },
  { date: 'May 3', price: 0.13, volume: 140000 },
  { date: 'May 4', price: 0.15, volume: 180000 },
  { date: 'May 5', price: 0.18, volume: 220000 },
  { date: 'May 6', price: 0.17, volume: 200000 },
  { date: 'May 7', price: 0.19, volume: 230000 },
  { date: 'May 8', price: 0.21, volume: 250000 },
  { date: 'May 9', price: 0.20, volume: 240000 },
  { date: 'May 10', price: 0.22, volume: 260000 },
  { date: 'May 11', price: 0.24, volume: 280000 },
  { date: 'May 12', price: 0.25, volume: 300000 },
  { date: 'May 13', price: 0.27, volume: 320000 },
  { date: 'May 14', price: 0.29, volume: 350000 },
];

const distributionData = [
  { name: 'Community', value: 40, color: 'hsl(195, 100%, 50%)' },
  { name: 'Core Team', value: 20, color: 'hsl(265, 89%, 60%)' },
  { name: 'Ecosystem Growth', value: 15, color: 'hsl(135, 98%, 58%)' },
  { name: 'Liquidity Provision', value: 15, color: 'hsl(330, 100%, 65%)' },
  { name: 'Treasury', value: 10, color: 'hsl(40, 100%, 60%)' },
];

const stakingData = [
  { month: 'Jan', staked: 230000, rewards: 11500 },
  { month: 'Feb', staked: 280000, rewards: 14000 },
  { month: 'Mar', staked: 320000, rewards: 16000 },
  { month: 'Apr', staked: 375000, rewards: 18750 },
  { month: 'May', staked: 450000, rewards: 22500 },
  { month: 'Jun', staked: 510000, rewards: 25500 },
];

const networkMetrics = [
  { name: 'Daily Transactions', value: '5.2K', change: '+12%', color: 'hsl(195, 100%, 50%)' },
  { name: 'Active Wallets', value: '18.7K', change: '+8%', color: 'hsl(265, 89%, 60%)' },
  { name: 'AVG Gas Price', value: '0.003 SOL', change: '-5%', color: 'hsl(135, 98%, 58%)' },
  { name: 'Total Value Locked', value: '$4.5M', change: '+15%', color: 'hsl(330, 100%, 65%)' },
];

const Analytics: React.FC = () => {
  const { wallet, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading and add animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleWalletConnect = () => {
    if (!wallet) {
      connectWallet();
    } else {
      toast({
        title: "Wallet Connected",
        description: `You're already connected with balance: ${wallet.balance}`,
      });
    }
  };

  return (
    <div className="w-full min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-16 px-4"
      >
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="cyber-card p-2 rounded-full mb-6">
            <div className="bg-white/10 rounded-full p-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--web3-blue))] to-[hsl(var(--web3-purple))] flex items-center justify-center">
                <span className="font-orbitron text-white text-2xl">W3</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-8">
            Token <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--web3-blue))] to-[hsl(var(--web3-purple))]">Analytics</span> Dashboard
          </h1>
          
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-8">
            Real-time insights into token performance, network activity, and ecosystem growth. Connect your wallet to access personalized analytics.
          </p>
          
          {!wallet && (
            <Button 
              size="lg" 
              onClick={handleWalletConnect}
              className="bg-gradient-to-r from-[hsl(var(--web3-blue))] to-[hsl(var(--web3-purple))] hover:opacity-90 mt-4 neon-blue-glow"
            >
              <span className="font-orbitron">Connect Wallet</span>
            </Button>
          )}
          
          {wallet && (
            <div className="glass p-4 rounded-xl flex items-center space-x-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--web3-blue))] to-[hsl(var(--web3-purple))]"></div>
              <span className="text-xl font-orbitron">{wallet.balance}</span>
            </div>
          )}
        </div>
        
        {/* Network Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {networkMetrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="cyber-card p-6 rounded-xl relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--web3-blue))/10] to-[hsl(var(--web3-purple))/10]"></div>
              <h3 className="text-gray-400 font-medium mb-2">{metric.name}</h3>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-orbitron font-bold">{metric.value}</div>
                <div className={`text-sm font-mono ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change}
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full animate-pulse-glow" 
                  style={{ 
                    width: `${Math.random() * 40 + 60}%`,
                    backgroundColor: metric.color
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Tabs for different chart types */}
        <Tabs defaultValue="price" className="w-full mb-12">
          <div className="flex justify-center mb-6">
            <TabsList className="glass rounded-full">
              <TabsTrigger value="price" className="font-orbitron rounded-full">Price History</TabsTrigger>
              <TabsTrigger value="volume" className="font-orbitron rounded-full">Trading Volume</TabsTrigger>
              <TabsTrigger value="staking" className="font-orbitron rounded-full">Staking Analytics</TabsTrigger>
              <TabsTrigger value="distribution" className="font-orbitron rounded-full">Token Distribution</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="price" className="cyber-card p-6 rounded-xl h-[400px]">
            <h2 className="text-2xl font-orbitron mb-4">Token Price History</h2>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={tokenData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--web3-blue))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--web3-blue))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderColor: 'hsl(var(--web3-blue))',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--web3-blue))" 
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="volume" className="cyber-card p-6 rounded-xl h-[400px]">
            <h2 className="text-2xl font-orbitron mb-4">Trading Volume</h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={tokenData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderColor: 'hsl(var(--web3-purple))',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--web3-purple))"
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="staking" className="cyber-card p-6 rounded-xl h-[400px]">
            <h2 className="text-2xl font-orbitron mb-4">Staking Analytics</h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={stakingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderColor: 'hsl(var(--web3-green))',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="staked" 
                  stroke="hsl(var(--web3-blue))" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="rewards" 
                  stroke="hsl(var(--web3-green))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="distribution" className="cyber-card p-6 rounded-xl h-[400px]">
            <h2 className="text-2xl font-orbitron mb-4">Token Distribution</h2>
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="w-full md:w-2/3 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        borderColor: 'hsl(var(--web3-purple))',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/3 flex flex-col space-y-2 mt-4 md:mt-0">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-mono text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <Separator className="my-8 bg-white/10" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="cyber-card p-8 rounded-xl max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--web3-blue))] to-[hsl(var(--web3-purple))] flex items-center justify-center">
              <span className="font-orbitron text-white text-lg">W3</span>
            </div>
            <h2 className="text-2xl font-orbitron font-bold">Tokenomics Overview</h2>
          </div>
          
          <p className="text-gray-300 mb-6">
            Our Web3 platform features a deflationary token model with automatic liquidity provision and staking rewards. 
            Tokens are used throughout our ecosystem for governance, staking, and transactions, creating a sustainable economic model.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-[hsl(var(--web3-blue))] text-4xl font-orbitron font-bold mb-2">15.5%</div>
              <div className="text-gray-300">Annual Staking Yield</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-[hsl(var(--web3-purple))] text-4xl font-orbitron font-bold mb-2">2%</div>
              <div className="text-gray-300">Transaction Fee (1% Burn, 1% LP)</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-[hsl(var(--web3-green))] text-4xl font-orbitron font-bold mb-2">Real-time</div>
              <div className="text-gray-300">Rewards Distribution</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-[hsl(var(--web3-blue))] to-[hsl(var(--web3-purple))] hover:opacity-90 mr-4">
                <span className="font-orbitron">Back to Home</span>
              </Button>
            </Link>
            {!wallet && (
              <Button 
                onClick={handleWalletConnect}
                className="glass hover:bg-white/10"
              >
                <span className="font-orbitron">Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;