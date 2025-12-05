# حل مشكلة عدم وصول الإيميلات

## خطوات التحقق السريعة:

### 1. تحقق من ملف `.env`

افتح ملف `.env` في مجلد `loza-server-master` وتأكد من وجود المتغيرات التالية:

```env
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=كلمة-المرور-هنا
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

### 2. تحقق من Console Logs

عند إنشاء طلب، تحقق من Terminal/Console للبحث عن:

- ✅ **نجح الإرسال:** سترى رسالة `✅ Order confirmation email sent successfully!`
- ❌ **فشل الإرسال:** سترى رسالة `❌ Error sending email:` مع تفاصيل الخطأ

### 3. اختبار الإيميل

قم بتشغيل:

```bash
cd loza-server-master
node test-hostinger-email.js
```

هذا سيساعدك في:
- التحقق من المتغيرات البيئية
- اختبار الاتصال بـ SMTP
- إرسال إيميل تجريبي

### 4. المشاكل الشائعة والحلول:

#### المشكلة: "EMAIL_PASS environment variable is required"

**الحل:**
1. افتح ملف `.env` في مجلد `loza-server-master`
2. أضف السطر:
   ```
   EMAIL_PASS=كلمة-مرور-إيميل-هوستنجر
   ```
3. أعد تشغيل الـ Server

#### المشكلة: "Invalid login" أو "Authentication failed"

**الحل:**
- تحقق من أن كلمة المرور صحيحة
- في Hostinger، قد تحتاج كلمة مرور خاصة للتطبيقات (App Password)
- تأكد من أن الحساب نشط

#### المشكلة: "Connection timeout"

**الحل:**
- تحقق من الاتصال بالإنترنت
- تأكد من أن Firewall يسمح بالاتصال إلى المنفذ 465
- جرب تغيير SMTP_PORT إلى 587 (إذا كان 465 لا يعمل)

### 5. إعادة تشغيل الـ Server

بعد إضافة/تعديل المتغيرات البيئية:

1. أوقف الـ Server (Ctrl+C)
2. أعد تشغيله:
   ```bash
   npm run dev
   # أو
   npm start
   ```

### 6. التحقق من الإيميل في Hostinger

1. سجل الدخول إلى Hostinger
2. اذهب إلى **Email** → **Email Accounts**
3. تحقق من أن `orders@luzasculture.org` موجود ونشط
4. جرب تسجيل الدخول من Webmail للتأكد من كلمة المرور

---

إذا استمرت المشكلة، شارك رسالة الخطأ الكاملة من Console logs.

