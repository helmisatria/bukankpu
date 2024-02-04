// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PemiluDapilTypeImport } from './routes/pemilu.$dapilType'

// Create/Update Routes

const PemiluDapilTypeRoute = PemiluDapilTypeImport.update({
  path: '/pemilu/$dapilType',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/pemilu/$dapilType': {
      preLoaderRoute: typeof PemiluDapilTypeImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([PemiluDapilTypeRoute])
