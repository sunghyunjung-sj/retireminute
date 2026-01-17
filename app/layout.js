/**
 * [수정됨] 아이콘 경로를 명시적으로 지정한 버전입니다.
 * public/icon.png 파일이 존재해야 합니다.
 */

export const metadata = {
  metadataBase: new URL('https://retire-minute-ca.vercel.app'), 
  title: {
    default: "RetireMinute Canada | 60-Second Retirement Calculator",
    template: "%s | RetireMinute Canada",
  },
  description: "Estimate your monthly retirement income in Canada. Calculate CPP/QPP, OAS, and workplace pensions in just 60 seconds with inflation-adjusted results. Free retirement planning calculator for Canadians.",
  keywords: [
    "Canada Retirement Calculator",
    "CPP Calculator",
    "OAS Calculator", 
    "QPP Calculator",
    "Pension Estimate Canada",
    "RetireMinute",
    "Financial Planning Canada",
    "Canadian Retirement Income",
    "Retirement Planning Tool"
  ],
  authors: [{ name: "RetireMinute Canada" }],
  
  // [중요] 아이콘 경로 강제 지정
  // public 폴더 안에 icon.png 파일이 있어야 합니다.
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },

  manifest: '/manifest.json',

  openGraph: {
    title: "RetireMinute Canada - Smart Retirement Planning",
    description: "Complex Canadian pension calculations made simple. Get your retirement estimate in 60 seconds with inflation-adjusted results.",
    url: "/",
    siteName: "RetireMinute Canada",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: '/icon.png', // 소셜 미디어 공유 시에도 이 아이콘 사용
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RetireMinute Canada | 60-Second Retirement Calculator",
    description: "Planning for retirement in Canada? Get a quick estimate of your future monthly income now.",
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Finance",
};

export const viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        {/* 모바일 앱 설정 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body 
        className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased" 
        suppressHydrationWarning
      >
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        <footer className="py-10 px-6 border-t border-slate-900 bg-slate-950 w-full">
          <div className="max-w-md mx-auto text-[10px] text-slate-600 leading-relaxed text-center space-y-3">
            <p>
              <strong>LEGAL DISCLAIMER:</strong> RetireMinute Canada is an independent tool provided for informational and educational purposes only. It is not intended to provide, and should not be relied upon for, financial, investment, legal, or tax advice. 
            </p>
            <p>
              Calculations are estimates based on current Canadian pension legislation (CPP/QPP, OAS) and user-provided inputs. Actual benefits may vary. Consult with a certified professional before making any financial decisions.
            </p>
            <p className="pt-2 text-slate-700 font-medium">
              © {new Date().getFullYear()} RetireMinute Canada. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}