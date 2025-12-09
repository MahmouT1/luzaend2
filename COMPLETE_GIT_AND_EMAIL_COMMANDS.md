# 🚀 دليل كامل: رفع التعديلات واختبار الإيميلات

---

## 📋 الجزء الأول: رفع التعديلات على Git

### ✅ الأوامر الكاملة (انسخها كلها):

```bash
cd "C:\loza website"
git add .
git commit -m "Fix email system on server and add bestsellers endpoint"
git push origin main
```

---

## 📋 الجزء الثاني: على السيرفر - سحب التعديلات

```bash
ssh root@luzasculture.org
cd /var/www/luzasculture
git pull origin main
```

---

## 📋 الجزء الثالث: اختبار نظام الإيميلات

### الطريقة الأولى: استخدام السكربت الموجود

```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master

# إذا كان السكربت موجود
node test-email-service.js
```

### الطريقة الثانية: نسخ السكربت مباشرة

```bash
cd /var/www/luzasculture/loza-server-master/loza-server-master

# أنشئ الملف
nano test-email-service.js
```

**الصق المحتوى التالي:**

```javascript
import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log('🧪 Testing Email Service...');

const emailUser = process.env.EMAIL_USER || 'orders@luzasculture.org';
const emailPass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465');

console.log('EMAIL_USER:', emailUser);
console.log('EMAIL_PASS:', emailPass ? 'SET ✅' : 'NOT SET ❌');
console.log('SMTP_HOST:', smtpHost);
console.log('SMTP_PORT:', smtpPort);

if (!emailPass) {
  console.error('❌ EMAIL_PASS is not set!');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: emailUser,
    pass: emailPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection Error:', error.message);
  } else {
    console.log('✅ SMTP Connection Verified!');
    
    transporter.sendMail({
      from: `"LUZA'S CULTURE" <${emailUser}>`,
      to: emailUser,
      subject: 'Test Email from Server',
      text: 'Email service is working!'
    }, (err, info) => {
      if (err) {
        console.error('❌ Send Error:', err.message);
      } else {
        console.log('✅ Email Sent! Message ID:', info.messageId);
      }
      process.exit(0);
    });
  }
});
```

**احفظ:** `Ctrl + O` → `Enter` → `Ctrl + X`

**شغّل:**
```bash
node test-email-service.js
```

---

## 📋 الجزء الرابع: إصلاح نظام الإيميلات (إذا لم يعمل)

### استخدام السكربت التلقائي:

```bash
cd /var/www/luzasculture

# إذا كان السكربت موجود
chmod +x fix-email-server.sh
sudo ./fix-email-server.sh
```

### أو يدوياً - إنشاء ملف .env:

```bash
 /var/www/luzasculture/loza-server-master/loza-server-master
nano .env
```

**الصق:**
```env
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

**احفظ:** `Ctrl + O` → `Enter` → `Ctrl + X`

**أعد تشغيل PM2:**
```bash
pm2 restart luzasculture-server
```

---

## 📋 الجزء الخامس: التحقق من النتيجة

```bash
# تحقق من logs
pm2 logs luzasculture-server --lines 50 | grep -i email

# يجب أن ترى:
# Email Pass configured: Yes (length: 12)
```

---

**🎉 جاهز!**

