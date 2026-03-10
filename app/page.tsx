import fundsData from '../public/funds.json'

function fmt(v: number) {
  if (v >= 1e9) return `₺${(v/1e9).toFixed(1)}B`
  if (v >= 1e6) return `₺${(v/1e6).toFixed(0)}M`
  return `₺${v.toFixed(0)}`
}

export default function Home() {
  const funds: any[] = fundsData
  const totalAum = funds.reduce((s, f) => s + (f.totalValue || 0), 0)
  const avgReturn = funds.filter(f => f.yearlyReturn).reduce((s, f) => s + f.yearlyReturn, 0) / funds.filter(f => f.yearlyReturn).length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid var(--border)', background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📊</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: -0.3 }}>fonar</span>
        </div>
        <div style={{ display: 'flex', align: 'center', gap: 32, fontSize: 13, color: 'var(--text2)' }}>
          <span>{funds.length} fon</span>
          <span style={{ color: 'var(--green)' }}>● Canlı</span>
        </div>
      </nav>

      {/* TICKER */}
      <div style={{ marginTop: 56, borderBottom: '1px solid var(--border)', background: 'var(--bg2)', overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap' }}>
          {[...funds, ...funds].map((f, i) => (
            <span key={i} style={{ padding: '0 32px', fontSize: 12, color: 'var(--text2)', borderRight: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 10, height: 36 }}>
              <span style={{ color: 'var(--text)', fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: 11 }}>{f.code}</span>
              {f.monthlyReturn != null && (
                <span style={{ color: f.monthlyReturn >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                  {f.monthlyReturn >= 0 ? '+' : ''}{f.monthlyReturn?.toFixed(2)}%
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: '80px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent2)', border: '1px solid rgba(232,255,0,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginBottom: 28, letterSpacing: 0.5 }}>
          ✦ YAPAY ZEKA DESTEKLİ ANALİZ
        </div>
        <h1 className="fade-up-2" style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, color: 'var(--text)' }}>
          Fonları gerçekten<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>anlayan</em> platform.
        </h1>
        <p className="fade-up-3" style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
          KAP raporları ve TEFAS verileriyle beslenen AI analizleri. Her fon için derinlemesine içgörü.
        </p>

        {/* STATS ROW */}
        <div className="fade-up-4" style={{ display: 'flex', gap: 1, background: 'var(--border)', borderRadius: 16, overflow: 'hidden', maxWidth: 600 }}>
          {[
            { label: 'Analiz Edilen Fon', value: funds.length.toString() },
            { label: 'Toplam AUM', value: fmt(totalAum) },
            { label: 'Ort. Yıllık Getiri', value: `+${avgReturn?.toFixed(1)}%` },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--bg3)', padding: '20px 24px' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, fontFamily: 'DM Mono, monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ height: 1, background: 'var(--border)', maxWidth: 1200, margin: '0 auto' }} />

      {/* FUNDS */}
      <section style={{ padding: '60px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, color: 'var(--text3)', letterSpacing: 1 }}>YAYINLANAN ANALİZLER</h2>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{funds.length} fon</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 1, background: 'var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {funds.map((fund: any) => (
            <a key={fund.code} href={`/fon/${fund.code?.toLowerCase()}`}
              style={{ background: 'var(--bg2)', padding: '28px 32px', display: 'block', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseOut={e => (e.currentTarget.style.background = 'var(--bg2)')}>

              {/* TOP ROW */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginBottom: 8, letterSpacing: 1 }}>{fund.code}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)', maxWidth: 240 }}>{fund.name}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Risk</div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 7 }, (_, i) => (
                      <div key={i} style={{ width: 4, height: 14, borderRadius: 2, background: i < (fund.riskScore || 0) ? (fund.riskScore >= 6 ? 'var(--red)' : fund.riskScore >= 4 ? '#ff9800' : 'var(--green)') : 'var(--border2)' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* METRICS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4 }}>AYLIK</div>
                  <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: fund.monthlyReturn == null ? 'var(--text3)' : fund.monthlyReturn >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4 }}>YILLIK</div>
                  <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: fund.yearlyReturn == null ? 'var(--text3)' : fund.yearlyReturn >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4 }}>PORTFÖY</div>
                  <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>
                    {fund.totalValue ? fmt(fund.totalValue) : '—'}
                  </div>
                </div>
              </div>

              {/* AI INSIGHT */}
              {fund.aiInsights?.[0] && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  {fund.aiInsights[0]}
                </div>
              )}

              {/* ARROW */}
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text3)', display: 'flex', justifyContent: 'flex-end' }}>→</div>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text3)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
          ⚠️ Bu platformdaki içerikler yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir. 
          Geçmiş performans gelecekteki getirilerin garantisi değildir.
        </p>
      </footer>
    </main>
  )
}
