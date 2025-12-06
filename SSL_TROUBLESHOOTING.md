# 🔒 حل مشاكل SSL - خطوة بخطوة

## ❌ المشاكل الحالية:

1. **admin.luzasculture.org** - غير موجود في DNS
2. **luzasculture.org** - خطأ HTTP 500

---

## ✅ الحل الكامل:

### الخطوة 1: إضافة DNS Records (مهم جداً!)

أضف في DNS Manager:
- `admin.luzasculture.org` → `84.32.84.32` (أو IP السيرفر)

**انتظر 10-15 دقيقة** حتى ينتشر DNS.

---

### الخطوة 2: التحقق من DNS:

```bash
nslookup admin.luzasculture.org
```

يجب أن يظهر IP السيرفر.

---

### الخطوة 3: التحقق من Nginx:

```bash
systemctl status nginx
nginx -t
systemctl restart nginx
```

---

### الخطوة 4: الحصول على SSL للدومين الرئيسي فقط:

```bash
certbot --nginx -d luzasculture.org -d www.luzasculture.org --email orders@luzasculture.org --agree-tos --non-interactive
```

---

### الخطوة 5: بعد انتشار DNS للـ admin:

```bash
certbot --nginx -d admin.luzasculture.org --email orders@luzasculture.org --agree-tos --non-interactive
```

---

## 🔍 إذا استمرت المشكلة:

### تحقق من الموقع:

```bash
curl http://luzasculture.org
```

يجب أن يعطي رد.

### تحقق من Firewall:

```bash
ufw status
```

يجب أن يسمح بـ HTTP/HTTPS.

---

**ابدأ بإضافة DNS للـ admin subdomain!**

