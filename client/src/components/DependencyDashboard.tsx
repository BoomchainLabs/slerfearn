import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Types for our dependency data
type Dependency = {
  id: string;
  name: string;
  category: 'token' | 'platform' | 'service' | 'partner';
  status: 'active' | 'planned' | 'deprecated';
  description: string;
  importance: number; // 1-10 scale
  links: Array<{
    to: string;
    strength: number; // 1-10 scale
    type: 'depends-on' | 'provides-for' | 'partners-with';
  }>;
};

// Data for the dependency graph
const dependencyData: Dependency[] = [
  {
    id: 'lerf',
    name: '$LERF Token',
    category: 'token',
    status: 'active',
    description: 'The core utility token powering the entire ecosystem',
    importance: 10,
    links: [
      { to: 'eth', strength: 9, type: 'depends-on' },
      { to: 'sol', strength: 7, type: 'depends-on' },
      { to: 'missions', strength: 8, type: 'provides-for' },
      { to: 'quests', strength: 8, type: 'provides-for' },
      { to: 'staking', strength: 9, type: 'provides-for' },
      { to: 'nft', strength: 6, type: 'provides-for' }
    ]
  },
  {
    id: 'eth',
    name: 'Ethereum',
    category: 'platform',
    status: 'active',
    description: 'Primary blockchain platform for $LERF token',
    importance: 9,
    links: [
      { to: 'uniswap', strength: 8, type: 'partners-with' },
      { to: 'staking', strength: 7, type: 'provides-for' }
    ]
  },
  {
    id: 'sol',
    name: 'Solana',
    category: 'platform',
    status: 'active',
    description: 'Secondary blockchain platform with faster transactions',
    importance: 7,
    links: [
      { to: 'raydium', strength: 7, type: 'partners-with' }
    ]
  },
  {
    id: 'missions',
    name: 'Daily Missions',
    category: 'service',
    status: 'active',
    description: 'Short-term tasks for users to earn $LERF tokens',
    importance: 8,
    links: [
      { to: 'rewards', strength: 9, type: 'provides-for' }
    ]
  },
  {
    id: 'quests',
    name: 'Weekly Quests',
    category: 'service',
    status: 'active',
    description: 'Longer-term objectives with higher rewards',
    importance: 8,
    links: [
      { to: 'rewards', strength: 9, type: 'provides-for' }
    ]
  },
  {
    id: 'staking',
    name: 'Staking Vaults',
    category: 'service',
    status: 'active',
    description: 'Lock $LERF tokens to earn passive income',
    importance: 9,
    links: [
      { to: 'rewards', strength: 8, type: 'provides-for' }
    ]
  },
  {
    id: 'rewards',
    name: 'Reward System',
    category: 'service',
    status: 'active',
    description: 'Distribution of $LERF tokens to users',
    importance: 9,
    links: [
      { to: 'lerf', strength: 10, type: 'depends-on' }
    ]
  },
  {
    id: 'nft',
    name: 'NFT Boosters',
    category: 'token',
    status: 'active',
    description: 'Collectibles that enhance $LERF rewards',
    importance: 6,
    links: [
      { to: 'rewards', strength: 6, type: 'provides-for' }
    ]
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    category: 'partner',
    status: 'active',
    description: 'DEX for trading $LERF on Ethereum',
    importance: 8,
    links: [
      { to: 'lerf', strength: 8, type: 'provides-for' }
    ]
  },
  {
    id: 'raydium',
    name: 'Raydium',
    category: 'partner',
    status: 'active',
    description: 'DEX for trading $LERF on Solana',
    importance: 7,
    links: [
      { to: 'lerf', strength: 7, type: 'provides-for' }
    ]
  },
  {
    id: 'github',
    name: 'GitHub Integration',
    category: 'service',
    status: 'active',
    description: 'Connect GitHub accounts for developer-focused rewards',
    importance: 7,
    links: [
      { to: 'missions', strength: 6, type: 'provides-for' },
      { to: 'quests', strength: 6, type: 'provides-for' }
    ]
  },
  {
    id: 'referral',
    name: 'Referral Program',
    category: 'service',
    status: 'active',
    description: 'User acquisition through referrals with token rewards',
    importance: 8,
    links: [
      { to: 'rewards', strength: 7, type: 'provides-for' }
    ]
  }
];

// Get color based on category
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'token':
      return '#1E90FF'; // Electric Blue
    case 'platform':
      return '#39FF14'; // Neon Green
    case 'service':
      return '#FF6B6B'; // Coral
    case 'partner':
      return '#FFD700'; // Gold
    default:
      return '#C0C0C0'; // Light Silver
  }
};

// Get link color based on type
const getLinkColor = (type: string): string => {
  switch (type) {
    case 'depends-on':
      return 'rgba(255, 255, 255, 0.4)';
    case 'provides-for':
      return 'rgba(57, 255, 20, 0.4)';
    case 'partners-with':
      return 'rgba(255, 215, 0, 0.4)';
    default:
      return 'rgba(255, 255, 255, 0.2)';
  }
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const DependencyDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState('graph');
  const [filter, setFilter] = useState('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Calculate positions for the graph
  const calculatePositions = () => {
    const radius = 180;
    const centerX = 300;
    const centerY = 300;
    
    // Place $LERF at the center
    const positions: Record<string, { x: number, y: number }> = {
      lerf: { x: centerX, y: centerY }
    };
    
    // Position other nodes in a circle around it
    const otherNodes = dependencyData.filter(d => d.id !== 'lerf');
    otherNodes.forEach((node, i) => {
      const angle = (i / otherNodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return positions;
  };
  
  const positions = calculatePositions();
  
  const filteredData = filter === 'all' 
    ? dependencyData 
    : dependencyData.filter(d => d.category === filter);
  
  // Build the dependency tree starting from $LERF
  const buildDependencyTree = (startId: string = 'lerf', level: number = 0): any => {
    if (level > 2) return null; // Limit recursion depth
    
    const node = dependencyData.find(d => d.id === startId);
    if (!node) return null;
    
    const children = node.links
      .map(link => {
        const targetNode = dependencyData.find(d => d.id === link.to);
        if (!targetNode) return null;
        
        return {
          ...targetNode,
          relationship: link.type,
          strength: link.strength,
          children: buildDependencyTree(link.to, level + 1)
        };
      })
      .filter(Boolean);
    
    return {
      ...node,
      children
    };
  };
  
  const renderDependencyTree = (node: any, depth: number = 0) => {
    if (!node) return null;
    
    return (
      <div 
        key={node.id} 
        className="py-2"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getCategoryColor(node.category) }}
          />
          <div className="font-medium">{node.name}</div>
          {node.relationship && (
            <div className="text-xs ml-2 text-gray-400">
              ({node.relationship.replace('-', ' ')}, strength: {node.strength}/10)
            </div>
          )}
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="ml-5 mt-1 border-l border-gray-700 pl-3">
            {node.children.map((child: any) => renderDependencyTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-8"
    >
      <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">$LERF Dependency Dashboard</CardTitle>
              <CardDescription>
                Visualize the relationships between tokens, platforms, and services
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graph">Graph View</SelectItem>
                  <SelectItem value="tree">Tree View</SelectItem>
                  <SelectItem value="matrix">Matrix View</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="token">Tokens</SelectItem>
                  <SelectItem value="platform">Platforms</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="partner">Partners</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed View</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {selectedView === 'graph' && (
                <div className="relative h-[600px] border border-slerf-dark-lighter rounded-lg overflow-hidden bg-slerf-dark p-4">
                  <svg width="100%" height="100%" viewBox="0 0 600 600">
                    {/* Draw connections first so they're under the nodes */}
                    {filteredData.flatMap(node => 
                      node.links
                        .filter(link => filteredData.some(d => d.id === link.to))
                        .map((link, i) => {
                          const source = positions[node.id];
                          const target = positions[link.to];
                          
                          // Only show the link if both nodes are in the filtered data
                          if (!source || !target) return null;
                          
                          const isHighlighted = 
                            hoveredNode === node.id || 
                            hoveredNode === link.to;
                          
                          return (
                            <g key={`${node.id}-${link.to}-${i}`}>
                              <line
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                stroke={getLinkColor(link.type)}
                                strokeWidth={isHighlighted ? 3 : 1 + (link.strength / 10) * 2}
                                strokeOpacity={isHighlighted ? 1 : 0.6}
                              />
                              
                              {/* Show relationship type on the line */}
                              <text
                                x={(source.x + target.x) / 2}
                                y={(source.y + target.y) / 2}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fill="white"
                                fontSize="10"
                                opacity={isHighlighted ? 1 : 0.7}
                                className="pointer-events-none"
                              >
                                {link.type}
                              </text>
                            </g>
                          );
                        })
                    )}
                    
                    {/* Draw the nodes */}
                    {filteredData.map(node => {
                      const pos = positions[node.id];
                      if (!pos) return null;
                      
                      const isHovered = hoveredNode === node.id;
                      
                      return (
                        <g key={node.id}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isHovered ? 20 : 15}
                            fill={getCategoryColor(node.category)}
                            opacity={isHovered ? 1 : 0.8}
                            stroke={isHovered ? "white" : "transparent"}
                            strokeWidth={2}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            style={{ cursor: 'pointer' }}
                          />
                          
                          <text
                            x={pos.x}
                            y={pos.y + 30}
                            textAnchor="middle"
                            fill="white"
                            fontSize={isHovered ? "14" : "12"}
                            fontWeight={isHovered ? "bold" : "normal"}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            style={{ cursor: 'pointer' }}
                          >
                            {node.name}
                          </text>
                          
                          {isHovered && (
                            <foreignObject 
                              x={pos.x + 25} 
                              y={pos.y - 50} 
                              width="200" 
                              height="100"
                            >
                              <div className="bg-slerf-dark p-2 rounded-md border border-gray-700 text-xs">
                                <div className="font-bold">{node.name}</div>
                                <div className="text-gray-300">{node.description}</div>
                                <div className="text-gray-400 mt-1">
                                  Importance: {node.importance}/10
                                </div>
                              </div>
                            </foreignObject>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-slerf-dark-lighter p-2 rounded-md">
                    <div className="text-xs font-bold mb-1">Legend</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor('token') }} />
                        <span className="text-xs">Token</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor('platform') }} />
                        <span className="text-xs">Platform</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor('service') }} />
                        <span className="text-xs">Service</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor('partner') }} />
                        <span className="text-xs">Partner</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedView === 'tree' && (
                <div className="border border-slerf-dark-lighter rounded-lg overflow-hidden bg-slerf-dark p-4 h-[600px] overflow-y-auto">
                  <div className="text-xl font-bold mb-4">$LERF Dependency Tree</div>
                  {renderDependencyTree(buildDependencyTree())}
                </div>
              )}
              
              {selectedView === 'matrix' && (
                <div className="border border-slerf-dark-lighter rounded-lg overflow-hidden bg-slerf-dark p-4 h-[600px] overflow-auto">
                  <div className="flex">
                    <div className="w-24"></div> {/* Empty corner cell */}
                    {filteredData.map(node => (
                      <div 
                        key={`col-${node.id}`}
                        className="w-20 p-1 transform -rotate-45 origin-bottom-left"
                        style={{ height: '120px' }}
                      >
                        <div className="text-xs font-medium truncate">{node.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredData.map(rowNode => (
                    <div 
                      key={`row-${rowNode.id}`}
                      className="flex"
                    >
                      <div className="w-24 p-2 flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getCategoryColor(rowNode.category) }}
                        />
                        <div className="text-xs font-medium truncate">{rowNode.name}</div>
                      </div>
                      
                      {filteredData.map(colNode => {
                        // Find if there's a link from rowNode to colNode
                        const link = rowNode.links.find(l => l.to === colNode.id);
                        
                        return (
                          <div 
                            key={`${rowNode.id}-${colNode.id}`}
                            className="w-20 h-14 flex items-center justify-center"
                          >
                            {link && (
                              <div 
                                className="w-10 h-10 rounded-md flex items-center justify-center"
                                style={{ 
                                  backgroundColor: getLinkColor(link.type),
                                  opacity: 0.2 + (link.strength / 10) * 0.8
                                }}
                                title={`${rowNode.name} ${link.type} ${colNode.name} (Strength: ${link.strength}/10)`}
                              >
                                <span className="text-xs font-bold">{link.strength}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details">
              <div className="border border-slerf-dark-lighter rounded-lg overflow-hidden bg-slerf-dark p-4 h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.map(node => (
                    <Card key={node.id} className="bg-slerf-dark-light border-slerf-dark-lighter">
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: getCategoryColor(node.category) }}
                          />
                          <CardTitle>{node.name}</CardTitle>
                        </div>
                        <CardDescription>{node.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Category:</span>
                            <span className="capitalize">{node.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="capitalize">{node.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Importance:</span>
                            <span>{node.importance}/10</span>
                          </div>
                          
                          <div className="mt-4">
                            <div className="text-gray-400 mb-1">Dependencies:</div>
                            <div className="space-y-1">
                              {node.links.map((link, i) => {
                                const target = dependencyData.find(d => d.id === link.to);
                                if (!target) return null;
                                
                                return (
                                  <div key={i} className="flex items-center">
                                    <div 
                                      className="w-2 h-2 rounded-full mr-2"
                                      style={{ backgroundColor: getCategoryColor(target.category) }}
                                    />
                                    <div className="flex-grow text-xs">{target.name}</div>
                                    <div className="text-xs text-gray-400">
                                      {link.type.replace('-', ' ')} ({link.strength}/10)
                                    </div>
                                  </div>
                                );
                              })}
                              
                              {node.links.length === 0 && (
                                <div className="text-xs text-gray-400">No dependencies</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="border border-slerf-dark-lighter rounded-lg overflow-hidden bg-slerf-dark p-4 h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
                    <CardHeader>
                      <CardTitle>Dependency Analysis</CardTitle>
                      <CardDescription>Key insights from the dependency network</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Critical Dependencies</h4>
                        <div className="space-y-2">
                          {dependencyData
                            .filter(d => d.importance >= 8)
                            .map(node => (
                              <div key={node.id} className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: getCategoryColor(node.category) }}
                                />
                                <div className="text-sm">{node.name} ({node.importance}/10)</div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Assessment</h4>
                        <div className="text-sm">
                          <p>The $LERF ecosystem has strong dependencies on both Ethereum and Solana platforms. 
                          The primary risk factor is the high centrality of the reward system which depends
                          heavily on the $LERF token liquidity.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Growth Opportunities</h4>
                        <div className="text-sm space-y-1">
                          <div>• Increase cross-chain integration beyond ETH and SOL</div>
                          <div>• Strengthen partner ecosystem with more DEX options</div>
                          <div>• Enhance GitHub integration with more developer tools</div>
                          <div>• Expand NFT booster functionality for greater utility</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slerf-dark-light border-slerf-dark-lighter">
                    <CardHeader>
                      <CardTitle>Network Statistics</CardTitle>
                      <CardDescription>Quantitative analysis of the dependency network</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slerf-dark rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Total Components</div>
                          <div className="text-2xl font-bold">{dependencyData.length}</div>
                        </div>
                        <div className="bg-slerf-dark rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Total Links</div>
                          <div className="text-2xl font-bold">
                            {dependencyData.reduce((sum, node) => sum + node.links.length, 0)}
                          </div>
                        </div>
                        <div className="bg-slerf-dark rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Avg. Importance</div>
                          <div className="text-2xl font-bold">
                            {(dependencyData.reduce((sum, node) => sum + node.importance, 0) / dependencyData.length).toFixed(1)}
                          </div>
                        </div>
                        <div className="bg-slerf-dark rounded-lg p-3">
                          <div className="text-gray-400 text-xs">Avg. Link Strength</div>
                          <div className="text-2xl font-bold">
                            {(dependencyData.flatMap(node => node.links).reduce((sum, link) => sum + link.strength, 0) / 
                              dependencyData.flatMap(node => node.links).length).toFixed(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Component Distribution</h4>
                        <div className="h-24 flex items-end">
                          {['token', 'platform', 'service', 'partner'].map(category => {
                            const count = dependencyData.filter(d => d.category === category).length;
                            const percentage = (count / dependencyData.length) * 100;
                            
                            return (
                              <div 
                                key={category}
                                className="flex-1 mx-1 flex flex-col items-center justify-end"
                              >
                                <div className="text-xs mb-1">{count}</div>
                                <div 
                                  style={{ 
                                    height: `${percentage}%`,
                                    backgroundColor: getCategoryColor(category),
                                    width: '100%',
                                    borderRadius: '3px 3px 0 0'
                                  }}
                                />
                                <div className="text-xs mt-1 capitalize">{category}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Link Type Distribution</h4>
                        <div className="h-24 flex items-end">
                          {['depends-on', 'provides-for', 'partners-with'].map(type => {
                            const count = dependencyData.flatMap(node => node.links).filter(link => link.type === type).length;
                            const total = dependencyData.flatMap(node => node.links).length;
                            const percentage = (count / total) * 100;
                            
                            return (
                              <div 
                                key={type}
                                className="flex-1 mx-1 flex flex-col items-center justify-end"
                              >
                                <div className="text-xs mb-1">{count}</div>
                                <div 
                                  style={{ 
                                    height: `${percentage}%`,
                                    backgroundColor: getLinkColor(type),
                                    width: '100%',
                                    borderRadius: '3px 3px 0 0'
                                  }}
                                />
                                <div className="text-xs mt-1 capitalize text-center">{type.replace('-', ' ')}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DependencyDashboard;