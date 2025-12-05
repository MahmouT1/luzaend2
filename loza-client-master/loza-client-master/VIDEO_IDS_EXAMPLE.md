# 🎥 مثال: كيفية وضع Public ID للفيديوهات

## 📍 الملف الذي ستحرره:

```
src/config/mediaUrls.ts
```

---

## 🎯 الخطوات:

### 1️⃣ افتح الملف:
افتح: `src/config/mediaUrls.ts`

### 2️⃣ ابحث عن هذا السطر (حوالي السطر 42-43):

```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: '',      // ← هنا ضع Public ID للفيديو الأول
  headerVideo: '',   // ← هنا ضع Public ID للفيديو الثاني
```

### 3️⃣ املأ القيم الفارغة:

#### مثال: إذا كان Public ID:
- **VIDEO ONE.mp4** → Public ID: `luza's-media/video-one`
- **header.mp4** → Public ID: `luza's-media/header-video`

#### ضعها هكذا:

```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: "luza's-media/video-one",        // ✅ ضع Public ID هنا
  headerVideo: "luza's-media/header-video",  // ✅ ضع Public ID هنا
```

---

## ✅ مثال كامل قبل وبعد:

### ❌ قبل (فارغ):
```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: '',        // فارغ
  headerVideo: '',     // فارغ
```

### ✅ بعد (مملوء):
```typescript
const CLOUDINARY_IDS = {
  // Videos
  videoOne: "luza's-media/video-one",        // ✅ مملوء
  headerVideo: "luza's-media/header-video",  // ✅ مملوء
```

---

## 🔍 كيف أعرف Public ID؟

### من Cloudinary:

1. اضغط على الفيديو في Cloudinary
2. ابحث عن "Public ID" في معلومات الملف
3. انسخه

### أمثلة على Public IDs:

- `luza's-media/video-one`
- `luza's-media/VIDEO ONE`
- `luza's-media/video_one`
- `luza's-media/videoone`

**استخدم نفس Public ID الذي يظهر في Cloudinary بالضبط!**

---

## ⚠️ تحذيرات:

1. ✅ **ضع علامات الاقتباس** `"..."` حول Public ID
2. ✅ **انسخ Public ID كما هو** (لا تغير الأحرف)
3. ✅ **تأكد من عدم وجود أخطاء إملائية**

---

## 📝 خطوات سريعة:

1. افتح: `src/config/mediaUrls.ts`
2. ابحث عن: `videoOne: ''`
3. ضع Public ID: `videoOne: "luza's-media/video-one"`
4. كرر للفيديو الثاني: `headerVideo: "luza's-media/header-video"`
5. احفظ الملف
6. انتهى! 🎉

---

**بعد حفظ الملف، الفيديوهات ستُحمّل من Cloudinary! ✅**

