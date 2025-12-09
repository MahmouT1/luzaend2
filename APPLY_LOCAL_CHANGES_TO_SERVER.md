# 🚀 تطبيق التعديلات المحلية على السيرفر

## ✅ التعديلات المطلوبة:

1. **السعر قبل وبعد الخصم في السلة** (cartSlice.js + cart/page.tsx)
2. **إخفاء Credit/Debit Card** من checkout page
3. **تحديث إعدادات الإيميل** (server .env + PM2 config)

---

## 📋 الخطوات الكاملة:

### الخطوة 1: رفع التعديلات إلى GitHub

#### على Local Machine:

```bash
# 1. الانتقال إلى مجلد المشروع
cd "C:\loza website\loza-client-master\loza-client-master"

# 2. إضافة التعديلات
git add .

# 3. عمل commit
git commit -m "Add discount price display, hide credit card, and update email config"

# 4. رفع إلى GitHub
git push origin main
```

---

### الخطوة 2: سحب التعديلات على السيرفر

#### على السيرفر:

```bash
# 1. الانتقال لمجلد المشروع
cd /var/www/luzasculture

# 2. سحب التعديلات
git pull origin main

# 3. التحقق من التعديلات
git log --oneline -5
```

---

### الخطوة 3: Build Client مع التعديلات الجديدة

```bash
# 1. الانتقال لمجلد Client
cd /var/www/luzasculture/loza-client-master/loza-client-master

# 2. حذف Build القديم
rm -rf .next node_modules/.cache

# 3. Build جديد
npm run build

# 4. التحقق من Build
ls -la .next | head -10
```

---

### الخطوة 4: تحديث إعدادات الإيميل على السيرفر

```bash
# 1. الانتقال لمجلد Server
cd /var/www/luzasculture/loza-server-master/loza-server-master

# 2. فتح ملف .env
nano .env
```

**تأكد من وجود:**

```env
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

**احفظ:** `Ctrl + X`, `Y`, `Enter`

---

### الخطوة 5: التحقق من ecosystem.config.js يحتوي على env_file

```bash
cd /var/www/luzasculture
cat ecosystem.config.js | grep env_file
```

**يجب أن يحتوي على:**

```javascript
env_file: './loza-server-master/loza-server-master/.env',
```

**إذا لم يكن موجوداً:**

```bash
nano ecosystem.config.js
```

**أضف `env_file` في إعدادات `luzasculture-server`:**

```javascript
{
  name: 'luzasculture-server',
  script: './loza-server-master/loza-server-master/server.js',
  cwd: '/var/www/luzasculture',
  env_file: './loza-server-master/loza-server-master/.env', // ⬅️ أضف هذا السطر!
  env: {
    NODE_ENV: 'production',
    PORT: 8000
  },
  // ... باقي الإعدادات
}
```

---

### الخطوة 6: إعادة تشغيل PM2

```bash
# 1. إعادة تشغيل Client
sudo -u luzauser pm2 restart luzasculture-client

# 2. إعادة تشغيل Server (لتحميل إعدادات الإيميل)
sudo -u luzauser pm2 restart luzasculture-server

# 3. حفظ PM2
sudo -u luzauser pm2 save

# 4. التحقق
sudo -u luzauser pm2 status
```

---

### الخطوة 7: التحقق من التطبيق

#### 1. التحقق من السعر في السلة:
- افتح `https://luzasculture.org/cart`
- أضف منتج يحتوي على خصم
- تأكد من ظهور:
  - السعر الأصلي (مشطوب)
  - السعر بعد الخصم

#### 2. التحقق من إخفاء Credit/Debit Card:
- افتح `https://luzasculture.org/checkout`
- تأكد من عدم ظهور خيار "Credit/Debit Card"
- يجب أن تظهر فقط:
  - Cash On Delivery
  - Instapay

#### 3. التحقق من الإيميلات:
- أنشئ طلب جديد
- تحقق من إرسال إيميل التأكيد
- تحقق من logs:

```bash
sudo -u luzauser pm2 logs luzasculture-server --lines 50 | grep -i email
```

---

## 📋 الأمر الكامل (نسخ ولصق على السيرفر):

```bash
echo "=== STEP 1: Pull Latest Changes ===" && cd /var/www/luzasculture && git pull origin main && echo "" && echo "=== STEP 2: Build Client ===" && cd loza-client-master/loza-client-master && rm -rf .next node_modules/.cache && npm run build && echo "" && echo "=== STEP 3: Verify Email Config ===" && cd ../../loza-server-master/loza-server-master && cat .env | grep EMAIL && echo "" && echo "=== STEP 4: Restart PM2 ===" && cd /var/www/luzasculture && sudo -u luzauser pm2 restart luzasculture-client && sudo -u luzauser pm2 restart luzasculture-server && sudo -u luzauser pm2 save && sleep 5 && echo "" && echo "=== STEP 5: Final Status ===" && sudo -u luzauser pm2 status
```

---

## ✅ التحقق النهائي:

### 1. Client Logs:

```bash
sudo -u luzauser pm2 logs luzasculture-client --lines 20 --nostream
```

### 2. Server Logs (للإيميلات):

```bash
sudo -u luzauser pm2 logs luzasculture-server --lines 30 --nostream | grep -i email
```

**يجب أن ترى:**
```
📧 Creating Hostinger SMTP transporter:
SMTP Host: smtp.hostinger.com
Email Pass configured: Yes
```

---

## 🎯 ملخص التعديلات:

1. ✅ **السعر قبل وبعد الخصم** - cartSlice.js + cart/page.tsx
2. ✅ **إخفاء Credit/Debit Card** - checkout/page.tsx
3. ✅ **إعدادات الإيميل** - .env + ecosystem.config.js

---

**✅ اتبع الخطوات أعلاه لتطبيق جميع التعديلات!**

