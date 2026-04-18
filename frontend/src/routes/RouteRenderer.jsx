import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { appRoutes } from './appRoutes'

/**
 * RouteRenderer component renders all routes from appRoutes configuration
 * This component takes route definitions and creates Route elements
 */
export default function RouteRenderer() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.element />}
        />
      ))}
    </Routes>
  )
}
