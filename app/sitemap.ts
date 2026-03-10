import { MetadataRoute } from 'next'
import fundsData from '../public/funds.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const funds = (fundsData as any[]).filter((f: any) => f.code)
  const fundUrls = funds.map((f: any) => ({
    url: `https://fonar.com.tr/fon/${f.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  return [
    {
      url: 'https://fonar.com.tr',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...fundUrls,
  ]
}
