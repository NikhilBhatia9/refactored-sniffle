# Alpha Oracle Frontend

AI-powered investment intelligence platform built with React, providing real-time market insights, sector analysis, and conviction-weighted investment recommendations.

## 🚀 Features

- **Dashboard**: Comprehensive overview with market summary, top recommendations, sector heat map, and geopolitical risks
- **Sector Analysis**: Detailed conviction scores and investment outlooks across all major sectors
- **Recommendations**: Filterable stock picks with AI-powered analysis and catalysts
- **Macro View**: Economic indicators, market cycle analysis, and geopolitical risk assessment
- **Portfolio Builder**: Risk-adjusted portfolio allocation with holdings breakdown

## 🎨 Design

Professional Bloomberg terminal aesthetic with:
- Dark theme (background: #0a0e1a, surface: #131829)
- Green for bullish/positive signals
- Red for bearish/negative signals
- Responsive grid layouts
- Smooth transitions and hover effects

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 📁 Project Structure

```
frontend/
├── index.html              # HTML entry point
├── vite.config.js         # Vite configuration with API proxy
├── tailwind.config.js     # Tailwind theme configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Dependencies and scripts
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Root component with routing
    ├── index.css          # Global styles and Tailwind imports
    ├── services/
    │   └── api.js         # Axios API client
    ├── components/
    │   ├── Navbar.jsx              # Navigation bar
    │   ├── SectorCard.jsx          # Sector display card
    │   ├── RecommendationCard.jsx  # Stock recommendation card
    │   ├── MacroIndicator.jsx      # Economic indicator widget
    │   ├── ConvictionGauge.jsx     # Circular conviction score gauge
    │   ├── RiskBadge.jsx           # Risk level badge
    │   ├── AllocationChart.jsx     # Pie chart for allocations
    │   └── CycleIndicator.jsx      # Market cycle phase indicator
    └── pages/
        ├── Dashboard.jsx         # Home page
        ├── Sectors.jsx          # Sector analysis page
        ├── Recommendations.jsx  # Stock picks page
        ├── MacroView.jsx       # Macro economics page
        └── Portfolio.jsx       # Portfolio builder page
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running at http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:3000

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:8000` through a Vite proxy configured in `vite.config.js`. All API calls use the `/api` prefix.

### Available Endpoints

- `GET /api/dashboard` - Dashboard data
- `GET /api/sectors` - All sectors
- `GET /api/sectors/{id}` - Sector detail
- `GET /api/recommendations` - All recommendations (with filters)
- `GET /api/recommendations/{id}` - Recommendation detail
- `GET /api/macro` - Macro indicators
- `GET /api/macro/cycle` - Market cycle data
- `GET /api/macro/geopolitical` - Geopolitical risks
- `GET /api/portfolio/allocation` - Portfolio allocation

## 🎨 Styling

### Color Palette

```javascript
Primary Background: #0a0e1a
Surface: #131829
Border: #1e2439
Hover: #1a2035

Accent Blue: #3b82f6
Accent Green: #10b981 (Bullish)
Accent Red: #ef4444 (Bearish)
Accent Yellow: #f59e0b (Neutral)

Text Primary: #e5e7eb
Text Secondary: #9ca3af
Text Muted: #6b7280
```

### Custom Components

All components use consistent Tailwind utility classes and custom CSS classes defined in `index.css`:
- `.card` - Standard card container
- `.card-hover` - Card with hover effects
- `.btn-primary` / `.btn-secondary` - Button styles
- `.badge-*` - Colored badges for risk levels and stances
- `.section-title` / `.subsection-title` - Typography

## 📊 Data Visualization

Uses **Recharts** library for all charts:
- **Pie Charts**: Portfolio allocations, sector breakdowns
- **Line Charts**: Historical macro trends
- **Custom Gauges**: Conviction scores (0-100)
- **Progress Bars**: Risk probabilities, weights

## 🔒 Disclaimer

**Important**: This platform is for educational and informational purposes only. It is NOT financial advice. Always conduct your own research and consult with qualified financial professionals before making investment decisions.

## 📝 Development Notes

- Uses ESLint for code quality
- Vite HMR for fast development
- Responsive design with mobile-first approach
- Accessibility considerations in component design
- Error boundaries for graceful error handling

## 🚀 Deployment

Build the production bundle:

```bash
npm run build
```

The `dist/` folder will contain the optimized static files ready for deployment to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Ensure the backend API is accessible from your production domain and update the proxy configuration accordingly.

## 📄 License

This project is part of the Alpha Oracle platform. See main repository for license information.
