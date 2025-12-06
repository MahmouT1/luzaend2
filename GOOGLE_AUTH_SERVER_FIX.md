# 🔧 إصلاح Google Auth على السيرفر - الحل الكامل

## 🔍 المشكلة:
- ✅ Google Auth يعمل على **localhost**
- ❌ Google Auth **لا يعمل على السيرفر** - يظهر خطأ: `Cannot GET /api/auth/error`

---

## 🔍 السبب:
**Nginx يوجه جميع `/api/*` routes للـ Backend (port 8000)**

لكن:
- `/api/auth/*` routes (NextAuth) يجب أن تذهب لـ **Next.js** (port 3000)
- باقي `/api/*` routes يجب أن تذهب للـ **Backend** (port 8000)

---

## ✅ الحل:

### تحديث Nginx Configuration لإضافة route خاص لـ `/api/auth/*` قبل route العام `/api/*`

---

## 📝 الخطوات على السيرفر:

### الخطوة 1: تحديث Nginx Configuration

```bash
ssh root@luzasculture.org
nano /etc/nginx/sites-available/luzasculture
```

**استبدل محتوى الملف بهذا:**

```nginx
server {
    listen 80;
    server_name luzasculture.org www.luzasculture.org;

    # NextAuth routes - يجب أن تذهب لـ Next.js (قبل route العام)
    location /api/auth {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # باقي API routes - تذهب للـ Backend
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**⚠️ مهم:** ترتيب الـ routes مهم! `/api/auth` يجب أن يكون **قبل** `/api`

**للحفظ:** `Ctrl + O` → `Enter` → `Ctrl + X`

---

### الخطوة 2: اختبار Nginx Configuration

```bash
nginx -t
```

يجب أن تظهر:
```
syntax is ok
test is successful
```

إذا ظهرت أخطاء، راجع الملف مرة أخرى.

---

### الخطوة 3: إعادة تحميل Nginx

```bash
systemctl reload nginx
```

---

## ✅ التحقق من الإصلاح:

1. افتح المتصفح: `https://luzasculture.org/login`
2. اضغط على "Sign in with Google"
3. اختر حساب Google
4. ✅ يجب أن يعمل تسجيل الدخول بدون أخطاء!

---

## 🔍 إذا لم يعمل بعد:

### 1. تحقق من `.env.local`:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
cat .env.local
```

**تأكد من وجود:**
```env
NEXTAUTH_URL=https://luzasculture.org
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

### 2. تحقق من Google Cloud Console:

- افتح [Google Cloud Console](https://console.cloud.google.com/)
- اذهب إلى APIs & Services → Credentials
- افتح OAuth 2.0 Client ID
- **تأكد من إضافة Redirect URI:**
  - `https://luzasculture.org/api/auth/callback/google`

### 3. إعادة بناء المشروع (إذا غيرت `.env.local`):

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
sudo -u luzauser npm run build
sudo -u luzauser pm2 restart all
```

### 4. تحقق من Logs:

```bash
sudo -u luzauser pm2 logs luzasculture-client
```

ابحث عن أخطاء NextAuth.

---

## 📋 ملخص الخطوات:

1. ✅ تحديث Nginx configuration (إضافة `/api/auth` route)
2. ✅ اختبار Nginx: `nginx -t`
3. ✅ إعادة تحميل Nginx: `systemctl reload nginx`
4. ✅ التحقق من `.env.local`
5. ✅ التحقق من Google Cloud Console Redirect URI
6. ✅ اختبار Google Auth

---

## 🎉 بعد تطبيق هذه الخطوات:

Google Auth سيعمل بشكل صحيح على السيرفر تماماً مثل localhost! ✅

---

**💡 نصيحة:** تم تحديث `deploy.sh` أيضاً للإصلاح الدائم في النشرات القادمة.

