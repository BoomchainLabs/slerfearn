#!/bin/bash

# Script to push the $LERF project to GitHub
# Set these variables
GITHUB_USERNAME="Boomchainlab"
GITHUB_EMAIL="support@boomchainlab.com"
REPO_URL="https://github.com/Boomchainlab/lerf-rewards-hub.git"
COMMIT_MESSAGE="Initial upload of $LERF Rewards Hub project"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Git configuration...${NC}"
git config --global user.name "$GITHUB_USERNAME"
git config --global user.email "$GITHUB_EMAIL"

echo -e "${YELLOW}Initializing Git repository...${NC}"
git init

echo -e "${YELLOW}Adding all files to Git...${NC}"
git add .

echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "$COMMIT_MESSAGE"

echo -e "${YELLOW}Adding remote repository...${NC}"
git remote add origin $REPO_URL

echo -e "${YELLOW}Please enter your GitHub Personal Access Token:${NC}"
read -s GITHUB_TOKEN

# Set the remote URL with token for authentication
REPO_URL_WITH_TOKEN="https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/Boomchainlab/lerf-rewards-hub.git"
git remote set-url origin $REPO_URL_WITH_TOKEN

echo -e "${YELLOW}Pushing to GitHub...${NC}"
if git push -u origin main; then
  echo -e "${GREEN}Successfully pushed to GitHub!${NC}"
  echo -e "${GREEN}Your project is now available at: https://github.com/Boomchainlab/lerf-rewards-hub${NC}"
else
  echo -e "${RED}Failed to push to GitHub. Please check your credentials and try again.${NC}"
  echo -e "${YELLOW}Make sure you have created a Personal Access Token with 'repo' permissions.${NC}"
  echo -e "${YELLOW}Create one at: https://github.com/settings/tokens${NC}"
fi

# Reset the remote URL for security (removes token from git config)
git remote set-url origin $REPO_URL