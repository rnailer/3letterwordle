import type { MetadataRoute } from 'next';

const BASE = 'https://www.3letterdaily.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`,        lastModified: now, changeFrequency: 'daily',  priority: 1.0 },
    { url: `${BASE}/play`,    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
