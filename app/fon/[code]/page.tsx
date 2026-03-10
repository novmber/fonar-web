import fundsData from '../../../public/funds.json'

export function generateStaticParams() {
  return (fundsData as any[]).filter((f: any) => f.code).map((f: any) => ({ code: f.code.toLowerCase() }))
}

function fmt(v: number) {
  if (v >= 1e9) return `₺${(v/1e9).toFixed(2)}B`
  if (v >= 1e6) return `₺${(v/1e6).toFixed(1)}M`
  return `₺${v.toFixed(0)}`
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

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif' }}>

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
            { label: 'Pay Fiyatı', value: `${fund.unitPrice?.toFixed(6)} ₺` },
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
          <div style={{ background: '#0f0f0f', padding: '28px 32px' }}>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>AYLIK GETİRİ</div>
            <div style={{ fontSize: 40, fontWeight: 300, fontFamily: 'DM Mono, monospace', letterSpacing: -1, color: fund.monthlyReturn == null ? '#333' : fund.monthlyReturn >= 0 ? '#00f080' : '#ff4444' }}>
              {fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '28px 32px' }}>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>YILLIK GETİRİ</div>
            <div style={{ fontSize: 40, fontWeight: 300, fontFamily: 'DM Mono, monospace', letterSpacing: -1, color: fund.yearlyReturn == null ? '#333' : fund.yearlyReturn >= 0 ? '#00f080' : '#ff4444' }}>
              {fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>

        {/* PORTFÖY DAĞILIMI */}
        {fund.portfolioItems?.length > 0 && (() => {
          const COLORS = ['#e8ff00','#00f080','#00b8d4','#ff6b6b','#ff9800','#b388ff','#f06292','#80cbc4']
          const items = fund.portfolioItems
          const total = items.reduce((s: number, i: any) => s + (i.value || 0), 0)
          let cumAngle = -90
          const slices = items.map((item: any, idx: number) => {
            const pct = (item.value || 0) / total
            const startAngle = cumAngle
            cumAngle += pct * 360
            return { ...item, pct, startAngle, endAngle: cumAngle, color: COLORS[idx % COLORS.length] }
          })
          const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
            const rad = (deg * Math.PI) / 180
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
          }
          const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
            const s = polarToCartesian(cx, cy, r, start)
            const e = polarToCartesian(cx, cy, r, end)
            const large = end - start > 180 ? 1 : 0
            return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
          }
          return (
            <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 24, fontWeight: 600 }}>PORTFÖY DAĞILIMI</div>
              {/* Mobilde dikey, masaüstünde yatay */}
              <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
                <svg width={180} height={180} viewBox="0 0 180 180" style={{ flexShrink: 0 }}>
                  {slices.map((slice: any, i: number) => (
                    <path key={i} d={describeArc(90, 90, 80, slice.startAngle, slice.endAngle - 0.3)} fill={slice.color} opacity={0.85} />
                  ))}
                  <circle cx={90} cy={90} r={48} fill="#0f0f0f" />
                  <text x={90} y={85} textAnchor="middle" fill="#555" fontSize={10} fontFamily="DM Mono, monospace">{items.length} varlık</text>
                  <text x={90} y={100} textAnchor="middle" fill="#888" fontSize={11} fontFamily="DM Mono, monospace">{slices[0]?.value?.toFixed(1)}%</text>
                </svg>
                <div style={{ flex: 1, minWidth: 200 }}>
                  {slices.map((slice: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: slice.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 13, color: '#888' }}>{slice.name}</div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#f5f5f5' }}>{slice.value?.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

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
