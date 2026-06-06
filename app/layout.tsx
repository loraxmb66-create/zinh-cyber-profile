import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEON SUPPLY | Nguyen lieu, phu kien va san pham so',
  description: 'Website thuong mai dien tu dark mode cho nguyen lieu, vat lieu, phu kien va san pham so.',
  keywords: ['NEON SUPPLY', 'nguyen lieu', 'phu kien', 'san pham so', 'ecommerce'],
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'NEON SUPPLY',
    description: 'Premium commerce for materials, accessories and digital products.',
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
