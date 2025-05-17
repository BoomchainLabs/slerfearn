#!/bin/bash

# Run Solana Nonce Withdrawal
# Simple script to withdraw funds from a Solana nonce account

# Default values
NONCE_ACCOUNT="2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy"
RECIPIENT="C8QHPhGa8YGCmDysmHZVpYSLKFa7Gb75kAfQWAGztvJ1"
AUTHORITY_PATH="./nonce-keypair.json"
NETWORK="mainnet-beta"
VERBOSE=0
LOG_DIR="./logs"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --nonce)
      NONCE_ACCOUNT="$2"
      shift 2
      ;;
    --recipient)
      RECIPIENT="$2"
      shift 2
      ;;
    --authority)
      AUTHORITY_PATH="$2"
      shift 2
      ;;
    --network)
      NETWORK="$2"
      shift 2
      ;;
    --verbose)
      VERBOSE=1
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --nonce ACCOUNT      Nonce account address"
      echo "  --recipient ADDRESS  Recipient address"
      echo "  --authority PATH     Path to authority keypair file"
      echo "  --network NETWORK    Solana network (mainnet-beta, testnet, devnet)"
      echo "  --verbose            Enable verbose output"
      echo "  --help               Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "Error: Solana CLI could not be found"
    echo "Please install it from https://docs.solanalabs.com/cli/install"
    exit 1
fi

# Create log directory if it doesn't exist
if [ ! -d "$LOG_DIR" ]; then
    mkdir -p "$LOG_DIR"
fi

# Set network
if [ "$NETWORK" = "mainnet-beta" ]; then
    NETWORK_URL="https://api.mainnet-beta.solana.com"
elif [ "$NETWORK" = "testnet" ]; then
    NETWORK_URL="https://api.testnet.solana.com"
elif [ "$NETWORK" = "devnet" ]; then
    NETWORK_URL="https://api.devnet.solana.com"
else
    echo "Error: Unknown network $NETWORK"
    exit 1
fi

# Set network
echo "Setting Solana network to $NETWORK..."
solana config set --url $NETWORK_URL

# Execute the withdrawal
echo "Executing Solana nonce withdrawal..."
echo "Nonce Account: $NONCE_ACCOUNT"
echo "Recipient: $RECIPIENT"
echo "Authority: $AUTHORITY_PATH"
echo "Network: $NETWORK"

# Get timestamp for logging
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="$LOG_DIR/nonce_withdraw_$TIMESTAMP.log"

# Run the command and log output
{
    echo "=== Solana Nonce Withdrawal Log ==="
    echo "Timestamp: $(date)"
    echo "Nonce Account: $NONCE_ACCOUNT"
    echo "Recipient: $RECIPIENT"
    echo "Authority: $AUTHORITY_PATH"
    echo "Network: $NETWORK"
    echo "==================================="
    echo ""
    echo "Command Output:"
    
    # Run the actual command
    solana nonce withdraw "$NONCE_ACCOUNT" "$RECIPIENT" --authority "$AUTHORITY_PATH"
    RESULT=$?
    
    echo ""
    if [ $RESULT -eq 0 ]; then
        echo "Status: SUCCESS"
    else
        echo "Status: FAILED"
    fi
    echo "Exit Code: $RESULT"
    echo "==================================="
} | tee -a "$LOG_FILE"

# Check the result
if [ $RESULT -eq 0 ]; then
    echo "Nonce withdrawal completed successfully!"
    echo "Log saved to: $LOG_FILE"
    exit 0
else
    echo "Nonce withdrawal failed!"
    echo "Log saved to: $LOG_FILE"
    exit 1
fi