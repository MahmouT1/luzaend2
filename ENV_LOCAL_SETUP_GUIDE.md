# 🔐 إعداد ملف .env.local على السيرفر

## 📍 الموقع الحالي:
أنت في: `/var/www/loza-client-master/loza-client-master/.env.local`

---

## ✅ القيم التي تحتاج إلى تحديث:

### 1. `NEXTAUTH_SECRET` (مهم جداً!)

يجب أن يكون مفتاح سري عشوائي قوي. يمكنك إنشاؤه بالأمر:

```bash
openssl rand -base64 32
```

**أو** يمكنك استخدام قيمة مثل:
```
NEXTAUTH_SECRET=change-this-to-a-random-32-character-string-minimum
```

---

### 2. `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET`

هذه القيم تحتاج إلى:
1. الدخول على [Google Cloud Console](https://console.cloud.google.com/)
2. إنشاء/اختيار مشروع
3. تفعيل Google+ API
4. إنشاء OAuth 2.0 Client ID
5. إضافة Authorized redirect URIs:
   - `https://luzasculture.org/api/auth/callback/google`
   - `https://admin.luzasculture.org/api/auth/callback/google`

**إذا لم تكن لديك هذه القيم بعد:**
- يمكنك تركها كـ placeholder الآن
- Google Auth لن يعمل حتى تضيف القيم الصحيحة
- باقي الموقع سيعمل بدون Google Auth

---

## 📝 ملف .env.local النهائي يجب أن يكون:

```env
NEXT_PUBLIC_API_URL=https://luzasculture.org/api
NEXTAUTH_URL=https://luzasculture.org
NEXTAUTH_SECRET=your-actual-secret-key-here-minimum-32-chars
GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxptnzuri
NEXT_PUBLIC_CLOUDINARY_API_KEY=848427894577436
```

---

## 🔧 خطوات التنفيذ:

### الخطوة 1: إنشاء NEXTAUTH_SECRET

في terminal منفصل، نفذ:
```bash
openssl rand -base64 32
```

انسخ النتيجة وضعها في `NEXTAUTH_SECRET`

### الخطوة 2: ملء القيم

في nano editor:
1. اضغط `Ctrl + W` للبحث
2. ابحث عن `your-nextauth-secret-key-change-this`
3. استبدله بالقيمة التي أنشأتها
4. كرر للقيم الأخرى

### الخطوة 3: حفظ الملف

- اضغط `Ctrl + O` للحفظ
- اضغط `Enter` للتأكيد
- اضغط `Ctrl + X` للخروج

---

## ⚠️ ملاحظات مهمة:

1. **إذا لم تكن لديك Google OAuth credentials:**
   - يمكنك ترك القيم كما هي مؤقتاً
   - Google Auth لن يعمل، لكن باقي الموقع سيعمل

2. **NEXTAUTH_SECRET:**
   - يجب أن تكون قيمة عشوائية قوية
   - لا تشاركها مع أحد
   - احفظ نسخة احتياطية في مكان آمن

3. **بعد تحديث الملف:**
   - يجب إعادة بناء المشروع
   - يجب إعادة تشغيل PM2

---

## 🚀 بعد حفظ الملف:

```bash
# إعادة بناء المشروع
cd /var/www/luzasculture/loza-client-master/loza-client-master
sudo -u luzauser npm run build

# إعادة تشغيل PM2
cd /var/www/luzasculture
sudo -u luzauser pm2 restart all
```

---

**✅ بعد اكتمال الخطوات، سيعمل الموقع بشكل صحيح!**

