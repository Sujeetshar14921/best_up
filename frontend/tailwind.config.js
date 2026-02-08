export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066ff',
        secondary: '#00d4ff',
        accent: '#ff6b6b',
        dark: '#0f172a',
        light: '#f8fafc',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 13px rgba(0, 0, 0, 0.05)',
        'hover': '0 20px 25px rgba(0, 0, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.15)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        'xl': '1rem'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }
    }
  },
  plugins: []
}
