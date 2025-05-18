import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import SLERFAnimatedLogo from './SLERFAnimatedLogo';

interface DocItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'guide' | 'api' | 'tutorial';
  lastUpdated: string;
}

const SAMPLE_DOCS: DocItem[] = [
  {
    id: 'doc-1',
    title: 'Getting Started with $LERF',
    description: 'Learn the basics of $LERF token and how to get started with staking',
    url: 'https://docs.slerf.io/getting-started',
    type: 'guide',
    lastUpdated: '2025-05-12'
  },
  {
    id: 'doc-2',
    title: 'Staking Mechanisms',
    description: 'Detailed explanation of staking rewards and lock periods',
    url: 'https://docs.slerf.io/staking',
    type: 'guide',
    lastUpdated: '2025-05-10'
  },
  {
    id: 'doc-3',
    title: 'Cross-Chain Bridge',
    description: 'How to use the Base to Ethereum bridge for $LERF tokens',
    url: 'https://docs.slerf.io/bridge',
    type: 'tutorial',
    lastUpdated: '2025-05-15'
  },
  {
    id: 'doc-4',
    title: 'Token API Reference',
    description: 'Complete API documentation for $LERF token integration',
    url: 'https://docs.slerf.io/api/token',
    type: 'api',
    lastUpdated: '2025-05-11'
  },
  {
    id: 'doc-5',
    title: 'NFT Integration Guide',
    description: 'Learn how to integrate SLERF NFTs with your application',
    url: 'https://docs.slerf.io/nft/integration',
    type: 'api',
    lastUpdated: '2025-05-14'
  }
];

interface GitBookDocsProps {
  className?: string;
}

const GitBookDocs: React.FC<GitBookDocsProps> = ({ className = "" }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>([]);
  
  // Load documentation
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate API call to GitBook
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocs(SAMPLE_DOCS);
      } catch (error) {
        console.error('Error fetching GitBook docs:', error);
        toast({
          variant: "destructive",
          title: "Failed to load documentation",
          description: "Could not connect to GitBook API. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocs();
  }, [toast]);
  
  // Filter docs based on search query and active tab
  useEffect(() => {
    let filtered = [...docs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        doc => 
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query)
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(doc => doc.type === activeTab);
    }
    
    setFilteredDocs(filtered);
  }, [docs, searchQuery, activeTab]);
  
  // Format date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-black/80 rounded-lg p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <SLERFAnimatedLogo size={32} interval={8000} />
            <h3 className="ml-3 text-lg font-audiowide text-white">Documentation</h3>
          </div>
          <div className="text-xs text-white/60 font-mono">
            POWERED BY GITBOOK
          </div>
        </div>
        
        <div className="mb-4">
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-black/30 border-white/10 text-white"
          />
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="bg-black/30 border border-white/10 w-full">
            <TabsTrigger 
              value="all"
              className="flex-1 data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
            >
              All Docs
            </TabsTrigger>
            <TabsTrigger 
              value="guide"
              className="flex-1 data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
            >
              Guides
            </TabsTrigger>
            <TabsTrigger 
              value="api"
              className="flex-1 data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
            >
              API Docs
            </TabsTrigger>
            <TabsTrigger 
              value="tutorial"
              className="flex-1 data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
            >
              Tutorials
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-white/50 mb-2">No documentation found</div>
              <div className="text-sm text-white/30">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.` 
                  : 'No documentation available for this category.'}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map(doc => (
                <div 
                  key={doc.id}
                  className="p-4 bg-black/40 rounded-lg border border-white/5 hover:border-white/20 transition-all hover:bg-black/60"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{doc.title}</h4>
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded ${
                      doc.type === 'api' 
                        ? 'bg-[hsl(var(--cyber-blue))/20] text-[hsl(var(--cyber-blue))]' 
                        : doc.type === 'tutorial'
                          ? 'bg-[hsl(var(--cyber-pink))/20] text-[hsl(var(--cyber-pink))]'
                          : 'bg-[hsl(var(--cyber-purple))/20] text-[hsl(var(--cyber-purple))]'
                    }`}>
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-3">{doc.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">
                      Updated: {formatDate(doc.lastUpdated)}
                    </span>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-[hsl(var(--cyber-blue))] border-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--cyber-blue))/10]"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      View Doc
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-white/50">
            SLERF Documentation v1.2.5
          </span>
          <Button 
            size="sm"
            variant="default"
            className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-purple))] hover:opacity-90"
            onClick={() => window.open('https://docs.slerf.io', '_blank')}
          >
            Full Documentation
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GitBookDocs;