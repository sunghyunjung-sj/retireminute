/**
 * Sitemap generation for SEO
 * Next.js App Router automatically serves this at /sitemap.xml
 */

export default function sitemap() {
  const baseUrl = 'https://retire-minute-ca.vercel.app';
  
  // 현재 날짜
  const currentDate = new Date();
  
  // 사이트맵에 포함할 페이지들
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // 추가 페이지가 있다면 아래와 같이 추가하세요
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];

  return routes;
}
