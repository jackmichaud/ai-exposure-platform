import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import PageShell from './components/layout/PageShell'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import { FilterProvider } from './context/FilterContext'
import { DebateProvider } from './context/DebateContext'

const ResearchPage = lazy(() => import('./pages/ResearchPage'))
const DebateArena = lazy(() => import('./pages/DebateArena'))
const OccupationProfile = lazy(() => import('./pages/OccupationProfile'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <DebateProvider>
          <div className="bg-slate-950">
            <Header />
            <PageShell>
              <ErrorBoundary>
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/research" element={<ResearchPage />} />
                    <Route path="/debate" element={<DebateArena />} />
                    <Route path="/occupation/:id" element={<OccupationProfile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </PageShell>
          </div>
        </DebateProvider>
      </FilterProvider>
    </BrowserRouter>
  )
}
