# 🔒 دليل إعداد SSL

## 📧 خطوة إدخال البريد الإلكتروني:

Certbot يطلب منك إدخال بريد إلكتروني صحيح.

### ✅ أدخل بريد إلكتروني صحيح:
مثال:
```
orders@luzasculture.org
```
أو أي بريد إلكتروني صحيح لديك.

### ⚠️ ملاحظات مهمة:
- يجب أن يكون البريد بصيغة صحيحة: `example@domain.com`
- هذا البريد يُستخدم لإشعارات تجديد الشهادة

---

## 📝 الخطوات الكاملة لـ SSL:

### 1️⃣ الحصول على SSL للدومين الرئيسي:
```bash
certbot --nginx -d luzasculture.org -d www.luzasculture.org --email orders@luzasculture.org --agree-tos --non-interactive
```

### 2️⃣ الحصول على SSL للـ Admin subdomain:
```bash
certbot --nginx -d admin.luzasculture.org --email orders@luzasculture.org --agree-tos --non-interactive
```

---

## 🚀 الطريقة السريعة (بدون تفاعل):

إذا أردت تجنب الأسئلة، استخدم:

```bash
certbot --nginx -d luzasculture.org -d www.luzasculture.org -d admin.luzasculture.org --email orders@luzasculture.org --agree-tos --non-interactive
```

هذا الأمر يحصل على SSL لجميع الدومينات مرة واحدة!

---

## ✅ بعد الحصول على SSL:

1. Nginx سيتم تحديثه تلقائياً
2. الموقع سيعمل على HTTPS
3. ابدأ التطبيقات:
   ```bash
   cd /var/www/luzasculture
   sudo -u luzauser pm2 start ecosystem.config.js
   sudo -u luzauser pm2 save
   ```

---

**🔒 الآن أدخل البريد الإلكتروني في Certbot!**

