import fundsData from '../../../public/funds.json'

export function generateStaticParams() {
  return (fundsData as any[])
    .filter((f: any) => f.code)
    .map((f: any) => ({ code: f.code.toLowerCase() }))
}

export default async function FundPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const fund = (fundsData as any[]).find((f: any) => f.code?.toLowerCase() === code?.toLowerCase())
  if (!fund) return <div style={{ color: '#f1f5f9', padding: 40 }}>Fon bulunamadı.</div>

  return (
    <main style={{ minHeight: '100vh', background: '#020817', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', padding: '20px 40px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }}>← Tüm Fonlar</a>
        <span style={{ background: 'rgba(0,194,168,0.1)', color: '#00C2A8', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>{fund.code}</span>
      </header>

      <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{fund.name}</h1>
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 28 }}>Son güncelleme: {fund.latestDate}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Pay Fiyatı', value: `${fund.unitPrice?.toFixed(6)} ₺` },
            { label: 'Portföy', value: fund.totalValue >= 1e9 ? `₺${(fund.totalValue/1e9).toFixed(2)}B` : `₺${(fund.totalValue/1e6).toFixed(1)}M` },
            { label: 'Yatırımcı', value: fund.participantCount?.toLocaleString('tr-TR') },
            { label: 'Risk', value: fund.riskScore ? `${fund.riskScore}/7` : '—' },
          ].map(item => (
            <div key={item.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 6 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ color: '#475569', fontSize: 11, marginBottom: 8 }}>AYLIK GETİRİ</div>
            <div style={{ color: (fund.monthlyReturn ?? 0) >= 0 ? '#00C2A8' : '#FF6B6B', fontWeight: 800, fontSize: 32 }}>
              {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ color: '#475569', fontSize: 11, marginBottom: 8 }}>YILLIK GETİRİ</div>
            <div style={{ color: (fund.yearlyReturn ?? 0) >= 0 ? '#00C2A8' : '#FF6B6B', fontWeight: 800, fontSize: 32 }}>
              {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>

        {fund.aiInsights?.length > 0 && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#00C2A8' }}>💡 AI Tespitleri</h2>
            {fund.aiInsights.map((insight: string, i: number) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < fund.aiInsights.length - 1 ? '1px solid #1e293b' : 'none', fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>• {insight}</div>
            ))}
          </div>
        )}

        {fund.dexterRecommendations?.length > 0 && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#FFD166' }}>🤖 Dexter Analizi</h2>
            {fund.dexterRecommendations.map((rec: string, i: number) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < fund.dexterRecommendations.length - 1 ? '1px solid #1e293b' : 'none', fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>{i + 1}. {rec}</div>
            ))}
          </div>
        )}

        {fund.twitterSummary && (
          <div style={{ background: '#0a0a0a', border: '1px solid #2f3336', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#f1f5f9' }}>𝕏 Fon Özeti</h2>
            <pre style={{ color: '#e7e9ea', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'system-ui' }}>{fund.twitterSummary}</pre>
          </div>
        )}

        <p style={{ color: '#475569', fontSize: 11, lineHeight: 1.6, marginTop: 32, padding: '16px 0', borderTop: '1px solid #1e293b' }}>
          ⚠️ Bu sayfadaki bilgiler yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.
        </p>
      </div>
    </main>
  )
}
