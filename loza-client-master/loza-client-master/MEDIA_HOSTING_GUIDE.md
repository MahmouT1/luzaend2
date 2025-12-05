# 🎥 دليل استضافة الصور والفيديوهات - تقليل استهلاك RAM

## 📊 مقارنة الخيارات المتاحة:

| الخيار | المميزات | العيوب | التكلفة | التقييم |
|--------|----------|--------|---------|---------|
| **Google Drive** | مجاني، سهل الإعداد | بطيء، ليس CDN، محدود | مجاني | ⭐⭐ |
| **Cloudinary** | CDN قوي، تحسين تلقائي | محدود في المجاني | مجاني (25GB) | ⭐⭐⭐⭐⭐ |
| **Vercel Blob** | سريع جداً مع Next.js | مدفوع بعد الاستخدام المجاني | $5/شهر | ⭐⭐⭐⭐ |
| **AWS S3 + CloudFront** | قوي ومضمون | معقد، يحتاج إعداد | حسب الاستخدام | ⭐⭐⭐⭐ |
| **YouTube/Vimeo** | مجاني للفيديوهات | للفيديوهات فقط | مجاني | ⭐⭐⭐⭐ |

---

## ✅ الحل الموصى به: **Cloudinary** (مجاني حتى 25GB)

### لماذا Cloudinary؟
- ✅ **CDN قوي** - سرعة تحميل عالية في كل العالم
- ✅ **تحسين تلقائي** - يضغط الصور والفيديوهات تلقائياً
- ✅ **تحويل تلقائي** - يحول الصور إلى WebP/AVIF حسب المتصفح
- ✅ **Responsive images** - يعطي أحجام مختلفة حسب الشاشة
- ✅ **مجاني حتى 25GB** - كافي لمعظم المشاريع
- ✅ **سهل التكامل** - مكتبات جاهزة لـ Next.js

---

## 📝 الطريقة 1: استخدام Cloudinary (الأفضل) ⭐

### الخطوة 1: إنشاء حساب على Cloudinary

1. اذهب إلى: https://cloudinary.com/users/register/free
2. سجّل بحساب Google (أسرع)
3. بعد التسجيل، اذهب إلى Dashboard
4. انسخ المعلومات التالية من Dashboard:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### الخطوة 2: تثبيت المكتبات المطلوبة

```bash
npm install cloudinary next-cloudinary
```

### الخطوة 3: إضافة متغيرات البيئة

أضف إلى ملف `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### الخطوة 4: تحديث next.config.ts

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
  ],
  // ... باقي الإعدادات
}
```

### الخطوة 5: رفع الملفات إلى Cloudinary

#### أ) من Dashboard:
1. اذهب إلى Media Library
2. اضغط Upload
3. اسحب الملفات أو اخترها
4. انسخ URL بعد الرفع

#### ب) من الكود (برمجي):

```javascript
// utils/uploadToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMedia(filePath, folder = 'loza-media') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // auto-detect image or video
      quality: 'auto',
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
```

### الخطوة 6: استخدام الصور في الكود

بدلاً من:
```jsx
<Image src="/header.mp4" />
```

استخدم:
```jsx
<Image 
  src="https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1234567890/header.mp4"
  alt="Header video"
/>
```

أو باستخدام `next-cloudinary`:

```jsx
import { CldImage, CldVideo } from 'next-cloudinary';

<CldVideo
  src="header"
  width="1920"
  height="1080"
  controls
  autoPlay
  loop
/>
```

---

## 📝 الطريقة 2: استخدام Google Drive (بديل)

### ⚠️ ملاحظات مهمة عن Google Drive:
- ❌ **ليس CDN** - أبطأ من Cloudinary
- ❌ **محدود في الحجم** - 15GB مجاناً
- ❌ **غير محسّن** - لا يضغط الملفات تلقائياً
- ✅ **مجاني وسهل** - إذا كنت تحتاج حل مؤقت

### الخطوة 1: رفع الملفات على Google Drive

1. اذهب إلى: https://drive.google.com
2. أنشئ مجلد جديد باسم "Loza Website Media"
3. ارفع جميع الصور والفيديوهات
4. حدد الملف → زر "مشاركة" → "أي شخص لديه الرابط" → "قارئ"
5. انسخ رابط المشاركة

### الخطوة 2: تحويل الرابط إلى رابط مباشر

رابط Google Drive عادي:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

رابط مباشر للتحميل:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

أو للصور فقط:
```
https://drive.google.com/thumbnail?id=FILE_ID&sz=w1920
```

### الخطوة 3: استخراج File ID

من رابط المشاركة:
```
https://drive.google.com/file/d/1ABC123xyz456DEF/view?usp=sharing
```

File ID هو: `1ABC123xyz456DEF`

### الخطوة 4: استخدام الروابط في الكود

أنشئ ملف `utils/googleDriveUrls.ts`:

```typescript
// utils/googleDriveUrls.ts
export const mediaUrls = {
  // فيديوهات
  videoOne: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
  headerVideo: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
  
  // صور
  banner: 'https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w1920',
  adsImage: 'https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w1920',
  // ... إلخ
};
```

### الخطوة 5: تحديث الكود لاستخدام الروابط

```jsx
// بدلاً من
<video src="/VIDEO ONE.mp4" />

// استخدم
<video src={mediaUrls.videoOne} />
```

### ⚠️ مشاكل محتملة مع Google Drive:

1. **مشكلة CORS**: قد تواجه مشكلة في الوصول للملفات من الموقع
2. **الحل**: استخدم Google Drive API أو استخدم خدمة CDN بديلة

---

## 📝 الطريقة 3: استخدام YouTube/Vimeo للفيديوهات فقط

### للمقاطع الكبيرة (أكثر من 10MB):

#### YouTube:
1. ارفع الفيديو على YouTube كـ "Unlisted" (غير مدرج)
2. انسخ Video ID من الرابط
3. استخدم YouTube Embed:

```jsx
<iframe
  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}`}
  frameBorder="0"
  allow="autoplay; encrypted-media"
/>
```

#### Vimeo:
1. ارفع على Vimeo
2. استخدم Vimeo Player:

```jsx
import Player from '@vimeo/player';

<iframe
  src={`https://player.vimeo.com/video/${VIDEO_ID}?autoplay=1&loop=1`}
  frameBorder="0"
/>
```

---

## 🚀 الخطوات العملية الموصى بها (Cloudinary)

### 1. إنشاء حساب Cloudinary ✅
### 2. تثبيت المكتبات ✅
### 3. رفع الملفات ✅
### 4. تحديث الكود ✅

---

## 📋 ملف تحديث الكود - Template

### تحديث `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
  ],
}
```

### إنشاء `lib/cloudinary.ts`:

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };
```

### تحديث المكونات:

```typescript
// components/ProfessionalLanding.tsx
<video src={process.env.NEXT_PUBLIC_VIDEO_ONE_URL || '/VIDEO ONE.mp4'} />

// components/Products.tsx
<video src={process.env.NEXT_PUBLIC_HEADER_VIDEO_URL || '/header.mp4'} />
```

---

## 💰 التكاليف المقدرة:

| الخدمة | المجاني | بعد المجاني |
|--------|---------|-------------|
| **Cloudinary** | 25GB تخزين + 25GB باندويث | $99/شهر |
| **Vercel Blob** | 100GB/شهر | $0.15/GB |
| **AWS S3** | 5GB/شهر | حسب الاستخدام |
| **Google Drive** | 15GB | $1.99/شهر (100GB) |

---

## ✅ الخلاصة والتوصية:

**الأفضل للمشروع**: **Cloudinary**
- ✅ مجاني حتى 25GB
- ✅ CDN قوي
- ✅ تحسين تلقائي
- ✅ سهل الاستخدام

**بديل مؤقت**: **Google Drive** (إذا كنت تحتاج حل سريع)

**للفيديوهات الكبيرة فقط**: **YouTube/Vimeo**

---

**هل تريد المساعدة في تطبيق أي من هذه الطرق؟** 🚀

