#!/usr/bin/env node

/**
 * Solana Nonce Withdrawal Automation Tool
 * 
 * This script automates the process of withdrawing funds from a Solana nonce account.
 * It handles authentication, transaction creation, and submission to the network.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const DEFAULT_CONFIG = {
  nonceAccount: '',
  recipientAddress: '',
  authorityPath: './nonce-keypair.json',
  network: 'mainnet-beta' // Can be 'mainnet-beta', 'testnet', or 'devnet'
};

// Helper function to prompt for input with default values
const prompt = (question, defaultValue) => {
  return new Promise((resolve) => {
    rl.question(`${question} (${defaultValue}): `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
};

// Helper function to execute shell commands
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(command)) {
      reject(new Error('Command must be an array for security reasons'));
      return;
    }
    
    // Safe execution with array of arguments
    const cmd = command[0];
    const args = command.slice(1);
    console.log(`Executing: ${cmd} ${args.join(' ')}`);
    
    const childProcess = require('child_process').spawn(cmd, args);
    let stdout = '';
    let stderr = '';
    
    childProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    childProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Error: Process exited with code ${code}`);
        console.warn(`Warning: ${stderr}`);
        reject(new Error(stderr || `Process exited with code ${code}`));
        return;
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

// Check if Solana CLI is installed
const checkSolanaCLI = async () => {
  try {
    await executeCommand(['solana', '--version']);
    return true;
  } catch (error) {
    console.error('Solana CLI is not installed or not found in PATH');
    console.log('Please install Solana CLI: https://docs.solanalabs.com/cli/install');
    return false;
  }
};

// Check current Solana network configuration
const checkSolanaNetwork = async () => {
  try {
    const output = await executeCommand(['solana', 'config', 'get']);
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
const setSolanaNetwork = async (network) => {
  try {
    await executeCommand(['solana', 'config', 'set', '--url', network]);
    console.log(`Network set to ${network}`);
    return true;
  } catch (error) {
    console.error(`Failed to set network to ${network}`);
    return false;
  }
};

// Verify nonce account exists and get its details
const verifyNonceAccount = async (nonceAccount) => {
  try {
    const output = await executeCommand(['solana', 'nonce-account', nonceAccount]);
    console.log('Nonce account verified successfully');
    
    // Extract balance information from output
    const balanceMatch = output.match(/Balance: ([0-9.]+) SOL/);
    const balance = balanceMatch ? balanceMatch[1] : 'unknown';
    
    // Extract authority information from output
    const authorityMatch = output.match(/Authority: ([1-9A-HJ-NP-Za-km-z]{32,44})/);
    const authority = authorityMatch ? authorityMatch[1] : 'unknown';
    
    return { valid: true, balance, authority };
  } catch (error) {
    console.error('Failed to verify nonce account');
    return { valid: false };
  }
};

// Verify the authority keypair file exists and is readable
const verifyAuthorityKeypair = (authorityPath) => {
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
      console.log('Authority keypair verified successfully');
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
const verifyRecipientAddress = async (address) => {
  // Basic validation for Solana addresses
  const isValidFormat = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  if (!isValidFormat) {
    console.error('Recipient address has invalid format');
    return false;
  }
  
  // Further validation by checking if the address exists on-chain
  try {
    await executeCommand(['solana', 'account', address]);
    console.log('Recipient address verified successfully');
    return true;
  } catch (error) {
    // Note: A non-existing address is still a valid destination in Solana
    console.warn('Recipient address does not exist yet. This is acceptable for new accounts.');
    return true;
  }
};

// Perform the nonce withdrawal
const performNonceWithdrawal = async (nonceAccount, recipientAddress, authorityPath) => {
  try {
    const output = await executeCommand([
      'solana', 
      'nonce', 
      'withdraw', 
      nonceAccount, 
      recipientAddress, 
      '--authority', 
      authorityPath, 
      '--json'
    ]);
    
    try {
      const result = JSON.parse(output);
      console.log('\nTransaction successful! 🎉');
      console.log(`Transaction Signature: ${result.signature}`);
      console.log(`Explorer URL: https://explorer.solana.com/tx/${result.signature}`);
      return true;
    } catch (e) {
      // If output is not valid JSON, but the command succeeded
      console.log('\nTransaction successful! 🎉');
      console.log('Transaction details: Check your Solana wallet for confirmation');
      return true;
    }
  } catch (error) {
    console.error('Failed to execute nonce withdrawal');
    console.error('Error details:', error);
    return false;
  }
};

// Save config for future use
const saveConfig = (config) => {
  try {
    const configDir = path.join(__dirname, '.config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    const configPath = path.join(configDir, 'nonce-withdraw-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Configuration saved to ${configPath}`);
  } catch (error) {
    console.warn(`Could not save configuration: ${error.message}`);
  }
};

// Load saved config if available
const loadConfig = () => {
  try {
    const configPath = path.join(__dirname, '.config', 'nonce-withdraw-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { ...DEFAULT_CONFIG, ...config };
    }
  } catch (error) {
    console.warn(`Could not load configuration: ${error.message}`);
  }
  return DEFAULT_CONFIG;
};

// Main function to orchestrate the withdrawal process
const main = async () => {
  console.log('===== Solana Nonce Withdrawal Automation Tool =====\n');
  
  // Check if Solana CLI is installed
  if (!await checkSolanaCLI()) {
    rl.close();
    return;
  }
  
  // Load saved configuration
  const savedConfig = loadConfig();
  
  // Prompt for required information
  console.log('Please provide the following information:');
  const nonceAccount = await prompt('Nonce account address', savedConfig.nonceAccount);
  const recipientAddress = await prompt('Recipient address', savedConfig.recipientAddress);
  const authorityPath = await prompt('Path to authority keypair file', savedConfig.authorityPath);
  
  // Network configuration
  const currentNetwork = await checkSolanaNetwork();
  console.log(`Current Solana network: ${currentNetwork}`);
  
  const networkOptions = {
    '1': 'mainnet-beta',
    '2': 'testnet',
    '3': 'devnet'
  };
  
  console.log('\nSelect network:');
  console.log('1. Mainnet (mainnet-beta)');
  console.log('2. Testnet');
  console.log('3. Devnet');
  
  const networkChoice = await prompt('Choose network (1-3)', '1');
  const selectedNetwork = networkOptions[networkChoice] || 'mainnet-beta';
  
  // Update config
  const config = {
    nonceAccount,
    recipientAddress,
    authorityPath,
    network: selectedNetwork
  };
  
  // Save the configuration for future use
  saveConfig(config);
  
  // Set the correct network if needed
  if (currentNetwork !== selectedNetwork) {
    console.log(`\nSwitching from ${currentNetwork} to ${selectedNetwork}...`);
    if (!await setSolanaNetwork(selectedNetwork)) {
      rl.close();
      return;
    }
  }
  
  console.log('\nVerifying inputs...');
  
  // Verify all inputs
  const nonceAccountStatus = await verifyNonceAccount(nonceAccount);
  if (!nonceAccountStatus.valid) {
    console.error('Verification failed for nonce account');
    rl.close();
    return;
  }
  
  if (!verifyAuthorityKeypair(authorityPath)) {
    console.error('Verification failed for authority keypair');
    rl.close();
    return;
  }
  
  if (!await verifyRecipientAddress(recipientAddress)) {
    console.error('Verification failed for recipient address');
    rl.close();
    return;
  }
  
  // Show summary before execution
  console.log('\n===== Transaction Summary =====');
  console.log(`Network: ${selectedNetwork}`);
  console.log(`Nonce Account: ${nonceAccount}`);
  console.log(`Nonce Account Balance: ${nonceAccountStatus.balance || 'unknown'} SOL`);
  console.log(`Recipient Address: ${recipientAddress}`);
  console.log(`Authority Keypair: ${authorityPath}`);
  
  // Final confirmation
  const confirmation = await prompt('\nProceed with withdrawal? (yes/no)', 'no');
  if (confirmation.toLowerCase() !== 'yes') {
    console.log('Operation cancelled by user');
    rl.close();
    return;
  }
  
  console.log('\nExecuting nonce withdrawal...');
  const success = await performNonceWithdrawal(nonceAccount, recipientAddress, authorityPath);
  
  if (success) {
    console.log('\nNonce withdrawal completed successfully');
  } else {
    console.error('\nNonce withdrawal failed');
  }
  
  rl.close();
};

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  rl.close();
});