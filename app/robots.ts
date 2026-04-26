import type { MetadataRoute } from 'next';

const BASE = 'https://www.3letterdaily.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
