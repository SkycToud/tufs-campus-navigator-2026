import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </LanguageProvider>
  )
}

export default App
