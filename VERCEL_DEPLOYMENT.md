# Deploying to Vercel - Step by Step Guide

This guide will help you deploy your AnimalBreedingAI app to Vercel. Since your app has a full Express backend, we'll use a **hybrid approach**: Frontend on Vercel, Backend on Railway (or Render).

---

## 🎯 Architecture

```
Frontend (Vercel) → Backend API (Railway/Render) → PostgreSQL Database
```

---

## 📋 Prerequisites

1. **GitHub account** (Vercel connects via GitHub)
2. **Railway account** (for backend) - [railway.app](https://railway.app)
3. **Database**: Neon PostgreSQL - [neon.tech](https://neon.tech)
4. **Google Gemini API Key** - [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

---

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Set up Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Connect your GitHub and select the `AnimalBreedingAI` repository
4. Railway will detect it's a Node.js app

### 1.2 Configure Backend

1. **Add PostgreSQL Database**:
   - Click **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will create a database and set `DATABASE_URL` automatically

2. **Add Environment Variables**:
   - Go to your project → **Variables** tab
   - Add:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     NODE_ENV=production
     ALLOWED_ORIGINS=https://yourapp.vercel.app,https://yourapp-git-main.vercel.app
     ```
     (Replace with your actual Vercel frontend URLs - you'll add these after deploying frontend)
   - `DATABASE_URL` is already set by Railway

3. **Configure Build & Start**:
   - Railway should auto-detect:
     - **Build Command**: (none needed, Railway handles it)
     - **Start Command**: `npm start`
   - If not, set manually in Settings

4. **Deploy**:
   - Railway will automatically build and deploy
   - Wait for deployment to complete (~2-3 minutes)
   - Copy your backend URL (e.g., `https://yourapp.up.railway.app`)

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Set up Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (use GitHub)
2. Click **"Add New Project"**
3. Import your `AnimalBreedingAI` repository
4. Vercel will detect it's a Vite project

### 2.2 Configure Vercel

1. **Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

2. **Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add:
     ```
     VITE_API_URL=https://yourapp.up.railway.app
     ```
     (Replace with your actual Railway backend URL)

3. **Deploy**:
   - Click **"Deploy"**
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://yourapp.vercel.app`

---

## 🔧 Step 3: Update CORS Settings

After deploying frontend, update backend CORS:

1. Go to Railway → Your backend project → **Variables**
2. Update `ALLOWED_ORIGINS` to include your Vercel URLs:
   ```
   ALLOWED_ORIGINS=https://yourapp.vercel.app,https://yourapp-git-main.vercel.app
   ```
   (Add all your Vercel preview URLs if needed)

CORS is already configured in the backend - you just need to set the allowed origins!

---

## ✅ Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://yourapp.vercel.app`
2. Test all features:
   - ✅ Add animals
   - ✅ View dashboard
   - ✅ Generate breeding recommendations
   - ✅ View lineage
   - ✅ Test on mobile devices

---

## 🔄 Step 5: Set Up Automatic Deployments

### Backend (Railway):
- ✅ Already automatic! Every push to main branch deploys

### Frontend (Vercel):
- ✅ Already automatic! Every push to main branch deploys

---

## 🌍 Step 6: Add Custom Domain (Optional)

### For Vercel Frontend:
1. Go to Vercel → Your Project → **Settings** → **Domains**
2. Add your domain (e.g., `breedwise.com`)
3. Follow DNS instructions:
   - Add CNAME record: `@` → `cname.vercel-dns.com`
4. SSL certificate is automatic

### For Railway Backend:
1. Go to Railway → Your Project → **Settings** → **Domains**
2. Add custom domain
3. Update `VITE_API_URL` in Vercel to use your custom backend domain

---

## 🐛 Troubleshooting

### Frontend can't connect to backend:
- ✅ Check `VITE_API_URL` is set correctly in Vercel
- ✅ Verify backend URL is accessible (visit it in browser)
- ✅ Check CORS settings in backend

### Build fails:
- ✅ Check build logs in Vercel dashboard
- ✅ Ensure `npm run build` works locally
- ✅ Verify all dependencies are in `package.json`

### Database errors:
- ✅ Verify `DATABASE_URL` is set in Railway
- ✅ Check database is accessible
- ✅ Run migrations: `npm run db:push` (you can do this via Railway's console)

---

## 📊 Monitoring

### Vercel:
- **Analytics**: Built-in analytics dashboard
- **Logs**: Real-time function logs
- **Performance**: Core Web Vitals tracking

### Railway:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Database**: Connection pool monitoring

---

## 💰 Cost Estimate

**Free Tier**:
- Vercel: Free (hobby plan)
- Railway: Free tier available
- Neon Database: Free tier (512 MB)
- Google Gemini: Free tier

**Paid** (if you exceed free limits):
- Vercel Pro: $20/month (optional)
- Railway: ~$5/month
- Database: ~$0-5/month
- API: Pay-as-you-go

**Total**: ~$5-25/month depending on usage

---

## 🎉 You're Done!

Your app is now live and accessible to customers:
- **Frontend**: `https://yourapp.vercel.app`
- **Backend**: `https://yourapp.up.railway.app`

Both will automatically update when you push to GitHub! 🚀

---

## 📝 Quick Reference

**Backend URL**: `https://yourapp.up.railway.app`  
**Frontend URL**: `https://yourapp.vercel.app`  
**Environment Variable**: `VITE_API_URL` (set in Vercel)

**To update**:
1. Make changes locally
2. Push to GitHub
3. Both platforms auto-deploy!

