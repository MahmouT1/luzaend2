# 🔧 إصلاح تحميل متغيرات الإيميل في PM2

## ⚠️ المشكلة
المتغيرات موجودة في `.env` ولكن PM2 لا يقوم بتحميلها تلقائياً.

## ✅ الحل السريع

### الطريقة 1: استخدام `env_file` في PM2 (الأفضل)

#### 1️⃣ تحديث `ecosystem.config.js`:

```bash
cd /var/www/luzasculture
nano ecosystem.config.js
```

#### 2️⃣ تأكد من وجود `env_file` في إعدادات `luzasculture-server`:

```javascript
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '/var/www/luzasculture',
      env_file: './loza-server-master/loza-server-master/.env', // ⬅️ مهم جداً!
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

#### 3️⃣ تنظيف ملف `.env` (إزالة التكرار):

```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
nano .env
```

تأكد من أن الملف يحتوي على كل متغير مرة واحدة فقط:

```env
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars
CLOUD_NAME=dxptnzuri
CLOUD_API_KEY=848427894577436
CLOUD_SECRET_KEY=Bs4GLoPFouvduveDQiFn4IHiL-k
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
CLIENT_URL=https://luzasculture.org
ADMIN_URL=https://admin.luzasculture.org
```

#### 4️⃣ إعادة تشغيل PM2:

```bash
cd /var/www/luzasculture
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

---

### الطريقة 2: تمرير المتغيرات مباشرة في PM2 (بديل)

إذا لم تعمل الطريقة الأولى، استخدم هذه الطريقة:

```javascript
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '/var/www/luzasculture',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
        EMAIL_USER: 'orders@luzasculture.org',
        EMAIL_PASS: 'Memo.Ro2123',
        SMTP_HOST: 'smtp.hostinger.com',
        SMTP_PORT: '465',
        MONGODB_URI: 'mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/',
        CLOUD_NAME: 'dxptnzuri',
        CLOUD_API_KEY: '848427894577436',
        CLOUD_SECRET_KEY: 'Bs4GLoPFouvduveDQiFn4IHiL-k',
        CLIENT_URL: 'https://luzasculture.org',
        ADMIN_URL: 'https://admin.luzasculture.org',
        JWT_SECRET: 'your-super-secret-jwt-key-change-this-to-random-string-min-32-chars'
      },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true
    },
    // ... client config
  ]
};
```

---

## ✅ التحقق من الحل

### 1️⃣ تحقق من logs:

```bash
pm2 logs luzasculture-server --lines 50
```

ابحث عن:
```
🔍 Creating Hostinger SMTP transporter:
SMTP Host: smtp.hostinger.com
SMTP Port: 465
Email User: orders@luzasculture.org
Email Pass configured: Yes (length: 12)
```

### 2️⃣ تحقق من المتغيرات البيئية في PM2:

```bash
pm2 show luzasculture-server | grep -A 30 "env:"
```

يجب أن ترى `EMAIL_USER` و `EMAIL_PASS` في القائمة.

### 3️⃣ اختبار الإيميلات:

أنشئ طلب جديد من الموقع وتحقق من وصول الإيميل.

---

## 🔍 حل المشاكل الشائعة

### المشكلة 1: `env_file` غير مدعوم في PM2

إذا كان إصدار PM2 قديم ولا يدعم `env_file`:

1. استخدم الطريقة 2 (تمرير المتغيرات مباشرة)
2. أو قم بتحديث PM2:
```bash
npm install -g pm2@latest
```

### المشكلة 2: المتغيرات لا تزال غير محملة

تأكد من:
1. إعادة تشغيل PM2 بالكامل: `pm2 delete all && pm2 start ecosystem.config.js`
2. التحقق من مسار `.env` الصحيح
3. التحقق من صلاحيات ملف `.env`

### المشكلة 3: خطأ في الاتصال بـ SMTP

جرب تغيير `SMTP_PORT` إلى `587`:
```env
SMTP_PORT=587
```

---

## 📋 قائمة التحقق

- [ ] ملف `.env` موجود ومحتوي على المتغيرات
- [ ] تم إضافة `env_file` في `ecosystem.config.js` (أو تمرير المتغيرات مباشرة)
- [ ] تم إعادة تشغيل PM2 بالكامل
- [ ] تم التحقق من logs
- [ ] تم اختبار إنشاء طلب جديد

---

**✅ بعد اتباع هذه الخطوات، يجب أن يعمل نظام الإيميلات!**

