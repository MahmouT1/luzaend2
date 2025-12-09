# 🔧 إنشاء ecosystem.config.js - الحل النهائي

## ⚠️ المشكلة:
- ❌ `ecosystem.config.js` غير موجود في `/var/www/luzasculture`
- ❌ PM2 لا يستطيع بدء Client بدون هذا الملف
- ✅ Port 3000 خالي (جيد!)

---

## ✅ الحل:

### 1️⃣ التحقق من وجود الملف:

```bash
ls -la /var/www/luzasculture/ecosystem.config.js
```

---

### 2️⃣ إنشاء الملف:

```bash
cd /var/www/luzasculture
nano ecosystem.config.js
```

**الصق هذا المحتوى:**

```javascript
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
      autorestart: true
    },
    {
      name: 'luzasculture-client',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/luzasculture/loza-client-master/loza-client-master',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/client-error.log',
      out_file: '/var/log/pm2/client-out.log',
      autorestart: true
    }
  ]
};
```

**حفظ:**
- `Ctrl + X`
- `Y`
- `Enter`

---

## 📋 الأمر الكامل (إنشاء الملف وبدء PM2):

```bash
cd /var/www/luzasculture && cat > ecosystem.config.js << 'EOF'
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
      autorestart: true
    },
    {
      name: 'luzasculture-client',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/luzasculture/loza-client-master/loza-client-master',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/client-error.log',
      out_file: '/var/log/pm2/client-out.log',
      autorestart: true
    }
  ]
};
EOF
ls -la ecosystem.config.js && echo "" && echo "=== Starting PM2 ===" && pm2 start ecosystem.config.js && pm2 save && sleep 5 && echo "" && echo "=== PM2 Status ===" && pm2 status && echo "" && echo "=== Port 3000 ===" && netstat -tulpn | grep :3000 && echo "" && echo "=== Client Logs ===" && pm2 logs luzasculture-client --lines 30
```

---

## ✅ النتيجة المتوقعة:

- ✅ `ecosystem.config.js` تم إنشاؤه
- ✅ PM2 يبدأ Client وServer
- ✅ PM2 Status يظهر كلا التطبيقين (online)
- ✅ Port 3000 مستخدم من PM2
- ✅ Logs: `Ready on http://localhost:3000`

---

**✅ نسخ الأمر الكبير أعلاه!**

