# Admin Panel Subdomain Deployment Guide

## Overview
The admin panel is isolated from customer pages for security. All admin routes are under `/admin-panel` sub-path.

## Production Deployment on VPS

### Step 1: Configure Subdomain
1. Create a subdomain in your DNS settings:
   - **Subdomain:** `admin.yourdomain.com`
   - **Type:** A record or CNAME
   - **Value:** Your VPS IP address

### Step 2: Nginx Configuration

Create a separate Nginx configuration for the admin subdomain:

```nginx
# /etc/nginx/sites-available/admin.yourdomain.com

server {
    listen 80;
    server_name admin.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    # SSL Certificate (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate Limiting (adjust as needed)
    limit_req_zone $binary_remote_addr zone=admin_limit:10m rate=10r/m;
    limit_req zone=admin_limit burst=5 nodelay;

    # IP Whitelisting (optional but recommended)
    # allow 192.168.1.0/24;  # Your office IP range
    # allow 203.0.113.0/24;   # Your home IP range
    # deny all;

    # Proxy to Next.js
    location / {
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
}
```

### Step 3: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate for admin subdomain
sudo certbot --nginx -d admin.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

### Step 4: Enable Nginx Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/admin.yourdomain.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5: Next.js Configuration

Update `next.config.ts` to handle the subdomain:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  async rewrites() {
    return [
      {
        source: '/admin-panel/:path*',
        destination: '/admin-panel/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Step 6: Environment Variables

Set environment variables for the admin subdomain:

```bash
# .env.production
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
ADMIN_SUBDOMAIN_ENABLED=true
```

### Step 7: Security Recommendations

1. **IP Whitelisting:** Restrict admin subdomain access to specific IPs
2. **Rate Limiting:** Implement rate limiting on login attempts
3. **2FA:** Consider adding two-factor authentication
4. **Monitoring:** Set up monitoring and alerts for admin access
5. **Backup:** Regular backups of admin data
6. **Firewall:** Configure firewall rules for admin subdomain

### Step 8: Testing

1. Test admin login: `https://admin.yourdomain.com/admin-panel/login`
2. Verify all admin routes work correctly
3. Test logout functionality
4. Verify redirects from old `/admin` routes

## Security Checklist

- [ ] Subdomain configured and pointing to VPS
- [ ] SSL certificate installed and auto-renewal enabled
- [ ] Nginx configured with security headers
- [ ] Rate limiting enabled
- [ ] IP whitelisting configured (optional)
- [ ] Firewall rules configured
- [ ] Monitoring and alerts set up
- [ ] Regular backups scheduled
- [ ] Admin login page tested
- [ ] All admin routes accessible via subdomain

## Notes

- The main domain (`yourdomain.com`) serves customer pages
- The admin subdomain (`admin.yourdomain.com`) serves only admin panel
- Old `/admin` routes redirect to `/admin-panel/login` for security
- All admin functionality is preserved, just moved to secure subdomain

