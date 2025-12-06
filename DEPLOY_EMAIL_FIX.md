# 🚀 دليل رفع التعديلات وتشغيل سكربت الإيميلات

---

## 📋 الجزء الأول: رفع التعديلات على Git

### الأوامر الكاملة (انسخها كلها):

```bash
cd "C:\loza website"
git add .
git commit -m "Fix email system on server - add bestsellers endpoint and email service fixes"
git push origin main
```

---

## 📋 الجزء الثاني: على السيرفر

### 1️⃣ سحب التعديلات:

```bash
ssh root@luzasculture.org
cd /var/www/luzasculture
git pull origin main
```

---

### 2️⃣ نسخ سكربت اختبار الإيميلات:

```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master
nano test-email-service.js
```

**الصق محتوى السكربت (من الملف الموجود في المشروع)**

---

### 3️⃣ تشغيل سكربت اختبار الإيميلات:

```bash
node test-email-service.js
```

---

### 4️⃣ تشغيل سكربت إصلاح الإيميلات (إذا لزم):

```bash
cd /var/www/luzasculture
chmod +x fix-email-server.sh
sudo ./fix-email-server.sh
```

---

## ✅ التحقق من النتيجة:

```bash
# تحقق من logs
pm2 logs luzasculture-server --lines 50 | grep -i email
```

**يجب أن ترى:**
```
Email Pass configured: Yes (length: 12)
```

---

**🎉 جاهز!**

