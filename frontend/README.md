# BestUp Frontend

Modern, responsive React frontend for the BestUp smartphone decision engine.

## 🎯 Features

- ✨ **Intelligent Recommendations** - Get personalized phone suggestions based on budget and priority
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🔍 **Advanced Filtering** - Filter phones by brand, price, RAM, and more
- ⚡ **Fast Performance** - Built with Vite for instant development and optimized builds
- 🌙 **Glass Morphism** - Modern UI effects and smooth transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── PhoneCard.jsx       # Phone card component
│   │   ├── FilterBar.jsx       # Filtering interface
│   │   ├── LoadingError.jsx    # Loading/error states
│   │   └── Footer.jsx          # Footer component
│   ├── pages/
│   │   ├── Home.jsx            # Home page
│   │   ├── RecommendPage.jsx   # Recommendation page
│   │   └── PhonesPage.jsx      # All phones page
│   ├── context/
│   │   └── PhoneContext.jsx    # State management
│   ├── services/
│   │   └── api.js              # API integration
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
└── package.json                # Dependencies
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📖 Pages

### Home (`/`)
- Hero section with CTA buttons
- Feature highlights
- Featured phones section
- Call-to-action for recommendations

### Recommendations (`/recommend`)
- Budget slider selection
- Priority selector (Gaming, Camera, Vlogging, Battery, Value)
- Smart recommendations display
- Score-based ranking

### Phones (`/phones`)
- Complete phone catalog
- Advanced filtering (brand, price, RAM)
- Search functionality
- Sorting options

## 🎨 Design System

### Colors
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Accent: `#f093fb` (Pink)

### Components
- **Cards** - Phone listings with glass morphism effect
- **Buttons** - Gradient buttons with hover effects
- **Forms** - Modern inputs with smooth interactions
- **Navigation** - Sticky header with responsive menu

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Available Endpoints
- `GET /api/phones` - List all phones
- `GET /api/phones/recommend` - Get recommendations
- `GET /api/phones/compare` - Compare phones
- `GET /api/phones/:slug` - Get phone details

## 🎯 State Management

Using React Context API for global state:
- Phones list
- Recommendations
- Comparisons
- Loading and error states

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Optimized for all screen sizes
- Touch-friendly interface

## ⚙️ Configuration

### Environment Variables
Create `.env.local` if needed:
```
VITE_API_URL=http://localhost:5000/api
```

### Tailwind CSS
Customized in `tailwind.config.js` with:
- Custom colors
- Extended spacing
- Custom shadows
- Glass morphism effects

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, connect to Vercel
# Vercel automatically detects Vite
```

### Netlify
```bash
npm run build
# Deploy the `dist` folder
```

### Traditional Server
```bash
npm run build
# Upload `dist` folder to your server
# Configure server to serve SPA (all routes -> index.html)
```

## 📝 Notes

- The frontend expects the backend to run on `http://localhost:5000`
- Ensure CORS is enabled on the backend
- Phone data comes from MongoDB via the backend API
- All images are placeholder gradients (ready for real images)

## 🤝 Contributing

Feel free to enhance the UI/UX, add new features, or improve performance!

---

**Built with ❤️ for BestUp**
