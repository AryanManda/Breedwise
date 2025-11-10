# Deployment Guide for AnimalBreedingAI

This guide will help you deploy your application so customers can access it.

## 📋 Prerequisites

Before deploying, you'll need:
1. **Database**: PostgreSQL database (we'll use Neon - free tier available)
2. **API Key**: Google Gemini API key for AI features
3. **Domain** (optional but recommended): A custom domain name

---

## 🌐 Do You Need a Domain?

**Short answer: No, but it's recommended.**

- **Without a domain**: You'll get a URL like `yourapp.railway.app` or `yourapp.vercel.app`
- **With a domain**: You can use `yourapp.com` or `breedwise.com` (more professional)

**Domain providers** (usually $10-15/year):
- Namecheap
- Google Domains
- Cloudflare
- GoDaddy

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Easiest) ⭐

**Best for**: Quick deployment, includes database, free tier available

**Steps**:
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repository
4. Railway will automatically detect your Node.js app
5. Add environment variables:
   - `DATABASE_URL` (Railway can provision PostgreSQL for you)
   - `GEMINI_API_KEY` (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - `NODE_ENV=production`
   - `PORT` (Railway sets this automatically)
6. Railway will build and deploy automatically
7. You'll get a URL like `yourapp.up.railway.app`
8. (Optional) Add custom domain in Railway settings

**Cost**: Free tier available, then ~$5/month

---

### Option 2: Render

**Best for**: Free tier with automatic SSL

**Steps**:
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (same as Railway)
6. Create PostgreSQL database in Render dashboard
7. Copy database URL to `DATABASE_URL`
8. Deploy!

**Cost**: Free tier available (spins down after inactivity), then ~$7/month

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Best for**: Maximum performance, separate frontend/backend

**Steps**:
1. Deploy backend to Railway/Render (see above)
2. Deploy frontend to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Set build command: `npm run build`
   - Set output directory: `dist/public`
   - Add environment variable: `VITE_API_URL` pointing to your backend
3. Update API calls in frontend to use `VITE_API_URL`

**Cost**: Free tier available

---

### Option 4: Fly.io

**Best for**: Global edge deployment, Docker support

**Steps**:
1. Install Fly CLI: `npm install -g @fly/cli`
2. Run `fly launch` in your project directory
3. Follow prompts to create app
4. Add environment variables: `fly secrets set DATABASE_URL=... GEMINI_API_KEY=...`
5. Deploy: `fly deploy`

**Cost**: Free tier available, then pay-as-you-go

---

## 🗄️ Setting Up Database (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and sign up (free tier available)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
4. Add this as `DATABASE_URL` in your deployment platform
5. Run migrations:
   ```bash
   npm run db:push
   ```
   Or set up a migration script in your deployment platform

---

## 🔑 Setting Up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add as `GEMINI_API_KEY` environment variable in your deployment platform

**Cost**: Free tier includes generous limits, then pay-as-you-go

---

## 📝 Environment Variables Checklist

Make sure these are set in your deployment platform:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=5000  # Usually set automatically by platform
```

---

## 🔒 Security Checklist

Before going live:
- [ ] All API keys are in environment variables (not in code)
- [ ] Database credentials are secure
- [ ] HTTPS is enabled (most platforms do this automatically)
- [ ] CORS is configured if needed
- [ ] Rate limiting is considered for API endpoints

---

## 📱 Testing Your Deployment

1. Visit your deployed URL
2. Test all features:
   - Add animals
   - Create breeding recommendations
   - View lineage
   - Test on mobile devices
3. Check browser console for errors
4. Monitor logs in your deployment platform

---

## 🌍 Adding a Custom Domain

### If using Railway:
1. Go to your project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS instructions (add CNAME record)
5. Wait for SSL certificate (automatic)

### If using Render:
1. Go to your service → Settings → Custom Domains
2. Add your domain
3. Follow DNS instructions
4. SSL is automatic

### DNS Configuration:
- **Type**: CNAME
- **Name**: @ or www
- **Value**: Your platform's domain (e.g., `yourapp.up.railway.app`)

---

## 🚨 Troubleshooting

### Build fails:
- Check build logs in deployment platform
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database connection errors:
- Verify `DATABASE_URL` is correct
- Check database is accessible from deployment platform
- Ensure migrations have run

### API errors:
- Check `GEMINI_API_KEY` is set correctly
- Verify API key has proper permissions
- Check API usage limits

---

## 📊 Monitoring & Maintenance

- **Logs**: Check deployment platform's logs regularly
- **Database**: Monitor database size and performance
- **API Usage**: Monitor Google Gemini API usage
- **Uptime**: Most platforms provide uptime monitoring

---

## 💰 Cost Estimate

**Free Tier Setup**:
- Railway/Render: Free tier
- Neon Database: Free tier (512 MB)
- Google Gemini: Free tier (15 requests/minute)
- Domain: $10-15/year (optional)

**Paid Setup** (for production):
- Hosting: $5-10/month
- Database: $0-5/month (depending on usage)
- API: Pay-as-you-go (usually <$10/month for small apps)
- Domain: $10-15/year

**Total**: ~$15-30/month for small-medium usage

---

## 🎯 Quick Start (Railway - Recommended)

1. **Sign up**: [railway.app](https://railway.app)
2. **Deploy**: Click "New Project" → "Deploy from GitHub"
3. **Database**: Click "New" → "Database" → "Add PostgreSQL"
4. **Environment Variables**: Add `DATABASE_URL` and `GEMINI_API_KEY`
5. **Deploy**: Railway does the rest automatically!

Your app will be live in ~5 minutes! 🎉

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs

