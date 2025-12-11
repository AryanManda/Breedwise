# Deploying to Vercel

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the project directory**:
   ```bash
   cd AnimalBreedingAI
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deploy)
   - Project name? (Press Enter for default or enter a name)
   - Directory? (Press Enter for current directory)
   - Override settings? **No**

5. **Set Environment Variables**:
   After deployment, go to your Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key value
   - Redeploy the application

## Deploy via GitHub (Recommended)

1. **Push your code to GitHub**

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure the project**:
   - Framework Preset: **Other**
   - **Root Directory: `AnimalBreedingAI`** ⚠️ **IMPORTANT: Set this to `AnimalBreedingAI`**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

6. **Add Environment Variables**:
   - `GEMINI_API_KEY` - Your Google Gemini API key

7. **Click Deploy**

### ⚠️ If you already deployed and it failed:

1. Go to your project in Vercel Dashboard
2. Go to **Settings** → **General**
3. Find **Root Directory** setting
4. Change it to: `AnimalBreedingAI`
5. Click **Save**
6. Go to **Deployments** tab and click **Redeploy** on the latest deployment

## Environment Variables

Make sure to set these in Vercel Dashboard → Settings → Environment Variables:

- **GEMINI_API_KEY** (Required for AI features)
  - Get your key from: https://makersuite.google.com/app/apikey

## Project Structure for Vercel

- `api/index.ts` - Serverless function for API routes
- `dist/public/` - Built frontend (created during build)
- `vercel.json` - Vercel configuration

## Troubleshooting

- **Build fails**: Make sure all dependencies are in `package.json`
- **API routes not working**: Check that `api/index.ts` is properly configured
- **Frontend not loading**: Verify `outputDirectory` in `vercel.json` matches build output
- **Environment variables not working**: Make sure they're set in Vercel dashboard and redeploy

## After Deployment

Your app will be available at: `https://your-project-name.vercel.app`

You can also set up a custom domain in the Vercel dashboard.

