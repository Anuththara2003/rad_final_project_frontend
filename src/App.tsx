import Router from './routes'
import { AuthProvider } from './context/authContex'

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>

  )
}

export default App