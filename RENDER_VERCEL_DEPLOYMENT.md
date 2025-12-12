# 🆓 100% FREE Deployment Guide: Vercel + Render + Neon

Complete step-by-step instructions for deploying your app completely FREE forever!

---

## 📋 What You'll Need (All FREE)

1. ✅ GitHub account (you already have this!)
2. ✅ Google account (for Gemini API key)
3. ✅ Email address (for signups)
4. ✅ 20 minutes of your time

**Total Cost**: $0/month FOREVER! 🎉

---

## 🗄️ STEP 1: Set Up Database (Neon - FREE)

**Time: 3 minutes**

1. Go to **https://neon.tech**
2. Click **"Sign Up"** (use GitHub or email - both free)
3. Click **"Create Project"**
4. Fill in:
   - **Project Name**: `breedwise-db` (or anything)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 16 (default is fine)
5. Click **"Create Project"**
6. Wait for database to be created (~30 seconds)
7. You'll see a connection string that looks like:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
8. **Click "Copy"** to copy the connection string
9. **Save this somewhere safe** - you'll need it in Step 3!

✅ **Done!** You now have a FREE PostgreSQL database with 512MB storage.

---

## 🔑 STEP 2: Get Google Gemini API Key (FREE)

**Time: 2 minutes**

1. Go to **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Select a Google Cloud project (or create new one - free)
5. Copy the API key (starts with `AIza...`)
6. **Save this** - you'll need it in Step 3!

✅ **Done!** You now have a FREE AI API key (15 requests/minute free tier).

---

## 🚀 STEP 3: Deploy Backend to Render (FREE)

**Time: 8 minutes**

### 3.1 Sign Up for Render
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Click **"Sign Up"** → Choose **"Continue with GitHub"**
4. Authorize Render to access your GitHub account
5. Verify your email if prompted

### 3.2 Create Web Service (Backend)
1. In Render dashboard, click **"New +"** button (top right)
2. Click **"Web Service"**
3. Click **"Connect account"** if you see GitHub connection prompt
4. Find and select **"Breedwise"** repository
5. Click **"Connect"**

### 3.3 Configure Backend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `breedwise-backend` (or anything you like)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (should be auto-selected)
- **Root Directory**: Leave empty (root is fine)
- **Runtime**: `Node` (should auto-detect)
- **Node Version**: `20` (important! Set this manually)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment Variables:**
Click **"Add Environment Variable"** and add these one by one:

1. **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: Paste your Neon connection string from Step 1
   - Click **"Save"**

2. **Variable 2:**
   - Key: `GEMINI_API_KEY`
   - Value: Paste your Gemini API key from Step 2
   - Click **"Save"**

3. **Variable 3:**
   - Key: `NODE_ENV`
   - Value: `production`
   - Click **"Save"**

4. **Variable 4:**
   - Key: `PORT`
   - Value: `10000`
   - Click **"Save"**
   - (Render uses port 10000 by default)

**Plan:**
- Select **"Free"** plan (should be default)

### 3.4 Deploy Backend
1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying (takes 3-5 minutes)
3. Watch the build logs - you should see:
   - ✅ Installing dependencies
   - ✅ Building application
   - ✅ Starting service
4. Wait for **"Live"** status (green indicator)
5. Once live, click on your service name
6. You'll see a URL like: `https://breedwise-backend.onrender.com`
7. **Copy this URL** - you'll need it in Step 4!

✅ **Done!** Your backend is live and FREE!

**Note**: Free tier spins down after 15 min inactivity but wakes automatically on first request (may take 30-60 seconds).

---

## 🌐 STEP 4: Deploy Frontend to Vercel (FREE)

**Time: 5 minutes**

### 4.1 Sign Up for Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 4.2 Import Your Project
1. Click **"Add New Project"** button
2. Find **"Breedwise"** repository in the list
3. Click **"Import"** next to it

### 4.3 Configure Project Settings
Vercel should auto-detect Vite, but verify these settings:

**Framework Preset:**
- Should show: **"Vite"** ✅

**Root Directory:**
- Leave as: `./` (root directory) ✅

**Build and Output Settings:**
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist/public` ✅
- **Install Command**: `npm install` ✅

**Environment Variables:**
1. Click **"Add"** under Environment Variables
2. Add this variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL from Step 3.4
     (Should be: `https://breedwise-backend.onrender.com`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Add"**

### 4.4 Deploy Frontend
1. Scroll down to bottom
2. Click **"Deploy"** button
3. Wait 2-3 minutes for build to complete
4. You'll see: **"Congratulations! Your deployment is ready"**
5. Click the URL (like `https://breedwise.vercel.app`)
6. **Copy this URL** - you'll need it in Step 5!

✅ **Done!** Your frontend is live and FREE!

---

## 🔒 STEP 5: Update CORS Settings

**Time: 2 minutes**

1. Go back to **Render** dashboard
2. Click on your backend service (`breedwise-backend`)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: Your Vercel URL from Step 4.4
     ```
     https://breedwise.vercel.app
     ```
     If you see a preview URL too, add both separated by comma:
     ```
     https://breedwise.vercel.app,https://breedwise-git-main.vercel.app
     ```
6. Click **"Save Changes"**
7. Render will automatically redeploy (takes 1-2 minutes)

✅ **Done!** CORS is configured and your app can communicate!

---

## ✅ STEP 6: Test Your Application!

**Time: 5 minutes**

1. Visit your Vercel URL (from Step 4.4)
2. Test these features:
   - ✅ **Add an animal** - Click "Add Animal" button
   - ✅ **View dashboard** - Check if stats show up
   - ✅ **Generate breeding recommendations** - Go to Breeding page, select animals, click "Analyze"
   - ✅ **View lineage** - Go to Herd Data page
   - ✅ **Test on mobile** - Use browser dev tools (F12 → Toggle device toolbar)

If everything works, you're done! 🎉

---

## 🎉 Success! Your App is Live!

**Your URLs:**
- **Frontend**: `https://breedwise.vercel.app` (or your custom URL)
- **Backend**: `https://breedwise-backend.onrender.com`

**Total Cost**: $0/month FOREVER! 🆓

---

## 🔄 Automatic Updates

Every time you push code to GitHub:
- ✅ **Vercel** automatically redeploys frontend (instant)
- ✅ **Render** automatically redeploys backend (takes 2-3 min)

Just push your code and both update automatically!

---

## 🆘 Troubleshooting

### Backend not responding?
- **Check Render logs**: Render → Your service → "Logs" tab
- **Verify environment variables** are set correctly
- **Check database connection**: Make sure `DATABASE_URL` is correct
- **Wait for first request**: Free tier may take 30-60 seconds to wake up

### Frontend can't connect to backend?
- **Check `VITE_API_URL`** is set in Vercel
- **Verify Render backend URL** is correct
- **Check `ALLOWED_ORIGINS`** includes your Vercel URL
- **Check browser console** (F12) for CORS errors

### Database connection errors?
- **Verify `DATABASE_URL`** is correct (from Neon)
- **Check Neon database** is active (go to Neon dashboard)
- **Try running migrations**: 
  - In Render, go to your service → "Shell" tab
  - Run: `npm run db:push`

### Build fails?
- **Check build logs** in Render/Vercel
- **Verify Node.js version** (should be 18+)
- **Check for TypeScript errors**: Run `npm run check` locally

---

## 📊 What You Get (FREE Forever)

| Service | What's Included | Limits |
|---------|----------------|--------|
| **Vercel** | Unlimited deployments, CDN, SSL | Free forever |
| **Render** | Web services, automatic deploys | Free tier (spins down after 15 min) |
| **Neon** | PostgreSQL database | 512MB free storage |
| **Google Gemini** | AI API | 15 requests/minute free |

---

## 🎯 Next Steps

1. ✅ Your app is live!
2. ✅ Share your Vercel URL with customers
3. ✅ Monitor usage in Render/Vercel dashboards
4. ✅ Push code updates - they deploy automatically!

---

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain to Vercel for free (e.g., `breedwise.com`)
2. **Monitor Usage**: Check Render dashboard to see if you're staying within free tier
3. **Database Backups**: Neon free tier includes automatic backups
4. **Performance**: First request to Render may be slow (waking up), subsequent requests are fast

---

## 📞 Need Help?

If you get stuck at any step:
1. Check the error message in the logs
2. Verify all environment variables are set correctly
3. Make sure you copied URLs correctly
4. Ask me which step you're on and I'll help!

**You've got this!** 🚀

