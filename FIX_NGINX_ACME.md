# 🔧 إصلاح مشكلة HTTP 500 في Certbot

## المشكلة:
Nginx لا يستطيع تقديم ملفات `.well-known/acme-challenge`

## ✅ الحل:

### 1. تحديث تكوين Nginx ليدعم Certbot:

```bash
nano /etc/nginx/sites-available/luzasculture
```

**أضف هذا قبل `location /`:**

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/html;
    allow all;
}
```

### 2. إنشاء المجلد:

```bash
mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html/.well-known
```

### 3. اختبار وإعادة تشغيل:

```bash
nginx -t
systemctl restart nginx
```

### 4. جرب SSL مرة أخرى:

```bash
certbot --nginx -d luzasculture.org -d www.luzasculture.org --email orders@luzasculture.org --agree-tos --non-interactive
```

---

**أو استخدم الحل الأسهل: تأكد من DNS أولاً!**

