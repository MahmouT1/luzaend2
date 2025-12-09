# ✅ الخطوات التالية - PM2 متوقف، الآن Build وتشغيل

## ✅ تم بنجاح:
- PM2 Daemon Stopped
- All Applications Stopped

---

## 📋 الخطوات التالية - الأمر الكامل:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master && rm -rf .next node_modules/.cache && npm run build && ls -la .next && cd /var/www/luzasculture && pm2 start /var/www/luzasculture/ecosystem.config.js && pm2 save && sleep 5 && pm2 status && netstat -tulpn | grep :3000 && pm2 logs luzasculture-client --lines 30
```

---

## 📋 الخطوات المفصلة:

### 1️⃣ الانتقال إلى Client و Build:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build
```

**⚠️ انتظر حتى ينتهي Build (2-5 دقائق)**

**يجب أن ترى:**
```
✓ Compiled successfully
```

---

### 2️⃣ التحقق من Build:

```bash
ls -la .next
```

**يجب أن ترى مجلد `.next` مع ملفات!**

---

### 3️⃣ العودة وتشغيل PM2:

```bash
cd /var/www/luzasculture
pm2 start /var/www/luzasculture/ecosystem.config.js
pm2 save
```

---

### 4️⃣ الانتظار:

```bash
sleep 5
```

---

### 5️⃣ التحقق:

```bash
pm2 status
netstat -tulpn | grep :3000
pm2 logs luzasculture-client --lines 30
```

---

## ✅ النتيجة المتوقعة:

- ✅ Build تم بنجاح
- ✅ PM2 يعمل
- ✅ Client online
- ✅ Server online
- ✅ Port 3000 مستخدم من PM2 فقط
- ✅ Logs: `Ready on http://localhost:3000`

---

**✅ نسخ الأمر الكبير أعلاه وأرسله في Terminal!**

