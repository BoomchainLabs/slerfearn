import React from 'react';
import { motion } from 'framer-motion';
import GitBookDocs from '@/components/GitBookDocs';

const ApiDocsPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-bold font-space">$LERF API Documentation</h1>
        <p className="text-gray-400 text-lg">
          Complete API reference and integration guides for the $LERF ecosystem
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GitBookDocs 
          space="lerf-hub"
          defaultPage="token"
          title="$LERF Documentation"
          description="Official documentation and integration guides for $LERF, curated by Sylvestre Villalba and the team"
        />
      </motion.div>
    </div>
  );
};

export default ApiDocsPage;