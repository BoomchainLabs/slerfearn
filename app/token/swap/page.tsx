'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';
import { ArrowUpDown, Settings } from 'lucide-react';

const POPULAR_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: 'native', decimals: 18, icon: '⚡' },
  { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, icon: '💵' },
  { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18, icon: '🔄' },
  { symbol: 'cbBTC', name: 'Coinbase Wrapped BTC', address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', decimals: 8, icon: '₿' },
];

export default function SwapPage() {
  const { wallet, connectWallet } = useWallet();
  const [fromToken, setFromToken] = useState(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState({ symbol: 'SLERF', name: 'SLERF Token', address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07', decimals: 18, icon: '🦥' });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [slerfBalance, setSlerfBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');

  useEffect(() => {
    const loadBalances = async () => {
      if (!wallet) return;

      try {
        // Load SLERF balance
        const slerf = await slerfContract.getBalance(wallet);
        setSlerfBalance(slerf.formatted);

        // Load ETH balance (would need web3 provider for this)
        // For demo purposes, we'll simulate
        setEthBalance('0.5');
      } catch (error) {
        console.error('Error loading balances:', error);
      }
    };

    loadBalances();
  }, [wallet]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const calculateEstimate = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    
    // Simulate exchange rate (1 ETH = 1000 SLERF for demo)
    const rate = fromToken.symbol === 'ETH' ? 1000 : 0.001;
    const estimated = parseFloat(amount) * rate;
    return estimated.toFixed(6);
  };

  useEffect(() => {
    if (fromAmount) {
      const estimated = calculateEstimate(fromAmount);
      setToAmount(estimated);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!wallet || !fromAmount || parseFloat(fromAmount) <= 0) return;

    setIsLoading(true);
    try {
      // This would integrate with a DEX like Uniswap in a real implementation
      // For now, we'll simulate the swap
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Swap successful! You received ${toAmount} ${toToken.symbol}`);
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenBalance = (token: any) => {
    if (token.symbol === 'SLERF') return slerfBalance;
    if (token.symbol === 'ETH') return ethBalance;
    return '0';
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <img src="/icons/slerf-logo.png" alt="SLERF" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Token Swap</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to start trading SLERF tokens</p>
          <button
            onClick={connectWallet}
            className="bg-slerf-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img src="/icons/slerf-logo.png" alt="SLERF" className="w-12 h-12 mr-3" />
            <h1 className="text-3xl font-bold text-slerf-orange">Token Swap</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-slerf-dark/50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3">Swap Settings</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Slippage Tolerance</label>
                <div className="flex space-x-2">
                  {['0.1', '0.5', '1.0'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-1 rounded text-sm ${
                        slippage === value ? 'bg-slerf-orange' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-16 px-2 py-1 bg-gray-700 rounded text-sm text-center"
                    step="0.1"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Swap Interface */}
          <div className="bg-slerf-dark/30 rounded-xl p-6">
            {/* From Token */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">From</label>
                  <span className="text-sm text-gray-400">
                    Balance: {getTokenBalance(fromToken)} {fromToken.symbol}
                  </span>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="bg-transparent text-xl font-semibold outline-none flex-1"
                    />
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-2xl">{fromToken.icon}</div>
                      <div>
                        <div className="font-semibold">{fromToken.symbol}</div>
                        <div className="text-xs text-gray-400">{fromToken.name}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setFromAmount(getTokenBalance(fromToken))}
                      className="text-sm text-slerf-orange hover:text-orange-400"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapTokens}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>

              {/* To Token */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">To</label>
                  <span className="text-sm text-gray-400">
                    Balance: {getTokenBalance(toToken)} {toToken.symbol}
                  </span>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="bg-transparent text-xl font-semibold outline-none flex-1 text-gray-300"
                    />
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-2xl">{toToken.icon}</div>
                      <div>
                        <div className="font-semibold">{toToken.symbol}</div>
                        <div className="text-xs text-gray-400">{toToken.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Details */}
              {fromAmount && toAmount && (
                <div className="bg-gray-700/30 rounded-lg p-3 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span>1 {fromToken.symbol} = {calculateEstimate('1')} {toToken.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slippage:</span>
                    <span>{slippage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimum received:</span>
                    <span>{(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken.symbol}</span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
                className="w-full bg-slerf-orange hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                {isLoading ? 'Swapping...' : 'Swap Tokens'}
              </button>
            </div>
          </div>

          {/* Popular Tokens */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Popular Tokens on Base</h3>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_TOKENS.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => {
                    if (fromToken.symbol === token.symbol) {
                      setToToken(token);
                    } else {
                      setFromToken(token);
                    }
                  }}
                  className="bg-gray-700/50 hover:bg-gray-700 rounded-lg p-3 text-left transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-xl">{token.icon}</div>
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>⚠️ This is a demo interface. Always verify transaction details before confirming swaps.</p>
          </div>
        </div>
      </div>
    </div>
  );
}