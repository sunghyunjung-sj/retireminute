/**
 * Robots.txt generation for search engine crawlers
 * Next.js App Router automatically serves this at /robots.txt
 */

export default function robots() {
  const baseUrl = 'https://retire-minute-ca.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/private/'], // API 경로나 비공개 페이지가 있다면 차단
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
