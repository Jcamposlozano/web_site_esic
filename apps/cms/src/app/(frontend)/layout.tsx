import React from 'react'

export const metadata = {
  title: 'ESIC CMS',
  description: 'Panel de contenido de ESIC Medellín',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
