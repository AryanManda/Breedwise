# Fix Vercel Root Directory Error

## The Problem
Vercel error: "The specified Root Directory 'AnimalBreedingAI' does not exist"

This happens when your GitHub repository root IS the AnimalBreedingAI folder, but Vercel is configured to look for it as a subdirectory.

## Solution: Remove Root Directory Setting

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Find **Root Directory** setting
4. Click **Edit**
5. **Clear the field** (leave it empty) or set it to `.` (current directory)
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

## Alternative: If Your Repo Structure is Different

If your GitHub repository structure is:
```
Repository Root/
  └── AnimalBreedingAI/
      └── package.json
```

Then keep Root Directory as `AnimalBreedingAI`.

But if your structure is:
```
Repository Root (AnimalBreedingAI)/
  └── package.json
```

Then Root Directory should be **empty** or `.`

## Quick Fix

The easiest solution is to **remove the Root Directory** setting in Vercel (set it to empty), since your `package.json` and `vercel.json` are already at the repository root level.

