import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const from = location.state?.from?.pathname || '/welcome'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Logo / wordmark */}
        <div className={styles.logoArea}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"
              fill="var(--color-primary)"
            />
            <path
              d="M12 7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 7c-2.761 0-5 1.343-5 3v.5h10V17c0-1.657-2.239-3-5-3Z"
              fill="white"
            />
          </svg>
          <span className={styles.logoText}>JWT Auth</span>
        </div>

        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              className={styles.input}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="admin"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading || !username || !password}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.hint}>
          Credenciales por defecto: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </main>
  )
}
