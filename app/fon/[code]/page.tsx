import fundsData from '../../../public/funds.json'

export function generateStaticParams() {
  return (fundsData as any[]).filter((f: any) => f.code).map((f: any) => ({ code: f.code.toLowerCase() }))
}

function fmt(v: number) {
  if (v >= 1e9) return `₺${(v/1e9).toFixed(2)}B`
  if (v >= 1e6) return `₺${(v/1e6).toFixed(1)}M`
  return `₺${v.toFixed(0)}`
}

export default async function FundPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const fund = (fundsData as any[]).find((f: any) => f.code?.toLowerCase() === code.toLowerCase())
  if (!fund) return <div style={{ color: '#f5f5f5', padding: 40 }}>Fon bulunamadı.</div>

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>← Tüm Fonlar</a>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#e8ff00', letterSpacing: 1, fontWeight: 500 }}>{fund.code}</span>
      </nav>

      <div style={{ paddingTop: 80, maxWidth: 900, margin: '0 auto', padding: '80px 40px 60px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 48 }}>
          {fund.fundType && <div style={{ fontSize: 11, color: '#555', letterSpacing: 1, marginBottom: 12 }}>{fund.fundType.toUpperCase()}</div>}
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 10 }}>{fund.name}</h1>
          <div style={{ fontSize: 12, color: '#444', fontFamily: 'DM Mono, monospace' }}>Son güncelleme: {fund.latestDate}</div>
        </div>

        {/* TEMEL BİLGİLER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 1 }}>
          {[
            { label: 'Pay Fiyatı', value: `${fund.unitPrice?.toFixed(6)} ₺` },
            { label: 'Portföy', value: fund.totalValue ? fmt(fund.totalValue) : '—' },
            { label: 'Yatırımcı', value: fund.participantCount?.toLocaleString('tr-TR') || '—' },
            { label: 'Risk', value: fund.riskScore ? `${fund.riskScore}/7` : '—' },
          ].map(item => (
            <div key={item.label} style={{ background: '#0f0f0f', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, color: '#444', letterSpacing: 0.5, marginBottom: 8 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontWeight: 400, fontSize: 18, fontFamily: 'DM Mono, monospace' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* GETİRİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', margin: '1px 0 32px' }}>
          <div style={{ background: '#0f0f0f', padding: '28px 32px' }}>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 12 }}>AYLIK GETİRİ</div>
            <div style={{ fontSize: 40, fontWeight: 300, fontFamily: 'DM Mono, monospace', letterSpacing: -1, color: fund.monthlyReturn == null ? '#333' : fund.monthlyReturn >= 0 ? '#00e676' : '#ff4444' }}>
              {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '28px 32px' }}>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 12 }}>YILLIK GETİRİ</div>
            <div style={{ fontSize: 40, fontWeight: 300, fontFamily: 'DM Mono, monospace', letterSpacing: -1, color: fund.yearlyReturn == null ? '#333' : fund.yearlyReturn >= 0 ? '#00e676' : '#ff4444' }}>
              {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>

        {/* PORTFÖY DAĞILIMI */}
        {fund.portfolioItems?.length > 0 && (
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 20 }}>PORTFÖY DAĞILIMI</div>
            {fund.portfolioItems.map((item: any, i: number) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#888' }}>{item.name}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#f5f5f5' }}>{item.value?.toFixed(1)}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${item.value}%`, background: 'rgba(232,255,0,0.6)', borderRadius: 2, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI TESPİTLER */}
        {fund.aiInsights?.length > 0 && (
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 20 }}>AI TESPİTLERİ</div>
            {fund.aiInsights.map((insight: string, i: number) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < fund.aiInsights.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 14, color: '#888', lineHeight: 1.7, display: 'flex', gap: 12 }}>
                <span style={{ color: '#e8ff00', flexShrink: 0 }}>→</span>
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* DEXTER */}
        {fund.dexterRecommendations?.length > 0 && (
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 20 }}>DEXTER ANALİZİ</div>
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
            <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 20 }}>FON ÖZETİ</div>
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
