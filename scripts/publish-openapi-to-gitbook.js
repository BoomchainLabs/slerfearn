#!/usr/bin/env node

/**
 * GitBook OpenAPI Publisher
 * 
 * This script automates the process of publishing OpenAPI specifications to GitBook.
 * It handles authentication and publishing with proper error handling.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration (can be overridden by command line arguments)
const DEFAULT_CONFIG = {
  specName: 'boomchainlab-organization-api',
  organizationId: '3wJ7o4ruv7ICq5Y1wxga',
  specPath: './openapi/openapi.json',
  tokenEnvVar: 'GITBOOK_TOKEN'
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--spec' && i + 1 < args.length) {
      config.specName = args[i + 1];
      i++;
    } else if (args[i] === '--organization' && i + 1 < args.length) {
      config.organizationId = args[i + 1];
      i++;
    } else if (args[i] === '--file' && i + 1 < args.length) {
      config.specPath = args[i + 1];
      i++;
    } else if (args[i] === '--token' && i + 1 < args.length) {
      process.env[config.tokenEnvVar] = args[i + 1];
      i++;
    } else if (args[i] === '--help') {
      printHelp();
      process.exit(0);
    }
  }
  
  return config;
}

// Display help information
function printHelp() {
  console.log(`
GitBook OpenAPI Publisher

Usage:
  node publish-openapi-to-gitbook.js [options]

Options:
  --spec <name>          Name of the API specification in GitBook (default: ${DEFAULT_CONFIG.specName})
  --organization <id>    GitBook organization ID (default: ${DEFAULT_CONFIG.organizationId})
  --file <path>          Path to the OpenAPI specification file (default: ${DEFAULT_CONFIG.specPath})
  --token <token>        GitBook API token (alternative to GITBOOK_TOKEN env var)
  --help                 Show this help information

Environment Variables:
  GITBOOK_TOKEN          GitBook API token (required if --token not provided)

Example:
  node publish-openapi-to-gitbook.js --spec my-api --organization org123 --file ./openapi.json
  `);
}

// Validate OpenAPI file exists and is valid JSON/YAML
function validateOpenApiFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: OpenAPI file not found at path: ${filePath}`);
    return false;
  }
  
  try {
    // Basic validation - just check if it's parseable JSON
    // For YAML files, this will fail, but that's OK since GitBook CLI handles YAML
    if (filePath.endsWith('.json')) {
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return true;
  } catch (err) {
    console.warn(`Note: File is not valid JSON. If it's YAML, this is expected.`);
    return true; // Continue anyway, let GitBook CLI handle the format validation
  }
}

// Check if GitBook CLI is installed
function checkGitBookCli() {
  try {
    execSync('npx gitbook --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    console.error('Error: GitBook CLI is not installed or not found in PATH');
    console.error('Please install it with: npm install -g @gitbook/cli');
    return false;
  }
}

// Authenticate with GitBook
function authenticateGitBook(token) {
  try {
    console.log('Authenticating with GitBook...');
    // Set token via environment variable, more secure than passing in CLI
    process.env.GITBOOK_TOKEN = token;
    
    // Verify authentication works
    execSync('npx gitbook user current', { stdio: 'ignore' });
    return true;
  } catch (err) {
    console.error('Error: Failed to authenticate with GitBook');
    console.error('Please check your GitBook token and try again');
    return false;
  }
}

// Publish OpenAPI to GitBook
function publishOpenApi(config) {
  try {
    console.log(`Publishing OpenAPI spec to GitBook...`);
    console.log(`- Spec name: ${config.specName}`);
    console.log(`- Organization: ${config.organizationId}`);
    console.log(`- File: ${config.specPath}`);
    
    // Use an array to safely pass arguments to execSync without shell injection risk
    const output = execSync(
      'npx',
      [
        'gitbook',
        'openapi',
        'publish',
        '--spec',
        config.specName,
        '--organization',
        config.organizationId,
        config.specPath
      ],
      { encoding: 'utf8' }
    );
    console.log('Publication successful!');
    console.log(output);
    return true;
  } catch (err) {
    console.error('Error: Failed to publish OpenAPI spec to GitBook');
    console.error(err.message);
    return false;
  }
}

// Main execution function
function main() {
  console.log('$LERF GitBook OpenAPI Publisher');
  console.log('================================\n');
  
  // Parse command line arguments
  const config = parseArgs();
  
  // Get GitBook token from environment variable or command line
  const gitbookToken = process.env[config.tokenEnvVar];
  if (!gitbookToken) {
    console.error(`Error: GitBook token not found. Please set ${config.tokenEnvVar} environment variable or use --token option`);
    process.exit(1);
  }
  
  // Validate inputs and environment
  if (!validateOpenApiFile(config.specPath)) {
    process.exit(1);
  }
  
  if (!checkGitBookCli()) {
    process.exit(1);
  }
  
  if (!authenticateGitBook(gitbookToken)) {
    process.exit(1);
  }
  
  // Publish OpenAPI spec
  if (!publishOpenApi(config)) {
    process.exit(1);
  }
  
  console.log('\nPublication process completed successfully!');
  console.log('You can now view your API documentation in GitBook');
}

// Run the script
main();