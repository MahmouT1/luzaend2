# 🔧 حل مشكلة الإيميلات على السيرفر

## ❌ المشكلة:
نظام الإيميلات يعمل على localhost لكن لا يعمل على السيرفر.

---

## ✅ الحل الشامل:

### 1️⃣ التحقق من ملف `.env` على السيرفر

**اتصل بالسيرفر:**
```bash
ssh root@luzasculture.org
```

**انتقل لمجلد المشروع:**
```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
```

**تحقق من وجود ملف `.env`:**
```bash
ls -la | grep .env
```

**إذا لم يكن موجوداً، أنشئه:**
```bash
nano .env
```

**الصق المحتوى التالي:**
```env
# Server Configuration
PORT=8000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Cloudinary
CLOUD_NAME=dxptnzuri
CLOUD_API_KEY=848427894577436
CLOUD_SECRET_KEY=Bs4GLoPFouvduveDQiFn4IHiL-k

# Email Configuration (Hostinger SMTP) - مهم جداً!
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465

# CORS Configuration
CLIENT_URL=https://luzasculture.org
ADMIN_URL=https://admin.luzasculture.org
```

**احفظ الملف:**
- اضغط `Ctrl + O` ثم `Enter`
- اضغط `Ctrl + X` للخروج

---

### 2️⃣ التحقق من محتوى ملف `.env`

**تحقق من أن المتغيرات موجودة:**
```bash
cat .env | grep EMAIL
```

**يجب أن ترى:**
```
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

---

### 3️⃣ إعادة تشغيل PM2 مع تحميل `.env`

**أوقف التطبيقات:**
```bash
pm2 stop all
```

**احذف التطبيقات من PM2:**
```bash
pm2 delete all
```

**تحقق من ملف `ecosystem.config.js`:**
```bash
cat /var/www/luzasculture/ecosystem.config.js
```

**يجب أن يحتوي على:**
```javascript
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '/var/www/luzasculture',
      env_file: './loza-server-master/loza-server-master/.env', // مهم!
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true
    },
    // ...
  ]
};
```

**إذا لم يكن `env_file` موجوداً، أضفه:**
```bash
nano /var/www/luzasculture/ecosystem.config.js
```

**أضف `env_file` في كل app:**
```javascript
env_file: './loza-server-master/loza-server-master/.env',
```

---

### 4️⃣ تحديث PM2 Configuration

**الطريقة الأفضل: استخدام `env_file` في PM2:**

```bash
cd /var/www/luzasculture
nano ecosystem.config.js
```

**تأكد من وجود `env_file` في كل app:**
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

**أو الطريقة البديلة: تمرير المتغيرات مباشرة:**

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
        ADMIN_URL: 'https://admin.luzasculture.org'
      },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true
    },
    // ...
  ]
};
```

---

### 5️⃣ إعادة تشغيل PM2

**ابدأ التطبيقات:**
```bash
cd /var/www/luzasculture
pm2 start ecosystem.config.js
```

**احفظ PM2:**
```bash
pm2 save
```

**تحقق من الحالة:**
```bash
pm2 status
```

---

### 6️⃣ اختبار المتغيرات البيئية

**تحقق من logs:**
```bash
pm2 logs luzasculture-server --lines 50
```

**ابحث عن:**
```
🔍 Creating Hostinger SMTP transporter:
SMTP Host: smtp.hostinger.com
SMTP Port: 465
Email User: orders@luzasculture.org
Email Pass configured: Yes (length: 12)
```

**إذا رأيت `Email Pass configured: No`، المشكلة في `.env`**

---

### 7️⃣ اختبار الإيميلات مباشرة

**أنشئ ملف اختبار:**
```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
nano test-email-server.js
```

**الصق:**
```javascript
import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log('🧪 Testing Email Configuration on Server:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET ❌');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET ✅ (length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET ❌');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.hostinger.com');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '465');

if (!process.env.EMAIL_PASS) {
  console.error('❌ ERROR: EMAIL_PASS is not set!');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'orders@luzasculture.org',
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Connection Verified!');
    
    transporter.sendMail({
      from: `"LUZA'S CULTURE" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Server',
      text: 'This is a test email from the server. If you receive this, email system is working!'
    }, (err, info) => {
      if (err) {
        console.error('❌ Email Send Error:', err);
      } else {
        console.log('✅ Email Sent Successfully!');
        console.log('Message ID:', info.messageId);
      }
      process.exit(0);
    });
  }
});
```

**شغّل الاختبار:**
```bash
node test-email-server.js
```

---

### 8️⃣ إذا لم يعمل: استخدام dotenv-cli

**ثبت dotenv-cli:**
```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
npm install -g dotenv-cli
```

**حدّث ecosystem.config.js:**
```javascript
{
  name: 'luzasculture-server',
  script: 'dotenv',
  args: '-e .env -- node server.js',
  cwd: '/var/www/luzasculture/loza-server-master/loza-server-master',
  // ...
}
```

---

## 🔍 خطوات التشخيص:

### 1. تحقق من موقع ملف `.env`:
```bash
find /var/www/luzasculture -name ".env" -type f
```

### 2. تحقق من محتوى `.env`:
```bash
cat /var/www/luzasculture/loza-server-master/loza-server-master/.env
```

### 3. تحقق من PM2 logs:
```bash
pm2 logs luzasculture-server --lines 100 | grep -i email
```

### 4. تحقق من المتغيرات البيئية في PM2:
```bash
pm2 show luzasculture-server | grep -A 20 "env:"
```

---

## ✅ الحل النهائي المضمون:

**استخدم الطريقة التالية في `ecosystem.config.js`:**

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
        PORT: 8000,
        // Fallback values (will be overridden by .env if exists)
        EMAIL_USER: 'orders@luzasculture.org',
        EMAIL_PASS: 'Memo.Ro2123',
        SMTP_HOST: 'smtp.hostinger.com',
        SMTP_PORT: '465'
      },
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      autorestart: true
    }
  ]
};
```

**ثم:**
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

---

## 📧 بعد الحل:

1. ✅ تحقق من logs: `pm2 logs luzasculture-server`
2. ✅ جرب عملية شراء من الموقع
3. ✅ تحقق من وصول الإيميل

---

**🎉 إذا اتبعت هذه الخطوات، سيعمل نظام الإيميلات على السيرفر!**

