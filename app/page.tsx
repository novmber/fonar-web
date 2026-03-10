'use client'
import fundsData from '../public/funds.json'
import { useState } from 'react'

function fmt(v: number) {
  if (v >= 1e9) return `₺${(v/1e9).toFixed(1)}B`
  if (v >= 1e6) return `₺${(v/1e6).toFixed(0)}M`
  return `₺${v.toFixed(0)}`
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 6 ? '#ff4444' : score >= 4 ? '#ff9800' : '#00f080'
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Risk</div>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{
            width: 4, height: 14, borderRadius: 2,
            background: i < (score || 0) ? color : 'var(--border2)',
            transition: 'background 0.2s'
          }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 4, fontFamily: 'DM Mono, monospace' }}>{score}/7</span>
      </div>
    </div>
  )
}

export default function Home() {
  const funds: any[] = fundsData
  const totalAum = funds.reduce((s, f) => s + (f.totalValue || 0), 0)
  const avgReturn = funds.filter(f => f.yearlyReturn).reduce((s, f) => s + f.yearlyReturn, 0) / funds.filter(f => f.yearlyReturn).length

  const [search, setSearch] = useState('')
  const [fundType, setFundType] = useState('')
  const [risk, setRisk] = useState('')
  const [sort, setSort] = useState('')

  const fundTypes = [...new Set(funds.map(f => f.fundType).filter(Boolean))]

  let filtered = funds.filter(f => {
    if (search && !f.code?.toLowerCase().includes(search.toLowerCase()) && !f.name?.toLowerCase().includes(search.toLowerCase())) return false
    if (fundType && f.fundType !== fundType) return false
    if (risk && f.riskScore !== parseInt(risk)) return false
    return true
  })

  if (sort === 'monthly') filtered = [...filtered].sort((a, b) => (b.monthlyReturn || -999) - (a.monthlyReturn || -999))
  if (sort === 'yearly') filtered = [...filtered].sort((a, b) => (b.yearlyReturn || -999) - (a.yearlyReturn || -999))
  if (sort === 'risk_asc') filtered = [...filtered].sort((a, b) => (a.riskScore || 0) - (b.riskScore || 0))
  if (sort === 'risk_desc') filtered = [...filtered].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))

  const hasFilters = search || fundType || risk || sort

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAV */}
      <nav className="nav-padding" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid var(--border)', background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 3, color: 'var(--text)' }}>FONAR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 13, color: 'var(--text2)' }}>
          <span>{funds.length} fon</span>
          <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
            Canlı
          </span>
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
      <section className="hero-section" style={{ padding: '80px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent2)', border: '1px solid rgba(232,255,0,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginBottom: 28, letterSpacing: 0.5 }}>
          ✦ YAPAY ZEKA DESTEKLİ ANALİZ
        </div>
        <h1 className="fade-up-2 hero-h1" style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 24, color: 'var(--text)' }}>
          Karar vermeden önce,<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>analiz et.</em>
        </h1>
        <p className="fade-up-3" style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 420, lineHeight: 1.7, marginBottom: 48 }}>
          KAP raporları ve TEFAS verileriyle beslenen AI analizleri. Her fon için derinlemesine içgörü.
        </p>

        {/* STATS */}
        <div className="fade-up-4 stats-bar" style={{ display: 'flex', gap: 1, background: 'var(--border)', borderRadius: 16, overflow: 'hidden', maxWidth: 560 }}>
          {[
            { label: 'Analiz Edilen Fon', value: funds.length.toString() },
            { label: 'Toplam AUM', value: fmt(totalAum) },
            { label: 'Ort. Yıllık Getiri', value: `+${avgReturn?.toFixed(1)}%` },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--bg3)', padding: '18px 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.5, fontFamily: 'DM Mono, monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--border)', maxWidth: 1200, margin: '0 auto' }} />

      {/* FİLTRELEME */}
      <section className="filter-section" style={{ padding: '32px 40px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div className="filter-bar" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Fon kodu veya isim ara..."
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: 'var(--text)', outline: 'none', width: 220, fontFamily: 'DM Sans, sans-serif' }}
          />
          <select value={fundType} onChange={e => setFundType(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: fundType ? 'var(--text)' : 'var(--text3)', outline: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <option value="">Tüm Türler</option>
            {fundTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={risk} onChange={e => setRisk(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: risk ? 'var(--text)' : 'var(--text3)', outline: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <option value="">Tüm Riskler</option>
            {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>Risk {r}/7</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: sort ? 'var(--text)' : 'var(--text3)', outline: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <option value="">Sırala</option>
            <option value="monthly">Aylık Getiri ↓</option>
            <option value="yearly">Yıllık Getiri ↓</option>
            <option value="risk_asc">Risk ↑</option>
            <option value="risk_desc">Risk ↓</option>
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setFundType(''); setRisk(''); setSort('') }}
              style={{ background: 'transparent', border: '1px solid var(--border2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'var(--text3)', cursor: 'pointer' }}>
              ✕ Temizle
            </button>
          )}
          <span className="filter-count" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{filtered.length} fon</span>
        </div>
      </section>

      {/* FUNDS */}
      <section className="funds-section" style={{ padding: '24px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Sonuç bulunamadı.</div>
            <div style={{ color: 'var(--text3)', fontSize: 12 }}>Filtrelerinizi değiştirerek tekrar deneyin.</div>
          </div>
        ) : (
          <div className="funds-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 1, background: 'var(--bg)', borderRadius: 20, overflow: 'hidden' }}>
            {filtered.map((fund: any) => (
              <a key={fund.code} href={`/fon/${fund.code?.toLowerCase()}`}
                className="fund-card"
                style={{ background: 'var(--bg2)', padding: '28px 32px', display: 'block', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--bg3)')}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--bg2)')}>

                {/* Kart Başlık */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginBottom: 6, letterSpacing: 1 }}>{fund.code}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)', maxWidth: 220 }}>{fund.name}</div>
                    {fund.fundType && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{fund.fundType}</div>}
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 12 }}>
                    <RiskBar score={fund.riskScore || 0} />
                  </div>
                </div>

                {/* Metrikler */}
                <div className="fund-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>AYLIK</div>
                    <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: fund.monthlyReturn == null ? 'var(--text3)' : fund.monthlyReturn >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>YILLIK</div>
                    <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: fund.yearlyReturn == null ? 'var(--text3)' : fund.yearlyReturn >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
                    </div>
                  </div>
                  <div className="fund-metrics-portfolio">
                    <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>PORTFÖY</div>
                    <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>
                      {fund.totalValue ? fmt(fund.totalValue) : '—'}
                    </div>
                  </div>
                </div>

                {fund.aiInsights?.[0] && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: 10, paddingTop: 2 }}>✦</span>
                    <span>{fund.aiInsights[0]}</span>
                  </div>
                )}
                <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text3)', display: 'flex', justifyContent: 'flex-end' }}>→</div>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text3)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
          ⚠️ Bu platformdaki içerikler yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.
          Geçmiş performans gelecekteki getirilerin garantisi değildir.
        </p>
      </footer>
    </main>
  )
}
