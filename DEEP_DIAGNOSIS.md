# 🔍 تشخيص عميق - اكتشاف المشكلة الحقيقية

## 🎯 نهج مختلف - فحص شامل

المشكلة تتكرر دائماً - يجب فحص الأسباب الجذرية:

---

## 1️⃣ فحص: هل هناك نظام آخر يبدأ العمليات؟

### أ. فحص systemd services:

```bash
systemctl list-units | grep -E "luzasculture|next|node"
systemctl status luzasculture* 2>/dev/null
```

### ب. فحص cron jobs:

```bash
crontab -l
crontab -l -u root
cat /etc/crontab
ls -la /etc/cron.d/
```

### ج. فحص PM2 startup:

```bash
pm2 startup
pm2 save
```

---

## 2️⃣ فحص: هل PM2 يعمل بشكل صحيح؟

### أ. فحص PM2 daemon:

```bash
pm2 ping
pm2 info luzasculture-client
pm2 describe luzasculture-client
```

### ب. فحص PM2 logs:

```bash
pm2 logs luzasculture-client --err --lines 100
pm2 logs luzasculture-server --err --lines 100
```

---

## 3️⃣ فحص: هل المشكلة في كيفية تشغيل Next.js؟

### أ. التحقق من package.json scripts:

```bash
cat /var/www/luzasculture/loza-client-master/loza-client-master/package.json | grep -A 10 "scripts"
```

### ب. محاولة تشغيل Next.js مباشرة (بدون npm):

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
which next
./node_modules/.bin/next start
```

**أوقف بـ:** `Ctrl + C` بعد رؤية النتيجة

---

## 4️⃣ فحص: هل Port 3000 محجوز من نظام آخر؟

### أ. فحص iptables/firewall:

```bash
iptables -L -n | grep 3000
ufw status | grep 3000
```

### ب. فحص جميع العمليات على Port 3000:

```bash
lsof -i :3000
ss -tulpn | grep :3000
fuser -v 3000/tcp
```

---

## 5️⃣ فحص: هل ecosystem.config.js صحيح؟

### أ. فحص syntax:

```bash
cd /var/www/luzasculture
node -e "console.log(require('./ecosystem.config.js'))"
```

### ب. فحص المسارات:

```bash
ls -la /var/www/luzasculture/loza-client-master/loza-client-master/package.json
ls -la /var/www/luzasculture/loza-client-master/loza-client-master/.next
```

---

## 6️⃣ حل بديل: استخدام next-server مباشرة

بدلاً من `npm start`، يمكن استخدام:

```javascript
script: './node_modules/.bin/next',
args: 'start',
```

أو:

```javascript
script: 'next',
args: 'start',
```

---

## 7️⃣ حل بديل: تغيير طريقة التشغيل

### أ. استخدام exec_mode: cluster (للتجربة):

```javascript
exec_mode: 'fork', // بدلاً من cluster
instances: 1,
```

### ب. إيقاف autorestart مؤقتاً:

```javascript
autorestart: false, // للتجربة
max_restarts: 0,
```

---

## 📋 أمر التشخيص الكامل:

```bash
echo "=== SYSTEMD SERVICES ===" && systemctl list-units | grep -E "luzasculture|next|node" && echo "" && echo "=== CRON JOBS ===" && (crontab -l 2>/dev/null || echo "No crontab") && echo "" && echo "=== PM2 INFO ===" && pm2 info luzasculture-client 2>&1 && echo "" && echo "=== PORT 3000 DETAILED ===" && lsof -i :3000 && echo "" && echo "=== ECOSYSTEM CONFIG TEST ===" && cd /var/www/luzasculture && node -e "try { console.log(JSON.stringify(require('./ecosystem.config.js'), null, 2)); } catch(e) { console.error('ERROR:', e.message); }" && echo "" && echo "=== PACKAGE.JSON SCRIPTS ===" && cat /var/www/luzasculture/loza-client-master/loza-client-master/package.json | grep -A 10 "scripts"
```

---

**انسخ أمر التشخيص أعلاه وأرسل النتائج!**

