# ⚡ خطوات سريعة - رفع الملفات

## 📦 الملفات المطلوب رفعها (12 ملف)

### 🎥 فيديوهات (2):
1. `VIDEO ONE.mp4` → Public ID: `luza's-media/video-one`
2. `header.mp4` → Public ID: `luza's-media/header-video`

### 🖼️ صور (10):
3. `bann.png` → Public ID: `luza's-media/banner`
4. `ads2.png` → Public ID: `luza's-media/ads-2`
5. `adsimage.jpg` → Public ID: `luza's-media/ads-image`
6. `proudct1.jpg` → Public ID: `luza's-media/product-1`
7. `proudct2.jpg` → Public ID: `luza's-media/product-2`
8. `proudct3.jpg` → Public ID: `luza's-media/product-3`
9. `proudct4.jpg` → Public ID: `luza's-media/product-4`
10. `intro2.jpg` → Public ID: `luza's-media/intro-2`
11. `intro3.jpg` → Public ID: `luza's-media/intro-3`
12. `intro4.jpg` → Public ID: `luza's-media/intro-4`

---

## 🚀 خطوات الرفع:

### 1. اضغط "Upload" في صفحة Cloudinary
### 2. اسحب الملف أو اختره
### 3. اكتب Public ID (مثل: `luza's-media/video-one`)
### 4. اضغط Upload
### 5. انسخ Public ID بعد الرفع

**كرر الخطوات لكل ملف!**

---

## ✅ بعد الرفع:

### 1. افتح الملف: `src/config/mediaUrls.ts`
### 2. ابحث عن `CLOUDINARY_IDS`
### 3. املأ القيم الفارغة بالـ Public IDs:

```typescript
const CLOUDINARY_IDS = {
  videoOne: "luza's-media/video-one",        // من خطوة 1
  headerVideo: "luza's-media/header-video",  // من خطوة 2
  banner: "luza's-media/banner",             // من خطوة 3
  adsImage: "luza's-media/ads-image",        // من خطوة 5
  ads2: "luza's-media/ads-2",                // من خطوة 4
  product1: "luza's-media/product-1",        // من خطوة 6
  product2: "luza's-media/product-2",        // من خطوة 7
  product3: "luza's-media/product-3",        // من خطوة 8
  product4: "luza's-media/product-4",        // من خطوة 9
  intro2: "luza's-media/intro-2",            // من خطوة 10
  intro3: "luza's-media/intro-3",            // من خطوة 11
  intro4: "luza's-media/intro-4",            // من خطوة 12
};
```

### 4. احفظ الملف
### 5. انتهى! 🎉

---

## 📍 موقع الملفات على جهازك:

```
C:\loza website\loza-client-master\loza-client-master\public\
```

---

**نصيحة**: ابدأ بالفيديوهات الكبيرة أولاً (VIDEO ONE.mp4 و header.mp4)

