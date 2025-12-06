# ⚡ الخطوات التالية السريعة

## ✅ السكربت اكتمل! الآن نفذ هذه الخطوات:

---

## 1️⃣ إنشاء ملفات .env

### Server:
```bash
nano /var/www/luzasculture/loza-server-master/loza-server-master/.env
```
(انسخ المحتوى من `ENVIRONMENT_VARIABLES_TEMPLATE.md`)

### Client:
```bash
nano /var/www/luzasculture/loza-client-master/loza-client-master/.env.local
```
(انسخ المحتوى من `ENVIRONMENT_VARIABLES_TEMPLATE.md`)

---

## 2️⃣ إعداد DNS

أضف A records لـ:
- `luzasculture.org`
- `www.luzasculture.org`
- `admin.luzasculture.org`

كلها تشير إلى: `2a02:4780:28:4342::1`

---

## 3️⃣ SSL (بعد DNS)

```bash
certbot --nginx -d luzasculture.org -d www.luzasculture.org
certbot --nginx -d admin.luzasculture.org
```

---

## 4️⃣ بدء التطبيقات

```bash
cd /var/www/luzasculture
sudo -u luzauser pm2 start ecosystem.config.js
sudo -u luzauser pm2 save
```

---

**🎉 جاهز!**

