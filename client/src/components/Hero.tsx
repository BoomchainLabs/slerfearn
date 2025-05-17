import React from 'react';

interface HeroProps {
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-space font-bold mb-4">
              Earn <span className="text-slerf-orange">$SLERF</span><br/>
              Complete <span className="text-slerf-purple">Quests</span><br/>
              Have <span className="text-slerf-cyan">Fun</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Join the SlerfHub community and earn rewards through daily missions, games, staking, and referrals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStartClick}
                className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-6 py-3 rounded-lg font-medium text-lg transition shadow-glow"
              >
                Start Earning
              </button>
              <button className="border border-slerf-purple hover:bg-slerf-purple/10 text-white px-6 py-3 rounded-lg font-medium text-lg transition">
                Learn More
              </button>
            </div>
            
            <div className="mt-8 flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
                  alt="User avatar" 
                  className="h-10 w-10 rounded-full border-2 border-slerf-dark" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
                  alt="User avatar" 
                  className="h-10 w-10 rounded-full border-2 border-slerf-dark" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
                  alt="User avatar" 
                  className="h-10 w-10 rounded-full border-2 border-slerf-dark" 
                />
              </div>
              <span className="text-gray-300">+2,500 users already earning</span>
            </div>
          </div>
          
          <div className="md:w-5/12 relative">
            <img 
              src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
              alt="SlerfHub Rewards Illustration" 
              className="rounded-2xl animate-float shadow-xl" 
            />
            
            <div className="absolute -top-5 -right-5 bg-slerf-purple text-white px-4 py-2 rounded-lg font-medium animate-pulse-slow">
              <i className="ri-fire-line mr-1"></i> Hot Quest!
            </div>
            
            <div className="absolute -bottom-5 -left-5 glass rounded-lg px-4 py-3 flex items-center space-x-3">
              <div className="bg-slerf-orange h-10 w-10 rounded-full flex items-center justify-center text-white">
                <i className="ri-money-dollar-circle-line text-xl"></i>
              </div>
              <div>
                <div className="text-xs text-gray-400">Total Rewards</div>
                <div className="font-mono font-medium">1,245,789 $SLERF</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
