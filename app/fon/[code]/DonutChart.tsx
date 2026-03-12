'use client'
import { useState } from 'react'

const COLORS = ['#e8ff00','#00f080','#00b8d4','#ff6b6b','#ff9800','#b388ff','#f06292','#80cbc4']

export default function DonutChart({ items }: { items: any[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const total = items.reduce((s, i) => s + (i.value || 0), 0)
  let cumAngle = -90
  const slices = items.map((item, idx) => {
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

  const activeSlice = hovered !== null ? slices[hovered] : slices[0]

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 24, fontWeight: 600 }}>PORTFÖY DAĞILIMI</div>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        <svg width={180} height={180} viewBox="0 0 180 180" style={{ flexShrink: 0 }}>
          {slices.map((slice, i) => (
            <path
              key={i}
              d={describeArc(90, 90, 80, slice.startAngle, slice.endAngle - 0.3)}
              fill={slice.color}
              opacity={hovered === null || hovered === i ? 0.85 : 0.3}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s', transformOrigin: '90px 90px', transform: hovered === i ? 'scale(1.06)' : 'scale(1)' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <circle cx={90} cy={90} r={48} fill="#0f0f0f" style={{ pointerEvents: 'none' }} />
          <text x={90} y={82} textAnchor="middle" fill="#555" fontSize={10} fontFamily="DM Mono, monospace">
            {hovered !== null ? activeSlice.name?.split(' ')[0] : `${items.length} varlık`}
          </text>
          <text x={90} y={100} textAnchor="middle" fill={hovered !== null ? activeSlice.color : '#888'} fontSize={14} fontWeight="600" fontFamily="DM Mono, monospace">
            {activeSlice?.value?.toFixed(1)}%
          </text>
        </svg>
        <div style={{ flex: 1, minWidth: 200 }}>
          {slices.map((slice, i) => (
            <div key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', opacity: hovered === null || hovered === i ? 1 : 0.4, transition: 'opacity 0.2s' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: slice.color, flexShrink: 0, transform: hovered === i ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s' }} />
              <div style={{ flex: 1, fontSize: 13, color: hovered === i ? '#f5f5f5' : '#888', transition: 'color 0.2s' }}>{slice.name}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: hovered === i ? slice.color : '#f5f5f5', fontWeight: hovered === i ? 700 : 400, transition: 'color 0.2s' }}>{slice.value?.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
