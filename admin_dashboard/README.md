# BestUp Admin Dashboard

## 📊 Overview

A complete admin dashboard for managing BestUp platform, including brand management, user management, and device data control.

## 🎯 Features

### 1. **Brand Management**
- ✅ Add new brands with logo/emoji
- ✅ Edit existing brands
- ✅ Delete brands
- ✅ Support for emoji, URL, and image logos
- ✅ Display order customization
- ✅ Brand descriptions

### 2. **User Management**
- ✅ View all registered users
- ✅ Change user roles (user/admin)
- ✅ Deactivate/activate users
- ✅ Delete users
- ✅ View user statistics
- ✅ See submitted phones count

### 3. **Dashboard**
- ✅ Quick statistics overview
- ✅ Total brands, users, and admins
- ✅ Quick navigation cards
- ✅ Activity summary

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- BestUp backend running on http://localhost:5000

### Installation Steps

1. **Install Dependencies**
```bash
cd admin_dashboard
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

The admin dashboard will open at `http://localhost:5173`

## 📝 Login Credentials

**Demo Admin Account:**
- Email: `admin@bestup.com`
- Password: `admin123`

## 📁 Project Structure

```
admin_dashboard/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx           # Navigation sidebar
│   ├── context/
│   │   └── AdminContext.jsx      # State management
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── BrandManagement.jsx   # Brand CRUD
│   │   ├── UserManagement.jsx    # User management
│   │   └── LoginPage.jsx         # Admin login
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔌 API Endpoints

### Brands
- `GET /api/brands` - Get all brands
- `POST /api/brands` - Create brand (admin)
- `PUT /api/brands/:id` - Update brand (admin)
- `DELETE /api/brands/:id` - Delete brand (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `POST /api/users/login` - User login
- `PUT /api/users/:id/role` - Update user role (admin)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🎨 Styling

- **Framework**: Tailwind CSS 3.4
- **Colors**:
  - Primary: #0066ff (Blue)
  - Secondary: #00d4ff (Cyan)
  - Accent: #ff6b6b (Red)
  - Dark: #0f172a (Navy)
  - Light: #f8fafc (Off-white)

## 🔐 Security Notes

⚠️ **Important**: This is a demo setup. For production:
1. Implement JWT authentication
2. Add role-based access control middleware
3. Secure API endpoints properly
4. Use environment variables for API URLs
5. Implement HTTPS
6. Add rate limiting

## 📱 Responsive Design

✅ Mobile-friendly interface
✅ Desktop optimized
✅ Tablet compatible
✅ Touch-friendly navigation

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📚 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **CSS Framework**: Tailwind CSS 3.4
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 🤝 Contributing

When adding new features:
1. Create a new page in `src/pages/`
2. Add route in `App.jsx`
3. Update sidebar navigation in `Sidebar.jsx`
4. Use the `useAdmin` hook for data management

## 📖 Usage Guide

### Adding a New Brand

1. Go to **Brands** page
2. Click **Add Brand** button
3. Fill in brand details:
   - **Name**: Brand name (e.g., Samsung)
   - **Logo Type**: Emoji, URL, or Image
   - **Logo**: Enter emoji (📱) or URL
   - **Description**: Optional brand description
   - **Display Order**: Sort order in frontend
4. Click **Save Brand**

### Managing Users

1. Go to **Users** page
2. Use dropdown to change user role
3. Click shield icon to deactivate user
4. Click trash icon to delete user
5. View statistics at bottom

### Monitoring Dashboard

- View real-time statistics
- Quick access to all management sections
- System overview

## 🐛 Troubleshooting

**Issue**: "Cannot connect to API"
- **Solution**: Ensure backend is running on port 5000

**Issue**: "Login failed"
- **Solution**: Check if user exists and role is 'admin'

**Issue**: "CORS error"
- **Solution**: Backend must have CORS enabled

## 📝 Notes

- Brands are displayed from database, not hardcoded
- User changes are reflected in real-time
- All data persists in MongoDB
- Admin requires proper authentication

## 🚀 Next Steps

1. Set up production environment
2. Implement JWT tokens
3. Add password reset functionality
4. Set up backup system
5. Create audit logs
6. Add analytics dashboard

## 📞 Support

For issues or feature requests, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
