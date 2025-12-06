#!/bin/bash

###############################################################################
# COMPLETE AUTOMATED DEPLOYMENT SCRIPT - LUZA'S CULTURE
# Domain: luzasculture.org | Admin: admin.luzasculture.org
# Server: root@luzasculture.org
#
# Usage:
#   git clone https://github.com/MahmouT1/luzaend.git luzasculture
#   cd luzasculture
#   chmod +x deploy.sh
#   sudo ./deploy.sh
###############################################################################

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
step() { echo -e "${CYAN}▶ $1${NC}"; }

[ "$EUID" -ne 0 ] && { error "Run as root: sudo ./deploy.sh"; exit 1; }

DOMAIN="luzasculture.org"
ADMIN_SUBDOMAIN="admin.luzasculture.org"
APP_DIR="/var/www/luzasculture"
NODE_USER="luzauser"
REPO_URL="https://github.com/MahmouT1/luzaend2.git"

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} 🚀 LUZA'S CULTURE - Complete Automated Deployment ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

export DEBIAN_FRONTEND=noninteractive
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

step "Updating system..."
apt-get update -qq && apt-get upgrade -y -qq
success "System updated"

step "Installing packages (Node.js, PM2, Nginx, Certbot, Firewall)..."
apt-get install -y -qq curl wget git build-essential ufw fail2ban nginx certbot python3-certbot-nginx

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
success "All packages installed"

step "Configuring firewall..."
ufw --force enable
ufw default deny incoming && ufw default allow outgoing
ufw allow ssh && ufw allow 'Nginx Full' && ufw allow 8000/tcp
success "Firewall configured"

step "Creating application user..."
if ! id "$NODE_USER" &>/dev/null; then
    useradd -m -s /bin/bash $NODE_USER
    usermod -aG sudo $NODE_USER
fi

mkdir -p "$APP_DIR"
chown -R $NODE_USER:$NODE_USER "$APP_DIR"
success "User and directory ready"

step "Setting up repository..."
if [ -d "$SCRIPT_DIR/.git" ] && [ -d "$SCRIPT_DIR/loza-client-master" ] && [ -d "$SCRIPT_DIR/loza-server-master" ]; then
    REPO_DIR="$SCRIPT_DIR"
elif [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR" && sudo -u $NODE_USER git pull origin main || true
    REPO_DIR="$APP_DIR"
else
    sudo -u $NODE_USER git clone $REPO_URL "$APP_DIR"
    REPO_DIR="$APP_DIR"
fi
success "Repository ready at: $REPO_DIR"

step "Installing dependencies..."
cd "$REPO_DIR/loza-server-master/loza-server-master"
sudo -u $NODE_USER npm install --production
cd "$REPO_DIR/loza-client-master/loza-client-master"
sudo -u $NODE_USER npm install
success "Dependencies installed"

step "Building client application..."
cd "$REPO_DIR/loza-client-master/loza-client-master"
sudo -u $NODE_USER npm run build
success "Build completed"

step "Configuring PM2..."
cat > "$REPO_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '$REPO_DIR',
      env: { NODE_ENV: 'production', PORT: 8000 },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true
    },
    {
      name: 'luzasculture-client',
      script: 'npm',
      args: 'start',
      cwd: '$REPO_DIR/loza-client-master/loza-client-master',
      env: { NODE_ENV: 'production', PORT: 3000 },
      error_file: '/var/log/pm2/client-error.log',
      out_file: '/var/log/pm2/client-out.log',
      autorestart: true
    }
  ]
};
EOF
chown $NODE_USER:$NODE_USER "$REPO_DIR/ecosystem.config.js"
mkdir -p /var/log/pm2 && chown -R $NODE_USER:$NODE_USER /var/log/pm2
success "PM2 configured"

step "Configuring Nginx..."

cat > "/etc/nginx/sites-available/luzasculture" << 'NGINX_EOF'
server {
    listen 80;
    server_name luzasculture.org www.luzasculture.org;

    # NextAuth routes - must go to Next.js (before general /api route)
    location /api/auth {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Other API routes - go to backend
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_EOF

cat > "/etc/nginx/sites-available/admin-luzasculture" << 'NGINX_ADMIN_EOF'
server {
    listen 80;
    server_name admin.luzasculture.org;

    # NextAuth routes - must go to Next.js (before general /api route)
    location /api/auth {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /admin-panel {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Other API routes - go to backend
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_ADMIN_EOF

ln -sf /etc/nginx/sites-available/luzasculture /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/admin-luzasculture /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
success "Nginx configured"

step "Setting up automatic backups..."
cat > "/usr/local/bin/backup-luzasculture.sh" << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/luzasculture"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/app_$(date +%Y%m%d_%H%M%S).tar.gz" /var/www/luzasculture
find "$BACKUP_DIR" -type f -mtime +7 -delete
BACKUP_EOF
chmod +x /usr/local/bin/backup-luzasculture.sh
(crontab -l 2>/dev/null | grep -v backup-luzasculture.sh; echo "0 2 * * * /usr/local/bin/backup-luzasculture.sh") | crontab -
success "Backups configured"

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} ✅ Deployment Complete! ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
success "Server setup completed!"
echo ""
info "Next steps (manual):"
echo "1. Create .env files in:"
echo "   - $REPO_DIR/loza-server-master/loza-server-master/.env"
echo "   - $REPO_DIR/loza-client-master/loza-client-master/.env.local"
echo ""
echo "2. Configure DNS (A records to $(curl -s ifconfig.me)):"
echo "   - $DOMAIN"
echo "   - www.$DOMAIN"
echo "   - $ADMIN_SUBDOMAIN"
echo ""
echo "3. Get SSL certificates:"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "   certbot --nginx -d $ADMIN_SUBDOMAIN"
echo ""
echo "4. Start applications:"
echo "   cd $REPO_DIR"
echo "   sudo -u $NODE_USER pm2 start ecosystem.config.js"
echo "   sudo -u $NODE_USER pm2 save"
echo ""
success "Done! 🎉"
