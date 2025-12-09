# 🔧 Build Client وإعادة التشغيل

## ⚠️ المشكلة:
PM2 يعمل لكن التعديلات لم تظهر - المشكلة أن Client لم يتم بناءه!

---

## ✅ الحل - Build Client أولاً:

### 1️⃣ Build Client (مهم جداً - هذا ما ناقص!):

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build
```

**انتظر حتى ينتهي Build** (قد يستغرق 2-5 دقائق)

**يجب أن ترى في النهاية:**
```
✓ Compiled successfully
```

---

### 2️⃣ بعد انتهاء Build، أعد تشغيل Client:

```bash
pm2 restart luzasculture-client
```

**أو:**

```bash
pm2 delete luzasculture-client
cd /var/www/luzasculture
pm2 start ecosystem.config.js --only luzasculture-client
pm2 save
```

---

### 3️⃣ التحقق من Client Logs:

```bash
pm2 logs luzasculture-client --lines 30
```

**يجب أن ترى:**
```
Ready on http://localhost:3000
```

---

### 4️⃣ التحقق من أن Build تم بنجاح:

```bash
ls -la /var/www/luzasculture/loza-client-master/loza-client-master/.next
```

**يجب أن ترى مجلد `.next` مع ملفات كثيرة.**

---

### 5️⃣ إذا فشل Build:

#### أ) تثبيت Dependencies:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
npm install
```

#### ب) تنظيف وإعادة Build:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache node_modules
npm install
npm run build
```

---

### 6️⃣ التحقق من Server والمتغيرات البيئية:

```bash
pm2 show luzasculture-server | grep -A 50 "env:"
```

**يجب أن ترى:**
```
env:
  EMAIL_USER: 'orders@luzasculture.org'
  EMAIL_PASS: 'Memo.Ro2123'
  ...
```

**إذا لم تظهر، أعد تشغيل Server:**

```bash
pm2 restart luzasculture-server
```

---

### 7️⃣ التحقق من Server Logs:

```bash
pm2 logs luzasculture-server --lines 50 | grep -i email
```

**يجب أن ترى:**
```
🔍 Creating Hostinger SMTP transporter:
Email Pass configured: Yes (length: 12)
```

---

## 📋 الأوامر السريعة (نسخ ولصق):

```bash
# 1. Build Client
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build

# 2. أعد تشغيل Client
pm2 restart luzasculture-client

# 3. التحقق
pm2 logs luzasculture-client --lines 30
pm2 status
```

---

## ✅ بعد Build وتشغيل Client:

1. **افتح الموقع:** `https://luzasculture.org`
2. **امسح Browser Cache** (Ctrl+Shift+Delete أو Cmd+Shift+Delete)
3. **تحقق من التعديلات:**
   - السعر بعد الخصم في السلة
   - Credit/Debit Card مخفي في checkout
   - Our Collection مع الروابط والـ scroll

---

## 🔍 إذا لم تظهر التعديلات بعد Build:

### 1. امسح Browser Cache:
- Chrome/Edge: `Ctrl + Shift + Delete`
- اختر "Cached images and files"
- اضغط "Clear data"

### 2. تحقق من أن Build تم بنجاح:
```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
ls -la .next/BUILD_ID
```

### 3. تحقق من Client Logs للأخطاء:
```bash
pm2 logs luzasculture-client --lines 100
```

### 4. أعد تشغيل Client:
```bash
pm2 restart luzasculture-client
```

---

**✅ Build Client أولاً - هذه هي الخطوة المفقودة!**

