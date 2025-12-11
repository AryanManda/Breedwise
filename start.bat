@echo off
echo Starting BreedWise Application...
echo.
echo Make sure you have installed dependencies with: npm install --production
echo.
if not exist node_modules (
    echo Installing dependencies...
    call npm install --production
)
echo.
echo Starting server on port 5000...
echo Open http://localhost:5000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.
npm start


