# 🔧 التحقق من Server Code في Git

## ⚠️ المشكلة:
- ❌ `server.js` غير موجود في `loza-server-master/loza-server-master/`
- ❌ لا يوجد Server code

**الاحتمال:** Server code موجود في Git لكن لم يُسحب.

---

## ✅ الحل - خطوات منظمة:

### الخطوة 1: التحقق من Git - Server files

```bash
cd /var/www/luzasculture
git ls-files | grep -E "loza-server|server" | head -30
```

---

### الخطوة 2: التحقق من Remote و Branch

```bash
cd /var/www/luzasculture
git remote -v
git branch -a
```

---

### الخطوة 3: التحقق من Git Status

```bash
cd /var/www/luzasculture
git status
```

---

### الخطوة 4: التحقق من آخر Commit

```bash
cd /var/www/luzasculture
git log --oneline --all -10
git show HEAD:loza-server-master/loza-server-master/server.js 2>/dev/null || echo "server.js not in Git"
```

---

## 📋 الأمر الكامل للتحقق:

```bash
cd /var/www/luzasculture && \
echo "==========================================" && \
echo "STEP 1: Git tracked server files" && \
echo "==========================================" && \
git ls-files | grep -E "loza-server|server" | head -30 && \
echo "" && \
echo "==========================================" && \
echo "STEP 2: Git remote and branches" && \
echo "==========================================" && \
git remote -v && \
git branch -a && \
echo "" && \
echo "==========================================" && \
echo "STEP 3: Git status" && \
echo "==========================================" && \
git status && \
echo "" && \
echo "==========================================" && \
echo "STEP 4: Check if server.js in Git" && \
echo "==========================================" && \
git ls-files | grep "server.js" | grep -v node_modules && \
echo "" && \
echo "==========================================" && \
echo "STEP 5: List all files in Git" && \
echo "==========================================" && \
git ls-files | grep "loza-server" | head -50
```

---

## 🔍 إذا كان Server code موجود في Git:

### سحب Server code:

```bash
cd /var/www/luzasculture
git checkout HEAD -- loza-server-master/
```

---

## 🔍 إذا لم يكن موجود في Git:

### يجب رفع Server code من Local أولاً.

---

**✅ ابدأ بأمر التحقق من Git!**

