#!/bin/bash

# Run Solana Nonce Withdrawal
# Simple script to withdraw funds from a Solana nonce account

# Default values
NONCE_ACCOUNT="2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy"
RECIPIENT="C8QHPhGa8YGCmDysmHZVpYSLKFa7Gb75kAfQWAGztvJ1"
AUTHORITY_PATH="./nonce-keypair.json"
NETWORK="mainnet-beta"
VERBOSE=0

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "Error: Solana CLI could not be found"
    echo "Please install it from https://docs.solanalabs.com/cli/install"
    exit 1
fi

# Execute the withdrawal
echo "Executing Solana nonce withdrawal..."
echo "Nonce Account: $NONCE_ACCOUNT"
echo "Recipient: $RECIPIENT"
echo "Authority: $AUTHORITY_PATH"
echo "Network: $NETWORK"

# Run the command
solana nonce withdraw "$NONCE_ACCOUNT" "$RECIPIENT" --authority "$AUTHORITY_PATH"

# Check the result
if [ $? -eq 0 ]; then
    echo "Nonce withdrawal completed successfully!"
    exit 0
else
    echo "Nonce withdrawal failed!"
    exit 1
fi