# 🔧 إصلاح شامل - حل كل المشاكل

## 🔍 التحقق الشامل أولاً:

### الأمر الكامل (انسخه وأرسله):

```bash
cd /var/www/luzasculture && \
echo "========================================" && \
echo "STEP 1: Check .next directory contents" && \
echo "========================================" && \
ls -la .next/ | head -15 && \
echo "" && \
test -f .next/BUILD_ID && echo "✅ BUILD_ID exists" || echo "❌ BUILD_ID missing" && \
echo "" && \
echo "========================================" && \
echo "STEP 2: Check server.js exists" && \
echo "========================================" && \
test -f loza-server-master/loza-server-master/server.js && echo "✅ server.js exists" || echo "❌ server.js NOT found" && \
ls -la loza-server-master/loza-server-master/server.js 2>&1 && \
echo "" && \
echo "========================================" && \
echo "STEP 3: Check permissions" && \
echo "========================================" && \
ls -ld .next && \
ls -ld loza-server-master/loza-server-master/server.js && \
echo "" && \
echo "========================================" && \
echo "STEP 4: Check if rebuild needed" && \
echo "========================================" && \
if [ -f .next/BUILD_ID ]; then \
  echo "✅ Build exists - checking if valid..."; \
  if [ -d .next/server ] && [ -d .next/static ]; then \
    echo "✅ Build looks complete"; \
  else \
    echo "⚠️ Build incomplete - needs rebuild"; \
  fi; \
else \
  echo "❌ No build found - needs rebuild"; \
fi
```

---

**🚀 نفذ هذا الأمر أولاً للتحقق الشامل!**

بعد النتائج، سأعطيك الحل النهائي الكامل.

