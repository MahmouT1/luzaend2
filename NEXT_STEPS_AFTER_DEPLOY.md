# ✅ الخطوات التالية بعد النشر

## 🎉 مبروك! السكربت اكتمل بنجاح!

---

## 📝 الخطوة 1: إنشاء ملفات .env (مهم جداً!)

### ملف Server (.env):

```bash
nano /var/www/luzasculture/loza-server-master/loza-server-master/.env
```

**انسخ هذا المحتوى:**

```env
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars
CLOUD_NAME=dxptnzuri
CLOUD_API_KEY=848427894577436
CLOUD_SECRET_KEY=Bs4GLoPFouvduveDQiFn4IHiL-k
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
CLIENT_URL=https://luzasculture.org
ADMIN_URL=https://admin.luzasculture.org
```

**للحفظ:** اضغط `Ctrl + O` ثم `Enter` ثم `Ctrl + X`

---

### ملف Client (.env.local):

```bash
nano /var/www/luzasculture/loza-client-master/loza-client-master/.env.local
```

**انسخ هذا المحتوى:**

```env
NEXT_PUBLIC_API_URL=https://luzasculture.org/api
NEXTAUTH_URL=https://luzasculture.org
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxptnzuri
NEXT_PUBLIC_CLOUDINARY_API_KEY=848427894577436
```

**للحفظ:** اضغط `Ctrl + O` ثم `Enter` ثم `Ctrl + X`

---

## 🌐 الخطوة 2: إعداد DNS

أضف هذه A records في DNS الخاص بالدومين:

**عنوان IP للسيرفر:** `2a02:4780:28:4342::1`

**السجلات المطلوبة:**
- `luzasculture.org` → `2a02:4780:28:4342::1`
- `www.luzasculture.org` → `2a02:4780:28:4342::1`
- `admin.luzasculture.org` → `2a02:4780:28:4342::1`

**انتظر 5-10 دقائق** حتى ينتشر DNS.

---

## 🔒 الخطوة 3: الحصول على شهادات SSL

بعد انتشار DNS، نفذ:

```bash
certbot --nginx -d luzasculture.org -d www.luzasculture.org
certbot --nginx -d admin.luzasculture.org
```

---

## 🚀 الخطوة 4: بدء التطبيقات

```bash
cd /var/www/luzasculture
sudo -u luzauser pm2 start ecosystem.config.js
sudo -u luzauser pm2 save
sudo -u luzauser pm2 startup
```

---

## ✅ التحقق من التطبيقات:

```bash
sudo -u luzauser pm2 status
sudo -u luzauser pm2 logs
```

---

## 🎯 الترتيب الصحيح:

1. ✅ إنشاء ملفات `.env` (الآن)
2. ⏳ إعداد DNS
3. ⏳ انتظار انتشار DNS (5-10 دقائق)
4. ⏳ الحصول على SSL
5. ⏳ بدء التطبيقات

---

**🚀 ابدأ بإنشاء ملفات .env الآن!**

