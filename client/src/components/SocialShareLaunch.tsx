import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Send, 
  Copy, 
  Globe, 
  MessageCircle, 
  Smartphone 
} from 'lucide-react';

interface SocialShareLaunchProps {
  tokenName?: string;
  tokenSymbol?: string;
  launchDate?: string;
  customMessage?: string;
}

const SocialShareLaunch: React.FC<SocialShareLaunchProps> = ({
  tokenName = "$LERF",
  tokenSymbol = "LERF",
  launchDate = "May 30, 2025",
  customMessage = ""
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('twitter');
  const [message, setMessage] = useState(
    customMessage || 
    `Exciting news! ${tokenName} (${tokenSymbol}) is launching on ${launchDate}. Join us for this fair launch and be part of our growing ecosystem! #${tokenSymbol} #TokenLaunch #Crypto`
  );
  
  const [shareUrl, setShareUrl] = useState('https://lerfhub.xyz/launch');
  
  // Generate URLs for different platforms
  const generateTwitterUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
  };
  
  const generateFacebookUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
  };
  
  const generateLinkedInUrl = () => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(message)}`;
  };
  
  const generateTelegramUrl = () => {
    return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
  };
  
  // Handle message changes
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  // Handle URL changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShareUrl(e.target.value);
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Your message has been copied and is ready to share.",
    });
  };
  
  // Open share URL
  const openShareUrl = (url: string) => {
    window.open(url, '_blank');
    
    toast({
      title: "Opening share window",
      description: "The share window should open in a new tab.",
    });
  };
  
  // Generate shareable image (placeholder for actual implementation)
  const generateShareableImage = () => {
    toast({
      title: "Generating shareable image",
      description: "Your custom launch image is being generated.",
    });
    
    // In a real implementation, this would generate an actual image
    setTimeout(() => {
      toast({
        title: "Image generated",
        description: "Your shareable launch image is ready to download.",
      });
    }, 2000);
  };
  
  // Format for different platforms
  const formatForPlatform = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return message.length > 280 ? message.substring(0, 277) + '...' : message;
      case 'linkedin':
        return `${message}\n\nLearn more: ${shareUrl}`;
      case 'telegram':
        return `${message}\n\n${shareUrl}`;
      default:
        return message;
    }
  };
  
  return (
    <Card className="w-full bg-slerf-dark-light border-slerf-dark-lighter">
      <CardHeader>
        <CardTitle>Share Your Token Launch</CardTitle>
        <CardDescription>
          Promote your ${tokenSymbol} launch across platforms to maximize visibility
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shareMessage">Share Message</Label>
          <Textarea
            id="shareMessage"
            value={message}
            onChange={handleMessageChange}
            className="bg-slerf-dark border-slerf-dark-lighter min-h-[100px]"
            placeholder="Enter your launch announcement message..."
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Include launch details, key features, and call-to-action</span>
            <span>{message.length} characters</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="shareUrl">Launch URL</Label>
          <Input
            id="shareUrl"
            value={shareUrl}
            onChange={handleUrlChange}
            className="bg-slerf-dark border-slerf-dark-lighter"
            placeholder="https://your-launch-url.com"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="twitter" className="flex items-center gap-1">
              <Twitter size={16} />
              <span className="hidden sm:inline">Twitter</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-1">
              <Facebook size={16} />
              <span className="hidden sm:inline">Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1">
              <Linkedin size={16} />
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="telegram" className="flex items-center gap-1">
              <Send size={16} />
              <span className="hidden sm:inline">Telegram</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Platform-specific content */}
          <TabsContent value="twitter" className="space-y-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Twitter size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold">${tokenSymbol} Official</span>
                    <span className="text-gray-400 text-sm ml-2">@{tokenSymbol.toLowerCase()}_token</span>
                  </div>
                  <p className="text-sm mt-1">{formatForPlatform('twitter')}</p>
                  <div className="mt-2 rounded-lg overflow-hidden bg-slerf-dark">
                    <div className="h-32 bg-gradient-to-r from-slerf-cyan/30 to-slerf-purple/30 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">{tokenName} Launch</div>
                        <div className="text-sm">{launchDate}</div>
                      </div>
                    </div>
                    <div className="p-2 text-xs truncate">{shareUrl}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => openShareUrl(generateTwitterUrl())} 
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(formatForPlatform('twitter'))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="facebook" className="space-y-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                  <Facebook size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold">${tokenSymbol} Official</span>
                  </div>
                  <p className="text-sm mt-1">{message}</p>
                  <div className="mt-2 rounded-lg overflow-hidden bg-slerf-dark">
                    <div className="h-32 bg-gradient-to-r from-slerf-cyan/30 to-slerf-purple/30 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">{tokenName} Launch</div>
                        <div className="text-sm">{launchDate}</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium truncate">{tokenName} Official Launch</div>
                      <div className="text-xs text-gray-400 truncate">{shareUrl}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => openShareUrl(generateFacebookUrl())} 
                className="flex-1 bg-blue-700 hover:bg-blue-800"
              >
                <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(message)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="linkedin" className="space-y-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Linkedin size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold">${tokenSymbol} Official</span>
                    <span className="text-gray-400 text-sm ml-2">Blockchain Company</span>
                  </div>
                  <p className="text-sm mt-1">{formatForPlatform('linkedin')}</p>
                  <div className="mt-2 rounded-lg overflow-hidden bg-slerf-dark">
                    <div className="h-32 bg-gradient-to-r from-slerf-cyan/30 to-slerf-purple/30 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">{tokenName} Launch</div>
                        <div className="text-sm">{launchDate}</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium truncate">{tokenName} - Official Token Launch Event</div>
                      <div className="text-xs text-gray-400 truncate">{shareUrl}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => openShareUrl(generateLinkedInUrl())} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(formatForPlatform('linkedin'))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="telegram" className="space-y-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                  <Send size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold">${tokenSymbol} Official Channel</span>
                  </div>
                  <p className="text-sm mt-1">{formatForPlatform('telegram')}</p>
                  <div className="mt-2 rounded-lg overflow-hidden bg-slerf-dark">
                    <div className="h-32 bg-gradient-to-r from-slerf-cyan/30 to-slerf-purple/30 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">{tokenName} Launch</div>
                        <div className="text-sm">{launchDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => openShareUrl(generateTelegramUrl())} 
                className="flex-1 bg-blue-400 hover:bg-blue-500"
              >
                <Send className="mr-2 h-4 w-4" /> Share on Telegram
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(formatForPlatform('telegram'))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex items-center justify-center"
            onClick={() => copyToClipboard(shareUrl)}
          >
            <Globe className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Copy URL</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message + '\n\n' + shareUrl)}`, '_blank')}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center"
            onClick={generateShareableImage}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Image</span>
          </Button>
        </div>
        
        <div className="text-xs text-center text-gray-400">
          Pro tip: Sharing your launch across multiple platforms increases visibility by up to 4x.
          <br />
          Recommended by Sylvestre Villalba and the $LERF team.
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialShareLaunch;