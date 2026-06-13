import type { Metadata } from 'next';
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const body = Hanken_Grotesk({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wwxd.chat'),
  title: 'wwxd — what would x do?',
  description:
    'Chat with an AI impression of anyone — founders, presidents, philosophers, your favorite comedian. Open source. Self-hosted.',
  openGraph: {
    title: 'wwxd — what would x do?',
    description:
      'Chat with an AI impression of anyone, then drop a few in a room together and let them argue it out.',
    type: 'website',
    url: '/',
    siteName: 'wwxd',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'wwxd — chat with an AI impression of anyone. Drop a few in a room together and let them argue it out.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'wwxd — what would x do?',
    description:
      'Chat with an AI impression of anyone, then drop a few in a room together and let them argue it out.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
