import { AppLayout } from '@/components/app-layout.tsx'
import { AppProviders } from '@/components/app-providers.tsx'
import { lazy } from 'react'
import { RouteObject, useRoutes } from 'react-router'

const LazyDashboard = lazy(() => import('@/components/dashboard/dashboard-feature'))
const LazyWalletList = lazy(() => import('@/components/wallet/wallet-list-feature'))
const LazyWalletDetail = lazy(() => import('@/components/wallet/wallet-detail-feature'))

const routes: RouteObject[] = [
  { index: true, element: <LazyDashboard /> },
  {
    path: 'wallet',
    children: [
      { path: 'list', element: <LazyWalletList /> },
      { path: ':assetId', element: <LazyWalletDetail /> },
    ],
  },
  {
    path: 'wallet',
    children: [
      { path: 'list', element: <LazyWalletList /> },
      { path: ':assetId', element: <LazyWalletDetail /> },
    ],
  },
]

export function App() {
  const router = useRoutes(routes)
  return (
    <AppProviders>
      <AppLayout>{router}</AppLayout>
    </AppProviders>
  )
}
