import type { Metadata } from 'next'
import fundsData from '../../../public/funds.json'
import DonutChart from './DonutChart'
import ShareButton from './ShareButton'

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const fund = (fundsData as any[]).find((f: any) => f.code?.toLowerCase() === code.toLowerCase())
  if (!fund) return { title: 'Fon Bulunamadı' }
  const monthly = fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'
  const yearly = fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'
  const title = `${fund.code} — ${fund.name}`
  const description = `${fund.name} fon analizi. Aylık getiri: ${monthly}, Yıllık getiri: ${yearly}, Risk skoru: ${fund.riskScore || '—'}/7. TEFAS verileri ve AI analizi.`
  return {
    title,
    description,
    alternates: { canonical: `https://fonar.com.tr/fon/${fund.code.toLowerCase()}` },
    openGraph: {
      title,
      description,
      url: `https://fonar.com.tr/fon/${fund.code.toLowerCase()}`,
      siteName: 'Fonar',
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: { card: 'summary', title, description },
  }
}

// fundsData already imported above

export function generateStaticParams() {
  return (fundsData as any[]).filter((f: any) => f.code).map((f: any) => ({ code: f.code.toLowerCase() }))
}

function fmt(v: number) {
  if (v >= 1e9) return `₺${(v/1e9).toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2})}B`
  if (v >= 1e6) return `₺${(v/1e6).toLocaleString('tr-TR', {minimumFractionDigits:1, maximumFractionDigits:1})}M`
  return `₺${v.toLocaleString('tr-TR')}`
}

function fmtPrice(v: number) {
  return v.toLocaleString('tr-TR', { minimumFractionDigits: 6, maximumFractionDigits: 6 })
}

function RiskGauge({ score }: { score: number }) {
  const pct = ((score || 0) / 7) * 100
  const color = score >= 6 ? '#ff4444' : score >= 4 ? '#ff9800' : '#00f080'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: '#444', letterSpacing: 0.5 }}>RİSK SKORU</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 18, fontWeight: 400, color }}>
          {score || '—'}<span style={{ fontSize: 12, color: '#444' }}>/7</span>
        </div>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 100,
          background: `linear-gradient(90deg, #00f080 0%, #ff9800 60%, #ff4444 100%)`,
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  )
}

export default async function FundPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const fund = (fundsData as any[]).find((f: any) => f.code?.toLowerCase() === code.toLowerCase())
  if (!fund) return (
    <main style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#555' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 16, marginBottom: 8, color: '#888' }}>Fon bulunamadı.</div>
        <a href="/" style={{ fontSize: 13, color: '#e8ff00' }}>← Tüm fonlara dön</a>
      </div>
    </main>
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: fund.name,
    description: `${fund.name} yatırım fonu. Risk skoru: ${fund.riskScore}/7. Yıllık getiri: ${fund.yearlyReturn?.toFixed(2)}%.`,
    url: `https://fonar.com.tr/fon/${fund.code.toLowerCase()}`,
    provider: { '@type': 'Organization', name: 'Fonar', url: 'https://fonar.com.tr' },
    priceCurrency: 'TRY',
    feesAndCommissionsSpecification: `Risk seviyesi: ${fund.riskScore}/7`,
    category: fund.fundType,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Yıllık Getiri', value: `${fund.yearlyReturn?.toFixed(2)}%` },
      { '@type': 'PropertyValue', name: 'Aylık Getiri', value: `${fund.monthlyReturn?.toFixed(2)}%` },
      { '@type': 'PropertyValue', name: 'Risk Skoru', value: `${fund.riskScore}/7` },
      { '@type': 'PropertyValue', name: 'Portföy Büyüklüğü', value: fund.totalValue },
    ]
  }

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>←</span> <span>Tüm Fonlar</span>
        </a>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 3 }}>FONAR</span>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#e8ff00', letterSpacing: 1, fontWeight: 500 }}>{fund.code}</span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px 60px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          {fund.fundType && <div style={{ fontSize: 11, color: '#555', letterSpacing: 1, marginBottom: 12 }}>{fund.fundType.toUpperCase()}</div>}
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 12 }}>{fund.name}</h1>
          {/* Son güncelleme - daha belirgin */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#00f080' }} />
            <span style={{ fontSize: 12, color: '#888', fontFamily: 'DM Mono, monospace' }}>Son güncelleme: {fund.latestDate}</span>
          </div>
        </div>

        {/* TEMEL BİLGİLER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 1 }}>
          {[
            { label: 'Pay Fiyatı', value: `${fund.unitPrice?.toLocaleString('tr-TR', {minimumFractionDigits: 6, maximumFractionDigits: 6})} ₺` },
            { label: 'Portföy', value: fund.totalValue ? fmt(fund.totalValue) : '—' },
            { label: 'Yatırımcı', value: fund.participantCount?.toLocaleString('tr-TR') || '—' },
          ].map(item => (
            <div key={item.label} style={{ background: '#0f0f0f', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, color: '#444', letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontWeight: 400, fontSize: 18, fontFamily: 'DM Mono, monospace' }}>{item.value}</div>
            </div>
          ))}
          {/* Risk - ayrı kart, daha belirgin */}
          <div style={{ background: '#0f0f0f', padding: '20px 24px' }}>
            <RiskGauge score={fund.riskScore} />
          </div>
        </div>

        {/* GETİRİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', margin: '1px 0 28px' }}>
          <div style={{ background: '#0f0f0f', padding: '20px 20px' }}>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>AYLIK GETİRİ</div>
            <div style={{ fontSize: 'clamp(24px, 6vw, 40px)', fontWeight: 300, fontFamily: 'DM Mono, monospace', letterSpacing: -1, color: fund.monthlyReturn == null ? '#333' : fund.monthlyReturn >= 0 ? '#00f080' : '#ff4444' }}>
              {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '20px 20px' }}>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>YILLIK GETİRİ</div>
            <div style={{ fontSize: 'clamp(24px, 6vw, 40px)', fontWeight: 300, fontFamily: 'DM Mono, monospace', letterSpacing: -1, color: fund.yearlyReturn == null ? '#333' : fund.yearlyReturn >= 0 ? '#00f080' : '#ff4444' }}>
              {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>

        {/* PORTFÖY DAĞILIMI */}
        {fund.portfolioItems?.length > 0 && <DonutChart items={fund.portfolioItems} />}

        {/* AI TESPİTLER */}
        {fund.aiInsights?.length > 0 && (
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ color: '#e8ff00', fontSize: 12 }}>✦</span>
              <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, fontWeight: 600 }}>AI TESPİTLERİ</div>
            </div>
            {fund.aiInsights.map((insight: string, i: number) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < fund.aiInsights.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 14, color: '#888', lineHeight: 1.7, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#e8ff00', flexShrink: 0, fontSize: 10, paddingTop: 4 }}>◆</span>
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* DEXTER */}
        {fund.dexterRecommendations?.length > 0 && (
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 20, fontWeight: 600 }}>DEXTER ANALİZİ</div>
            {fund.dexterRecommendations.map((rec: string, i: number) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < fund.dexterRecommendations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 14, color: '#888', lineHeight: 1.7, display: 'flex', gap: 12 }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#555', flexShrink: 0, paddingTop: 2 }}>0{i+1}</span>
                {rec}
              </div>
            ))}
          </div>
        )}

        {/* TWEET ÖZETİ */}
        {fund.twitterSummary && (
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 20, fontWeight: 600 }}>FON ÖZETİ</div>
            <pre style={{ color: '#666', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'DM Mono, monospace' }}>{fund.twitterSummary}</pre>
          </div>
        )}

        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: '#333', lineHeight: 1.8 }}>
          ⚠️ Bu sayfadaki bilgiler yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.
        </div>
      </div>
    </main>
  )
}
