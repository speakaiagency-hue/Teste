# 🚀 Deployment Checklist - Speak AI

## ✅ Local Setup (Before Push)

### 1️⃣ **Fix Package.json Dependencies**
```bash
# In your LOCAL terminal (not Replit):
npm uninstall --save-dev esbuild vite
npm install --save esbuild@0.25.12 vite@7.2.4
```

**Verify:** Run `cat package.json` and check that:
```json
"dependencies": {
  "esbuild": "^0.25.12",
  "vite": "^7.2.4",
  ...
}
```

### 2️⃣ **Test Build Locally**
```bash
npm run build
# Should complete with "✅ Build complete!"
```

### 3️⃣ **Push to GitHub**
```bash
git add package.json package-lock.json script/build.cjs render.yaml DEPLOYMENT.md
git commit -m "fix: move esbuild and vite to dependencies, use CommonJS build script for Render"
git push origin main
```

---

## 🔧 Render Configuration

### 1️⃣ **Environment Variables** (in Render Dashboard)
```
DATABASE_URL=postgresql://...  # From Neon
JWT_SECRET=your-secure-secret-key
NODE_ENV=production
GEMINI_API_KEY=your-api-key
KIWIFY_WEBHOOK_SECRET=your-webhook-secret
KIWIFY_CLIENT_SECRET=your-client-secret
KIWIFY_CLIENT_ID=your-client-id
KIWIFY_ACCOUNT_ID=your-account-id
```

### 2️⃣ **Build Command** (verify in Settings)
```
npm ci && node script/build.cjs
```

### 3️⃣ **Start Command** (verify in Settings)
```
npm start
```

### 4️⃣ **Node.js Version**
```
22.16.0 (default)
```

---

## 📡 Kiwify Webhook Setup

### 1️⃣ **Webhook URL**
- Go to Kiwify Dashboard
- Webhook URL: `https://your-render-app.onrender.com/api/webhook/kiwify`
- Events: Purchase Approved, Purchase Refunded

### 2️⃣ **Webhook Secret**
- Copy webhook secret from Kiwify
- Add to Render as `KIWIFY_WEBHOOK_SECRET` environment variable

### 3️⃣ **Test Webhook** (Optional)
```bash
curl -X POST https://your-render-app.onrender.com/api/webhook/kiwify \
  -H "Content-Type: application/json" \
  -d '{
    "purchase_id": "test123",
    "customer_email": "test@example.com",
    "customer_name": "Test User",
    "product_name": "Speak AI Influencer",
    "product_id": "KRTMqIF",
    "value": 19.00,
    "status": "approved"
  }'
```

---

## 📋 Authentication Flow

### Registration
1. User enters email, password (min 6 chars), name
2. Password hashed with bcrypt
3. User stored in PostgreSQL
4. JWT token returned (7-day expiration)

### Login
1. User enters email, password
2. Password compared with bcrypt
3. JWT token returned if match

### Credit Purchase (Kiwify)
1. User buys plan on Kiwify (e.g., $19.00)
2. Kiwify sends webhook to `/api/webhook/kiwify`
3. Credits added: value * 10 (e.g., 190 credits)
4. User can now use generators

### Using Generators
1. Send request with JWT token
2. Middleware verifies token
3. Credits deducted (chat=1, image=5, prompt=2, video=20)
4. Response returned if credits sufficient

---

## ✅ Testing Checklist

- [ ] Local build works: `npm run build`
- [ ] esbuild and vite are in dependencies, not devDependencies
- [ ] GitHub push successful
- [ ] Render deployment starts (Manual Deploy)
- [ ] Render build completes without errors
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can check membership status
- [ ] Webhook receives test payment
- [ ] Credits appear in dashboard
- [ ] Can use generators (credits deducted)

---

## 🔍 Troubleshooting

### Build Fails: "esbuild not found"
- ✅ FIXED: `esbuild` now in dependencies
- Verify: `npm run build` works locally before push

### Render Deploy Fails
- Check Render logs: Settings → Logs
- Common: Missing environment variables
- Solution: Add all KIWIFY_* and DATABASE_URL vars

### Webhook Not Working
- Check: Render logs for `POST /api/webhook/kiwify`
- Verify: KIWIFY_WEBHOOK_SECRET is set
- Test: Use curl command above

### Login Fails
- Check: DATABASE_URL is set
- Verify: User exists in database
- Debug: Check Render logs

---

## 🚀 Final Steps

1. ✅ Fix package.json locally
2. ✅ Test build
3. ✅ Push to GitHub
4. ✅ Add environment variables in Render
5. ✅ Click Manual Deploy in Render
6. ✅ Wait for build to complete
7. ✅ Test login/registration
8. ✅ Configure Kiwify webhook

**App will be live at:** https://your-render-app.onrender.com

---

**Last Updated:** November 29, 2025
