import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Fonar — Yapay Zeka Destekli Fon Analiz Platformu',
    template: '%s | Fonar'
  },
  description: 'Türkiye\'nin en detaylı yapay zeka destekli yatırım fonu analiz platformu. TEFAS verilerine dayalı risk analizi, getiri karşılaştırması ve portföy dağılımı.',
  keywords: ['yatırım fonu', 'fon analizi', 'TEFAS', 'fon getiri', 'portföy analizi', 'risk skoru', 'yapay zeka finans'],
  authors: [{ name: 'Fonar' }],
  creator: 'Fonar',
  metadataBase: new URL('https://fonar.com.tr'),
  alternates: { canonical: 'https://fonar.com.tr' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://fonar.com.tr',
    siteName: 'Fonar',
    title: 'Fonar — Yapay Zeka Destekli Fon Analiz Platformu',
    description: 'TEFAS verilerine dayalı AI destekli yatırım fonu analizi. Risk skoru, getiri trendi, portföy dağılımı.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Fonar Fon Analiz Platformu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fonar — Fon Analiz Platformu',
    description: 'AI destekli yatırım fonu analizi. TEFAS verileri, risk skoru, getiri karşılaştırması.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="canonical" href="https://fonar.com.tr" />
      </head>
      <body>{children}</body>
    </html>
  )
}
