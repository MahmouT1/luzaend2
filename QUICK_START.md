# ⚡ دليل سريع - رفع التعديلات واختبار الإيميلات

---

## 🚀 الجزء الأول: رفع التعديلات على Git

### ✅ الأوامر (انسخها كلها):

```bash
cd "C:\loza website"
git add .
git commit -m "Fix email system on server and add bestsellers endpoint"
git push origin main
```

---

## 🚀 الجزء الثاني: على السيرفر

### 1️⃣ سحب التعديلات:
```bash
ssh root@luzasculture.org
cd /var/www/luzasculture
git pull origin main
```

### 2️⃣ اختبار الإيميلات:

```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master

# إذا كان السكربت موجود بعد git pull
node test-email-service.js

# أو أنشئه يدوياً
nano test-email-service.js
# (الصق محتوى السكربت من test-email-service.js)
```

---

## 📄 الملفات المهمة:

- `COMPLETE_GIT_AND_EMAIL_COMMANDS.md` - دليل شامل
- `GIT_COMMANDS.md` - أوامر Git فقط
- `test-email-service.js` - سكربت اختبار الإيميلات
- `fix-email-server.sh` - سكربت إصلاح الإيميلات

---

**🎉 جاهز!**

