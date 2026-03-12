'use client'
import { useEffect, useState } from 'react'

function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return val
}

export default function AnimatedStats({ fundCount, totalAum, avgReturn }: { fundCount: number, totalAum: number, avgReturn: number }) {
  const count = useCountUp(fundCount)
  const aum = useCountUp(Math.round(totalAum / 1e9 * 10) / 10 * 10, 2000)
  const ret = useCountUp(Math.round(avgReturn * 10) / 10 * 10, 2200)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tanıtım */}
      <div style={{ background: 'rgba(232,255,0,0.03)', border: '1px solid rgba(232,255,0,0.1)', borderRadius: 16, padding: '24px 28px' }}>
        <div style={{ fontSize: 11, color: '#e8ff00', letterSpacing: 1, fontWeight: 600, marginBottom: 12 }}>FONAR NEDİR?</div>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, margin: 0 }}>
          TEFAS ve KAP verilerini yapay zeka ile analiz eden bağımsız platform.
          Her fon için <span style={{ color: '#999' }}>risk skoru</span>, <span style={{ color: '#999' }}>getiri trendi</span> ve <span style={{ color: '#999' }}>portföy dağılımı</span> hesaplanır.
        </p>
        <a href="#fonlar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: '#e8ff00', color: '#080808', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
          Fonları İncele
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      {/* Animasyonlu sayaçlar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'Aktif Fon', value: count.toString(), color: '#00f080', suffix: '' },
          { label: 'Toplam AUM', value: (aum / 10).toFixed(1), color: '#e8ff00', suffix: 'B₺' },
          { label: 'Ort. Getiri', value: '+' + (ret / 10).toFixed(0), color: '#b388ff', suffix: '%' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color, fontFamily: 'DM Mono, monospace', letterSpacing: -1 }}>{s.value}{s.suffix}</div>
            <div style={{ fontSize: 10, color: '#444', marginTop: 4, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
