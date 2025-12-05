# 📝 كيفية وضع Public ID للفيديوهات - خطوة بخطوة

## 🎯 الخطوات السريعة:

### 1️⃣ احصل على Public ID من Cloudinary:

#### الطريقة الأسهل:
1. **اضغط على الفيديو** في Cloudinary (VIDEO ONE.mp4)
2. **ابحث في المعلومات** عن **"Public ID"**
3. **انسخ Public ID** الكامل

**مثال**: 
- إذا كان Public ID: `luza's-media/video-one`
- أو: `luza's-media/VIDEO ONE`
- أو: `luza's-media/video_one`

> 💡 **مهم**: انسخ Public ID كما هو بالضبط (مع الأحرف الكبيرة/الصغيرة)

---

### 2️⃣ افتح الملف للتحديث:

افتح الملف:
```
src/config/mediaUrls.ts
```

---

### 3️⃣ ابحث عن هذا القسم:

ابحث عن:
```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: '',      // ← ضع Public ID هنا
  headerVideo: '',   // ← ضع Public ID هنا
  ...
}
```

---

### 4️⃣ املأ Public IDs:

#### مثال: إذا كان Public ID للفيديوهات:

**VIDEO ONE.mp4**:
- Public ID: `luza's-media/video-one`

**header.mp4**:
- Public ID: `luza's-media/header-video`

#### ضعها في الملف هكذا:

```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: "luza's-media/video-one",        // ← Public ID للفيديو الأول
  headerVideo: "luza's-media/header-video",  // ← Public ID للفيديو الثاني
  
  // Images (اتركها فارغة حالياً)
  banner: '',
  adsImage: '',
  // ... إلخ
}
```

---

## ✅ مثال كامل:

### قبل التحديث:
```typescript
const CLOUDINARY_IDS = {
  videoOne: '',      // فارغ
  headerVideo: '',   // فارغ
}
```

### بعد التحديث:
```typescript
const CLOUDINARY_IDS = {
  videoOne: "luza's-media/video-one",        // ✅ تم ملؤه
  headerVideo: "luza's-media/header-video",  // ✅ تم ملؤه
}
```

---

## 🔍 كيفية معرفة Public ID الصحيح:

### من Cloudinary Dashboard:

1. **اضغط على الفيديو**
2. **انظر في معلومات الملف**:
   - ستجد "Public ID" في التفاصيل
   - أو في الـ URL
3. **انسخه كما هو**

### من URL الملف:

إذا نسخت URL الفيديو:
```
https://res.cloudinary.com/dxptnzuri/video/upload/v1234567890/luza's-media/video-one.mp4
```

Public ID هو الجزء بعد `/upload/.../` وقبل `.mp4`:
```
luza's-media/video-one
```

---

## ⚠️ ملاحظات مهمة:

1. **ضع علامات الاقتباس** `"..."` حول Public ID
2. **انسخ Public ID كما هو** (لا تغير الأحرف)
3. **إذا كان Public ID يحتوي على مسافات**, اتركه كما هو
4. **تأكد من عدم وجود أخطاء إملائية**

---

## 🎯 مثال عملي:

### السيناريو:
رفعت فيديوهين وحصلت على Public IDs:

- VIDEO ONE.mp4 → `luza's-media/VIDEO ONE`
- header.mp4 → `luza's-media/header-video`

### التحديث في الملف:

```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: "luza's-media/VIDEO ONE",        // ✅
  headerVideo: "luza's-media/header-video",  // ✅
  
  // Images (سيتم ملؤها لاحقاً)
  banner: '',
  adsImage: '',
  ads2: '',
  product1: '',
  product2: '',
  product3: '',
  product4: '',
  intro2: '',
  intro3: '',
  intro4: '',
};
```

---

## ✅ بعد التحديث:

1. **احفظ الملف** (Ctrl+S)
2. **الكود سيستخدم Cloudinary تلقائياً** للفيديوهات
3. **إذا لم يعمل**, سيعود للملفات المحلية (Fallback آمن)

---

**بالتوفيق! بعد التحديث، الفيديوهات ستُحمّل من Cloudinary! 🎉**

