# System Architecture
## MGNREGA District Performance Portal

This document describes the technical architecture and design decisions for the MGNREGA portal.

---

## 📐 Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │   React SPA (Vite)                                     │  │
│  │   - Modern CSS with responsive design                  │  │
│  │   - Recharts for data visualization                    │  │
│  │   - Bilingual UI (Hindi/English)                       │  │
│  │   - Progressive Web App capabilities                   │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │   Nginx Reverse Proxy                                  │  │
│  │   - SSL termination                                    │  │
│  │   - Load balancing                                     │  │
│  │   - Static file serving                                │  │
│  │   - Compression & caching                              │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │   FastAPI Backend (Async)                              │  │
│  │   - RESTful API endpoints                              │  │
│  │   - Request validation (Pydantic)                      │  │
│  │   - Error handling & logging                           │  │
│  │   - Background task scheduling                         │  │
│  │   - Rate limiting                                      │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────────┐          ┌────────────────────────┐   │
│  │   SQLite/        │          │   Data Fetcher         │   │
│  │   PostgreSQL     │◄─────────│   Service              │   │
│  │                  │          │   - API integration    │   │
│  │   - District data│          │   - Data caching       │   │
│  │   - Performance  │          │   - Background sync    │   │
│  │   - Historical   │          │   - Retry logic        │   │
│  └──────────────────┘          └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                              ┌────────────────────┐
                              │  data.gov.in API   │
                              │  (External)        │
                              └────────────────────┘
```

---

## 🏗️ Component Design

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # App header with navigation
│   │   ├── StatCard.jsx     # Metric display card
│   │   ├── DistrictSelector.jsx  # District dropdown
│   │   └── PerformanceChart.jsx  # Chart component
│   │
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Landing page with overview
│   │   ├── DistrictDetailPage.jsx  # District details
│   │   ├── ComparePage.jsx # District comparison
│   │   └── AboutPage.jsx   # Information about MGNREGA
│   │
│   ├── services/           # API communication
│   │   └── api.js          # Axios instance & API calls
│   │
│   ├── utils/              # Utility functions
│   │   └── formatters.js   # Number, currency, date formatters
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
└── index.html              # HTML template
```

**Key Design Patterns:**
- Component-based architecture
- Container/Presenter pattern
- Custom hooks for state management
- Service layer for API calls
- Utility functions for formatting

### Backend Architecture

```
backend/
├── main.py                 # FastAPI application & routes
├── database.py             # Database models & session management
├── data_fetcher.py         # Data sync service
├── requirements.txt        # Python dependencies
└── .env                    # Environment configuration
```

**Key Design Patterns:**
- Repository pattern for data access
- Service layer for business logic
- Dependency injection for database sessions
- Async/await for non-blocking I/O
- Background tasks for data synchronization

---

## 💾 Database Schema

### Districts Table
```sql
CREATE TABLE districts (
    id INTEGER PRIMARY KEY,
    state_code VARCHAR NOT NULL,
    state_name VARCHAR NOT NULL,
    district_code VARCHAR UNIQUE NOT NULL,
    district_name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INDEX idx_districts_code ON districts(district_code);
INDEX idx_districts_state ON districts(state_code);
```

### Performance Data Table
```sql
CREATE TABLE performance_data (
    id INTEGER PRIMARY KEY,
    district_code VARCHAR NOT NULL,
    district_name VARCHAR NOT NULL,
    month VARCHAR NOT NULL,  -- Format: YYYY-MM
    year INTEGER NOT NULL,
    
    -- Metrics
    total_households_issued_jobcards FLOAT DEFAULT 0,
    households_completed_100days FLOAT DEFAULT 0,
    total_works_takenup FLOAT DEFAULT 0,
    total_works_completed FLOAT DEFAULT 0,
    total_expenditure FLOAT DEFAULT 0,
    person_days_generated FLOAT DEFAULT 0,
    avg_days_per_household FLOAT DEFAULT 0,
    work_completion_rate FLOAT DEFAULT 0,
    sc_persondays FLOAT DEFAULT 0,
    st_persondays FLOAT DEFAULT 0,
    women_persondays FLOAT DEFAULT 0,
    
    -- Metadata
    raw_data JSON,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INDEX idx_performance_district ON performance_data(district_code);
INDEX idx_performance_month ON performance_data(month);
INDEX idx_performance_year ON performance_data(year);
INDEX idx_performance_district_month ON performance_data(district_code, month);
```

---

## 🔄 Data Flow

### 1. User Requests District Data

```
User → Frontend → API Request → Backend
                                    ↓
                              Check Cache (DB)
                                    ↓
                          ┌─────────┴─────────┐
                          │                   │
                    Cache Hit           Cache Miss
                          │                   │
                    Return Data      Fetch from API
                          │                   │
                          │             Save to DB
                          │                   │
                          └─────────┬─────────┘
                                    ↓
                              Return to Frontend
                                    ↓
                              Render UI
```

### 2. Background Data Synchronization

```
Scheduler (every 24h) → Data Fetcher Service
                              ↓
                    For each district:
                              ↓
                    Check last sync time
                              ↓
                    If stale, fetch new data
                              ↓
                    data.gov.in API
                              ↓
                    Transform & validate
                              ↓
                    Save to database
                              ↓
                    Update metadata
```

---

## 🎨 Frontend Design System

### Color Palette
```css
/* Based on Indian flag colors */
--primary: #FF9933;       /* Saffron - Action, opportunity */
--primary-dark: #E67E22;
--secondary: #138808;     /* Green - Growth, prosperity */
--secondary-dark: #0F6805;
--accent: #000080;        /* Navy - Trust, stability */
--success: #28A745;
--warning: #FFC107;
--error: #DC3545;
```

### Typography
- **Primary Font**: Inter (Latin), Noto Sans Devanagari (Hindi)
- **Scale**: Based on 1rem = 16px
- **Hierarchy**: Clear distinction between headings and body text
- **Accessibility**: Minimum 14px for body text, high contrast ratios

### Component Library
- **Cards**: Statistical data, district information
- **Charts**: Line and bar charts for trends
- **Forms**: Large touch targets, clear labels
- **Buttons**: High contrast, bilingual labels
- **Navigation**: Sticky header, breadcrumbs

---

## 🚀 Performance Optimizations

### Frontend
1. **Code Splitting**: Route-based lazy loading
2. **Image Optimization**: WebP format, responsive images
3. **Caching**: Service worker for offline access
4. **Minification**: CSS and JavaScript compression
5. **CDN**: Static assets served from CDN

### Backend
1. **Database Indexing**: Optimized queries with proper indexes
2. **Connection Pooling**: Reuse database connections
3. **Async I/O**: Non-blocking operations
4. **Data Caching**: In-memory cache for frequently accessed data
5. **Query Optimization**: Efficient SQL queries, pagination

### Network
1. **HTTP/2**: Multiplexing, server push
2. **Compression**: Gzip/Brotli for text resources
3. **CDN**: Geographic distribution of static content
4. **Caching Headers**: Proper cache control directives

---

## 🔐 Security Architecture

### Authentication & Authorization
- Currently public access (no auth required)
- Future: JWT-based authentication for admin features

### Data Security
1. **Input Validation**: Pydantic models for request validation
2. **SQL Injection Protection**: ORM-based queries
3. **XSS Protection**: React auto-escaping, CSP headers
4. **CORS**: Configured allowed origins
5. **Rate Limiting**: Prevent API abuse

### Infrastructure Security
1. **HTTPS Only**: SSL/TLS encryption
2. **Security Headers**: X-Frame-Options, X-Content-Type-Options
3. **Firewall**: UFW configuration
4. **Docker**: Non-root user, minimal images
5. **Secrets Management**: Environment variables, no hardcoded secrets

---

## 📊 Monitoring & Logging

### Application Monitoring
- **Health Checks**: Docker health check endpoints
- **Uptime Monitoring**: External service (Uptime Robot)
- **Performance Metrics**: Response times, error rates
- **Resource Usage**: CPU, memory, disk usage

### Logging Strategy
```
INFO:  User actions, API requests
WARN:  Degraded performance, recoverable errors
ERROR: Application errors, failed requests
DEBUG: Development debugging (disabled in production)
```

### Log Aggregation
- Container logs → Docker logging driver
- Application logs → Structured JSON format
- Log rotation → Logrotate configuration
- Retention → 14 days

---

## 🔄 Deployment Pipeline

### Development → Staging → Production

```
Local Development
    ↓
Git Commit & Push
    ↓
Code Review
    ↓
Merge to Main
    ↓
Build Docker Images
    ↓
Run Tests
    ↓
Deploy to Staging
    ↓
Integration Tests
    ↓
Manual Approval
    ↓
Deploy to Production
    ↓
Health Check
    ↓
Monitor
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
```
Load Balancer (Nginx)
    ├── Frontend Instance 1
    ├── Frontend Instance 2
    └── Frontend Instance N
    
    ├── Backend Instance 1
    ├── Backend Instance 2
    └── Backend Instance N
            ↓
    Database (PostgreSQL)
    with read replicas
```

### Database Scaling
1. **Read Replicas**: For read-heavy workloads
2. **Partitioning**: By district_code or year
3. **Caching Layer**: Redis for frequent queries
4. **Connection Pooling**: Maximize database efficiency

### CDN Strategy
- Static assets → CDN
- API responses → Edge caching for public data
- Geographic distribution

---

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component logic (Jest)
- **Integration Tests**: Component interactions (React Testing Library)
- **E2E Tests**: User flows (Playwright/Cypress)
- **Accessibility Tests**: WCAG compliance (axe-core)

### Backend Testing
- **Unit Tests**: Business logic (pytest)
- **Integration Tests**: API endpoints (TestClient)
- **Load Tests**: Performance under load (Locust)
- **Security Tests**: Vulnerability scanning

---

## 🌍 Accessibility & Localization

### Accessibility (WCAG 2.1 Level AA)
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

### Localization
- **Languages**: Hindi (primary), English (secondary)
- **Number Formatting**: Indian numbering system (Lakhs, Crores)
- **Date Formatting**: DD/MM/YYYY
- **Currency**: Indian Rupee (₹)
- **Right-to-Left**: Not required for current languages

---

## 🔮 Future Enhancements

1. **Progressive Web App**: Offline functionality, push notifications
2. **Multi-state Support**: Expand beyond Uttar Pradesh
3. **Advanced Analytics**: Predictive models, trend analysis
4. **User Accounts**: Save favorites, set alerts
5. **Mobile Apps**: Native iOS/Android applications
6. **Voice Interface**: Voice-based navigation for low-literacy users
7. **SMS Integration**: Data delivery via SMS
8. **WhatsApp Bot**: District performance via WhatsApp

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-28

