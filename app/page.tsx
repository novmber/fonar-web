'use client'
import fundsData from '../public/funds.json'
import AnimatedStats from './AnimatedStats'
import { useState } from 'react'

function fmt(v: number) {
  if (v >= 1e9) return `₺${(v/1e9).toFixed(1)}B`
  if (v >= 1e6) return `₺${(v/1e6).toFixed(0)}M`
  return `₺${v.toFixed(0)}`
}

function RiskBadge({ score }: { score: number }) {
  const color = score >= 6 ? '#ff4444' : score >= 4 ? '#ff9800' : '#00f080'
  const bg = score >= 6 ? 'rgba(255,68,68,0.12)' : score >= 4 ? 'rgba(255,152,0,0.12)' : 'rgba(0,240,128,0.12)'
  const label = score >= 6 ? 'Yüksek' : score >= 4 ? 'Orta' : 'Düşük'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{ width: 4, height: 12, borderRadius: 2, background: i < score ? color : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <div style={{ fontSize: 10, color, background: bg, borderRadius: 6, padding: '2px 7px', fontWeight: 600, letterSpacing: 0.3 }}>
        {label} · {score}/7
      </div>
    </div>
  )
}

function Sparkline({ history, color }: { history: any[], color: string }) {
  if (!history || history.length < 2) return null
  const prices = history.map((h: any) => h.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const w = 120, h = 40
  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  )
}

export default function Home() {
  const funds: any[] = fundsData
  const totalAum = funds.reduce((s, f) => s + (f.totalValue || 0), 0)
  const avgReturn = funds.filter(f => f.yearlyReturn).reduce((s, f) => s + f.yearlyReturn, 0) / funds.filter(f => f.yearlyReturn).length
  const bestFund = funds.filter(f => f.yearlyReturn).sort((a, b) => b.yearlyReturn - a.yearlyReturn)[0]
  const lowestRiskFund = funds.filter(f => f.riskScore).sort((a, b) => a.riskScore - b.riskScore)[0]
  const positiveFunds = funds.filter(f => f.monthlyReturn != null && f.monthlyReturn > 0).length
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
  const biggestFund = funds.filter(f => f.totalValue).sort((a, b) => b.totalValue - a.totalValue)[0]
  const bestMonthlyFund = funds.filter(f => f.monthlyReturn).sort((a, b) => b.monthlyReturn - a.monthlyReturn)[0]
  const highestRiskFund = funds.filter(f => f.riskScore).sort((a, b) => b.riskScore - a.riskScore)[0]
  const mostStableFund = funds.filter(f => f.priceHistory && f.priceHistory.length > 1).sort((a, b) => {
    const negA = (a.priceHistory || []).filter((_: any, i: number, arr: any[]) => i > 0 && arr[i].price < arr[i-1].price).length
    const negB = (b.priceHistory || []).filter((_: any, i: number, arr: any[]) => i > 0 && arr[i].price < arr[i-1].price).length
    return negA - negB
  })[0] || funds.filter(f => f.riskScore).sort((a, b) => a.riskScore - b.riskScore)[0]

  const [search, setSearch] = useState('')
  const [fundType, setFundType] = useState('')
  const [risk, setRisk] = useState('')
  const [sort, setSort] = useState('')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

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
      <nav className="nav-padding" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid var(--border)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', height: 56 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 5%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 3 }}>FONAR</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: 'var(--text2)' }}>
            <a href="https://x.com/GridBotman" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text2)')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @GridBotman
            </a>
            <span>{funds.length} fon</span>
            <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
              Canlı
            </span>
          </div>
        </div>
      </nav>

      {/* TICKER — tıklanabilir */}
      <div style={{ marginTop: 56, borderBottom: '1px solid var(--border)', background: 'var(--bg2)', overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div className='ticker-wrapper' style={{ display: 'flex', animation: 'ticker 80s linear infinite', whiteSpace: 'nowrap' }}>
          {[...funds, ...funds].map((f, i) => (
            <a key={i} href={`/fon/${f.code?.toLowerCase()}`}
              style={{ padding: '0 28px', fontSize: 12, color: 'var(--text2)', borderRight: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 10, height: 36, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(232,255,0,0.07)'
                e.currentTarget.style.borderBottom = '2px solid rgba(232,255,0,0.4)'
                const parent = e.currentTarget.closest('.ticker-wrapper') as HTMLElement
                if (parent) parent.style.animationPlayState = 'paused'
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderBottom = 'none'
                const parent = e.currentTarget.closest('.ticker-wrapper') as HTMLElement
                if (parent) parent.style.animationPlayState = 'running'
              }}>
              <span style={{ color: 'var(--text)', fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: 11 }}>{f.code}</span>
              {f.monthlyReturn != null && (
                <span style={{ color: f.monthlyReturn >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                  {f.monthlyReturn >= 0 ? '+' : ''}{f.monthlyReturn?.toFixed(2)}%
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero-section" style={{ padding: '40px 5% 32px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        <div>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent2)', border: '1px solid rgba(232,255,0,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginBottom: 28, letterSpacing: 0.5 }}>
          ✦ YAPAY ZEKA DESTEKLİ ANALİZ
        </div>
        <h1 className="fade-up-2 hero-h1" style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16 }}>
          Karar vermeden önce,<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>analiz et.</em>
        </h1>
        <p className="fade-up-3" style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 420, lineHeight: 1.7, marginBottom: 28 }}>
          KAP raporları ve TEFAS verileriyle beslenen AI analizleri. Her fon için derinlemesine içgörü.
        </p>
        <div className="fade-up-4 stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
          <a href={`/fon/${bestFund?.code?.toLowerCase()}`} style={{ textDecoration: 'none', background: 'rgba(232,255,0,0.04)', border: '1px solid rgba(232,255,0,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(232,255,0,0.4)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(232,255,0,0.15)')}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>EN İYİ YILLIK GETİRİ</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--accent)', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>+{bestFund?.yearlyReturn?.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{bestFund?.code} · {bestFund?.name?.split(' ').slice(0,3).join(' ')}</div>
          </a>
          <div style={{ background: 'rgba(0,240,128,0.04)', border: '1px solid rgba(0,240,128,0.12)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>BU AY POZİTİF</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--green)', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{positiveFunds}/{funds.length} fon</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>aylık getiri pozitif</div>
          </div>
          <a href={`/fon/${lowestRiskFund?.code?.toLowerCase()}`} style={{ textDecoration: 'none', background: 'rgba(58,134,255,0.04)', border: '1px solid rgba(58,134,255,0.12)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(58,134,255,0.35)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(58,134,255,0.12)')}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>EN DÜŞÜK RİSK</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#3A86FF', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{lowestRiskFund?.riskScore}/7</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{lowestRiskFund?.code} · {lowestRiskFund?.fundType?.split(' ').slice(0,2).join(' ')}</div>
          </a>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>SON GÜNCELLEME</div>
            <div style={{ fontSize: 16, fontWeight: 500, fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{today}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--green)' }}>
              <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
              TEFAS canlı veri
            </div>
          </div>

          <a href={`/fon/${biggestFund?.code?.toLowerCase()}`} style={{ textDecoration: 'none', background: 'rgba(255,152,0,0.04)', border: '1px solid rgba(255,152,0,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(255,152,0,0.4)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,152,0,0.15)')}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>EN BÜYÜK FON</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#ff9800', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{fmt(biggestFund?.totalValue)}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{biggestFund?.code} · {biggestFund?.name?.split(' ').slice(0,3).join(' ')}</div>
          </a>

          <a href={`/fon/${bestMonthlyFund?.code?.toLowerCase()}`} style={{ textDecoration: 'none', background: 'rgba(131,56,236,0.04)', border: '1px solid rgba(131,56,236,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(131,56,236,0.4)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(131,56,236,0.15)')}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>BU AY EN İYİ</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#8338EC', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{bestMonthlyFund?.monthlyReturn >= 0 ? '+' : ''}{bestMonthlyFund?.monthlyReturn?.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{bestMonthlyFund?.code} · {bestMonthlyFund?.name?.split(' ').slice(0,3).join(' ')}</div>
          </a>

          <a href={`/fon/${highestRiskFund?.code?.toLowerCase()}`} style={{ textDecoration: 'none', background: 'rgba(255,68,68,0.04)', border: '1px solid rgba(255,68,68,0.12)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(255,68,68,0.35)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,68,68,0.12)')}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>EN YÜKSEK RİSK</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#ff4444', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{highestRiskFund?.riskScore}/7</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{highestRiskFund?.code} · {highestRiskFund?.fundType || highestRiskFund?.name?.split(' ').slice(0,2).join(' ')}</div>
          </a>

          <a href={`/fon/${mostStableFund?.code?.toLowerCase()}`} style={{ textDecoration: 'none', background: 'rgba(0,184,212,0.04)', border: '1px solid rgba(0,184,212,0.12)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(0,184,212,0.4)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(0,184,212,0.12)')}>
            <div style={{ fontSize: 10, color: '#777', letterSpacing: 0.8, fontWeight: 600 }}>EN İSTİKRARLI</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#00b8d4', fontFamily: 'DM Mono, monospace', letterSpacing: -0.5 }}>{mostStableFund?.code}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{mostStableFund?.fundType?.split(' ').slice(0,2).join(' ')} · risk {mostStableFund?.riskScore}/7</div>
          </a>
        </div>
      </div>
      <AnimatedStats fundCount={funds.length} totalAum={totalAum} avgReturn={avgReturn} />
      </div>
      </section>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* FİLTRELEME */}
      <section className="filter-section" style={{ padding: '28px 5% 16px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="filter-bar" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Fon kodu veya isim ara..."
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: 'var(--text)', outline: 'none', width: 220, fontFamily: 'DM Sans, sans-serif' }} />
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
      <section className="funds-section" style={{ padding: '20px 5% 60px', maxWidth: 1400, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Sonuç bulunamadı.</div>
            <div style={{ color: 'var(--text3)', fontSize: 12 }}>Filtrelerinizi değiştirerek tekrar deneyin.</div>
          </div>
        ) : (
          <div className="funds-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, borderRadius: 20 }}>
            {filtered.map((fund: any) => {
              const isHovered = hoveredCard === fund.code
              const yearColor = fund.yearlyReturn == null ? 'var(--text3)' : fund.yearlyReturn >= 0 ? 'var(--green)' : 'var(--red)'
              const monthColor = fund.monthlyReturn == null ? 'var(--text3)' : fund.monthlyReturn >= 0 ? 'var(--green)' : 'var(--red)'
              return (
                <a key={fund.code}
                  href={`/fon/${fund.code?.toLowerCase()}`}
                  onMouseEnter={() => setHoveredCard(fund.code)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: 'var(--bg2)',
                    border: isHovered ? '1px solid rgba(232,255,0,0.2)' : '1px solid var(--border)',
                    borderRadius: 16,
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 12px 40px rgba(0,0,0,0.5)' : 'none',
                    textDecoration: 'none',
                  }}>

                  {/* Üst: kod + isim + risk */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginBottom: 6, letterSpacing: 1 }}>{fund.code}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)', maxWidth: 200 }}>{fund.name}</div>
                      {fund.fundType && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{fund.fundType}</div>}
                    </div>
                    <div style={{ flexShrink: 0, marginLeft: 12 }}>
                      <RiskBadge score={fund.riskScore || 0} />
                    </div>
                  </div>

                  {/* Yıllık getiri — büyük, odak nokta */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>YILLIK GETİRİ</div>
                    <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'DM Mono, monospace', letterSpacing: -0.5, color: yearColor, lineHeight: 1 }}>
                      {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
                    </div>
                  </div>

                  {/* Sparkline + Aylık/Portföy */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 3, fontWeight: 600 }}>AYLIK</div>
                        <div style={{ fontSize: 14, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: monthColor }}>
                          {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 3, fontWeight: 600 }}>PORTFÖY</div>
                        <div style={{ fontSize: 14, fontWeight: 500, fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>
                          {fund.totalValue ? fmt(fund.totalValue) : '—'}
                        </div>
                      </div>
                    </div>
                    {/* Sparkline */}
                    {fund.priceHistory?.length > 2 && (
                      <div style={{ opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                        <Sparkline history={fund.priceHistory} color={fund.yearlyReturn >= 0 ? '#00f080' : '#ff4444'} />
                      </div>
                    )}
                  </div>

                  {/* AI insight */}
                  {fund.aiInsights?.[0] && (
                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 12, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: 10, paddingTop: 2 }}>✦</span>
                      <span>{fund.aiInsights[0]}</span>
                    </div>
                  )}
                  <div style={{ marginTop: 12, fontSize: 12, color: isHovered ? 'var(--accent)' : 'var(--text3)', display: 'flex', justifyContent: 'flex-end', transition: 'color 0.2s' }}>→</div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text3)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
          ⚠️ Bu platformdaki içerikler yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.
          Geçmiş performans gelecekteki getirilerin garantisi değildir.
        </p>
      </footer>
      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', marginTop: 80, padding: '32px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 3, marginBottom: 6 }}>FONAR</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', maxWidth: 340, lineHeight: 1.6 }}>
              Yapay zeka destekli yatırım fonu analiz platformu. TEFAS ve KAP verilerine dayalı içgörüler.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <a href="https://x.com/GridBotman" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text2)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text2)')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @GridBotman
            </a>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              Bu platform yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
