'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { slerfContract } from '@/lib/web3/slerf-contract';
import { GAME_REWARDS } from '@/lib/contracts/slerf';

interface GameTile {
  id: number;
  type: string;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

const TILE_TYPES = [
  { type: 'slerf', emoji: '🦥' },
  { type: 'coin', emoji: '🪙' },
  { type: 'gem', emoji: '💎' },
  { type: 'star', emoji: '⭐' },
  { type: 'fire', emoji: '🔥' },
  { type: 'rocket', emoji: '🚀' },
];

export default function MatchOutGame() {
  const { wallet, connectWallet } = useWallet();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed' | 'loading'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [score, setScore] = useState(0);
  const [earnedTokens, setEarnedTokens] = useState('0');
  const [isProcessingReward, setIsProcessingReward] = useState(false);

  const getDifficultySettings = (level: 'easy' | 'medium' | 'hard') => {
    switch (level) {
      case 'easy':
        return { pairs: 6, timeLimit: 120, gridCols: 3 }; // 3x4 grid
      case 'medium':
        return { pairs: 10, timeLimit: 150, gridCols: 4 }; // 4x5 grid
      case 'hard':
        return { pairs: 15, timeLimit: 180, gridCols: 5 }; // 5x6 grid
      default:
        return { pairs: 6, timeLimit: 120, gridCols: 3 };
    }
  };

  const initializeGame = useCallback(() => {
    const settings = getDifficultySettings(difficulty);
    const selectedTypes = TILE_TYPES.slice(0, settings.pairs);
    const gameTiles: GameTile[] = [];
    
    // Create pairs
    selectedTypes.forEach((type, index) => {
      gameTiles.push(
        {
          id: index * 2,
          type: type.type,
          emoji: type.emoji,
          matched: false,
          flipped: false,
        },
        {
          id: index * 2 + 1,
          type: type.type,
          emoji: type.emoji,
          matched: false,
          flipped: false,
        }
      );
    });

    // Shuffle tiles
    for (let i = gameTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameTiles[i], gameTiles[j]] = [gameTiles[j], gameTiles[i]];
    }

    setTiles(gameTiles);
    setFlippedTiles([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(settings.timeLimit);
    setGameStartTime(Date.now());
    setScore(0);
    setGameState('playing');
  }, [difficulty]);

  const handleTileClick = (tileId: number) => {
    if (gameState !== 'playing' || flippedTiles.length >= 2) return;
    
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.matched || tile.flipped) return;

    const newFlippedTiles = [...flippedTiles, tileId];
    setFlippedTiles(newFlippedTiles);

    setTiles(prev => prev.map(t => 
      t.id === tileId ? { ...t, flipped: true } : t
    ));

    if (newFlippedTiles.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedTiles;
      const firstTile = tiles.find(t => t.id === firstId);
      const secondTile = tiles.find(t => t.id === secondId);

      if (firstTile && secondTile && firstTile.type === secondTile.type) {
        // Match found
        setTimeout(() => {
          setTiles(prev => prev.map(t => 
            t.id === firstId || t.id === secondId 
              ? { ...t, matched: true, flipped: false }
              : t
          ));
          setMatchedPairs(prev => prev + 1);
          setScore(prev => prev + 100);
          setFlippedTiles([]);
        }, 800);
      } else {
        // No match
        setTimeout(() => {
          setTiles(prev => prev.map(t => 
            t.id === firstId || t.id === secondId 
              ? { ...t, flipped: false }
              : t
          ));
          setFlippedTiles([]);
        }, 1200);
      }
    }
  };

  const calculateReward = () => {
    const settings = getDifficultySettings(difficulty);
    let baseReward = 0;
    
    switch (difficulty) {
      case 'easy':
        baseReward = 2;
        break;
      case 'medium':
        baseReward = 5;
        break;
      case 'hard':
        baseReward = 10;
        break;
    }

    // Time bonus
    const timeBonus = timeLeft > 30 ? 1 : 0;
    
    // Perfect game bonus
    const perfectBonus = moves === settings.pairs ? 10 : 0;
    
    return baseReward + timeBonus + perfectBonus;
  };

  const processGameReward = async () => {
    if (!wallet || isProcessingReward) return;
    
    setIsProcessingReward(true);
    try {
      const reward = calculateReward();
      // In a real implementation, this would trigger a server-side reward distribution
      // For now, we'll simulate the reward
      setEarnedTokens(reward.toString());
      
      // Distribute real SLERF tokens via API
      try {
        const settings = getDifficultySettings(difficulty);
        const perfectGame = moves === settings.pairs;
        
        const response = await fetch('/api/games/match-out/reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: wallet,
            difficulty,
            score,
            moves,
            timeLeft,
            perfectGame
          })
        });
        
        const rewardResult = await response.json();
        if (rewardResult.success) {
          setEarnedTokens(rewardResult.amount.toString());
          console.log(`Successfully distributed ${rewardResult.amount} SLERF tokens to ${wallet}`);
        } else {
          console.error('Failed to distribute reward:', rewardResult.message);
          // Fallback to calculated amount
          setEarnedTokens(reward.toString());
        }
      } catch (error) {
        console.error('Error distributing reward:', error);
        // Fallback to calculated amount
        setEarnedTokens(reward.toString());
      }
      
    } catch (error) {
      console.error('Error processing reward:', error);
    } finally {
      setIsProcessingReward(false);
    }
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('completed');
    }
  }, [gameState, timeLeft]);

  // Check for game completion
  useEffect(() => {
    const settings = getDifficultySettings(difficulty);
    if (matchedPairs === settings.pairs && gameState === 'playing') {
      setGameState('completed');
      processGameReward();
    }
  }, [matchedPairs, difficulty, gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slerf-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <img src="/icons/slerf-logo.png" alt="SLERF" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Match Out Game</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to start earning SLERF tokens!</p>
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
            <h1 className="text-3xl font-bold text-slerf-orange">Match Out</h1>
          </div>
          <a 
            href="/games"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Games
          </a>
        </div>

        {gameState === 'menu' && (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Difficulty</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    difficulty === level
                      ? 'border-slerf-orange bg-slerf-orange/20'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <h3 className="text-xl font-bold capitalize mb-2">{level}</h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>{getDifficultySettings(level).pairs} pairs</p>
                    <p>{formatTime(getDifficultySettings(level).timeLimit)} time limit</p>
                    <p className="text-slerf-orange font-semibold">
                      {level === 'easy' ? '2-12' : level === 'medium' ? '5-15' : '10-20'} SLERF
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={initializeGame}
              className="bg-slerf-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            {/* Game Stats */}
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slerf-orange">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-300">Time Left</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{moves}</div>
                <div className="text-sm text-gray-300">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-gray-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{matchedPairs}/{getDifficultySettings(difficulty).pairs}</div>
                <div className="text-sm text-gray-300">Pairs</div>
              </div>
            </div>

            {/* Game Grid */}
            <div 
              className={`grid match-grid-mobile max-w-2xl mx-auto`}
              style={{
                gridTemplateColumns: `repeat(${getDifficultySettings(difficulty).gridCols}, 1fr)`,
              }}
            >
              {tiles.map((tile) => (
                <div
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  className={`match-tile-mobile transition-all duration-300 ${
                    tile.matched
                      ? 'bg-green-500/30 border-green-400'
                      : tile.flipped
                      ? 'bg-slerf-orange/30 border-slerf-orange'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {(tile.flipped || tile.matched) ? tile.emoji : '❓'}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              {matchedPairs === getDifficultySettings(difficulty).pairs ? (
                <div className="text-6xl mb-4">🎉</div>
              ) : (
                <div className="text-6xl mb-4">⏰</div>
              )}
              <h2 className="text-3xl font-bold mb-2">
                {matchedPairs === getDifficultySettings(difficulty).pairs ? 'Congratulations!' : 'Time\'s Up!'}
              </h2>
              <p className="text-gray-300 mb-6">
                {matchedPairs === getDifficultySettings(difficulty).pairs
                  ? 'You completed the puzzle!'
                  : `You matched ${matchedPairs} out of ${getDifficultySettings(difficulty).pairs} pairs.`
                }
              </p>
            </div>

            <div className="bg-slerf-dark/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Game Results</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Final Score:</span>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Moves Used:</span>
                  <span className="font-bold">{moves}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Remaining:</span>
                  <span className="font-bold">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pairs Matched:</span>
                  <span className="font-bold">{matchedPairs}/{getDifficultySettings(difficulty).pairs}</span>
                </div>
                <hr className="border-gray-600 my-4" />
                <div className="flex justify-between text-slerf-orange">
                  <span className="font-bold">SLERF Earned:</span>
                  <span className="font-bold">{earnedTokens}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setGameState('menu')}
                className="w-full bg-slerf-orange hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Play Again
              </button>
              <a
                href="/games"
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Back to Games
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}