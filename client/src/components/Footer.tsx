import React from 'react';
import { useToast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subscribed",
      description: "You've been subscribed to our newsletter!",
    });
    setEmail('');
  };

  return (
    <footer className="py-16 px-4 border-t border-slerf-dark/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 bg-slerf-orange rounded-lg flex items-center justify-center">
                <span className="font-space font-bold text-2xl">S</span>
              </div>
              <span className="font-space font-bold text-xl">SlerfHub</span>
            </div>
            
            <p className="text-gray-400 mb-6">
              The ultimate platform to earn $SLERF through missions, games, staking, and referrals.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-slerf-orange transition">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-slerf-orange transition">
                <i className="ri-discord-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-slerf-orange transition">
                <i className="ri-telegram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-slerf-orange transition">
                <i className="ri-medium-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-slerf-orange transition">
                <i className="ri-github-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">Home</a></li>
              <li><a href="#missions" className="text-gray-400 hover:text-slerf-orange transition">Missions</a></li>
              <li><a href="#staking" className="text-gray-400 hover:text-slerf-orange transition">Staking</a></li>
              <li><a href="#games" className="text-gray-400 hover:text-slerf-orange transition">Games</a></li>
              <li><a href="#nfts" className="text-gray-400 hover:text-slerf-orange transition">NFT Boosters</a></li>
              <li><a href="#marketplace" className="text-gray-400 hover:text-slerf-orange transition">Marketplace</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">Docs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">Tokenomics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">Roadmap</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-orange transition">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Get the latest SlerfHub updates and announcements.</p>
            
            <form onSubmit={handleSubscribe}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-slerf-dark/50 text-white rounded-l-lg px-4 py-2 flex-1 focus:outline-none" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-slerf-orange hover:bg-slerf-orange/90 text-white px-4 py-2 rounded-r-lg font-medium transition"
                >
                  Subscribe
                </button>
              </div>
            </form>
            
            <p className="text-xs text-gray-500 mt-2">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-slerf-dark/30 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SlerfHub. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-slerf-orange text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-slerf-orange text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-slerf-orange text-sm transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
