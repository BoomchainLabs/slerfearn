// SLERF Token Contract Interaction Layer
import { readContract, writeContract, waitForTransactionReceipt } from 'viem/actions';
import { parseUnits, formatUnits } from 'viem';
import { publicClient, createWalletConnection } from './provider';
import { SLERF_CONTRACT_ADDRESS, SLERF_ABI, formatSLERF, parseSLERF } from '../contracts/slerf';

export interface SLERFBalance {
  formatted: string;
  raw: bigint;
  decimals: number;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

class SLERFContract {
  private contractAddress = SLERF_CONTRACT_ADDRESS;
  private abi = SLERF_ABI;

  // Read token balance
  async getBalance(address: string): Promise<SLERFBalance> {
    try {
      const balance = await readContract(publicClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });

      const decimals = await this.getDecimals();
      
      return {
        raw: balance as bigint,
        formatted: formatSLERF(balance as bigint, decimals),
        decimals,
      };
    } catch (error) {
      console.error('Error getting SLERF balance:', error);
      return {
        raw: 0n,
        formatted: '0',
        decimals: 18,
      };
    }
  }

  // Get token decimals
  async getDecimals(): Promise<number> {
    try {
      const decimals = await readContract(publicClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'decimals',
      });
      return Number(decimals);
    } catch (error) {
      console.error('Error getting decimals:', error);
      return 18; // Default ERC-20 decimals
    }
  }

  // Get token symbol
  async getSymbol(): Promise<string> {
    try {
      const symbol = await readContract(publicClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'symbol',
      });
      return symbol as string;
    } catch (error) {
      console.error('Error getting symbol:', error);
      return 'SLERF';
    }
  }

  // Get total supply
  async getTotalSupply(): Promise<SLERFBalance> {
    try {
      const supply = await readContract(publicClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'totalSupply',
      });

      const decimals = await this.getDecimals();
      
      return {
        raw: supply as bigint,
        formatted: formatSLERF(supply as bigint, decimals),
        decimals,
      };
    } catch (error) {
      console.error('Error getting total supply:', error);
      return {
        raw: 0n,
        formatted: '0',
        decimals: 18,
      };
    }
  }

  // Transfer tokens
  async transfer(to: string, amount: string): Promise<TransactionResult> {
    try {
      const walletClient = createWalletConnection();
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const accounts = await walletClient.getAddresses();
      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet accounts available');
      }

      const decimals = await this.getDecimals();
      const parsedAmount = parseUnits(amount, decimals);

      const hash = await writeContract(walletClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'transfer',
        args: [to as `0x${string}`, parsedAmount],
        account: accounts[0],
      });

      // Wait for transaction confirmation
      await waitForTransactionReceipt(publicClient, { hash });

      return {
        hash,
        success: true,
      };
    } catch (error: any) {
      console.error('Transfer failed:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Transfer failed',
      };
    }
  }

  // Approve spending
  async approve(spender: string, amount: string): Promise<TransactionResult> {
    try {
      const walletClient = createWalletConnection();
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const accounts = await walletClient.getAddresses();
      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet accounts available');
      }

      const decimals = await this.getDecimals();
      const parsedAmount = parseUnits(amount, decimals);

      const hash = await writeContract(walletClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'approve',
        args: [spender as `0x${string}`, parsedAmount],
        account: accounts[0],
      });

      await waitForTransactionReceipt(publicClient, { hash });

      return {
        hash,
        success: true,
      };
    } catch (error: any) {
      console.error('Approval failed:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Approval failed',
      };
    }
  }

  // Get allowance
  async getAllowance(owner: string, spender: string): Promise<SLERFBalance> {
    try {
      const allowance = await readContract(publicClient, {
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'allowance',
        args: [owner as `0x${string}`, spender as `0x${string}`],
      });

      const decimals = await this.getDecimals();
      
      return {
        raw: allowance as bigint,
        formatted: formatSLERF(allowance as bigint, decimals),
        decimals,
      };
    } catch (error) {
      console.error('Error getting allowance:', error);
      return {
        raw: 0n,
        formatted: '0',
        decimals: 18,
      };
    }
  }
}

// Export singleton instance
export const slerfContract = new SLERFContract();
export default slerfContract;