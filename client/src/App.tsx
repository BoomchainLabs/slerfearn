import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Games from "@/pages/Games";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/not-found";
import { WalletProvider } from "./hooks/useWallet.tsx";
import { PWAInstallPrompt, PWAInstallButton } from "@/components/InstallPWA";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/games" component={Games}/>
      <Route path="/docs" component={Documentation}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <div className="min-h-screen bg-slerf-dark bg-[radial-gradient(circle_at_100%_0%,rgba(255,107,42,0.15)_0%,transparent_25%),radial-gradient(circle_at_0%_100%,rgba(155,81,224,0.15)_0%,transparent_25%)]">
            <Toaster />
            <PWAInstallPrompt />
            <PWAInstallButton />
            <Router />
          </div>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
