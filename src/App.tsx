import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { LanguageProvider } from './contexts/LanguageContext'
import { MaintenanceScreen } from './components/MaintenanceScreen'
import config from './config.json'

function App() {
  if (config.isMaintenance) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-white text-default font-sans antialiased selection:bg-brand selection:text-white">
          <MaintenanceScreen />
        </div>
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </LanguageProvider>
  )
}

export default App
