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
  
  // [핵심] 여기에 매니페스트 파일을 연결합니다.
  manifest: '/manifest.json',

  // 아이콘 설정도 app-logo.png로 통일합니다.
  icons: {
    icon: '/app-logo.png',
    shortcut: '/app-logo.png',
    apple: '/app-logo.png',
  },
  openGraph: {
    title: 'Free Canadian Retirement Calculator (No Email Needed)',
    description: 'Instantly estimate your CPP, OAS, and Pension for 2026. Know your retirement income in 60 seconds. Private & Secure.',
    url: 'https://retireminute.ca',
    siteName: 'RetireMinute',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_CA',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
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