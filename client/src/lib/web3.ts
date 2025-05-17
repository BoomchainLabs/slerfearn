import { ethers } from "ethers";
import { apiRequest } from "./queryClient";

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletInfo {
  address: string;
  shortAddress: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  balance: string;
}

export const SLERF_TOKEN_ADDRESS = "0x233df63325933fa3f2dac8e695cd84bb2f91ab07";

export const SLERF_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

export async function connectWallet(): Promise<WalletInfo | null> {
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet found. Please install MetaMask.");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const address = accounts[0];
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    // Get ETH balance
    const balance = ethers.formatEther(await provider.getBalance(address));
    
    // Register or get user from API
    try {
      await apiRequest("POST", "/api/users", { 
        username: address, 
        password: "eth_" + address, // Just a placeholder since auth is wallet-based
        walletAddress: address 
      });
    } catch (error) {
      // User likely already exists, try to fetch
      await apiRequest("GET", `/api/users/wallet/${address}`);
    }
    
    return {
      address,
      shortAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      provider,
      signer,
      chainId,
      balance
    };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}

export async function getSlerfBalance(address: string, provider: ethers.BrowserProvider): Promise<string> {
  try {
    const tokenContract = new ethers.Contract(SLERF_TOKEN_ADDRESS, SLERF_TOKEN_ABI, provider);
    const balance = await tokenContract.balanceOf(address);
    return ethers.formatUnits(balance, 18); // Assuming 18 decimals for $SLERF
  } catch (error) {
    console.error("Error getting SLERF balance:", error);
    return "0";
  }
}

export async function sendTransaction(
  signer: ethers.JsonRpcSigner,
  to: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseEther(amount)
  });
  return tx;
}

export async function approveTokens(
  signer: ethers.JsonRpcSigner,
  spender: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  const tokenContract = new ethers.Contract(SLERF_TOKEN_ADDRESS, SLERF_TOKEN_ABI, signer);
  const tx = await tokenContract.approve(spender, ethers.parseUnits(amount, 18));
  return tx;
}

export async function transferTokens(
  signer: ethers.JsonRpcSigner,
  to: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  const tokenContract = new ethers.Contract(SLERF_TOKEN_ADDRESS, SLERF_TOKEN_ABI, signer);
  const tx = await tokenContract.transfer(to, ethers.parseUnits(amount, 18));
  return tx;
}
