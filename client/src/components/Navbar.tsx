import React from "react";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiGitbook } from "react-icons/si";
import { BookOpen, Code, Coins, Gamepad2, Home } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

const Navbar = () => {
  const [location] = useLocation();
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="sticky top-0 z-10 border-b border-slerf-dark-lighter bg-slerf-dark/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          {/* Logo and Brand */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                $LERF Hub
              </span>
            </div>
          </Link>

          {/* Main Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location === "/"
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/70"
                    )}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/games">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location === "/games"
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/70"
                    )}
                  >
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Games
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Documentation
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[220px] p-2">
                    <Link href="/docs">
                      <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <div className="text-sm font-medium">User Docs</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Usage guides and tutorials
                        </p>
                      </div>
                    </Link>
                    <Link href="/api-docs">
                      <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          <div className="text-sm font-medium">API Docs</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Developer API reference
                        </p>
                      </div>
                    </Link>
                    <a 
                      href="https://gitbook.com/boomchainlab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center">
                        <SiGitbook className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium">GitBook</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Full documentation on GitBook
                      </p>
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/token-creator">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location === "/token-creator"
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/70"
                    )}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    Token Creator
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Wallet Connect Button */}
        <div>
          {wallet?.isConnected ? (
            <Button 
              variant="outline" 
              className="bg-slerf-dark-lighter hover:bg-slerf-dark-lighter/80"
              onClick={disconnectWallet}
            >
              {wallet.address?.substring(0, 6)}...{wallet.address?.substring(38)}
            </Button>
          ) : (
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => connectWallet()}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;