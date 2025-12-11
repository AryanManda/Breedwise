# BreedWise - Distribution Guide

## Files to Include

To distribute this application, include the following:

1. **`dist/`** folder - Contains the built application
2. **`package.json`** - Required for dependencies
3. **`node_modules/`** - OR have users run `npm install --production`

## Setup Instructions for Recipients

### Option 1: With node_modules included
If you've included `node_modules`, recipients can start immediately:

```bash
npm start
```

### Option 2: Without node_modules (Recommended)
If you haven't included `node_modules`, recipients need to install dependencies first:

```bash
# Install production dependencies only
npm install --production

# Start the application
npm start
```

## Environment Variables

The application requires the following environment variable (optional but recommended):

- **`GEMINI_API_KEY`** - Google Gemini API key for AI breeding recommendations
  - Without this, the app will work but AI features won't function
  - Get your key from: https://makersuite.google.com/app/apikey

### Setting Environment Variables

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
npm start
```

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your-api-key-here
npm start
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="your-api-key-here"
npm start
```

Or create a `.env` file in the root directory:
```
GEMINI_API_KEY=your-api-key-here
```

## Port Configuration

The application runs on port **5000** by default. To change the port, set the `PORT` environment variable:

```bash
# Windows PowerShell
$env:PORT="3000"
npm start

# Linux/Mac
PORT=3000 npm start
```

## What's Included

- **Frontend**: React application built with Vite
- **Backend**: Express server with API endpoints
- **Storage**: In-memory storage (data resets on server restart)

## Troubleshooting

- **Port already in use**: Change the PORT environment variable
- **Module not found errors**: Run `npm install --production`
- **AI features not working**: Ensure GEMINI_API_KEY is set correctly

## Production Notes

- The app uses in-memory storage, so data will be lost when the server restarts
- For persistent storage, you would need to set up a PostgreSQL database and configure DATABASE_URL


