# UX/UI Design System - Alpha Oracle 2.0

## Design Philosophy

**Principles:**
1. **Clarity First**: Investment data should be immediately understandable
2. **Confidence Through Design**: Professional, trustworthy aesthetic
3. **Progressive Disclosure**: Show summary, reveal details on demand
4. **Data-Driven Beauty**: Charts and metrics as visual centerpieces
5. **Accessible to All**: WCAG 2.1 AA compliance

## Color System

### Brand Colors

```css
/* Primary - Financial Blue */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main brand color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Success - Green */
--success-500: #10b981;
--success-600: #059669;

/* Danger - Red */
--danger-500: #ef4444;
--danger-600: #dc2626;

/* Warning - Amber */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Info - Cyan */
--info-500: #06b6d4;
--info-600: #0891b2;
```

### Semantic Colors

```css
/* Bullish (Positive) */
--bullish: #10b981;
--bullish-light: #d1fae5;
--bullish-dark: #065f46;

/* Bearish (Negative) */
--bearish: #ef4444;
--bearish-light: #fee2e2;
--bearish-dark: #991b1b;

/* Neutral */
--neutral: #6b7280;
--neutral-light: #f3f4f6;
--neutral-dark: #374151;
```

### Dark Mode Palette

```css
/* Dark Mode Background */
--dark-bg-primary: #0f172a;    /* Slate 900 */
--dark-bg-secondary: #1e293b;  /* Slate 800 */
--dark-bg-tertiary: #334155;   /* Slate 700 */

/* Dark Mode Text */
--dark-text-primary: #f1f5f9;   /* Slate 100 */
--dark-text-secondary: #cbd5e1; /* Slate 300 */
--dark-text-tertiary: #94a3b8;  /* Slate 400 */

/* Dark Mode Borders */
--dark-border: #334155;         /* Slate 700 */
--dark-border-light: #475569;   /* Slate 600 */
```

## Typography

### Font Families

```css
/* Headings - Modern, Professional */
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Body - Readable, Clean */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Mono - Code, Tickers */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Numbers - Tabular for alignment */
--font-numbers: 'Inter', tabular-nums;
```

### Type Scale

```css
/* Display */
--text-display: 3.75rem;  /* 60px - Hero sections */
--text-display-line: 1;

/* Headings */
--text-h1: 2.25rem;       /* 36px */
--text-h1-line: 1.2;
--text-h2: 1.875rem;      /* 30px */
--text-h2-line: 1.3;
--text-h3: 1.5rem;        /* 24px */
--text-h3-line: 1.4;
--text-h4: 1.25rem;       /* 20px */
--text-h4-line: 1.4;

/* Body */
--text-body-lg: 1.125rem; /* 18px */
--text-body: 1rem;        /* 16px */
--text-body-sm: 0.875rem; /* 14px */
--text-body-xs: 0.75rem;  /* 12px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

## Spacing System

Using 4px base unit (rem values):

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

## Border Radius

```css
--radius-sm: 0.25rem;  /* 4px - Small elements */
--radius-md: 0.5rem;   /* 8px - Cards, buttons */
--radius-lg: 0.75rem;  /* 12px - Large cards */
--radius-xl: 1rem;     /* 16px - Hero sections */
--radius-full: 9999px; /* Fully rounded - Pills, avatars */
```

## Shadows

```css
/* Light Mode */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Dark Mode */
--shadow-dark-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-dark-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
--shadow-dark-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
```

## Components

### 1. Stock Card (Recommendation)

**Design Specs:**

```jsx
<Card className="recommendation-card">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CompanyLogo size="48" />
        <div>
          <h3 className="font-semibold text-lg">AAPL</h3>
          <p className="text-sm text-muted">Apple Inc.</p>
        </div>
      </div>
      <ConvictionBadge score={8.5} />
    </div>
  </CardHeader>
  
  <CardContent>
    <PriceSection>
      <CurrentPrice>$178.50</CurrentPrice>
      <TargetPrice>$210.00</TargetPrice>
      <Upside>+17.6%</Upside>
    </PriceSection>
    
    <MetricsGrid>
      <Metric label="P/E" value="28.5" />
      <Metric label="PEG" value="1.8" />
      <Metric label="Risk" value="Medium" badge />
    </MetricsGrid>
    
    <Thesis collapsed>
      Leading position in premium smartphone market...
    </Thesis>
  </CardContent>
  
  <CardFooter>
    <TagsList>
      <Tag>Growth</Tag>
      <Tag>Technology</Tag>
    </TagsList>
  </CardFooter>
</Card>
```

**Visual States:**
- Default: Subtle border, white/dark background
- Hover: Lift with shadow, border accent
- Active: Stronger border, slight scale
- Loading: Skeleton animation

### 2. Sector Card

**Design Specs:**

```jsx
<Card className="sector-card">
  <GradientHeader sector="Technology">
    <SectorIcon name="technology" />
    <h2>Technology</h2>
  </GradientHeader>
  
  <CardContent>
    <ConvictionGauge score={8.2} size="large" />
    
    <TrendIndicator trend="improving" />
    
    <CyclePhase phase="Mid Expansion" />
    
    <TailwindsHeadwinds>
      <Tailwinds>
        • AI revolution
        • Cloud adoption
        • Digital transformation
      </Tailwinds>
      <Headwinds>
        • Regulatory scrutiny
        • Valuation concerns
      </Headwinds>
    </TailwindsHeadwinds>
    
    <Button variant="outline">View Details</Button>
  </CardContent>
</Card>
```

### 3. Dashboard Widgets

**Economic Cycle Indicator**
```
┌─────────────────────────────────┐
│   Economic Cycle Phase          │
│                                 │
│      ╭─────╮                    │
│     ╱       ╲                   │
│    ╱    ●    ╲   ← Mid Expansion│
│   ╱           ╲                 │
│  ╱             ╲                │
│                                 │
│  GDP Growth: 3.2% ↑             │
│  Unemployment: 3.8% ↓           │
└─────────────────────────────────┘
```

**Conviction Gauge**
```
  ┌──────────────────┐
  │    8.5 / 10      │
  │                  │
  │  ████████████▓▓  │
  │  Very High       │
  └──────────────────┘
```

**Risk Badge**
```
┌─────────────┐
│ RISK: MED   │  ← Yellow/Amber for Medium
└─────────────┘

┌─────────────┐
│ RISK: LOW   │  ← Green for Low
└─────────────┘

┌─────────────┐
│ RISK: HIGH  │  ← Red for High
└─────────────┘
```

### 4. Charts

**Sector Performance Chart (Recharts)**
```jsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={sectorData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="sector" />
    <YAxis />
    <Tooltip 
      contentStyle={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}
    />
    <Bar 
      dataKey="conviction" 
      fill="#3b82f6"
      radius={[8, 8, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
```

**Price History Chart (Line)**
```jsx
<ResponsiveContainer width="100%" height={200}>
  <LineChart data={priceHistory}>
    <defs>
      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="price" 
      stroke="#3b82f6"
      fillOpacity={1}
      fill="url(#priceGradient)"
    />
  </LineChart>
</ResponsiveContainer>
```

## Page Layouts

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Navigation Bar                                              │
│  [Logo] Dashboard | Sectors | Recommendations | Portfolio   │
│                                          [Live Data] [Theme] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Hero Section                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Alpha Oracle 📈                                       │  │
│  │  Outstanding Investment Opportunities                 │  │
│  │  Based on sector analysis & economic cycles           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Key Metrics Row                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Economic │ │  Market  │ │  Top     │ │ Conviction │      │
│  │  Cycle   │ │  Phase   │ │ Sector   │ │   Score    │      │
│  │ Mid Exp  │ │ Bull Mkt │ │   Tech   │ │    8.2     │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Top Recommendations (Grid)                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ AAPL        │ │ MSFT        │ │ NVDA        │           │
│  │ Apple Inc.  │ │ Microsoft   │ │ NVIDIA      │           │
│  │ 8.5★        │ │ 8.3★        │ │ 9.1★        │           │
│  │ +17.6%      │ │ +12.4%      │ │ +24.8%      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Sector Performance Chart                                    │
│  [Interactive Bar Chart showing all 11 sectors]              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Geopolitical Risks                                          │
│  ⚠️  US-China Tech Tensions → Affects: Tech, Materials      │
│  ⚠️  Inflation Persistence → Affects: All Sectors           │
│  ℹ️  Fed Rate Policy → Affects: Financials, Real Estate     │
└─────────────────────────────────────────────────────────────┘
```

### Recommendations Page

```
┌─────────────────────────────────────────────────────────────┐
│  Page Header                                                 │
│  Stock Recommendations                                       │
│  Based on investment philosophies of Buffett, Lynch, Dalio   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Filters Bar                                                 │
│  Strategy: [All ▼] Sector: [All ▼] Risk: [All ▼]           │
│  Min Conviction: [█████████░] 7.0                           │
│  Sort by: [Conviction ▼]                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Stock Cards (Masonry Grid)                                  │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ AAPL - 8.5★     │ │ MSFT - 8.3★     │                   │
│  │ Apple Inc.      │ │ Microsoft Corp  │                   │
│  │                 │ │                 │                   │
│  │ $178.50→$210.00│ │ $420.00→$480.00│                   │
│  │ Upside: +17.6%  │ │ Upside: +14.3%  │                   │
│  │                 │ │                 │                   │
│  │ [Growth] [Tech] │ │ [Growth] [Tech] │                   │
│  └─────────────────┘ └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ ...more cards   │ │ ...more cards   │                   │
└─────────────────────────────────────────────────────────────┘
```

### Sector Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  Hero Section (Gradient Background)                          │
│  Technology Sector 💻                                        │
│  Conviction Score: 8.2 / 10 (Very High)                      │
│  Trend: Improving ↗️                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Overview Tab Bar                                            │
│  [Overview] [Stocks] [Analysis] [Thesis]                     │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────┬────────────────────────────┐
│  Tailwinds                     │  Headwinds                 │
│  ✓ AI revolution               │  ✗ Regulatory scrutiny     │
│  ✓ Cloud adoption              │  ✗ High valuations         │
│  ✓ Digital transformation      │  ✗ Competition             │
└────────────────────────────────┴────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Sector Performance vs S&P 500                               │
│  [Line Chart showing relative performance over time]         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Top Stocks in Sector                                        │
│  [Grid of stock cards - AAPL, MSFT, NVDA, etc.]             │
└─────────────────────────────────────────────────────────────┘
```

## Animations & Interactions

### Micro-interactions

**Button Hover**
```css
.button {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button:active {
  transform: translateY(0);
}
```

**Card Hover**
```css
.card {
  transition: all 200ms ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-500);
}
```

**Number Count-Up**
```jsx
import { useSpring, animated } from '@react-spring/web';

function AnimatedNumber({ value }) {
  const props = useSpring({
    number: value,
    from: { number: 0 },
    config: { duration: 1000 }
  });
  
  return (
    <animated.span>
      {props.number.to(n => n.toFixed(1))}
    </animated.span>
  );
}
```

### Page Transitions (Framer Motion)

```jsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function Page({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Loading States

**Skeleton Loader**
```jsx
function StockCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
    </Card>
  );
}
```

**Spinner**
```jsx
function Spinner({ size = "md" }) {
  return (
    <svg 
      className="animate-spin" 
      width={size} 
      height={size}
      viewBox="0 0 24 24"
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
        fill="none"
        strokeDasharray="32"
        strokeDashoffset="32"
        className="animate-spin-dash"
      />
    </svg>
  );
}
```

## Accessibility Guidelines

### Color Contrast
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (18pt+): Minimum 3:1
- Interactive elements: Minimum 3:1

### Keyboard Navigation
- All interactive elements focusable with Tab
- Focus indicators clearly visible
- Logical tab order (top to bottom, left to right)
- Escape key closes modals/dropdowns

### Screen Readers
```jsx
// Example: Stock card with ARIA labels
<Card 
  role="article" 
  aria-labelledby="stock-aapl-name"
  aria-describedby="stock-aapl-metrics"
>
  <h3 id="stock-aapl-name">AAPL - Apple Inc.</h3>
  <div id="stock-aapl-metrics">
    <span aria-label="Current price">$178.50</span>
    <span aria-label="Target price">$210.00</span>
    <span aria-label="Upside potential">17.6 percent</span>
  </div>
</Card>
```

### Focus Management
```jsx
import { useFocusTrap } from '@react-aria/focus';

function Modal({ isOpen, onClose, children }) {
  const ref = React.useRef();
  useFocusTrap(ref, { isDisabled: !isOpen });
  
  return isOpen ? (
    <div ref={ref} role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null;
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Small desktops */
--screen-xl: 1280px;  /* Desktops */
--screen-2xl: 1536px; /* Large desktops */
```

**Grid Breakpoints:**
- Mobile (< 640px): 1 column
- Tablet (640-1024px): 2 columns
- Desktop (> 1024px): 3-4 columns

## Component Library Integration

### shadcn/ui Setup

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add skeleton
```

### Customization

```jsx
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more custom colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

## Implementation Checklist

### Phase 1: Foundation
- [ ] Install Inter font family
- [ ] Set up CSS custom properties
- [ ] Configure Tailwind with design tokens
- [ ] Add shadcn/ui components

### Phase 2: Components
- [ ] Build StockCard component
- [ ] Build SectorCard component
- [ ] Build ConvictionGauge component
- [ ] Build RiskBadge component
- [ ] Build chart components

### Phase 3: Animations
- [ ] Install Framer Motion
- [ ] Add page transitions
- [ ] Implement micro-interactions
- [ ] Add loading skeletons

### Phase 4: Accessibility
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Fix contrast issues

### Phase 5: Polish
- [ ] Optimize performance
- [ ] Test responsive layouts
- [ ] Dark mode refinements
- [ ] Cross-browser testing

## Resources

- **Figma File**: [Link to design mockups]
- **Component Library**: https://ui.shadcn.com
- **Color Palette**: https://tailwindcss.com/docs/customizing-colors
- **Icons**: https://lucide.dev
- **Fonts**: https://fonts.google.com/specimen/Inter
- **Animation**: https://www.framer.com/motion

## Next Steps

1. **Review with Stakeholders**: Get feedback on design direction
2. **Create Figma Mockups**: High-fidelity designs for key pages
3. **Build Component Library**: Implement reusable components
4. **User Testing**: Validate UX with real users
5. **Iterate**: Refine based on feedback

---

**Design Status**: Ready for Review
**Last Updated**: 2024
**Designer**: Alpha Oracle Team
