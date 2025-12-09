# 🔍 تشخيص شامل وحل نهائي - Port 3000

## 🤔 المشكلة:
Client كان يعمل جيداً على Port 3000 من قبل، لكن الآن لا يعمل.

**السبب المحتمل:** هناك عملية أخرى تستخدم Port 3000 أو PM2 يحاول تشغيل Client مرتين.

---

## 🔍 المرحلة 1: التشخيص الكامل

### 1️⃣ إيجاد جميع العمليات على Port 3000:

```bash
lsof -i :3000
```

**أو:**

```bash
netstat -tulpn | grep :3000
```

**اكتب الناتج - سنحتاجه!**

---

### 2️⃣ إيجاد جميع عمليات Node:

```bash
ps aux | grep node
```

**اكتب الناتج - سنحتاجه!**

---

### 3️⃣ إيجاد جميع عمليات Next.js:

```bash
ps aux | grep next
```

---

### 4️⃣ التحقق من PM2:

```bash
pm2 list
pm2 status
```

---

## ✅ المرحلة 2: الحل الكامل

### الخطوة 1: إيقاف PM2 تماماً

```bash
pm2 stop all
pm2 delete all
pm2 kill
```

---

### الخطوة 2: إيقاف جميع عمليات Node و Next.js

```bash
# إيقاف جميع Node
pkill -9 node

# إيقاف جميع Next.js
pkill -9 next-server
pkill -9 -f "next start"
pkill -9 -f "next-server"
pkill -9 -f "node.*next"
```

---

### الخطوة 3: إيقاف Port 3000 بقوة

```bash
# إيقاف Port 3000
fuser -k 3000/tcp
fuser -k 3000/udp

# أو إذا لم يعمل
lsof -ti:3000 | xargs kill -9
```

---

### الخطوة 4: الانتظار

```bash
sleep 5
```

---

### الخطوة 5: التحقق من أن كل شيء متوقف

```bash
# التحقق من Port 3000
netstat -tulpn | grep :3000
lsof -i :3000

# التحقق من عمليات Node
ps aux | grep node

# يجب ألا يظهر شيء!
```

---

### الخطوة 6: Build Client

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

**انتظر حتى ينتهي Build (2-5 دقائق)**

---

### الخطوة 7: التحقق من ecosystem.config.js

```bash
cd /var/www/luzasculture
cat ecosystem.config.js
```

**تأكد من:**
- Client لديه `PORT: 3000`
- Server لديه `PORT: 8000`
- لا يوجد تكرار في الإعدادات

---

### الخطوة 8: تشغيل PM2 بشكل صحيح

```bash
cd /var/www/luzasculture
pm2 start /var/www/luzasculture/ecosystem.config.js
```

---

### الخطوة 9: حفظ PM2

```bash
pm2 save
```

---

### الخطوة 10: الانتظار

```bash
sleep 5
```

---

### الخطوة 11: التحقق الكامل

```bash
# Status
pm2 status

# Port 3000
netstat -tulpn | grep :3000

# يجب أن ترى: عملية واحدة فقط من PM2!

# Logs
pm2 logs luzasculture-client --lines 30
```

---

## 📋 الأمر الكامل (نسخ ولصق):

```bash
pm2 stop all && pm2 delete all && pm2 kill && pkill -9 node && pkill -9 next-server && pkill -9 -f "next start" && pkill -9 -f "next-server" && pkill -9 -f "node.*next" && fuser -k 3000/tcp && fuser -k 3000/udp && sleep 5 && netstat -tulpn | grep :3000 && ps aux | grep node && cd /var/www/luzasculture/loza-client-master/loza-client-master && rm -rf .next node_modules/.cache && npm run build && cd /var/www/luzasculture && cat ecosystem.config.js && pm2 start /var/www/luzasculture/ecosystem.config.js && pm2 save && sleep 5 && pm2 status && netstat -tulpn | grep :3000 && pm2 logs luzasculture-client --lines 30
```

---

## 🔧 إذا استمرت المشكلة - حل متقدم:

### الحل 1: فحص ecosystem.config.js للتأكد من عدم التكرار

```bash
cd /var/www/luzasculture
cat ecosystem.config.js
```

**تأكد من أن Client موجود مرة واحدة فقط!**

---

### الحل 2: تشغيل Client يدوياً للتحقق

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
PORT=3000 npm start
```

**إذا عمل هنا = المشكلة في PM2 config**

---

### الحل 3: تغيير Port Client إلى 3001

```bash
cd /var/www/luzasculture
nano ecosystem.config.js
```

**غيّر:**
```javascript
{
  name: 'luzasculture-client',
  env: {
    PORT: 3001  // غيّر من 3000 إلى 3001
  }
}
```

**ثم:**
```bash
pm2 delete all
pm2 start /var/www/luzasculture/ecosystem.config.js
pm2 save
```

---

## ✅ التحقق النهائي:

### 1. PM2 Status:
```bash
pm2 status
```
**يجب أن ترى:** كلاهما online

### 2. Port 3000:
```bash
netstat -tulpn | grep :3000
```
**يجب أن ترى:** عملية واحدة فقط من PM2

### 3. Logs:
```bash
pm2 logs luzasculture-client --lines 30
```
**يجب أن ترى:** `Ready on http://localhost:3000`

### 4. لا توجد عمليات Node أخرى:
```bash
ps aux | grep node
```
**يجب أن ترى:** فقط عمليات PM2

---

**✅ هذا الحل الشامل يجب أن يحل المشكلة!**

