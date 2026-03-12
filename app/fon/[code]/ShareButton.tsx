'use client'

export default function ShareButton({ fund }: { fund: any }) {
  const handleShare = async () => {
    const monthly = fund.monthlyReturn != null ? `${fund.monthlyReturn >= 0 ? '+' : ''}${fund.monthlyReturn.toFixed(2)}%` : '—'
    const yearly = fund.yearlyReturn != null ? `${fund.yearlyReturn >= 0 ? '+' : ''}${fund.yearlyReturn.toFixed(2)}%` : '—'
    const text = `${fund.code} — ${fund.name}\n\nAylık: ${monthly} | Yıllık: ${yearly}\nRisk: ${fund.riskScore}/7\n\nDetaylı analiz 👇`
    const url = `https://fonar.com.tr/fon/${fund.code?.toLowerCase()}`

    if (navigator.share) {
      try {
        await navigator.share({ title: `${fund.code} Fon Analizi`, text, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Link kopyalandı!')
    }
  }

  return (
    <button onClick={handleShare} style={{
      background: 'rgba(232,255,0,0.08)', border: '1px solid rgba(232,255,0,0.2)',
      borderRadius: 10, padding: '9px 18px', color: '#e8ff00', fontSize: 13,
      fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
      transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
    }}
      onMouseOver={e => { e.currentTarget.style.background = 'rgba(232,255,0,0.15)'; e.currentTarget.style.borderColor = 'rgba(232,255,0,0.4)' }}
      onMouseOut={e => { e.currentTarget.style.background = 'rgba(232,255,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,255,0,0.2)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Analizi Paylaş
    </button>
  )
}
