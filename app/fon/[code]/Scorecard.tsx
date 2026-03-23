'use client'

import { useEffect, useRef, useState } from 'react'

interface ScorecardDetails {
  volatilite?: number
  maxDrawdown?: number
  benchmarkWinRate?: number
  riskPenalty?: number
  rsi?: number
  rsiYorum?: string
}

interface ScorecardData {
  overall?: number
  grade?: string
  istikrar?: number
  yonetim?: number
  zamanlama?: number
  details?: ScorecardDetails
}

interface Props {
  scorecard: ScorecardData
  fundCode: string
}

function gradeColor(grade: string): string {
  if (grade.startsWith('A')) return '#00f080'
  if (grade.startsWith('B')) return '#7fff4f'
  if (grade.startsWith('C')) return '#e8ff00'
  if (grade.startsWith('D')) return '#ff9800'
  return '#ff4444'
}

function AnimatedNumber({ target, decimals = 1, duration = 1200 }: { target: number; decimals?: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(target * ease)
      if (t < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])

  return <>{val.toFixed(decimals)}</>
}

function ArcGauge({ value, size = 120, stroke = 8, color }: { value: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  // Arc: 225° start → 315° sweep (270° total)
  const startAngle = 225
  const sweepAngle = 270
  const pct = Math.min(Math.max(value, 0), 100) / 100

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcX = (angle: number) => cx + r * Math.cos(toRad(angle))
  const arcY = (angle: number) => cy + r * Math.sin(toRad(angle))

  const endAngle = startAngle + sweepAngle
  const filledEnd = startAngle + sweepAngle * pct

  // Background arc path
  const bgPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 1 1 ${arcX(endAngle - 0.001)} ${arcY(endAngle - 0.001)}`

  // Filled arc path
  const largeArc = sweepAngle * pct > 180 ? 1 : 0
  const fgPath = pct > 0
    ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${largeArc} 1 ${arcX(filledEnd)} ${arcY(filledEnd)}`
    : ''

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <path d={bgPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} strokeLinecap="round" />
      {fgPath && (
        <path d={fgPath} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }} />
      )}
    </svg>
  )
}

function SubBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#555', letterSpacing: 0.5, fontWeight: 600 }}>{label.toUpperCase()}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color }}>
          <AnimatedNumber target={value} />
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: 100,
          boxShadow: `0 0 8px ${color}55`,
          transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
    </div>
  )
}

function DetailPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? 'rgba(232,255,0,0.05)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${highlight ? 'rgba(232,255,0,0.15)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 10,
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    }}>
      <div style={{ fontSize: 10, color: '#444', letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: highlight ? '#e8ff00' : '#888' }}>{value}</div>
    </div>
  )
}

export default function Scorecard({ scorecard, fundCode }: Props) {
  const { overall = 0, grade = '—', istikrar = 0, yonetim = 0, zamanlama = 0, details = {} } = scorecard
  const color = gradeColor(grade)

  const subBars = [
    { label: 'İstikrar', value: istikrar, color: '#00f080' },
    { label: 'Yönetim', value: yonetim, color: '#7fff4f' },
    { label: 'Zamanlama', value: zamanlama, color: '#e8ff00' },
  ]

  const pills = [
    details.volatilite != null && { label: 'Volatilite', value: `${details.volatilite.toFixed(2)}%`, highlight: false },
    details.maxDrawdown != null && { label: 'Max Drawdown', value: `${details.maxDrawdown.toFixed(2)}%`, highlight: false },
    details.benchmarkWinRate != null && { label: 'Benchmark Win', value: `${details.benchmarkWinRate.toFixed(1)}%`, highlight: true },
    details.rsi != null && { label: 'RSI', value: `${details.rsi.toFixed(1)}`, highlight: false },
    details.rsiYorum && { label: 'RSI Yorum', value: details.rsiYorum, highlight: true },
    details.riskPenalty != null && { label: 'Risk Cezası', value: `−${details.riskPenalty}`, highlight: false },
  ].filter(Boolean) as { label: string; value: string; highlight: boolean }[]

  return (
    <div style={{
      background: '#0d0d0d',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '28px',
      marginBottom: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle glow behind grade */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ color: '#e8ff00', fontSize: 12 }}>◈</span>
        <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, fontWeight: 600 }}>SCORECARD</div>
      </div>

      {/* Main row: gauge + grade + sub-bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center', marginBottom: 24 }}>

        {/* Gauge + grade */}
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <ArcGauge value={overall} size={120} stroke={8} color={color} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', paddingTop: 8,
          }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 26, fontWeight: 400, color, lineHeight: 1 }}>
              <AnimatedNumber target={overall} decimals={0} />
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: color + 'aa', letterSpacing: 1, marginTop: 2 }}>
              {grade}
            </div>
          </div>
        </div>

        {/* Sub-bars */}
        <div style={{ paddingTop: 4 }}>
          {subBars.map(b => (
            <SubBar key={b.label} label={b.label} value={b.value} color={b.color} />
          ))}
        </div>
      </div>

      {/* Detail pills */}
      {pills.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 8,
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          {pills.map(p => (
            <DetailPill key={p.label} label={p.label} value={p.value} highlight={p.highlight} />
          ))}
        </div>
      )}
    </div>
  )
}
