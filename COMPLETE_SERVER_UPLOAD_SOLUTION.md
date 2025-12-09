# 🚀 رفع Server Code إلى Git - خطوات منظمة

## ✅ الاكتشاف:
- ✅ `server.js` موجود على Local: `loza-server-master/loza-server-master/server.js`
- ❌ Server code غير موجود في Git (untracked)
- ✅ يجب رفعه إلى Git ثم سحبه على Server

---

## 📋 الخطوات الكاملة:

### 🔵 على Local Machine (Windows):

#### الخطوة 1: التحقق من موقع server.js

```powershell
cd "C:\loza website"
dir loza-server-master\loza-server-master\server.js
```

---

#### الخطوة 2: الانتقال إلى repo Client

```powershell
cd "C:\loza website\loza-client-master\loza-client-master"
```

---

#### الخطوة 3: نسخ Server folder إلى repo Client (إذا لم يكن موجود)

```powershell
# التحقق من وجود loza-server-master
dir ..\loza-server-master

# إذا لم يكن موجود في repo، انسخه
xcopy /E /I ..\loza-server-master loza-server-master
```

---

#### الخطوة 4: إضافة Server إلى Git

```powershell
git add loza-server-master/
git status
```

---

#### الخطوة 5: Commit و Push

```powershell
git commit -m "Add server code to repository"
git push luzaend2 main
```

---

### 🔴 على Server (Linux):

#### الخطوة 6: سحب Server Code

```bash
cd /var/www/luzasculture
git pull origin main
```

---

#### الخطوة 7: التحقق من server.js

```bash
cd /var/www/luzasculture
ls -la loza-server-master/loza-server-master/server.js
```

---

#### الخطوة 8: إعادة تشغيل Server

```bash
cd /var/www/luzasculture
sudo -u luzauser pm2 delete luzasculture-server
sudo -u luzauser pm2 start ecosystem.config.js --only luzasculture-server
sudo -u luzauser pm2 save
sleep 5
sudo -u luzauser pm2 status
```

---

## 📋 الأمر الكامل على Local (PowerShell):

```powershell
cd "C:\loza website\loza-client-master\loza-client-master"; if (-not (Test-Path "loza-server-master")) { Copy-Item -Path "..\loza-server-master" -Destination "loza-server-master" -Recurse }; git add loza-server-master/; git status; git commit -m "Add server code to repository"; git push luzaend2 main
```

---

## 📋 الأمر الكامل على Server (بعد الرفع):

```bash
cd /var/www/luzasculture && \
echo "=== Pulling Server Code ===" && \
git pull origin main && \
echo "" && \
echo "=== Verifying server.js ===" && \
ls -la loza-server-master/loza-server-master/server.js && \
echo "" && \
echo "=== Restarting Server ===" && \
sudo -u luzauser pm2 delete luzasculture-server && \
sudo -u luzauser pm2 start ecosystem.config.js --only luzasculture-server && \
sudo -u luzauser pm2 save && \
sleep 5 && \
echo "" && \
echo "=== Final Status ===" && \
sudo -u luzauser pm2 status
```

---

**✅ ابدأ برفع Server code على Local!**

