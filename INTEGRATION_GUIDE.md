# Complete Integration Guide - BestUp Platform

## Quick Start: Frontend Components

### 1. Using TrendingPhones Component

```jsx
import TrendingPhones from '../components/TrendingPhones'

export default function Home() {
  return (
    <div>
      <TrendingPhones />
    </div>
  )
}
```

**What it does:**
- Fetches trending phones from `/api/analytics/trending`
- Shows timeframe selector (7d/30d)
- Displays rank badges and trend scores
- Handles loading and error states

---

### 2. Using SearchSuggestions Component

```jsx
import SearchSuggestions from '../components/SearchSuggestions'

export default function Header() {
  return (
    <header>
      <div className="flex items-center gap-4">
        <SearchSuggestions />
      </div>
    </header>
  )
}
```

**What it does:**
- Debounced autocomplete search
- Shows phone and brand suggestions
- Links to phone details on selection
- Requires API at `/api/analytics/suggestions`

---

### 3. Using TopRatedByCategory Component

```jsx
import TopRatedByCategory from '../components/TopRatedByCategory'

export default function Home() {
  return (
    <section>
      <TopRatedByCategory />
    </section>
  )
}
```

**What it does:**
- 5 category buttons (Gaming, Camera, Battery, Display, Value)
- Fetches from `/api/analytics/top-rated`
- Shows top 10 phones per category
- Visual rating indicators

---

### 4. Using PriceSegmentAnalysis Component

```jsx
import PriceSegmentAnalysis from '../components/PriceSegmentAnalysis'

export default function Home() {
  return (
    <section>
      <PriceSegmentAnalysis />
    </section>
  )
}
```

**What it does:**
- Shows 4 price segments with phone counts
- Links to filtered search results
- Displays average rating per segment
- Provides buying tips

---

### 5. Using AdvancedFilters Component

```jsx
import AdvancedFilters from '../components/AdvancedFilters'
import { useState } from 'react'

export default function PhonesPage() {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 150000,
    ram: [],
    storage: [],
    display: [],
    refreshRate: [],
    battery: [],
    processor: []
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // Fetch phones with new filters
  }

  return (
    <div>
      <AdvancedFilters 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
    </div>
  )
}
```

**Filter Structure:**
```javascript
{
  priceMin: 0,              // ₹0
  priceMax: 150000,         // ₹150,000
  ram: [4, 8],              // Selected RAM values in GB
  storage: [128, 256],      // Selected storage in GB
  display: ['medium'],      // Size categories
  refreshRate: [120, 144],  // Hz values
  battery: ['high'],        // Battery categories
  processor: ['snapdragon8'] // Processor types
}
```

---

### 6. Using SortSelector Component

```jsx
import SortSelector from '../components/SortSelector'
import { useState } from 'react'

export default function PhonesPage() {
  const [sortBy, setSortBy] = useState('relevance')

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    // Re-sort your phones list
  }

  return (
    <div>
      <SortSelector 
        onSortChange={handleSortChange}
        currentSort={sortBy}
      />
    </div>
  )
}
```

**Sort Options:**
- `relevance` - Default sorting
- `price-low-high` - Cheapest first
- `price-high-low` - Most expensive
- `rating-high` - Highest rated
- `rating-low` - Lowest rated
- `newest` - Latest models
- `popularity` - Trending now
- `performance` - Best performance

---

### 7. Using Pagination Component

```jsx
import Pagination from '../components/Pagination'
import { useState } from 'react'

export default function PhonesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(totalPhones / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalPhones}
        loading={false}
      />
    </div>
  )
}
```

**Props:**
- `currentPage` - Current page number (1-indexed)
- `totalPages` - Total number of pages
- `onPageChange` - Callback when page changes
- `itemsPerPage` - Items displayed per page
- `totalItems` - Total items in collection
- `loading` - Show loading state

---

### 8. Using HealthStatus Component

```jsx
import HealthStatus from '../components/HealthStatus'

export default function Dashboard() {
  return (
    <div>
      {/* Compact view */}
      <HealthStatus showDetails={false} />
      
      {/* Detailed view */}
      <HealthStatus showDetails={true} />
    </div>
  )
}
```

**What it displays:**
- API status (Healthy/Degraded/Critical)
- Uptime
- Average response time
- Memory usage
- Component status breakdown
- Auto-refreshes every 30 seconds

---

## Admin Dashboard Integration

### Using AdminAnalytics Component

```jsx
import AdminAnalytics from '../components/AdminAnalytics'

export default function Dashboard() {
  return (
    <div className="bg-white rounded-lg p-6">
      <AdminAnalytics />
    </div>
  )
}
```

**Features:**
- 6 key metric cards
- Top 5 phones table
- Timeframe selector (7d/30d/90d)
- Key insights
- Responsive design

---

## Complete Pages Setup

### Home.jsx (Complete)
```jsx
import React from 'react'
import Header from '../components/Header'
import BannerDisplay from '../components/BannerDisplay'
import TrendingPhones from '../components/TrendingPhones'
import TopRatedByCategory from '../components/TopRatedByCategory'
import PriceSegmentAnalysis from '../components/PriceSegmentAnalysis'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Header />
      <BannerDisplay />
      <TrendingPhones />
      <TopRatedByCategory />
      <PriceSegmentAnalysis />
      <Footer />
    </div>
  )
}
```

### PhonesPage.jsx (Complete)
```jsx
import React, { useState, useEffect } from 'react'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import AdvancedFilters from '../components/AdvancedFilters'
import SortSelector from '../components/SortSelector'
import Pagination from '../components/Pagination'

export default function PhonesPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  // Apply sorting
  const sortedPhones = [...(phones || [])].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return (a.minPrice || 0) - (b.minPrice || 0)
      case 'price-high-low':
        return (b.minPrice || 0) - (a.minPrice || 0)
      case 'rating-high':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  // Paginate
  const totalPages = Math.ceil(sortedPhones.length / itemsPerPage)
  const paginatedPhones = sortedPhones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <h1>Explore All Phones</h1>
      
      <div className="flex gap-4">
        <AdvancedFilters onFilterChange={handleFilterChange} />
        <SortSelector onSortChange={handleSortChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paginatedPhones.map(phone => (
          <PhoneCard key={phone._id} phone={phone} />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={sortedPhones.length}
      />
    </div>
  )
}
```

---

## API Endpoints Reference

### Analytics Endpoints

**Trending Phones**
```
GET /api/analytics/trending?timeframe=7d
Response: { data: [ { name, trendScore, views, rating, ... } ] }
```

**Top Rated by Category**
```
GET /api/analytics/top-rated
Response: { data: [ { name, rating, category, ... } ] }
```

**Search Suggestions**
```
GET /api/analytics/suggestions?query=iphone
Response: { data: { phones: [...], brands: [...] } }
```

**Price Segment Analysis**
```
GET /api/analytics/by-segment
Response: { data: { Budget: { count, avgScore }, ... } }
```

**Health Status**
```
GET /api/health/status
Response: { data: { status, uptime, memory, avgResponseTime, components } }
```

---

## Environment Variables

Create a `.env` file in your frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

All components automatically use this URL via:
```javascript
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

---

## Error Handling Pattern

All components follow this error handling pattern:

```jsx
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/endpoint`)
      setData(response.data.data)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load data')
    }
  }
  
  fetchData()
}, [])

if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
      {error}
    </div>
  )
}
```

---

## Loading States Pattern

```jsx
const [loading, setLoading] = useState(true)

// Show skeleton while loading
if (loading) {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  )
}
```

---

## Styling with Tailwind

All components use Tailwind CSS utility classes:

- **Colors:** `from-blue-600 to-blue-700` (gradients)
- **Spacing:** `p-6`, `mb-4`, `gap-3` (padding, margin, gaps)
- **Layout:** `flex`, `grid`, `w-full` (flexbox, grid, width)
- **Responsive:** `md:`, `lg:` (breakpoints)
- **States:** `hover:`, `focus:`, `disabled:` (pseudo-classes)

---

## Performance Tips

1. **Memoize Filters**
```jsx
const memoizedFilters = useMemo(() => ({ ...filters }), [filters])
```

2. **Debounce Search**
```jsx
const debouncedSearch = useCallback(
  debounce((term) => handleSearch(term), 300),
  []
)
```

3. **Use React.memo** for PhoneCard
```jsx
export default React.memo(PhoneCard)
```

4. **Lazy Load Components**
```jsx
const Pagination = lazy(() => import('./Pagination'))
```

---

## Troubleshooting

### "Cannot GET /api/analytics/trending"
- Ensure backend is running on port 5000
- Check that analytics routes are properly mounted
- Verify `VITE_API_URL` is set correctly

### Components not showing
- Check browser console for errors
- Verify component imports are correct
- Ensure parent component passes required props

### Styling issues
- Ensure Tailwind CSS is configured
- Clear build cache: `npm run dev`
- Check for CSS conflicts

### API responses empty
- Verify backend data exists
- Check filter parameters
- Test API endpoint directly with Postman

---

## Summary

All components are production-ready and can be used immediately. Each component:
✅ Handles loading states
✅ Handles error states
✅ Responsive design
✅ Tailwind CSS styled
✅ Proper TypeScript if needed
✅ Accessibility features
✅ Mobile optimized
✅ API error handling

For questions or issues, refer to the individual component files for detailed comments and documentation.
