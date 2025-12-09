# 🔧 المسار الصحيح للبناء

## ✅ الاكتشاف:
- ✅ `package.json` موجود في `/var/www/luzasculture/` مباشرة
- ✅ يوجد `src/` و `public/` في `/var/www/luzasculture/`
- ✅ البنية مختلفة عن المتوقع!

---

## ✅ الحل:

### المسار الصحيح للبناء:

```bash
cd /var/www/luzasculture
rm -rf .next node_modules/.cache
npm run build
```

---

## 📋 الأمر الكامل الصحيح:

```bash
echo "=== STEP 1: Verify Structure ===" && cd /var/www/luzasculture && ls -la package.json && echo "" && echo "=== STEP 2: Build Client ===" && rm -rf .next node_modules/.cache && npm run build && echo "" && echo "=== STEP 3: Verify Build ===" && ls -la .next | head -10 && echo "" && echo "=== STEP 4: Verify Email Config ===" && cd loza-server-master/loza-server-master && cat .env | grep EMAIL && echo "" && echo "=== STEP 5: Restart PM2 ===" && cd /var/www/luzasculture && sudo -u luzauser pm2 restart luzasculture-client && sudo -u luzauser pm2 restart luzasculture-server && sudo -u luzauser pm2 save && sleep 5 && echo "" && echo "=== STEP 6: Final Status ===" && sudo -u luzauser pm2 status
```

---

## 🔍 التحقق من ecosystem.config.js:

يجب أن يكون `cwd` صحيح:

```bash
cd /var/www/luzasculture
cat ecosystem.config.js | grep -A 10 "luzasculture-client"
```

**يجب أن يكون:**

```javascript
{
  name: 'luzasculture-client',
  script: 'npm',
  args: 'start',
  cwd: '/var/www/luzasculture', // ⬅️ المسار الصحيح!
  // ...
}
```

**إذا كان خاطئ، حدّثه:**

```bash
nano ecosystem.config.js
```

---

**✅ استخدم المسار الصحيح: `/var/www/luzasculture` مباشرة!**

