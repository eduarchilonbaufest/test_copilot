import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin } from '../services/auth'

const SESSION_KEY = 'auth_tokens'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(tokens) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(tokens))
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => loadSession())

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password)
    saveSession({ ...data, username })
    setTokens({ ...data, username })
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setTokens(null)
  }, [])

  const isAuthenticated = tokens !== null

  return (
    <AuthContext.Provider value={{ tokens, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
