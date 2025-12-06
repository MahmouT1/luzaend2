# 🔧 إصلاح Google Auth على السيرفر

## 🔍 المشكلة:
Google Auth يعمل على localhost لكن لا يعمل على السيرفر - يظهر خطأ "Cannot GET /api/auth/error"

## 🔍 السبب:
Nginx يوجه جميع `/api/*` routes للـ Backend، لكن `/api/auth/*` routes يجب أن تذهب لـ Next.js (NextAuth)

---

## ✅ الحل:

### 1. تحديث Nginx Configuration

يجب إضافة route خاص لـ `/api/auth/*` قبل route العام `/api/*`

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

    # NextAuth routes - يجب أن تذهب لـ Next.js
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

**للحفظ:** `Ctrl + O` → `Enter` → `Ctrl + X`

### الخطوة 2: اختبار Nginx Configuration

```bash
nginx -t
```

يجب أن تظهر رسالة: `syntax is ok` و `test is successful`

### الخطوة 3: إعادة تحميل Nginx

```bash
systemctl reload nginx
```

---

## ✅ التحقق من الإصلاح:

1. افتح: `https://luzasculture.org/login`
2. اضغط على "Sign in with Google"
3. اختر حساب Google
4. يجب أن يعمل تسجيل الدخول بدون أخطاء

---

## 🔍 استكشاف الأخطاء:

### إذا لم يعمل بعد:

1. **تحقق من `.env.local`:**
   ```bash
   cd /var/www/luzasculture/loza-client-master/loza-client-master
   cat .env.local
   ```

   تأكد من:
   - `NEXTAUTH_URL=https://luzasculture.org`
   - `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET` صحيحة

2. **تحقق من Google Cloud Console:**
   - يجب إضافة Redirect URI: `https://luzasculture.org/api/auth/callback/google`

3. **تحقق من Logs:**
   ```bash
   sudo -u luzauser pm2 logs luzasculture-client
   ```

4. **إعادة بناء المشروع:**
   ```bash
   cd /var/www/luzasculture/loza-client-master/loza-client-master
   sudo -u luzauser npm run build
   sudo -u luzauser pm2 restart all
   ```

---

**✅ بعد تطبيق هذه الخطوات، Google Auth سيعمل بشكل صحيح!**

