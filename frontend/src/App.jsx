import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import WelcomePage from './pages/WelcomePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected route */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />

          {/* Default: redirect to welcome (ProtectedRoute will handle unauthenticated users) */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
