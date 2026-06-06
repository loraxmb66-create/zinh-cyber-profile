import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LORAX HUB | Everything Connected',
  description: 'Professional IT dashboard for AI chat, short links, QR, file upload, analytics, API status, FiveM and Telegram management.',
  keywords: ['LORAX HUB', 'AI chat', 'URL shortener', 'QR generator', 'IT toolkit', 'dashboard'],
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'LORAX HUB',
    description: 'Everything Connected. Everything Under Control.',
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
