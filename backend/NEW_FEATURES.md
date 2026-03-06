# BestUp Backend - NEW FEATURES & IMPROVEMENTS

## 🎉 Latest Improvements (Phase 2)

### New Middleware & Features
1. ✅ **Rate Limiting** - Prevents abuse with 100 requests per 15 minutes per IP
2. ✅ **Request Caching** - 5-minute cache for GET requests
3. ✅ **Request Validation** - Joi validation for all inputs
4. ✅ **Health Monitoring** - API health check and statistics
5. ✅ **Advanced Analytics** - Trending, trending, and statistics

---

## 📊 Analytics & Trending Endpoints

### 1. Get Trending Phones
**Endpoint:** `GET /api/analytics/trending`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10, max: 100)
- `timeframe` (optional): '7d' or '30d' (default: '7d')

**Response:**
```json
{
  "success": true,
  "timeframe": "7d",
  "count": 10,
  "data": [
    {
      "_id": "phone_id",
      "name": "iPhone 16 Pro",
      "brand": "Apple",
      "basePrice": 129999,
      "slug": "iphone-16-pro",
      "reviewCount": 45,
      "avgRating": 4.8,
      "trendScore": 230.5
    }
  ]
}
```

### 2. Get Most Reviewed Phones
**Endpoint:** `GET /api/analytics/most-reviewed`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "name": "Samsung Galaxy S24",
      "reviewCount": 156,
      "avgRating": 4.7
    }
  ]
}
```

### 3. Get Top Rated Phones by Category
**Endpoint:** `GET /api/analytics/top-rated`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)
- `category` (optional): 'gaming' | 'camera' | 'battery' | 'display' | 'valueForMoney' (default: 'valueForMoney')

**Example:**
```
GET /api/analytics/top-rated?category=gaming&limit=5
```

### 4. Get Price Statistics
**Endpoint:** `GET /api/analytics/price-stats`

**Response:**
```json
{
  "success": true,
  "overall": {
    "_id": null,
    "avgPrice": 45000,
    "minPrice": 8000,
    "maxPrice": 250000,
    "totalPhones": 87
  },
  "byBrand": [
    {
      "_id": "Apple",
      "avgPrice": 95000,
      "minPrice": 79999,
      "maxPrice": 179999,
      "count": 5
    }
  ]
}
```

### 5. Get Phones by Price Segment
**Endpoint:** `GET /api/analytics/by-segment`

**Response:**
```json
{
  "success": true,
  "data": {
    "Budget": {
      "count": 25,
      "avgScore": 7.5
    },
    "Mid-Range": {
      "count": 35,
      "avgScore": 8.2
    },
    "Premium": {
      "count": 20,
      "avgScore": 8.8
    },
    "Flagship": {
      "count": 7,
      "avgScore": 9.1
    }
  }
}
```

### 6. Get Search Suggestions (Autocomplete)
**Endpoint:** `GET /api/analytics/suggestions`

**Query Parameters:**
- `q` (required): Search query

**Example:**
```
GET /api/analytics/suggestions?q=ip
```

**Response:**
```json
{
  "success": true,
  "data": {
    "phones": [
      {
        "_id": "id",
        "name": "iPhone 16 Pro",
        "brand": "Apple",
        "slug": "iphone-16-pro"
      }
    ],
    "brands": ["Apple", "iPhone"],
    "count": 1
  }
}
```

---

## 🏥 Health & Monitoring Endpoints

### 1. API Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-02-24T10:30:00Z",
  "uptime": "2h 15m 30s",
  "database": "Connected",
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. System Statistics
**Endpoint:** `GET /api/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPhones": 87,
    "totalUsers": 234,
    "totalReviews": 1543,
    "totalBrands": 12,
    "averagePhonePrice": 45000,
    "mostCommonBrand": "Samsung",
    "phonesCountByBrand": 25
  },
  "timestamp": "2026-02-24T10:30:00Z"
}
```

---

## 🚀 New Features & Enhancements

### Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: When the limit resets

**When Limited (429 Response):**
```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retryAfter": 120
}
```

### Response Caching
- **Duration:** 5 minutes for GET requests
- **Headers:**
  - `X-Cache: HIT` - Response from cache
  - `X-Cache: MISS` - Fresh response from database
  - `X-Cache-Age`: Seconds cached

**Example:**
```
X-Cache: HIT
X-Cache-Age: 234
```

### Request Validation
All endpoints validate input using Joi with detailed error messages:

**Example Error Response:**
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "name",
      "message": "\"name\" is required"
    },
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

---

## 🔍 Advanced Search & Filtering

### Query Helper Utilities
Use the query builder for advanced filtering:

```javascript
// Example: Advanced phone search
GET /api/phones?
  search=iPhone
  &brand=Apple
  &minPrice=50000
  &maxPrice=150000
  &minRam=8
  &minDisplay=6
  &minRefreshRate=120
  &sort=price-asc
  &limit=20
  &page=1
```

**Supported Sort Options:**
- `price-asc` - Price ascending
- `price-desc` - Price descending
- `name-asc` - Name A-Z
- `name-desc` - Name Z-A
- `rating-desc` - Highest rating first
- `gaming-desc` - Gaming score
- `camera-desc` - Camera score
- `battery-desc` - Battery score
- `newest` - Recently added
- `oldest` - Oldest first

---

## 📈 Pagination Meta

All list endpoints return pagination metadata:

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 87,
    "recordsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "data": []
}
```

---

## 🔐 Rate Limiting Details

### Default Limits
| Endpoint Type | Limit | Window |
|---|---|---|
| General API | 100 | 15 min |
| Search/Analytics | 100 | 15 min |
| Authentication | 10 | 15 min |

### Handling Rate Limits
1. Check `X-RateLimit-Remaining` header
2. If remaining is low, wait before making more requests
3. If 429 response, use `retryAfter` header for delay

---

## 🛠️ Configuration

### Environment Variables for New Features
```env
# Rate Limiting
RATE_LIMIT_WINDOW=15        # Minutes
RATE_LIMIT_MAX_REQUESTS=100 # Per window

# Caching
CACHE_DURATION=300          # Seconds (5 minutes)

# Analytics
TRENDING_TIMEFRAME=7d       # 7d or 30d default
```

---

## 📚 Complete Endpoint List

### Phones
- `GET /api/phones` - List phones with filters
- `POST /api/phones` - Create phone (admin)
- `GET /api/phones/:slug` - Get phone by slug
- `PUT /api/phones/:slug` - Update phone (admin)
- `DELETE /api/phones/:slug` - Delete phone (admin)
- `GET /api/phones/recommend` - Smart recommendations
- `GET /api/phones/compare` - Compare phones

### Analytics
- `GET /api/analytics/trending` - Trending phones
- `GET /api/analytics/most-reviewed` - Most reviewed
- `GET /api/analytics/top-rated` - Top rated by category
- `GET /api/analytics/price-stats` - Price statistics
- `GET /api/analytics/by-segment` - By price segment
- `GET /api/analytics/suggestions` - Search suggestions

### System
- `GET /api/health` - Health status
- `GET /api/stats` - System statistics
- `GET /api` - API info & documentation

### Other
- `GET /api/brands` - Brands
- `POST /api/reviews` - Create review
- `GET /api/users/profile` - User profile
- `POST /api/wishlist/add` - Add to wishlist

---

## 🎯 Best Practices

1. **Use Caching:** Plan requests accordingly as GET responses are cached for 5 minutes
2. **Monitor Rate Limits:** Check response headers for rate limit info
3. **Validate Input:** All inputs are validated; follow the schema
4. **Handle Errors:** Always check `success` field in response
5. **Pagination:** Always specify `limit` and `page` for list endpoints

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "count": 10,
  "pagination": {},
  "timestamp": "2026-02-24T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": []
}
```

---

**Last Updated:** February 24, 2026  
**Version:** 1.1.0
