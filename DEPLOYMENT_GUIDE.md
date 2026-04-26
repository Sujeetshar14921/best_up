# BestUp Deployment Guide

## Problem Fixed: Trending Right Now Section Not Working on Vercel

### The Issue 🔴
- **Locally**: ✅ Trending Right Now section shows cards perfectly
- **Vercel/Production**: ❌ Section shows "No approved trending phones yet" with empty cards

### Root Cause 🔍
Vercel **IGNORES** `.env.production` files during build time. The environment variable `VITE_API_URL` was not being passed to the build process, so all API calls fell back to `http://localhost:5000/api` (which doesn't exist in production).

### Solution ✅ Applied

#### 1. Updated `vercel.json` Files
Both `/frontend/vercel.json` and `/admin_dashboard/vercel.json` now include:

```json
{
  "buildCommand": "VITE_API_URL=https://best-up.onrender.com/api npm run vercel-build",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

This ensures `VITE_API_URL` is available during build time.

#### 2. Verify in Vercel Dashboard
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add or verify:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://best-up.onrender.com/api`
   - **Environment**: Production

#### 3. How Components Use the API
All frontend components use this pattern:

```javascript
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

- ✅ In Vercel: Uses `https://best-up.onrender.com/api`
- ✅ Locally: Uses `http://localhost:5000/api` (fallback)

## Affected Components
The Trending Right Now section is in:
- File: `/frontend/src/components/Home/TrendingPhones.jsx`
- API call: `GET /api/phones?limit=50&sort=-scores.valueForMoney`

## Testing Locally vs Production

### Local Testing
```bash
cd frontend
npm install
npm run dev
```
- Uses `http://localhost:5000/api` (fallback)
- Should show trending cards

### Production on Vercel
- Automatically uses `https://best-up.onrender.com/api`
- Ensure backend is running on Render

## Environment Variables Reference

| Variable | Local Dev | Production | Purpose |
|----------|-----------|-----------|---------|
| `VITE_API_URL` | `http://localhost:5000/api` | `https://best-up.onrender.com/api` | API endpoint for all data fetching |

## Troubleshooting

### Cards Still Not Showing?
1. Check browser console for errors
2. Verify Render backend is online: `curl https://best-up.onrender.com/api`
3. Check Vercel deployment logs for build errors
4. Ensure environment variables are set in Vercel dashboard

### CORS Errors?
- Backend CORS is configured in `/backend/server.js`
- Run `app.use(cors())` to allow all origins
- If restricted, add specific Vercel domains

### API Returns 404?
- Verify the endpoint path is correct
- Check that Render backend database has data
- Ensure database connection string in `.env` is correct

## Files Modified
- ✅ `/frontend/vercel.json` - Added build command with env var
- ✅ `/admin_dashboard/vercel.json` - Added build command with env var

## Next Steps
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Watch build logs to confirm `VITE_API_URL` is being set
4. Check Trending Right Now section on deployed site

---

**Last Updated**: April 26, 2026
