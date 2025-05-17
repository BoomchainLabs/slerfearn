#!/bin/bash
# =============================================================================
# Solana Nonce Account Withdrawal Script
# 
# This script safely executes a withdrawal from a Solana nonce account,
# providing detailed logging and verification.
# =============================================================================

# Text colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
NONCE_ACCOUNT="2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy"
RECIPIENT="C8QHPhGa8YGCmDysmHZVpYSLKFa7Gb75kAfQWAGztvJ1"
AUTHORITY_PATH=""
NETWORK="mainnet-beta"
VERBOSE=false
DRY_RUN=false
CONFIRM=false
LOG_DIR="$HOME/.solana/withdrawal_logs"

# Display banner
function display_banner() {
  echo -e "${BLUE}"
  echo "================================================================================"
  echo "                   SOLANA NONCE ACCOUNT WITHDRAWAL TOOL                         "
  echo "================================================================================"
  echo -e "${NC}"
}

# Display usage information
function display_usage() {
  echo -e "${YELLOW}Usage:${NC} $0 [options]"
  echo ""
  echo "Options:"
  echo "  --nonce ACCOUNT      Nonce account address (default: $NONCE_ACCOUNT)"
  echo "  --recipient ADDRESS  Recipient address (default: $RECIPIENT)"
  echo "  --authority PATH     Path to authority keypair file (required)"
  echo "  --network NETWORK    Solana network: mainnet-beta, testnet, devnet (default: $NETWORK)"
  echo "  --verbose            Enable verbose output"
  echo "  --dry-run            Simulate the withdrawal without executing it"
  echo "  --confirm            Skip confirmation prompt (use with caution!)"
  echo "  --help               Display this help message"
  echo ""
  echo "Example:"
  echo "  $0 --authority ~/my-keypair.json"
  echo ""
}

# Parse command line arguments
function parse_arguments() {
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
        VERBOSE=true
        shift
        ;;
      --dry-run)
        DRY_RUN=true
        shift
        ;;
      --confirm)
        CONFIRM=true
        shift
        ;;
      --help)
        display_banner
        display_usage
        exit 0
        ;;
      *)
        echo -e "${RED}Error: Unknown option: $1${NC}"
        display_usage
        exit 1
        ;;
    esac
  done
}

# Create log directory
function setup_logging() {
  if [[ ! -d "$LOG_DIR" ]]; then
    mkdir -p "$LOG_DIR"
    echo -e "${BLUE}Created log directory: $LOG_DIR${NC}"
  fi
  
  # Create timestamped log file
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  LOG_FILE="$LOG_DIR/withdrawal_${TIMESTAMP}.log"
  
  # Start logging
  exec > >(tee -a "$LOG_FILE") 2>&1
  
  echo "=== Solana Nonce Withdrawal Log ===" 
  echo "Date: $(date)"
  echo "Command: $0 $ORIGINAL_ARGS"
  echo "==============================="
}

# Validate inputs
function validate_inputs() {
  echo -e "${BLUE}Validating inputs...${NC}"
  
  # Check if Solana CLI is installed
  if ! command -v solana &> /dev/null; then
    echo -e "${RED}Error: Solana CLI is not installed${NC}"
    echo "Please install the Solana CLI: https://docs.solanalabs.com/cli/install"
    exit 1
  fi
  
  # Check authority path
  if [[ -z "$AUTHORITY_PATH" ]]; then
    echo -e "${RED}Error: Authority keypair path is required${NC}"
    echo "Use --authority to specify your keypair file"
    exit 1
  fi
  
  if [[ ! -f "$AUTHORITY_PATH" ]]; then
    echo -e "${RED}Error: Authority keypair file not found: $AUTHORITY_PATH${NC}"
    exit 1
  fi
  
  # Validate Solana addresses (basic check)
  SOLANA_ADDRESS_PATTERN='^[1-9A-HJ-NP-Za-km-z]{32,44}$'
  
  if ! [[ $NONCE_ACCOUNT =~ $SOLANA_ADDRESS_PATTERN ]]; then
    echo -e "${RED}Error: Invalid nonce account address format${NC}"
    exit 1
  fi
  
  if ! [[ $RECIPIENT =~ $SOLANA_ADDRESS_PATTERN ]]; then
    echo -e "${RED}Error: Invalid recipient address format${NC}"
    exit 1
  fi
  
  # Validate network
  case $NETWORK in
    mainnet-beta|testnet|devnet)
      true
      ;;
    *)
      echo -e "${RED}Error: Invalid network. Must be 'mainnet-beta', 'testnet', or 'devnet'${NC}"
      exit 1
      ;;
  esac
  
  echo -e "${GREEN}Input validation successful${NC}"
  return 0
}

# Set Solana network
function set_network() {
  echo -e "${BLUE}Setting Solana network to $NETWORK...${NC}"
  
  local network_url
  case $NETWORK in
    mainnet-beta)
      network_url="https://api.mainnet-beta.solana.com"
      ;;
    testnet)
      network_url="https://api.testnet.solana.com"
      ;;
    devnet)
      network_url="https://api.devnet.solana.com"
      ;;
  esac
  
  solana config set --url "$network_url"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set network configuration${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Network set to $NETWORK${NC}"
  return 0
}

# Check account information
function check_accounts() {
  echo -e "${BLUE}Checking account information...${NC}"
  
  # Check nonce account
  echo "Checking nonce account: $NONCE_ACCOUNT"
  NONCE_INFO=$(solana nonce-account "$NONCE_ACCOUNT" 2>&1)
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error checking nonce account:${NC}"
    echo "$NONCE_INFO"
    exit 1
  fi
  
  # Extract balance
  BALANCE=$(echo "$NONCE_INFO" | grep "Balance:" | awk '{print $2}')
  AUTHORITY=$(echo "$NONCE_INFO" | grep "Authority:" | awk '{print $2}')
  
  echo -e "${GREEN}Nonce Account Information:${NC}"
  echo "  Address: $NONCE_ACCOUNT"
  echo "  Balance: $BALANCE"
  echo "  Authority: $AUTHORITY"
  
  # Check recipient
  echo -e "${BLUE}Checking recipient account: $RECIPIENT${NC}"
  RECIPIENT_INFO=$(solana account "$RECIPIENT" 2>&1 || echo "Account does not exist yet (new account)")
  
  echo -e "${GREEN}Recipient Account Information:${NC}"
  echo "  Address: $RECIPIENT"
  echo "  $RECIPIENT_INFO"
  
  return 0
}

# Execute the withdrawal
function execute_withdrawal() {
  echo -e "${BLUE}Preparing to execute withdrawal...${NC}"
  echo "  From Nonce Account: $NONCE_ACCOUNT"
  echo "  To Recipient: $RECIPIENT"
  echo "  Authority: $AUTHORITY_PATH"
  echo "  Network: $NETWORK"
  
  # Check if this is a dry run
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN - No transaction will be executed${NC}"
    echo "Command that would be executed:"
    echo "solana nonce withdraw \"$NONCE_ACCOUNT\" \"$RECIPIENT\" --authority \"$AUTHORITY_PATH\""
    return 0
  fi
  
  # Request confirmation unless --confirm flag was used
  if [ "$CONFIRM" != true ]; then
    echo -e "${YELLOW}"
    echo "WARNING: You are about to execute a real transaction on $NETWORK."
    echo "This will withdraw funds from your nonce account."
    echo -e "${NC}"
    read -p "Do you want to proceed? (yes/no): " CONFIRMATION
    
    if [[ ! "$CONFIRMATION" =~ ^[Yy][Ee][Ss]$ ]]; then
      echo -e "${YELLOW}Withdrawal cancelled by user${NC}"
      exit 0
    fi
  fi
  
  echo -e "${BLUE}Executing withdrawal...${NC}"
  WITHDRAWAL_RESULT=$(solana nonce withdraw "$NONCE_ACCOUNT" "$RECIPIENT" --authority "$AUTHORITY_PATH" 2>&1)
  RESULT=$?
  
  if [ $RESULT -ne 0 ]; then
    echo -e "${RED}Withdrawal failed:${NC}"
    echo "$WITHDRAWAL_RESULT"
    exit 1
  fi
  
  # Extract transaction signature
  TX_SIGNATURE=$(echo "$WITHDRAWAL_RESULT" | grep -o '[1-9A-HJ-NP-Za-km-z]\{80,\}')
  
  echo -e "${GREEN}Withdrawal successful!${NC}"
  echo "Transaction Signature: $TX_SIGNATURE"
  
  # Save signature to a separate file for easy access
  echo "$TX_SIGNATURE" > "$LOG_DIR/last_signature.txt"
  
  return 0
}

# Verify the transaction
function verify_transaction() {
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN - No transaction to verify${NC}"
    return 0
  fi
  
  if [ -z "$TX_SIGNATURE" ]; then
    echo -e "${YELLOW}No transaction signature available to verify${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Verifying transaction...${NC}"
  VERIFY_RESULT=$(solana confirm -v "$TX_SIGNATURE" 2>&1)
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Transaction verification failed:${NC}"
    echo "$VERIFY_RESULT"
    return 1
  fi
  
  echo -e "${GREEN}Transaction verified successfully!${NC}"
  echo "$VERIFY_RESULT"
  
  # Provide explorer links
  echo -e "${BLUE}View transaction details online:${NC}"
  echo "• Solana Explorer: https://explorer.solana.com/tx/$TX_SIGNATURE"
  echo "• Solscan: https://solscan.io/tx/$TX_SIGNATURE"
  
  return 0
}

# Main function
function main() {
  display_banner
  ORIGINAL_ARGS="$@"
  parse_arguments "$@"
  setup_logging
  validate_inputs
  set_network
  check_accounts
  execute_withdrawal
  verify_transaction
  
  echo -e "${GREEN}Withdrawal process completed${NC}"
  echo "Log saved to: $LOG_FILE"
}

# Execute main function with all arguments
main "$@"