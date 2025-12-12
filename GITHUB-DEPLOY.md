# Push to GitHub and Deploy to Vercel

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it (e.g., `AnimalBreedingAI` or `BreedWise`)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Add GitHub Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository (the one you just created)
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `AnimalBreedingAI` ⚠️ **IMPORTANT**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
5. Click **Deploy**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from AnimalBreedingAI directory)
cd AnimalBreedingAI
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No (for first deploy)
# - Project name? (Press Enter for default or enter a name)
# - Directory? (Press Enter for current directory)
# - Override settings? No
```

## Step 4: Set Environment Variables

After deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Go to **Deployments** tab
6. Click **⋯** (three dots) on the latest deployment
7. Click **Redeploy**

## Step 5: Verify Deployment

Your app will be available at: `https://your-project-name.vercel.app`

## Troubleshooting

- **Build fails**: Make sure Root Directory is set to `AnimalBreedingAI` in Vercel settings
- **API routes not working**: Check that `api/index.ts` exists and is properly configured
- **Environment variables not working**: Make sure they're set in Vercel dashboard and redeploy

