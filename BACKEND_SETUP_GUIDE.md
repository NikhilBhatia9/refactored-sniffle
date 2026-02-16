# Backend and Live API Setup Guide 🚀

This comprehensive guide walks you through setting up the Alpha Oracle backend and configuring live API data sources step by step.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Installation](#backend-installation)
3. [Getting API Keys](#getting-api-keys)
4. [Configuration](#configuration)
5. [Running the Backend](#running-the-backend)
6. [Switching from Demo to Live Data](#switching-from-demo-to-live-data)
7. [Testing Your Setup](#testing-your-setup)
8. [Troubleshooting](#troubleshooting)
9. [Verification Checklist](#verification-checklist)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Python 3.11 or higher**
  - Check your version: `python --version` or `python3 --version`
  - Download from: https://www.python.org/downloads/

- **pip** (Python package manager)
  - Usually comes with Python
  - Check version: `pip --version` or `pip3 --version`

- **Git** (for cloning the repository)
  - Check version: `git --version`
  - Download from: https://git-scm.com/downloads

### Optional but Recommended

- **Virtual environment tool** (`venv` or `virtualenv`)
- **Text editor or IDE** (VS Code, PyCharm, etc.)

---

## Backend Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/NikhilBhatia9/refactored-sniffle.git

# Navigate to the project directory
cd refactored-sniffle
```

### Step 2: Set Up Python Virtual Environment (Recommended)

Using a virtual environment keeps your project dependencies isolated:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt when activated.

### Step 3: Navigate to Backend Directory

```bash
cd backend
```

### Step 4: Install Dependencies

⚠️ **IMPORTANT:** Make sure your virtual environment is activated (you should see `(venv)` in your prompt) before running this command!

```bash
# First, upgrade pip to ensure you get pre-built wheels
python -m pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- uvicorn (ASGI server)
- httpx (async HTTP client)
- pandas & numpy (data processing)
- pydantic (data validation)
- SQLAlchemy (database ORM)
- And other dependencies

**Installation should take 1-2 minutes depending on your internet connection.**

**After installation, verify uvicorn is installed:**
```bash
python -m uvicorn --version
# Should display something like: Running uvicorn 0.27.0 with CPython 3.12.3 on Linux/Windows
```

---

## Getting API Keys

Alpha Oracle uses two free API services for live market data. Both are free and require simple registration.

### API Key 1: Alpha Vantage (Stock Market Data)

**Purpose:** Provides real-time stock quotes, sector ETF performance, and historical data.

**Steps to get your key:**

1. Visit: https://www.alphavantage.co/support/#api-key
2. Click "Get Your Free API Key Today"
3. Fill out the simple form:
   - Your Name
   - Email Address
   - Organization (can be "Personal" or "Education")
4. Check "I'm not a robot"
5. Click "GET FREE API KEY"
6. **Your API key will be displayed immediately** - copy it!
7. You'll also receive it via email

**Free Tier Limits:**
- 25 API requests per day
- 5 API requests per minute
- Perfect for testing and development

### API Key 2: FRED (Economic Indicators)

**Purpose:** Provides economic data like GDP, unemployment rate, inflation, interest rates.

**Steps to get your key:**

1. Visit: https://fred.stlouisfed.org/
2. Click "My Account" in the top right
3. Click "Register" (or sign in if you have an account)
4. Fill out the registration form:
   - Email Address
   - Password
   - First and Last Name
5. Verify your email
6. Once logged in, go to: https://fred.stlouisfed.org/docs/api/api_key.html
7. Click "Request API Key"
8. Fill out the simple form describing your usage
9. **Your API key will be generated immediately** - copy it!

**Free Tier Limits:**
- Unlimited requests
- No rate limiting for personal use

---

## Configuration

### Step 1: Create Environment File

The repository includes an example configuration file. Create your own:

```bash
# In the backend directory
cp ../.env.example ../.env
```

Or create the file manually in the **root project directory** (not in backend):

```bash
cd ..
touch .env
```

### Step 2: Edit Configuration File

Open `.env` in your text editor and add your API keys:

```env
# Alpha Oracle Configuration

# API Keys (Required for live data)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
FRED_API_KEY=your_fred_key_here

# Application Settings
APP_NAME=Alpha Oracle
APP_VERSION=1.0.0
DEBUG=false

# Data Refresh Settings
DATA_REFRESH_INTERVAL=3600  # seconds (1 hour)
CACHE_TTL=300  # seconds (5 minutes)

# Database
DB_URL=sqlite+aiosqlite:///./alpha_oracle.db

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

**Important:**
- Replace `your_alpha_vantage_key_here` with your actual Alpha Vantage API key
- Replace `your_fred_key_here` with your actual FRED API key
- Do NOT add quotes around the keys
- Do NOT commit this file to Git (it's in `.gitignore`)

### Step 3: Verify Configuration

You can verify your configuration is being read correctly:

```bash
cd backend
python -c "from app.config import settings; print(f'Demo Mode: {settings.ALPHA_VANTAGE_API_KEY is None}')"
```

If configured correctly, this should print `False`.

---

## Running the Backend

### Step 1: Start the Development Server

From the `backend` directory:

```bash
# Make sure you're in the backend directory
cd backend

# Start the server
python -m uvicorn app.main:app --reload
```

**What the flags mean:**
- `--reload`: Auto-restart server when code changes (useful for development)
- `app.main:app`: Points to the FastAPI app instance

### Step 2: Verify Server is Running

You should see output like:

```
INFO:     Will watch for changes in these directories: ['/path/to/backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 3: Test the Health Endpoint

Open your browser and visit:
```
http://localhost:8000/health
```

You should see:
```json
{
  "status": "healthy",
  "mode": "live",
  "version": "1.0.0"
}
```

If you see `"mode": "demo"`, your API keys are not being read correctly.

---

## Switching from Demo to Live Data

Alpha Oracle automatically switches between demo and live data based on API key presence.

### How It Works

The application checks for API keys in `app/config.py`:

```python
def is_demo_mode() -> bool:
    """Returns True if API keys are not configured"""
    return not (settings.ALPHA_VANTAGE_API_KEY and settings.FRED_API_KEY)
```

**Demo Mode (Default):**
- ✅ Works immediately without any setup
- ✅ Uses realistic, pre-loaded sample data
- ✅ Perfect for testing and exploring features
- ⚠️ Data is static and not updated

**Live Data Mode:**
- ✅ Real-time market data
- ✅ Up-to-date economic indicators
- ✅ Fresh stock prices and sector performance
- ⚠️ Requires API keys
- ⚠️ Subject to API rate limits

### Verification

1. **Check the UI**: Look for the badge in the top right of the dashboard
   - Yellow "Demo Mode" = Using demo data
   - Green "Live Data" = Using live APIs

2. **Check the Health Endpoint**:
   ```bash
   curl http://localhost:8000/health
   ```
   Look for `"mode": "live"` in the response

3. **Check Server Logs**: When the backend starts, you'll see:
   ```
   INFO:     API keys configured. Using live data mode.
   ```
   OR
   ```
   INFO:     API keys not configured. Using demo data mode.
   ```

---

## Testing Your Setup

### Test 1: Health Check

```bash
curl http://localhost:8000/health
```

**Expected Output:**
```json
{
  "status": "healthy",
  "mode": "live",
  "version": "1.0.0"
}
```

### Test 2: Dashboard API

```bash
curl http://localhost:8000/api/dashboard
```

**Expected:** JSON response with market data, recommendations, and sector information.

### Test 3: Sector Data

```bash
curl http://localhost:8000/api/sectors
```

**Expected:** Array of sector objects with names, descriptions, and performance metrics.

### Test 4: Recommendations

```bash
curl http://localhost:8000/api/recommendations
```

**Expected:** Array of stock recommendations with tickers, prices, and analysis.

### Test 5: Interactive API Documentation

Visit http://localhost:8000/docs

This opens the **Swagger UI** where you can:
- See all available endpoints
- Test API calls directly in the browser
- View request/response schemas
- See example responses

### Test 6: Alternative API Documentation

Visit http://localhost:8000/redoc

This shows **ReDoc** documentation with a different, more readable format.

---

## Troubleshooting

### Problem: Server Won't Start - Module Not Found

**Error:** `ModuleNotFoundError: No module named 'uvicorn'` or `No module named 'fastapi'`

**Common Cause:** The virtual environment wasn't activated before installing dependencies, or dependencies weren't installed at all.

**Solution:**

1. **Make sure your virtual environment is activated:**
   ```bash
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```
   
   You should see `(venv)` in your terminal prompt when activated.

2. **Navigate to the backend directory and install dependencies:**
   ```bash
   # Make sure you're in the backend directory
   cd backend
   
   # Install all required packages
   pip install -r requirements.txt
   ```

3. **Verify the installation:**
   ```bash
   # Check if uvicorn is installed
   python -m uvicorn --version
   
   # Should show something like: Running uvicorn 0.27.0 with CPython 3.12.3 on Linux/Windows
   ```

**Important Notes:**
- Dependencies must be installed **after** activating the virtual environment
- If you see the error without `(venv)` in your prompt, activate the virtual environment first
- Each time you open a new terminal, you must activate the virtual environment again

---

### Problem: API Keys Not Working

**Symptoms:**
- Health endpoint shows `"mode": "demo"`
- UI shows "Demo Mode" badge
- Server logs say "Using demo data mode"

**Solutions:**

1. **Check file location**: `.env` must be in the **root project directory**, not in `backend/`
   ```bash
   # Check if file exists
   ls -la ../.env
   ```

2. **Check file contents**: Ensure no extra quotes or spaces
   ```bash
   # View your .env file (be careful not to share this!)
   cat ../.env
   ```

3. **Restart the server**: Changes to `.env` require a restart
   - Press `CTRL+C` to stop
   - Run `python -m uvicorn app.main:app --reload` again

4. **Verify keys are valid**: Test directly
   ```bash
   # Test Alpha Vantage key
   curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=YOUR_KEY"
   
   # Test FRED key
   curl "https://api.stlouisfed.org/fred/series?series_id=GDP&api_key=YOUR_KEY&file_type=json"
   ```

---

### Problem: API Rate Limit Exceeded

**Error in logs:** Rate limit messages from external APIs

**Solutions:**

1. **Wait before retrying**: Alpha Vantage has a 5 requests/minute limit
2. **Use demo mode for development**: Comment out API keys temporarily
3. **Implement caching**: The app already caches responses (5 minutes default)
4. **Consider premium API tier**: If you need higher limits

---

### Problem: Database Errors

**Error:** SQLite or database connection errors

**Solution:**
```bash
# Remove the database file and let it recreate
rm alpha_oracle.db

# Restart the server
python -m uvicorn app.main:app --reload
```

---

### Problem: Port Already in Use

**Error:** `Address already in use`

**Solution:**

1. **Find the process using port 8000:**
   ```bash
   # On macOS/Linux:
   lsof -ti:8000
   
   # On Windows:
   netstat -ano | findstr :8000
   ```

2. **Kill the process:**
   ```bash
   # On macOS/Linux:
   kill -9 $(lsof -ti:8000)
   
   # On Windows:
   taskkill /PID <PID> /F
   ```

3. **Or use a different port:**
   ```bash
   python -m uvicorn app.main:app --reload --port 8001
   ```

---

### Problem: CORS Errors in Frontend

**Error in browser console:** "CORS policy blocked"

**Solution:**

1. **Check CORS_ORIGINS in `.env`:**
   ```env
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

2. **Add your frontend URL** if it's different

3. **Restart backend** after changing `.env`

---

### Problem: Empty or Missing Data

**Symptoms:** API returns empty arrays or null values

**Solutions:**

1. **Check API key validity**: Keys might have expired
2. **Check rate limits**: You might have exceeded free tier limits
3. **Check internet connection**: APIs require internet access
4. **Review logs**: Look for error messages in the terminal
5. **Test individual APIs**: Use curl to test Alpha Vantage and FRED directly

---

### Problem: pip install fails with "subprocess-exited-with-error" (Windows)

**Error:** `error: subprocess-exited-with-error` when installing pandas/numpy, with messages like:
- "ERROR: Unknown compiler(s): [['icl'], ['cl'], ['cc'], ['gcc'], ['clang']]"
- "installing build dependencies for pandas did not run successfully"
- "[WinError 2] The system cannot find the file specified"

**Root Cause:** This error occurs when pip tries to build packages (like numpy or pandas) from source code instead of using pre-built binary wheels. Building from source requires C/C++ compilers, which are not installed by default on Windows.

**Solutions (in order of recommendation):**

#### Solution 1: Upgrade pip (Recommended)

Older versions of pip may not properly detect or use pre-built wheels. Upgrade pip first:

```bash
# Activate your virtual environment first!
venv\Scripts\activate

# Upgrade pip to the latest version
python -m pip install --upgrade pip

# Now install requirements
pip install -r requirements.txt
```

#### Solution 2: Force Binary Wheels Only

If upgrading pip doesn't work, force pip to only use pre-built binary wheels:

```bash
# This will fail if wheels aren't available, which helps diagnose the issue
pip install --only-binary :all: -r requirements.txt
```

If this command fails, it means wheels aren't available for your Python version. In that case:
- Verify you're using **Python 3.11 or 3.12** (run `python --version`)
- If you're using Python 3.13+, some packages may not have wheels yet. Use Python 3.12 instead.

#### Solution 3: Install Packages Individually

Try installing pandas and numpy separately first:

```bash
# Install numpy first
pip install --upgrade numpy==1.26.4

# Then install pandas
pip install --upgrade pandas==2.2.2

# Finally, install remaining requirements
pip install -r requirements.txt
```

#### Solution 4: Install Visual Studio Build Tools (Last Resort)

If you absolutely need to build from source, install Microsoft C++ Build Tools:

1. **Download Visual Studio Build Tools:**
   - Visit: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "Tools for Visual Studio"
   - Download "Build Tools for Visual Studio 2022"

2. **Run the installer and select:**
   - "Desktop development with C++"
   - Make sure "MSVC" and "Windows SDK" are checked

3. **Restart your terminal** and try installing again

**Note:** This is a ~6GB download and is usually unnecessary if you're using the correct Python version with upgraded pip.

#### Solution 5: Use a Different Python Version

If you're using Python 3.13 or newer:

```bash
# Check your Python version
python --version

# If it's 3.13+, install Python 3.12 instead
# Download from: https://www.python.org/downloads/
```

Python 3.12 has better package compatibility as more packages have pre-built wheels available.

**Prevention Tips:**
- Always use **Python 3.11 or 3.12** for best compatibility
- Always **upgrade pip** before installing packages: `python -m pip install --upgrade pip`
- Use **virtual environments** to avoid system-wide conflicts
- On Windows, prefer pre-built wheels over building from source

---

## Verification Checklist

Use this checklist to ensure everything is set up correctly:

### Backend Setup
- [ ] Python 3.11+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] No installation errors

### API Keys
- [ ] Alpha Vantage API key obtained
- [ ] FRED API key obtained
- [ ] Both keys tested and working
- [ ] Keys added to `.env` file

### Configuration
- [ ] `.env` file created in root directory
- [ ] API keys added without quotes
- [ ] No extra spaces or line breaks
- [ ] File not committed to Git

### Server Running
- [ ] Backend server starts without errors
- [ ] Server accessible at http://localhost:8000
- [ ] Health endpoint returns `"mode": "live"`
- [ ] No error messages in terminal

### API Testing
- [ ] `/health` endpoint works
- [ ] `/api/dashboard` returns data
- [ ] `/api/sectors` returns sectors
- [ ] `/api/recommendations` returns stocks
- [ ] `/docs` page loads (Swagger UI)

### Live Data Verification
- [ ] UI shows "Live Data" badge (not "Demo Mode")
- [ ] Stock prices appear current
- [ ] Sector data updates
- [ ] Economic indicators are recent

### Integration
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console
- [ ] Data displays correctly in UI
- [ ] Navigation between pages works

---

## Next Steps

Once your backend is set up with live APIs:

1. **Start the Frontend**: Follow the frontend setup guide in `/frontend/README.md`
2. **Explore the API**: Visit http://localhost:8000/docs to see all endpoints
3. **Customize Settings**: Adjust cache duration, refresh intervals in `.env`
4. **Monitor Usage**: Keep track of your API quota usage
5. **Build Features**: Use the live data to build your own analysis

---

## Additional Resources

### API Documentation
- [Alpha Vantage Docs](https://www.alphavantage.co/documentation/)
- [FRED API Docs](https://fred.stlouisfed.org/docs/api/fred/)

### Backend Framework
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)

### Python Resources
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [Python pip Documentation](https://pip.pypa.io/en/stable/)

### Project Documentation
- [Main README](./README.md) - Overview and features
- [Frontend README](./frontend/README.md) - Frontend setup
- [API Endpoints](http://localhost:8000/docs) - Interactive API docs (when server is running)

---

## Support

If you encounter issues not covered in this guide:

1. **Check the logs**: Server logs often contain helpful error messages
2. **Search issues**: Look through [GitHub Issues](https://github.com/NikhilBhatia9/refactored-sniffle/issues)
3. **Open an issue**: Create a detailed bug report with:
   - Your OS and Python version
   - Steps to reproduce
   - Error messages
   - What you've tried

---

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit API keys**: The `.env` file is in `.gitignore` for a reason
2. **Don't share your keys**: Keep them private
3. **Rotate keys if exposed**: If you accidentally expose keys, generate new ones
4. **Use environment variables**: Don't hardcode keys in source code
5. **Monitor usage**: Check your API dashboards regularly

---

**Congratulations! 🎉** You now have a fully functional backend with live market data. Your Alpha Oracle platform is ready to provide real-time investment intelligence!

---

*Last Updated: 2026-02-16*
*Alpha Oracle - Where AI meets timeless investment wisdom*
