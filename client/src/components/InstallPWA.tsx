import React, { useState, useEffect } from 'react';
import { X, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallProps> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already running as PWA
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone ||
             document.referrer.includes('android-app://');
    };

    // Check if iOS
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent);
    };

    // Check if already installed
    const checkInstalled = () => {
      return localStorage.getItem('pwa-installed') === 'true';
    };

    setIsStandalone(checkStandalone());
    setIsIOS(checkIOS());
    setIsInstalled(checkInstalled());

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt if not already installed and not in standalone mode
      if (!checkInstalled() && !checkStandalone()) {
        setShowInstallPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Auto-show prompt after 30 seconds if conditions are met
    const timer = setTimeout(() => {
      if (!checkInstalled() && !checkStandalone() && !isIOS) {
        setShowInstallPrompt(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-dismissed', Date.now().toString());
      }
      
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  // Don't show if already installed or in standalone mode
  if (isInstalled || isStandalone) {
    return null;
  }

  // Special handling for iOS
  if (isIOS && showInstallPrompt) {
    return (
      <div className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}>
        <div className="bg-gradient-to-r from-slerf-orange to-orange-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Plus className="w-5 h-5 mr-2" />
                <h3 className="font-semibold text-sm">Install SlerfHub</h3>
              </div>
              <p className="text-xs mb-3 opacity-90">
                Add SlerfHub to your home screen for quick access and app-like experience
              </p>
              <div className="text-xs space-y-1 opacity-80">
                <p>1. Tap the share button <span className="font-mono">↗</span></p>
                <p>2. Select "Add to Home Screen"</p>
                <p>3. Tap "Add" to install</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop install prompt
  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}>
        <div className="bg-gradient-to-r from-slerf-orange to-orange-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Download className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Install SlerfHub</h3>
              </div>
              <p className="text-sm opacity-90">
                Get the full app experience with offline access and notifications
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-white text-slerf-orange hover:bg-gray-100"
              >
                Install
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Smaller floating install button for persistent access
export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallable = () => {
      const installed = localStorage.getItem('pwa-installed') === 'true';
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(installed || standalone);
      setCanInstall(!installed && !standalone);
    };

    checkInstallable();

    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = () => {
    const event = new CustomEvent('pwa-install-requested');
    window.dispatchEvent(event);
  };

  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      size="sm"
      className={`fixed bottom-20 right-4 z-40 bg-slerf-orange hover:bg-orange-600 text-white shadow-lg ${className}`}
    >
      <Download className="w-4 h-4 mr-1" />
      Install
    </Button>
  );
};

export default PWAInstallPrompt;