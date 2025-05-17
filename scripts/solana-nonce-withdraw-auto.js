#!/usr/bin/env node

/**
 * Solana Nonce Withdrawal Automation Tool (Non-Interactive Version)
 * 
 * This script automates the process of withdrawing funds from a Solana nonce account
 * without requiring user interaction, suitable for scheduled tasks and automation.
 * 
 * Usage:
 * node solana-nonce-withdraw-auto.js --nonce <nonce-account> --recipient <recipient-address> --authority <path-to-keypair> --network <network>
 */

import { exec as execCallback } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisify exec
const exec = (command) => new Promise((resolve, reject) => {
  execCallback(command, (error, stdout, stderr) => {
    if (error) reject(error);
    else resolve({ stdout, stderr });
  });
});

// Configuration from command line args
const parseArgs = () => {
  const args = process.argv.slice(2);
  const config = {
    nonceAccount: '',
    recipientAddress: '',
    authorityPath: '',
    network: 'mainnet-beta',
    skipVerification: false,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--nonce':
        config.nonceAccount = args[++i];
        break;
      case '--recipient':
        config.recipientAddress = args[++i];
        break;
      case '--authority':
        config.authorityPath = args[++i];
        break;
      case '--network':
        config.network = args[++i];
        break;
      case '--skip-verification':
        config.skipVerification = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }
  
  // Validate required params
  if (!config.nonceAccount || !config.recipientAddress || !config.authorityPath) {
    console.error('Missing required parameters');
    printHelp();
    process.exit(1);
  }
  
  return config;
};

// Print help information
const printHelp = () => {
  console.log(`
Solana Nonce Withdrawal Automation Tool (Non-Interactive)

Usage:
  node solana-nonce-withdraw-auto.js [options]

Options:
  --nonce <address>       Nonce account address (required)
  --recipient <address>   Recipient address (required)
  --authority <path>      Path to authority keypair file (required)
  --network <network>     Solana network (mainnet-beta, testnet, devnet)
                          Default: mainnet-beta
  --skip-verification     Skip verification checks
  --verbose               Enable verbose logging
  --help                  Show this help message

Example:
  node solana-nonce-withdraw-auto.js \\
    --nonce 2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy \\
    --recipient C8QHPhGa8YGCmDysmHZVpYSLKFa7Gb75kAfQWAGztvJ1 \\
    --authority ./nonce-keypair.json \\
    --network mainnet-beta
  `);
};

// Helper function to execute shell commands
const executeCommand = async (command, config) => {
  try {
    if (config.verbose) {
      console.log(`Executing: ${command}`);
    }
    
    const { stdout, stderr } = await exec(command);
    
    if (stderr && config.verbose) {
      console.warn(`Warning: ${stderr}`);
    }
    
    return stdout;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

// Check if Solana CLI is installed
const checkSolanaCLI = async (config) => {
  try {
    await executeCommand('solana --version', config);
    return true;
  } catch (error) {
    console.error('Solana CLI is not installed or not found in PATH');
    return false;
  }
};

// Check current Solana network configuration
const checkSolanaNetwork = async (config) => {
  try {
    const output = await executeCommand('solana config get', config);
    const networkMatch = output.match(/RPC URL: (https?:\/\/[^\s]+)/);
    if (networkMatch) {
      const url = networkMatch[1];
      if (url.includes('mainnet')) return 'mainnet-beta';
      if (url.includes('testnet')) return 'testnet';
      if (url.includes('devnet')) return 'devnet';
      return 'unknown';
    }
    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
};

// Set Solana network
const setSolanaNetwork = async (network, config) => {
  try {
    let networkUrl;
    switch (network) {
      case 'mainnet-beta':
        networkUrl = 'https://api.mainnet-beta.solana.com';
        break;
      case 'testnet':
        networkUrl = 'https://api.testnet.solana.com';
        break;
      case 'devnet':
        networkUrl = 'https://api.devnet.solana.com';
        break;
      default:
        console.error(`Unknown network: ${network}`);
        return false;
    }
    
    await executeCommand(`solana config set --url ${networkUrl}`, config);
    if (config.verbose) {
      console.log(`Network set to ${network}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to set network to ${network}`);
    return false;
  }
};

// Verify nonce account exists and get its details
const verifyNonceAccount = async (nonceAccount, config) => {
  try {
    const output = await executeCommand(`solana nonce-account ${nonceAccount}`, config);
    
    // Extract balance information from output
    const balanceMatch = output.match(/Balance: ([0-9.]+) SOL/);
    const balance = balanceMatch ? balanceMatch[1] : 'unknown';
    
    // Extract authority information from output
    const authorityMatch = output.match(/Authority: ([1-9A-HJ-NP-Za-km-z]{32,44})/);
    const authority = authorityMatch ? authorityMatch[1] : 'unknown';
    
    if (config.verbose) {
      console.log(`Nonce account verified successfully. Balance: ${balance} SOL, Authority: ${authority}`);
    }
    
    return { valid: true, balance, authority };
  } catch (error) {
    console.error('Failed to verify nonce account');
    return { valid: false };
  }
};

// Verify the authority keypair file exists and is readable
const verifyAuthorityKeypair = (authorityPath, config) => {
  try {
    const resolvedPath = path.resolve(authorityPath);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`Keypair file not found at ${resolvedPath}`);
      return false;
    }
    
    // Try to read the file to make sure it's accessible
    const content = fs.readFileSync(resolvedPath, 'utf8');
    try {
      // Check if it's a valid JSON
      JSON.parse(content);
      if (config.verbose) {
        console.log('Authority keypair verified successfully');
      }
      return true;
    } catch (e) {
      console.error('Keypair file is not valid JSON');
      return false;
    }
  } catch (error) {
    console.error(`Error verifying authority keypair: ${error.message}`);
    return false;
  }
};

// Verify recipient address is valid
const verifyRecipientAddress = async (address, config) => {
  // Basic validation for Solana addresses
  const isValidFormat = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  if (!isValidFormat) {
    console.error('Recipient address has invalid format');
    return false;
  }
  
  if (config.skipVerification) {
    return true;
  }
  
  // Further validation by checking if the address exists on-chain
  try {
    await executeCommand(`solana account ${address}`, config);
    if (config.verbose) {
      console.log('Recipient address verified successfully');
    }
    return true;
  } catch (error) {
    // Note: A non-existing address is still a valid destination in Solana
    if (config.verbose) {
      console.warn('Recipient address does not exist yet. This is acceptable for new accounts.');
    }
    return true;
  }
};

// Perform the nonce withdrawal
const performNonceWithdrawal = async (nonceAccount, recipientAddress, authorityPath, config) => {
  try {
    const output = await executeCommand(
      `solana nonce withdraw ${nonceAccount} ${recipientAddress} --authority ${authorityPath} --json`,
      config
    );
    
    try {
      const result = JSON.parse(output);
      console.log(`Transaction successful! Signature: ${result.signature}`);
      console.log(`Explorer URL: https://explorer.solana.com/tx/${result.signature}`);
      return { success: true, signature: result.signature };
    } catch (e) {
      // If output is not valid JSON, but the command succeeded
      console.log('Transaction successful! Check your Solana wallet for confirmation');
      return { success: true, signature: null };
    }
  } catch (error) {
    console.error('Failed to execute nonce withdrawal');
    if (config.verbose) {
      console.error('Error details:', error);
    }
    return { success: false, error };
  }
};

// Log results to a file
const logResult = (result, config) => {
  try {
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logPath = path.join(logDir, `nonce-withdraw-${timestamp}.log`);
    
    const logData = {
      timestamp: new Date().toISOString(),
      nonceAccount: config.nonceAccount,
      recipientAddress: config.recipientAddress,
      network: config.network,
      success: result.success,
      signature: result.signature,
      error: result.error ? result.error.message : null
    };
    
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
    
    if (config.verbose) {
      console.log(`Log written to ${logPath}`);
    }
  } catch (error) {
    console.warn(`Could not write log: ${error.message}`);
  }
};

// Main function to orchestrate the withdrawal process
const main = async () => {
  // Parse command line arguments
  const config = parseArgs();
  
  if (config.verbose) {
    console.log('===== Solana Nonce Withdrawal Automation Tool (Non-Interactive) =====');
    console.log('Configuration:', JSON.stringify(config, null, 2));
  }
  
  // Check if Solana CLI is installed
  if (!await checkSolanaCLI(config)) {
    process.exit(1);
  }
  
  // Check current network and set if needed
  const currentNetwork = await checkSolanaNetwork(config);
  if (currentNetwork !== config.network) {
    if (config.verbose) {
      console.log(`Switching from ${currentNetwork} to ${config.network}...`);
    }
    if (!await setSolanaNetwork(config.network, config)) {
      process.exit(1);
    }
  }
  
  // Skip verification if requested
  if (!config.skipVerification) {
    if (config.verbose) {
      console.log('Verifying inputs...');
    }
    
    // Verify all inputs
    const nonceAccountStatus = await verifyNonceAccount(config.nonceAccount, config);
    if (!nonceAccountStatus.valid) {
      console.error('Verification failed for nonce account');
      process.exit(1);
    }
    
    if (!verifyAuthorityKeypair(config.authorityPath, config)) {
      console.error('Verification failed for authority keypair');
      process.exit(1);
    }
    
    if (!await verifyRecipientAddress(config.recipientAddress, config)) {
      console.error('Verification failed for recipient address');
      process.exit(1);
    }
    
    if (config.verbose) {
      console.log('\n===== Transaction Summary =====');
      console.log(`Network: ${config.network}`);
      console.log(`Nonce Account: ${config.nonceAccount}`);
      console.log(`Nonce Account Balance: ${nonceAccountStatus.balance || 'unknown'} SOL`);
      console.log(`Recipient Address: ${config.recipientAddress}`);
      console.log(`Authority Keypair: ${config.authorityPath}`);
    }
  }
  
  // Execute the withdrawal
  console.log('Executing nonce withdrawal...');
  const result = await performNonceWithdrawal(
    config.nonceAccount, 
    config.recipientAddress, 
    config.authorityPath,
    config
  );
  
  // Log the result
  logResult(result, config);
  
  if (result.success) {
    console.log('Nonce withdrawal completed successfully');
    process.exit(0);
  } else {
    console.error('Nonce withdrawal failed');
    process.exit(1);
  }
};

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});