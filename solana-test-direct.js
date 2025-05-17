import { Connection } from '@solana/web3.js';

const RPC_URL = 'https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/QN_0b061e7797d84143b06db1a22ec55672/';

async function testSolanaConnection() {
  try {
    console.log("Testing Solana connection with URL:", RPC_URL);
    
    const connection = new Connection(RPC_URL, "confirmed");
    
    // Get current slot to verify connection
    const currentSlot = await connection.getSlot();
    console.log("✅ Connection successful!");
    console.log("Current Solana Slot:", currentSlot);
    
    // Get recent block height
    const blockHeight = await connection.getBlockHeight();
    console.log("Current Block Height:", blockHeight);
    
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

testSolanaConnection();