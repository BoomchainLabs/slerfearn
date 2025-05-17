#!/bin/bash

# This script is designed to be run automatically via cron or task scheduler
# It handles the Solana nonce withdrawal with the specific parameters

# Create logs directory if it doesn't exist
mkdir -p logs

# Log execution
echo "Starting automated Solana nonce withdrawal at $(date)" >> logs/automation.log

# Run the withdrawal script with the specified parameters
./scripts/run-nonce-withdraw.sh \
  --nonce 2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy \
  --recipient C8QHPhGa8YGCmDysmHZVpYSLKFa7Gb75kAfQWAGztvJ1 \
  --authority ./nonce-keypair.json \
  --network mainnet-beta

# Log completion status
if [ $? -eq 0 ]; then
  echo "Automated withdrawal completed successfully at $(date)" >> logs/automation.log
else
  echo "Automated withdrawal failed at $(date)" >> logs/automation.log
fi