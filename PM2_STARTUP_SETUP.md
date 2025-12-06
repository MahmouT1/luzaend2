# ✅ PM2 يعمل بنجاح! - إعداد Startup Script

## 🎉 التطبيقات تعمل:

- ✅ **luzasculture-server**: online
- ✅ **luzasculture-client**: online

---

## 🔧 إعداد Startup Script (مهم!):

PM2 يطلب منك إعداد startup script لبدء التطبيقات تلقائياً عند إعادة تشغيل السيرفر.

### نفذ هذا الأمر:

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u luzauser --hp /home/luzauser
```

هذا الأمر سينشئ systemd service لبدء PM2 تلقائياً.

---

## ✅ بعد تنفيذ الأمر:

ستظهر رسالة نجاح، والتطبيقات ستبدأ تلقائياً عند إعادة تشغيل السيرفر.

---

## 🔍 التحقق من التطبيقات:

```bash
sudo -u luzauser pm2 status
sudo -u luzauser pm2 logs
```

---

## 🌐 التحقق من المواقع:

- https://admin.luzasculture.org/admin-panel
- https://luzasculture.org (إذا حصلت على SSL)

---

**نفذ الأمر أعلاه لإعداد startup script! ✅**

