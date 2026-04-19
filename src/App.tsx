import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import PageShell from './components/layout/PageShell'
import Dashboard from './pages/Dashboard'
import ResearchPage from './pages/ResearchPage'
import DebateArena from './pages/DebateArena'
import OccupationProfile from './pages/OccupationProfile'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
