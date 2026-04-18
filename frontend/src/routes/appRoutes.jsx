import React from 'react'
import { Route } from 'react-router-dom'
import Home from '../pages/Home'
import ComparisonPage from '../pages/ComparisonPage'
import DetailsPage from '../pages/DetailsPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'

// Route configuration - all paths and components defined here
export const appRoutes = [
  {
    path: '/',
    element: Home,
    label: 'Home',
    public: true
  },
  {
    path: '/compare',
    element: ComparisonPage,
    label: 'Compare',
    public: true
  },
  {
    path: '/phone/:slug',
    element: DetailsPage,
    label: 'Phone Details',
    public: true
  },
  {
    path: '/login',
    element: LoginPage,
    label: 'Login',
    public: true,
    auth: false
  },
  {
    path: '/signup',
    element: SignupPage,
    label: 'Sign Up',
    public: true,
    auth: false
  },
  {
    path: '/forgot-password',
    element: ForgotPasswordPage,
    label: 'Forgot Password',
    public: true,
    auth: false
  },
  {
    path: '/reset-password',
    element: ResetPasswordPage,
    label: 'Reset Password',
    public: true,
    auth: false
  }
]

// Export route paths as constants for easy navigation
export const ROUTE_PATHS = {
  HOME: '/',
  COMPARE: '/compare',
  PHONE_DETAILS: '/phone/:slug',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password'
}
