import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./useWallet";
import { queryClient } from "@/lib/queryClient";
import { SocialConnection } from "@shared/schema";

export function useSocial() {
  const { wallet } = useWallet();
  const userId = wallet?.address ? 1 : undefined; // In a real app, this would be the actual user ID from the API

  // Fetch user's social connections
  const socialConnectionsQuery = useQuery({
    queryKey: ['/api/users', userId, 'social'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/users/${userId}/social`);
      return res.json();
    },
    enabled: !!userId,
  });

  // Connect social account
  const connectSocial = useMutation({
    mutationFn: async ({ 
      platform, 
      username 
    }: { 
      platform: string; 
      username: string 
    }) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'POST', 
        `/api/users/${userId}/social`,
        { platform, username }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'social'] });
    }
  });

  // Disconnect social account
  const disconnectSocial = useMutation({
    mutationFn: async (connectionId: number) => {
      if (!userId) throw new Error("User not logged in");
      const res = await apiRequest(
        'DELETE', 
        `/api/users/${userId}/social/${connectionId}`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'social'] });
    }
  });

  // Check if user has connected a specific platform
  const isConnected = (platform: string) => {
    if (!socialConnectionsQuery.data) return false;
    
    const connections = socialConnectionsQuery.data as SocialConnection[];
    return connections.some(connection => 
      connection.platform.toLowerCase() === platform.toLowerCase() && 
      connection.connected
    );
  };

  // Get connection ID for a platform
  const getConnectionId = (platform: string) => {
    if (!socialConnectionsQuery.data) return null;
    
    const connections = socialConnectionsQuery.data as SocialConnection[];
    const connection = connections.find(connection => 
      connection.platform.toLowerCase() === platform.toLowerCase() && 
      connection.connected
    );
    
    return connection ? connection.id : null;
  };

  return {
    socialConnections: socialConnectionsQuery.data as SocialConnection[] || [],
    isSocialConnectionsLoading: socialConnectionsQuery.isLoading,
    connectSocial,
    disconnectSocial,
    isConnected,
    getConnectionId,
  };
}
