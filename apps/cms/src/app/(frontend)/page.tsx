export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <p
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#0047E9',
        }}
      >
        ESIC CMS
      </p>
      <h1 style={{ fontSize: '2.5rem', lineHeight: 1.1, color: '#00133F', margin: '0.5rem 0 1rem' }}>
        Panel de contenido
      </h1>
      <p style={{ color: '#5F6B7A', lineHeight: 1.6 }}>
        Gestor de contenido (Payload) del sitio de ESIC Medellín. Demo local con SQLite.
      </p>
      <p style={{ marginTop: '2rem' }}>
        <a
          href="/admin"
          style={{
            display: 'inline-block',
            background: '#0047E9',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.85rem 1.5rem',
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          Ir al panel /admin →
        </a>
      </p>
    </main>
  )
}
