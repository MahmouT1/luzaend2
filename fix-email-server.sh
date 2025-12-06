#!/bin/bash

###############################################################################
# 🔧 SCRIPT TO FIX EMAIL SYSTEM ON SERVER
# 
# This script will:
# 1. Check if .env file exists
# 2. Create/update .env with email configuration
# 3. Update ecosystem.config.js to load .env
# 4. Restart PM2
#
# Usage: 
#   Upload this script to server, then:
#   chmod +x fix-email-server.sh
#   sudo ./fix-email-server.sh
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
step() { echo -e "${CYAN}▶ $1${NC}"; }

[ "$EUID" -ne 0 ] && { error "Run as root: sudo ./fix-email-server.sh"; exit 1; }

APP_DIR="/var/www/luzasculture"
ENV_FILE="$APP_DIR/loza-server-master/loza-server-master/.env"
ECOSYSTEM_FILE="$APP_DIR/ecosystem.config.js"

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} 🔧 FIX EMAIL SYSTEM ON SERVER ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check if .env exists
step "Checking .env file..."
if [ ! -f "$ENV_FILE" ]; then
    info ".env file not found. Creating it..."
    mkdir -p "$(dirname "$ENV_FILE")"
else
    info ".env file exists. Backing up..."
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Step 2: Create/Update .env with email configuration
step "Creating/Updating .env file with email configuration..."

cat > "$ENV_FILE" << 'ENV_EOF'
# Server Configuration
PORT=8000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Cloudinary
CLOUD_NAME=dxptnzuri
CLOUD_API_KEY=848427894577436
CLOUD_SECRET_KEY=Bs4GLoPFouvduveDQiFn4IHiL-k

# Email Configuration (Hostinger SMTP) - IMPORTANT!
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465

# CORS Configuration
CLIENT_URL=https://luzasculture.org
ADMIN_URL=https://admin.luzasculture.org
ENV_EOF

chown luzauser:luzauser "$ENV_FILE" 2>/dev/null || true
chmod 600 "$ENV_FILE"
success ".env file created/updated"

# Step 3: Verify .env content
step "Verifying .env content..."
if grep -q "EMAIL_USER=orders@luzasculture.org" "$ENV_FILE" && \
   grep -q "EMAIL_PASS=Memo.Ro2123" "$ENV_FILE"; then
    success ".env file contains email configuration"
else
    error ".env file verification failed"
    exit 1
fi

# Step 4: Update ecosystem.config.js
step "Updating ecosystem.config.js..."

if [ ! -f "$ECOSYSTEM_FILE" ]; then
    error "ecosystem.config.js not found at $ECOSYSTEM_FILE"
    exit 1
fi

# Backup ecosystem.config.js
cp "$ECOSYSTEM_FILE" "$ECOSYSTEM_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Check if env_file is already in ecosystem.config.js
if grep -q "env_file" "$ECOSYSTEM_FILE"; then
    info "env_file already exists in ecosystem.config.js"
else
    info "Adding env_file to ecosystem.config.js..."
    
    # Use sed to add env_file after cwd line
    sed -i '/cwd:.*luzasculture-server/a\      env_file: '\''./loza-server-master/loza-server-master/.env'\'',' "$ECOSYSTEM_FILE"
    
    success "env_file added to ecosystem.config.js"
fi

# Step 5: Stop PM2
step "Stopping PM2 applications..."
pm2 stop all || true
success "PM2 applications stopped"

# Step 6: Delete PM2 apps
step "Deleting PM2 applications..."
pm2 delete all || true
success "PM2 applications deleted"

# Step 7: Start PM2 with new config
step "Starting PM2 with updated configuration..."
cd "$APP_DIR"
pm2 start ecosystem.config.js
success "PM2 applications started"

# Step 8: Save PM2
step "Saving PM2 configuration..."
pm2 save
success "PM2 configuration saved"

# Step 9: Check PM2 status
step "Checking PM2 status..."
pm2 status

# Step 10: Show logs
step "Showing recent server logs (check for email configuration)..."
echo ""
info "Recent logs (looking for email configuration):"
pm2 logs luzasculture-server --lines 20 --nostream | grep -i email || echo "No email-related logs found yet"

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} ✅ Email System Fix Complete! ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
success "Email system has been configured!"
echo ""
info "Next steps:"
echo "1. Check PM2 logs: pm2 logs luzasculture-server"
echo "2. Look for: 'Email Pass configured: Yes'"
echo "3. Test by making a purchase on the website"
echo "4. Check email inbox for confirmation"
echo ""
info "If email still doesn't work:"
echo "1. Check .env file: cat $ENV_FILE"
echo "2. Check PM2 env: pm2 show luzasculture-server"
echo "3. Review logs: pm2 logs luzasculture-server --lines 100"
echo ""
success "Done! 🎉"

