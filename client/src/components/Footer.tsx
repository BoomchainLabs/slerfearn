import React from 'react';
import { Link } from 'wouter';
import slerfLogo from '@/assets/slerf-logo.svg';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slerf-dark-light py-10 border-t border-slerf-dark-lighter">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={slerfLogo} alt="SLERF Logo" className="h-10 w-10 mr-2" />
              <span className="font-space font-bold text-xl">SlerfHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              A dynamic Web3 reward platform leveraging $SLERF tokens through an engaging ecosystem of missions, games, and blockchain interactions.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-slerf-cyan transition">Home</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-slerf-cyan transition">Games</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-slerf-cyan transition">Documentation</Link></li>
              <li><a href="/#missions" className="text-gray-400 hover:text-slerf-cyan transition">Missions</a></li>
              <li><a href="/#staking" className="text-gray-400 hover:text-slerf-cyan transition">Staking</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com/slerf00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan transition">Twitter</a></li>
              <li><a href="https://discord.gg/slerf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan transition">Discord</a></li>
              <li><a href="https://t.me/slerfofficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan transition">Telegram</a></li>
              <li><a href="https://medium.com/@slerf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan transition">Medium</a></li>
              <li><a href="https://github.com/slerfhub" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan transition">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="https://etherscan.io/token/0x233df63325933fa3f2dac8e695cd84bb2f91ab07" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slerf-cyan transition">Contract</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-cyan transition">Whitepaper</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-cyan transition">Developer API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-cyan transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-slerf-cyan transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slerf-dark-lighter mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SlerfHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-slerf-cyan transition text-sm">
              Support
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-slerf-cyan transition text-sm">
              FAQ
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-slerf-cyan transition text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;