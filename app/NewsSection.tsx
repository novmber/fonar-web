import newsData from '../public/news.json'

export default function NewsSection() {
  const news = (newsData as any[]).slice(0, 6)
  if (!news.length) return null

  const sourceColor: Record<string, string> = {
    'Bloomberg HT': '#ff9800',
    'Para Analiz': '#3A86FF',
    'Ekonomim': '#00f080',
    'Dünya Gazetesi': '#b388ff',
  }

  return (
    <section style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 5%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ color: '#e8ff00', fontSize: 14 }}>✦</span>
        <div style={{ fontSize: 11, color: '#555', letterSpacing: 1, fontWeight: 600 }}>PİYASA HABERLERİ</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ fontSize: 11, color: '#333' }}>Her 3 saatte güncellenir</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {news.map((item: any, i: number) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, transition: 'border-color 0.2s, background 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = '#0f0f0f' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#0a0a0a' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: sourceColor[item.source] || '#666', fontWeight: 600, letterSpacing: 0.5 }}>
                {item.source.toUpperCase()}
              </span>
              <span style={{ fontSize: 10, color: '#333', fontFamily: 'DM Mono, monospace' }}>{item.date?.slice(5,16)}</span>
            </div>
            <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5, fontWeight: 500 }}>{item.title}</div>
            {item.description && (
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.6 }}>
                {item.description.replace(/&#\d+;/g, '').slice(0, 120)}...
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#444', marginTop: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Habere git
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
