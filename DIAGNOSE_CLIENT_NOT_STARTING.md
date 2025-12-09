# 🔍 تشخيص: Client لم يبدأ بعد pm2 start

## ⚠️ المشكلة:
- ✅ Client تم إيقافه وحذفه بنجاح
- ✅ Server يعمل (online)
- ❌ Client لم يبدأ بعد `pm2 start`
- ❌ Client غير موجود في `pm2 status`

---

## 📋 خطوات التشخيص:

### 1️⃣ التحقق من Logs (الخطأ):

```bash
pm2 logs luzasculture-client --lines 50 --nostream
```

**أو:**

```bash
cat /var/log/pm2/client-error.log | tail -50
```

---

### 2️⃣ التحقق من Port 3000:

```bash
netstat -tulpn | grep :3000
```

**أو:**

```bash
lsof -i :3000
```

---

### 3️⃣ التحقق من ملف ecosystem.config.js:

```bash
cat /var/www/luzasculture/ecosystem.config.js
```

---

### 4️⃣ محاولة بدء Client بشكل منفصل:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
pm2 start npm --name "luzasculture-client" -- start
```

---

### 5️⃣ التحقق من وجود ملف .next:

```bash
ls -la /var/www/luzasculture/loza-client-master/loza-client-master/.next
```

---

## 🔧 الحل المحتمل:

### إذا كان المشكلة في ecosystem.config.js:

```bash
cd /var/www/luzasculture
cat ecosystem.config.js
```

**تحقق من:**
- ✅ `script` موجود للـ client
- ✅ `cwd` صحيح
- ✅ `env` صحيح
- ✅ لا توجد أخطاء syntax

---

### إذا كان المشكلة في Port 3000:

```bash
fuser -k 3000/tcp
pkill -9 next-server
pkill -9 -f "next start"
sleep 2
pm2 restart ecosystem.config.js
```

---

### إذا كان المشكلة في Build:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
ls -la .next
```

**إذا لم يوجد .next:**

```bash
rm -rf .next node_modules/.cache
npm run build
cd /var/www/luzasculture
pm2 start ecosystem.config.js
```

---

## 📋 الأمر الكامل للتشخيص:

```bash
pm2 logs luzasculture-client --lines 50 --nostream && echo "=== PORT 3000 ===" && netstat -tulpn | grep :3000 && echo "=== ECOSYSTEM.CONFIG.JS ===" && cat /var/www/luzasculture/ecosystem.config.js && echo "=== .NEXT DIRECTORY ===" && ls -la /var/www/luzasculture/loza-client-master/loza-client-master/.next | head -20
```

---

## ✅ بعد التشخيص:

أرسل النتائج وسأقوم بحل المشكلة!

