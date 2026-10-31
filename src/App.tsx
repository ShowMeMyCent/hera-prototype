import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { ToastProvider } from './components/ui/Toast'
import { AnalyticsPage } from './pages/Analytics'
import { DigitalTwinPage } from './pages/DigitalTwin'
import { HomePage } from './pages/Home'
import { MarketplacePage } from './pages/Marketplace'
import { SettingsPage } from './pages/Settings'

function App() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:matchId" element={<MarketplacePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analytics/digital-twin" element={<DigitalTwinPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  )
}

export default App
