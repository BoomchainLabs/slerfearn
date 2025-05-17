import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleFairLaunchCreator from '@/components/SimpleFairLaunchCreator';
import { motion } from 'framer-motion';

const TokenCreatorPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-bold font-space">$LERF Token Creator</h1>
        <p className="text-gray-400 text-lg">
          Create and launch your $LERF token on the Solana blockchain with our integrated tools
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="fair-launch" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-8">
            <TabsTrigger value="fair-launch">Fair Launch</TabsTrigger>
            <TabsTrigger value="bonding-curve">Bonding Curve</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fair-launch">
            <SimpleFairLaunchCreator />
          </TabsContent>
          
          <TabsContent value="bonding-curve">
            <div className="glass p-8 rounded-xl text-center">
              <h3 className="text-xl font-medium mb-4">Bonding Curve Creator</h3>
              <p className="text-gray-400 mb-4">
                This feature is coming soon. Use Fair Launch for now to create your $LERF token.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TokenCreatorPage;