import React from 'react';
import SpinGame from '@/components/SpinGame';
import BlockchainGames from '@/components/BlockchainGames';
import { Separator } from "@/components/ui/separator";

const Games: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-slerf-dark">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-space font-bold text-center mb-8">
          Play <span className="text-slerf-cyan">Games</span> & Earn <span className="text-slerf-cyan">SLERF</span>
        </h1>
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-16">
          Enjoy our selection of games where you can stake, play, and earn SLERF tokens. Connect your wallet to start your gaming journey!
        </p>
      </div>
      
      <SpinGame />
      
      <Separator className="my-8 bg-slerf-dark-light" />
      
      <BlockchainGames />
    </div>
  );
};

export default Games;