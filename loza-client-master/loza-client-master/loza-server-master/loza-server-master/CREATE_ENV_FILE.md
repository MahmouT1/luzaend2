# 📝 إنشاء ملف .env مع البيانات الصحيحة

## البيانات المطلوبة:

```
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

## خطوات إنشاء ملف .env:

### الطريقة 1: عبر Terminal/Command Prompt

1. افتح Terminal في مجلد `loza-server-master`
2. شغّل هذا الأمر:

**Windows (PowerShell):**
```powershell
@"
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
"@ | Out-File -FilePath .env -Encoding utf8
```

**Windows (CMD):**
```cmd
echo EMAIL_USER=orders@luzasculture.org > .env
echo EMAIL_PASS=Memo.Ro2123 >> .env
echo SMTP_HOST=smtp.hostinger.com >> .env
echo SMTP_PORT=465 >> .env
```

**Linux/Mac:**
```bash
cat > .env << EOF
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
EOF
```

### الطريقة 2: إنشاء الملف يدوياً

1. افتح أي محرر نصوص (Notepad, VS Code, etc.)
2. أنشئ ملف جديد باسم `.env` (بعد النقطة)
3. الصق المحتوى التالي:

```env
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

4. احفظ الملف في مجلد `loza-server-master`

## التحقق من الملف:

بعد إنشاء الملف، تأكد من أنه موجود:

**Windows:**
```cmd
dir .env
```

**Linux/Mac:**
```bash
ls -la .env
```

## اختبار الاتصال:

بعد إنشاء ملف `.env`، شغّل:

```bash
node test-email-with-credentials.js
```

هذا سيجرب الاتصال باستخدام بيانات الاعتماد المباشرة.

## ملاحظات مهمة:

- ⚠️ **لا تشارك** ملف `.env` أبداً (يحتوي على كلمة المرور)
- ⚠️ تأكد من أن ملف `.env` موجود في `.gitignore`
- ⚠️ إذا لم يعمل المنفذ 465، جرب 587

## إذا كان المنفذ 465 لا يعمل:

غيّر `SMTP_PORT=465` إلى `SMTP_PORT=587` في ملف `.env`

---

**بعد إنشاء ملف .env، شغّل `node test-email-with-credentials.js` للاختبار!**

