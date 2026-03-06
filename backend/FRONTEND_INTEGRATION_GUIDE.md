# 🎨 Frontend Integration Guide

Use these new backend features in your frontend to create amazing user experiences!

---

## 🎯 Feature Integration Checklist

### 1. Homepage Trending Section
- [ ] Add new component: `TrendingPhones.jsx`
- [ ] Fetch from `GET /api/analytics/trending?limit=10`
- [ ] Display phones with trend score
- [ ] Add "See All Trending" link

**Code Example:**
```jsx
import { useEffect, useState } from 'react'

export function TrendingPhones() {
  const [phones, setPhones] = useState([])
  
  useEffect(() => {
    fetch('/api/analytics/trending?limit=10')
      .then(r => r.json())
      .then(data => setPhones(data.data))
  }, [])
  
  return (
    <section>
      <h2>🔥 Trending Now</h2>
      {phones.map(phone => (
        <PhoneCard key={phone._id} phone={phone} />
      ))}
    </section>
  )
}
```

---

### 2. Search Bar Autocomplete
- [ ] Enhance search input with autocomplete
- [ ] Fetch from `GET /api/analytics/suggestions?q=<query>`
- [ ] Show phone and brand suggestions
- [ ] Limit to top 5 results

**Code Example:**
```jsx
const [suggestions, setSuggestions] = useState([])
const [searchInput, setSearchInput] = useState('')

const handleSearchChange = async (e) => {
  const query = e.target.value
  setSearchInput(query)
  
  if (query.length < 2) {
    setSuggestions([])
    return
  }
  
  const res = await fetch(`/api/analytics/suggestions?q=${query}`)
  const data = await res.json()
  setSuggestions(data.data)
}

// Show suggestions in dropdown
```

---

### 3. Category-based Top Rated Section
- [ ] Add category selector (Gaming, Camera, Battery, Value, Display)
- [ ] Fetch from `GET /api/analytics/top-rated?category=<cat>&limit=10`
- [ ] Update on category change
- [ ] Smooth transitions

**Categories:**
```
Gaming      → Best for gaming
Camera      → Best camera phones
Battery     → Best battery life
Display     → Best display
ValueForMoney → Best value
```

---

### 4. Price Range Filter
- [ ] Add price slider (min-max)
- [ ] Fetch from `GET /api/phones?minPrice=X&maxPrice=Y&limit=20`
- [ ] Show price statistics from `GET /api/analytics/price-stats`
- [ ] Display segment breakdown

**Code Example:**
```jsx
const [minPrice, setMinPrice] = useState(10000)
const [maxPrice, setMaxPrice] = useState(100000)

const fetchFiltered = async () => {
  const res = await fetch(
    `/api/phones?minPrice=${minPrice}&maxPrice=${maxPrice}`
  )
  const data = await res.json()
  // Update phones list
}
```

---

### 5. Price Segment Overview
- [ ] Create component showing price segments
- [ ] Fetch from `GET /api/analytics/by-segment`
- [ ] Show count and avg score per segment
- [ ] Make segments clickable filters

**Segments:**
- Budget (0-15k)
- Mid-Range (15k-40k)
- Premium (40k-80k)
- Flagship (80k+)

---

### 6. Advanced Filters Section
- [ ] Add filter panel with:
  - Brand selector
  - RAM selector (6GB, 8GB, 12GB, 16GB)
  - Storage selector
  - Display size range
  - Refresh rate minimum
- [ ] Apply filters from `GET /api/phones?brand=X&minRam=8...`
- [ ] Show "Clear Filters" button
- [ ] Save to URL params for sharing

---

### 7. Sorting Options
- [ ] Add sort dropdown with options:
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Highest Rated
  - Best Gaming
  - Best Camera

**Usage:**
```
GET /api/phones?sort=price-asc
GET /api/phones?sort=rating-desc
GET /api/phones?sort=gaming-desc
```

---

### 8. Infinity Scroll / Pagination
- [ ] Implement pagination with metadata
- [ ] Show page indicator "Page 1 of 5"
- [ ] "Next" and "Previous" buttons
- [ ] Or lazy load on scroll

**Use response metadata:**
```javascript
{
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalRecords: 87,
    hasNextPage: true,
    nextPage: 2
  }
}
```

---

### 9. API Health Status Widget
- [ ] Add footer widget showing API status
- [ ] Fetch from `GET /api/health`
- [ ] Show green checkmark if healthy
- [ ] Show uptime
- [ ] Update every 30 seconds

**Code Example:**
```jsx
const [health, setHealth] = useState(null)

useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch('/api/health')
    const data = await res.json()
    setHealth(data)
  }, 30000)
  return () => clearInterval(interval)
}, [])

return (
  <footer>
    {health?.success && '✅ API Online'}
    {!health?.success && '❌ API Down'}
  </footer>
)
```

---

### 10. Cache Status Display
- [ ] Show in developer console
- [ ] Log cache hits vs misses
- [ ] Display on slow connections

**Check headers:**
```javascript
const res = await fetch('/api/phones')
console.log(res.headers.get('X-Cache')) // 'HIT' or 'MISS'
console.log(res.headers.get('X-Cache-Age')) // Seconds cached
```

---

## 🎨 UI Components to Create

| Component | Fetch From | Purpose |
|---|---|---|
| `TrendingPhones.jsx` | `/api/analytics/trending` | Show trending phones |
| `SearchSuggestions.jsx` | `/api/analytics/suggestions` | Autocomplete search |
| `TopRatedByCategory.jsx` | `/api/analytics/top-rated` | Category-based top phones |
| `PriceFilter.jsx` | Input query | Filter by price |
| `PriceSegments.jsx` | `/api/analytics/by-segment` | Price segment breakdown |
| `AdvancedFilters.jsx` | Input query | Advanced filter panel |
| `SortSelector.jsx` | Input query | Sort selector |
| `Pagination.jsx` | Response metadata | Pagination controls |
| `HealthStatus.jsx` | `/api/health` | API health display |

---

## 🔗 Update Existing Components

### PhoneCard.jsx
- ✅ Already updated - no changes needed

### FilterBar.jsx
- [ ] Update to show loading state
- [ ] Check X-Cache header
- [ ] Show filter count badge

### Home.jsx
- [ ] Add trending section
- [ ] Update banner section
- [ ] Add category selector

### PhonesPage.jsx
- [ ] Add price range filter
- [ ] Add advanced filters
- [ ] Add sort dropdown
- [ ] Update pagination

### Header.jsx
- [ ] Add search with autocomplete
- [ ] Show suggestions dropdown
- [ ] Track search input

---

## 📊 Data Flow Diagram

```
User Action
    ↓
Frontend Component
    ↓
Fetch from Backend
    ↓
Backend (with caching)
    ↓
Database Query
    ↓
Response with X-Cache header
    ↓
Frontend Updates UI
```

---

## ⚡ Performance Tips

1. **Debounce Autocomplete** - Don't fetch on every keystroke
```jsx
const [searchTimeout, setSearchTimeout] = useState(null)

const handleSearchChange = (e) => {
  clearTimeout(searchTimeout)
  const timer = setTimeout(() => {
    fetchSuggestions(e.target.value)
  }, 300) // Wait 300ms before fetching
  setSearchTimeout(timer)
}
```

2. **Cache Results Locally** - Don't refetch same data
```jsx
const [cache, setCache] = useState({})

const fetchData = async (key) => {
  if (cache[key]) return cache[key]
  const res = await fetch(url)
  const data = await res.json()
  setCache({ ...cache, [key]: data })
  return data
}
```

3. **Monitor Rate Limits** - Handle 429 gracefully
```jsx
if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After')
  // Show message: "Please try again in X seconds"
}
```

4. **Compress Images** - Keep image files small
5. **Lazy Load Images** - Load only visible images
6. **Use Pagination** - Don't load all 1000 phones at once

---

## 🧪 Testing the Integration

### Test Checklist
- [ ] Try all sort options
- [ ] Test price range filtering
- [ ] Check pagination (go to page 2, 3)
- [ ] Test search autocomplete
- [ ] Verify cache hits (check X-Cache header)
- [ ] Check rate limits (refresh many times)
- [ ] Test on slow network (DevTools throttle)
- [ ] Test on mobile
- [ ] Check API health widget
- [ ] Verify all category filters work

---

## 🔍 Browser DevTools Tips

### Check Cache
```javascript
// In Console
fetch('/api/phones')
  .then(r => {
    console.log('Cache:', r.headers.get('X-Cache'))
    console.log('Age:', r.headers.get('X-Cache-Age'))
    return r.json()
  })
```

### Monitor Rate Limits
```javascript
fetch('/api/phones').then(r => {
  console.log('Remaining:', r.headers.get('X-RateLimit-Remaining'))
  console.log('Limit:', r.headers.get('X-RateLimit-Limit'))
})
```

### Check Network Tab
- Look for response headers
- Verify cache status
- Monitor request times

---

## 📱 Mobile Considerations

- [ ] Make filters mobile-friendly
- [ ] Use modal for advanced filters on mobile
- [ ] Touch-friendly sort and category buttons
- [ ] Proper spacing for touch targets
- [ ] Lazy load pagination on scroll

---

## 🚀 Deployment Notes

1. Update API_BASE_URL in production
2. Test all features in production
3. Monitor error rates
4. Check API health regularly
5. Track user interactions
6. A/B test new features

---

## 📚 Reference Files

- `NEW_FEATURES.md` - Backend endpoint docs
- `API_EXAMPLES.js` - Usage examples
- `IMPROVEMENTS.md` - Feature details

---

## ✨ Next Advanced Features

After integrating these:
- [ ] Machine learning recommendations
- [ ] User preference tracking
- [ ] Comparison chart
- [ ] Price drop alerts
- [ ] Review highlighting
- [ ] Related products
- [ ] Wishlist persistence
- [ ] Sharing features

---

**Ready to make your frontend awesome! 🚀**
