import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Analytics from "@/pages/Analytics";
import Documentation from "@/pages/Documentation";
import TokenCreator from "@/pages/TokenCreator";
import TokenRewards from "@/pages/TokenRewards";
import Trivia from "@/pages/Trivia";
import ApiDocs from "@/pages/ApiDocs";
import NotFound from "@/pages/not-found";
import { WalletProvider } from "./hooks/useWallet.tsx";
import Navbar from "./components/Navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TokenRewards}/>
      <Route path="/trivia" component={Trivia}/>
      <Route path="/analytics" component={Analytics}/>
      <Route path="/docs" component={Documentation}/>
      <Route path="/token-creator" component={TokenCreator}/>
      <Route path="/api-docs" component={ApiDocs}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-b from-[hsl(230,25%,5%)] to-[hsl(230,25%,3%)] bg-[radial-gradient(circle_at_100%_0%,rgba(0,195,255,0.15)_0%,transparent_30%),radial-gradient(circle_at_0%_100%,rgba(149,59,255,0.15)_0%,transparent_30%)]">
            <Toaster />
            <Navbar />
            <main className="container mx-auto px-4 py-8 pb-16">
              <Router />
            </main>
          </div>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
