#!/bin/bash

# Script to push the $LERF project to GitHub
# Set these variables
GITHUB_USERNAME="your-username"
GITHUB_EMAIL="your-email@example.com"
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

echo -e "${YELLOW}Pushing to GitHub...${NC}"
if git push -u origin main; then
  echo -e "${GREEN}Successfully pushed to GitHub!${NC}"
  echo -e "${GREEN}Your project is now available at: $REPO_URL${NC}"
else
  echo -e "${RED}Failed to push to GitHub. Please check your credentials and try again.${NC}"
  echo -e "${YELLOW}You might need to use a personal access token instead of your password.${NC}"
  echo -e "${YELLOW}Create one at: https://github.com/settings/tokens${NC}"
fi