# 🔧 إصلاح مشكلات Auth و Admin Panel

## المشكلة 1: Google Auth لا يعمل

### الأسباب المحتملة:
1. **NEXTAUTH_URL غير صحيح في production**
2. **Google OAuth credentials غير موجودة أو غير صحيحة**
3. **Nginx routing للـ API routes**

### الحل:
1. ✅ تم إضافة error page configuration في NextAuth
2. يجب التأكد من إعداد `.env.local` على السيرفر:

```env
NEXTAUTH_URL=https://luzasculture.org
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## المشكلة 2: Admin Panel لا يوجه للـ Login

### الحل:
✅ تم إضافة redirect في `admin-panel/page.tsx` للتحقق من المستخدم وتوجيهه للـ login إذا لم يكن مسجل دخول.

---

## خطوات الإصلاح على السيرفر:

### 1. تحديث ملف `.env.local`:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
nano .env.local
```

**أضف/حدث هذه المتغيرات:**
```env
NEXT_PUBLIC_API_URL=https://luzasculture.org/api
NEXTAUTH_URL=https://luzasculture.org
NEXTAUTH_SECRET=your-nextauth-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. إعادة بناء المشروع:

```bash
cd /var/www/luzasculture/loza-client-master/loza-client-master
npm run build
```

### 3. إعادة تشغيل التطبيقات:

```bash
cd /var/www/luzasculture
sudo -u luzauser pm2 restart all
```

---

## التحقق من الإصلاح:

1. **Google Auth:** جرب تسجيل الدخول باستخدام Google
2. **Admin Panel:** أدخل على `/admin-panel` مباشرة - يجب أن يوجهك للـ login

---

## ملاحظات مهمة:

- ⚠️ تأكد من أن Google OAuth credentials صحيحة في Google Cloud Console
- ⚠️ تأكد من إضافة redirect URIs في Google Cloud Console:
  - `https://luzasculture.org/api/auth/callback/google`
- ⚠️ بعد تحديث `.env.local` يجب إعادة بناء المشروع

