import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const GA_MEASUREMENT_ID = 'G-1P3MY301RZ';

export const metadata = {
  metadataBase: new URL('https://retireminute.ca'),
  title: {
    default: 'RetireMinute | 2026 Canada Retirement Calculator (CPP/OAS)',
    template: '%s | RetireMinute'
  },
  description: 'Instantly estimate your CPP, OAS, and Pension for 2026. Know your retirement income in 60 seconds. Private & Secure.',
  manifest: '/manifest.json',
  // [파비콘 좀비 퇴치 설정]
  // ?v=100 처럼 아주 높은 버전을 붙여서 브라우저의 기존 기억을 완전히 무력화합니다.
  icons: {
    icon: [
      { url: '/icon.png?v=100', type: 'image/png' },
      { url: '/favicon.ico?v=100', sizes: 'any' }
    ],
    apple: [
      { url: '/icon.png?v=100', sizes: '180x180', type: 'image/png' }
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* 브라우저가 헷갈리지 않게 head 안에서도 한 번 더 강제로 찍어줍니다. */}
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