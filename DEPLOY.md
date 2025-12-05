# 🚀 طريقة النشر - Deployment

## ✅ سكربت واحد شامل: `deploy.sh`

---

## 📝 الخطوات

### 1️⃣ رفع على GitHub

```bash
git add deploy.sh
git commit -m "Add deployment script"
git push origin main
```

### 2️⃣ على السيرفر

```bash
ssh root@luzasculture.org
cd /var/www
git clone https://github.com/MahmouT1/luzaend2.git luzasculture
cd luzasculture
chmod +x deploy.sh
sudo ./deploy.sh
```

**السكربت يعمل تلقائياً ويقوم بكل شيء!**

### 3️⃣ بعد السكربت (يدوي)

1. إعداد ملفات `.env`
2. إعداد DNS
3. الحصول على SSL
4. بدء التطبيقات

---

**🎉 جاهز!**
