import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './WelcomePage.module.css'

const microsoftCertifications2026 = [
  {
    title: 'Azure Fundamentals',
    exam: 'AZ-900',
    focus: 'Fundamentos de nube en Azure',
    link: 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/',
  },
  {
    title: 'Azure Administrator Associate',
    exam: 'AZ-104',
    focus: 'Administración de servicios y recursos de Azure',
    link: 'https://learn.microsoft.com/credentials/certifications/azure-administrator/',
  },
  {
    title: 'Azure Solutions Architect Expert',
    exam: 'AZ-305',
    focus: 'Diseño de soluciones en Azure',
    link: 'https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/',
  },
  {
    title: 'Azure AI Fundamentals',
    exam: 'AI-900',
    focus: 'Conceptos de IA aplicada en Azure',
    link: 'https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/',
  },
  {
    title: 'Security, Compliance, and Identity Fundamentals',
    exam: 'SC-900',
    focus: 'Fundamentos de seguridad y cumplimiento',
    link: 'https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/',
  },
  {
    title: 'Power BI Data Analyst Associate',
    exam: 'PL-300',
    focus: 'Analítica y visualización de datos con Power BI',
    link: 'https://learn.microsoft.com/credentials/certifications/power-bi-data-analyst-associate/',
  },
]

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

        <section className={styles.certificationsSection} aria-label="Certificaciones Microsoft 2026">
          <h2 className={styles.certificationsTitle}>
            Certificaciones Microsoft destacadas para 2026
          </h2>
          <p className={styles.certificationsSubtitle}>
            Referencia rápida basada en certificaciones vigentes de Microsoft Learn.
          </p>
          <div className={styles.cardsGrid}>
            {microsoftCertifications2026.map((certification) => (
              <article key={certification.exam} className={styles.certificationCard}>
                <h3 className={styles.cardTitle}>{certification.title}</h3>
                <p className={styles.cardExam}>Examen: {certification.exam}</p>
                <p className={styles.cardFocus}>{certification.focus}</p>
                <a
                  className={styles.cardLink}
                  href={certification.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en Microsoft Learn
                </a>
              </article>
            ))}
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
