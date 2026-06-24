import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './WelcomePage.module.css'

export default function WelcomePage() {
  const { tokens, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.layout}>
      {/* ── Global nav ── */}
      <header className={styles.nav}>
        <span className={styles.navBrand}>JWT Auth</span>
        <nav className={styles.navActions}>
          <span className={styles.navUser}>{tokens?.username}</span>
          <button className={styles.btnLogout} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      {/* ── Hero section ── */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            {/* Avatar */}
            <div className={styles.avatar} aria-hidden="true">
              {tokens?.username?.[0]?.toUpperCase() ?? '?'}
            </div>

            <h1 className={styles.heroTitle}>
              Bienvenido,<br />
              <span className={styles.heroAccent}>{tokens?.username}</span>.
            </h1>

            <p className={styles.heroSubtitle}>
              Has iniciado sesión correctamente. Tu sesión está activa
              y protegida con tokens JWT.
            </p>

            {/* Token info card */}
            <div className={styles.tokenCard}>
              <div className={styles.tokenRow}>
                <span className={styles.tokenLabel}>Access Token</span>
                <code className={styles.tokenValue}>
                  {tokens?.access_token?.slice(0, 32)}…
                </code>
              </div>
              <div className={styles.tokenDivider} />
              <div className={styles.tokenRow}>
                <span className={styles.tokenLabel}>Tipo</span>
                <code className={styles.tokenValue}>{tokens?.token_type}</code>
              </div>
            </div>

            <button className={styles.btnPrimary} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p>JWT Auth App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
