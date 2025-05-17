#!/usr/bin/env python3

import argparse
import json
import os
import time
import hashlib
import base64
from datetime import datetime
import random

def create_logs_dir():
    """Create logs directory if it doesn't exist."""
    if not os.path.exists('logs'):
        os.makedirs('logs')

def validate_solana_address(address):
    """Validate Solana address format."""
    # Basic validation - Solana addresses are base58 encoded and 32-44 characters
    if not 32 <= len(address) <= 44:
        return False
    
    # Check if the address contains only valid base58 characters
    valid_chars = set("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
    return all(c in valid_chars for c in address)

def validate_keypair_file(filepath):
    """Validate the keypair file exists and has correct format."""
    if not os.path.exists(filepath):
        print(f"Error: Keypair file '{filepath}' not found")
        return False
    
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        # Keypair should be a list of numbers
        if not isinstance(data, list):
            print("Error: Keypair file does not contain a valid key array")
            return False
        
        return True
    except json.JSONDecodeError:
        print("Error: Keypair file is not valid JSON")
        return False
    except Exception as e:
        print(f"Error reading keypair file: {str(e)}")
        return False

def generate_signature():
    """Generate a simulated transaction signature."""
    # Create a random signature similar to Solana's
    random_bytes = os.urandom(32)
    signature = base58_encode(random_bytes)
    return signature

def base58_encode(data):
    """Encode bytes in base58 format (simplified implementation)."""
    alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    
    # Convert to base64 first for simplicity
    b64_str = base64.b64encode(data).decode('utf-8')
    
    # Convert to a format similar to base58
    result = ""
    for char in b64_str:
        if char.isalnum() and char != '0' and char != 'O' and char != 'I' and char != 'l':
            result += char
        elif len(result) > 0:  # Skip initial padding
            # Replace with random base58 character
            result += random.choice(alphabet)
    
    # Ensure signature has a realistic length for Solana
    while len(result) < 88:  # Typical Solana signature length
        result += random.choice(alphabet)
    
    return result[:88]  # Trim to typical Solana signature length

def simulate_withdrawal(nonce_account, recipient, authority_path, verbose=False):
    """Simulate the Solana nonce withdrawal process."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_file = f"logs/nonce_withdraw_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    
    # Validate inputs
    if not validate_solana_address(nonce_account):
        return {"success": False, "error": "Invalid nonce account address format", "timestamp": timestamp}
    
    if not validate_solana_address(recipient):
        return {"success": False, "error": "Invalid recipient address format", "timestamp": timestamp}
    
    if not validate_keypair_file(authority_path):
        return {"success": False, "error": "Invalid authority keypair file", "timestamp": timestamp}
    
    # Simulate processing time
    if verbose:
        print("Simulating transaction processing...")
    
    time.sleep(2)  # Simulate network delay
    
    # Generate a simulated signature
    signature = generate_signature()
    
    # Log the transaction details
    transaction = {
        "nonce_account": nonce_account,
        "recipient": recipient,
        "authority": authority_path,
        "signature": signature,
        "timestamp": timestamp,
        "success": True
    }
    
    # Write log to file
    with open(log_file, 'w') as f:
        json.dump(transaction, f, indent=2)
    
    result = {
        "success": True,
        "signature": signature,
        "log_file": log_file,
        "timestamp": timestamp
    }
    
    return result

def main():
    parser = argparse.ArgumentParser(description="Simulate Solana nonce withdrawal")
    parser.add_argument("--nonce", required=True, help="Nonce account address")
    parser.add_argument("--recipient", required=True, help="Recipient address")
    parser.add_argument("--authority", required=True, help="Path to authority keypair file")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose output")
    
    args = parser.parse_args()
    
    # Create logs directory
    create_logs_dir()
    
    if args.verbose:
        print(f"Nonce Account: {args.nonce}")
        print(f"Recipient: {args.recipient}")
        print(f"Authority: {args.authority}")
    
    # Simulate the withdrawal
    result = simulate_withdrawal(args.nonce, args.recipient, args.authority, args.verbose)
    
    if result["success"]:
        print(f"Withdrawal simulation successful!")
        print(f"Transaction Signature: {result['signature']}")
        print(f"Log saved to: {result['log_file']}")
        
        # Print explorers that could be used to view the transaction
        print(f"\nView transaction on explorers:")
        print(f"• Solana Explorer: https://explorer.solana.com/tx/{result['signature']}")
        print(f"• Solscan: https://solscan.io/tx/{result['signature']}")
    else:
        print(f"Withdrawal simulation failed: {result['error']}")

if __name__ == "__main__":
    main()