# 🚀 دليل إعداد الإيميلات - مع البيانات الصحيحة

## ✅ البيانات الصحيحة:

```
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

## 📋 الخطوات السريعة:

### 1️⃣ إنشاء ملف `.env`

**في مجلد `loza-server-master`، أنشئ ملف `.env`:**

**Windows PowerShell:**
```powershell
cd "C:\loza website\loza-server-master\loza-server-master"
@"
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
"@ | Out-File -FilePath .env -Encoding utf8
```

**أو يدوياً:**
- أنشئ ملف جديد باسم `.env` في مجلد `loza-server-master`
- الصق المحتوى التالي:
```
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

### 2️⃣ اختبار الاتصال

```bash
node test-email-with-credentials.js
```

هذا سيجرب:
- ✅ Port 465 (SSL) - الموصى به
- ✅ Port 587 (STARTTLS) - البديل

### 3️⃣ إذا نجح الاختبار

سترى:
```
✅ CONNECTION VERIFIED!
✅ EMAIL SENT SUCCESSFULLY!
```

وستجد إيميل تجريبي في: `orders@luzasculture.org`

### 4️⃣ إعادة تشغيل Server

```bash
npm run dev
```

## 🔧 إذا لم يعمل Port 465:

غيّر في ملف `.env`:
```
SMTP_PORT=587
```

## 📧 ما تم تحديثه:

✅ **دعم STARTTLS:** المنفذ 587 (STARTTLS) مدعوم  
✅ **تحسين الاتصال:** Timeouts وإعدادات محسّنة  
✅ **اختبار شامل:** سكربت يختبر كلا المنفذين  

## 📁 الملفات المهمة:

- `.env` - **يجب إنشاؤه** مع البيانات أعلاه
- `test-email-with-credentials.js` - اختبار الاتصال
- `services/email.service.js` - خدمة الإيميل (محدثة)

---

**ابدأ بإنشاء ملف `.env` ثم شغّل الاختبار! 🚀**

