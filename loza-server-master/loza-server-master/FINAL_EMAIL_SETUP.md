# ✅ الإعداد النهائي لنظام الإيميلات - مع البيانات الصحيحة

## البيانات الصحيحة:

- **Email:** `orders@luzasculture.org`
- **Password:** `Memo.Ro2123`
- **SMTP Host:** `smtp.hostinger.com`
- **SMTP Port:** `465` (SSL) أو `587` (STARTTLS)

## الخطوات المطلوبة:

### الخطوة 1: إنشاء ملف `.env`

في مجلد `loza-server-master`، أنشئ ملف `.env` وضعه فيه:

```env
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

**أو عبر Terminal (Windows PowerShell):**
```powershell
cd "C:\loza website\loza-server-master\loza-server-master"
@"
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
"@ | Out-File -FilePath .env -Encoding utf8
```

### الخطوة 2: اختبار الاتصال

شغّل هذا الأمر لاختبار الاتصال:

```bash
node test-email-with-credentials.js
```

هذا السكربت سيجرب:
- ✅ المنفذ 465 (SSL) - الموصى به من Hostinger
- ✅ المنفذ 587 (STARTTLS) - البديل إذا فشل 465

### الخطوة 3: التحقق من النتائج

إذا نجح الاختبار، سترى:
```
✅ CONNECTION VERIFIED!
✅ EMAIL SENT SUCCESSFULLY!
📧 Message ID: ...
```

وستجد إيميل تجريبي في صندوق الوارد `orders@luzasculture.org`

### الخطوة 4: إعادة تشغيل Server

بعد التأكد من نجاح الاختبار:

```bash
npm run dev
```

## ما تم تحديثه:

✅ **دعم STARTTLS:** الكود الآن يدعم المنفذ 587 (STARTTLS) كبديل  
✅ **تحسين الاتصال:** Timeouts محسّنة وإعدادات TLS محسّنة  
✅ **سكربت اختبار:** `test-email-with-credentials.js` يختبر الاتصال مباشرة  

## إعدادات SMTP المحدثة:

### الخيار 1: SSL (Port 465) - الموصى به
```env
SMTP_PORT=465
```

### الخيار 2: STARTTLS (Port 587) - إذا فشل 465
```env
SMTP_PORT=587
```

## إذا لم يعمل:

1. **تحقق من كلمة المرور:**
   - تأكد من أن الكلمة هي: `Memo.Ro2123` (بدون مسافات)
   - جرب تسجيل الدخول عبر Hostinger Webmail

2. **جرب المنفذ 587:**
   - غيّر `SMTP_PORT=465` إلى `SMTP_PORT=587` في `.env`

3. **تحقق من Firewall:**
   - تأكد من أن المنفذ 465 أو 587 غير محظور

4. **راجع Console logs:**
   - ستجد تفاصيل الخطأ في Terminal

## الملفات المهمة:

- ✅ `.env` - ملف الإعدادات (يجب إنشاؤه)
- ✅ `test-email-with-credentials.js` - اختبار الاتصال
- ✅ `services/email.service.js` - خدمة الإيميل (محدثة)

---

**بعد إنشاء ملف `.env`، شغّل `node test-email-with-credentials.js` للاختبار!**

