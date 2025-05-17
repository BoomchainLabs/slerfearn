import * as dotenv from 'dotenv';
import { Connection } from '@solana/web3.js';
import * as fs from 'fs';

dotenv.config();

// Test Solana connection
async function testConnection() {
  try {
    console.log("Testing Solana connection with provided RPC URL...");
    
    const connection = new Connection(
      process.env.SOLANA_RPC_URL,
      "confirmed"
    );

    // Get current slot to verify connection
    const currentSlot = await connection.getSlot();
    console.log("✅ Connection successful!");
    console.log("Current Solana Slot:", currentSlot);
    
    // Get recent block height
    const blockHeight = await connection.getBlockHeight();
    console.log("Current Block Height:", blockHeight);
    
    // Get recent performance samples
    const perfSamples = await connection.getRecentPerformanceSamples(1);
    if (perfSamples.length > 0) {
      console.log("Recent TPS:", perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    return false;
  }
}

// Create a .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', `SOLANA_RPC_URL=https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/QN_0b061e7797d84143b06db1a22ec55672/\n`);
  console.log("Created .env file with SOLANA_RPC_URL");
}

// Run the test
try {
  const success = await testConnection();
  if (!success) {
    console.log("Please verify your SOLANA_RPC_URL in the .env file");
  }
} catch (err) {
  console.error("Error running test:", err);
}