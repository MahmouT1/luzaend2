# 🚀 تطبيق جميع التعديلات على السيرفر - دليل شامل

## ⚠️ المشكلة:
جميع التعديلات لم تظهر على السيرفر لأن PM2 لم يكن يعمل بشكل صحيح!

---

## ✅ الحل الكامل - خطوة بخطوة:

### 1️⃣ Build Client (مهم جداً!)

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build
```

**انتظر حتى ينتهي Build** (قد يستغرق دقائق)

---

### 2️⃣ التحقق من `ecosystem.config.js`:

```bash
cd /var/www/luzasculture
cat ecosystem.config.js
```

**إذا كان موجوداً، تأكد من أنه يحتوي على:**

```javascript
module.exports = {
  apps: [
    {
      name: 'luzasculture-server',
      script: './loza-server-master/loza-server-master/server.js',
      cwd: '/var/www/luzasculture',
      env_file: './loza-server-master/loza-server-master/.env', // ⬅️ مهم!
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

**إذا لم يكن موجوداً أو يحتاج تحديث:**

```bash
nano ecosystem.config.js
```

الصق المحتوى أعلاه، ثم:
- `Ctrl + X`
- `Y`
- `Enter`

---

### 3️⃣ إنشاء مجلدات الـ Logs:

```bash
mkdir -p /var/log/pm2
```

---

### 4️⃣ إيقاف وحذف جميع عمليات PM2 القديمة:

```bash
pm2 stop all
pm2 delete all
```

---

### 5️⃣ تشغيل الخدمات من `ecosystem.config.js`:

```bash
cd /var/www/luzasculture
pm2 start ecosystem.config.js
```

**يجب أن ترى:**
```
[PM2] Starting ecosystem.config.js
[PM2] Process luzasculture-server started
[PM2] Process luzasculture-client started
```

---

### 6️⃣ حفظ إعدادات PM2:

```bash
pm2 save
```

هذا يضمن أن الخدمات ستعمل تلقائياً عند إعادة التشغيل.

---

### 7️⃣ التحقق من حالة PM2:

```bash
pm2 status
```

**يجب أن ترى:**
```
┌─────┬──────────────────────────┬─────────┬─────────┐
│ id  │ name                     │ status  │
├─────┼──────────────────────────┼─────────┤
│ 0   │ luzasculture-server      │ online  │
│ 1   │ luzasculture-client      │ online  │
└─────┴──────────────────────────┴─────────┴──────────┘
```

---

### 8️⃣ التحقق من Server Logs:

```bash
pm2 logs luzasculture-server --lines 30
```

**يجب أن ترى:**
```
Server is running on port 8000
✓ Connected to MongoDB
🔍 Creating Hostinger SMTP transporter:
Email Pass configured: Yes (length: 12)
```

---

### 9️⃣ التحقق من Client Logs:

```bash
pm2 logs luzasculture-client --lines 30
```

**يجب أن ترى:**
```
Ready on http://localhost:3000
```

---

### 🔟 التحقق من المتغيرات البيئية:

```bash
pm2 show luzasculture-server | grep -A 50 "env:"
```

**يجب أن ترى:**
```
env:
  EMAIL_USER: 'orders@luzasculture.org'
  EMAIL_PASS: 'Memo.Ro2123'
  SMTP_HOST: 'smtp.hostinger.com'
  SMTP_PORT: '465'
  ...
```

---

## ✅ التحقق من التعديلات:

### 1. السعر في السلة:
- افتح الموقع: `https://luzasculture.org`
- أضف منتج له خصم للسلة
- تحقق من ظهور السعر **بعد الخصم** في السلة

### 2. صفحة Checkout:
- تأكد من **عدم** ظهور خيار "Credit/Debit Card"
- يجب أن يظهر فقط: "Cash On Delivery" و "Instapay"

### 3. قسم "Our Collection":
- تحقق من أن النص "Our Collection" قابل للنقر
- تحقق من أن الصور قابلة للنقر
- على الموبايل: تحقق من وجود scroll جانبي

### 4. الإيميلات:
- أنشئ طلب جديد
- راقب الـ logs:
```bash
pm2 logs luzasculture-server --lines 100
```
- يجب أن ترى:
```
📧 Preparing to send order confirmation email...
✅ Order confirmation email sent successfully!
```

---

## 🔧 إذا كانت هناك مشاكل:

### المشكلة 1: Client لا يعمل
```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build
pm2 restart luzasculture-client
```

### المشكلة 2: Server لا يعمل
```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
npm install
pm2 restart luzasculture-server
pm2 logs luzasculture-server
```

### المشكلة 3: الإيميلات لا تعمل
```bash
# تحقق من المتغيرات
pm2 show luzasculture-server | grep -A 50 "env:"

# إذا لم تظهر، تحقق من .env
cat /var/www/luzasculture/loza-server-master/loza-server-master/.env | grep EMAIL

# أعد تشغيل Server
pm2 restart luzasculture-server
```

---

## 📋 ملخص الأوامر (نسخ ولصق):

```bash
# 1. Build Client
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build

# 2. التحقق من ecosystem.config.js
cd /var/www/luzasculture
cat ecosystem.config.js

# 3. إنشاء مجلدات logs
mkdir -p /var/log/pm2

# 4. حذف القديم
pm2 delete all

# 5. تشغيل جديد
pm2 start ecosystem.config.js

# 6. حفظ
pm2 save

# 7. التحقق
pm2 status
pm2 logs luzasculture-server --lines 30
pm2 logs luzasculture-client --lines 30
```

---

## 🎯 النتيجة المتوقعة:

بعد إكمال جميع الخطوات:
- ✅ جميع التعديلات ستظهر على الموقع
- ✅ السعر بعد الخصم في السلة
- ✅ Credit/Debit Card مخفي
- ✅ نظام الإيميلات يعمل
- ✅ Our Collection مع الروابط والـ scroll

---

**✅ اتبع هذه الخطوات بالترتيب وستعمل جميع التعديلات!**

