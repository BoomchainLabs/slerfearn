# Solana Nonce Withdrawal Automation Tools

This directory contains scripts to automate Solana nonce account withdrawal operations, making it easier to manage your Solana nonce accounts.

## Prerequisites

- Node.js (v14 or higher)
- Solana CLI tools installed and configured
- A valid authority keypair file for your nonce account

## Available Scripts

### 1. Interactive Nonce Withdrawal Tool

The interactive tool guides you through the process with prompts and verification steps.

```bash
node solana-nonce-withdraw.js
```

#### Features:
- Interactive prompts for all required information
- Verification of nonce account, authority keypair, and recipient address
- Network selection (Mainnet, Testnet, Devnet)
- Configuration saving for future use
- Detailed transaction summary before execution
- Final confirmation before withdrawal

### 2. Non-Interactive Nonce Withdrawal Tool (for Automation)

This version is designed for automation, cron jobs, or scripted use.

```bash
node solana-nonce-withdraw-auto.js --nonce <nonce-account> --recipient <recipient-address> --authority <path-to-keypair> --network <network>
```

#### Command-line Arguments:
- `--nonce`: Nonce account address (required)
- `--recipient`: Recipient address (required)
- `--authority`: Path to authority keypair file (required)
- `--network`: Solana network (mainnet-beta, testnet, devnet), default: mainnet-beta
- `--skip-verification`: Skip verification checks
- `--verbose`: Enable verbose logging
- `--help`: Show help message

#### Example:
```bash
node solana-nonce-withdraw-auto.js \
  --nonce 2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy \
  --recipient C8QHPhGa8YGCmDysmHZVpYSLKFa7Gb75kAfQWAGztvJ1 \
  --authority ./nonce-keypair.json \
  --network mainnet-beta
```

## Setting Up Automated Withdrawals

### Using Cron (Linux/macOS)

1. Make the scripts executable:
   ```bash
   chmod +x solana-nonce-withdraw-auto.js
   ```

2. Edit your crontab:
   ```bash
   crontab -e
   ```

3. Add a schedule (example: run daily at 2 AM):
   ```
   0 2 * * * cd /path/to/scripts && ./solana-nonce-withdraw-auto.js --nonce YOUR_NONCE_ACCOUNT --recipient YOUR_RECIPIENT --authority /path/to/keypair.json >> /path/to/logfile.log 2>&1
   ```

### Using Task Scheduler (Windows)

1. Create a batch file (e.g., `run-nonce-withdrawal.bat`):
   ```batch
   @echo off
   cd C:\path\to\scripts
   node solana-nonce-withdraw-auto.js --nonce YOUR_NONCE_ACCOUNT --recipient YOUR_RECIPIENT --authority C:\path\to\keypair.json
   ```

2. Open Task Scheduler and create a new task that runs the batch file at your desired schedule.

## Security Considerations

- Keep your authority keypair file secure
- Use absolute paths when setting up automated tasks
- Review logs regularly to ensure withdrawals are working correctly
- Consider using environment variables for sensitive information

## Logs

Automated withdrawals create logs in the `logs/` directory with transaction details and timestamps.

## Troubleshooting

If you encounter issues:

1. Ensure Solana CLI is properly installed and in your PATH
2. Verify your keypair file is valid and has the correct permissions
3. Check if your nonce account has sufficient balance
4. Confirm you have the correct authority for the nonce account
5. Review the logs for specific error messages

For more detailed information on Solana nonce accounts, refer to the [Solana Documentation](https://docs.solanalabs.com/cli/usage#nonce-accounts).