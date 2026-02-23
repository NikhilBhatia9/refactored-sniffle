# Implementation Issues - Alpha Oracle 2.0 Migration

This document contains step-by-step GitHub issues to implement Option A: Full Migration to TypeScript + Supabase.

## Issue Structure

Each issue follows this template:
- **Title**: Clear, actionable title
- **Labels**: `migration`, `week-1` through `week-4`, `backend`/`frontend`/`database`/`devops`
- **Milestone**: Alpha Oracle 2.0
- **Dependencies**: Issues that must be completed first
- **Acceptance Criteria**: Clear definition of done

---

## Week 1: Foundation & Preparation

### Issue #1: Create Supabase Projects (Production & Staging)

**Labels**: `migration`, `week-1`, `database`, `setup`  
**Dependencies**: None  
**Estimated Time**: 2 hours

**Description:**

Set up Supabase projects for both staging and production environments.

**Tasks:**
- [ ] Create Supabase account (if not exists)
- [ ] Create production Supabase project
  - Name: `alpha-oracle-prod`
  - Region: Select closest to users
  - Plan: Free tier initially
- [ ] Create staging Supabase project
  - Name: `alpha-oracle-staging`
  - Same region as production
  - Plan: Free tier
- [ ] Document project URLs and API keys
- [ ] Save credentials securely (use password manager/1Password)
- [ ] Create `.env.example` file with Supabase config placeholders

**Acceptance Criteria:**
- [ ] Both projects created and accessible
- [ ] API keys and URLs documented
- [ ] `.env.example` updated with Supabase variables

**Resources:**
- IMPLEMENTATION_GUIDE.md (Phase 1)
- https://supabase.com/docs/guides/getting-started

---

### Issue #2: Implement Database Schema in Supabase

**Labels**: `migration`, `week-1`, `database`, `schema`  
**Dependencies**: Issue #1  
**Estimated Time**: 4 hours

**Description:**

Create the complete database schema in Supabase using PostgreSQL.

**Tasks:**
- [ ] Open SQL Editor in Supabase dashboard (staging)
- [ ] Run schema creation script from IMPLEMENTATION_GUIDE.md
  - [ ] Enable UUID extension
  - [ ] Create `sectors` table
  - [ ] Create `recommendations` table
  - [ ] Create `economic_indicators` table
  - [ ] Create `market_data` table
  - [ ] Create `geopolitical_risks` table
  - [ ] Create `user_portfolios` table (if auth enabled)
  - [ ] Create indexes for performance
  - [ ] Create updated_at triggers
- [ ] Verify all tables created successfully
- [ ] Test sample INSERT/SELECT queries
- [ ] Repeat for production project
- [ ] Save schema SQL to `database/schema.sql` in repo

**Acceptance Criteria:**
- [ ] All tables created in both staging and production
- [ ] Schema script saved to repository
- [ ] Sample queries work correctly
- [ ] Indexes created for performance

**Resources:**
- IMPLEMENTATION_GUIDE.md (Step 1.2)
- ARCHITECTURE_REDESIGN.md (Database Schema section)

---

### Issue #3: Configure Row-Level Security (RLS) Policies

**Labels**: `migration`, `week-1`, `database`, `security`  
**Dependencies**: Issue #2  
**Estimated Time**: 3 hours

**Description:**

Implement Row-Level Security policies to secure database access.

**Tasks:**
- [ ] Enable RLS on all tables
- [ ] Create policies for public read access (for demo mode)
- [ ] Create policies for authenticated users (if auth enabled)
- [ ] Test policies with different user contexts
- [ ] Document policies in `database/rls-policies.sql`

**SQL to run:**
```sql
-- Enable RLS
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
-- ... for all tables

-- Public read access (for demo mode)
CREATE POLICY "Public can read sectors" ON sectors
  FOR SELECT USING (true);

CREATE POLICY "Public can read recommendations" ON recommendations
  FOR SELECT USING (true);
-- ... for all tables
```

**Acceptance Criteria:**
- [ ] RLS enabled on all tables
- [ ] Policies allow public read access
- [ ] Policies tested and working
- [ ] RLS policies documented in repo

**Resources:**
- ARCHITECTURE_REDESIGN.md (Row-Level Security section)
- https://supabase.com/docs/guides/auth/row-level-security

---

### Issue #4: Seed Demo Data to Supabase

**Labels**: `migration`, `week-1`, `database`, `data`  
**Dependencies**: Issue #3  
**Estimated Time**: 3 hours

**Description:**

Populate database with demo data for development and testing.

**Tasks:**
- [ ] Create seed data SQL script
- [ ] Add sample sectors (Technology, Healthcare, Energy, etc.)
- [ ] Add sample stock recommendations
- [ ] Add sample economic indicators
- [ ] Add sample market data
- [ ] Run seed script in staging Supabase
- [ ] Verify data inserted correctly
- [ ] Save script to `database/seed-data.sql`

**Sample data:**
```sql
INSERT INTO sectors (name, conviction_score, trend, thesis) VALUES
  ('Technology', 8.5, 'improving', 'AI and cloud growth accelerating'),
  ('Healthcare', 7.2, 'stable', 'Aging demographics support growth'),
  -- ... more sectors
```

**Acceptance Criteria:**
- [ ] Seed script created and saved to repo
- [ ] Demo data loaded in staging
- [ ] Data queryable via Supabase dashboard
- [ ] At least 5 sectors and 10 recommendations seeded

**Resources:**
- IMPLEMENTATION_GUIDE.md (Step 1.3)
- Current demo data from `backend/app/services/demo_data.py`

---

### Issue #5: Set Up Node.js/TypeScript Backend Project

**Labels**: `migration`, `week-1`, `backend`, `setup`  
**Dependencies**: None (can run in parallel with database setup)  
**Estimated Time**: 3 hours

**Description:**

Initialize new Node.js/TypeScript backend project structure.

**Tasks:**
- [ ] Create `backend-ts` directory
- [ ] Run `npm init -y`
- [ ] Install dependencies:
  ```bash
  npm install @supabase/supabase-js dotenv express cors
  npm install -D typescript @types/node @types/express ts-node nodemon
  ```
- [ ] Create `tsconfig.json`
- [ ] Set up project structure:
  ```
  backend-ts/
  ├── src/
  │   ├── config/
  │   ├── services/
  │   ├── routes/
  │   ├── types/
  │   └── index.ts
  ├── package.json
  └── tsconfig.json
  ```
- [ ] Create basic Express server in `src/index.ts`
- [ ] Add npm scripts for dev and build
- [ ] Test server runs successfully

**Acceptance Criteria:**
- [ ] TypeScript project initialized
- [ ] All dependencies installed
- [ ] Project structure created
- [ ] Server runs with `npm run dev`
- [ ] No TypeScript errors

**Resources:**
- IMPLEMENTATION_GUIDE.md (Phase 2)
- Node.js best practices

---

### Issue #6: Implement Supabase Client Configuration

**Labels**: `migration`, `week-1`, `backend`, `database`  
**Dependencies**: Issue #1, Issue #5  
**Estimated Time**: 2 hours

**Description:**

Set up Supabase client in the Node.js backend.

**Tasks:**
- [ ] Create `src/config/supabase.ts`
- [ ] Implement Supabase client initialization
- [ ] Load credentials from environment variables
- [ ] Create helper functions for common queries
- [ ] Test connection to Supabase
- [ ] Add error handling

**Code:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Acceptance Criteria:**
- [ ] Supabase client configured
- [ ] Connection tested successfully
- [ ] Environment variables loaded
- [ ] Helper functions created
- [ ] Error handling implemented

**Resources:**
- IMPLEMENTATION_GUIDE.md (Step 2.1)
- https://supabase.com/docs/reference/javascript/introduction

---

### Issue #7: Migrate Data Ingestion Service to TypeScript

**Labels**: `migration`, `week-1`, `backend`, `data`  
**Dependencies**: Issue #6  
**Estimated Time**: 6 hours

**Description:**

Port the data ingestion service from Python to TypeScript.

**Tasks:**
- [ ] Create `src/services/dataIngestion.ts`
- [ ] Implement Alpha Vantage API client
- [ ] Implement FRED API client
- [ ] Implement data fetching functions
- [ ] Add data transformation logic
- [ ] Add caching mechanism
- [ ] Test with API keys
- [ ] Handle rate limiting

**Key functions to implement:**
- `fetchStockData(ticker: string)`
- `fetchEconomicIndicators()`
- `fetchSectorData()`
- `updateDatabase()`

**Acceptance Criteria:**
- [ ] Data ingestion service implemented
- [ ] API clients working
- [ ] Data fetched and transformed correctly
- [ ] Rate limiting handled
- [ ] Tests passing

**Resources:**
- Current Python implementation in `backend/app/services/data_provider.py`
- Alpha Vantage API docs
- FRED API docs

---

### Issue #8: Implement Recommendation Engine in TypeScript

**Labels**: `migration`, `week-1`, `backend`, `algorithm`  
**Dependencies**: Issue #6  
**Estimated Time**: 8 hours

**Description:**

Port the recommendation engine logic from Python to TypeScript.

**Tasks:**
- [ ] Create `src/services/recommendationEngine.ts`
- [ ] Implement sector analysis logic
- [ ] Implement stock scoring algorithm
- [ ] Implement conviction score calculation
- [ ] Add risk assessment logic
- [ ] Port all business rules from Python
- [ ] Test with sample data
- [ ] Validate results match Python version

**Key functions:**
- `analyzeSector(sectorName: string)`
- `generateRecommendations(filters?)`
- `calculateConvictionScore(stock)`
- `assessRisk(stock)`

**Acceptance Criteria:**
- [ ] Recommendation engine implemented
- [ ] Results match Python version
- [ ] All business logic ported
- [ ] Unit tests passing
- [ ] Performance acceptable

**Resources:**
- Current Python implementation in `backend/app/services/recommendation_engine.py`
- IMPLEMENTATION_GUIDE.md

---

### Issue #9: Create API Routes in Express

**Labels**: `migration`, `week-1`, `backend`, `api`  
**Dependencies**: Issue #7, Issue #8  
**Estimated Time**: 4 hours

**Description:**

Create Express API routes to match existing FastAPI endpoints.

**Tasks:**
- [ ] Create `src/routes/recommendations.ts`
- [ ] Create `src/routes/sectors.ts`
- [ ] Create `src/routes/economic.ts`
- [ ] Create `src/routes/health.ts`
- [ ] Implement GET `/api/recommendations`
- [ ] Implement GET `/api/sectors`
- [ ] Implement GET `/api/sectors/:name`
- [ ] Implement GET `/api/economic/indicators`
- [ ] Implement GET `/health`
- [ ] Add request validation
- [ ] Add error handling
- [ ] Test all endpoints

**Acceptance Criteria:**
- [ ] All API routes created
- [ ] Endpoints return correct data
- [ ] Error handling works
- [ ] API matches FastAPI interface
- [ ] CORS configured correctly

**Resources:**
- Current FastAPI routes in `backend/app/main.py`
- Express.js documentation

---

### Issue #10: Deploy Backend to Railway/Render (Staging)

**Labels**: `migration`, `week-1`, `backend`, `devops`  
**Dependencies**: Issue #9  
**Estimated Time**: 3 hours

**Description:**

Deploy the Node.js backend to a hosting platform for testing.

**Tasks:**
- [ ] Choose platform (Railway or Render)
- [ ] Create account if needed
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set up deployment from branch
- [ ] Deploy to staging
- [ ] Test deployed endpoints
- [ ] Set up monitoring

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `FRED_API_KEY`
- `NODE_ENV=staging`

**Acceptance Criteria:**
- [ ] Backend deployed successfully
- [ ] All endpoints accessible
- [ ] Environment variables configured
- [ ] Health check passing
- [ ] Logs accessible

**Resources:**
- Railway: https://railway.app/
- Render: https://render.com/
- MIGRATION_STRATEGY.md

---

## Week 2: Frontend Integration

### Issue #11: Install Supabase Client in Frontend

**Labels**: `migration`, `week-2`, `frontend`, `setup`  
**Dependencies**: Issue #1  
**Estimated Time**: 2 hours

**Description:**

Set up Supabase client in the React frontend.

**Tasks:**
- [ ] Navigate to `frontend` directory
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Create `src/lib/supabase.ts`
- [ ] Configure Supabase client
- [ ] Add environment variables to `.env`
- [ ] Update `.env.example`
- [ ] Test connection

**Code:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Acceptance Criteria:**
- [ ] Supabase client installed
- [ ] Client configured correctly
- [ ] Environment variables set
- [ ] Connection tested

**Resources:**
- IMPLEMENTATION_GUIDE.md (Phase 3)
- https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

---

### Issue #12: Create Custom React Hooks for Data Fetching

**Labels**: `migration`, `week-2`, `frontend`, `hooks`  
**Dependencies**: Issue #11  
**Estimated Time**: 6 hours

**Description:**

Create React hooks to fetch data from Supabase.

**Tasks:**
- [ ] Create `src/hooks/useRecommendations.ts`
- [ ] Create `src/hooks/useSectors.ts`
- [ ] Create `src/hooks/useEconomicIndicators.ts`
- [ ] Create `src/hooks/useMarketData.ts`
- [ ] Implement loading states
- [ ] Implement error handling
- [ ] Add TypeScript types
- [ ] Test hooks in components

**Example hook:**
```typescript
export function useRecommendations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*, sectors(name)');
      
      if (error) setError(error);
      else setData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { data, loading, error };
}
```

**Acceptance Criteria:**
- [ ] All hooks created
- [ ] Loading and error states handled
- [ ] TypeScript types defined
- [ ] Hooks tested in components

**Resources:**
- IMPLEMENTATION_GUIDE.md (Step 3.3)
- Current API hooks in `frontend/src/services/api.js`

---

### Issue #13: Add Real-Time Subscriptions

**Labels**: `migration`, `week-2`, `frontend`, `realtime`  
**Dependencies**: Issue #12  
**Estimated Time**: 4 hours

**Description:**

Implement real-time data updates using Supabase subscriptions.

**Tasks:**
- [ ] Create `src/hooks/useRealtimeRecommendations.ts`
- [ ] Set up Supabase channel subscription
- [ ] Handle INSERT events
- [ ] Handle UPDATE events
- [ ] Handle DELETE events
- [ ] Update component state in real-time
- [ ] Clean up subscriptions on unmount
- [ ] Test real-time updates

**Code:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('recommendations-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'recommendations' },
      (payload) => {
        // Update state based on payload
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

**Acceptance Criteria:**
- [ ] Real-time subscriptions implemented
- [ ] UI updates automatically
- [ ] Subscriptions cleaned up properly
- [ ] No memory leaks

**Resources:**
- IMPLEMENTATION_GUIDE.md (Step 3.4)
- https://supabase.com/docs/guides/realtime

---

### Issue #14: Migrate Components to Use Supabase Hooks

**Labels**: `migration`, `week-2`, `frontend`, `refactor`  
**Dependencies**: Issue #12  
**Estimated Time**: 6 hours

**Description:**

Update React components to use new Supabase hooks instead of API calls.

**Tasks:**
- [ ] Update `Dashboard.jsx` to use `useRecommendations`
- [ ] Update `Sectors.jsx` to use `useSectors`
- [ ] Update sector detail pages
- [ ] Remove old API service calls
- [ ] Test all pages
- [ ] Fix any broken functionality
- [ ] Update loading states
- [ ] Update error handling

**Acceptance Criteria:**
- [ ] All components using Supabase hooks
- [ ] Old API calls removed
- [ ] All pages working correctly
- [ ] Loading states working
- [ ] Error handling working

**Resources:**
- Current components in `frontend/src/pages/`
- Current API service in `frontend/src/services/api.js`

---

### Issue #15: Install and Configure shadcn/ui

**Labels**: `migration`, `week-2`, `frontend`, `ui`  
**Dependencies**: None (can run in parallel)  
**Estimated Time**: 4 hours

**Description:**

Set up shadcn/ui component library in the frontend.

**Tasks:**
- [ ] Install dependencies: `npm install @radix-ui/react-*` (as needed)
- [ ] Install Tailwind CSS (if not already)
- [ ] Configure `components.json`
- [ ] Set up `src/components/ui/` directory
- [ ] Install initial components:
  - [ ] Button
  - [ ] Card
  - [ ] Skeleton
  - [ ] Badge
  - [ ] Dialog
  - [ ] Tabs
- [ ] Update theme configuration
- [ ] Test components render correctly

**Installation:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card skeleton badge
```

**Acceptance Criteria:**
- [ ] shadcn/ui configured
- [ ] Initial components installed
- [ ] Components render correctly
- [ ] Theme matches design system

**Resources:**
- UX_UI_DESIGN_SYSTEM.md
- https://ui.shadcn.com/docs/installation

---

### Issue #16: Replace UI Components with shadcn/ui

**Labels**: `migration`, `week-2`, `frontend`, `ui`  
**Dependencies**: Issue #15  
**Estimated Time**: 8 hours

**Description:**

Replace basic HTML/CSS components with shadcn/ui components.

**Tasks:**
- [ ] Replace buttons with shadcn Button
- [ ] Replace cards with shadcn Card
- [ ] Replace loading indicators with Skeleton
- [ ] Replace badges with shadcn Badge
- [ ] Update styling to match design system
- [ ] Test responsive design
- [ ] Test dark mode (if applicable)
- [ ] Ensure accessibility

**Pages to update:**
- [ ] Dashboard
- [ ] Recommendations
- [ ] Sectors
- [ ] Sector Detail

**Acceptance Criteria:**
- [ ] All components using shadcn/ui
- [ ] Styling consistent
- [ ] Responsive design working
- [ ] Accessibility maintained

**Resources:**
- UX_UI_DESIGN_SYSTEM.md
- VISUAL_MOCKUPS.md

---

### Issue #17: Add Loading Skeletons and Animations

**Labels**: `migration`, `week-2`, `frontend`, `ui`, `enhancement`  
**Dependencies**: Issue #15  
**Estimated Time**: 5 hours

**Description:**

Improve UX with loading skeletons and smooth animations.

**Tasks:**
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Create skeleton components for each page
- [ ] Add fade-in animations for data loading
- [ ] Add smooth transitions between pages
- [ ] Add micro-interactions (hover, click)
- [ ] Test performance
- [ ] Ensure animations respect prefers-reduced-motion

**Example:**
```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

{loading ? (
  <Skeleton className="h-24 w-full" />
) : (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Content */}
  </motion.div>
)}
```

**Acceptance Criteria:**
- [ ] Skeletons showing during loading
- [ ] Smooth animations implemented
- [ ] Performance acceptable
- [ ] Reduced-motion respected

**Resources:**
- UX_UI_DESIGN_SYSTEM.md (Animation section)
- https://www.framer.com/motion/

---

### Issue #18: Update Environment Configuration

**Labels**: `migration`, `week-2`, `frontend`, `config`  
**Dependencies**: Issue #11  
**Estimated Time**: 2 hours

**Description:**

Update environment configuration for dual-mode operation (old + new).

**Tasks:**
- [ ] Create `.env.staging` file
- [ ] Add feature flags for gradual migration
- [ ] Update API base URL configuration
- [ ] Add Supabase URL and keys
- [ ] Document all environment variables
- [ ] Test environment switching

**Environment variables:**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
VITE_USE_SUPABASE=true
```

**Acceptance Criteria:**
- [ ] Environment variables documented
- [ ] Feature flags working
- [ ] Can switch between old/new backend
- [ ] All configurations tested

**Resources:**
- Current `.env.example`
- MIGRATION_STRATEGY.md

---

## Week 3: Testing & Validation

### Issue #19: Write Unit Tests for Backend Services

**Labels**: `migration`, `week-3`, `backend`, `testing`  
**Dependencies**: Issue #7, Issue #8  
**Estimated Time**: 8 hours

**Description:**

Create comprehensive unit tests for TypeScript backend services.

**Tasks:**
- [ ] Install testing framework: `npm install -D jest @types/jest ts-jest`
- [ ] Configure Jest for TypeScript
- [ ] Write tests for data ingestion service
- [ ] Write tests for recommendation engine
- [ ] Write tests for Supabase client
- [ ] Write tests for API routes
- [ ] Achieve >80% code coverage
- [ ] Set up CI to run tests

**Test structure:**
```
backend-ts/
├── src/
│   └── services/
│       ├── dataIngestion.ts
│       └── dataIngestion.test.ts
```

**Acceptance Criteria:**
- [ ] Jest configured
- [ ] All services have tests
- [ ] Coverage >80%
- [ ] All tests passing
- [ ] CI running tests

**Resources:**
- Jest documentation
- Testing best practices

---

### Issue #20: Write Integration Tests with Supabase

**Labels**: `migration`, `week-3`, `backend`, `testing`  
**Dependencies**: Issue #19  
**Estimated Time**: 6 hours

**Description:**

Create integration tests that interact with Supabase.

**Tasks:**
- [ ] Set up test Supabase project
- [ ] Create test data fixtures
- [ ] Write tests for database operations
- [ ] Write tests for end-to-end flows
- [ ] Test error scenarios
- [ ] Clean up test data after tests
- [ ] Document test setup

**Test scenarios:**
- [ ] Fetching recommendations
- [ ] Filtering by sector
- [ ] Real-time subscriptions
- [ ] Error handling
- [ ] Rate limiting

**Acceptance Criteria:**
- [ ] Integration tests created
- [ ] Tests use test database
- [ ] All scenarios covered
- [ ] Tests passing consistently
- [ ] Test data cleaned up

**Resources:**
- Supabase testing documentation
- IMPLEMENTATION_GUIDE.md

---

### Issue #21: Write E2E Tests for Critical User Flows

**Labels**: `migration`, `week-3`, `frontend`, `testing`  
**Dependencies**: Issue #14  
**Estimated Time**: 8 hours

**Description:**

Create end-to-end tests for critical user journeys.

**Tasks:**
- [ ] Install Playwright: `npm install -D @playwright/test`
- [ ] Configure Playwright
- [ ] Write E2E test for viewing dashboard
- [ ] Write E2E test for viewing recommendations
- [ ] Write E2E test for sector detail page
- [ ] Write E2E test for filtering
- [ ] Test mobile responsive views
- [ ] Set up CI to run E2E tests

**Test flows:**
1. User visits dashboard → sees recommendations
2. User clicks sector → sees sector detail
3. User filters recommendations → sees filtered results
4. User switches dark mode → UI updates

**Acceptance Criteria:**
- [ ] Playwright configured
- [ ] All critical flows tested
- [ ] Tests passing
- [ ] CI running E2E tests
- [ ] Mobile tests included

**Resources:**
- https://playwright.dev/
- Current user flows

---

### Issue #22: Performance Testing and Optimization

**Labels**: `migration`, `week-3`, `backend`, `performance`  
**Dependencies**: Issue #20  
**Estimated Time**: 6 hours

**Description:**

Test and optimize application performance.

**Tasks:**
- [ ] Set up performance monitoring
- [ ] Run Lighthouse audits
- [ ] Measure API response times
- [ ] Measure database query performance
- [ ] Identify bottlenecks
- [ ] Optimize slow queries
- [ ] Add database indexes
- [ ] Optimize bundle size
- [ ] Test with realistic data volumes

**Performance targets:**
- [ ] Lighthouse score >90
- [ ] API response <200ms (p95)
- [ ] Database queries <100ms
- [ ] Bundle size <500KB
- [ ] First Contentful Paint <1.5s

**Acceptance Criteria:**
- [ ] Performance measured
- [ ] Bottlenecks identified
- [ ] Optimizations implemented
- [ ] Targets met or exceeded
- [ ] Monitoring in place

**Resources:**
- Lighthouse CI
- Supabase performance docs

---

### Issue #23: Accessibility Audit and Fixes

**Labels**: `migration`, `week-3`, `frontend`, `a11y`  
**Dependencies**: Issue #16  
**Estimated Time**: 5 hours

**Description:**

Ensure application meets WCAG 2.1 AA standards.

**Tasks:**
- [ ] Run axe DevTools audit
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Test keyboard navigation
- [ ] Check color contrast ratios
- [ ] Add ARIA labels where needed
- [ ] Add alt text to images
- [ ] Ensure focus indicators visible
- [ ] Test with browser zoom
- [ ] Fix all critical issues

**Acceptance Criteria:**
- [ ] Zero critical a11y issues
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Color contrast passes
- [ ] WCAG 2.1 AA compliant

**Resources:**
- UX_UI_DESIGN_SYSTEM.md (Accessibility section)
- https://www.w3.org/WAI/WCAG21/quickref/

---

### Issue #24: Security Audit and Hardening

**Labels**: `migration`, `week-3`, `backend`, `security`  
**Dependencies**: Issue #3, Issue #9  
**Estimated Time**: 4 hours

**Description:**

Review and strengthen security measures.

**Tasks:**
- [ ] Review RLS policies
- [ ] Test for SQL injection
- [ ] Test for XSS vulnerabilities
- [ ] Review API authentication
- [ ] Check CORS configuration
- [ ] Review environment variable handling
- [ ] Test rate limiting
- [ ] Review Supabase security settings
- [ ] Document security measures

**Security checklist:**
- [ ] RLS policies prevent unauthorized access
- [ ] No API keys exposed in frontend
- [ ] CORS restricted to known domains
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced

**Acceptance Criteria:**
- [ ] Security audit completed
- [ ] All vulnerabilities fixed
- [ ] Security measures documented
- [ ] Penetration testing passed

**Resources:**
- OWASP Top 10
- Supabase security best practices

---

### Issue #25: User Acceptance Testing (UAT)

**Labels**: `migration`, `week-3`, `testing`, `uat`  
**Dependencies**: Issue #21, Issue #22, Issue #23  
**Estimated Time**: 3 days

**Description:**

Deploy to staging and conduct user acceptance testing.

**Tasks:**
- [ ] Deploy to staging environment
- [ ] Create test accounts
- [ ] Prepare test scenarios
- [ ] Recruit beta testers (if applicable)
- [ ] Conduct testing sessions
- [ ] Collect feedback
- [ ] Document issues found
- [ ] Prioritize issues
- [ ] Create bug fix tickets

**Test scenarios:**
- [ ] New user onboarding
- [ ] Viewing recommendations
- [ ] Exploring sectors
- [ ] Filtering and searching
- [ ] Mobile usage
- [ ] Different browsers

**Acceptance Criteria:**
- [ ] Staging deployment successful
- [ ] UAT completed
- [ ] Feedback collected
- [ ] Critical issues identified
- [ ] Bug fix plan created

**Resources:**
- MIGRATION_STRATEGY.md (UAT section)

---

### Issue #26: Bug Fixes from Testing

**Labels**: `migration`, `week-3`, `bugfix`  
**Dependencies**: Issue #25  
**Estimated Time**: Variable (5-15 hours)

**Description:**

Fix bugs and issues found during testing phases.

**Tasks:**
- [ ] Review all bugs from UAT
- [ ] Prioritize by severity
- [ ] Fix critical bugs
- [ ] Fix high-priority bugs
- [ ] Fix medium-priority bugs
- [ ] Re-test fixed issues
- [ ] Update tests to prevent regression
- [ ] Document fixes

**Priority levels:**
- **Critical**: Blocking issues, data loss, security
- **High**: Major functionality broken
- **Medium**: Minor issues, UX problems
- **Low**: Nice-to-haves, enhancements

**Acceptance Criteria:**
- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] Fixes tested and verified
- [ ] No regressions introduced
- [ ] Tests updated

**Resources:**
- Bug tracking system
- Test reports

---

## Week 4: Production Deployment

### Issue #27: Production Environment Setup

**Labels**: `migration`, `week-4`, `devops`, `production`  
**Dependencies**: Issue #26  
**Estimated Time**: 4 hours

**Description:**

Prepare production environment for deployment.

**Tasks:**
- [ ] Configure production Supabase project
- [ ] Set up production backend hosting (Railway/Render)
- [ ] Set up production frontend hosting (Vercel/Netlify)
- [ ] Configure production environment variables
- [ ] Set up SSL certificates
- [ ] Configure custom domain (if applicable)
- [ ] Set up CDN
- [ ] Configure monitoring and alerting

**Infrastructure:**
- **Database**: Supabase (production project)
- **Backend**: Railway/Render
- **Frontend**: Vercel/Netlify
- **Monitoring**: Sentry, Supabase dashboard

**Acceptance Criteria:**
- [ ] All services configured
- [ ] Environment variables set
- [ ] SSL working
- [ ] Monitoring active
- [ ] Alerts configured

**Resources:**
- MIGRATION_STRATEGY.md (Production Deployment)
- Hosting platform docs

---

### Issue #28: Data Migration to Production

**Labels**: `migration`, `week-4`, `database`, `production`  
**Dependencies**: Issue #27  
**Estimated Time**: 3 hours

**Description:**

Migrate data from SQLite/current system to production Supabase.

**Tasks:**
- [ ] Backup current production database
- [ ] Export data from current system
- [ ] Transform data to PostgreSQL format
- [ ] Import data to production Supabase
- [ ] Verify data integrity
- [ ] Check row counts
- [ ] Validate relationships
- [ ] Test queries against new data

**Migration script:**
```bash
# Backup current DB
cp backend/alpha_oracle.db backup/alpha_oracle.db.$(date +%Y%m%d)

# Export and transform
python scripts/export-sqlite-data.py
python scripts/transform-to-postgres.py

# Import to Supabase
psql $SUPABASE_DB_URL < data/import.sql
```

**Acceptance Criteria:**
- [ ] Current DB backed up
- [ ] Data exported successfully
- [ ] Data imported to Supabase
- [ ] Data integrity verified
- [ ] All relationships intact

**Resources:**
- MIGRATION_STRATEGY.md (Data Migration section)
- Migration scripts

---

### Issue #29: Deploy Backend to Production

**Labels**: `migration`, `week-4`, `backend`, `devops`, `production`  
**Dependencies**: Issue #28  
**Estimated Time**: 3 hours

**Description:**

Deploy Node.js/TypeScript backend to production.

**Tasks:**
- [ ] Final code review
- [ ] Run all tests
- [ ] Build production bundle
- [ ] Deploy to production hosting
- [ ] Run smoke tests
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Update API documentation

**Deployment checklist:**
- [ ] Tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] Logs accessible

**Acceptance Criteria:**
- [ ] Backend deployed
- [ ] All endpoints working
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Monitoring active

**Resources:**
- Deployment platform docs
- IMPLEMENTATION_GUIDE.md

---

### Issue #30: Deploy Frontend to Production

**Labels**: `migration`, `week-4`, `frontend`, `devops`, `production`  
**Dependencies**: Issue #29  
**Estimated Time**: 3 hours

**Description:**

Deploy React frontend to production hosting.

**Tasks:**
- [ ] Update production environment variables
- [ ] Build production bundle
- [ ] Run build optimization
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Test production deployment
- [ ] Check all pages load
- [ ] Verify API connections

**Build checklist:**
- [ ] No build errors
- [ ] Bundle size acceptable
- [ ] Assets optimized
- [ ] Source maps generated
- [ ] Environment variables set

**Acceptance Criteria:**
- [ ] Frontend deployed
- [ ] All pages accessible
- [ ] API integration working
- [ ] Assets loading correctly
- [ ] Custom domain configured

**Resources:**
- Vercel/Netlify docs
- IMPLEMENTATION_GUIDE.md

---

### Issue #31: Production Monitoring Setup

**Labels**: `migration`, `week-4`, `devops`, `monitoring`  
**Dependencies**: Issue #30  
**Estimated Time**: 4 hours

**Description:**

Set up comprehensive monitoring for production.

**Tasks:**
- [ ] Configure Sentry for error tracking
- [ ] Set up Supabase monitoring
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for:
  - [ ] High error rates
  - [ ] Slow response times
  - [ ] Database issues
  - [ ] High resource usage
- [ ] Create monitoring dashboard
- [ ] Document monitoring setup

**Monitoring tools:**
- **Errors**: Sentry
- **Database**: Supabase dashboard
- **Uptime**: UptimeRobot or similar
- **Performance**: Vercel Analytics
- **Logs**: Platform-specific

**Acceptance Criteria:**
- [ ] All monitoring configured
- [ ] Alerts working
- [ ] Dashboard accessible
- [ ] Team has access
- [ ] Documentation complete

**Resources:**
- Sentry documentation
- Supabase monitoring docs

---

### Issue #32: Create Rollback Plan and Test

**Labels**: `migration`, `week-4`, `devops`, `critical`  
**Dependencies**: Issue #27  
**Estimated Time**: 3 hours

**Description:**

Create and test plan to rollback to old system if needed.

**Tasks:**
- [ ] Document rollback procedure
- [ ] Create rollback scripts
- [ ] Test rollback in staging
- [ ] Measure rollback time (<15 minutes target)
- [ ] Document rollback triggers
- [ ] Prepare communication templates
- [ ] Assign rollback responsibilities

**Rollback procedure:**
1. Switch DNS/traffic to old system
2. Restore database backup if needed
3. Verify old system working
4. Communicate to users
5. Debug issues with new system
6. Plan re-deployment

**Acceptance Criteria:**
- [ ] Rollback plan documented
- [ ] Rollback tested in staging
- [ ] Team trained on procedure
- [ ] Takes <15 minutes
- [ ] Communication ready

**Resources:**
- MIGRATION_STRATEGY.md (Rollback Plan section)

---

### Issue #33: Production Cutover

**Labels**: `migration`, `week-4`, `production`, `critical`  
**Dependencies**: Issue #30, Issue #31, Issue #32  
**Estimated Time**: 4 hours (+ monitoring time)

**Description:**

Execute production cutover to new system.

**Tasks:**
- [ ] Schedule maintenance window
- [ ] Notify users of maintenance
- [ ] Put old system in read-only mode
- [ ] Final data sync
- [ ] Switch traffic to new system
- [ ] Verify all functionality
- [ ] Monitor for issues
- [ ] Remove read-only mode notification
- [ ] Announce successful migration

**Cutover checklist:**
- [ ] Team available for support
- [ ] Rollback plan ready
- [ ] Monitoring active
- [ ] Communication sent
- [ ] Final backups taken

**Acceptance Criteria:**
- [ ] Traffic switched to new system
- [ ] All functionality working
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] Users notified

**Resources:**
- MIGRATION_STRATEGY.md (Cutover section)
- Rollback plan

---

### Issue #34: Post-Deployment Monitoring (72 hours)

**Labels**: `migration`, `week-4`, `monitoring`, `critical`  
**Dependencies**: Issue #33  
**Estimated Time**: Ongoing (72 hours)

**Description:**

Intensive monitoring for 72 hours after production deployment.

**Tasks:**
- [ ] Monitor error rates every hour
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Address issues immediately
- [ ] Document any problems
- [ ] Optimize as needed
- [ ] Daily team check-ins

**Monitoring metrics:**
- Error rate (target: <1%)
- Response time (target: <200ms p95)
- Uptime (target: 99.9%)
- User complaints
- Database performance

**Acceptance Criteria:**
- [ ] 72 hours of monitoring completed
- [ ] Error rate acceptable
- [ ] Performance acceptable
- [ ] No critical issues
- [ ] Issues documented

**Resources:**
- Monitoring dashboards
- On-call schedule

---

### Issue #35: Documentation Updates

**Labels**: `migration`, `week-4`, `documentation`  
**Dependencies**: Issue #33  
**Estimated Time**: 4 hours

**Description:**

Update all documentation to reflect new architecture.

**Tasks:**
- [ ] Update README.md
- [ ] Update setup instructions
- [ ] Update API documentation
- [ ] Update architecture diagrams
- [ ] Create troubleshooting guide
- [ ] Document environment variables
- [ ] Update contributing guide
- [ ] Archive old Python docs

**Documentation to update:**
- [ ] README.md
- [ ] BACKEND_SETUP_GUIDE.md (archive and replace)
- [ ] API.md (create if needed)
- [ ] DEPLOYMENT.md
- [ ] TROUBLESHOOTING.md

**Acceptance Criteria:**
- [ ] All docs updated
- [ ] Setup instructions accurate
- [ ] API documented
- [ ] Old docs archived
- [ ] Reviewed by team

**Resources:**
- Current documentation
- IMPLEMENTATION_GUIDE.md

---

### Issue #36: Performance Optimization Round 2

**Labels**: `migration`, `week-4`, `optimization`, `enhancement`  
**Dependencies**: Issue #34  
**Estimated Time**: 6 hours

**Description:**

Optimize performance based on production data.

**Tasks:**
- [ ] Analyze production metrics
- [ ] Identify slow queries
- [ ] Add missing database indexes
- [ ] Optimize React components
- [ ] Implement caching where beneficial
- [ ] Optimize images and assets
- [ ] Review bundle splitting
- [ ] Measure improvements

**Optimization areas:**
- Database queries
- API response times
- Frontend bundle size
- Image loading
- Cache hit rates

**Acceptance Criteria:**
- [ ] Production metrics analyzed
- [ ] Optimizations implemented
- [ ] Measurable improvements
- [ ] Performance targets met
- [ ] Changes documented

**Resources:**
- Performance monitoring data
- Optimization best practices

---

### Issue #37: Decommission Python Backend

**Labels**: `migration`, `week-4`, `cleanup`  
**Dependencies**: Issue #34 (after 72 hours stable)  
**Estimated Time**: 2 hours

**Description:**

Safely decommission old Python backend after successful migration.

**Tasks:**
- [ ] Verify new system stable for 72+ hours
- [ ] Archive Python backend code
- [ ] Shut down Python backend service
- [ ] Archive SQLite database
- [ ] Update deployment pipelines
- [ ] Remove old dependencies
- [ ] Update .gitignore if needed
- [ ] Clean up unused files

**Files to archive:**
- `backend/` directory (move to `archive/backend-python/`)
- SQLite database
- Python requirements
- Old deployment configs

**Acceptance Criteria:**
- [ ] New system stable 72+ hours
- [ ] Python backend archived
- [ ] Services shut down
- [ ] Documentation updated
- [ ] Repository cleaned

**Resources:**
- Git best practices for archiving

---

### Issue #38: Migration Retrospective

**Labels**: `migration`, `week-4`, `process`  
**Dependencies**: Issue #37  
**Estimated Time**: 2 hours

**Description:**

Conduct retrospective to document lessons learned.

**Tasks:**
- [ ] Schedule team retrospective meeting
- [ ] Review what went well
- [ ] Review what could be improved
- [ ] Document lessons learned
- [ ] Update migration playbook
- [ ] Identify future improvements
- [ ] Thank the team!

**Discussion topics:**
- Technical challenges encountered
- Process improvements
- Timeline accuracy
- Communication effectiveness
- What would we do differently?

**Deliverable:**
Create `MIGRATION_RETROSPECTIVE.md` with:
- Summary of migration
- Timeline (planned vs actual)
- Challenges and solutions
- Lessons learned
- Recommendations for future migrations

**Acceptance Criteria:**
- [ ] Retrospective completed
- [ ] Lessons documented
- [ ] Playbook updated
- [ ] Team feedback collected

---

## Summary

**Total Issues**: 38
**Total Estimated Time**: ~150-180 hours (4-5 weeks)

### By Week:
- **Week 1** (Issues #1-10): Foundation & Backend - 38 hours
- **Week 2** (Issues #11-18): Frontend Integration - 37 hours  
- **Week 3** (Issues #19-26): Testing & Validation - 40-50 hours
- **Week 4** (Issues #27-38): Production Deployment - 35-40 hours

### By Type:
- **Backend**: 12 issues
- **Frontend**: 11 issues
- **Database**: 6 issues
- **DevOps**: 5 issues
- **Testing**: 4 issues

### Critical Path:
1. Supabase Setup (#1-4)
2. Backend Development (#5-9)
3. Frontend Integration (#11-14)
4. Testing (#19-26)
5. Production Deployment (#27-33)
6. Monitoring & Cleanup (#34-38)

### Parallel Tracks:
- Database setup can run parallel to backend development
- Frontend shadcn/ui setup can run parallel to backend API development
- Testing can begin as soon as features are ready

---

## How to Use These Issues

1. **Create GitHub Issues**: Copy each issue template into GitHub
2. **Set Labels**: Apply the labels mentioned in each issue
3. **Create Milestone**: Create "Alpha Oracle 2.0" milestone
4. **Assign Issues**: Assign to team members based on expertise
5. **Track Progress**: Use GitHub Projects board to track progress
6. **Update Status**: Check off tasks as they're completed
7. **Link PRs**: Link pull requests to issues

## GitHub Labels to Create

```
migration
week-1, week-2, week-3, week-4
backend, frontend, database, devops
setup, testing, production
ui, api, security, performance
bugfix, enhancement, documentation
critical
```

## Next Steps

1. Review this document with the team
2. Create GitHub issues from templates
3. Set up project board
4. Assign initial issues
5. Begin Week 1 tasks!

---

**Ready to start the migration! 🚀**
