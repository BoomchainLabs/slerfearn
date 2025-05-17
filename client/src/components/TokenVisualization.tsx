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
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '0x1a2b3c',
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 125,
    timestamp: Date.now() - 30000
  },
  {
    id: '0x4d5e6f',
    from: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    to: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    amount: 75,
    timestamp: Date.now() - 60000
  },
  {
    id: '0x7g8h9i',
    from: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    to: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
    amount: 250,
    timestamp: Date.now() - 120000
  }
];

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
  const [nodes, setNodes] = useState<Array<{ id: string; x: number; y: number; color: string }>>([]);
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
    
    const newNodes = uniqueAddresses.map((address, index) => ({
      id: address,
      x: Math.random() * 80 + 10, // 10% to 90% of width
      y: Math.random() * 80 + 10, // 10% to 90% of height
      color: getNodeColor(index)
    }));
    
    setNodes(newNodes);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [transactions]);
  
  // Process transactions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const processNextTransaction = () => {
      // In a real app, this would fetch from API
      const tx = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
      
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
        
        // Hide after animation
        setTimeout(() => {
          setShowTokenTransfer(false);
        }, 3000);
      }
    };
    
    // Start processing transactions
    if (nodes.length > 0 && width && height) {
      processNextTransaction();
      interval = setInterval(processNextTransaction, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nodes, width, height]);
  
  // Calculate angle for rotation
  const calculateAngle = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  };
  
  // Calculate distance for path
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  
  return (
    <div className="w-full rounded-xl glass p-4 relative overflow-hidden" style={{ height: '400px' }}>
      <h2 className="text-xl font-bold mb-4 text-center">
        Live Token Transfers
      </h2>
      
      <div ref={canvasRef} className="w-full h-[320px] relative">
        {/* Network nodes */}
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className={`absolute w-10 h-10 rounded-full ${node.color} flex items-center justify-center shadow-glow z-10`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-xs font-bold text-white">{formatAddress(node.id)}</span>
          </motion.div>
        ))}
        
        {/* Connection lines */}
        <svg className="absolute top-0 left-0 w-full h-full">
          {transactions.map((tx, index) => {
            const fromNode = nodes.find(node => node.id === tx.from);
            const toNode = nodes.find(node => node.id === tx.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`line-${index}`}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="#1E90FF"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="5,5"
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
              transition={{ duration: 3, ease: "easeInOut" }}
              exit={{ scale: 0 }}
            >
              <div className="relative flex flex-col items-center">
                <img 
                  src={slerfLogo} 
                  alt="Slerf Cat" 
                  className="w-12 h-12 rounded-full shadow-glow animate-bounce" 
                />
                <div className="bg-slerf-dark-light rounded-lg px-2 py-1 mt-1 whitespace-nowrap">
                  <span className="text-xs font-bold text-slerf-cyan">{currentTransaction.amount} SLERF</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Transaction details */}
      <div className="absolute bottom-2 left-0 w-full text-center">
        <AnimatePresence>
          {currentTransaction && (
            <motion.div
              className="glass-dark inline-block px-4 py-2 rounded-lg mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <span className="text-slerf-cyan font-medium">
                {formatAddress(currentTransaction.from)} → {formatAddress(currentTransaction.to)}:
              </span>
              <span className="ml-2 font-bold text-white">
                {currentTransaction.amount} SLERF
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenVisualization;