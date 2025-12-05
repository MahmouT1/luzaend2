# 🔐 Environment Variables Template

## Server Environment Variables

**File:** `loza-server-master/loza-server-master/.env`

```env
# Server Configuration
PORT=8000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/

# JWT Secret (Change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Cloudinary
CLOUD_NAME=dxptnzuri
CLOUD_API_KEY=848427894577436
CLOUD_SECRET_KEY=Bs4GLoPFouvduveDQiFn4IHiL-k

# Email Configuration (Hostinger SMTP)
EMAIL_USER=orders@luzasculture.org
EMAIL_PASS=Memo.Ro2123
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465

# CORS Configuration
CLIENT_URL=https://luzasculture.org
ADMIN_URL=https://admin.luzasculture.org
```

---

## Client Environment Variables

**File:** `loza-client-master/loza-client-master/.env.local`

```env
# API URL
NEXT_PUBLIC_API_URL=https://luzasculture.org/api

# NextAuth Configuration
NEXTAUTH_URL=https://luzasculture.org
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxptnzuri
NEXT_PUBLIC_CLOUDINARY_API_KEY=848427894577436
```

---

## 🔒 Security Notes

- ⚠️ **Never commit .env files to Git**
- ⚠️ **Change JWT_SECRET and NEXTAUTH_SECRET to random strings**
- ⚠️ **Keep credentials secure and private**
- ⚠️ **Use different secrets for production**

---

## 📝 How to Generate Secure Secrets

```bash
# Generate JWT Secret (32+ characters)
openssl rand -base64 32

# Generate NextAuth Secret (32+ characters)
openssl rand -base64 32
```

---

## ✅ Verification

After setting environment variables:

1. Server: Restart server to load new variables
2. Client: Rebuild Next.js app to include variables
3. Test: Verify API connections work correctly

---

**🔐 Keep your .env files secure!**

