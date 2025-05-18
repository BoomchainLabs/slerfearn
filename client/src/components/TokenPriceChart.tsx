import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PricePoint } from '@/lib/api';
import AnimatedCatLogo from './AnimatedCatLogo';

interface TokenPriceChartProps {
  priceHistory: PricePoint[];
  className?: string;
  symbol?: string;
  loading?: boolean;
}

const TokenPriceChart: React.FC<TokenPriceChartProps> = ({
  priceHistory = [],
  className = "",
  symbol = "LERF",
  loading = false
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [hoverData, setHoverData] = useState<PricePoint | null>(null);
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [gridLines, setGridLines] = useState<number[]>([]);
  
  // Filter data based on selected time range
  useEffect(() => {
    if (!priceHistory.length) return;
    
    const now = Date.now();
    let filteredData: PricePoint[] = [];
    
    switch (timeRange) {
      case '24h':
        filteredData = priceHistory.filter(
          point => point.timestamp >= now - 24 * 60 * 60 * 1000
        );
        break;
      case '7d':
        filteredData = priceHistory.filter(
          point => point.timestamp >= now - 7 * 24 * 60 * 60 * 1000
        );
        break;
      case '30d':
        filteredData = priceHistory.filter(
          point => point.timestamp >= now - 30 * 24 * 60 * 60 * 1000
        );
        break;
      case 'all':
      default:
        filteredData = [...priceHistory];
        break;
    }
    
    // Ensure we have at least 2 data points
    if (filteredData.length < 2) {
      const lastPoint = priceHistory[priceHistory.length - 1];
      
      if (lastPoint) {
        filteredData = [
          { timestamp: now - 24 * 60 * 60 * 1000, price: lastPoint.price * 0.9 },
          lastPoint
        ];
      }
    }
    
    setChartData(filteredData);
    
    // Calculate grid lines for Y axis based on price range
    if (filteredData.length > 0) {
      const minPrice = Math.min(...filteredData.map(d => d.price));
      const maxPrice = Math.max(...filteredData.map(d => d.price));
      const priceDiff = maxPrice - minPrice;
      
      const lines = [];
      const segmentCount = 4;
      
      for (let i = 0; i <= segmentCount; i++) {
        lines.push(minPrice + (priceDiff * i / segmentCount));
      }
      
      setGridLines(lines);
    }
  }, [priceHistory, timeRange]);
  
  // Format timestamp for tooltip and x-axis
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Format price for tooltip
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 p-3 border border-white/10 rounded-md shadow-xl backdrop-blur-sm">
          <p className="text-white/70 text-xs mb-1">
            {formatTimestamp(data.timestamp)}
          </p>
          <p className="text-white font-mono font-bold">
            {formatPrice(data.price)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom dot component for data points
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    // Only show dot on hover or for last point
    if (
      (hoverData && hoverData.timestamp === payload.timestamp) ||
      payload.timestamp === chartData[chartData.length - 1]?.timestamp
    ) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill="#FF00EA" 
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={2}
        />
      );
    }
    
    return null;
  };
  
  // Calculate price change data
  const getCurrentPriceData = () => {
    if (!chartData.length) return { price: 0, change: '0%', direction: 'neutral' };
    
    const currentPrice = chartData[chartData.length - 1]?.price || 0;
    const startPrice = chartData[0]?.price || currentPrice;
    const priceDiff = currentPrice - startPrice;
    const percentChange = (priceDiff / startPrice) * 100;
    
    return {
      price: currentPrice,
      change: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
      direction: percentChange >= 0 ? 'up' : 'down'
    };
  };
  
  const priceData = getCurrentPriceData();
  
  return (
    <div className={`cyber-card p-0.5 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-black/80 rounded-lg p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AnimatedCatLogo size={40} interval={12000} />
            <div className="ml-3">
              <h3 className="text-lg font-audiowide text-white">{symbol} Chart</h3>
              <div className="flex items-center mt-1">
                <span className="text-xl font-mono font-bold">
                  {formatPrice(priceData.price)}
                </span>
                <span className={`ml-2 text-sm ${
                  priceData.direction === 'up' 
                    ? 'text-green-500' 
                    : priceData.direction === 'down' 
                      ? 'text-red-500' 
                      : 'text-white/70'
                }`}>
                  {priceData.change}
                </span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="7d" className="w-auto" onValueChange={val => setTimeRange(val as any)}>
            <TabsList className="bg-black/30 border border-white/10">
              <TabsTrigger 
                value="24h"
                className="data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
              >
                24H
              </TabsTrigger>
              <TabsTrigger 
                value="7d"
                className="data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
              >
                7D
              </TabsTrigger>
              <TabsTrigger 
                value="30d"
                className="data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
              >
                30D
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-[hsl(var(--cyber-blue))] data-[state=active]:text-white"
              >
                ALL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="aspect-[16/9] w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-black/30 rounded-lg">
              <div className="flex flex-col items-center">
                <AnimatedCatLogo size={60} interval={800} />
                <p className="mt-4 text-white/70">Loading chart data...</p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                onMouseMove={(e) => {
                  if (e.activePayload) {
                    setHoverData(e.activePayload[0].payload);
                  }
                }}
                onMouseLeave={() => setHoverData(null)}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#953BFF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF00EA" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  minTickGap={40}
                />
                <YAxis 
                  domain={['dataMin', 'dataMax']}
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  ticks={gridLines}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#953BFF" 
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  activeDot={<CustomDot />}
                  dot={<CustomDot />}
                  isAnimationActive={true}
                  animationDuration={500}
                />
                {hoverData && (
                  <ReferenceLine 
                    x={hoverData.timestamp} 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeDasharray="3 3" 
                  />
                )}
                {hoverData && (
                  <ReferenceLine 
                    y={hoverData.price} 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeDasharray="3 3"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/30 rounded-lg">
              <div className="text-center">
                <p className="text-white/70 mb-3">No price data available</p>
                <Button 
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Refresh Data
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs mb-1">24h Volume</div>
            <div className="text-lg font-mono">$927K</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs mb-1">Market Cap</div>
            <div className="text-lg font-mono">$4.8M</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPriceChart;