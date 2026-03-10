import fs from 'fs'
import path from 'path'

function getFunds() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'funds.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export default function Home() {
  const funds = getFunds()

  return (
    <main style={{ minHeight: '100vh', background: '#020817', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#00C2A8,#118AB2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📊</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Fonar</div>
            <div style={{ color: '#475569', fontSize: 12 }}>Fon Analiz Platformu</div>
          </div>
        </div>
        <div style={{ color: '#475569', fontSize: 12 }}>{funds.length} fon takipte</div>
      </header>

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Fon Analizleri</h1>
        <p style={{ color: '#475569', marginBottom: 32, fontSize: 14 }}>Detaylı AI analizi yapılmış yatırım fonları</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {funds.map((fund: any) => (
            <a key={fund.code} href={`/fon/${fund.code.toLowerCase()}`}
              style={{ textDecoration: 'none', display: 'block', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ background: 'rgba(0,194,168,0.1)', color: '#00C2A8', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{fund.code}</span>
                  <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14, marginTop: 8, lineHeight: 1.4 }}>{fund.name}</div>
                </div>
                <span style={{ color: '#475569', fontSize: 11, whiteSpace: 'nowrap', marginLeft: 8 }}>Risk {fund.riskScore}/7</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
                <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ color: '#475569', fontSize: 10, marginBottom: 4 }}>AYLIK</div>
                  <div style={{ color: fund.monthlyReturn >= 0 ? '#00C2A8' : '#FF6B6B', fontWeight: 700, fontSize: 15 }}>
                    {fund.monthlyReturn >= 0 ? '+' : ''}{fund.monthlyReturn?.toFixed(2)}%
                  </div>
                </div>
                <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ color: '#475569', fontSize: 10, marginBottom: 4 }}>YILLIK</div>
                  <div style={{ color: fund.yearlyReturn >= 0 ? '#00C2A8' : '#FF6B6B', fontWeight: 700, fontSize: 15 }}>
                    {fund.yearlyReturn >= 0 ? '+' : ''}{fund.yearlyReturn?.toFixed(2)}%
                  </div>
                </div>
                <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ color: '#475569', fontSize: 10, marginBottom: 4 }}>PORTFÖY</div>
                  <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>
                    {fund.totalValue >= 1e9 ? `₺${(fund.totalValue/1e9).toFixed(1)}B` : `₺${(fund.totalValue/1e6).toFixed(0)}M`}
                  </div>
                </div>
              </div>
              {fund.aiInsights?.[0] && (
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(0,194,168,0.05)', borderRadius: 10, border: '1px solid rgba(0,194,168,0.1)', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                  💡 {fund.aiInsights[0]}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid #1e293b', padding: '20px 40px', marginTop: 40, textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 11, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
          ⚠️ <strong style={{ color: '#64748b' }}>Sorumluluk Reddi:</strong> Bu platformda yer alan tüm bilgiler yalnızca bilgilendirme amaçlıdır. 
          Hiçbir içerik yatırım tavsiyesi niteliği taşımaz. Geçmiş performans gelecekteki getirilerin garantisi değildir.
        </p>
      </footer>
    </main>
  )
}
