# 🚀 رفع التعديلات المحلية إلى السيرفر

## ✅ التعديلات الموجودة محلياً:
1. ✅ **السعر قبل وبعد الخصم في السلة** (cartSlice.js + cart/page.tsx)
2. ✅ **إخفاء Credit/Debit Card** (checkout/page.tsx)
3. ✅ **إعدادات الإيميل** (موجودة بالفعل)

---

## 📋 الخطوات الكاملة:

### 🔵 على Local Machine (Windows):

#### الخطوة 1: رفع التعديلات إلى GitHub

```bash
# 1. الانتقال إلى مجلد Client
cd "C:\loza website\loza-client-master\loza-client-master"

# 2. التحقق من التعديلات
git status

# 3. إضافة جميع التعديلات
git add .

# 4. عمل commit
git commit -m "Add discount price display in cart, hide credit card option, and update email config"

# 5. رفع إلى GitHub
git push origin main
```

**إذا كان هناك remote آخر (مثل `luzaend` أو `luzaend2`):**

```bash
# التحقق من remote
git remote -v

# إذا كان origin مختلف، استخدم:
git push origin main
# أو
git push luzaend main
```

---

### 🔴 على السيرفر (Linux):

#### الخطوة 2: سحب التعديلات

```bash
# 1. الانتقال لمجلد المشروع
cd /var/www/luzasculture

# 2. التحقق من remote
git remote -v

# 3. سحب التعديلات
git pull origin main

# إذا كان remote مختلف:
# git pull luzaend main
# أو
# git pull luzaend2 main

# 4. التحقق من التعديلات
git log --oneline -3
```

---

#### الخطوة 3: Build Client

```bash
# 1. الانتقال لمجلد Client
cd /var/www/luzasculture/loza-client-master/loza-client-master

# 2. حذف Build القديم
rm -rf .next node_modules/.cache

# 3. Build جديد
npm run build

# 4. التحقق من Build
ls -la .next | head -10

# يجب أن ترى مجلد .next مع الملفات!
```

---

#### الخطوة 4: التحقق من إعدادات الإيميل

```bash
# 1. الانتقال لمجلد Server
cd /var/www/luzasculture/loza-server-master/loza-server-master

# 2. التحقق من .env
cat .env | grep EMAIL

# يجب أن ترى:
# EMAIL_USER=orders@luzasculture.org
# EMAIL_PASS=Memo.Ro2123
# SMTP_HOST=smtp.hostinger.com
# SMTP_PORT=465

# 3. إذا لم تكن موجودة، أضفها:
nano .env
```

**الصق:**
```env
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

**احفظ:** `Ctrl + X`, `Y`, `Enter`

---

#### الخطوة 5: التحقق من ecosystem.config.js

```bash
cd /var/www/luzasculture
cat ecosystem.config.js | grep -A 15 "luzasculture-server"
```

**يجب أن يحتوي على `env_file`:**

```javascript
{
  name: 'luzasculture-server',
  script: './loza-server-master/loza-server-master/server.js',
  cwd: '/var/www/luzasculture',
  env_file: './loza-server-master/loza-server-master/.env', // ⬅️ مهم!
  env: {
    NODE_ENV: 'production',
    PORT: 8000
  },
  // ...
}
```

**إذا لم يكن موجوداً:**

```bash
nano ecosystem.config.js
```

**أضف `env_file` في إعدادات `luzasculture-server`**

---

#### الخطوة 6: إعادة تشغيل PM2

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

## 📋 الأمر الكامل على السيرفر (بعد رفع التعديلات إلى GitHub):

```bash
echo "=== STEP 1: Pull Changes ===" && cd /var/www/luzasculture && git pull origin main && echo "" && echo "=== STEP 2: Build Client ===" && cd loza-client-master/loza-client-master && rm -rf .next node_modules/.cache && npm run build && echo "" && echo "=== STEP 3: Verify Email Config ===" && cd ../../loza-server-master/loza-server-master && cat .env | grep EMAIL && echo "" && echo "=== STEP 4: Restart PM2 ===" && cd /var/www/luzasculture && sudo -u luzauser pm2 restart luzasculture-client && sudo -u luzauser pm2 restart luzasculture-server && sudo -u luzauser pm2 save && sleep 5 && echo "" && echo "=== STEP 5: Final Status ===" && sudo -u luzauser pm2 status
```

---

## ✅ التحقق النهائي:

### 1. السعر في السلة:
- افتح `https://luzasculture.org/cart`
- أضف منتج يحتوي على خصم
- تأكد من ظهور:
  - ✅ السعر الأصلي (مشطوب)
  - ✅ السعر بعد الخصم

### 2. إخفاء Credit/Debit Card:
- افتح `https://luzasculture.org/checkout`
- تأكد من عدم ظهور "Credit/Debit Card"
- ✅ يجب أن تظهر فقط: Cash On Delivery و Instapay

### 3. الإيميلات:
- أنشئ طلب جديد
- تحقق من إرسال إيميل التأكيد
- تحقق من logs:

```bash
sudo -u luzauser pm2 logs luzasculture-server --lines 30 | grep -i email
```

---

## 🎯 ملخص الخطوات:

### على Local:
1. `git add .`
2. `git commit -m "message"`
3. `git push origin main`

### على Server:
1. `git pull origin main`
2. `cd loza-client-master/loza-client-master && rm -rf .next && npm run build`
3. `sudo -u luzauser pm2 restart luzasculture-client`
4. `sudo -u luzauser pm2 restart luzasculture-server`
5. `sudo -u luzauser pm2 save`

---

**✅ ابدأ برفع التعديلات على Local ثم سحبها على السيرفر!**

