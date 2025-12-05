# 🔍 كيفية الحصول على Public ID من Cloudinary

## 📋 خطوات الحصول على Public ID:

### الطريقة 1: من صفحة الملف (الأسهل) ⭐

1. **اضغط على الملف** في Cloudinary (مثل VIDEO ONE.mp4)
2. **ابحث عن "Public ID"** في معلومات الملف
3. **انسخ الـ Public ID** الكامل
4. مثال: `luza's-media/video-one` أو `luza's-media/VIDEO ONE`

### الطريقة 2: من قائمة الملف

1. **اضغط كليك يمين** على الملف
2. **اختر "Copy URL"** أو انظر في التفاصيل
3. الـ Public ID هو الجزء في الرابط بعد `/upload/`
4. مثال: `https://res.cloudinary.com/dxptnzuri/video/upload/v1234567890/luza's-media/video-one`
   - Public ID هنا هو: `luza's-media/video-one`

### الطريقة 3: من الـ URL المنسوخ

عند نسخ URL الملف:
```
https://res.cloudinary.com/dxptnzuri/video/upload/v1234567890/luza's-media/video-one.mp4
                                                              ^^^^^^^^^^^^^^^^^^^^^^^^^ هذا هو Public ID
```

**ملاحظة**: أحياناً يكون Public ID بدون `.mp4` في النهاية

---

## ✅ بعد الحصول على Public IDs:

### الخطوة 1: افتح الملف
```
src/config/mediaUrls.ts
```

### الخطوة 2: ابحث عن
```typescript
const CLOUDINARY_IDS = {
  videoOne: '',      // ← ضع Public ID هنا
  headerVideo: '',   // ← ضع Public ID هنا
  ...
}
```

### الخطوة 3: املأ القيم

مثال:
```typescript
const CLOUDINARY_IDS = {
  videoOne: "luza's-media/video-one",
  headerVideo: "luza's-media/header-video",
  ...
}
```

### الخطوة 4: احفظ الملف

---

## 🔍 مثال عملي:

### إذا كان Public ID:
```
luza's-media/VIDEO ONE
```

### ضعه في الملف:
```typescript
videoOne: "luza's-media/VIDEO ONE",
```

---

## ⚠️ ملاحظات مهمة:

1. **انسخ Public ID كما هو بالضبط** (مع الأحرف الكبيرة/الصغيرة)
2. **ضع علامات الاقتباس** `"..."` حول Public ID
3. **تأكد من عدم وجود مسافات** قبل أو بعد Public ID
4. **إذا كان Public ID يحتوي على مسافات**, اتركه كما هو بين علامات الاقتباس

---

## 🎯 مثال كامل:

### Public IDs التي حصلت عليها:
- VIDEO ONE.mp4 → `luza's-media/VIDEO ONE`
- header.mp4 → `luza's-media/header-video`

### في الملف mediaUrls.ts:
```typescript
const CLOUDINARY_IDS = {
  videoOne: "luza's-media/VIDEO ONE",
  headerVideo: "luza's-media/header-video",
  ...
}
```

---

**بعد تحديث الملف، سيبدأ الموقع باستخدام Cloudinary تلقائياً! 🎉**

