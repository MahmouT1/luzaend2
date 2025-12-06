# 🔧 إصلاح مشكلات Auth و Admin Panel Redirect

## ✅ المشكلات التي تم إصلاحها:

### 1. **Google Auth لا يعمل** ❌ → ✅
- **المشكلة:** خطأ "Cannot GET /api/auth/error" عند استخدام Google Sign In
- **الحل:** تحديث NextAuth configuration وإضافة error page handling

### 2. **Admin Panel لا يوجه للـ Login** ❌ → ✅
- **المشكلة:** عند الدخول على `/admin-panel` مباشرة لا يوجه للـ login
- **الحل:** إضافة redirect logic في `admin-panel/page.tsx`

---

## 📝 التغييرات التي تمت:

### 1. `src/app/api/auth/[...nextauth]/route.ts`
- ✅ إضافة error page configuration
- ✅ تحسين NextAuth error handling

### 2. `src/app/admin-panel/page.tsx`
- ✅ إضافة redirect للتحقق من المستخدم
- ✅ إضافة loading state أثناء redirect

---

## 🚀 خطوات تطبيق الإصلاحات على السيرفر:

### الخطوة 1: تحديث الكود على السيرفر

```bash
# الدخول على السيرفر
ssh root@luzasculture.org

# الانتقال لمجلد المشروع
cd /var/www/luzasculture

# تحديث الكود من GitHub
sudo -u luzauser git pull origin main

# أو إذا لم يكن متصلاً بـ GitHub، يجب رفع الملفات يدوياً
```

### الخطوة 2: تحديث ملف `.env.local` (مهم!)

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
nano .env.local
```

**تأكد من وجود هذه المتغيرات:**
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

### الخطوة 3: إعادة بناء المشروع

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
sudo -u luzauser npm run build
```

### الخطوة 4: إعادة تشغيل التطبيقات

```bash
cd /var/www/luzasculture
sudo -u luzauser pm2 restart all
```

---

## ✅ التحقق من الإصلاح:

### 1. اختبار Google Auth:
- افتح الموقع: `https://luzasculture.org`
- اضغط على "Sign in with Google"
- يجب أن يعمل تسجيل الدخول بدون أخطاء

### 2. اختبار Admin Panel Redirect:
- افتح: `https://admin.luzasculture.org/admin-panel`
- يجب أن يوجهك تلقائياً لصفحة: `https://admin.luzasculture.org/admin-panel/login`
- بعد تسجيل الدخول كـ Admin، يجب أن يفتح الـ Dashboard

---

## 🔍 استكشاف الأخطاء:

### إذا لم يعمل Google Auth:

1. **تحقق من Google OAuth Credentials:**
   - تأكد من أن `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET` صحيحة
   - تحقق من Google Cloud Console

2. **تحقق من Redirect URIs في Google Cloud Console:**
   - يجب إضافة: `https://luzasculture.org/api/auth/callback/google`
   - يجب إضافة: `http://localhost:3000/api/auth/callback/google` (للـ development)

3. **تحقق من NEXTAUTH_URL:**
   - يجب أن يكون: `https://luzasculture.org` (بدون `/api`)

### إذا لم يعمل Admin Panel Redirect:

1. **تحقق من ملف `.env.local`:**
   - تأكد من وجود جميع المتغيرات المطلوبة

2. **تحقق من logs:**
   ```bash
   sudo -u luzauser pm2 logs luzasculture-client
   ```

3. **تحقق من build:**
   - تأكد من أن البناء نجح بدون أخطاء

---

## 📋 Checklist قبل النشر:

- [ ] تم تحديث الكود على السيرفر
- [ ] تم تحديث `.env.local` بالمتغيرات الصحيحة
- [ ] تم إعادة بناء المشروع بنجاح
- [ ] تم إعادة تشغيل PM2
- [ ] تم اختبار Google Auth
- [ ] تم اختبار Admin Panel Redirect

---

## 🆘 إذا استمرت المشكلة:

1. تحقق من logs:
   ```bash
   sudo -u luzauser pm2 logs
   ```

2. تحقق من Nginx configuration:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. تحقق من أن التطبيقات تعمل:
   ```bash
   sudo -u luzauser pm2 status
   ```

---

**✅ بعد تطبيق جميع الخطوات، يجب أن تعمل كل شيء بشكل صحيح!**

