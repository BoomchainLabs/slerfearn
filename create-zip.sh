#!/bin/bash

# Script to create a ZIP file of the $LERF project for GitHub upload

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating temporary directory for the project...${NC}"
mkdir -p /tmp/lerf-project

echo -e "${YELLOW}Copying project files...${NC}"
# Copy main project files
cp -r client /tmp/lerf-project/
cp -r server /tmp/lerf-project/
cp -r shared /tmp/lerf-project/
cp package.json tsconfig.json vite.config.ts README.md .gitignore /tmp/lerf-project/

echo -e "${YELLOW}Creating zip file...${NC}"
cd /tmp
zip -r lerf-project.zip lerf-project

echo -e "${GREEN}ZIP file created successfully at: /tmp/lerf-project.zip${NC}"
echo -e "${GREEN}You can download this file and upload it to GitHub.${NC}"
echo -e "${YELLOW}To upload to GitHub:${NC}"
echo -e "1. Go to: https://github.com/Boomchainlab/lerf-rewards-hub"
echo -e "2. Click 'Add file' > 'Upload files'"
echo -e "3. Drag and drop the ZIP file or use the file selector"
echo -e "4. Add a commit message like 'Initial upload of \$LERF Rewards Hub'"
echo -e "5. Click 'Commit changes'"