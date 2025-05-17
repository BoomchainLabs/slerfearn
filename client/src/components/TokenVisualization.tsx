import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import slerfLogo from '@/assets/slerf-logo.svg';
import { useWallet } from '@/hooks/useWallet';

// Types for transactions
interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  type: 'stake' | 'transfer' | 'reward' | 'game' | 'claim';
  status: 'pending' | 'confirmed' | 'failed';
  gas?: number;
}

// Create more realistic wallets for the ecosystem
const wallets = {
  user1: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Regular user
  user2: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', // Active trader
  user3: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', // Whale
  user4: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2', // New user
  vault: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', // Staking vault
  treasury: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', // Treasury
  gameRewards: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', // Game rewards pool
  exchange: '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB', // DEX address
}

// Generate realistic transaction data
function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  const types: Array<'stake' | 'transfer' | 'reward' | 'game' | 'claim'> = ['stake', 'transfer', 'reward', 'game', 'claim'];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    // Create random but realistic-looking transaction hash
    const hash = '0x' + Array.from({length: 64}, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('').substring(0, 64);
    
    // Get a random type of transaction
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Set up from/to addresses based on transaction type to make it realistic
    let from = '';
    let to = '';
    
    switch(type) {
      case 'stake':
        from = [wallets.user1, wallets.user2, wallets.user3, wallets.user4][Math.floor(Math.random() * 4)];
        to = wallets.vault;
        break;
      case 'transfer':
        from = [wallets.user1, wallets.user2, wallets.user3, wallets.user4][Math.floor(Math.random() * 4)];
        to = [wallets.user1, wallets.user2, wallets.user3, wallets.user4].filter(w => w !== from)[Math.floor(Math.random() * 3)];
        break;
      case 'reward':
        from = wallets.treasury;
        to = [wallets.user1, wallets.user2, wallets.user3, wallets.user4][Math.floor(Math.random() * 4)];
        break;
      case 'game':
        from = wallets.gameRewards;
        to = [wallets.user1, wallets.user2, wallets.user3, wallets.user4][Math.floor(Math.random() * 4)];
        break;
      case 'claim':
        from = wallets.vault;
        to = [wallets.user1, wallets.user2, wallets.user3, wallets.user4][Math.floor(Math.random() * 4)];
        break;
    }
    
    // Generate realistic amount based on transaction type
    let amount = 0;
    switch(type) {
      case 'stake':
        amount = Math.floor(Math.random() * 5000) + 100;
        break;
      case 'transfer':
        amount = Math.floor(Math.random() * 1000) + 10;
        break;
      case 'reward':
        amount = Math.floor(Math.random() * 100) + 5;
        break;
      case 'game':
        amount = Math.floor(Math.random() * 200) + 20;
        break;
      case 'claim':
        amount = Math.floor(Math.random() * 500) + 50;
        break;
    }
    
    // Add the transaction with a timestamp in the past (more recent ones are more likely)
    const timeOffset = Math.floor(Math.pow(Math.random(), 2) * 3600000); // Up to 1 hour in the past, weighted to more recent
    
    transactions.push({
      id: hash,
      from,
      to,
      amount,
      timestamp: now - timeOffset,
      type,
      status: Math.random() > 0.05 ? 'confirmed' : 'pending', // 5% chance to be pending
      gas: Math.floor(Math.random() * 0.01 * 100) / 100 + 0.01 // Gas between 0.01 and 0.02 ETH
    });
  }
  
  // Sort by timestamp, newest first
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

// Generate a significant pool of transactions 
const mockTransactions: Transaction[] = generateTransactions(30);

// Format addresses for display
const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Colors for the transaction nodes
const getNodeColor = (index: number): string => {
  const colors = ['bg-slerf-cyan', 'bg-slerf-purple', 'bg-slerf-orange', 'bg-green-500', 'bg-blue-500'];
  return colors[index % colors.length];
};

const TokenVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showTokenTransfer, setShowTokenTransfer] = useState<boolean>(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [transferCoordinates, setTransferCoordinates] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [nodes, setNodes] = useState<Array<{ id: string; x: number; y: number; color: string; type: string }>>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [totalTransferred, setTotalTransferred] = useState<number>(0);
  const { wallet } = useWallet();
  
  // Create nodes at random positions
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Resize handler
    const handleResize = () => {
      if (canvasRef.current) {
        setWidth(canvasRef.current.offsetWidth);
        setHeight(canvasRef.current.offsetHeight);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Generate nodes
    const uniqueAddresses = Array.from(
      new Set([
        ...transactions.map(t => t.from),
        ...transactions.map(t => t.to)
      ])
    );
    
    // Determine node type based on wallet address
    const getNodeType = (address: string): string => {
      if (address === wallets.vault) return 'vault';
      if (address === wallets.treasury) return 'treasury';
      if (address === wallets.gameRewards) return 'game';
      if (address === wallets.exchange) return 'exchange';
      return 'user';
    };
    
    const newNodes = uniqueAddresses.map((address, index) => ({
      id: address,
      x: Math.random() * 80 + 10, // 10% to 90% of width
      y: Math.random() * 80 + 10, // 10% to 90% of height
      color: getNodeColor(index),
      type: getNodeType(address)
    }));
    
    setNodes(newNodes);
    
    // Calculate total SLERF transferred
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    setTotalTransferred(total);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [transactions]);
  
  // Process transactions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let transactionPool = [...mockTransactions];
    
    const processNextTransaction = () => {
      // Get a random transaction or generate a new one
      let tx: Transaction;
      
      if (Math.random() > 0.3 || transactionPool.length === 0) {
        // 70% chance to generate a new transaction or if pool is empty
        const newTransactions = generateTransactions(1);
        tx = newTransactions[0];
        transactionPool = [...transactionPool, ...newTransactions];
      } else {
        // 30% chance to use existing transaction from pool
        const randomIndex = Math.floor(Math.random() * transactionPool.length);
        tx = transactionPool[randomIndex];
        // Remove used transaction from pool
        transactionPool = transactionPool.filter((_, index) => index !== randomIndex);
      }
      
      const fromNode = nodes.find(node => node.id === tx.from);
      const toNode = nodes.find(node => node.id === tx.to);
      
      if (fromNode && toNode && width && height) {
        setCurrentTransaction(tx);
        setTransferCoordinates({
          x1: fromNode.x * width / 100,
          y1: fromNode.y * height / 100,
          x2: toNode.x * width / 100,
          y2: toNode.y * height / 100
        });
        setShowTokenTransfer(true);
        
        // Add to recent transactions (keep only most recent 5)
        setRecentTransactions(prev => [tx, ...prev].slice(0, 5));
        
        // Update total transferred
        setTotalTransferred(prev => prev + tx.amount);
        
        // Hide after animation
        setTimeout(() => {
          setShowTokenTransfer(false);
        }, 3000);
      }
    };
    
    // Start processing transactions
    if (nodes.length > 0 && width && height) {
      processNextTransaction();
      
      // Random interval between 3-8 seconds for more realistic feeling
      const getRandomInterval = () => Math.floor(Math.random() * 5000) + 3000;
      
      let nextInterval = getRandomInterval();
      interval = setInterval(() => {
        processNextTransaction();
        
        // Clear and set new random interval
        clearInterval(interval);
        nextInterval = getRandomInterval();
        interval = setInterval(() => {
          processNextTransaction();
        }, nextInterval);
      }, nextInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nodes, width, height]);
  
  // Calculate angle for rotation
  const calculateAngle = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  };
  
  // Get appropriate icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'stake':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20"/>
          </svg>
        );
      case 'transfer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 5v14M5 19V5M15 9l4-4 4 4M15 19l4-4 4 4"/>
          </svg>
        );
      case 'reward':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        );
      case 'game':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        );
      case 'claim':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Get color based on transaction type
  const getTransactionTypeColor = (type: string) => {
    switch(type) {
      case 'stake': return 'text-slerf-purple';
      case 'transfer': return 'text-slerf-cyan';
      case 'reward': return 'text-green-500';
      case 'game': return 'text-slerf-orange';
      case 'claim': return 'text-blue-500';
      default: return 'text-white';
    }
  };
  
  // Get node icon based on type
  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'vault':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'treasury':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-9.5V4c0-.6-.4-1-1-1h-3C5.7 3 5 3.7 5 4.5V17c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-8c0-.6-.4-1-1-1zm-9.5 0h-5V5h5v2z"/>
          </svg>
        );
      case 'game':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        );
      case 'exchange':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            <path d="M13 1v6h6"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };
  
  return (
    <div className="w-full rounded-xl glass p-4 relative overflow-hidden" style={{ height: '500px' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Live $SLERF Transfers
        </h2>
        <div className="flex items-center space-x-2">
          <div className="glass-dark px-3 py-1 rounded-full flex items-center">
            <span className="text-xs text-gray-400 mr-1">Network Activity:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
            <span className="text-xs font-medium">High</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="glass-dark p-2 rounded-lg text-center">
          <span className="text-xs text-gray-400">Nodes</span>
          <p className="text-lg font-bold">{nodes.length}</p>
        </div>
        <div className="glass-dark p-2 rounded-lg text-center">
          <span className="text-xs text-gray-400">Transfers</span>
          <p className="text-lg font-bold">{transactions.length}</p>
        </div>
        <div className="glass-dark p-2 rounded-lg text-center">
          <span className="text-xs text-gray-400">Total Volume</span>
          <p className="text-lg font-bold">{totalTransferred.toLocaleString()} SLERF</p>
        </div>
        <div className="glass-dark p-2 rounded-lg text-center">
          <span className="text-xs text-gray-400">Last Updated</span>
          <p className="text-lg font-bold">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div ref={canvasRef} className="w-full h-[250px] relative glass-dark p-2 rounded-lg">
            {/* Network nodes */}
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                className={`absolute hover:z-30 ${node.color} flex items-center justify-center shadow-glow z-10 cursor-pointer group`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: node.type === 'user' ? '40px' : '45px',
                  height: node.type === 'user' ? '40px' : '45px',
                  borderRadius: '50%'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-white">
                  {getNodeIcon(node.type)}
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slerf-dark-light px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <div className="font-mono">{formatAddress(node.id)}</div>
                  <div className="capitalize text-slerf-cyan text-[10px]">{node.type}</div>
                </div>
              </motion.div>
            ))}
            
            {/* Connection lines */}
            <svg className="absolute top-0 left-0 w-full h-full">
              {transactions.slice(0, 15).map((tx, index) => {
                const fromNode = nodes.find(node => node.id === tx.from);
                const toNode = nodes.find(node => node.id === tx.to);
                
                if (!fromNode || !toNode) return null;
                
                // Different line styles based on transaction type
                let strokeColor = "#1E90FF";
                let strokeWidth = "1";
                let strokeDasharray = "5,5";
                
                switch(tx.type) {
                  case 'stake':
                    strokeColor = "#9333ea"; // purple
                    break;
                  case 'transfer':
                    strokeColor = "#06b6d4"; // cyan
                    break;
                  case 'reward':
                    strokeColor = "#22c55e"; // green
                    break;
                  case 'game':
                    strokeColor = "#f97316"; // orange
                    break;
                  case 'claim':
                    strokeColor = "#3b82f6"; // blue
                    break;
                }
                
                return (
                  <line
                    key={`line-${tx.id}-${index}`}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity="0.3"
                    strokeDasharray={strokeDasharray}
                  />
                );
              })}
            </svg>
            
            {/* Token transfer animation with Slerf cat mascot */}
            <AnimatePresence>
              {showTokenTransfer && currentTransaction && (
                <motion.div
                  className="absolute z-20"
                  style={{
                    left: transferCoordinates.x1,
                    top: transferCoordinates.y1,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    x: transferCoordinates.x2 - transferCoordinates.x1, 
                    y: transferCoordinates.y2 - transferCoordinates.y1,
                    scale: 1,
                    rotate: calculateAngle(
                      transferCoordinates.x1, 
                      transferCoordinates.y1, 
                      transferCoordinates.x2, 
                      transferCoordinates.y2
                    )
                  }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  exit={{ scale: 0 }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className={`p-1 rounded-full bg-gradient-to-r 
                      ${currentTransaction.type === 'stake' ? 'from-purple-500 to-blue-500' :
                        currentTransaction.type === 'transfer' ? 'from-cyan-500 to-blue-500' :
                        currentTransaction.type === 'reward' ? 'from-green-500 to-emerald-500' :
                        currentTransaction.type === 'game' ? 'from-orange-500 to-yellow-500' :
                        'from-blue-500 to-indigo-500'}`}
                    >
                      <img 
                        src={slerfLogo} 
                        alt="Slerf Cat" 
                        className="w-10 h-10 animate-pulse" 
                      />
                    </div>
                    <div className={`bg-slerf-dark px-2 py-1 mt-1 rounded-lg whitespace-nowrap
                      ${currentTransaction.type === 'stake' ? 'border border-purple-500' :
                        currentTransaction.type === 'transfer' ? 'border border-cyan-500' :
                        currentTransaction.type === 'reward' ? 'border border-green-500' :
                        currentTransaction.type === 'game' ? 'border border-orange-500' :
                        'border border-blue-500'}`}
                    >
                      <span className={`text-xs font-bold 
                        ${currentTransaction.type === 'stake' ? 'text-purple-400' :
                          currentTransaction.type === 'transfer' ? 'text-cyan-400' :
                          currentTransaction.type === 'reward' ? 'text-green-400' :
                          currentTransaction.type === 'game' ? 'text-orange-400' :
                          'text-blue-400'}`}
                      >
                        {currentTransaction.amount} SLERF
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="glass-dark p-3 rounded-lg h-[250px] overflow-auto hide-scrollbar">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3V3z"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
              </svg>
              Recent Transactions
            </h3>
            
            <div className="space-y-2">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx, i) => (
                  <motion.div 
                    key={tx.id} 
                    className="glass p-2 rounded-lg text-xs"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className={`${getTransactionTypeColor(tx.type)} flex items-center mr-1`}>
                          {getTransactionIcon(tx.type)}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                        <span className={`text-[10px] ml-1 px-1 rounded ${tx.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {tx.status}
                        </span>
                      </div>
                      <span className="text-gray-400 text-[10px]">{formatTimestamp(tx.timestamp)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400">From: </span>
                        <span className="font-mono">{formatAddress(tx.from)}</span>
                      </div>
                      <span className="font-bold">{tx.amount} SLERF</span>
                    </div>
                    <div>
                      <span className="text-gray-400">To: </span>
                      <span className="font-mono">{formatAddress(tx.to)}</span>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 mt-1">
                      Gas: {tx.gas} ETH
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No transactions yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Current transaction toast */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center">
        <AnimatePresence>
          {currentTransaction && (
            <motion.div
              className={`glass-dark px-4 py-2 rounded-lg mx-auto flex items-center
                ${currentTransaction.type === 'stake' ? 'border-l-4 border-purple-500' :
                  currentTransaction.type === 'transfer' ? 'border-l-4 border-cyan-500' :
                  currentTransaction.type === 'reward' ? 'border-l-4 border-green-500' :
                  currentTransaction.type === 'game' ? 'border-l-4 border-orange-500' :
                  'border-l-4 border-blue-500'}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className={getTransactionTypeColor(currentTransaction.type)}>
                {getTransactionIcon(currentTransaction.type)}
              </div>
              <div className="ml-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium capitalize mr-2">{currentTransaction.type}</span>
                  <span className="font-mono text-xs text-gray-400">Tx: {currentTransaction.id.substring(0, 10)}...</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 text-xs mr-2">
                    {formatAddress(currentTransaction.from)} → {formatAddress(currentTransaction.to)}
                  </span>
                  <span className="font-bold text-slerf-cyan">
                    {currentTransaction.amount} SLERF
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Transaction type legend */}
      <div className="mt-4 glass-dark p-2 rounded-lg flex flex-wrap justify-center gap-3">
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
          <span>Stake</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-cyan-500 rounded-full mr-1"></div>
          <span>Transfer</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Reward</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
          <span>Game</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Claim</span>
        </div>
      </div>
    </div>
  );
};

export default TokenVisualization;