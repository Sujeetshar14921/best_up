import { useMemo } from 'react'
import { appRoutes, ROUTE_PATHS } from './appRoutes'

/**
 * Custom hook to access route information throughout the app
 * Returns all routes and helper functions
 */
export const useRoutes = () => {
  const routes = useMemo(() => appRoutes, [])
  
  // Get route by path
  const getRouteByPath = (path) => {
    return routes.find(route => route.path === path)
  }
  
  // Get public routes only
  const getPublicRoutes = () => {
    return routes.filter(route => route.public === true)
  }
  
  // Get protected routes (auth required)
  const getProtectedRoutes = () => {
    return routes.filter(route => route.public === false)
  }
  
  // Get auth-specific routes (login, signup, etc)
  const getAuthRoutes = () => {
    return routes.filter(route => route.auth === false)
  }

  return {
    routes,
    ROUTE_PATHS,
    getRouteByPath,
    getPublicRoutes,
    getProtectedRoutes,
    getAuthRoutes
  }
}
