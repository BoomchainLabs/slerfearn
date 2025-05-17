import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Prize {
  id: number;
  label: string;
  tokens: number;
  probability: number;
  color: string;
}

const prizes: Prize[] = [
  { id: 1, label: '5 SLERF', tokens: 5, probability: 0.25, color: '#4CAF50' },
  { id: 2, label: '10 SLERF', tokens: 10, probability: 0.2, color: '#2196F3' },
  { id: 3, label: '25 SLERF', tokens: 25, probability: 0.15, color: '#FF9800' },
  { id: 4, label: 'Try Again', tokens: 0, probability: 0.3, color: '#f44336' },
  { id: 5, label: '50 SLERF', tokens: 50, probability: 0.07, color: '#9C27B0' },
  { id: 6, label: '100 SLERF', tokens: 100, probability: 0.03, color: '#FFEB3B' },
];

const SpinGame: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [spinResult, setSpinResult] = useState<Prize | null>(null);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const wheelRef = useRef<HTMLDivElement>(null);

  // Check if user can spin
  useEffect(() => {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (lastSpinTime) {
      const nextTime = new Date(parseInt(lastSpinTime) + 4 * 60 * 60 * 1000); // 4 hours cooldown
      setNextSpinTime(nextTime);
      
      if (nextTime > new Date()) {
        setCanSpin(false);
      }
    }
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!canSpin && nextSpinTime) {
      const interval = setInterval(() => {
        const now = new Date();
        if (nextSpinTime <= now) {
          setCanSpin(true);
          clearInterval(interval);
          return;
        }

        const diff = nextSpinTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [canSpin, nextSpinTime]);

  const handleSpin = () => {
    if (!wallet) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to spin the wheel",
      });
      return;
    }

    if (!canSpin) {
      toast({
        title: "Spin Cooldown",
        description: `You can spin again in ${timeLeft}`,
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setSpinResult(null);

    // Determine result using weighted probabilities
    const rand = Math.random();
    let cumulativeProbability = 0;
    let selectedPrize: Prize | null = null;

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (rand <= cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }

    if (!selectedPrize) {
      selectedPrize = prizes[prizes.length - 1]; // Fallback to last prize
    }

    // Calculate rotation to land on the prize (each segment is 60 degrees since we have 6 prizes)
    const baseAngle = 360 / prizes.length;
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const landingAngle = baseAngle * prizeIndex + baseAngle / 2;
    
    // Add multiple rotations for effect plus landing angle
    const rotations = 5; // Number of full rotations
    const randomOffset = Math.random() * 20 - 10; // Small random offset for realism
    const finalAngle = 360 * rotations - landingAngle + randomOffset;

    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
    }

    // Set cooldown
    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(selectedPrize);
      
      if (selectedPrize.tokens > 0) {
        toast({
          title: "Congratulations!",
          description: `You won ${selectedPrize.tokens} SLERF tokens!`,
        });
      } else {
        toast({
          title: "Better luck next time!",
          description: "Spin again in 4 hours for another chance to win.",
        });
      }

      // Set last spin time
      const now = new Date();
      localStorage.setItem('lastSpinTime', now.getTime().toString());
      setNextSpinTime(new Date(now.getTime() + 4 * 60 * 60 * 1000)); // 4 hours cooldown
      setCanSpin(false);
    }, 4100); // Slightly longer than animation duration
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-slerf-dark/70 to-slerf-dark/90">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-space font-bold mb-4">Spin & Win SLERF Tokens</h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Spin the wheel once every 4 hours for a chance to win SLERF tokens instantly. Connect your wallet to get started!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Spin Wheel */}
          <div className="relative w-[300px] h-[300px]">
            <div 
              ref={wheelRef} 
              className="w-full h-full rounded-full border-4 border-slerf-purple/50 relative transition-transform duration-1000"
              style={{ 
                transform: 'rotate(0deg)',
                backgroundImage: `conic-gradient(
                  ${prizes[0].color} 0% ${prizes[0].probability * 100}%,
                  ${prizes[1].color} ${prizes[0].probability * 100}% ${(prizes[0].probability + prizes[1].probability) * 100}%,
                  ${prizes[2].color} ${(prizes[0].probability + prizes[1].probability) * 100}% ${(prizes[0].probability + prizes[1].probability + prizes[2].probability) * 100}%,
                  ${prizes[3].color} ${(prizes[0].probability + prizes[1].probability + prizes[2].probability) * 100}% ${(prizes[0].probability + prizes[1].probability + prizes[2].probability + prizes[3].probability) * 100}%,
                  ${prizes[4].color} ${(prizes[0].probability + prizes[1].probability + prizes[2].probability + prizes[3].probability) * 100}% ${(prizes[0].probability + prizes[1].probability + prizes[2].probability + prizes[3].probability + prizes[4].probability) * 100}%,
                  ${prizes[5].color} ${(prizes[0].probability + prizes[1].probability + prizes[2].probability + prizes[3].probability + prizes[4].probability) * 100}% 100%
                )`,
              }}
            >
              {/* Prize labels */}
              {prizes.map((prize, index) => {
                const angleRad = ((index * (360 / prizes.length)) + (180 / prizes.length)) * (Math.PI / 180);
                const x = 135 + Math.cos(angleRad) * 100;
                const y = 135 + Math.sin(angleRad) * 100;

                return (
                  <div 
                    key={prize.id} 
                    className="absolute text-center text-xs font-bold text-white whitespace-nowrap px-2 py-1 rounded-full"
                    style={{ 
                      transform: `translate(-50%, -50%) rotate(${index * (360 / prizes.length) + 90}deg)`,
                      left: `${x}px`,
                      top: `${y}px`,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    }}
                  >
                    {prize.label}
                  </div>
                );
              })}
            </div>

            {/* Arrow pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-slerf-cyan z-10"></div>
          </div>

          {/* Control Panel */}
          <div className="glass p-6 rounded-xl w-full max-w-sm flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-4">Daily Spin</h3>
            {spinResult ? (
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${spinResult.tokens > 0 ? 'text-slerf-cyan' : 'text-gray-400'}`}>
                  {spinResult.tokens > 0 ? `+${spinResult.tokens} SLERF` : 'Try Again'}
                </div>
                <p className="text-gray-300">
                  {spinResult.tokens > 0 
                    ? 'Congratulations! Tokens have been added to your balance.' 
                    : 'Better luck next time!'}
                </p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="text-2xl font-bold mb-2">Spin to Win</div>
                <p className="text-gray-300">Try your luck and earn SLERF tokens!</p>
              </div>
            )}

            {canSpin ? (
              <Button 
                className="w-full bg-slerf-cyan hover:bg-slerf-cyan/90 text-slerf-dark font-medium"
                disabled={isSpinning || !wallet}
                onClick={handleSpin}
              >
                {isSpinning ? 'Spinning...' : 'Spin Now'}
              </Button>
            ) : (
              <div className="text-center w-full">
                <Button 
                  className="w-full mb-2 bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                  disabled={true}
                >
                  Spin Locked
                </Button>
                <div className="text-sm text-gray-400">
                  Next spin available in: <span className="text-slerf-cyan font-mono">{timeLeft}</span>
                </div>
              </div>
            )}

            <div className="mt-6 w-full">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Prize Chances</h4>
              <div className="space-y-2">
                {prizes.map(prize => (
                  <div key={prize.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: prize.color }}
                      ></div>
                      <span className="text-sm">{prize.label}</span>
                    </div>
                    <span className="text-sm font-mono">{(prize.probability * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinGame;