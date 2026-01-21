import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const GA_MEASUREMENT_ID = 'G-1P3MY301RZ';

export const metadata = {
  metadataBase: new URL('https://retireminute.ca'),
  // [SEO 마케팅 수정] 호기심 자극 및 클릭 유도형 제목
  title: {
    default: 'Am I On Track? - Free Canadian Retirement Calc (No Email)',
    template: '%s | RetireMinute'
  },
  // [SEO 마케팅 수정] 불안 해소 및 프라이버시 강조
  description: 'Will I run out of money? Check your retirement score in 60 seconds. No login, no data collection. 100% Private.',
  manifest: '/manifest.json',
  
  // 파비콘 설정
  icons: {
    icon: [
      { url: '/icon.png?v=100', type: 'image/png' },
      { url: '/favicon.ico?v=100', sizes: 'any' }
    ],
    apple: [
      { url: '/icon.png?v=100', sizes: '180x180', type: 'image/png' }
    ],
  },

  // Open Graph 설정
  openGraph: {
    title: 'Am I On Track? - Free Canadian Retirement Calc (No Email)',
    description: 'Will I run out of money? Check your retirement score in 60 seconds. No login, no data collection. 100% Private.',
    url: 'https://retireminute.ca',
    siteName: 'RetireMinute',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RetireMinute - Canada Retirement Calculator',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },

  // Twitter 설정
  twitter: {
    card: 'summary_large_image',
    title: 'Am I On Track? - Free Canadian Retirement Calc (No Email)',
    description: 'Will I run out of money? Check your retirement score in 60 seconds. No login, no data collection. 100% Private.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* 브라우저 캐시 강제 갱신용 링크 태그 */}
        <link rel="icon" href="/icon.png?v=100" />
        
        <script src="https://cdn.tailwindcss.com"></script>
        
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}