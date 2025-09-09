'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';
import { SLERF_CONTRACT_ADDRESS } from '@/lib/contracts/slerf';

export default function TokenPage() {
  const { wallet, connectWallet } = useWallet();
  const [slerfBalance, setSlerfBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [activeTab, setActiveTab] = useState('overview');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferResult, setTransferResult] = useState<string | null>(null);

  useEffect(() => {
    const loadTokenData = async () => {
      try {
        if (wallet) {
          const balance = await slerfContract.getBalance(wallet);
          setSlerfBalance(balance.formatted);
        }
        
        const supply = await slerfContract.getTotalSupply();
        setTotalSupply(supply.formatted);
      } catch (error) {
        console.error('Error loading token data:', error);
      }
    };

    loadTokenData();
  }, [wallet]);

  const handleTransfer = async () => {
    if (!wallet || !transferTo || !transferAmount) return;

    setIsTransferring(true);
    setTransferResult(null);

    try {
      const result = await slerfContract.transfer(transferTo, transferAmount);
      if (result.success) {
        setTransferResult('Transfer successful!');
        setTransferTo('');
        setTransferAmount('');
        // Reload balance
        const balance = await slerfContract.getBalance(wallet);
        setSlerfBalance(balance.formatted);
      } else {
        setTransferResult(result.error || 'Transfer failed');
      }
    } catch (error: any) {
      setTransferResult(error.message || 'Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };

  const formatNumber = (num: string) => {
    const numValue = parseFloat(num);
    if (numValue >= 1e9) return (numValue / 1e9).toFixed(2) + 'B';
    if (numValue >= 1e6) return (numValue / 1e6).toFixed(2) + 'M';
    if (numValue >= 1e3) return (numValue / 1e3).toFixed(2) + 'K';
    return numValue.toFixed(4);
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <img src="/icons/slerf-logo.png" alt="SLERF" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">SLERF Token Hub</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to manage your SLERF tokens</p>
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
            <div>
              <h1 className="text-3xl font-bold text-slerf-orange">SLERF Token</h1>
              <p className="text-gray-300">Manage your SLERF tokens on Base network</p>
            </div>
          </div>
        </div>

        {/* Token Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slerf-orange to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Your Balance</h3>
            <div className="text-3xl font-bold">{formatNumber(slerfBalance)}</div>
            <div className="text-sm opacity-80">SLERF</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Supply</h3>
            <div className="text-3xl font-bold">{formatNumber(totalSupply)}</div>
            <div className="text-sm opacity-80">SLERF</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Network</h3>
            <div className="text-2xl font-bold">Base</div>
            <div className="text-sm opacity-80">Mainnet</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Contract</h3>
            <div className="text-sm font-mono">
              {SLERF_CONTRACT_ADDRESS.slice(0, 6)}...
              {SLERF_CONTRACT_ADDRESS.slice(-4)}
            </div>
            <div className="text-sm opacity-80">Verified</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slerf-dark/50 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'transfer', label: 'Transfer' },
              { id: 'earn', label: 'Earn More' },
              { id: 'analytics', label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slerf-orange text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slerf-dark/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Token Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Name:</span>
                    <span className="font-semibold">SLERF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Symbol:</span>
                    <span className="font-semibold">SLERF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Decimals:</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Contract:</span>
                    <span className="font-mono text-sm">{SLERF_CONTRACT_ADDRESS}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Network:</span>
                    <span className="font-semibold">Base Mainnet</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`https://basescan.org/token/${SLERF_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-center py-2 px-4 rounded-lg transition-colors"
                    >
                      View on BaseScan
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(SLERF_CONTRACT_ADDRESS)}
                      className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Copy Address
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slerf-dark/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Transaction history will appear here</p>
                    <p className="text-sm">Connect to view your SLERF activity</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="max-w-md mx-auto">
              <div className="bg-slerf-dark/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Transfer SLERF</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Address</label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-slerf-orange focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-slerf-orange focus:outline-none"
                    />
                    <div className="text-sm text-gray-400 mt-1">
                      Available: {slerfBalance} SLERF
                    </div>
                  </div>
                  
                  <button
                    onClick={handleTransfer}
                    disabled={isTransferring || !transferTo || !transferAmount}
                    className="w-full bg-slerf-orange hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isTransferring ? 'Transferring...' : 'Transfer SLERF'}
                  </button>
                  
                  {transferResult && (
                    <div className={`p-3 rounded-lg text-sm ${
                      transferResult.includes('successful') 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                        : 'bg-red-600/20 text-red-400 border border-red-600/30'
                    }`}>
                      {transferResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earn' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30">
                <div className="text-3xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-2">Play Games</h3>
                <p className="text-gray-300 mb-4">Earn SLERF by playing our collection of fun games</p>
                <a 
                  href="/games"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Play Now
                </a>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Daily Missions</h3>
                <p className="text-gray-300 mb-4">Complete daily tasks to earn guaranteed rewards</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  View Missions
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Staking</h3>
                <p className="text-gray-300 mb-4">Stake your SLERF tokens to earn passive rewards</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Start Staking
                </button>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-500/30">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Referrals</h3>
                <p className="text-gray-300 mb-4">Invite friends and earn bonus SLERF tokens</p>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Get Referral Link
                </button>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl p-6 border border-pink-500/30">
                <div className="text-3xl mb-4">🎁</div>
                <h3 className="text-xl font-bold mb-2">Airdrops</h3>
                <p className="text-gray-300 mb-4">Participate in community events for free tokens</p>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Check Events
                </button>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-500/30">
                <div className="text-3xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2">NFT Rewards</h3>
                <p className="text-gray-300 mb-4">Collect NFTs that boost your earning potential</p>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Browse NFTs
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slerf-dark/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Token Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Market Cap</span>
                    <span className="font-semibold">Loading...</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">24h Volume</span>
                    <span className="font-semibold">Loading...</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Holders</span>
                    <span className="font-semibold">Loading...</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Liquidity</span>
                    <span className="font-semibold">Loading...</span>
                  </div>
                </div>
              </div>

              <div className="bg-slerf-dark/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Price Chart</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Price chart will be displayed here</p>
                    <p className="text-sm">Powered by real-time data</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}