import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import slerfLogo from '@/assets/slerf-logo.svg';

// Mock historical price data with realistic price movements for a meme token
const generateHistoricalData = () => {
  const now = new Date();
  const data = [];
  let price = 0.00000873; // Starting price
  const volatility = 0.15; // High volatility typical for meme tokens
  
  // Generate 30 days of hourly data with more realistic patterns
  for (let i = 30 * 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // Add some realistic patterns
    // 1. Small random movements
    const randomChange = (Math.random() - 0.5) * volatility;
    
    // 2. Trend component (uptrend for newer meme token)
    const trendComponent = 0.0000001 * (1 + Math.sin(i / 48) * 0.5);
    
    // 3. Time of day effect (more activity during US trading hours)
    const hour = time.getUTCHours();
    const timeOfDayEffect = (hour >= 13 && hour <= 21) ? 0.00000002 : 0;
    
    // 4. Occasional spikes (whale buys/sells or news events)
    const spikeEvent = Math.random() > 0.995 ? (Math.random() > 0.5 ? 0.00000015 : -0.00000012) : 0;
    
    // Calculate new price with a minimum floor
    price = Math.max(0.00000001, price * (1 + randomChange) + trendComponent + timeOfDayEffect + spikeEvent);
    
    // Add some volume variations
    const volume = Math.floor(10000 + Math.random() * 190000) * (1 + (hour >= 13 && hour <= 21 ? 0.3 : 0));
    
    data.push({
      time: time.getTime(),
      price,
      volume,
      open: price * (1 - Math.random() * 0.01),
      close: price,
      high: price * (1 + Math.random() * 0.015),
      low: price * (1 - Math.random() * 0.02)
    });
  }
  
  return data;
};

// Trading pair options
const tradingPairs = [
  { value: 'LERF_ETH', label: '$LERF/ETH', base: '$LERF', quote: 'ETH', decimals: 18 },
  { value: 'LERF_USDT', label: '$LERF/USDT', base: '$LERF', quote: 'USDT', decimals: 6 },
  { value: 'LERF_USDC', label: '$LERF/USDC', base: '$LERF', quote: 'USDC', decimals: 6 },
  { value: 'LERF_WBTC', label: '$LERF/WBTC', base: '$LERF', quote: 'WBTC', decimals: 8 }
];

// Exchange options
const exchanges = [
  { value: 'uniswap', label: 'Uniswap', logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', fee: '0.3%' },
  { value: 'sushiswap', label: 'SushiSwap', logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', fee: '0.3%' },
  { value: '1inch', label: '1inch', logo: 'https://cryptologos.cc/logos/1inch-1inch-logo.png', fee: '0.1%' },
  { value: 'pancakeswap', label: 'PancakeSwap', logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png', fee: '0.25%' }
];

// Time interval options
const timeIntervals = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1d' },
  { value: '1w', label: '1w' }
];

// Chart types
const chartTypes = [
  { value: 'candles', label: 'Candles' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' }
];

// Indicator options
const indicators = [
  { value: 'ma', label: 'Moving Average' },
  { value: 'rsi', label: 'RSI' },
  { value: 'macd', label: 'MACD' },
  { value: 'volume', label: 'Volume' },
  { value: 'bb', label: 'Bollinger Bands' }
];

const TokenTradingChart: React.FC = () => {
  // Chart state
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [currentPair, setCurrentPair] = useState('LERF_ETH');
  const [currentExchange, setCurrentExchange] = useState('uniswap');
  const [timeInterval, setTimeInterval] = useState('1h');
  const [chartType, setChartType] = useState('candles');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['volume']);
  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState({
    currentPrice: 0,
    high24h: 0,
    low24h: 0,
    change24h: 0,
    volume24h: 0
  });
  
  // Trading state
  const [tradeTab, setTradeTab] = useState('swap');
  const [swapFromToken, setSwapFromToken] = useState('ETH');
  const [swapToToken, setSwapToToken] = useState('$LERF');
  const [swapFromAmount, setSwapFromAmount] = useState('');
  const [swapToAmount, setSwapToAmount] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [leverageEnabled, setLeverageEnabled] = useState(false);
  const [leverage, setLeverage] = useState([1]);
  
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Load historical data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading data
    setTimeout(() => {
      const data = generateHistoricalData();
      setHistoricalData(data);
      
      // Set current price data
      const latest = data[data.length - 1];
      const yesterday = data[data.length - 25]; // 24 hours ago
      
      setPriceData({
        currentPrice: latest.price,
        high24h: Math.max(...data.slice(-24).map(d => d.high)),
        low24h: Math.min(...data.slice(-24).map(d => d.low)),
        change24h: ((latest.price - yesterday.price) / yesterday.price) * 100,
        volume24h: data.slice(-24).reduce((sum, d) => sum + d.volume, 0)
      });
      
      setIsLoading(false);
    }, 1500);
  }, [currentPair, timeInterval]);
  
  // Handle swap input change
  const handleSwapFromAmountChange = (value: string) => {
    setSwapFromAmount(value);
    
    // Calculate 'to' amount based on price
    if (value && !isNaN(parseFloat(value))) {
      const toAmount = swapFromToken === 'SLERF' 
        ? parseFloat(value) / priceData.currentPrice
        : parseFloat(value) * priceData.currentPrice;
      
      setSwapToAmount(toAmount.toFixed(swapToToken === 'SLERF' ? 0 : 6));
    } else {
      setSwapToAmount('');
    }
  };
  
  // Handle swap token switch
  const handleSwitchTokens = () => {
    setSwapFromToken(swapToToken);
    setSwapToToken(swapFromToken);
    setSwapFromAmount(swapToAmount);
    setSwapToAmount(swapFromAmount);
  };
  
  // Execute trade function
  const executeTrade = () => {
    if (tradeTab === 'swap') {
      if (!swapFromAmount || parseFloat(swapFromAmount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount to swap",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate successful swap
      toast({
        title: "Swap Successful",
        description: `Swapped ${swapFromAmount} ${swapFromToken} for ${swapToAmount} ${swapToToken}`,
      });
      
      // Reset form
      setSwapFromAmount('');
      setSwapToAmount('');
    } else {
      if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount to trade",
          variant: "destructive"
        });
        return;
      }
      
      if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
        toast({
          title: "Invalid price",
          description: "Please enter a valid limit price",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate successful trade
      const action = tradeTab === 'buy' ? 'Bought' : 'Sold';
      toast({
        title: `${action} Successfully`,
        description: `${action} ${tradeAmount} SLERF at ${orderType === 'market' ? 'market price' : `${limitPrice} ETH`}${leverageEnabled ? ` with ${leverage[0]}x leverage` : ''}`,
      });
      
      // Reset form
      setTradeAmount('');
      setLimitPrice('');
    }
  };
  
  // Format large numbers
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  // Format price based on value
  const formatPrice = (price: number) => {
    if (price < 0.00001) {
      return price.toFixed(8);
    } else if (price < 0.001) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(2);
    }
  };
  
  // Render price chart
  const renderPriceChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slerf-cyan"></div>
        </div>
      );
    }
    
    return (
      <div className="relative h-[300px] w-full">
        {/* Professional chart implementation */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-slerf-dark-light rounded-lg overflow-hidden">
            <div className="h-full w-full relative">
              {/* Price line */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1E90FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area under the chart */}
                {chartType !== 'candles' && (
                  <path
                    d={`M0,100 ${historicalData.map((d, i) => {
                      const x = (i / historicalData.length) * 100;
                      const normalizedPrice = 100 - ((d.price - 0.0000001) / 0.00002) * 100;
                      return `L${x},${normalizedPrice}`;
                    }).join(' ')} V100 H0 Z`}
                    fill={chartType === 'area' ? 'url(#chart-gradient)' : 'none'}
                    stroke="none"
                  />
                )}
                
                {/* Price line */}
                {chartType !== 'candles' && (
                  <path
                    d={`M0,${100 - ((historicalData[0].price - 0.0000001) / 0.00002) * 100} ${historicalData.map((d, i) => {
                      const x = (i / historicalData.length) * 100;
                      const normalizedPrice = 100 - ((d.price - 0.0000001) / 0.00002) * 100;
                      return `L${x},${normalizedPrice}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#1E90FF"
                    strokeWidth="0.5"
                  />
                )}
                
                {/* Candlesticks */}
                {chartType === 'candles' && historicalData.filter((_, i) => i % 8 === 0).map((d, i) => {
                  const x = (i / (historicalData.length / 8)) * 100;
                  const candleWidth = 0.5;
                  
                  const normalizedOpen = 100 - ((d.open - 0.0000001) / 0.00002) * 100;
                  const normalizedClose = 100 - ((d.close - 0.0000001) / 0.00002) * 100;
                  const normalizedHigh = 100 - ((d.high - 0.0000001) / 0.00002) * 100;
                  const normalizedLow = 100 - ((d.low - 0.0000001) / 0.00002) * 100;
                  
                  const isGreen = d.close >= d.open;
                  
                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={x}
                        y1={normalizedHigh}
                        x2={x}
                        y2={normalizedLow}
                        stroke={isGreen ? "#22c55e" : "#ef4444"}
                        strokeWidth="0.2"
                      />
                      {/* Candle body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={isGreen ? normalizedClose : normalizedOpen}
                        width={candleWidth}
                        height={Math.abs(normalizedClose - normalizedOpen)}
                        fill={isGreen ? "#22c55e" : "#ef4444"}
                      />
                    </g>
                  );
                })}
                
                {/* Volume bars */}
                {selectedIndicators.includes('volume') && historicalData.filter((_, i) => i % 8 === 0).map((d, i) => {
                  const x = (i / (historicalData.length / 8)) * 100;
                  const barWidth = 0.5;
                  
                  const normalizedVolume = (d.volume / 200000) * 20; // Scale to 20% of chart height
                  
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - barWidth / 2}
                      y={100 - normalizedVolume}
                      width={barWidth}
                      height={normalizedVolume}
                      fill={d.close >= d.open ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}
                    />
                  );
                })}
                
                {/* Moving Average */}
                {selectedIndicators.includes('ma') && (
                  <path
                    d={`M0,${100 - ((historicalData.slice(0, 20).reduce((sum, d) => sum + d.price, 0) / 20 - 0.0000001) / 0.00002) * 100} ${historicalData.filter((_, i) => i >= 20).map((d, i) => {
                      const x = ((i + 20) / historicalData.length) * 100;
                      const ma20 = historicalData.slice(i, i + 20).reduce((sum, d) => sum + d.price, 0) / 20;
                      const normalizedMA = 100 - ((ma20 - 0.0000001) / 0.00002) * 100;
                      return `L${x},${normalizedMA}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#FF00FF"
                    strokeWidth="0.5"
                    strokeDasharray="1,1"
                  />
                )}
              </svg>
              
              {/* Price Scale */}
              <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-2">
                <div>0.00002</div>
                <div>0.000015</div>
                <div>0.00001</div>
                <div>0.000005</div>
                <div>0.000001</div>
              </div>
              
              {/* Time Scale */}
              <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-400 px-2">
                <div>30d</div>
                <div>20d</div>
                <div>10d</div>
                <div>Now</div>
              </div>
              
              {/* Current Price Line */}
              <div className="absolute left-0 right-8" style={{ 
                top: `${100 - ((priceData.currentPrice - 0.0000001) / 0.00002) * 100}%`,
                height: '1px',
                background: 'rgba(255, 255, 255, 0.2)',
                zIndex: 10
              }}>
                <div className="absolute -top-3 right-0 bg-slerf-dark text-white px-1 text-xs rounded">
                  {formatPrice(priceData.currentPrice)} {currentPair.split('_')[1]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full glass rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <img src={slerfLogo} alt="SLERF Logo" className="h-10 w-10" />
        <div>
          <h2 className="text-2xl font-space font-bold">$SLERF Trading</h2>
          <p className="text-gray-400">Professional trading for SLERF tokens</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Price Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <img src={slerfLogo} alt="$LERF" className="h-6 w-6" />
                <span className="text-xl font-bold">{tradingPairs.find(p => p.value === currentPair)?.label || '$LERF/ETH'}</span>
                <span className={`text-sm px-2 py-0.5 rounded ${priceData.change24h >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
                </span>
              </div>
              <div className="text-2xl font-bold font-mono">
                {formatPrice(priceData.currentPrice)} <span className="text-gray-400 text-lg">{currentPair.split('_')[1]}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="glass-dark p-2 rounded-lg text-center min-w-[100px]">
                <div className="text-xs text-gray-400">24h High</div>
                <div className="font-medium text-green-500">{formatPrice(priceData.high24h)}</div>
              </div>
              <div className="glass-dark p-2 rounded-lg text-center min-w-[100px]">
                <div className="text-xs text-gray-400">24h Low</div>
                <div className="font-medium text-red-500">{formatPrice(priceData.low24h)}</div>
              </div>
              <div className="glass-dark p-2 rounded-lg text-center min-w-[100px]">
                <div className="text-xs text-gray-400">24h Vol</div>
                <div className="font-medium text-slerf-purple">{formatLargeNumber(priceData.volume24h)}</div>
              </div>
            </div>
          </div>
          
          {/* Chart Controls */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Select value={currentPair} onValueChange={setCurrentPair}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Select Pair" />
                </SelectTrigger>
                <SelectContent>
                  {tradingPairs.map(pair => (
                    <SelectItem key={pair.value} value={pair.value} className="text-xs">
                      {pair.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={currentExchange} onValueChange={setCurrentExchange}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Select Exchange" />
                </SelectTrigger>
                <SelectContent>
                  {exchanges.map(exchange => (
                    <SelectItem key={exchange.value} value={exchange.value} className="text-xs">
                      <div className="flex items-center">
                        <img src={exchange.logo} alt={exchange.label} className="w-4 h-4 mr-1" />
                        {exchange.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="flex bg-slerf-dark rounded-md">
                {timeIntervals.map(interval => (
                  <button
                    key={interval.value}
                    className={`px-2 py-1 text-xs ${timeInterval === interval.value ? 'bg-slerf-cyan text-slerf-dark rounded-md' : 'text-gray-300'}`}
                    onClick={() => setTimeInterval(interval.value)}
                  >
                    {interval.label}
                  </button>
                ))}
              </div>
              
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="text-xs">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Indicators
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 glass-dark p-2">
                  {indicators.map(indicator => (
                    <div key={indicator.value} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        id={`indicator-${indicator.value}`}
                        checked={selectedIndicators.includes(indicator.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIndicators([...selectedIndicators, indicator.value]);
                          } else {
                            setSelectedIndicators(selectedIndicators.filter(i => i !== indicator.value));
                          }
                        }}
                        className="rounded border-gray-500 text-slerf-cyan"
                      />
                      <label htmlFor={`indicator-${indicator.value}`} className="text-xs">
                        {indicator.label}
                      </label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Chart */}
          <div className="glass-dark rounded-lg p-4">
            <div ref={chartRef} className="w-full">
              {renderPriceChart()}
            </div>
          </div>
          
          {/* Order Book & Recent Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-dark rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Order Book</h3>
              <div className="grid grid-cols-3 text-xs text-gray-400 pb-1 border-b border-slerf-dark-lighter">
                <div>Price ({currentPair.split('_')[1]})</div>
                <div className="text-right">Amount (SLERF)</div>
                <div className="text-right">Total</div>
              </div>
              
              {/* Sell Orders */}
              <div className="text-xs space-y-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const price = priceData.currentPrice * (1 + (0.05 * (5 - i)));
                  const amount = Math.floor(10000 + Math.random() * 90000);
                  const total = price * amount;
                  const filledWidth = Math.min(100, amount / 2000);
                  
                  return (
                    <div key={`sell-${i}`} className="grid grid-cols-3 py-0.5 relative">
                      <div className="absolute right-0 bg-red-500/10" style={{ width: `${filledWidth}%`, height: '100%' }}></div>
                      <div className="text-red-500 relative z-10">{formatPrice(price)}</div>
                      <div className="text-right relative z-10">{formatLargeNumber(amount)}</div>
                      <div className="text-right relative z-10">{formatLargeNumber(total)}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Current Price */}
              <div className="text-center text-sm py-1 border-y border-slerf-dark-lighter">
                <span className="font-medium">{formatPrice(priceData.currentPrice)}</span>
              </div>
              
              {/* Buy Orders */}
              <div className="text-xs space-y-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const price = priceData.currentPrice * (1 - (0.05 * (i + 1)));
                  const amount = Math.floor(10000 + Math.random() * 90000);
                  const total = price * amount;
                  const filledWidth = Math.min(100, amount / 2000);
                  
                  return (
                    <div key={`buy-${i}`} className="grid grid-cols-3 py-0.5 relative">
                      <div className="absolute right-0 bg-green-500/10" style={{ width: `${filledWidth}%`, height: '100%' }}></div>
                      <div className="text-green-500 relative z-10">{formatPrice(price)}</div>
                      <div className="text-right relative z-10">{formatLargeNumber(amount)}</div>
                      <div className="text-right relative z-10">{formatLargeNumber(total)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="glass-dark rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Recent Trades</h3>
              <div className="grid grid-cols-4 text-xs text-gray-400 pb-1 border-b border-slerf-dark-lighter">
                <div>Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Total</div>
                <div className="text-right">Time</div>
              </div>
              
              <div className="text-xs space-y-1 mt-2 max-h-[215px] overflow-y-auto">
                {Array.from({ length: 15 }).map((_, i) => {
                  const isBuy = Math.random() > 0.5;
                  const price = priceData.currentPrice * (1 + (isBuy ? 1 : -1) * (Math.random() * 0.02));
                  const amount = Math.floor(1000 + Math.random() * 50000);
                  const total = price * amount;
                  const time = new Date(Date.now() - i * 20000); // 20 second intervals
                  
                  return (
                    <div key={`trade-${i}`} className="grid grid-cols-4 py-0.5">
                      <div className={isBuy ? 'text-green-500' : 'text-red-500'}>
                        {formatPrice(price)}
                      </div>
                      <div className="text-right">{formatLargeNumber(amount)}</div>
                      <div className="text-right">{formatLargeNumber(total)}</div>
                      <div className="text-right">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Trading Section */}
        <div className="glass-dark rounded-lg p-4">
          <Tabs value={tradeTab} onValueChange={setTradeTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="swap" className="text-sm">Swap</TabsTrigger>
              <TabsTrigger value="buy" className="text-sm">Buy</TabsTrigger>
              <TabsTrigger value="sell" className="text-sm">Sell</TabsTrigger>
            </TabsList>
            
            {/* Swap Interface */}
            <TabsContent value="swap" className="space-y-4">
              <div className="glass p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <label className="text-sm">From</label>
                  <span className="text-xs text-gray-400">Balance: 0.235 ETH</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-grow">
                    <Input 
                      value={swapFromAmount} 
                      onChange={(e) => handleSwapFromAmountChange(e.target.value)}
                      className="bg-slerf-dark pr-16" 
                      placeholder="0.0"
                      type="number"
                      min="0"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-slerf-dark-lighter px-2 py-1 rounded">
                      MAX
                    </button>
                  </div>
                  <Select value={swapFromToken} onValueChange={setSwapFromToken}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">
                        <div className="flex items-center">
                          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-4 h-4 mr-1" />
                          ETH
                        </div>
                      </SelectItem>
                      <SelectItem value="SLERF">
                        <div className="flex items-center">
                          <img src={slerfLogo} alt="SLERF" className="w-4 h-4 mr-1" />
                          SLERF
                        </div>
                      </SelectItem>
                      <SelectItem value="USDT">
                        <div className="flex items-center">
                          <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" className="w-4 h-4 mr-1" />
                          USDT
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center -my-2">
                  <button 
                    className="bg-slerf-dark-lighter p-2 rounded-full z-10"
                    onClick={handleSwitchTokens}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </button>
                </div>
                
                <div className="flex justify-between mb-2">
                  <label className="text-sm">To</label>
                  <span className="text-xs text-gray-400">Balance: 1,245,000 SLERF</span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={swapToAmount} 
                    onChange={(e) => setSwapToAmount(e.target.value)}
                    className="bg-slerf-dark" 
                    placeholder="0.0"
                    readOnly
                  />
                  <Select value={swapToToken} onValueChange={setSwapToToken}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">
                        <div className="flex items-center">
                          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-4 h-4 mr-1" />
                          ETH
                        </div>
                      </SelectItem>
                      <SelectItem value="SLERF">
                        <div className="flex items-center">
                          <img src={slerfLogo} alt="SLERF" className="w-4 h-4 mr-1" />
                          SLERF
                        </div>
                      </SelectItem>
                      <SelectItem value="USDT">
                        <div className="flex items-center">
                          <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" className="w-4 h-4 mr-1" />
                          USDT
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm p-2">
                <span className="text-gray-400">Rate</span>
                <span>
                  1 {swapFromToken} = {swapFromToken === 'SLERF' 
                    ? formatPrice(1 / priceData.currentPrice) 
                    : formatLargeNumber(priceData.currentPrice)} {swapToToken}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Slippage Tolerance</span>
                  <div className="text-xs bg-slerf-dark-lighter px-2 py-0.5 rounded">
                    {slippageTolerance}%
                  </div>
                </div>
                <div className="flex gap-1 text-xs">
                  {[0.1, 0.5, 1.0].map(value => (
                    <button
                      key={value}
                      className={`px-2 py-0.5 rounded ${slippageTolerance === value ? 'bg-slerf-cyan text-slerf-dark' : 'bg-slerf-dark'}`}
                      onClick={() => setSlippageTolerance(value)}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum received</span>
                  <span>
                    {swapToAmount && formatLargeNumber(parseFloat(swapToAmount) * (1 - slippageTolerance / 100))} {swapToToken}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exchange fee</span>
                  <span>0.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Route</span>
                  <span className="flex items-center">
                    {swapFromToken} → {swapToToken}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={executeTrade}
                className="w-full bg-slerf-cyan text-slerf-dark"
                disabled={!swapFromAmount || parseFloat(swapFromAmount) <= 0}
              >
                Swap {swapFromToken} for {swapToToken}
              </Button>
            </TabsContent>
            
            {/* Buy Interface */}
            <TabsContent value="buy" className="space-y-4">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Order Type</span>
                </div>
                <div className="flex gap-1 text-xs">
                  {['market', 'limit'].map(type => (
                    <button
                      key={type}
                      className={`px-2 py-0.5 rounded capitalize ${orderType === type ? 'bg-slerf-cyan text-slerf-dark' : 'bg-slerf-dark'}`}
                      onClick={() => setOrderType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Advanced Mode</span>
                </div>
                <Switch
                  checked={isAdvancedMode}
                  onCheckedChange={setIsAdvancedMode}
                />
              </div>
              
              <div className="glass p-4 rounded-lg space-y-4">
                {orderType === 'limit' && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm">Limit Price</label>
                      <span className="text-xs text-gray-400">
                        Market: {formatPrice(priceData.currentPrice)} {currentPair.split('_')[1]}
                      </span>
                    </div>
                    <Input 
                      value={limitPrice} 
                      onChange={(e) => setLimitPrice(e.target.value)}
                      className="bg-slerf-dark" 
                      placeholder={formatPrice(priceData.currentPrice)}
                      type="number"
                      min="0"
                    />
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm">Amount</label>
                    <span className="text-xs text-gray-400">Available: 0.235 ETH</span>
                  </div>
                  <div className="relative">
                    <Input 
                      value={tradeAmount} 
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="bg-slerf-dark pr-16" 
                      placeholder="0.0"
                      type="number"
                      min="0"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                      <button className="text-xs bg-slerf-dark-lighter px-2 py-1 rounded">
                        SLERF
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[25, 50, 75, 100].map(percent => (
                      <button
                        key={percent}
                        className="text-xs bg-slerf-dark px-2 py-1 rounded"
                        onClick={() => setTradeAmount((1000000 * (percent / 100)).toString())}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
                
                {isAdvancedMode && (
                  <div className="pt-2 border-t border-slerf-dark-lighter">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm flex items-center">
                        <span className="mr-2">Leverage</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${leverageEnabled ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slerf-dark text-gray-400'}`}>
                          {leverageEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                      <Switch
                        checked={leverageEnabled}
                        onCheckedChange={setLeverageEnabled}
                      />
                    </div>
                    
                    {leverageEnabled && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{leverage[0]}x</span>
                          <div className="text-xs text-gray-400">Max 10x</div>
                        </div>
                        <Slider
                          value={leverage}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={setLeverage}
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>1x</span>
                          <span>5x</span>
                          <span>10x</span>
                        </div>
                        
                        <div className="glass-dark p-2 rounded-lg text-xs text-yellow-500 mt-2">
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>
                              Trading with leverage increases potential gains but also magnifies potential losses. Use with caution.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2 text-xs px-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Value</span>
                  <span>
                    {tradeAmount ? parseFloat(tradeAmount) * priceData.currentPrice : '0.00'} {currentPair.split('_')[1]}
                  </span>
                </div>
                {leverageEnabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Leverage</span>
                    <span>{leverage[0]}x</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Trading Fee</span>
                  <span>
                    {tradeAmount ? (parseFloat(tradeAmount) * priceData.currentPrice * 0.003).toFixed(6) : '0.00'} {currentPair.split('_')[1]}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={executeTrade}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0))}
              >
                Buy SLERF
              </Button>
            </TabsContent>
            
            {/* Sell Interface */}
            <TabsContent value="sell" className="space-y-4">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Order Type</span>
                </div>
                <div className="flex gap-1 text-xs">
                  {['market', 'limit'].map(type => (
                    <button
                      key={type}
                      className={`px-2 py-0.5 rounded capitalize ${orderType === type ? 'bg-slerf-cyan text-slerf-dark' : 'bg-slerf-dark'}`}
                      onClick={() => setOrderType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="glass p-4 rounded-lg space-y-4">
                {orderType === 'limit' && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm">Limit Price</label>
                      <span className="text-xs text-gray-400">
                        Market: {formatPrice(priceData.currentPrice)} {currentPair.split('_')[1]}
                      </span>
                    </div>
                    <Input 
                      value={limitPrice} 
                      onChange={(e) => setLimitPrice(e.target.value)}
                      className="bg-slerf-dark" 
                      placeholder={formatPrice(priceData.currentPrice)}
                      type="number"
                      min="0"
                    />
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm">Amount</label>
                    <span className="text-xs text-gray-400">Available: 1,245,000 SLERF</span>
                  </div>
                  <div className="relative">
                    <Input 
                      value={tradeAmount} 
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="bg-slerf-dark pr-16" 
                      placeholder="0.0"
                      type="number"
                      min="0"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                      <button className="text-xs bg-slerf-dark-lighter px-2 py-1 rounded">
                        SLERF
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[25, 50, 75, 100].map(percent => (
                      <button
                        key={percent}
                        className="text-xs bg-slerf-dark px-2 py-1 rounded"
                        onClick={() => setTradeAmount((1000000 * (percent / 100)).toString())}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-xs px-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">You Will Receive (Est.)</span>
                  <span>
                    {tradeAmount ? (parseFloat(tradeAmount) * priceData.currentPrice * 0.997).toFixed(6) : '0.00'} {currentPair.split('_')[1]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trading Fee</span>
                  <span>
                    {tradeAmount ? (parseFloat(tradeAmount) * priceData.currentPrice * 0.003).toFixed(6) : '0.00'} {currentPair.split('_')[1]}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={executeTrade}
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0))}
              >
                Sell SLERF
              </Button>
            </TabsContent>
          </Tabs>
          
          {/* Trading History */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Your Trading History</h3>
            <div className="glass-dark p-4 rounded-lg">
              <div className="grid grid-cols-4 text-xs text-gray-400 pb-1 border-b border-slerf-dark-lighter mb-2">
                <div>Type</div>
                <div>Price</div>
                <div>Amount</div>
                <div>Time</div>
              </div>
              
              <div className="min-h-[60px] flex items-center justify-center text-gray-400 text-sm">
                No trading history yet
              </div>
            </div>
          </div>
          
          {/* Trading Tips */}
          <div className="mt-6 glass-dark p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Trading Tips</h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-slerf-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch for volume spikes which often indicate major price movements.</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-slerf-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>SLERF price can be volatile. Use limit orders to buy at your desired price.</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-slerf-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Check the SLERF community channels for announcements before making large trades.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTradingChart;