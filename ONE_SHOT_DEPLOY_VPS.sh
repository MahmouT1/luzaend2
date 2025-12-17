#!/usr/bin/env bash
###############################################################################
# ONE-SHOT DEPLOY + HARDENING (VPS NEW) - LUZA'S CULTURE
#
# هدف السكريبت:
# - إعداد VPS جديد بأفضل أساسيات الأمان (UFW + Fail2ban + تحديثات)
# - نشر المشروع بنفس الهيكلة وتشغيل (Frontend Next.js + Backend Express) عبر PM2
# - إعداد Nginx routing بحيث:
#     /api/auth  -> Next.js (3000)  (NextAuth)
#     /api       -> Backend (8000)
#     /          -> Next.js (3000)
#
# تشغيل:
#   sudo bash ONE_SHOT_DEPLOY_VPS.sh
#
# ملاحظات مهمة:
# - لا يغيّر كود التطبيق. فقط يجهّز السيرفر ويكتب ملفات env المطلوبة للتشغيل.
# - يدعم التشغيل بدون تدخل إذا كنت مجهّز ENV vars، أو يسألك تفاعلياً.
###############################################################################

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
step() { echo -e "${CYAN}▶ $1${NC}"; }

if [ "${EUID:-$(id -u)}" -ne 0 ]; then
  error "Run as root: sudo bash ONE_SHOT_DEPLOY_VPS.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

###############################################################################
# Settings (يمكنك تعديلها قبل التشغيل)
###############################################################################
DOMAIN="${DOMAIN:-luzasculture.org}"
ADMIN_SUBDOMAIN="${ADMIN_SUBDOMAIN:-admin.luzasculture.org}"
APP_DIR="${APP_DIR:-/var/www/luzasculture}"
NODE_USER="${NODE_USER:-luzauser}"
REPO_URL="${REPO_URL:-https://github.com/MahmouT1/luzaend2.git}"
REPO_BRANCH="${REPO_BRANCH:-main}"
REPO_DIR="${REPO_DIR:-$APP_DIR/loza-client-master}"  # نفس المسار اللي كان شغال قبل

#
# Project layout varies a bit between deployments (nested folders).
# We'll auto-detect actual client/server directories after clone/pull.
#
CLIENT_DIR_REL_DEFAULT="loza-client-master/loza-client-master"
SERVER_DIR_REL_DEFAULT="loza-server-master/loza-server-master"
# Resolved later
CLIENT_DIR_REL=""
SERVER_DIR_REL=""

# Ports
CLIENT_PORT="${CLIENT_PORT:-3000}"
SERVER_PORT="${SERVER_PORT:-8000}"

###############################################################################
# Helpers
###############################################################################
need_cmd() { command -v "$1" >/dev/null 2>&1; }
prompt_if_empty() {
  local var_name="$1"
  local prompt_text="$2"
  local silent="${3:-false}"
  local current_val="${!var_name:-}"
  if [ -n "$current_val" ]; then return 0; fi
  if [ "$silent" = "true" ]; then
    read -r -s -p "$prompt_text: " current_val
    echo ""
  else
    read -r -p "$prompt_text: " current_val
  fi
  export "$var_name=$current_val"
}

###############################################################################
# Banner
###############################################################################
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} 🚀 LUZA'S CULTURE - One Shot Deploy + Security (VPS) ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
info "Target path: $REPO_DIR"
info "Domain: $DOMAIN | Admin: $ADMIN_SUBDOMAIN"
echo ""

###############################################################################
# 1) System update + packages
###############################################################################
step "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq
success "System updated"

step "Installing required packages (git, ufw, fail2ban, nginx, certbot, build tools)..."
apt-get install -y -qq curl wget git ca-certificates gnupg build-essential ufw fail2ban nginx certbot python3-certbot-nginx unzip
success "Packages installed"

###############################################################################
# 2) Node.js 20 + PM2
###############################################################################
if ! need_cmd node; then
  step "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
  success "Node.js installed"
else
  success "Node.js already installed: $(node -v)"
fi

if ! need_cmd pm2; then
  step "Installing PM2 globally..."
  npm install -g pm2
  success "PM2 installed"
else
  success "PM2 already installed: $(pm2 -v)"
fi

###############################################################################
# 3) Security hardening (UFW + Fail2ban + basic sysctl)
###############################################################################
step "Configuring firewall (UFW)..."
ufw --force reset >/dev/null 2>&1 || true
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw limit OpenSSH >/dev/null

# Block common mining ports (احتياطي)
ufw deny 3333/tcp >/dev/null || true
ufw deny 4444/tcp >/dev/null || true
ufw deny 5555/tcp >/dev/null || true
ufw deny 7777/tcp >/dev/null || true
ufw deny 8080/tcp >/dev/null || true

ufw --force enable >/dev/null
success "UFW enabled (SSH limited, HTTP/HTTPS allowed)"

step "Enabling Fail2ban..."
systemctl enable --now fail2ban >/dev/null
success "Fail2ban enabled"

step "Applying basic kernel hardening (sysctl)..."
cat >/etc/sysctl.d/99-luzasculture-hardening.conf <<'SYSCTL_EOF'
net.ipv4.tcp_syncookies=1
net.ipv4.conf.all.rp_filter=1
net.ipv4.conf.default.rp_filter=1
net.ipv4.conf.all.accept_redirects=0
net.ipv4.conf.default.accept_redirects=0
net.ipv4.conf.all.send_redirects=0
net.ipv4.conf.default.send_redirects=0
net.ipv4.conf.all.accept_source_route=0
net.ipv4.conf.default.accept_source_route=0
kernel.kptr_restrict=2
fs.protected_hardlinks=1
fs.protected_symlinks=1
SYSCTL_EOF
sysctl --system >/dev/null
success "Sysctl hardening applied"

###############################################################################
# 4) Create deploy user + directories
###############################################################################
step "Creating application user ($NODE_USER) and directories..."
if ! id "$NODE_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "$NODE_USER"
  usermod -aG sudo "$NODE_USER" || true
fi

mkdir -p "$APP_DIR"
chown -R "$NODE_USER:$NODE_USER" "$APP_DIR"
success "User + app dir ready"

###############################################################################
# 5) Clone/Pull repository to same expected path
###############################################################################
step "Preparing repository at $REPO_DIR ..."
if [ -d "$REPO_DIR/.git" ]; then
  cd "$REPO_DIR"
  sudo -u "$NODE_USER" git fetch --all --prune
  sudo -u "$NODE_USER" git checkout "$REPO_BRANCH"
  sudo -u "$NODE_USER" git pull origin "$REPO_BRANCH"
else
  rm -rf "$REPO_DIR" >/dev/null 2>&1 || true
  sudo -u "$NODE_USER" git clone --branch "$REPO_BRANCH" "$REPO_URL" "$REPO_DIR"
fi
success "Repository ready"

detect_client_dir() {
  local base="$1"
  local candidates=(
    "$base/$CLIENT_DIR_REL_DEFAULT"
    "$base/loza-client-master"
    "$base/loza-client-master/loza-client-master"
    "$base"
  )
  for c in "${candidates[@]}"; do
    if [ -f "$c/package.json" ] && grep -q "\"next\"" "$c/package.json" 2>/dev/null; then
      echo "$c"
      return 0
    fi
  done
  # Fallback: first package.json that looks like Next.js app
  local found
  found="$(find "$base" -maxdepth 4 -name package.json -type f 2>/dev/null | head -50 | while read -r p; do
    if grep -q "\"next\"" "$p" 2>/dev/null; then
      dirname "$p"
      break
    fi
  done)"
  if [ -n "$found" ]; then
    echo "$found"
    return 0
  fi
  return 1
}

detect_server_dir() {
  local base="$1"
  local candidates=(
    "$base/$SERVER_DIR_REL_DEFAULT"
    "$base/loza-server-master/loza-server-master"
    "$base/loza-server-master"
    "$base"
  )
  for c in "${candidates[@]}"; do
    if [ -f "$c/server.js" ]; then
      echo "$c"
      return 0
    fi
  done
  # Fallback: find server.js
  local found
  found="$(find "$base" -maxdepth 5 -name server.js -type f 2>/dev/null | head -1 || true)"
  if [ -n "$found" ]; then
    dirname "$found"
    return 0
  fi
  return 1
}

CLIENT_DIR="$(detect_client_dir "$REPO_DIR" || true)"
SERVER_DIR="$(detect_server_dir "$REPO_DIR" || true)"

if [ -z "$CLIENT_DIR" ] || [ ! -f "$CLIENT_DIR/package.json" ]; then
  error "Client package.json not found (auto-detect failed)."
  info "Searched under: $REPO_DIR"
  info "Try: find $REPO_DIR -maxdepth 4 -name package.json"
  exit 1
fi
if [ -z "$SERVER_DIR" ] || [ ! -f "$SERVER_DIR/server.js" ]; then
  error "Server entry (server.js) not found (auto-detect failed)."
  info "Searched under: $REPO_DIR"
  info "Try: find $REPO_DIR -maxdepth 5 -name server.js"
  exit 1
fi

success "Detected client dir: $CLIENT_DIR"
success "Detected server dir: $SERVER_DIR"

###############################################################################
# 6) Create env files safely (prompt or env vars)
###############################################################################
step "Creating/validating environment files..."

# Client .env.local
CLIENT_ENV_FILE="$CLIENT_DIR/.env.local"
if [ ! -f "$CLIENT_ENV_FILE" ]; then
  info "Client .env.local not found. We'll create it now."
fi

prompt_if_empty NEXT_PUBLIC_API_URL "NEXT_PUBLIC_API_URL (مثال: https://$DOMAIN/api)"
prompt_if_empty NEXTAUTH_URL "NEXTAUTH_URL (مثال: https://$DOMAIN)"
prompt_if_empty NEXTAUTH_SECRET "NEXTAUTH_SECRET (random strong string)" true
prompt_if_empty GOOGLE_CLIENT_ID "GOOGLE_CLIENT_ID"
prompt_if_empty GOOGLE_CLIENT_SECRET "GOOGLE_CLIENT_SECRET" true

cat >"$CLIENT_ENV_FILE" <<EOF
NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
NEXTAUTH_URL=$NEXTAUTH_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
EOF
chown "$NODE_USER:$NODE_USER" "$CLIENT_ENV_FILE"
chmod 600 "$CLIENT_ENV_FILE"
success "Client .env.local ready"

# Server .env
SERVER_ENV_FILE="$SERVER_DIR/.env"
if [ ! -f "$SERVER_ENV_FILE" ]; then
  info "Server .env not found. We'll create it now."
fi

prompt_if_empty MONGODB_URI "MONGODB_URI (Mongo Atlas URI)"
prompt_if_empty JWT_SECRET "JWT_SECRET (random strong string)" true
prompt_if_empty CLOUD_NAME "CLOUD_NAME"
prompt_if_empty CLOUD_API_KEY "CLOUD_API_KEY"
prompt_if_empty CLOUD_SECRET_KEY "CLOUD_SECRET_KEY" true
prompt_if_empty EMAIL_USER "EMAIL_USER (مثال: orders@$DOMAIN)"
prompt_if_empty EMAIL_PASS "EMAIL_PASS" true
prompt_if_empty SMTP_HOST "SMTP_HOST (مثال: smtp.hostinger.com)"
prompt_if_empty SMTP_PORT "SMTP_PORT (مثال: 465)"

cat >"$SERVER_ENV_FILE" <<EOF
PORT=$SERVER_PORT
NODE_ENV=production
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
CLOUD_NAME=$CLOUD_NAME
CLOUD_API_KEY=$CLOUD_API_KEY
CLOUD_SECRET_KEY=$CLOUD_SECRET_KEY
EMAIL_USER=$EMAIL_USER
EMAIL_PASS=$EMAIL_PASS
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
EOF
chown "$NODE_USER:$NODE_USER" "$SERVER_ENV_FILE"
chmod 600 "$SERVER_ENV_FILE"
success "Server .env ready"

###############################################################################
# 7) Install deps + build
###############################################################################
step "Installing server dependencies..."
cd "$SERVER_DIR"
sudo -u "$NODE_USER" npm ci --omit=dev
success "Server deps installed"

step "Installing client dependencies..."
cd "$CLIENT_DIR"
sudo -u "$NODE_USER" npm ci
success "Client deps installed"

step "Building client (Next.js)..."
cd "$CLIENT_DIR"
sudo -u "$NODE_USER" npm run build
success "Client build done"

###############################################################################
# 8) PM2 ecosystem (use .cjs to avoid ESM edge cases)
###############################################################################
step "Configuring PM2 ecosystem..."
ECOSYSTEM_FILE="$REPO_DIR/ecosystem.config.cjs"
cat >"$ECOSYSTEM_FILE" <<EOF
module.exports = {
  apps: [
    {
      name: 'loza-server-master',
      script: 'server.js',
      cwd: '$SERVER_DIR',
      env_file: '$SERVER_ENV_FILE',
      env: { NODE_ENV: 'production', PORT: $SERVER_PORT },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'loza-client-master',
      script: 'npm',
      args: 'start',
      cwd: '$CLIENT_DIR',
      env: { NODE_ENV: 'production', PORT: $CLIENT_PORT },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
EOF
chown "$NODE_USER:$NODE_USER" "$ECOSYSTEM_FILE"
success "PM2 ecosystem written: $ECOSYSTEM_FILE"

step "Starting apps with PM2..."
sudo -u "$NODE_USER" pm2 delete loza-server-master >/dev/null 2>&1 || true
sudo -u "$NODE_USER" pm2 delete loza-client-master >/dev/null 2>&1 || true
sudo -u "$NODE_USER" pm2 start "$ECOSYSTEM_FILE"
sudo -u "$NODE_USER" pm2 save
success "PM2 apps started + saved"

step "Enabling PM2 startup (systemd)..."
pm2 startup systemd -u "$NODE_USER" --hp "/home/$NODE_USER" >/dev/null
sudo -u "$NODE_USER" pm2 save >/dev/null
success "PM2 startup enabled"

###############################################################################
# 9) Nginx reverse proxy
###############################################################################
step "Configuring Nginx..."
cat >"/etc/nginx/sites-available/luzasculture" <<NGINX_EOF
server {
  listen 80;
  server_name $DOMAIN www.$DOMAIN;

  client_max_body_size 20m;

  # NextAuth must go to Next.js
  location /api/auth {
    proxy_pass http://127.0.0.1:$CLIENT_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }

  # Backend API
  location /api {
    proxy_pass http://127.0.0.1:$SERVER_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }

  # Frontend
  location / {
    proxy_pass http://127.0.0.1:$CLIENT_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }
}
NGINX_EOF

cat >"/etc/nginx/sites-available/admin-luzasculture" <<NGINX_ADMIN_EOF
server {
  listen 80;
  server_name $ADMIN_SUBDOMAIN;

  client_max_body_size 20m;

  # NextAuth
  location /api/auth {
    proxy_pass http://127.0.0.1:$CLIENT_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }

  # Admin panel route lives on Next.js
  location /admin-panel {
    proxy_pass http://127.0.0.1:$CLIENT_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }

  # Backend API
  location /api {
    proxy_pass http://127.0.0.1:$SERVER_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }
}
NGINX_ADMIN_EOF

ln -sf /etc/nginx/sites-available/luzasculture /etc/nginx/sites-enabled/luzasculture
ln -sf /etc/nginx/sites-available/admin-luzasculture /etc/nginx/sites-enabled/admin-luzasculture
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
success "Nginx configured"

###############################################################################
# 10) SSL (Certbot) - optional (requires DNS ready)
###############################################################################
step "SSL certificates (optional) via Certbot..."
info "If DNS is already pointed to this VPS IP, we can enable SSL now."
info "To skip SSL now, just press Enter when asked."
read -r -p "Run certbot now? (y/N): " RUN_CERTBOT
RUN_CERTBOT="${RUN_CERTBOT:-N}"
if [[ "$RUN_CERTBOT" =~ ^[Yy]$ ]]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || true
  certbot --nginx -d "$ADMIN_SUBDOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || true
  systemctl reload nginx
  success "Certbot executed (check output above)."
else
  info "Skipped SSL for now."
fi

###############################################################################
# 11) Simple backups (daily, keep 7 days)
###############################################################################
step "Configuring simple backups..."
cat >"/usr/local/bin/backup-luzasculture.sh" <<'BACKUP_EOF'
#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR="/var/backups/luzasculture"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/app_$(date +%Y%m%d_%H%M%S).tar.gz" /var/www/luzasculture >/dev/null 2>&1
find "$BACKUP_DIR" -type f -mtime +7 -delete
BACKUP_EOF
chmod +x /usr/local/bin/backup-luzasculture.sh
(crontab -l 2>/dev/null | grep -v backup-luzasculture.sh || true; echo "0 2 * * * /usr/local/bin/backup-luzasculture.sh") | crontab -
success "Backups configured"

###############################################################################
# 12) Final checks
###############################################################################
echo ""
step "Final status checks..."
sudo -u "$NODE_USER" pm2 status || true
echo ""
info "Testing local endpoints:"
curl -s -I "http://127.0.0.1:$CLIENT_PORT" | head -5 || true
curl -s -I "http://127.0.0.1:$SERVER_PORT/api" | head -5 || true
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} ✅ DONE: VPS secured + app deployed + running on PM2   ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
success "Paths:"
echo "  - Repo:   $REPO_DIR"
echo "  - Client: $CLIENT_DIR"
echo "  - Server: $SERVER_DIR"
echo ""
success "Useful commands:"
echo "  - PM2 status:  sudo -u $NODE_USER pm2 status"
echo "  - PM2 logs:    sudo -u $NODE_USER pm2 logs loza-server-master --lines 100"
echo "  - Nginx test:  nginx -t"
echo "  - UFW status:  ufw status verbose"
echo ""

