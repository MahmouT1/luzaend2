# ✅ متابعة بعد إيقاف PM2

## ✅ تم بنجاح:
- PM2 Daemon Stopped
- All Applications Stopped

---

## 📋 الخطوات التالية:

### 1️⃣ التحقق من أن Port 3000 خالي:

```bash
netstat -tulpn | grep :3000
```

**يجب ألا يظهر شيء!**

---

### 2️⃣ Build Client:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
rm -rf .next node_modules/.cache
npm run build
```

**انتظر حتى ينتهي Build (2-5 دقائق)**

**يجب أن ترى في النهاية:**
```
✓ Compiled successfully
```

---

### 3️⃣ التحقق من Build:

```bash
ls -la .next
```

**يجب أن ترى مجلد `.next` مع ملفات!**

---

### 4️⃣ العودة إلى المجلد الرئيسي:

```bash
cd /var/www/luzasculture
```

---

### 5️⃣ تشغيل PM2:

```bash
pm2 start /var/www/luzasculture/ecosystem.config.js
```

**يجب أن ترى:**
```
[PM2] App [luzasculture-server] launched
[PM2] App [luzasculture-client] launched
```

---

### 6️⃣ حفظ PM2:

```bash
pm2 save
```

---

### 7️⃣ الانتظار:

```bash
sleep 3
```

---

### 8️⃣ التحقق من Status:

```bash
pm2 status
```

**يجب أن ترى:**
- `luzasculture-server` - online
- `luzasculture-client` - online

---

### 9️⃣ التحقق من Port 3000:

```bash
netstat -tulpn | grep :3000
```

**يجب أن ترى:** عملية واحدة فقط من PM2

---

### 🔟 التحقق من Logs:

```bash
pm2 logs luzasculture-client --lines 30
```

**يجب أن ترى:**
```
Ready on http://localhost:3000
```

**وليس أخطاء Port 3000!**

---

## 📋 جميع الأوامر في سلسلة واحدة (من هذه النقطة):

```bash
netstat -tulpn | grep :3000 && cd /var/www/luzasculture/loza-client-master/loza-client-master && rm -rf .next node_modules/.cache && npm run build && ls -la .next && cd /var/www/luzasculture && pm2 start /var/www/luzasculture/ecosystem.config.js && pm2 save && sleep 3 && pm2 status && netstat -tulpn | grep :3000 && pm2 logs luzasculture-client --lines 30
```

---

## ✅ بعد النجاح:

1. **افتح الموقع:** `https://luzasculture.org`
2. **امسح Browser Cache:** `Ctrl + Shift + Delete`
3. **تحقق من التعديلات:**
   - السعر بعد الخصم في السلة
   - Credit/Debit Card مخفي
   - Our Collection مع الروابط والـ scroll
4. **اختبر الإيميلات:** أنشئ طلب جديد

---

**✅ نفّذ الأوامر أعلاه - PM2 متوقف الآن، يمكنك المتابعة!**

