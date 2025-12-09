# 🔧 حل مختلف - تغيير طريقة التشغيل

## 💡 الفكرة الجديدة:
بدلاً من استخدام `npm start`، نستخدم `next start` مباشرة!

---

## 🔍 المشكلة المحتملة:
PM2 قد لا يتعامل بشكل صحيح مع `npm start` عندما يكون هناك Port conflict.

---

## ✅ الحل 1: استخدام next مباشرة

### تحديث ecosystem.config.js:

```bash
cd /var/www/luzasculture
nano ecosystem.config.js
```

**تغيير client configuration إلى:**

```javascript
{
  name: 'luzasculture-client',
  script: './node_modules/.bin/next',
  args: 'start',
  cwd: '/var/www/luzasculture/loza-client-master/loza-client-master',
  env: {
    NODE_ENV: 'production',
    PORT: 3000
  },
  error_file: '/var/log/pm2/client-error.log',
  out_file: '/var/log/pm2/client-out.log',
  autorestart: true,
  watch: false,
  max_memory_restart: '500M'
}
```

**أو:**

```javascript
{
  name: 'luzasculture-client',
  script: 'next',
  args: 'start',
  cwd: '/var/www/luzasculture/loza-client-master/loza-client-master',
  interpreter: '/usr/bin/node',
  env: {
    NODE_ENV: 'production',
    PORT: 3000
  },
  error_file: '/var/log/pm2/client-error.log',
  out_file: '/var/log/pm2/client-out.log',
  autorestart: true
}
```

---

## ✅ الحل 2: استخدام exec_mode: fork مع wait_ready

```javascript
{
  name: 'luzasculture-client',
  script: 'npm',
  args: 'start',
  cwd: '/var/www/luzasculture/loza-client-master/loza-client-master',
  exec_mode: 'fork',
  instances: 1,
  wait_ready: true,
  listen_timeout: 10000,
  kill_timeout: 5000,
  env: {
    NODE_ENV: 'production',
    PORT: 3000
  },
  error_file: '/var/log/pm2/client-error.log',
  out_file: '/var/log/pm2/client-out.log',
  autorestart: true
}
```

---

## ✅ الحل 3: إنشاء script منفصل

### إنشاء start-client.sh:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
nano start-client.sh
```

**الصق:**

```bash
#!/bin/bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
export NODE_ENV=production
export PORT=3000
exec node_modules/.bin/next start
```

**جعلها قابلة للتنفيذ:**

```bash
chmod +x start-client.sh
```

**استخدامها في ecosystem.config.js:**

```javascript
{
  name: 'luzasculture-client',
  script: './loza-client-master/loza-client-master/start-client.sh',
  cwd: '/var/www/luzasculture',
  env: {
    NODE_ENV: 'production',
    PORT: 3000
  },
  error_file: '/var/log/pm2/client-error.log',
  out_file: '/var/log/pm2/client-out.log',
  autorestart: true
}
```

---

## 📋 أمر التشخيص أولاً (للمشكلة الحقيقية):

```bash
echo "=== CHECKING WHAT'S USING PORT 3000 ===" && lsof -i :3000 -P -n && echo "" && echo "=== CHECKING PM2 PROCESSES ===" && ps aux | grep -E "pm2|next|node" | grep -v grep && echo "" && echo "=== CHECKING PM2 INFO ===" && pm2 describe luzasculture-client 2>&1 && echo "" && echo "=== TESTING NEXT DIRECTLY ===" && cd /var/www/luzasculture/loza-client-master/loza-client-master && timeout 5 node_modules/.bin/next start 2>&1 || echo "Command timed out or failed"
```

---

## ✅ الحل السريع - جرب هذا:

```bash
cd /var/www/luzasculture && pm2 delete luzasculture-client 2>/dev/null || true && pkill -9 next-server && pkill -9 -f "next start" && fuser -k 3000/tcp && sleep 3 && cat > /tmp/test-ecosystem.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '/var/www/luzasculture',
      env_file: './loza-server-master/loza-server-master/.env',
      env: { NODE_ENV: 'production', PORT: 8000 },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true
    },
    {
      name: 'luzasculture-client',
      script: './node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/luzasculture/loza-client-master/loza-client-master',
      env: { NODE_ENV: 'production', PORT: 3000 },
      error_file: '/var/log/pm2/client-error.log',
      out_file: '/var/log/pm2/client-out.log',
      autorestart: true,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
EOF
cp /tmp/test-ecosystem.js ecosystem.config.js && pm2 start ecosystem.config.js && pm2 save && sleep 5 && pm2 status && netstat -tulpn | grep :3000
```

---

**ابدأ بأمر التشخيص أولاً لأرى المشكلة الحقيقية!**

