# 🚀 Step-by-Step FREE Deployment Guide

Follow these steps exactly to deploy your app for FREE!

---

## 📋 What You'll Need (All FREE)

1. ✅ GitHub account (you already have this!)
2. ✅ Google account (for Gemini API key)
3. ✅ 15 minutes of your time

---

## 🗄️ STEP 1: Set Up Database (Neon - FREE)

**Time: 2 minutes**

1. Go to **https://neon.tech**
2. Click **"Sign Up"** (use GitHub or email)
3. Click **"Create Project"**
4. Name it: `breedwise-db` (or anything you like)
5. Click **"Create Project"**
6. **Copy the connection string** - it looks like:
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```
7. **Save this somewhere** - you'll need it in Step 2!

✅ **Done!** You now have a free PostgreSQL database.

---

## 🔧 STEP 2: Get Google Gemini API Key (FREE)

**Time: 2 minutes**

1. Go to **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (starts with `AIza...`)
5. **Save this** - you'll need it in Step 3!

✅ **Done!** You now have a free AI API key.

---

## 🚂 STEP 3: Deploy Backend to Railway (FREE)

**Time: 5 minutes**

### 3.1 Sign Up
1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub

### 3.2 Deploy Your App
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Find and select **"Breedwise"** repository
4. Click **"Deploy Now"**
5. Railway will start deploying (wait 2-3 minutes)

### 3.3 Add Database
1. In your Railway project, click **"New"**
2. Click **"Database"**
3. Click **"Add PostgreSQL"**
4. Railway will create a database automatically
5. **OR** use your Neon database (see below)

**To use Neon database instead:**
1. Go to your Railway project → **Variables** tab
2. Click **"New Variable"**
3. Name: `DATABASE_URL`
4. Value: Paste your Neon connection string from Step 1
5. Click **"Add"**

### 3.4 Add Environment Variables
1. Still in **Variables** tab
2. Click **"New Variable"** and add:

   **Variable 1:**
   - Name: `GEMINI_API_KEY`
   - Value: Paste your Gemini API key from Step 2
   - Click **"Add"**

   **Variable 2:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Click **"Add"**

### 3.5 Get Your Backend URL
1. Wait for deployment to finish (green checkmark)
2. Click on your service (not the database)
3. Go to **"Settings"** tab
4. Scroll to **"Domains"** section
5. You'll see a URL like: `https://breedwise-production.up.railway.app`
6. **Copy this URL** - you'll need it in Step 4!

✅ **Done!** Your backend is live!

---

## 🌐 STEP 4: Deploy Frontend to Vercel (FREE)

**Time: 5 minutes**

### 4.1 Sign Up
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 4.2 Import Your Project
1. Click **"Add New Project"**
2. Find **"Breedwise"** repository
3. Click **"Import"**

### 4.3 Configure Project
Vercel should auto-detect everything, but verify:

- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist/public` ✅

### 4.4 Add Environment Variable
1. Scroll down to **"Environment Variables"**
2. Click **"Add"**
3. Name: `VITE_API_URL`
4. Value: Paste your Railway backend URL from Step 3.5
   (Should look like: `https://breedwise-production.up.railway.app`)
5. Click **"Add"**

### 4.5 Deploy!
1. Scroll to bottom
2. Click **"Deploy"**
3. Wait 2-3 minutes for build to complete
4. You'll see: **"Congratulations! Your deployment is ready"**
5. Click the URL (like `https://breedwise.vercel.app`)

✅ **Done!** Your frontend is live!

---

## 🔒 STEP 5: Update CORS (Important!)

**Time: 1 minute**

1. Go back to **Railway** → Your project
2. Go to **Variables** tab
3. Click **"New Variable"**
4. Name: `ALLOWED_ORIGINS`
5. Value: Your Vercel URL (from Step 4.5)
   ```
   https://breedwise.vercel.app
   ```
   If you see a preview URL too, add both:
   ```
   https://breedwise.vercel.app,https://breedwise-git-main.vercel.app
   ```
6. Click **"Add"**
7. Railway will automatically redeploy

✅ **Done!** CORS is configured!

---

## ✅ STEP 6: Test Your App!

1. Visit your Vercel URL (from Step 4.5)
2. Test these features:
   - ✅ Add an animal
   - ✅ View dashboard
   - ✅ Generate breeding recommendations
   - ✅ View lineage
   - ✅ Test on mobile (use browser dev tools)

---

## 🎉 You're Done!

Your app is now live and accessible to customers!

**Your URLs:**
- **Frontend**: `https://breedwise.vercel.app` (or your custom URL)
- **Backend**: `https://your-app.up.railway.app`

**Total Cost**: $0/month 🆓

---

## 🔄 Future Updates

Every time you push to GitHub:
- ✅ Vercel automatically redeploys frontend
- ✅ Railway automatically redeploys backend

Just push your code and both update automatically!

---

## 🆘 Troubleshooting

### Backend not working?
- Check Railway logs: Railway → Your service → Logs tab
- Verify environment variables are set correctly
- Make sure database connection string is correct

### Frontend can't connect to backend?
- Check `VITE_API_URL` is set in Vercel
- Verify Railway backend URL is correct
- Check `ALLOWED_ORIGINS` includes your Vercel URL

### Database errors?
- Verify `DATABASE_URL` is correct
- Check Neon database is active
- Try running migrations: In Railway, go to your service → Deployments → Click latest → Open terminal → Run `npm run db:push`

---

## 📞 Need Help?

If you get stuck at any step, let me know which step and I'll help you!

