# 🆓 FREE Deployment Guide - 100% Free Setup

All the services below have **free tiers** that are perfect for your application!

---

## ✅ Recommended FREE Setup

### **Frontend**: Vercel (FREE)
- ✅ Unlimited deployments
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Automatic deployments from GitHub
- **Cost**: $0/month

### **Backend**: Railway (FREE tier available)
- ✅ $5 free credit monthly
- ✅ Enough for small-medium apps
- ✅ Automatic deployments
- **Cost**: $0/month (within free tier limits)

### **Database**: Neon (FREE tier)
- ✅ 512 MB storage free
- ✅ Perfect for starting out
- ✅ PostgreSQL
- **Cost**: $0/month

### **AI API**: Google Gemini (FREE tier)
- ✅ Generous free tier
- ✅ 15 requests/minute free
- **Cost**: $0/month (within limits)

---

## 🚀 Alternative FREE Options

### Option 1: Render (100% Free)

**Frontend + Backend on Render:**

1. **Go to [render.com](https://render.com)** - Sign up (free)
2. **Deploy Backend:**
   - New → Web Service
   - Connect GitHub → Select Breedwise repo
   - Build: `npm run build`
   - Start: `npm start`
   - Add PostgreSQL database (free tier)
   - Add env vars: `DATABASE_URL`, `GEMINI_API_KEY`, `NODE_ENV=production`
   - **Cost**: FREE (spins down after 15 min inactivity, wakes on request)

3. **Deploy Frontend:**
   - New → Static Site
   - Connect GitHub → Select Breedwise repo
   - Build: `npm run build`
   - Publish: `dist/public`
   - Add env var: `VITE_API_URL` = your backend URL
   - **Cost**: FREE

**Note**: Render free tier spins down after inactivity but wakes automatically on request (may take 30-60 seconds first request).

---

### Option 2: Fly.io (100% Free)

**Both Frontend + Backend:**

1. **Go to [fly.io](https://fly.io)** - Sign up (free)
2. **Install Fly CLI**: `npm install -g @fly/cli`
3. **Deploy Backend:**
   ```bash
   fly launch
   # Follow prompts
   fly secrets set DATABASE_URL=... GEMINI_API_KEY=...
   fly deploy
   ```
4. **Deploy Frontend:**
   - Create separate Fly app for frontend
   - Same process
   - **Cost**: FREE (3 shared-cpu VMs free)

---

### Option 3: Netlify (Frontend) + Railway (Backend)

**Frontend: Netlify (FREE)**
- ✅ Unlimited bandwidth
- ✅ Free SSL
- ✅ Continuous deployment
- **Cost**: $0/month

**Backend: Railway (FREE tier)**
- As described above

---

## 💰 Cost Comparison

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Vercel** | ✅ Free | Unlimited deployments, CDN, SSL |
| **Railway** | ✅ $5 credit/month | Enough for small apps |
| **Render** | ✅ Free | Web services + static sites |
| **Fly.io** | ✅ Free | 3 VMs, 160GB outbound |
| **Neon** | ✅ Free | 512MB database |
| **Google Gemini** | ✅ Free | 15 req/min |

---

## 🎯 EASIEST FREE Setup (Recommended)

### **Vercel (Frontend) + Railway (Backend) + Neon (Database)**

**Why this combo:**
- ✅ All have generous free tiers
- ✅ Easiest to set up
- ✅ Best performance
- ✅ No spin-down delays
- ✅ Professional URLs

**Total Cost**: $0/month

---

## 📝 Step-by-Step FREE Deployment

### 1. Set Up Database (FREE)

**Neon PostgreSQL:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create project
4. Copy connection string
5. **Cost**: FREE (512MB)

### 2. Deploy Backend (FREE)

**Railway:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free)
3. New Project → Deploy from GitHub
4. Select Breedwise repo
5. Add PostgreSQL (Railway can create one, or use Neon)
6. Add env vars:
   ```
   DATABASE_URL=your_neon_connection_string
   GEMINI_API_KEY=your_key
   NODE_ENV=production
   ```
7. Deploy!
8. **Cost**: FREE ($5 credit/month)

### 3. Deploy Frontend (FREE)

**Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. Add New Project
4. Import Breedwise repo
5. Add env var:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
6. Deploy!
7. **Cost**: FREE

### 4. Update CORS

In Railway, add:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## 🆓 Completely FREE Alternative: Render

If you want everything on one platform:

### **Render (Both Frontend + Backend)**

1. **Backend:**
   - Render → New Web Service
   - Connect GitHub
   - Build: `npm run build`
   - Start: `npm start`
   - Add PostgreSQL (free)
   - **Cost**: FREE

2. **Frontend:**
   - Render → New Static Site
   - Connect GitHub
   - Build: `npm run build`
   - Publish: `dist/public`
   - **Cost**: FREE

**Note**: Free tier spins down after 15 min inactivity (wakes automatically).

---

## ✅ Recommended: Vercel + Railway + Neon

**Why:**
- ✅ No spin-down delays
- ✅ Best performance
- ✅ Easiest setup
- ✅ Professional
- ✅ 100% FREE

**Total Monthly Cost**: $0

---

## 🎉 You're All Set!

All these options are **completely free** and perfect for your application. The Vercel + Railway + Neon combo is recommended for the best experience!

