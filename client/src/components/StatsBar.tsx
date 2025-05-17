import React from 'react';
import { useQuery } from '@tanstack/react-query';

const StatsBar: React.FC = () => {
  // Fetch global stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <section className="py-4 px-4">
      <div className="container mx-auto">
        <div className="glass rounded-xl px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-gray-400 mb-1 text-sm">Total Users</div>
              <div className="font-mono text-2xl font-medium text-white">
                {isLoading ? '...' : formatNumber(stats?.totalUsers || 25420)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1 text-sm">$SLERF Distributed</div>
              <div className="font-mono text-2xl font-medium text-slerf-orange">
                {isLoading ? '...' : formatNumber(stats?.slerfDistributed || 4200000)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1 text-sm">Active Quests</div>
              <div className="font-mono text-2xl font-medium text-slerf-purple">
                {isLoading ? '...' : stats?.activeQuests || 24}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1 text-sm">Current APR</div>
              <div className="font-mono text-2xl font-medium text-slerf-cyan">
                {isLoading ? '...' : `${stats?.averageApr.toFixed(1) || 42.5}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
