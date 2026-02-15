"""
Alpha Oracle - Main FastAPI Application

A comprehensive investment recommendation platform providing outstanding opportunities
based on sector analysis, economic cycles, and the investment philosophies of
legendary investors (Buffett, Lynch, Dalio, Marks).

DISCLAIMER: This platform is for educational and informational purposes only.
Not financial advice. Past performance does not guarantee future results.
Always conduct your own research and consult with financial professionals.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import init_db
from app.api.routes import dashboard, sectors, recommendations, macro, portfolio

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"API keys configured: {bool(settings.ALPHA_VANTAGE_API_KEY and settings.FRED_API_KEY)}")
    
    # Initialize database
    await init_db()
    logger.info("Database initialized")
    
    # In production, could schedule periodic data refresh here
    # For now, using on-demand data fetching
    
    yield
    
    # Shutdown
    logger.info("Shutting down Alpha Oracle")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    # Alpha Oracle - Investment Recommendation Platform
    
    Provides outstanding investment opportunities based on:
    - **Sectoral Rotation**: Economic cycle-aware positioning
    - **Macro Analysis**: Interest rates, inflation, GDP, unemployment
    - **Margin of Safety**: Valuation discipline (P/E, P/B, PEG, DCF)
    - **Asymmetric Risk/Reward**: Upside potential vs downside risk
    - **Tailwind/Headwind Analysis**: Political, geopolitical, regulatory, technological, demographic
    
    ## Investment Philosophy
    Modeled after the greatest investors of the last 40 years:
    - **Warren Buffett**: Quality businesses, margin of safety, long-term focus
    - **Peter Lynch**: Know what you own, GARP (Growth At Reasonable Price)
    - **Ray Dalio**: Economic cycle awareness, all-weather positioning
    - **Howard Marks**: Contrarian thinking, second-level thinking
    
    ## Disclaimer
    **FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY. NOT FINANCIAL ADVICE.**
    
    This platform provides analysis and recommendations for educational purposes.
    Past performance does not guarantee future results. Always conduct your own
    research and consult with qualified financial professionals before making
    investment decisions.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router)
app.include_router(sectors.router)
app.include_router(recommendations.router)
app.include_router(macro.router)
app.include_router(portfolio.router)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "Investment Recommendation Platform",
        "disclaimer": "For educational and informational purposes only. Not financial advice.",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "dashboard": "/api/dashboard",
            "sectors": "/api/sectors",
            "recommendations": "/api/recommendations",
            "macro": "/api/macro",
            "portfolio": "/api/portfolio"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "demo_mode": not (settings.ALPHA_VANTAGE_API_KEY and settings.FRED_API_KEY)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
