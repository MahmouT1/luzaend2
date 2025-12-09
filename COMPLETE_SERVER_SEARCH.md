# 🔧 البحث الشامل عن Server Code

## ⚠️ المشكلة:
- ✅ المجلد `loza-server-master/loza-server-master/` موجود
- ❌ يحتوي فقط على `.env` و `node_modules/`
- ❌ لا يوجد `server.js` أو `package.json`

**الاحتمالات:**
1. Server code موجود في `loza-server-master/` مباشرة (بدون تكرار)
2. Server code غير موجود ويجب سحبه من Git
3. Server موجود في مكان آخر

---

## ✅ البحث الشامل - خطوات منظمة:

### الخطوة 1: التحقق من المجلد الأب

```bash
cd /var/www/luzasculture
ls -la loza-server-master/
```

---

### الخطوة 2: البحث عن server.js في جميع أنحاء loza-server-master

```bash
cd /var/www/luzasculture
find loza-server-master/ -maxdepth 3 -name "*.js" -type f ! -path "*/node_modules/*" | head -20
```

---

### الخطوة 3: البحث عن package.json في جميع أنحاء loza-server-master

```bash
cd /var/www/luzasculture
find loza-server-master/ -maxdepth 3 -name "package.json" -type f ! -path "*/node_modules/*"
```

---

### الخطوة 4: التحقق من Git - Server files

```bash
cd /var/www/luzasculture
git ls-files | grep -E "^loza-server" | head -20
```

---

## 📋 الأمر الكامل للبحث الشامل:

```bash
cd /var/www/luzasculture && \
echo "==========================================" && \
echo "STEP 1: Parent loza-server-master directory" && \
echo "==========================================" && \
ls -la loza-server-master/ && \
echo "" && \
echo "==========================================" && \
echo "STEP 2: Find all .js files (maxdepth 3)" && \
echo "==========================================" && \
find loza-server-master/ -maxdepth 3 -name "*.js" -type f ! -path "*/node_modules/*" | head -20 && \
echo "" && \
echo "==========================================" && \
echo "STEP 3: Find package.json (maxdepth 3)" && \
echo "==========================================" && \
find loza-server-master/ -maxdepth 3 -name "package.json" -type f ! -path "*/node_modules/*" && \
echo "" && \
echo "==========================================" && \
echo "STEP 4: Git tracked server files" && \
echo "==========================================" && \
git ls-files | grep -E "^loza-server" | head -20 && \
echo "" && \
echo "==========================================" && \
echo "STEP 5: Check if server exists in parent" && \
echo "==========================================" && \
ls -la loza-server-master/*.js 2>/dev/null || echo "No .js files in parent directory" && \
echo "" && \
echo "==========================================" && \
echo "STEP 6: Check package.json in parent" && \
echo "==========================================" && \
cat loza-server-master/package.json 2>/dev/null | grep -A 10 "scripts" || echo "No package.json in parent"
```

---

## 🔍 بعد البحث:

**إذا لم يوجد server.js:**
- يجب سحب Server code من Git أو رفعه من local

**إذا وُجد في مكان آخر:**
- سنحدّث `ecosystem.config.js` بالمسار الصحيح

---

**✅ ابدأ بالبحث الشامل!**

