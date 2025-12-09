# 🔧 حذف ملف الاختبار المسبب للمشكلة

## ⚠️ المشكلة:
- ❌ `test-order-status.js` في Server folder يسبب فشل build للـ Client
- ⚠️ Next.js يفحص ملفات Server أثناء البناء

---

## 📋 الحل: حذف الملف وإعادة البناء

### الأمر الكامل (انسخه وأرسله):

```bash
cd /var/www/luzasculture && \
echo "========================================" && \
echo "STEP 1: Delete problematic test file" && \
echo "========================================" && \
rm -f loza-server-master/loza-server-master/test-order-status.js && \
echo "✅ File deleted" && \
echo "" && \
echo "========================================" && \
echo "STEP 2: Delete ALL test files in server folder" && \
echo "========================================" && \
find loza-server-master/loza-server-master/ -name "test-*.js" -type f -delete && \
echo "✅ All test files deleted" && \
echo "" && \
echo "========================================" && \
echo "STEP 3: Clean and rebuild" && \
echo "========================================" && \
rm -rf .next node_modules/.cache 2>/dev/null && \
sudo -u luzauser npm run build 2>&1 | tail -30 && \
echo "" && \
echo "========================================" && \
echo "STEP 4: Verify build" && \
echo "========================================" && \
test -f .next/BUILD_ID && echo "✅ Build successful!" || echo "❌ Build failed" && \
echo "" && \
echo "========================================" && \
echo "STEP 5: Fix ecosystem.config.js" && \
echo "========================================" && \
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '/var/www/luzasculture',
      env_file: './loza-server-master/loza-server-master/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'luzasculture-client',
      script: './node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/luzasculture',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/client-error.log',
      out_file: '/var/log/pm2/client-out.log',
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000
    }
  ]
};
EOF
echo "✅ ecosystem.config.js fixed" && \
echo "" && \
echo "========================================" && \
echo "STEP 6: Kill all and restart PM2" && \
echo "========================================" && \
sudo -u luzauser pm2 kill 2>/dev/null; \
pkill -9 -f "next-server" 2>/dev/null; \
pkill -9 -f "node.*server.js" 2>/dev/null; \
fuser -k 3000/tcp 2>/dev/null; \
fuser -k 8000/tcp 2>/dev/null; \
sleep 3 && \
sudo -u luzauser pm2 start ecosystem.config.js && \
sudo -u luzauser pm2 save && \
sleep 10 && \
echo "" && \
echo "========================================" && \
echo "STEP 7: Final Status" && \
echo "========================================" && \
sudo -u luzauser pm2 status && \
echo "" && \
sudo -u luzauser pm2 logs --lines 10 --nostream
```

---

**🚀 هذا الحل سيفعل:**
1. ✅ يحذف `test-order-status.js`
2. ✅ يحذف جميع ملفات `test-*.js` في Server folder
3. ✅ ينظف ويبني Client
4. ✅ يصلح `ecosystem.config.js`
5. ✅ يعيد تشغيل PM2

---

**نفذ الأمر الآن!**

