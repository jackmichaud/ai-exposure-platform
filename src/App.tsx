import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import PageShell from './components/layout/PageShell'
import Dashboard from './pages/Dashboard'
import ResearchPage from './pages/ResearchPage'
import DebateArena from './pages/DebateArena'
import OccupationProfile from './pages/OccupationProfile'
import { FilterProvider } from './context/FilterContext'
import { DebateProvider } from './context/DebateContext'

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <DebateProvider>
          <div className="min-h-screen bg-slate-950">
            <Header />
            <PageShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/debate" element={<DebateArena />} />
                <Route path="/occupation/:id" element={<OccupationProfile />} />
              </Routes>
            </PageShell>
          </div>
        </DebateProvider>
      </FilterProvider>
    </BrowserRouter>
  )
}
