# 🔍 التحقق من تحميل متغيرات الإيميل

## ✅ الـ Server يعمل جيداً:
- ✅ Server على port 8000
- ✅ متصل بـ MongoDB
- ✅ Auto-unlock system نشط

## ⚠️ لكن لا توجد رسائل عن نظام الإيميلات!

---

## 🔍 التحقق السريع:

### 1️⃣ تحقق من تحميل المتغيرات في PM2:

```bash
pm2 show luzasculture-server | grep -A 30 "env:"
```

**ابحث عن:**
- `EMAIL_USER`
- `EMAIL_PASS`
- `SMTP_HOST`
- `SMTP_PORT`

**إذا لم توجد، PM2 لم يحمّل `.env` بعد!**

---

### 2️⃣ تحقق من `ecosystem.config.js`:

```bash
cat /var/www/luzasculture/ecosystem.config.js | grep -A 10 "luzasculture-server"
```

**يجب أن ترى:**
```javascript
env_file: './loza-server-master/loza-server-master/.env',
```

**إذا لم يكن موجوداً، أضفه!**

---

### 3️⃣ اختبار تحميل المتغيرات:

```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
node -e "require('dotenv/config'); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (' + process.env.EMAIL_PASS.length + ' chars)' : 'NOT SET');"
```

**يجب أن ترى:**
```
EMAIL_USER: orders@luzasculture.org
EMAIL_PASS: SET (12 chars)
```

---

## 🔧 إذا لم تكن المتغيرات محملة:

### الحل: تحديث `ecosystem.config.js`

```bash
cd /var/www/luzasculture
nano ecosystem.config.js
```

**أضف `env_file` في إعدادات `luzasculture-server`:**

```javascript
{
  name: 'luzasculture-server',
  script: './loza-server-master/loza-server-master/server.js',
  cwd: '/var/www/luzasculture',
  env_file: './loza-server-master/loza-server-master/.env', // ⬅️ أضف هذا!
  env: {
    NODE_ENV: 'production',
    PORT: 8000
  },
  // ...
}
```

**ثم:**

```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

---

### أو استخدم الطريقة البديلة (تمرير المتغيرات مباشرة):

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 8000,
  EMAIL_USER: 'orders@luzasculture.org',
  EMAIL_PASS: 'Memo.Ro2123',
  SMTP_HOST: 'smtp.hostinger.com',
  SMTP_PORT: '465',
  // ... باقي المتغيرات
}
```

---

## ✅ بعد التحديث، تحقق من الـ Logs:

```bash
pm2 logs luzasculture-server --lines 100 | grep -i email
```

**يجب أن ترى رسائل مثل:**
```
🔍 Creating Hostinger SMTP transporter:
SMTP Host: smtp.hostinger.com
SMTP Port: 465
Email User: orders@luzasculture.org
Email Pass configured: Yes (length: 12)
```

---

## 📧 اختبار الإيميلات:

بعد التأكد من تحميل المتغيرات:

1. أنشئ طلب جديد من الموقع
2. راقب الـ logs:
```bash
pm2 logs luzasculture-server --lines 50
```

**يجب أن ترى:**
```
📧 Preparing to send order confirmation email...
📧 Customer email: [البريد الإلكتروني]
📤 Sending email via Hostinger SMTP...
✅ Order confirmation email sent successfully!
```

---

## 📋 قائمة التحقق:

- [ ] `ecosystem.config.js` يحتوي على `env_file`
- [ ] تم إعادة تشغيل PM2 بعد التحديث
- [ ] `pm2 show luzasculture-server` يظهر المتغيرات
- [ ] الـ logs تظهر رسائل SMTP
- [ ] تم اختبار إنشاء طلب جديد

---

**✅ بعد التأكد من تحميل المتغيرات، سيظهر نظام الإيميلات في الـ logs!**

