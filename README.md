# Alpha Oracle 📈

**AI-Powered Investment Recommendation Platform**

Alpha Oracle is a comprehensive investment intelligence platform that provides outstanding investment opportunities based on sector analysis, economic cycles, and the investment philosophies of legendary investors like Warren Buffett, Peter Lynch, Ray Dalio, and Howard Marks.

![Dashboard](https://github.com/user-attachments/assets/f4fe8ce1-9178-4060-a90b-a24758ade085)

## 🎯 Core Features

### 🔍 Investment Philosophy

Alpha Oracle encodes proven investment strategies:

1. **Sectoral Rotation** — Identify which sectors are best positioned for each phase of the economic cycle
2. **Macro-Aware Positioning** — Factor in interest rates, inflation, GDP growth, and unemployment
3. **Margin of Safety** — Valuation discipline using P/E, P/B, PEG, and DCF analysis
4. **Asymmetric Risk/Reward** — Score stocks on upside potential vs downside risk
5. **Tailwind/Headwind Analysis** — Political, geopolitical, regulatory, technological, and demographic factors

### 📊 Platform Capabilities

- **Real-Time Market Analysis** — Live economic indicators and sector performance tracking
- **20+ Stock Recommendations** — High-conviction picks across all major sectors
- **11 Sector Deep Dives** — Comprehensive analysis of each GICS sector
- **Economic Cycle Detection** — Automatic identification of expansion, peak, contraction, or trough phases
- **Geopolitical Risk Assessment** — Track global risks and their investment implications
- **Portfolio Allocation** — Customized recommendations based on risk tolerance (Conservative, Moderate, Aggressive)

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload

# Server runs on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

### Access the Platform

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Dashboard │ │ Sectors  │ │   Recs   │ │Portfolio │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                          │                                   │
│                     API Client                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────┴─────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes                              │   │
│  │  /dashboard | /sectors | /recommendations | ...     │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────┴─────────────────────────────────┐   │
│  │            Business Logic Layer                      │   │
│  │  • RecommendationEngine  • AnalysisEngine           │   │
│  │  • MarketDataProvider    • Demo Data Fallback       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         External APIs (Optional)                     │   │
│  │  • Alpha Vantage (Market Data)                       │   │
│  │  • FRED (Economic Indicators)                        │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
refactored-sniffle/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── config.py               # Configuration management
│   │   ├── database.py             # Database setup
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   ├── services/
│   │   │   ├── demo_data.py        # Demo data provider
│   │   │   ├── data_provider.py    # Market data fetching
│   │   │   ├── analysis_engine.py  # Investment analysis logic
│   │   │   └── recommendation_engine.py  # Stock recommendations
│   │   └── api/
│   │       └── routes/
│   │           ├── dashboard.py
│   │           ├── sectors.py
│   │           ├── recommendations.py
│   │           ├── macro.py
│   │           └── portfolio.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # React entry point
│   │   ├── App.jsx                # Main app with routing
│   │   ├── index.css              # Global styles
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sectors.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── MacroView.jsx
│   │   │   └── Portfolio.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SectorCard.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── MacroIndicator.jsx
│   │   │   ├── ConvictionGauge.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── AllocationChart.jsx
│   │   │   └── CycleIndicator.jsx
│   │   └── services/
│   │       └── api.js             # API client
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/f4fe8ce1-9178-4060-a90b-a24758ade085)
*Main dashboard with top recommendations, geopolitical risks, and market overview*

### Sectors Analysis
![Sectors](https://github.com/user-attachments/assets/d4994d19-73d4-4472-8ec8-598dc173d831)
*Comprehensive sector analysis with conviction scores and trend indicators*

### Recommendations
![Recommendations](https://github.com/user-attachments/assets/70884591-d8de-4ed4-b0a7-abe153b39b20)
*Filterable stock recommendations with detailed investment thesis*

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# API Keys (Optional - platform works with demo data)
ALPHA_VANTAGE_API_KEY=your_key_here
FRED_API_KEY=your_key_here

# Application Settings
DEBUG=false
DATA_REFRESH_INTERVAL=3600
CACHE_TTL=300

# Database
DB_URL=sqlite+aiosqlite:///./alpha_oracle.db
```

**Note**: The platform works out-of-the-box without API keys using comprehensive demo data.

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard` — Complete dashboard summary

### Sectors
- `GET /api/sectors` — All sector analyses
- `GET /api/sectors/{sector_name}` — Detailed sector analysis

### Recommendations
- `GET /api/recommendations` — Filtered stock recommendations
  - Query params: `strategy`, `sector`, `min_conviction`, `limit`
- `GET /api/recommendations/{ticker}` — Specific stock details

### Macro
- `GET /api/macro` — Economic indicators snapshot
- `GET /api/macro/cycle` — Economic cycle analysis
- `GET /api/macro/geopolitical` — Geopolitical risks

### Portfolio
- `GET /api/portfolio/allocation` — Suggested allocation by risk tolerance
- `GET /api/portfolio/recommendations` — Portfolio-ready stock picks

## 🎯 Investment Strategies

### Growth Strategy
Focus on high-growth sectors (Technology, Healthcare, Communication Services) with strong secular trends and innovation drivers.

### Value Strategy
Target undervalued stocks with low P/E ratios, significant upside to fair value, and strong fundamentals.

### Defensive Strategy
Emphasize recession-resistant sectors (Healthcare, Consumer Staples, Utilities) with stable cash flows and dividend yields.

### Contrarian Strategy
Identify oversold opportunities in out-of-favor sectors with improving fundamentals and positive inflection points.

## 🌍 Economic Cycle Framework

Alpha Oracle automatically adjusts recommendations based on the economic cycle:

- **Early Expansion** → Favor Consumer Discretionary, Financials, Industrials
- **Mid Expansion** → Favor Technology, Communication Services, Materials
- **Late Expansion / Peak** → Favor Energy, Materials, Defensives
- **Contraction** → Favor Healthcare, Utilities, Consumer Staples

## 🛡️ Security

- No authentication required for demo data access
- API keys stored securely in environment variables
- CORS protection for API endpoints
- Rate limiting ready for production deployment

## 🚢 Deployment

### Production Build

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder with any static file server
```

### Docker (Coming Soon)
```bash
docker-compose up
```

## 📈 Technologies

### Backend
- **FastAPI** — Modern Python web framework
- **Pydantic** — Data validation and settings
- **SQLAlchemy** — Database ORM (async)
- **httpx** — Async HTTP client
- **pandas & numpy** — Data analysis

### Frontend
- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework with dark theme
- **Recharts** — Data visualization
- **React Router** — Client-side routing
- **Axios** — HTTP client

## 🎓 Educational Purpose

Alpha Oracle encodes the investment wisdom of legendary investors:

- **Warren Buffett** — Quality businesses, margin of safety, long-term focus
- **Peter Lynch** — Know what you own, GARP (Growth At Reasonable Price), category killers
- **Ray Dalio** — Economic cycle awareness, all-weather positioning, risk parity
- **Howard Marks** — Contrarian thinking, second-level thinking, market cycles

## ⚠️ Disclaimer

**FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY. NOT FINANCIAL ADVICE.**

All information provided by Alpha Oracle is for educational purposes only. This platform is designed to demonstrate investment analysis techniques and should not be construed as financial advice. 

- Past performance does not guarantee future results
- All investments carry risk, including potential loss of principal
- Always conduct your own research and due diligence
- Consult with qualified financial professionals before making investment decisions
- The creators of this platform are not responsible for any investment decisions made based on this information

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment with your own investment strategies and analyses.

## 📧 Contact

For questions or feedback about this educational project, please open an issue on GitHub.

---

**Built with ❤️ for education and learning**

*Alpha Oracle - Where AI meets timeless investment wisdom*
