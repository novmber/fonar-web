import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fonar — Fon Analiz Platformu',
  description: 'Türkiye\'nin en detaylı yapay zeka destekli yatırım fonu analiz platformu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
